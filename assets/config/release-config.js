export const RELEASE_CONFIG = Object.freeze({
  productName: 'EP Intelligence',
  version: '1.1.0',
  releaseLabel: 'v1.1',
  codename: 'Marketing Intelligence',
  releaseDate: '2026-07-05',
  buildNumber: '2026.07.05.1',
  currentSprint: 'Sprint 11',
  environment: 'Demo',
  environmentDetail: 'Demo-first executive shell with selective GA4 and YouTube snapshot overlays when local generated data is available.',
  changelogPath: 'CHANGELOG.md',
  roadmapPath: 'Roadmap.md',
  sprintHistoryPath: 'changelog/CHANGELOG.md',
  principlesPath: 'PROJECT_PRINCIPLES.md'
});

export function releaseDisplayName() {
  return `${RELEASE_CONFIG.productName} ${RELEASE_CONFIG.releaseLabel}`;
}

export function releaseFullName() {
  return `${releaseDisplayName()} — ${RELEASE_CONFIG.codename}`;
}

export function buildReleaseWorkspace({ liveData = {} } = {}) {
  const activeOverlays = Object.entries(liveData)
    .filter(([, value]) => value?.available)
    .map(([key]) => {
      if (key === 'ga4') return 'GA4';
      if (key === 'youtube') return 'YouTube';
      return String(key).toUpperCase();
    });

  const overlayStatus = activeOverlays.length
    ? `${RELEASE_CONFIG.environment} with ${activeOverlays.join(' + ')} live overlay${activeOverlays.length > 1 ? 's' : ''}`
    : `${RELEASE_CONFIG.environment} only`;

  return Object.freeze({
    productName: RELEASE_CONFIG.productName,
    version: RELEASE_CONFIG.version,
    releaseLabel: RELEASE_CONFIG.releaseLabel,
    codename: RELEASE_CONFIG.codename,
    displayName: releaseDisplayName(),
    fullName: releaseFullName(),
    releaseDate: RELEASE_CONFIG.releaseDate,
    buildNumber: RELEASE_CONFIG.buildNumber,
    currentSprint: RELEASE_CONFIG.currentSprint,
    environment: RELEASE_CONFIG.environment,
    environmentDetail: RELEASE_CONFIG.environmentDetail,
    overlayStatus,
    activeOverlays,
    docs: {
      changelog: RELEASE_CONFIG.changelogPath,
      roadmap: RELEASE_CONFIG.roadmapPath,
      sprintHistory: RELEASE_CONFIG.sprintHistoryPath,
      principles: RELEASE_CONFIG.principlesPath
    }
  });
}
