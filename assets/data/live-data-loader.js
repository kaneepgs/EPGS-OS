const GA4_SNAPSHOT_PATH = new URL('./generated/ga4-live-snapshot.json', import.meta.url);
const YOUTUBE_SNAPSHOT_PATH = new URL('./generated/youtube-live-snapshot.json', import.meta.url);
const GMAIL_SNAPSHOT_PATH = new URL('./generated/gmail-live-snapshot.json', import.meta.url);
const CALENDAR_SNAPSHOT_PATH = new URL('./generated/calendar-live-snapshot.json', import.meta.url);

function fallbackSnapshot(reason = 'Generated GA4 snapshot not found. Demo fallback remains active.') {
  return {
    integrationId: 'google-analytics',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'Run npm run ga4:sync after adding credentials to enable live website analytics data.'
  };
}

export async function loadGeneratedGa4Snapshot() {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const response = await fetch(GA4_SNAPSHOT_PATH, { cache: 'no-store' });
      if (!response.ok) return fallbackSnapshot(`Snapshot request returned ${response.status}.`);
      return response.json();
    }

    const { readFile } = await import('node:fs/promises');
    const raw = await readFile(GA4_SNAPSHOT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return fallbackSnapshot('Generated GA4 snapshot not found. Demo fallback remains active.');
    }
    if (error instanceof SyntaxError) {
      return fallbackSnapshot('Generated GA4 snapshot could not be parsed. Demo fallback remains active.');
    }
    return fallbackSnapshot('GA4 snapshot loading failed. Demo fallback remains active.');
  }
}

function fallbackYouTubeSnapshot(reason = 'Generated YouTube snapshot not found. Demo fallback remains active.') {
  return {
    integrationId: 'youtube',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'Run npm run youtube:sync after adding a YouTube API key and channel ID to enable live channel data.'
  };
}

export async function loadGeneratedYouTubeSnapshot() {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const response = await fetch(YOUTUBE_SNAPSHOT_PATH, { cache: 'no-store' });
      if (!response.ok) return fallbackYouTubeSnapshot(`Snapshot request returned ${response.status}.`);
      return response.json();
    }

    const { readFile } = await import('node:fs/promises');
    const raw = await readFile(YOUTUBE_SNAPSHOT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return fallbackYouTubeSnapshot('Generated YouTube snapshot not found. Demo fallback remains active.');
    }
    if (error instanceof SyntaxError) {
      return fallbackYouTubeSnapshot('Generated YouTube snapshot could not be parsed. Demo fallback remains active.');
    }
    return fallbackYouTubeSnapshot('YouTube snapshot loading failed. Demo fallback remains active.');
  }
}


function fallbackGmailSnapshot(reason = 'Generated Gmail snapshot not found. Demo fallback remains active.') {
  return {
    integrationId: 'gmail',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'Run npm run gmail:sync after adding Gmail OAuth credentials to enable live executive inbox data.'
  };
}

export async function loadGeneratedGmailSnapshot() {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const response = await fetch(GMAIL_SNAPSHOT_PATH, { cache: 'no-store' });
      if (!response.ok) return fallbackGmailSnapshot(`Snapshot request returned ${response.status}.`);
      return response.json();
    }

    const { readFile } = await import('node:fs/promises');
    const raw = await readFile(GMAIL_SNAPSHOT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return fallbackGmailSnapshot('Generated Gmail snapshot not found. Demo fallback remains active.');
    }
    if (error instanceof SyntaxError) {
      return fallbackGmailSnapshot('Generated Gmail snapshot could not be parsed. Demo fallback remains active.');
    }
    return fallbackGmailSnapshot('Gmail snapshot loading failed. Demo fallback remains active.');
  }
}

function fallbackCalendarSnapshot(reason = 'Generated Calendar snapshot not found. Demo fallback remains active.') {
  return {
    integrationId: 'google-calendar',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'MockProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'Run npm run calendar:sync after adding Google Calendar OAuth credentials to enable live operations calendar data.'
  };
}

export async function loadGeneratedCalendarSnapshot() {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const response = await fetch(CALENDAR_SNAPSHOT_PATH, { cache: 'no-store' });
      if (!response.ok) return fallbackCalendarSnapshot(`Snapshot request returned ${response.status}.`);
      return response.json();
    }

    const { readFile } = await import('node:fs/promises');
    const raw = await readFile(CALENDAR_SNAPSHOT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return fallbackCalendarSnapshot('Generated Calendar snapshot not found. Demo fallback remains active.');
    }
    if (error instanceof SyntaxError) {
      return fallbackCalendarSnapshot('Generated Calendar snapshot could not be parsed. Demo fallback remains active.');
    }
    return fallbackCalendarSnapshot('Calendar snapshot loading failed. Demo fallback remains active.');
  }
}
