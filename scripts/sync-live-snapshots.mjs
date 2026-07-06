import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const jobs = [
  { key: 'ga4', label: 'Google Analytics 4', command: 'ga4:sync', file: 'assets/data/generated/ga4-live-snapshot.json' },
  { key: 'youtube', label: 'YouTube', command: 'youtube:sync', file: 'assets/data/generated/youtube-live-snapshot.json' },
  { key: 'social', label: 'Unified Social', command: 'social:sync', file: 'assets/data/generated/social-live-snapshot.json' },
  { key: 'gmail', label: 'Gmail', command: 'gmail:sync', file: 'assets/data/generated/gmail-live-snapshot.json' },
  { key: 'calendar', label: 'Google Calendar', command: 'calendar:sync', file: 'assets/data/generated/calendar-live-snapshot.json' }
];

function run(command) {
  return new Promise((resolve) => {
    const child = spawn('npm', ['run', command], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false
    });

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      resolve({ code, stderr });
    });

    child.on('error', (error) => {
      resolve({ code: 1, stderr: error.message });
    });
  });
}

async function readStatus(file) {
  try {
    const payload = JSON.parse(await readFile(file, 'utf8'));
    return {
      available: Boolean(payload.available),
      status: payload.status || payload.state || 'Unknown',
      syncedAt: payload.syncedAt || '',
      notes: payload.notes || payload.detail || ''
    };
  } catch {
    return {
      available: false,
      status: 'No snapshot',
      syncedAt: '',
      notes: 'Snapshot file was not generated.'
    };
  }
}

const results = [];

for (const job of jobs) {
  const result = await run(job.command);
  const status = await readStatus(job.file);
  results.push({
    key: job.key,
    label: job.label,
    exitCode: result.code,
    ...status
  });
}

console.log('EP Hub live snapshot sync summary');
for (const item of results) {
  const state = item.available ? 'LIVE' : 'DEMO';
  console.log(`- ${item.label}: ${state} · ${item.status}${item.syncedAt ? ` · ${item.syncedAt}` : ''}`);
}

// Deliberately do not fail the build when a provider is missing credentials.
// Missing providers produce safe demo-fallback snapshots instead.
