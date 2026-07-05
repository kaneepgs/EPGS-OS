export function createNarrativeEngine() {
  function listSentence(items = []) {
    return items.filter(Boolean).join(' ');
  }

  return Object.freeze({
    evaluate(context, { insights, recommendations, health }) {
      const memorySummary = context?.memory?.deterministic?.[0]?.summary || '';
      const topRecommendations = recommendations.slice(0, 3);
      const dailyBriefing = {
        headline: insights.topInsight.title,
        summary: `${insights.topInsight.executiveSummary}${memorySummary ? ` Historical context: ${memorySummary}` : ''} Next, leadership should focus on ${topRecommendations.map((item) => item.recommendation.toLowerCase()).join('; ')}.`,
        actions: topRecommendations.map((item) => item.recommendation),
        confidence: insights.topInsight.confidence,
        boardOpening: `${insights.topInsight.executiveSummary} Overall business health is ${health.overall.score}/100 (${health.overall.label.toLowerCase()}).`
      };

      const weeklyBriefing = {
        summary: `${insights.executive[0]?.executiveSummary || ''} ${insights.executive[1]?.executiveSummary || ''} ${memorySummary}`.trim(),
        wins: insights.executive.filter((item) => item.priority !== 'Low').slice(0, 2).map((item) => item.title),
        risks: insights.executive.filter((item) => item.businessImpact.toLowerCase().includes('cash') || item.businessImpact.toLowerCase().includes('profit') || item.priority === 'High').slice(0, 3).map((item) => item.title),
        recommendations: topRecommendations.map((item) => item.recommendation),
        questions: [
          'Which current recommendation creates the fastest strategic payback?',
          'Where is growth converting into value and where is it leaking?',
          'What should be approved now versus deliberately deferred?',
          'Which historical pattern is repeating and what should leadership do differently this time?'
        ]
      };

      const boardSummary = {
        title: 'Executive Intelligence Board Summary',
        summary: dailyBriefing.boardOpening,
        sections: [
          insights.executive[0]?.executiveSummary,
          insights.executive[1]?.executiveSummary,
          memorySummary,
          `Top recommendations: ${topRecommendations.map((item) => item.recommendation).join('; ')}.`
        ].filter(Boolean)
      };

      const departments = {
        ceo: {
          title: 'CEO Intelligence Narrative',
          summary: listSentence(insights.executive.slice(0, 2).map((item) => item.executiveSummary)),
          actions: topRecommendations.slice(0, 3).map((item) => item.recommendation)
        },
        cfo: {
          title: 'CFO Intelligence Narrative',
          summary: listSentence(insights.cfo.slice(0, 2).map((item) => item.executiveSummary)),
          actions: recommendations.filter((item) => item.suggestedOwner.includes('CFO')).slice(0, 3).map((item) => item.recommendation)
        },
        cmo: {
          title: 'CMO Intelligence Narrative',
          summary: listSentence(insights.cmo.slice(0, 2).map((item) => item.executiveSummary)),
          actions: recommendations.filter((item) => item.suggestedOwner.includes('CMO')).slice(0, 3).map((item) => item.recommendation)
        }
      };

      return {
        dailyBriefing,
        weeklyBriefing,
        boardSummary,
        departmentSummaries: departments
      };
    }
  });
}
