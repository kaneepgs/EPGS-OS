import { deepClone, parseCompactNumber } from '../contracts/data-contracts.js';

function normalizeSnapshot(snapshot = {}) {
  return {
    integrationId: 'youtube',
    available: Boolean(snapshot.available),
    status: snapshot.status || 'Demo Fallback',
    state: snapshot.state || 'demo-fallback',
    source: snapshot.source || 'MockProvider',
    reason: snapshot.reason || 'Live YouTube snapshot unavailable.',
    checkedAt: snapshot.checkedAt || snapshot.syncedAt || null,
    syncedAt: snapshot.syncedAt || null,
    channelId: snapshot.channelId || '',
    channelTitle: snapshot.channelTitle || 'YouTube',
    notes: snapshot.notes || '',
    meta: snapshot.meta || {},
    youtube: snapshot.youtube || null,
    charts: snapshot.charts || null,
    contentLibraryItems: snapshot.contentLibraryItems || []
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

function mapPairs(entries = []) {
  return Object.fromEntries(
    entries
      .filter((entry) => Array.isArray(entry) && entry.length >= 2)
      .map(([label, value]) => [String(label), value])
  );
}

function replaceLast(values = [], nextValue = 0) {
  if (!Array.isArray(values) || !values.length) return [nextValue];
  return values.map((value, index) => (index === values.length - 1 ? nextValue : value));
}

function withUpdatedRankings(rankings = [], youtubeScore = 92) {
  const updated = rankings.map((entry) =>
    entry.platform === 'YouTube'
      ? {
          ...entry,
          score: youtubeScore,
          growth: entry.growth,
          note: 'Live YouTube channel data is now active through the provider snapshot path.'
        }
      : entry
  );
  return updated.sort((a, b) => b.score - a.score);
}

function deriveYoutubeScore(meta = {}) {
  const growth = Number(meta.channelGrowthPct || 0);
  const uploads = Number(meta.uploadsLast28Days || 0);
  const views = Number(meta.viewsLast28Days || 0);
  return Math.max(70, Math.min(97, Math.round(78 + growth * 1.6 + Math.min(views / 50000, 12) + uploads * 0.8)));
}

function mergeCombinedMetric(baseValue, oldValue, newValue) {
  const total = parseCompactNumber(baseValue) - parseCompactNumber(oldValue) + Number(newValue || 0);
  return compactNumber(Math.max(total, 0));
}

function updateContentLibrary(baseItems = [], replacementItems = []) {
  const nonYoutube = baseItems.filter((item) => item.platform !== 'YouTube');
  return [...replacementItems, ...nonYoutube]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, Math.max(baseItems.length, replacementItems.length));
}

export class YouTubeProvider {
  constructor({ provider, source, mode = 'demo', youtubeSnapshot = null }) {
    this.provider = provider;
    this.source = deepClone(source);
    this.mode = mode;
    this.key = 'youtube';
    this.label = 'YouTubeProvider';
    this.youtubeSnapshot = normalizeSnapshot(youtubeSnapshot || {});
    this.bindingMode = this.youtubeSnapshot.available || provider?.bindingMode === 'live+demo' ? 'live+demo' : 'demo';
  }

  describe() {
    return {
      key: this.key,
      label: this.label,
      mode: this.bindingMode,
      type: 'active',
      status: this.youtubeSnapshot.available ? 'Live YouTube channel data' : 'Demo fallback',
      domains: ['marketing'],
      notes: this.youtubeSnapshot.available
        ? 'Marketing now overlays live YouTube channel and upload data while preserving the existing demo fallback for every other social platform.'
        : 'Ready for generated YouTube snapshots. Falls back safely to demo data until a local sync succeeds.'
    };
  }

  describeYouTubeIntegration() {
    return {
      id: 'youtube',
      label: 'YouTube',
      provider: this.label,
      providerKey: this.key,
      service: 'MarketingService',
      group: 'Marketing & Analytics',
      available: this.youtubeSnapshot.available,
      mode: this.bindingMode,
      status: this.youtubeSnapshot.available ? 'Live channel data' : 'Demo fallback',
      notes: this.youtubeSnapshot.available
        ? `Live YouTube snapshot active for channel ${this.youtubeSnapshot.channelTitle || this.youtubeSnapshot.channelId || 'configured'}. Recent uploads, channel totals, and tracked deltas are now available.`
        : this.youtubeSnapshot.reason || 'Live YouTube snapshot unavailable. Demo fallback remains active.',
      detail: this.youtubeSnapshot.available
        ? `Channel ${this.youtubeSnapshot.channelId || 'configured'} synced ${this.youtubeSnapshot.syncedAt || 'recently'}.`
        : 'Add YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID, run npm run youtube:sync, and refresh the app to replace demo YouTube data.',
      syncedAt: this.youtubeSnapshot.syncedAt || null,
      channelId: this.youtubeSnapshot.channelId || ''
    };
  }

  getMarketingWorkspace() {
    const workspace = this.provider?.getMarketingWorkspace ? this.provider.getMarketingWorkspace() : deepClone(this.source.cmo);
    const youtubeDemo = workspace.platforms?.youtube || {};

    if (!this.youtubeSnapshot.available || !this.youtubeSnapshot.youtube) {
      workspace.platforms = {
        ...workspace.platforms,
        youtube: {
          ...youtubeDemo,
          snapshotMeta: this.youtubeSnapshot.meta || {},
          dataSource: {
            label: 'Demo fallback active',
            body: this.youtubeSnapshot.reason
              ? `${this.youtubeSnapshot.reason} YouTube is still using demo data.`
              : 'YouTube is still using demo data because no local live snapshot is currently available.',
            tone: 'warn',
            state: 'demo-fallback',
            channelId: this.youtubeSnapshot.channelId || '',
            syncedAt: this.youtubeSnapshot.syncedAt || this.youtubeSnapshot.checkedAt || null
          }
        }
      };
      return workspace;
    }

    const youtube = this.youtubeSnapshot.youtube;
    const meta = this.youtubeSnapshot.meta || {};
    const youtubeScore = deriveYoutubeScore(meta);
    const youtubeStats = mapPairs(youtubeDemo.stats || []);
    const demoSubscribers = youtubeStats.Subscribers || '0';
    const demoViews = youtubeStats.Views || '0';
    const demoEngagement = youtubeStats.Likes || '0';
    const uploadsFrequency = meta.uploadsLast28Days
      ? `${meta.uploadsLast28Days} upload${meta.uploadsLast28Days === 1 ? '' : 's'} in last 28 days`
      : 'Tracking cadence from the first live sync';

    workspace.platforms = {
      ...workspace.platforms,
      youtube: {
        ...youtubeDemo,
        health: meta.channelGrowthPct >= 0 ? 'Live authority channel with tracked growth' : 'Live authority channel with softening tracked growth',
        stats: [
          ['Subscribers', compactNumber(meta.subscribers)],
          ['Total Views', compactNumber(meta.totalViews)],
          ['Views (28 days)', compactNumber(meta.viewsLast28Days)],
          ['Videos Published', compactNumber(meta.videoCount)],
          ['Subscribers Gained', compactNumber(meta.subscribersGained)],
          ['Average Views / Video', compactNumber(meta.averageViewsPerVideo)],
          ['Audience Growth', formatPercent(meta.channelGrowthPct)],
          ['Publishing Activity', uploadsFrequency],
          ['Tracked Window', meta.historyCoverageLabel || 'First live sync'],
          ['Recent Uploads', compactNumber(meta.recentUploadsCount)],
          ['Top Video', youtube.topVideos?.[0]?.title || 'Most-viewed tracked upload'],
          ['Data Source', 'Live YouTube snapshot']
        ],
        charts: {
          followers: this.youtubeSnapshot.charts?.followers || youtubeDemo.charts?.followers,
          views: this.youtubeSnapshot.charts?.views || youtubeDemo.charts?.views,
          engagement: this.youtubeSnapshot.charts?.engagement || youtubeDemo.charts?.engagement
        },
        topContent: (youtube.topVideos || []).map((item) => item.title),
        recentPosts: (youtube.recentUploads || []).map((item) => item.title),
        snapshotMeta: meta,
        dataSource: {
          label: 'Live YouTube snapshot active',
          body: `Channel ${this.youtubeSnapshot.channelTitle || this.youtubeSnapshot.channelId || 'configured'} synced ${this.youtubeSnapshot.syncedAt || 'recently'}. Recent uploads and tracked deltas are now replacing demo YouTube content while other social platforms remain in Demo Mode.`,
          tone: 'good',
          state: 'live-youtube',
          channelId: this.youtubeSnapshot.channelId || '',
          syncedAt: this.youtubeSnapshot.syncedAt || null
        }
      }
    };

    workspace.dashboard = {
      ...workspace.dashboard,
      metrics: {
        ...workspace.dashboard.metrics,
        followers: mergeCombinedMetric(workspace.dashboard.metrics?.followers, demoSubscribers, meta.subscribers),
        views: mergeCombinedMetric(workspace.dashboard.metrics?.views, demoViews, meta.viewsLast28Days || meta.totalViews),
        engagement: mergeCombinedMetric(workspace.dashboard.metrics?.engagement, demoEngagement, meta.recentEngagementTotal || 0)
      },
      bestPlatform: 'YouTube',
      summary: `Marketing is performing well overall, with live YouTube channel data now confirming that video-led authority remains the clearest momentum driver. Website traffic and lead quality are improving, while the next lift still depends on stronger conversion pathways and selective focus on the highest-return channels.`
    };

    workspace.socialOverview = {
      ...workspace.socialOverview,
      combined: {
        ...workspace.socialOverview.combined,
        followers: mergeCombinedMetric(workspace.socialOverview.combined?.followers, demoSubscribers, meta.subscribers),
        views: mergeCombinedMetric(workspace.socialOverview.combined?.views, demoViews, meta.viewsLast28Days || meta.totalViews),
        engagement: mergeCombinedMetric(workspace.socialOverview.combined?.engagement, demoEngagement, meta.recentEngagementTotal || 0),
        gained: meta.subscribersGained > 0 ? `+${compactNumber(meta.subscribersGained)}` : compactNumber(meta.subscribersGained),
        growth: formatPercent(meta.channelGrowthPct)
      },
      rankings: withUpdatedRankings(workspace.socialOverview.rankings, youtubeScore),
      topContent: youtube.topVideos?.[0]
        ? {
            title: `YouTube: “${youtube.topVideos[0].title}”`,
            platform: 'YouTube',
            metric: `${compactNumber(youtube.topVideos[0].views)} views / ${compactNumber(youtube.topVideos[0].engagement)} engagement`
          }
        : workspace.socialOverview.topContent,
      dataSource: {
        label: 'Live YouTube snapshot active',
        body: `Cross-platform totals now include live YouTube channel data for ${this.youtubeSnapshot.channelTitle || 'the configured channel'}.`,
        tone: 'good'
      }
    };

    workspace.charts = {
      ...workspace.charts,
      platformComparison: {
        ...workspace.charts.platformComparison,
        values: workspace.charts.platformComparison.labels.map((label, index) =>
          label === 'YouTube' ? youtubeScore : workspace.charts.platformComparison.values[index]
        )
      },
      followerGrowth: {
        ...workspace.charts.followerGrowth,
        values: replaceLast(workspace.charts.followerGrowth.values, parseCompactNumber(workspace.socialOverview.combined.followers))
      },
      totalViews: {
        ...workspace.charts.totalViews,
        values: replaceLast(workspace.charts.totalViews.values, parseCompactNumber(workspace.socialOverview.combined.views))
      }
    };

    workspace.contentLibrary = {
      ...workspace.contentLibrary,
      items: updateContentLibrary(workspace.contentLibrary.items, this.youtubeSnapshot.contentLibraryItems)
    };

    workspace.aiMarketingAdvisor = {
      ...workspace.aiMarketingAdvisor,
      executiveSummary: {
        ...workspace.aiMarketingAdvisor.executiveSummary,
        evidence: `Live YouTube snapshot active for ${this.youtubeSnapshot.channelTitle || 'the configured channel'}. Subscribers ${compactNumber(meta.subscribers)}, tracked views ${compactNumber(meta.viewsLast28Days || meta.totalViews)} over the active window, and recent uploads are now flowing through the provider architecture.`,
        missing: 'Other social platforms and attribution still remain in Demo Mode until future providers are added.'
      }
    };

    return workspace;
  }
}
