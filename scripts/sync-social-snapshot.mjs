import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'assets', 'data', 'generated', 'social-live-snapshot.json');

async function loadEnvFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      if (!line || /^\s*#/.test(line) || !line.includes('=')) return;
      const index = line.indexOf('=');
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (key && !(key in process.env)) process.env[key] = value;
    });
  } catch {
    // ignore missing env files
  }
}

function fallback(reason) {
  return {
    integrationId: 'unified-social',
    available: false,
    status: 'Demo Fallback',
    state: 'demo-fallback',
    source: 'UnifiedSocialProvider',
    reason,
    checkedAt: new Date().toISOString(),
    notes: 'Set SOCIAL_SNAPSHOT_SOURCE to a local JSON file to stage Instagram, Facebook, LinkedIn, and X snapshot data without adding browser-side secrets or backend APIs.',
    platforms: {}
  };
}

async function main() {
  await loadEnvFile(path.join(root, '.env'));
  await loadEnvFile(path.join(root, '.env.local'));

  const sourcePath = process.env.SOCIAL_SNAPSHOT_SOURCE;
  let snapshot = null;

  if (!sourcePath) {
    snapshot = fallback('Missing required SOCIAL_SNAPSHOT_SOURCE.');
  } else {
    try {
      const resolvedPath = path.isAbsolute(sourcePath) ? sourcePath : path.resolve(root, sourcePath);
      const raw = await fs.readFile(resolvedPath, 'utf8');
      const parsed = JSON.parse(raw);
      snapshot = {
        integrationId: 'unified-social',
        available: Boolean(parsed.available ?? true),
        status: parsed.status || 'Live social snapshot',
        state: parsed.state || 'live-social',
        source: parsed.source || 'UnifiedSocialProvider',
        reason: parsed.reason || '',
        checkedAt: new Date().toISOString(),
        syncedAt: parsed.syncedAt || new Date().toISOString(),
        notes: parsed.notes || 'Unified social snapshot staged from a local JSON source file.',
        platforms: parsed.platforms || {},
        attribution: parsed.attribution || null,
        competitorBenchmark: parsed.competitorBenchmark || null,
        meta: {
          sourcePath: resolvedPath,
          ...(parsed.meta || {})
        }
      };
    } catch (error) {
      snapshot = fallback(`Failed to load SOCIAL_SNAPSHOT_SOURCE: ${error.message}`);
    }
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(snapshot, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
