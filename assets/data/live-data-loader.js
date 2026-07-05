const SNAPSHOT_PATH = new URL('./generated/ga4-live-snapshot.json', import.meta.url);

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
      const response = await fetch(SNAPSHOT_PATH, { cache: 'no-store' });
      if (!response.ok) return fallbackSnapshot(`Snapshot request returned ${response.status}.`);
      return response.json();
    }

    const { readFile } = await import('node:fs/promises');
    const raw = await readFile(SNAPSHOT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return fallbackSnapshot(error?.message || 'Unknown snapshot loading error.');
  }
}
