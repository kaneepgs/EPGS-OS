import crypto from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'assets', 'data', 'generated');
const outFile = path.join(outDir, 'ga4-live-snapshot.json');
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GA4_API_BASE = 'https://analyticsdata.googleapis.com/v1beta';
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return null;
  const idx = trimmed.indexOf('=');
  return { key: trimmed.slice(0, idx).trim(), value: trimmed.slice(idx + 1).trim() };
}

async function loadEnv() {
  const candidateFiles = [
    process.env.GA4_ENV_FILE,
    path.join(rootDir, '.env.local'),
    path.join(rootDir, '.env')
  ].filter(Boolean);

  for (const file of candidateFiles) {
    try {
      const raw = await readFile(file, 'utf8');
      for (const line of raw.split(/\r?\n/)) {
        const parsed = parseEnvLine(line);
        if (!parsed) continue;
        if (!process.env[parsed.key]) process.env[parsed.key] = parsed.value;
      }
    } catch {
      // Ignore missing files and keep going.
    }
  }
}

function getEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

function getMultilineEnv(name, fallback = '') {
  return getEnv(name, fallback).replace(/\\n/g, '\n');
}

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatCount(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(Math.round(value));
}

function formatPercent(value, digits = 1) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

function formatDuration(seconds) {
  const safe = Math.max(0, Math.round(seconds || 0));
  const minutes = Math.floor(safe / 60);
  const remainingSeconds = safe % 60;
  return `${minutes}m ${String(remainingSeconds).padStart(2, '0')}s`;
}

function parseRowsToMap(rows = []) {
  const out = {};
  for (const row of rows) {
    const key = row.dimensionValues?.[0]?.value;
    const value = row.metricValues?.[0]?.value;
    if (key) out[key] = toNumber(value);
  }
  return out;
}

async function getAccessToken() {
  const clientEmail = getEnv('GA4_CLIENT_EMAIL');
  const privateKey = getMultilineEnv('GA4_PRIVATE_KEY');
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now
  };

  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claimSet))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = signer.sign(privateKey, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`
    })
  });

  if (!response.ok) {
    throw new Error(`GA4 token request failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function runReport(propertyId, accessToken, body) {
  const response = await fetch(`${GA4_API_BASE}/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`GA4 runReport failed (${response.status}): ${await response.text()}`);
  }

  return response.json();
}

function buildFallback(reason) {
  return {
    integrationId: 'google-analytics',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'Website Analytics will stay in Demo Mode until valid GA4 credentials are added and npm run ga4:sync is run again.'
  };
}

function buildSummary({ sessions, users, newUsers, returningUsers, bookings, enquiries, signups, bounceRate, sessionsDeltaPct, bookingsDeltaPct }) {
  const trafficDirection = sessionsDeltaPct >= 0 ? 'up' : 'down';
  const bookingDirection = bookingsDeltaPct >= 0 ? 'improving' : 'softening';
  return `Live GA4 data is active. Sessions are ${trafficDirection} ${Math.abs(sessionsDeltaPct).toFixed(1)}% versus the prior period, total users are ${formatCount(users)}, and booking conversion is ${bookingDirection}. The clearest next step is to keep improving traffic-to-enquiry pathways rather than treating attention alone as the win.`;
}

async function main() {
  await loadEnv();
  await mkdir(outDir, { recursive: true });

  const required = ['GA4_PROPERTY_ID', 'GA4_CLIENT_EMAIL', 'GA4_PRIVATE_KEY', 'GA4_PROJECT_ID'];
  const missing = required.filter((key) => !getEnv(key).trim());
  if (missing.length) {
    const payload = buildFallback(`Missing required GA4 configuration: ${missing.join(', ')}.`);
    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const propertyId = getEnv('GA4_PROPERTY_ID').trim();
    const accessToken = await getAccessToken();

    const currentTotals = await runReport(propertyId, accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ]
    });

    const priorTotals = await runReport(propertyId, accessToken, {
      dateRanges: [{ startDate: '56daysAgo', endDate: '29daysAgo' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'newUsers' }, { name: 'screenPageViews' }]
    });

    const dailyTraffic = await runReport(propertyId, accessToken, {
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }]
    });

    const primaryConversion = getEnv('PRIMARY_CONVERSION', 'fitting_booking').trim();
    const secondaryConversions = getEnv('SECONDARY_CONVERSIONS', 'enquiry_form,email_signup')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const eventNames = [primaryConversion, ...secondaryConversions].filter(Boolean);

    const events = eventNames.length
      ? await runReport(propertyId, accessToken, {
          dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              inListFilter: { values: eventNames }
            }
          }
        })
      : { rows: [] };

    const priorEvents = eventNames.length
      ? await runReport(propertyId, accessToken, {
          dateRanges: [{ startDate: '56daysAgo', endDate: '29daysAgo' }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              inListFilter: { values: eventNames }
            }
          }
        })
      : { rows: [] };

    const currentValues = currentTotals.rows?.[0]?.metricValues || [];
    const priorValues = priorTotals.rows?.[0]?.metricValues || [];
    const currentEventCounts = parseRowsToMap(events.rows || []);
    const priorEventCounts = parseRowsToMap(priorEvents.rows || []);

    const sessions = toNumber(currentValues[0]?.value);
    const users = toNumber(currentValues[1]?.value);
    const newUsers = toNumber(currentValues[2]?.value);
    const pageViews = toNumber(currentValues[3]?.value);
    const averageSessionDuration = toNumber(currentValues[4]?.value);
    const bounceRate = toNumber(currentValues[5]?.value) * 100;
    const previousSessions = Math.max(1, toNumber(priorValues[0]?.value));
    const previousUsers = Math.max(1, toNumber(priorValues[1]?.value));
    const returningUsers = Math.max(users - newUsers, 0);
    const bookings = currentEventCounts[primaryConversion] || 0;
    const enquiries = currentEventCounts.enquiry_form || 0;
    const signups = currentEventCounts.email_signup || 0;
    const priorBookings = Math.max(1, priorEventCounts[primaryConversion] || 1);
    const sessionsDeltaPct = ((sessions - previousSessions) / previousSessions) * 100;
    const usersDeltaPct = ((users - previousUsers) / previousUsers) * 100;
    const bookingsDeltaPct = ((bookings - priorBookings) / priorBookings) * 100;
    const conversionRate = sessions ? (bookings / sessions) * 100 : 0;

    const trafficRows = dailyTraffic.rows || [];
    const labels = trafficRows.map((row) => {
      const raw = row.dimensionValues?.[0]?.value || '';
      return `${raw.slice(6, 8)}/${raw.slice(4, 6)}`;
    });
    const trafficValues = trafficRows.map((row) => toNumber(row.metricValues?.[0]?.value));

    const payload = {
      integrationId: 'google-analytics',
      available: true,
      status: 'Live website analytics',
      state: 'live-website-analytics',
      source: 'Google Analytics Data API',
      propertyId,
      syncedAt: new Date().toISOString(),
      notes: 'Only Website Analytics is live in Sprint 8. The rest of EP Intelligence remains in Demo Mode.',
      meta: {
        sessions,
        users,
        newUsers,
        returningUsers,
        pageViews,
        averageSessionDuration,
        bounceRate,
        conversionRate,
        bookings,
        enquiries,
        signups,
        sessionsDeltaPct,
        usersDeltaPct,
        bookingsDeltaPct,
        primaryConversion,
        secondaryConversions
      },
      websiteAnalytics: {
        metrics: [
          ['Website Visitors', formatCount(users)],
          ['Sessions', formatCount(sessions)],
          ['Users', formatCount(users)],
          ['New Users', formatCount(newUsers)],
          ['Returning Visitors', formatCount(returningUsers)],
          ['Average Session Duration', formatDuration(averageSessionDuration)],
          ['Bounce Rate', formatPercent(bounceRate)],
          ['Conversion Rate', formatPercent(conversionRate)],
          ['Fitting Bookings', formatCount(bookings)],
          ['Contact Form Enquiries', formatCount(enquiries)],
          ['Email Sign-ups', formatCount(signups)]
        ],
        summary: buildSummary({ sessions, users, newUsers, returningUsers, bookings, enquiries, signups, bounceRate, sessionsDeltaPct, bookingsDeltaPct })
      },
      charts: {
        websiteTraffic: {
          type: 'line',
          labels,
          values: trafficValues,
          suffix: ''
        },
        websiteConversions: {
          type: 'bar',
          labels: ['Bookings', 'Contact Forms', 'Email Sign-ups'],
          values: [bookings, enquiries, signups],
          suffix: ''
        },
        websiteVisitorMix: {
          type: 'bar',
          labels: ['Users', 'New Users', 'Returning'],
          values: [users, newUsers, returningUsers],
          label: 'Visitor mix',
          suffix: ''
        }
      }
    };

    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
  } catch (error) {
    const payload = buildFallback(error?.message || 'Unknown GA4 sync error.');
    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
    process.exitCode = 1;
  }
}

main();
