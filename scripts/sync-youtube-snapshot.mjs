import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'assets', 'data', 'generated');
const outFile = path.join(outDir, 'youtube-live-snapshot.json');
const historyFile = path.join(outDir, 'youtube-channel-history.json');
const API_BASE = 'https://www.googleapis.com/youtube/v3';
const DAY_MS = 24 * 60 * 60 * 1000;

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return null;
  const idx = trimmed.indexOf('=');
  return { key: trimmed.slice(0, idx).trim(), value: trimmed.slice(idx + 1).trim() };
}

async function loadEnv() {
  const candidateFiles = [
    process.env.YOUTUBE_ENV_FILE,
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
      // Ignore missing files and continue.
    }
  }
}

function getEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function compactNumber(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return '—';
  if (Math.abs(number) >= 1000000) return `${(number / 1000000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}M`;
  if (Math.abs(number) >= 1000) return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(Math.round(number));
}

function formatPercent(value, digits = 1) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return '—';
  return `${number >= 0 ? '+' : ''}${number.toFixed(digits)}%`;
}

function formatDateLabel(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function trimTitle(title = '', limit = 36) {
  const value = String(title || '').trim();
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
}

function performanceRating({ views = 0, engagementRate = 0 }) {
  if (views >= 100000 || engagementRate >= 7) return 'A';
  if (views >= 30000 || engagementRate >= 4) return 'B';
  return 'C';
}

function parseDurationSeconds(duration = '') {
  const match = String(duration).match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return 0;
  const [, hours, minutes, seconds] = match;
  return Number(hours || 0) * 3600 + Number(minutes || 0) * 60 + Number(seconds || 0);
}

function mapYouTubeError(message = '') {
  const value = String(message || 'Unknown YouTube sync error.');
  if (/quota/i.test(value)) return 'YouTube API quota exceeded. Demo fallback remains active.';
  if (/API key/i.test(value) || /keyInvalid/i.test(value) || /forbidden/i.test(value)) return 'YouTube API key rejected the request. Demo fallback remains active.';
  if (/channel/i.test(value) && /not found/i.test(value)) return 'Configured YouTube channel was not found. Demo fallback remains active.';
  return 'YouTube request failed. Demo fallback remains active.';
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`YouTube API ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function fetchChannelSnapshot({ apiKey, channelId }) {
  const channelUrl = new URL(`${API_BASE}/channels`);
  channelUrl.searchParams.set('part', 'snippet,statistics,contentDetails');
  channelUrl.searchParams.set('id', channelId);
  channelUrl.searchParams.set('key', apiKey);

  const channelData = await fetchJson(channelUrl);
  const channel = channelData.items?.[0];
  if (!channel) throw new Error('Configured YouTube channel not found.');

  const uploadsId = channel.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) throw new Error('Configured YouTube channel does not expose an uploads playlist.');

  const uploadsUrl = new URL(`${API_BASE}/playlistItems`);
  uploadsUrl.searchParams.set('part', 'snippet,contentDetails');
  uploadsUrl.searchParams.set('playlistId', uploadsId);
  uploadsUrl.searchParams.set('maxResults', '12');
  uploadsUrl.searchParams.set('key', apiKey);

  const uploads = await fetchJson(uploadsUrl);
  const videoIds = (uploads.items || [])
    .map((item) => item.contentDetails?.videoId)
    .filter(Boolean);

  const videos = [];
  if (videoIds.length) {
    const videosUrl = new URL(`${API_BASE}/videos`);
    videosUrl.searchParams.set('part', 'snippet,statistics,contentDetails');
    videosUrl.searchParams.set('id', videoIds.join(','));
    videosUrl.searchParams.set('key', apiKey);

    const videosData = await fetchJson(videosUrl);
    for (const item of videosData.items || []) {
      const views = toNumber(item.statistics?.viewCount);
      const likes = toNumber(item.statistics?.likeCount);
      const comments = toNumber(item.statistics?.commentCount);
      const engagement = likes + comments;
      const engagementRate = views ? (engagement / views) * 100 : 0;
      videos.push({
        id: item.id,
        title: item.snippet?.title || 'Untitled video',
        publishedAt: item.snippet?.publishedAt || null,
        views,
        likes,
        comments,
        engagement,
        engagementRate,
        durationSeconds: parseDurationSeconds(item.contentDetails?.duration || '')
      });
    }
  }

  return {
    channel: {
      channelId,
      channelTitle: channel.snippet?.title || 'YouTube',
      subscribers: toNumber(channel.statistics?.subscriberCount),
      totalViews: toNumber(channel.statistics?.viewCount),
      videoCount: toNumber(channel.statistics?.videoCount)
    },
    videos
  };
}

async function loadHistory() {
  try {
    const raw = await readFile(historyFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function upsertHistory(history = [], current) {
  const dayKey = new Date(current.syncedAt).toISOString().slice(0, 10);
  const normalized = history.filter((entry) => entry && entry.channelId === current.channelId);
  const existingIndex = normalized.findIndex((entry) => String(entry.syncedAt || '').slice(0, 10) === dayKey);
  if (existingIndex >= 0) normalized[existingIndex] = current;
  else normalized.push(current);
  return normalized.sort((a, b) => new Date(a.syncedAt).getTime() - new Date(b.syncedAt).getTime()).slice(-90);
}

function findBaseline(history = [], currentTs, days = 28) {
  const target = currentTs - days * DAY_MS;
  const older = history.filter((entry) => new Date(entry.syncedAt).getTime() <= target);
  if (older.length) return older[older.length - 1];
  return history[0] || null;
}

function buildFallback(reason) {
  return {
    integrationId: 'youtube',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'YouTube will stay in Demo Mode until a valid API key and channel ID are added and npm run youtube:sync is run again.'
  };
}

function buildSummary({ channelTitle, viewsLast28Days, subscribersGained, channelGrowthPct, uploadsLast28Days, historyCoverageLabel }) {
  return `Live YouTube data is active for ${channelTitle}. Tracked visibility is ${compactNumber(viewsLast28Days)} views over the active ${historyCoverageLabel.toLowerCase()}, subscriber movement is ${subscribersGained >= 0 ? '+' : ''}${compactNumber(subscribersGained)}, and ${uploadsLast28Days} recent upload${uploadsLast28Days === 1 ? '' : 's'} are shaping current momentum.`;
}

async function main() {
  await loadEnv();
  await mkdir(outDir, { recursive: true });

  const required = ['YOUTUBE_API_KEY', 'YOUTUBE_CHANNEL_ID'];
  const missing = required.filter((key) => !getEnv(key).trim());
  if (missing.length) {
    const payload = buildFallback(`Missing required YouTube configuration: ${missing.join(', ')}.`);
    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const apiKey = getEnv('YOUTUBE_API_KEY').trim();
    const channelId = getEnv('YOUTUBE_CHANNEL_ID').trim();
    const fetched = await fetchChannelSnapshot({ apiKey, channelId });
    const syncedAt = new Date().toISOString();
    const currentHistoryEntry = {
      channelId,
      syncedAt,
      subscribers: fetched.channel.subscribers,
      totalViews: fetched.channel.totalViews,
      videoCount: fetched.channel.videoCount
    };

    const existingHistory = await loadHistory();
    const nextHistory = upsertHistory(existingHistory, currentHistoryEntry);
    await writeFile(historyFile, JSON.stringify(nextHistory, null, 2));

    const currentTs = new Date(syncedAt).getTime();
    const baseline = findBaseline(nextHistory, currentTs, 28);
    const baselineTs = baseline ? new Date(baseline.syncedAt).getTime() : currentTs;
    const historyCoverageDays = Math.max(0, Math.round((currentTs - baselineTs) / DAY_MS));
    const hasTrackedWindow = historyCoverageDays > 0;

    const recentUploads = [...fetched.videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const topVideos = [...fetched.videos].sort((a, b) => b.views - a.views);
    const uploadsLast28Days = recentUploads.filter((item) => currentTs - new Date(item.publishedAt).getTime() <= 28 * DAY_MS).length;
    const recentUploads28DayViews = recentUploads
      .filter((item) => currentTs - new Date(item.publishedAt).getTime() <= 28 * DAY_MS)
      .reduce((sum, item) => sum + item.views, 0);

    const subscribersGained = hasTrackedWindow ? fetched.channel.subscribers - (baseline?.subscribers || fetched.channel.subscribers) : 0;
    const viewsLast28Days = hasTrackedWindow
      ? Math.max(0, fetched.channel.totalViews - (baseline?.totalViews || fetched.channel.totalViews))
      : recentUploads28DayViews;
    const channelGrowthPct = baseline?.subscribers
      ? ((fetched.channel.subscribers - baseline.subscribers) / Math.max(1, baseline.subscribers)) * 100
      : 0;
    const averageViewsPerVideo = fetched.channel.videoCount ? fetched.channel.totalViews / fetched.channel.videoCount : 0;
    const recentEngagementTotal = recentUploads.slice(0, 8).reduce((sum, item) => sum + item.engagement, 0);
    const historyCoverageLabel = hasTrackedWindow
      ? historyCoverageDays >= 28
        ? 'Tracked 28-day window'
        : `Tracked ${historyCoverageDays}-day window`
      : 'First live sync';

    const payload = {
      integrationId: 'youtube',
      available: true,
      status: 'Live channel data',
      state: 'live-youtube',
      source: 'YouTube Data API v3',
      channelId,
      channelTitle: fetched.channel.channelTitle,
      syncedAt,
      notes: 'Only YouTube is live in Sprint 10. Other social platforms remain in Demo Mode until future providers are implemented.',
      meta: {
        subscribers: fetched.channel.subscribers,
        totalViews: fetched.channel.totalViews,
        videoCount: fetched.channel.videoCount,
        viewsLast28Days,
        subscribersGained,
        channelGrowthPct,
        averageViewsPerVideo,
        uploadsLast28Days,
        historyCoverageDays,
        historyCoverageLabel,
        recentEngagementTotal,
        recentUploadsCount: recentUploads.length,
        calculationMode: hasTrackedWindow ? 'tracked-channel-history' : 'recent-upload-proxy'
      },
      youtube: {
        stats: [
          ['Subscribers', compactNumber(fetched.channel.subscribers)],
          ['Total Views', compactNumber(fetched.channel.totalViews)],
          ['Views (28 days)', compactNumber(viewsLast28Days)],
          ['Videos Published', compactNumber(fetched.channel.videoCount)],
          ['Subscribers Gained', compactNumber(subscribersGained)],
          ['Average Views / Video', compactNumber(averageViewsPerVideo)],
          ['Audience Growth', formatPercent(channelGrowthPct)],
          ['Publishing Activity', `${uploadsLast28Days} upload${uploadsLast28Days === 1 ? '' : 's'} in last 28 days`],
          ['Tracked Window', historyCoverageLabel]
        ],
        summary: buildSummary({
          channelTitle: fetched.channel.channelTitle,
          viewsLast28Days,
          subscribersGained,
          channelGrowthPct,
          uploadsLast28Days,
          historyCoverageLabel
        }),
        topVideos: topVideos.slice(0, 5).map((item) => ({
          title: item.title,
          publishedAt: item.publishedAt,
          views: item.views,
          likes: item.likes,
          comments: item.comments,
          engagement: item.engagement,
          performance: performanceRating(item)
        })),
        recentUploads: recentUploads.slice(0, 5).map((item) => ({
          title: item.title,
          publishedAt: item.publishedAt,
          views: item.views,
          likes: item.likes,
          comments: item.comments,
          engagement: item.engagement,
          performance: performanceRating(item),
          type: item.durationSeconds <= 65 ? 'Short' : 'Video'
        }))
      },
      charts: {
        followers: {
          type: 'line',
          labels: nextHistory.slice(-7).map((entry) => formatDateLabel(entry.syncedAt)),
          values: nextHistory.slice(-7).map((entry) => toNumber(entry.subscribers)),
          suffix: ''
        },
        views: {
          type: 'line',
          labels: nextHistory.slice(-7).map((entry) => formatDateLabel(entry.syncedAt)),
          values: nextHistory.slice(-7).map((entry) => toNumber(entry.totalViews)),
          suffix: ''
        },
        engagement: {
          type: 'bar',
          labels: recentUploads.slice(0, 7).reverse().map((item) => trimTitle(item.title, 20)),
          values: recentUploads.slice(0, 7).reverse().map((item) => toNumber(item.engagement)),
          suffix: ''
        }
      },
      contentLibraryItems: recentUploads.slice(0, 5).map((item) => ({
        title: item.title,
        type: item.durationSeconds <= 65 ? 'Short' : 'Video',
        publishDate: String(item.publishedAt || '').slice(0, 10),
        platform: 'YouTube',
        views: compactNumber(item.views),
        engagement: compactNumber(item.engagement),
        rating: performanceRating(item)
      }))
    };

    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
  } catch (error) {
    const payload = buildFallback(mapYouTubeError(error?.message || 'Unknown YouTube sync error.'));
    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
    process.exitCode = 1;
  }
}

main();
