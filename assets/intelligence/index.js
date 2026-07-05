import { createConfidenceEngine } from './confidence-engine.js';
import { createPriorityEngine } from './priority-engine.js';
import { createHealthEngine } from './health-engine.js';
import { createCorrelationEngine } from './correlation-engine.js';
import { createRecommendationEngine } from './recommendation-engine.js';
import { createInsightEngine } from './insight-engine.js';
import { createNarrativeEngine } from './narrative-engine.js';
import { nowTimestamp, priorityTone } from './engine-utils.js';

export function createExecutiveIntelligenceEngine(config) {
  const confidenceEngine = createConfidenceEngine(config);
  const priorityEngine = createPriorityEngine(config);
  const healthEngine = createHealthEngine(config);
  const correlationEngine = createCorrelationEngine({ confidenceEngine });
  const recommendationEngine = createRecommendationEngine({ priorityEngine });
  const insightEngine = createInsightEngine();
  const narrativeEngine = createNarrativeEngine();

  function createTimelineEvents({ finance, marketing }, { correlations, recommendations }) {
    const events = [];
    if (correlations.find((item) => item.id === 'marketing-revenue-growth')) {
      events.push({ id: 'timeline-marketing-demand', time: 'Now', type: 'Marketing milestone', title: 'Marketing momentum converted into revenue support', body: `Revenue and marketing momentum are rising together. Recommended next action: ${recommendations.find((item) => item.id === 'video-proof-expansion')?.recommendation || 'Scale the strongest channel.'}` });
    }
    if (correlations.find((item) => item.id === 'cash-supplier-pressure')) {
      events.push({ id: 'timeline-cash-warning', time: 'Now', type: 'Cash warning', title: 'Supplier inflation is tightening forecast cash flexibility', body: `Current cash ${finance.metrics?.find((item) => item.key === 'cash')?.value} versus forecast ${finance.forecasts?.cash}.` });
    }
    if (correlations.find((item) => item.id === 'profit-expense-pressure')) {
      events.push({ id: 'timeline-margin-risk', time: 'Now', type: 'Expense spike', title: 'Expense drift is softening margin conversion', body: `Profit trend ${finance.metrics?.find((item) => item.key === 'profit')?.trend} with expense drift ${finance.kpis?.groups?.[4]?.[1]?.[1]?.[1]}.` });
    }
    if (marketing.campaignPerformance?.campaigns?.[0]) {
      events.push({ id: 'timeline-campaign-success', time: 'This week', type: 'Campaign success', title: marketing.campaignPerformance.campaigns[0].title, body: `ROI ${marketing.campaignPerformance.campaigns[0].roi} and revenue ${marketing.campaignPerformance.campaigns[0].revenue}.` });
    }
    return events;
  }

  function toCommentary(title, insight, recommendation, extras = {}) {
    return {
      title,
      summary: insight?.executiveSummary || extras.summary || 'No intelligence summary available.',
      evidence: insight?.supportingEvidence?.join(' ') || extras.evidence || 'No evidence available.',
      confidence: insight ? `${insight.confidence} (${insight.confidenceScore}%)` : extras.confidence || 'Medium',
      impact: insight?.businessImpact || extras.impact || 'Executive impact placeholder.',
      risks: extras.risks || insight?.financialImpact || 'No specific risk narrative available.',
      alternatives: extras.alternatives || 'Proceed now, stage a narrower intervention, or defer until a stronger signal appears.',
      action: recommendation?.recommendation || insight?.suggestedActions?.[0] || extras.action || 'Review the relevant executive recommendation.',
      missing: 'All intelligence remains deterministic, provider-backed, and Demo Mode only in this sprint.',
      followUp: extras.followUp || [
        'What changed most materially?',
        'Which recommendation creates the fastest value?',
        'What should be monitored next?'
      ]
    };
  }

  function buildAskWorkspace({ insights, recommendations, narratives }) {
    const prompts = [
      {
        question: 'What happened across the business this week?',
        answer: narratives.weeklyBriefing.summary,
        confidence: insights.topInsight.confidence,
        rationale: 'Generated from the highest-ranked executive insights and cross-department correlations.'
      },
      {
        question: 'What should the CEO focus on first?',
        answer: `${recommendations[0]?.recommendation || 'Review the top recommendation.'} Why: ${recommendations[0]?.why || insights.topInsight.executiveSummary}`,
        confidence: recommendations[0]?.confidence || insights.topInsight.confidence,
        rationale: 'Ranked by financial impact, strategic importance, timing, customer impact, and confidence.'
      },
      {
        question: 'Why is profit lagging behind momentum?',
        answer: insights.executive.find((item) => item.title.toLowerCase().includes('margin') || item.title.toLowerCase().includes('profit'))?.executiveSummary || insights.cfo[1]?.executiveSummary || 'The engine did not detect a profit explanation.',
        confidence: 'High',
        rationale: 'Drawn from the profit-versus-expense correlation rules.'
      },
      {
        question: 'Where is the clearest marketing opportunity?',
        answer: insights.cmo[1]?.executiveSummary || recommendations.find((item) => item.id === 'video-proof-expansion')?.why || 'The engine did not detect a marketing opportunity.',
        confidence: 'High',
        rationale: 'Built from marketing performance, website conversion, and top-channel momentum.'
      }
    ];

    return {
      intro: 'This workspace now answers executive questions from the deterministic intelligence engine rather than placeholder commentary.',
      prompts,
      suggestedFollowUps: [
        'Which recommendation should we approve today?',
        'Where is the biggest conversion leak right now?',
        'How fragile is our cash position if collections slip?',
        'Which department needs intervention first?'
      ]
    };
  }

  return Object.freeze({
    run(services) {
      const executive = services.executive.getCeoDashboard();
      const finance = services.finance.getWorkspace();
      const marketing = services.marketing.getWorkspace();
      const approvals = services.approval.getWorkspace();
      const reports = services.report.getWorkspace();
      const timeline = services.timeline.getBusinessTimeline();
      const context = { executive, finance, marketing, approvals, reports, timeline };

      const health = healthEngine.evaluate(context);
      const correlations = correlationEngine.evaluate(context, { health });
      const seededRecommendations = recommendationEngine.evaluate(context, { correlations, health });
      const recommendations = seededRecommendations.map((item) => ({ ...item, tone: priorityTone(item.priority) }));
      const insights = insightEngine.evaluate(context, { correlations, recommendations, health });
      const narratives = narrativeEngine.evaluate(context, { insights, recommendations, health });
      const timelineEvents = createTimelineEvents(context, { correlations, recommendations });
      const askWorkspace = buildAskWorkspace({ insights, recommendations, narratives });

      const ceoCommentary = toCommentary('AI Executive Briefing', insights.executive[0], recommendations[0], {
        risks: insights.executive.slice(1, 3).map((item) => item.executiveSummary).join(' '),
        followUp: askWorkspace.prompts.map((item) => item.question)
      });
      const cfoWorkspaceCommentary = toCommentary('CFO Commentary', insights.cfo[2] || insights.cfo[0], recommendations.find((item) => item.suggestedOwner.includes('CFO')), {
        alternatives: 'Accelerate collections, challenge spend, or keep the current posture while tightening approvals.',
        followUp: ['What will improve cash fastest?', 'Which supplier line deserves review first?', 'How much margin can we recover quickly?']
      });
      const cmoSummaryCommentary = toCommentary('AI Marketing Summary', insights.cmo[2] || insights.cmo[0], recommendations.find((item) => item.suggestedOwner.includes('CMO')), {
        alternatives: 'Scale the top channel, fix conversion first, or keep a balanced but slower mix.',
        followUp: ['Which channel should get the next content push?', 'Where is traffic leaking?', 'What deserves approval first?']
      });

      return {
        generatedAt: nowTimestamp(),
        engine: {
          version: config.version,
          mode: 'Demo Mode',
          modules: ['InsightEngine', 'CorrelationEngine', 'RecommendationEngine', 'PriorityEngine', 'HealthEngine', 'NarrativeEngine', 'ConfidenceEngine']
        },
        health,
        correlations: correlations.map((entry) => ({ ...entry, priority: recommendations.find((item) => entry.responsibleDepartment.includes(item.suggestedOwner.split(' / ')[0]))?.priority || 'Medium' })),
        recommendations,
        insights,
        narratives,
        timelineEvents,
        askWorkspace,
        ceo: {
          commentary: ceoCommentary,
          insights: insights.executive,
          recommendations: recommendations.slice(0, 4),
          health,
          narratives,
          prompts: askWorkspace.prompts
        },
        cfo: {
          commentary: {
            workspace: cfoWorkspaceCommentary,
            revenue: toCommentary('Revenue Commentary', insights.executive[0], recommendations[2]),
            profit: toCommentary('Profit Commentary', insights.cfo[1], recommendations[3]),
            expenses: toCommentary('Expense Commentary', insights.cfo[1], recommendations[3]),
            suppliers: toCommentary('Supplier Commentary', insights.cfo[0], recommendations[3]),
            cash: toCommentary('Cash Commentary', insights.cfo[0], recommendations[0]),
            vat: toCommentary('VAT Commentary', insights.cfo[2], recommendations[0], { action: 'Keep coding discipline and review quarter-end assumptions before submission.' }),
            forecasting: toCommentary('Forecast Commentary', insights.cfo[2], recommendations[0], { action: 'Stress-test the 30/60/90 day cash view against slower collections and higher supplier cost assumptions.' })
          },
          weeklyBriefing: narratives.weeklyBriefing,
          recommendations: recommendations.filter((item) => item.suggestedOwner.includes('CFO')),
          insights: insights.cfo,
          health: health.cfo
        },
        cmo: {
          aiSummary: cmoSummaryCommentary,
          executiveSummary: toCommentary('AI Marketing Advisor', insights.cmo[0], recommendations.find((item) => item.suggestedOwner.includes('CMO'))),
          weeklyBriefing: narratives.departmentSummaries.cmo.summary,
          recommendations: recommendations.filter((item) => item.suggestedOwner.includes('CMO')),
          insights: insights.cmo,
          health: health.cmo
        },
        reports: {
          weeklyBriefing: narratives.weeklyBriefing,
          boardSummary: narratives.boardSummary,
          reportInsights: insights.reports,
          recommendations: recommendations.slice(0, 4)
        },
        aiAssistant: askWorkspace
      };
    }
  });
}
