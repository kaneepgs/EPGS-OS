import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'assets', 'data', 'generated');
const outFile = path.join(outDir, 'calendar-live-snapshot.json');
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
const DEFAULT_CALENDAR_ID = 'primary';
const TIMEZONE = 'Europe/London';
const WORK_DAY_START_HOUR = 8;
const WORK_DAY_END_HOUR = 19;
const MIN_BOOKABLE_SLOT_MINUTES = 45;

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return null;
  const idx = trimmed.indexOf('=');
  return { key: trimmed.slice(0, idx).trim(), value: trimmed.slice(idx + 1).trim() };
}

async function loadEnv() {
  const candidateFiles = [
    process.env.CALENDAR_ENV_FILE,
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
      // Ignore missing files.
    }
  }
}

function getEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

function compactNumber(value = 0) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return '0';
  if (Math.abs(number) >= 1000) return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(Math.round(number));
}

function formatDateParts(date, timeZone = TIMEZONE) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`
  };
}

function dateOnlyInZone(date, timeZone = TIMEZONE) {
  return formatDateParts(date, timeZone).isoDate;
}

function startOfDayUtc(isoDate) {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function minutesBetween(start, end) {
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
}

function classifyEvent(summary = '', description = '', location = '') {
  const text = `${summary} ${description} ${location}`.toLowerCase();
  if (/holiday|leave|pto|annual leave|day off/.test(text)) return 'Holiday';
  if (/travel|pickup|dropoff|drive|airport|train/.test(text)) return 'Travel';
  if (/deadline|due|submit|renewal|approve|payment/.test(text)) return 'Deadline';
  if (/fitting|gapping|driver|iron|wedge|shaft|putter|launch monitor/.test(text)) return 'Fitting';
  return 'Meeting';
}

function inferCustomer(summary = '', type = '') {
  if (type !== 'Fitting') return '';
  const match = String(summary).match(/[-—:]\s*(.+)$/);
  return match ? match[1].trim() : '';
}

function eventBody(type, summary, location) {
  if (type === 'Fitting') return 'Customer appointment with direct commercial relevance.';
  if (type === 'Travel') return `Travel block${location ? ` affecting ${location}` : ''}.`;
  if (type === 'Deadline') return 'Timing-sensitive operational item that should stay visible in executive planning.';
  if (/executive|leadership|weekly operating cadence/i.test(summary)) return 'Executive coordination point with operational consequences.';
  return 'Operational meeting that affects schedule quality, capacity, or execution flow.';
}

function priorityForEvent(type, summary = '', isAllDay = false) {
  const text = String(summary).toLowerCase();
  if (type === 'Fitting') return 'High';
  if (/executive|leadership|urgent|renewal|supplier/.test(text)) return 'High';
  if (type === 'Deadline' || isAllDay) return 'Medium';
  if (type === 'Travel') return 'Low';
  return 'Medium';
}

function toScheduleItem(event, timeZone = TIMEZONE) {
  const isAllDay = Boolean(event.start?.date && !event.start?.dateTime);
  const start = event.start?.dateTime || `${event.start?.date}T00:00:00.000Z`;
  const end = event.end?.dateTime || `${event.end?.date}T00:00:00.000Z`;
  const startParts = formatDateParts(new Date(start), timeZone);
  const endParts = formatDateParts(new Date(isAllDay ? addDays(new Date(end), -1) : new Date(end)), timeZone);
  const type = classifyEvent(event.summary || '', event.description || '', event.location || '');
  const customer = inferCustomer(event.summary || '', type);
  const durationMinutes = isAllDay ? (WORK_DAY_END_HOUR - WORK_DAY_START_HOUR) * 60 : minutesBetween(start, end);
  return {
    id: event.id,
    title: event.summary || '(No title)',
    type,
    startAt: start,
    endAt: end,
    startTime: isAllDay ? 'All day' : startParts.time,
    endTime: isAllDay ? 'All day' : endParts.time,
    date: startParts.isoDate,
    durationMinutes,
    location: event.location || (event.hangoutLink ? 'Google Meet' : '—'),
    staff: event.organizer?.displayName || event.organizer?.email || 'EP Golf Studios',
    customer,
    priority: priorityForEvent(type, event.summary || '', isAllDay),
    status: event.status === 'cancelled' ? 'Cancelled' : event.responseStatus === 'declined' ? 'Declined' : 'Confirmed',
    body: eventBody(type, event.summary || '', event.location || ''),
    isAllDay,
    route: '/operations'
  };
}

async function getAccessToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: getEnv('GOOGLE_CALENDAR_CLIENT_ID').trim(),
      client_secret: getEnv('GOOGLE_CALENDAR_CLIENT_SECRET').trim(),
      refresh_token: getEnv('GOOGLE_CALENDAR_REFRESH_TOKEN').trim(),
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    throw new Error(`Calendar token request failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchJson(url, accessToken) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Calendar API ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function getCalendarMetadata({ calendarId, accessToken }) {
  const url = new URL(`${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}`);
  return fetchJson(url, accessToken);
}

async function listEvents({ calendarId, accessToken, timeMin, timeMax }) {
  const url = new URL(`${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`);
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('timeMin', timeMin);
  url.searchParams.set('timeMax', timeMax);
  url.searchParams.set('maxResults', '50');
  return fetchJson(url, accessToken);
}

function totalWorkMinutes() {
  return (WORK_DAY_END_HOUR - WORK_DAY_START_HOUR) * 60;
}

function utilisation(events = []) {
  const used = events.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0);
  return Math.min(100, Math.round((used / totalWorkMinutes()) * 100));
}

function buildCapacitySlots(todayEvents = []) {
  const sorted = todayEvents
    .filter((item) => !item.isAllDay)
    .slice()
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

  const day = todayEvents[0]?.date || dateOnlyInZone(new Date());
  const slots = [];
  let pointer = new Date(`${day}T${String(WORK_DAY_START_HOUR).padStart(2, '0')}:00:00.000Z`);
  const dayEnd = new Date(`${day}T${String(WORK_DAY_END_HOUR).padStart(2, '0')}:00:00.000Z`);

  for (const event of sorted) {
    const eventStart = new Date(event.startAt);
    const gapMinutes = Math.round((eventStart.getTime() - pointer.getTime()) / 60000);
    if (gapMinutes >= MIN_BOOKABLE_SLOT_MINUTES) {
      slots.push({
        id: `slot-${slots.length + 1}`,
        label: `${formatDateParts(pointer).time}–${formatDateParts(eventStart).time}`,
        duration: `${gapMinutes} mins`,
        suitability: gapMinutes >= 75 ? 'Premium fitting slot' : 'Short fitting / review slot',
        note: gapMinutes >= 75 ? 'Best booking window without adding compression.' : 'Useful for shorter revenue or follow-up work.'
      });
    }
    if (new Date(event.endAt) > pointer) pointer = new Date(event.endAt);
  }

  const endGap = Math.round((dayEnd.getTime() - pointer.getTime()) / 60000);
  if (endGap >= MIN_BOOKABLE_SLOT_MINUTES) {
    slots.push({
      id: `slot-${slots.length + 1}`,
      label: `${formatDateParts(pointer).time}–${formatDateParts(dayEnd).time}`,
      duration: `${endGap} mins`,
      suitability: endGap >= 75 ? 'Premium fitting slot' : 'Short fitting / review slot',
      note: endGap >= 75 ? 'Late-day booking capacity remains available.' : 'Small but still useful schedule gap.'
    });
  }

  return slots;
}

function buildStaffAvailability(todayEvents = [], calendarName = '') {
  const fittingCount = todayEvents.filter((item) => item.type === 'Fitting').length;
  const total = todayEvents.length;
  return [
    {
      id: 'staff-1',
      name: 'Lead fitter',
      role: calendarName || 'EP Golf Studios',
      availability: `${fittingCount} fitting${fittingCount === 1 ? '' : 's'} and ${total} total scheduled item${total === 1 ? '' : 's'} today.`,
      status: total >= 8 ? 'Tight' : 'Available',
      detail: total >= 8 ? 'Schedule is commercially healthy but should protect buffers.' : 'Schedule still has controlled room for more demand.'
    },
    {
      id: 'staff-2',
      name: 'Support coverage',
      role: 'Operations support',
      availability: todayEvents.some((item) => item.type === 'Travel') ? 'Travel or logistics support is visible today.' : 'Support coverage is not visibly constrained today.',
      status: todayEvents.some((item) => item.type === 'Travel') ? 'Conditional' : 'Available',
      detail: 'Use support coverage to protect bay turnover, handoffs, and meeting transitions.'
    }
  ];
}

function buildWeekCapacity(events = [], timeZone = TIMEZONE) {
  const byDay = new Map();
  for (const event of events.filter((item) => !item.isAllDay)) {
    const key = item.date || dateOnlyInZone(new Date(item.startAt), timeZone);
    byDay.set(key, [...(byDay.get(key) || []), item]);
  }
  return [...byDay.entries()].slice(0, 6).map(([date, dayEvents]) => ({
    day: new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone }).format(new Date(`${date}T12:00:00.000Z`)),
    utilisation: `${utilisation(dayEvents)}%`,
    note: utilisation(dayEvents) >= 90 ? 'Near full; protect buffers carefully.' : utilisation(dayEvents) <= 60 ? 'Under-utilised; room for more fitting demand.' : 'Healthy operating density.'
  }));
}

function buildApprovalCards(todayEvents = [], capacitySlots = []) {
  const lateFitting = todayEvents.find((item) => item.type === 'Fitting' && item.priority === 'High' && Number(item.durationMinutes || 0) >= 75);
  const meeting = todayEvents.find((item) => item.type === 'Meeting');
  return [
    lateFitting ? {
      id: `calendar-approval-reschedule-${lateFitting.id}`,
      title: `Reschedule appointment — ${lateFitting.title}`,
      why: 'This fitting currently sits inside the most compressed part of the day.',
      impact: 'Schedule quality / overtime protection',
      risk: 'Medium',
      confidence: 'High'
    } : null,
    lateFitting ? {
      id: `calendar-approval-extend-${lateFitting.id}`,
      title: `Extend fitting — ${lateFitting.title}`,
      why: 'A premium fitting may justify a slightly longer follow-up window if the conversion value remains high.',
      impact: 'Customer experience / conversion quality',
      risk: 'Low',
      confidence: 'Medium'
    } : null,
    capacitySlots[0] ? {
      id: 'calendar-approval-block-buffer',
      title: `Block calendar time — ${capacitySlots[0].label}`,
      why: 'Protecting one buffer slot can stop a busy day becoming a rushed day.',
      impact: 'Operational resilience',
      risk: 'Low',
      confidence: 'Medium'
    } : null,
    meeting ? {
      id: `calendar-approval-accept-${meeting.id}`,
      title: `Accept invitation — ${meeting.title}`,
      why: 'This meeting is operationally relevant and already shaping workload or supplier continuity.',
      impact: 'Coordination quality',
      risk: 'Low',
      confidence: 'Medium'
    } : null,
    meeting ? {
      id: `calendar-approval-decline-${meeting.id}`,
      title: 'Decline invitation — low-priority catch-up',
      why: 'A lower-value meeting should not steal one of the few clean operating gaps.',
      impact: 'Capacity preservation',
      risk: 'Low',
      confidence: 'Medium'
    } : null
  ].filter(Boolean);
}

function buildTimelineEvents(events = [], weekCapacity = []) {
  const todayFittings = events.filter((item) => item.type === 'Fitting');
  const executiveMeeting = events.find((item) => /executive|leadership/i.test(item.title));
  const holiday = events.find((item) => item.type === 'Holiday' || item.isAllDay);
  const highUtilDay = weekCapacity.find((item) => Number.parseInt(item.utilisation, 10) >= 90);
  return [
    todayFittings.length >= 4 ? {
      id: 'calendar-timeline-busy-day',
      date: events[0]?.date || dateOnlyInZone(new Date()),
      time: events[0]?.startTime || 'Today',
      title: 'Busy day reached',
      body: `${todayFittings.length} fittings are now visible in the live operating day.`,
      category: 'Operational milestone',
      department: 'Operations',
      impact: 'Medium',
      relatedEntities: ['goal-booking-conversion'],
      status: 'Active',
      route: '/operations'
    } : null,
    todayFittings[0] ? {
      id: `calendar-timeline-fitting-${todayFittings[0].id}`,
      date: todayFittings[0].date,
      time: todayFittings[0].startTime,
      title: 'Key customer fitting',
      body: `${todayFittings[0].title} is visible in the operating schedule.`,
      category: 'Customer appointment',
      department: 'Sales / Operations',
      impact: 'High',
      relatedEntities: ['goal-booking-conversion'],
      status: todayFittings[0].status,
      route: '/operations'
    } : null,
    executiveMeeting ? {
      id: `calendar-timeline-exec-${executiveMeeting.id}`,
      date: executiveMeeting.date,
      time: executiveMeeting.startTime,
      title: 'Executive meeting',
      body: `${executiveMeeting.title} is now shaping operating cadence.`,
      category: 'Executive meeting',
      department: 'Leadership / Operations',
      impact: 'Medium',
      relatedEntities: ['goal-booking-conversion'],
      status: executiveMeeting.status,
      route: '/operations'
    } : null,
    holiday ? {
      id: `calendar-timeline-holiday-${holiday.id}`,
      date: holiday.date,
      time: holiday.startTime,
      title: 'Staff holiday',
      body: `${holiday.title} is reducing optional operating flexibility.`,
      category: 'Staff holiday',
      department: 'HR / Operations',
      impact: 'Medium',
      relatedEntities: ['goal-booking-conversion'],
      status: holiday.status,
      route: '/operations'
    } : null,
    highUtilDay ? {
      id: 'calendar-timeline-utilisation',
      date: events[0]?.date || dateOnlyInZone(new Date()),
      time: 'This week',
      title: 'Record utilisation watchpoint',
      body: `${highUtilDay.day} is currently running at ${highUtilDay.utilisation} utilisation.`,
      category: 'Record utilisation',
      department: 'Operations',
      impact: 'High',
      relatedEntities: ['goal-booking-conversion'],
      status: 'Watchpoint',
      route: '/operations'
    } : null
  ].filter(Boolean);
}

function buildMemoryCandidates(events = []) {
  return events
    .filter((item) => item.type === 'Fitting' || /executive/i.test(item.title) || item.type === 'Holiday')
    .slice(0, 4)
    .map((item, index) => ({
      id: `calendar-memory-${index + 1}-${item.id}`,
      date: item.date,
      time: item.startTime,
      title: item.title,
      body: item.body,
      category: item.type === 'Fitting' ? 'Customer appointment' : item.type === 'Holiday' ? 'Operational milestone' : 'Executive meeting',
      department: item.type === 'Fitting' ? 'Sales / Operations' : item.type === 'Holiday' ? 'HR / Operations' : 'Leadership / Operations',
      impact: item.priority,
      relatedEntities: ['goal-booking-conversion'],
      status: item.status,
      route: '/operations'
    }));
}

function buildSearchIndex(allItems = [], deadlines = [], allDayEvents = []) {
  return [
    ...allItems.map((item) => ({
      id: `search-${item.id}`,
      type: 'Calendar event',
      title: item.title,
      body: [
        item.customer ? `Customer: ${item.customer}.` : '',
        `Location: ${item.location}.`,
        `${item.date} ${item.startTime}${item.endTime && item.endTime !== 'All day' ? `–${item.endTime}` : ''}.`,
        item.body
      ].filter(Boolean).join(' '),
      route: '/operations',
      meta: `${item.type} · ${item.location} · ${item.date}`
    })),
    ...deadlines.map((item) => ({
      id: `search-${item.id}`,
      type: 'Deadline',
      title: item.title,
      body: `Due ${item.due}. Owner: ${item.owner}. ${item.note}`,
      route: '/operations',
      meta: `Deadline · ${item.owner}`
    })),
    ...allDayEvents.map((item) => ({
      id: `search-${item.id}`,
      type: 'All-day event',
      title: item.title,
      body: `${item.date}. ${item.note}`,
      route: '/operations',
      meta: `All day · ${item.owner}`
    }))
  ];
}

function buildInsightCards({ todayUtilisation, weekUtilisation, backToBackCount, capacitySlots, totalFittings, schedulingRisks }) {
  return [
    {
      eyebrow: 'Fully booked days',
      title: weekUtilisation >= 90 ? 'A late-week day is close to full' : 'The week still has controlled room',
      body: weekUtilisation >= 90 ? 'At least one day is now close enough to full that buffer discipline matters.' : 'Capacity is healthy overall, with room to accept selective high-value demand.',
      tone: weekUtilisation >= 90 ? 'warn' : 'good'
    },
    {
      eyebrow: 'Free fitting opportunity',
      title: capacitySlots[0] ? `${capacitySlots[0].label} is the clearest open slot` : 'No clean booking slot remains today',
      body: capacitySlots[0] ? capacitySlots[0].note : 'Same-day fitting demand may now require rescheduling rather than simple insertion.',
      tone: capacitySlots[0] ? 'good' : 'warn'
    },
    {
      eyebrow: 'Back-to-back bookings',
      title: backToBackCount > 0 ? `${backToBackCount} compressed transition${backToBackCount === 1 ? '' : 's'} detected` : 'No back-to-back pressure detected',
      body: backToBackCount > 0 ? 'One or more transitions have under 20 minutes of breathing room.' : 'The current schedule keeps reasonable buffer between major items.',
      tone: backToBackCount > 0 ? 'risk' : 'info'
    },
    {
      eyebrow: 'Scheduling risks',
      title: `${schedulingRisks} scheduling risk${schedulingRisks === 1 ? '' : 's'} currently visible`,
      body: `Today utilisation is ${todayUtilisation}% with ${totalFittings} fitting${totalFittings === 1 ? '' : 's'} in view.`,
      tone: schedulingRisks > 1 ? 'warn' : 'info'
    }
  ];
}

function buildPayload({ calendarName, syncIntervalMinutes, todayItems, futureItems, allItems, metadata }) {
  const todayFittings = todayItems.filter((item) => item.type === 'Fitting');
  const upcomingMeetings = futureItems.filter((item) => item.type === 'Meeting').slice(0, 4);
  const travel = allItems.filter((item) => item.type === 'Travel').slice(0, 3).map((item) => ({
    id: item.id,
    title: item.title,
    time: item.isAllDay ? 'All day' : `${item.startTime}–${item.endTime}`,
    location: item.location,
    note: item.body
  }));
  const allDayEvents = allItems.filter((item) => item.isAllDay).slice(0, 4).map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    owner: item.staff,
    note: item.body
  }));
  const deadlines = allItems
    .filter((item) => item.type === 'Deadline')
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      title: item.title,
      due: item.isAllDay ? `${item.date} all day` : `${item.date} ${item.startTime}`,
      owner: item.staff,
      severity: item.priority,
      note: item.body
    }));
  const capacitySlots = buildCapacitySlots(todayItems);
  const todayUtilisation = utilisation(todayItems.filter((item) => !item.isAllDay));
  const weekCapacity = buildWeekCapacity(allItems);
  const weekUtilisation = Math.max(...weekCapacity.map((item) => Number.parseInt(item.utilisation, 10)), todayUtilisation);
  const backToBackCount = todayItems.filter((item, index, list) => {
    if (item.isAllDay || index === 0 || list[index - 1].isAllDay) return false;
    return minutesBetween(list[index - 1].endAt, item.startAt) <= 20;
  }).length;
  const overtimeRisk = todayItems.some((item) => !item.isAllDay && Number(formatDateParts(new Date(item.endAt)).hour) >= 18);
  const schedulingRisks = Number(todayUtilisation >= 85) + Number(backToBackCount > 0) + Number(overtimeRisk) + Number(weekUtilisation >= 90);
  const staffAvailability = buildStaffAvailability(todayItems, calendarName);
  const timelineEvents = buildTimelineEvents(allItems, weekCapacity);
  const memoryCandidates = buildMemoryCandidates(allItems);
  const approvalCards = buildApprovalCards(todayItems, capacitySlots);
  const metrics = {
    todaysSchedule: todayItems.length,
    totalMeetings: todayItems.filter((item) => item.type === 'Meeting').length,
    totalFittings: todayFittings.length,
    capacityTodayPct: todayUtilisation,
    capacityThisWeekPct: weekUtilisation,
    availableBookingSlots: capacitySlots.length,
    schedulingRisks,
    freeCapacityHours: Number((capacitySlots.reduce((sum, item) => sum + Number(item.duration.replace(/[^\d]/g, '') || 0), 0) / 60).toFixed(1)),
    backToBackCount,
    largeGaps: capacitySlots.filter((item) => Number(item.duration.replace(/[^\d]/g, '') || 0) >= 75).length,
    deadlines: deadlines.length,
    staffAvailable: staffAvailability.length
  };
  const nextAppointment = todayItems.find((item) => !item.isAllDay) || allItems.find((item) => !item.isAllDay);
  const firstAppointment = todayItems.find((item) => !item.isAllDay);
  const lastAppointment = [...todayItems].reverse().find((item) => !item.isAllDay);
  const insightCards = buildInsightCards({
    todayUtilisation,
    weekUtilisation,
    backToBackCount,
    capacitySlots,
    totalFittings: todayFittings.length,
    schedulingRisks
  });

  return {
    integrationId: 'google-calendar',
    available: true,
    status: 'Live operations calendar',
    state: 'live-calendar',
    source: 'Google Calendar API',
    calendarName,
    syncedAt: new Date().toISOString(),
    notes: 'Operations Calendar is live through generated Google Calendar snapshots. All scheduling actions remain approval-first and no calendar mutations execute automatically.',
    meta: {
      providerHealth: 'Healthy',
      syncIntervalMinutes,
      fetchedEventCount: allItems.length,
      todayItemCount: todayItems.length,
      weekUtilisation,
      timeZone: metadata.timeZone || TIMEZONE,
      scope: SCOPE,
      classificationVersion: 'calendar-provider-v1'
    },
    operations: {
      providerSummary: {
        label: 'Live Google Calendar snapshot active',
        tone: 'good'
      },
      summary: {
        headline: `Today includes ${metrics.totalFittings} fitting${metrics.totalFittings === 1 ? '' : 's'}, ${metrics.totalMeetings} meeting${metrics.totalMeetings === 1 ? '' : 's'}, and ${metrics.availableBookingSlots} open booking slot${metrics.availableBookingSlots === 1 ? '' : 's'}.`,
        body: `Capacity today is ${metrics.capacityTodayPct}% with ${metrics.schedulingRisks} scheduling risk${metrics.schedulingRisks === 1 ? '' : 's'} visible. ${metrics.deadlines} deadline${metrics.deadlines === 1 ? '' : 's'} and ${travel.length} travel block${travel.length === 1 ? '' : 's'} are also in scope.`,
        dailySummary: `Today's first appointment is ${firstAppointment ? `${firstAppointment.startTime} ${firstAppointment.title}` : 'not yet scheduled'}, the last is ${lastAppointment ? `${lastAppointment.endTime} after ${lastAppointment.title}` : 'not yet scheduled'}, with ${metrics.totalMeetings} meetings, ${metrics.totalFittings} fittings, ${metrics.availableBookingSlots} open booking slots, and ${metrics.schedulingRisks} scheduling risk${metrics.schedulingRisks === 1 ? '' : 's'}.`,
        boardSummary: `Operations capacity is ${metrics.capacityTodayPct}% today and ${metrics.capacityThisWeekPct}% at the busiest point this week. ${metrics.availableBookingSlots} open booking slot${metrics.availableBookingSlots === 1 ? '' : 's'} remain visible, while ${metrics.schedulingRisks} risk${metrics.schedulingRisks === 1 ? '' : 's'} should be watched.`
      },
      metrics,
      widgets: [
        { iconName: 'calendar', label: "Today's Schedule", value: `${metrics.todaysSchedule} items`, body: `${metrics.totalFittings} fittings and ${metrics.totalMeetings} meetings are visible today.`, meta: 'Operations' },
        { iconName: 'arrowRight', label: 'Next Appointment', value: nextAppointment ? `${nextAppointment.startTime} ${nextAppointment.title}` : 'None', body: nextAppointment?.location || 'No location available.', meta: nextAppointment?.customer || nextAppointment?.type || 'Calendar' },
        { iconName: 'pulse', label: 'Capacity Today', value: `${metrics.capacityTodayPct}%`, body: `${metrics.freeCapacityHours}h of visible free capacity remains in the operating day.`, meta: `${metrics.largeGaps} large gap${metrics.largeGaps === 1 ? '' : 's'}` },
        { iconName: 'grid', label: 'Capacity This Week', value: `${metrics.capacityThisWeekPct}%`, body: 'Peak utilisation across the currently visible operating week.', meta: `${weekCapacity.length} day window` },
        { iconName: 'target', label: 'Available Booking Slots', value: String(metrics.availableBookingSlots), body: 'Bookable windows that should not damage service quality.', meta: 'Booking opportunities' },
        { iconName: 'alert-triangle', label: 'Scheduling Risks', value: String(metrics.schedulingRisks), body: backToBackCount > 0 ? `${backToBackCount} compressed transition${backToBackCount === 1 ? '' : 's'} currently visible.` : 'No compressed transition is currently visible.', meta: overtimeRisk ? 'Late-day pressure' : 'Operational watchlist' }
      ],
      todaySchedule: todayItems,
      upcomingMeetings,
      staffAvailability,
      freeCapacity: capacitySlots,
      travel,
      deadlines,
      allDayEvents,
      weekCapacity,
      insightCards,
      approvalCards,
      timelineEvents,
      memoryCandidates,
      searchIndex: buildSearchIndex(allItems, deadlines, allDayEvents)
    }
  };
}

function mapCalendarError(message = '') {
  const value = String(message || 'Unknown Calendar sync error.');
  if (/invalid_grant|unauthorized_client|invalid_client/i.test(value)) return 'Google Calendar OAuth credentials were rejected. Demo fallback remains active.';
  if (/invalid_scope/i.test(value)) return 'Google Calendar OAuth scope is invalid. Demo fallback remains active.';
  if (/insufficient|forbidden|permission/i.test(value)) return 'Google Calendar OAuth credentials do not currently allow calendar access. Demo fallback remains active.';
  return 'Google Calendar request failed. Demo fallback remains active.';
}

function buildFallback(reason) {
  return {
    integrationId: 'google-calendar',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'Operations Calendar will stay in Demo Mode until valid Google Calendar OAuth credentials are added and npm run calendar:sync is run again.'
  };
}

async function main() {
  await loadEnv();
  await mkdir(outDir, { recursive: true });

  const required = ['GOOGLE_CALENDAR_CLIENT_ID', 'GOOGLE_CALENDAR_CLIENT_SECRET', 'GOOGLE_CALENDAR_REFRESH_TOKEN'];
  const missing = required.filter((key) => !getEnv(key).trim());
  if (missing.length) {
    const payload = buildFallback(`Missing required Google Calendar configuration: ${missing.join(', ')}.`);
    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const calendarId = getEnv('GOOGLE_CALENDAR_ID', DEFAULT_CALENDAR_ID).trim() || DEFAULT_CALENDAR_ID;
    const syncIntervalMinutes = Number(getEnv('GOOGLE_CALENDAR_SYNC_INTERVAL_MINUTES', '15')) || 15;
    const accessToken = await getAccessToken();
    const metadata = await getCalendarMetadata({ calendarId, accessToken });
    const today = dateOnlyInZone(new Date(), metadata.timeZone || TIMEZONE);
    const timeMin = `${today}T00:00:00.000Z`;
    const timeMax = addDays(new Date(timeMin), 7).toISOString();
    const eventsResponse = await listEvents({ calendarId, accessToken, timeMin, timeMax });
    const allItems = (eventsResponse.items || [])
      .filter((event) => event.status !== 'cancelled')
      .map((event) => toScheduleItem(event, metadata.timeZone || TIMEZONE))
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
    const todayItems = allItems.filter((item) => item.date === today);
    const futureItems = allItems.filter((item) => item.date !== today);
    const payload = buildPayload({
      calendarName: metadata.summary || calendarId,
      syncIntervalMinutes,
      todayItems,
      futureItems,
      allItems,
      metadata
    });

    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
  } catch (error) {
    const payload = buildFallback(mapCalendarError(error?.message || 'Unknown Calendar sync error.'));
    await writeFile(outFile, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
    process.exitCode = 1;
  }
}

main();
