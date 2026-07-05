import { deepClone, parseCompactNumber } from '../contracts/data-contracts.js';

const PLATFORM_KEYS = ['instagram', 'facebook', 'linkedin', 'x'];

function normalizeSnapshot(snapshot = {}) {
  return {
    integrationId: 'unified-social',
    available: Boolean(snapshot.available),
    status: snapshot.status || 'Demo Fallback',
    state: snapshot.state || 'demo-fallback',
    source: snapshot.source || 'MockProvider',
    reason: snapshot.reason || 'Live social snapshot unavailable.',
    checkedAt: snapshot.checkedAt || snapshot.syncedAt || null,
    syncedAt: snapshot.syncedAt || null,
    notes: snapshot.notes || '',
    platforms: snapshot.platforms || {},
    attribution: snapshot.attribution || null,
    competitorBenchmark: snapshot.competitorBenchmark || null,
    meta: snapshot.meta || {}
  };
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

function average(values = []) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function metricLookup(stats = []) {
  return Object.fromEntries(
    (stats || [])
      .filter((entry) => Array.isArray(entry) && entry.length >= 2)
      .map(([label, value]) => [String(label), value])
  );
}

function readStat(stats = [], labels = []) {
  const lookup = metricLookup(stats);
  for (const label of labels) {
    if (lookup[label] != null) return lookup[label];
  }
  return null;
}

function parsePercent(value, fallback = 0) {
  const source = String(value ?? '').replace(/,/g, '');
  const match = source.match(/-?\d+(?:\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : fallback;
}

function platformDisplay(platform = {}, key = '') {
  return platform.label || (key === 'x' ? 'X' : `${key.slice(0, 1).toUpperCase()}${key.slice(1)}`);
}

function sourceLabelForPlatform(key, platform) {
  return key === 'x' ? 'X' : platformDisplay(platform, key);
}

function derivePlatformScore(platform = {}, fallback = 70) {
  const growth = parsePercent(readStat(platform.stats, ['Audience Growth']), 0);
  const engagement = parsePercent(readStat(platform.stats, ['Engagement Rate']), 0);
  const ctr = parsePercent(readStat(platform.stats, ['Click Through Rate']), 0);
  return Math.max(48, Math.min(96, Math.round(58 + growth * 1.8 + engagement * 2.2 + ctr * 1.5)) || fallback);
}

function buildPlatformStatsFromSnapshot(base = {}, snapshotPlatform = {}) {
  if (Array.isArray(snapshotPlatform.stats) && snapshotPlatform.stats.length) return snapshotPlatform.stats;
  const lookup = metricLookup(base.stats || []);
  const metrics = snapshotPlatform.metrics || {};
  return [
    ['Followers', compactNumber(metrics.followers ?? parseCompactNumber(lookup.Followers))],
    ['Views', compactNumber(metrics.views ?? parseCompactNumber(lookup.Views))],
    ['Reach', compactNumber(metrics.reach ?? parseCompactNumber(lookup.Reach))],
    ['Impressions', compactNumber(metrics.impressions ?? parseCompactNumber(lookup.Impressions))],
    ['Likes', compactNumber(metrics.likes ?? parseCompactNumber(lookup.Likes))],
    ['Comments', compactNumber(metrics.comments ?? parseCompactNumber(lookup.Comments))],
    ['Shares', compactNumber(metrics.shares ?? parseCompactNumber(lookup.Shares))],
    ['Click Through Rate', snapshotPlatform.ctr || lookup['Click Through Rate'] || '—'],
    ['Engagement Rate', snapshotPlatform.engagementRate || lookup['Engagement Rate'] || '—'],
    ['Audience Growth', snapshotPlatform.growth || lookup['Audience Growth'] || '—'],
    ['Posting Frequency', snapshotPlatform.postingFrequency || lookup['Posting Frequency'] || '—']
  ].filter(([, value]) => value != null && value !== '—');
}

function buildDemoSource(platformName, providerReason, syncedAt = null) {
  return {
    label: 'Demo fallback active',
    body: providerReason
      ? `${providerReason} ${platformName} is still using demo data inside the Unified Social Provider.`
      : `${platformName} is still using demo data inside the Unified Social Provider.`,
    tone: 'warn',
    state: 'demo-fallback',
    syncedAt
  };
}

function buildLiveSource(platformName, syncedAt = null) {
  return {
    label: 'Live social snapshot active',
    body: `${platformName} is now hydrating from the Unified Social Provider snapshot path while the rest of EP Intelligence remains safely demo-first where needed.`,
    tone: 'good',
    state: `live-${platformName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    syncedAt
  };
}

function rebuildCombinedMetrics(platforms = {}, fallback = {}) {
  const platformList = Object.values(platforms || {});
  const followers = platformList.reduce((sum, platform) => sum + parseCompactNumber(readStat(platform.stats, ['Subscribers', 'Followers']) || 0), 0);
  const views = platformList.reduce((sum, platform) => sum + parseCompactNumber(readStat(platform.stats, ['Views (28 days)', 'Total Views', 'Views']) || 0), 0);
  const reach = platformList.reduce((sum, platform) => sum + parseCompactNumber(readStat(platform.stats, ['Reach']) || 0), 0);
  const engagement = platformList.reduce((sum, platform) => sum + parseCompactNumber(readStat(platform.stats, ['Likes']) || 0), 0);
  const growthAverage = average(platformList.map((platform) => parsePercent(readStat(platform.stats, ['Audience Growth']), 0)));

  if (!followers || !views) return fallback;

  return {
    followers: compactNumber(followers),
    views: compactNumber(views),
    reach: compactNumber(reach),
    engagement: compactNumber(engagement),
    gained: growthAverage > 0 ? `+${compactNumber(Math.round((followers * growthAverage) / 100))}` : compactNumber(Math.round((followers * growthAverage) / 100)),
    growth: formatPercent(growthAverage)
  };
}

function buildDerivedAttribution(workspace = {}) {
  const rankings = workspace.socialOverview?.rankings || [];
  const totalScore = rankings.reduce((sum, item) => sum + Number(item.score || 0), 0) || 1;
  const mix = rankings.map((item) => ({
    channel: item.platform,
    share: Math.round((Number(item.score || 0) / totalScore) * 100),
    note: item.note
  }));
  const top = rankings[0];
  const weakest = rankings[rankings.length - 1];
  const revenueAttributed = workspace.campaignPerformance?.revenueAttribution || '£18.6k';
  const confidence = workspace.socialProviderSummary?.livePlatformCount > 0 ? 'Medium' : 'Low';

  return {
    summary: `${top?.platform || 'The strongest channel'} is creating the clearest assisted-demand signal, while ${weakest?.platform || 'the weakest channel'} should remain selective until it earns a stronger commercial role.`,
    revenueAttributed,
    bestAssistedChannel: top?.platform || 'YouTube',
    bestConversionChannel: top?.platform || 'Instagram',
    weakestChannel: weakest?.platform || 'X',
    confidence,
    touchpoints: mix.map((item, index) => ({
      channel: item.channel,
      share: `${item.share}%`,
      note: index === 0
        ? `${item.channel} currently contributes the strongest authority or demand signal.`
        : index === mix.length - 1
          ? `${item.channel} remains the lightest-weight commercial touchpoint and should be reviewed carefully.`
          : `${item.channel} is a supporting channel in the current attribution mix.`
    })),
    mix
  };
}

function buildDerivedCompetitorBenchmark(workspace = {}) {
  const rankings = workspace.socialOverview?.rankings || [];
  const competitors = workspace.competitorAnalysis?.competitors || [];
  const competitorGrowthAvg = average(competitors.map((item) => parsePercent(item.growth, 0)));
  const epGrowthAvg = average(rankings.map((item) => parsePercent(item.growth, 0)));
  const leader = rankings[0];
  const laggard = rankings[rankings.length - 1];

  return {
    summary: epGrowthAvg >= competitorGrowthAvg
      ? `EP's tracked social growth is running ahead of the competitor baseline, led by ${leader?.platform || 'the strongest channel'}.`
      : `EP's tracked social growth is slightly behind the competitor baseline, so the best route is to press the strongest proof-led channels rather than spread effort evenly.`,
    competitorGrowthAvg: formatPercent(competitorGrowthAvg),
    epGrowthAvg: formatPercent(epGrowthAvg),
    leader: leader?.platform || 'YouTube',
    laggard: laggard?.platform || 'X',
    benchmark: rankings.map((item) => ({
      platform: item.platform,
      score: item.score,
      gap: `${item.score >= 72 ? '+' : ''}${item.score - 72} pts vs market baseline`,
      standing: item.score >= 85 ? 'Leader' : item.score >= 75 ? 'Competitive' : item.score >= 65 ? 'Challenger' : 'Underweight',
      note: item.note
    }))
  };
}

export class UnifiedSocialProvider {
  constructor({ provider, source, mode = 'demo', socialSnapshot = null }) {
    this.provider = provider;
    this.source = deepClone(source);
    this.mode = mode;
    this.key = 'social';
    this.label = 'UnifiedSocialProvider';
    this.socialSnapshot = normalizeSnapshot(socialSnapshot || {});
    this.bindingMode = this.socialSnapshot.available || provider?.bindingMode === 'live+demo' ? 'live+demo' : 'demo';
  }

  describe() {
    return {
      key: this.key,
      label: this.label,
      mode: this.bindingMode,
      type: 'active',
      status: this.socialSnapshot.available ? 'Unified social snapshot active' : 'Demo fallback',
      domains: ['marketing'],
      notes: this.socialSnapshot.available
        ? 'Instagram, Facebook, LinkedIn, and X can now hydrate through the Unified Social Provider while preserving demo-safe fallback for any missing platform data.'
        : 'Ready for generated Unified Social snapshots. Falls back safely to demo data until a local social snapshot is available.'
    };
  }

  describeSocialIntegration() {
    const livePlatforms = PLATFORM_KEYS.filter((key) => this.socialSnapshot.platforms?.[key]?.available !== false && this.socialSnapshot.platforms?.[key]).length;
    return {
      id: 'unified-social',
      label: 'Unified Social Provider',
      provider: this.label,
      providerKey: this.key,
      service: 'MarketingService',
      group: 'Marketing & Analytics',
      available: this.socialSnapshot.available,
      mode: this.bindingMode,
      status: this.socialSnapshot.available ? `Live social snapshot (${livePlatforms}/4 platform paths active)` : 'Demo fallback',
      notes: this.socialSnapshot.available
        ? this.socialSnapshot.notes || 'Cross-platform social performance, competitor benchmarking, and attribution are now hydrated through the Unified Social Provider snapshot path.'
        : this.socialSnapshot.reason || 'Unified social snapshot unavailable. Demo fallback remains active.',
      syncedAt: this.socialSnapshot.syncedAt || null,
      livePlatforms
    };
  }

  describePlatformIntegration(key) {
    const basePlatform = this.source.cmo?.platforms?.[key] || {};
    const name = sourceLabelForPlatform(key, basePlatform);
    const snapshotPlatform = this.socialSnapshot.platforms?.[key];
    const isLive = Boolean(this.socialSnapshot.available && snapshotPlatform);

    return {
      id: key,
      label: key === 'x' ? 'X' : name,
      provider: this.label,
      providerKey: this.key,
      service: 'MarketingService',
      group: 'Marketing & Analytics',
      available: isLive,
      mode: isLive ? 'live+demo' : 'demo',
      status: isLive ? 'Live social snapshot' : 'Demo fallback',
      notes: isLive
        ? `${name} is hydrating through the Unified Social Provider snapshot path.`
        : `${name} remains safely demo-backed until a local unified social snapshot is supplied.`,
      syncedAt: isLive ? (this.socialSnapshot.syncedAt || null) : null
    };
  }

  getMarketingWorkspace() {
    const workspace = this.provider?.getMarketingWorkspace
      ? this.provider.getMarketingWorkspace()
      : deepClone(this.source.cmo);

    const baseRankings = workspace.socialOverview?.rankings || [];
    const platforms = { ...(workspace.platforms || {}) };
    let livePlatformCount = 0;

    PLATFORM_KEYS.forEach((key) => {
      const basePlatform = deepClone(platforms[key] || this.source.cmo?.platforms?.[key] || {});
      const name = sourceLabelForPlatform(key, basePlatform);
      const snapshotPlatform = this.socialSnapshot.platforms?.[key];
      const isLive = Boolean(this.socialSnapshot.available && snapshotPlatform);

      if (!isLive) {
        platforms[key] = {
          ...basePlatform,
          dataSource: buildDemoSource(name, this.socialSnapshot.reason, this.socialSnapshot.syncedAt || this.socialSnapshot.checkedAt || null)
        };
        return;
      }

      livePlatformCount += 1;
      const score = Number(snapshotPlatform.score || derivePlatformScore({ ...basePlatform, stats: snapshotPlatform.stats || basePlatform.stats }, 72));
      platforms[key] = {
        ...basePlatform,
        label: snapshotPlatform.label || basePlatform.label,
        health: snapshotPlatform.health || `Live ${name} social channel`,
        stats: buildPlatformStatsFromSnapshot(basePlatform, snapshotPlatform),
        charts: {
          ...basePlatform.charts,
          ...(snapshotPlatform.charts || {})
        },
        topContent: snapshotPlatform.topContent || basePlatform.topContent || [],
        recentPosts: snapshotPlatform.recentPosts || basePlatform.recentPosts || [],
        snapshotMeta: snapshotPlatform.meta || {},
        benchmarkScore: score,
        dataSource: buildLiveSource(name, this.socialSnapshot.syncedAt || this.socialSnapshot.checkedAt || null)
      };

      const rankingLabel = platformDisplay(platforms[key], key);
      const rankingIndex = baseRankings.findIndex((entry) => String(entry.platform).toLowerCase().includes(key === 'x' ? 'x' : key));
      if (rankingIndex >= 0) {
        baseRankings[rankingIndex] = {
          ...baseRankings[rankingIndex],
          platform: rankingLabel,
          score,
          growth: snapshotPlatform.growth || baseRankings[rankingIndex].growth,
          note: snapshotPlatform.note || `${rankingLabel} is now hydrating through the Unified Social Provider snapshot path.`
        };
      }
    });

    const rankings = [...baseRankings].sort((left, right) => Number(right.score || 0) - Number(left.score || 0));
    const combined = rebuildCombinedMetrics(platforms, workspace.socialOverview?.combined || {});
    const bestPlatform = rankings[0]?.platform || workspace.dashboard?.bestPlatform || 'YouTube';
    const worstPlatform = rankings[rankings.length - 1]?.platform || workspace.dashboard?.worstPlatform || 'X';

    workspace.platforms = platforms;
    workspace.socialProviderSummary = {
      label: this.socialSnapshot.available ? 'Unified Social Provider live snapshot active' : 'Unified Social Provider demo fallback active',
      body: this.socialSnapshot.available
        ? `Instagram, Facebook, LinkedIn, and X are now available through a single provider path, with ${livePlatformCount}/4 live platform overlays active.`
        : this.socialSnapshot.reason || 'The Unified Social Provider is using demo fallback data.',
      tone: this.socialSnapshot.available ? 'good' : 'warn',
      state: this.socialSnapshot.available ? 'live-social' : 'demo-fallback',
      syncedAt: this.socialSnapshot.syncedAt || this.socialSnapshot.checkedAt || null,
      livePlatformCount
    };

    workspace.socialOverview = {
      ...workspace.socialOverview,
      combined,
      rankings,
      dataSource: {
        label: workspace.socialProviderSummary.label,
        body: workspace.socialProviderSummary.body,
        tone: workspace.socialProviderSummary.tone
      }
    };

    workspace.dashboard = {
      ...workspace.dashboard,
      metrics: {
        ...workspace.dashboard.metrics,
        followers: combined.followers || workspace.dashboard.metrics?.followers,
        views: combined.views || workspace.dashboard.metrics?.views,
        engagement: combined.engagement || workspace.dashboard.metrics?.engagement
      },
      bestPlatform,
      worstPlatform,
      summary: this.socialSnapshot.available
        ? `Marketing is performing well overall, with ${bestPlatform} and the wider social estate now visible through the Unified Social Provider. The next lift still depends on turning social and video demand into more bookings, enquiries, and repeatable attribution clarity.`
        : workspace.dashboard.summary
    };

    workspace.competitorAnalysis = {
      ...workspace.competitorAnalysis,
      benchmark: this.socialSnapshot.competitorBenchmark || buildDerivedCompetitorBenchmark(workspace)
    };

    workspace.campaignPerformance = {
      ...workspace.campaignPerformance,
      attribution: this.socialSnapshot.attribution || buildDerivedAttribution(workspace)
    };

    workspace.aiMarketingAdvisor = {
      ...workspace.aiMarketingAdvisor,
      executiveSummary: {
        ...workspace.aiMarketingAdvisor.executiveSummary,
        evidence: this.socialSnapshot.available
          ? `Unified Social Provider live snapshot active. ${bestPlatform} currently leads the social estate while ${worstPlatform} remains the weakest commercial return channel.`
          : workspace.aiMarketingAdvisor.executiveSummary?.evidence,
        missing: this.socialSnapshot.available
          ? 'Attribution remains deterministic and snapshot-backed rather than driven by native ad-platform conversion APIs.'
          : workspace.aiMarketingAdvisor.executiveSummary?.missing
      }
    };

    workspace.charts = {
      ...workspace.charts,
      platformComparison: {
        ...workspace.charts.platformComparison,
        labels: rankings.map((item) => item.platform === 'X (Twitter)' ? 'X' : item.platform),
        values: rankings.map((item) => Number(item.score || 0))
      },
      followerGrowth: {
        ...workspace.charts.followerGrowth,
        values: (workspace.charts.followerGrowth?.values || []).map((value, index, values) => (index === values.length - 1 ? parseCompactNumber(combined.followers || value) : value))
      },
      totalViews: {
        ...workspace.charts.totalViews,
        values: (workspace.charts.totalViews?.values || []).map((value, index, values) => (index === values.length - 1 ? parseCompactNumber(combined.views || value) : value))
      },
      attributionMix: {
        type: 'doughnut',
        labels: workspace.campaignPerformance.attribution.mix.map((item) => item.channel === 'X (Twitter)' ? 'X' : item.channel),
        values: workspace.campaignPerformance.attribution.mix.map((item) => item.share),
        suffix: '%'
      }
    };

    return workspace;
  }
}
