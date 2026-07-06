export const RAW_MOCK_DATA = {
  brand: {
    name: 'EP Hub',
    shell: 'Executive Operating System',
    description: 'A calm, premium executive operating system prototype for EP Golf Studios.'
  },
  ceo: {
    score: 88,
    previousScore: 84,
    trend: '+4 points vs yesterday',
    label: 'Strong overall, with a few decisions that deserve immediate attention',
    summary: 'EP Hub should now feel like an AI Chief of Staff. The business is healthy overall, but cash timing, conversion quality, approval speed, and cross-functional focus will determine whether that health strengthens or drifts.',
    executiveBriefing: {
      headline: 'Daily Executive Briefing',
      overallHealth: 'The business is in good shape overall. Demand remains healthy, marketing is creating useful momentum, and delivery capacity is stable enough to support growth without obvious strain.',
      wins: [
        'Revenue is ahead of the recent baseline, supported by premium fitting demand and stronger accessory conversion.',
        'YouTube and Instagram content are producing higher-quality reach, which is lifting website attention and enquiry volume.',
        'Open approvals are visible and prioritised rather than buried inside isolated workflows.'
      ],
      concerns: [
        'Collections timing is still the clearest short-term pressure point on flexibility.',
        'Traffic is improving faster than booking conversion, which means some marketing momentum is not yet turning into enough commercial value.',
        'Supplier cost pressure could keep softening margin if leadership attention drifts.'
      ],
      changes: [
        'Business Health Score rose 4 points since yesterday as marketing momentum and approval clarity improved.',
        'Website traffic increased after recent video activity, but booking conversion softened slightly against the traffic gain.',
        'One finance approval moved into the CEO queue because timing now matters more than routine processing.'
      ],
      priorities: [
        'Protect cash timing before making any new discretionary commitments.',
        'Approve the next highest-confidence marketing action while narrowing effort on weaker channels.',
        'Keep finance, marketing, and operations aligned around a small number of decisions that materially affect the next seven days.'
      ],
      boardSummary: 'This is not a day for more motion. It is a day for sharper prioritisation, faster approvals on the right actions, and calm pressure on the few issues that could meaningfully alter momentum.'
    },
    businessHealthScore: {
      overall: 88,
      trend: '+4 vs yesterday',
      confidence: 'Medium–High',
      direction: 'Positive, but selective action required',
      modules: [
        { module: 'Finance', score: 84, trend: '+3', summary: 'Cash and profit remain healthy overall, though collections and supplier pressure still matter.' },
        { module: 'Marketing', score: 82, trend: '+4', summary: 'Video-led and proof-led content are driving strong attention and useful demand signals.' },
        { module: 'Sales', score: 79, trend: '+1', summary: 'Pipeline quality remains stable, but pricing discipline still needs review on larger opportunities.' },
        { module: 'Customer Experience', score: 86, trend: '+2', summary: 'Satisfaction remains strong and recent reviews suggest trust is compounding.' },
        { module: 'Operations', score: 81, trend: '0', summary: 'Delivery quality is stable, with a few process improvements queued rather than urgent.' },
        { module: 'Projects', score: 77, trend: '-1', summary: 'Execution remains manageable, but prioritisation discipline needs CEO attention.' }
      ]
    },
    todayPriorities: [
      { title: 'Review 30-day cash flow forecast', detail: 'Collections timing now matters more than new discretionary commitments.', impact: 'High', urgency: 'Today', value: 'Protects £6k–£8k of short-term flexibility', owner: 'CFO', tone: 'warn' },
      { title: 'Approve the next YouTube-led campaign sequence', detail: 'The strongest-performing content engine is ready to be extended across website and email.', impact: 'High', urgency: 'Today', value: 'Potential £4k–£6k pipeline uplift', owner: 'CMO', tone: 'good' },
      { title: 'Contact the largest overdue customer', detail: 'A single overdue balance is now disproportionately shaping near-term flexibility.', impact: 'High', urgency: 'Immediate', value: 'Could accelerate £2.4k of cash receipt', owner: 'CFO / Sales', tone: 'risk' },
      { title: 'Review supplier spend concentration', detail: 'One supplier line is growing faster than margin quality can comfortably absorb.', impact: 'Medium–High', urgency: 'This morning', value: 'Potential £1.2k monthly margin recovery', owner: 'CFO / COO', tone: 'warn' },
      { title: 'Publish the LinkedIn authority article', detail: 'A professional trust-building asset is ready and complements the strongest current marketing themes.', impact: 'Medium', urgency: 'Today', value: 'Supports authority and downstream lead quality', owner: 'CMO', tone: 'good' }
    ],
    executiveKpis: [
      { label: 'Revenue', value: '£46.8k', trend: '+8.4% vs last month', body: 'Healthy top-line performance with premium demand intact.', icon: 'trending-up' },
      { label: 'Profit', value: '£11.6k', trend: '-3.1% vs last month', body: 'Still strong, though margin quality deserves attention.', icon: 'coins' },
      { label: 'Cash Position', value: '£28.1k', trend: '5.4 months runway', body: 'Strong enough for calm decisions if collections land on time.', icon: 'wallet' },
      { label: 'Website Visitors', value: '21.7k', trend: '+5.3% vs yesterday', body: 'Traffic is improving, but conversion is the more important next lever.', icon: 'grid' },
      { label: 'Leads Generated', value: '184', trend: '+11 this week', body: 'Lead quality looks constructive in the current demo scenario.', icon: 'target' },
      { label: 'Booking Conversion', value: '3.2%', trend: '-0.4 pts vs yesterday', body: 'More attention is arriving than is converting, which needs active review.', icon: 'pulse' },
      { label: 'Customer Satisfaction', value: '4.8 / 5', trend: '+0.1 vs last week', body: 'Recent feedback suggests trust and delivery quality remain strong.', icon: 'check-circle' },
      { label: 'Open Approvals', value: '12', trend: '5 need CEO review', body: 'Decision quality now depends on keeping the queue selective and fast.', icon: 'presentation' }
    ],
    businessTimeline: [
      { time: '08:05', title: 'YouTube campaign launched', body: 'A new proof-led long-form video went live and immediately lifted traffic from core audience segments.', type: 'Marketing' },
      { time: '08:40', title: 'Revenue baseline updated', body: 'Daily revenue pacing moved ahead of yesterday’s projection after stronger premium fitting demand.', type: 'Finance' },
      { time: '09:10', title: 'New five-star review received', body: 'Customer feedback reinforced premium positioning and service confidence.', type: 'Customer Experience' },
      { time: '09:35', title: 'Expense spike flagged', body: 'A supplier-related cost line moved above the comfort threshold for the current margin plan.', type: 'Finance / Operations' },
      { time: '10:00', title: 'Weekly report generated', body: 'The shared reporting layer produced the latest executive summary pack for leadership review.', type: 'Reports' },
      { time: '10:25', title: 'Approval completed', body: 'A marketing asset approval cleared, allowing follow-on scheduling to move forward.', type: 'Approvals' }
    ],
    crossDepartmentIntelligence: [
      { title: 'Traffic increased because video quality improved', body: 'Website traffic increased 18% following two YouTube uploads, generating 14 additional fitting enquiries and lifting lead quality across the week.', impact: 'Marketing → Website → Sales', tone: 'good' },
      { title: 'Revenue growth is being softened by cost pressure', body: 'Revenue improved, but profit did not rise at the same rate because supplier and support costs expanded faster than premium conversion.', impact: 'Finance → Operations', tone: 'warn' },
      { title: 'Higher reach is not fully becoming bookings', body: 'Marketing visibility is up, but booking conversion dipped slightly, suggesting the website CTA path now deserves more attention than raw traffic acquisition.', impact: 'Marketing → Website → Customer Journey', tone: 'risk' },
      { title: 'Customer trust is reinforcing demand quality', body: 'Recent positive reviews are strengthening premium positioning, which is improving the quality of traffic and enquiries rather than just increasing volume.', impact: 'Customer Experience → Marketing → Sales', tone: 'good' }
    ],
    executiveRisks: [
      { title: 'Receivables timing is reducing flexibility', severity: 'High', likelihood: 'Medium', financialImpact: '£6k–£8k cash timing pressure', mitigation: 'Escalate follow-up on concentrated overdue balances and align outgoing approvals to confirmed receipts.', department: 'Finance / Sales' },
      { title: 'Margin softness could become normalised', severity: 'Medium–High', likelihood: 'Medium', financialImpact: '£1k–£2k monthly erosion', mitigation: 'Review supplier concentration, contribution margin, and non-essential spend before next week’s plan is locked.', department: 'Finance / Operations' },
      { title: 'Traffic quality may outpace conversion quality', severity: 'Medium', likelihood: 'Medium', financialImpact: 'Lost booking upside from existing demand', mitigation: 'Refresh booking CTA paths and prioritise high-intent content-to-website journeys.', department: 'Marketing / Website' },
      { title: 'Approval queues could create passive drag', severity: 'Medium', likelihood: 'Low–Medium', financialImpact: 'Delayed value capture rather than direct cost', mitigation: 'Keep the CEO approval queue small, ranked, and explicitly time-bound.', department: 'Approvals / Leadership' }
    ],
    executiveOpportunities: [
      { title: 'Repurpose top YouTube proof content into website and email conversion assets', estimatedValue: '£4k–£6k pipeline uplift', confidence: 'Medium–High', effort: 'Medium', team: 'Marketing / Website', nextAction: 'Approve the repurposing sprint and CTA refresh this morning.' },
      { title: 'Tighten collections cadence on concentrated overdue balances', estimatedValue: '£6k–£8k cash acceleration', confidence: 'High', effort: 'Low', team: 'Finance / Sales', nextAction: 'Assign named follow-up dates and review progress before close of day.' },
      { title: 'Renegotiate the most expensive supplier relationship', estimatedValue: '£1.2k monthly margin recovery', confidence: 'Medium', effort: 'Medium', team: 'Finance / Operations', nextAction: 'Approve negotiation prep and define the acceptable term range.' },
      { title: 'Turn strong review momentum into authority content', estimatedValue: 'Higher conversion quality over the next 2–4 weeks', confidence: 'Medium', effort: 'Low–Medium', team: 'CMO / Customer Success', nextAction: 'Approve a review-led LinkedIn and website proof sequence.' }
    ],
    approvalSummary: [
      { title: 'Finance — Supplier payment sequencing', why: 'Timing matters more than routine processing because near-term flexibility is valuable this week.', impact: 'Protects cash while keeping supplier continuity intact.', risk: 'Medium', confidence: 'High' },
      { title: 'Marketing — YouTube campaign extension', why: 'The strongest-performing channel now has a credible route into more enquiries and better-quality traffic.', impact: 'Could improve reach, trust, and conversion quality together.', risk: 'Low', confidence: 'High' },
      { title: 'Sales — Pricing exception review', why: 'A larger prospective opportunity needs oversight to avoid creating poor margin precedent.', impact: 'Could preserve conversion without undermining pricing discipline.', risk: 'Medium', confidence: 'Medium' },
      { title: 'Operations — Supplier process review', why: 'Supplier concentration is now strategically relevant rather than just operational noise.', impact: 'Could reduce margin pressure and improve planning confidence.', risk: 'Low–Medium', confidence: 'Medium' },
      { title: 'HR — Capacity check for weekend demand', why: 'Delivery quality should not weaken if marketing momentum continues to lift demand.', impact: 'Protects customer experience and staff sustainability.', risk: 'Low', confidence: 'Medium' }
    ],
    departmentHealth: [
      { department: 'CFO', status: 'Stable with control actions', score: 84, trend: '+3', summary: 'Strong overall, but collections and supplier pressure deserve attention.' },
      { department: 'CMO', status: 'Momentum improving', score: 82, trend: '+4', summary: 'Video-led and proof-led content are outperforming weaker channels.' },
      { department: 'COO', status: 'Operationally calm', score: 81, trend: '0', summary: 'Execution is steady, with a few process improvements queued.' },
      { department: 'Sales', status: 'Pipeline healthy', score: 79, trend: '+1', summary: 'Demand quality is stable, though pricing discipline remains important.' },
      { department: 'Customer Success', status: 'Trust strengthening', score: 86, trend: '+2', summary: 'Recent reviews and service quality suggest strong customer confidence.' },
      { department: 'Operations', status: 'Efficient but watch supplier linkages', score: 80, trend: '-1', summary: 'Operations remain stable, but supplier-related costs are becoming more strategic.' },
      { department: 'HR', status: 'Capacity manageable', score: 78, trend: '0', summary: 'Current capacity is sufficient, but leadership should watch demand-led workload shifts.' },
      { department: 'Projects', status: 'Needs prioritisation discipline', score: 77, trend: '-1', summary: 'Project count is manageable, but sequencing still needs a firmer CEO hand.' }
    ],
    decisionCentre: {
      awaitingReview: [
        'Approve YouTube campaign extension into website and email.',
        'Decide whether to stage supplier payments against confirmed collections.',
        'Review the pricing exception on the larger sales opportunity.'
      ],
      recentlyApproved: [
        'Published premium-fitting proof carousel for social and website reuse.',
        'Moved one operations improvement sprint into active planning.',
        'Cleared the weekly executive report pack for wider review.'
      ],
      deferred: [
        'Broader expansion into lower-performing social channels.',
        'Non-essential discretionary spending beyond current quarter priorities.',
        'A longer-term tooling review that is useful but not urgent today.'
      ],
      strategic: [
        'How aggressively to optimise bookings conversion before chasing more traffic.',
        'Whether supplier concentration should trigger a negotiation cycle now.',
        'How tightly to narrow the CEO approval queue to preserve decision quality.'
      ]
    },
    askExamples: [
      { question: 'Why has revenue changed?', answer: 'Revenue is up because premium fitting demand and accessory conversion remain strong. The reason that confidence is slightly moderated is that margin has not improved at the same pace due to supplier and support cost pressure.' },
      { question: 'What is my biggest risk?', answer: 'The clearest near-term risk is receivables timing. It is the issue most likely to reduce flexibility quickly without changing the underlying strength of demand.' },
      { question: 'Which marketing campaign performed best?', answer: 'The strongest current campaign is the proof-led YouTube sequence, because it improved reach, generated higher-quality website traffic, and lifted fitting enquiries more meaningfully than weaker channels.' },
      { question: 'What should I focus on today?', answer: 'Focus on cash timing, the highest-confidence marketing approval, and keeping the approval queue small enough that strategic decisions do not get buried in routine work.' },
      { question: 'Where am I losing money?', answer: 'The business is not losing money structurally, but margin is being softened by supplier concentration, support costs, and by traffic that is not yet converting into enough bookings.' }
    ],
    charts: {
      healthTrend: { type: 'line', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [79, 80, 82, 83, 84, 86, 88], suffix: '' },
      departmentScores: { type: 'bar', labels: ['Finance', 'Marketing', 'Sales', 'Customer', 'Operations', 'Projects'], values: [84, 82, 79, 86, 81, 77], suffix: '' },
      approvalLoad: { type: 'bar', labels: ['Finance', 'Marketing', 'Sales', 'Operations', 'HR'], values: [2, 4, 1, 1, 1], suffix: '' }
    },
    boardMeeting: {
      title: 'AI Chief of Staff Board Briefing',
      summary: 'A presentation-style weekly leadership view designed for a screen, projector, or board conversation.',
      agenda: ['Executive Summary', 'KPI Slides', 'Financial Summary', 'Marketing Summary', 'Opportunities', 'Risks', 'Actions']
    },
    weeklySummaryPreview: {
      headline: 'Healthy week overall, but today’s leadership leverage sits in cash timing, conversion quality, and selective approvals.',
      body: 'Leadership can stay calm, but the best next decisions remain around collections, high-confidence marketing actions, supplier control, and keeping strategic attention focused.'
    }
  },
  cfo: {
    welcome: {
      greeting: 'Good morning, Kane.',
      title: 'Your Chief Financial Officer is ready.',
      score: 84,
      previousScore: 81,
      trend: '+3 points vs last month',
      label: 'Stable with near-term control actions',
      summary: 'The business is financially healthy overall, but collections discipline and supplier cost control will decide how much freedom EP Golf Studios has over the next six weeks.',
      narrative: 'Revenue quality is good, profit is slightly compressed by supplier and support costs, and cash remains healthy if receivables are actively managed this week.',
      snapshot: { revenue: '£46.8k', profit: '£11.6k', cash: '£28.1k', approvals: '6 waiting' }
    },
    workspace: {
      banner: { title: 'Executive Summary', body: 'EP Golf Studios is trading from a position of strength, but the smartest decisions this week are around collections, margin discipline, and approval sequencing rather than new discretionary spend.' },
      priorities: [
        { title: 'Review overdue invoices', note: 'Receivables are the fastest path to stronger short-term flexibility.', tone: 'warn' },
        { title: 'Pressure-test supplier spend', note: 'Supplier concentration is now strategically important rather than just operationally relevant.', tone: 'risk' },
        { title: 'Protect discretionary spend discipline', note: 'Cash is healthy enough for calm decisions, but not for avoidable drift.', tone: 'good' }
      ],
      businessSnapshot: [
        'Demand remains healthy with premium conversion holding up.',
        'Net profit is slightly softer than last month because costs rose faster than revenue quality improved.',
        'Cash remains comfortable if collections stay disciplined.',
        'No automation is enabled; all material actions remain approval-first.'
      ]
    },
    metrics: [
      { key: 'revenue', label: 'Revenue Summary', value: '£46.8k', trend: '+8.4% vs last month', detail: 'Revenue is ahead of plan and appears to be driven by strong fitting demand and better accessory conversion. The CFO lens is now on quality and collectability, not just volume.' },
      { key: 'profit', label: 'Profit Summary', value: '£11.6k', trend: '-3.1% vs last month', detail: 'Profit remains strong, but softer than the month before because supplier and support costs grew faster than ideal.' },
      { key: 'cash', label: 'Cash Position', value: '£28.1k', trend: '5.4 months runway', detail: 'The cash position is healthy enough for calm decision-making, provided receivables convert on time.' },
      { key: 'invoices', label: 'Outstanding Invoices', value: '£9.4k', trend: '4 overdue invoices', detail: 'A concentrated overdue balance is slowing otherwise healthy cash timing. This is one of the highest-leverage fixes available.' },
      { key: 'bills', label: 'Bills To Pay', value: '£6.1k', trend: '7 due within 10 days', detail: 'Bills are manageable, but approval sequencing should follow cash timing rather than default habits.' },
      { key: 'vat', label: 'VAT Liability', value: '£4.8k', trend: 'Provisioned', detail: 'The VAT estimate is covered in the current plan, though confidence still depends on purchase-side record quality.' },
      { key: 'forecast', label: 'Financial Forecast', value: '£49.5k', trend: 'Revenue next month', detail: 'The forecast is constructive under current assumptions, but the real value comes from challenging those assumptions actively.' },
      { key: 'supplier', label: 'Largest Supplier Spend', value: '£8.7k', trend: '+22.6% YoY', detail: 'One supplier line is now strategically meaningful. It deserves review before it becomes embedded as normal.' }
    ],
    charts: {
      revenueTrend: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [34.2, 37.1, 38.8, 41.0, 43.6, 44.2, 46.8], suffix: 'k' },
      monthlyProfit: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [8.4, 9.2, 10.1, 10.5, 11.1, 12.0, 11.6], suffix: 'k' },
      cashFlow: { type: 'line', labels: ['Now', '30d', '60d', '90d'], values: [28.1, 21.3, 24.0, 26.4], suffix: 'k' },
      expenseTrend: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [18.2, 19.1, 20.0, 21.0, 22.4, 23.1, 24.9], suffix: 'k' },
      expenseCategories: { type: 'doughnut', labels: ['Inventory', 'Support', 'Premises', 'Software', 'Travel'], values: [41, 19, 17, 13, 10], suffix: '%' },
      supplierTrend: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [5.4, 5.1, 5.9, 6.3, 7.0, 8.0, 8.7], suffix: 'k' },
      supplierSpend: { type: 'bar', labels: ['Foresight', 'Titleist', 'Trackman', 'Consumables'], values: [8.7, 5.2, 3.8, 2.4], suffix: 'k' },
      vatHistory: { type: 'bar', labels: ['Q4', 'Q1', 'Q2', 'Q3 est'], values: [3.8, 4.2, 4.4, 4.8], suffix: 'k' },
      financialForecast: { type: 'line', labels: ['Base', 'Conservative', 'Upside'], values: [12.1, 10.6, 13.8], suffix: 'k' },
      kpiGauge: { type: 'doughnut', labels: ['Health', 'Gap'], values: [84, 16], suffix: '' },
      paymentMethods: { type: 'bar', labels: ['Card', 'Transfer', 'Finance', 'Cash'], values: [54, 24, 17, 5], suffix: '%' },
      invoiceStatus: { type: 'bar', labels: ['Paid', 'Pending', 'Overdue'], values: [72, 18, 10], suffix: '%' },
      historicalScores: { type: 'line', labels: ['Q4', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [76, 77, 78, 79, 80, 81, 82, 84], suffix: '' }
    },
    forecasts: {
      revenue: '£49.5k',
      profit: '£12.1k',
      cash: '£24.0k',
      scenarios: [
        { title: 'What if collections slip by 14 days?', body: '30-day closing cash tightens materially, increasing the importance of staged outgoing approvals.' },
        { title: 'What if supplier costs rise another 5%?', body: 'Profit softens and pushes margin discipline from important to urgent.' },
        { title: 'What if bookings outperform by 10%?', body: 'Revenue improves, but the strategic test remains whether margin and cash quality rise with it.' }
      ]
    },
    suppliers: [
      { id: 'foresight-sports', name: 'Foresight Sports', spendMonth: '£8.7k', spendYtd: '£41.2k', spendLastYear: '£33.6k', yoy: '+22.6%', avgInvoice: '£2.2k', invoices: '4', lastPayment: '2026-07-01', category: 'Launch Monitors', risk: 'Medium', opportunity: 'Review terms, bundle strategy, and margin recovery potential.' },
      { id: 'titleist-trade', name: 'Titleist Trade', spendMonth: '£5.2k', spendYtd: '£28.7k', spendLastYear: '£25.4k', yoy: '+13.0%', avgInvoice: '£1.3k', invoices: '8', lastPayment: '2026-06-27', category: 'Retail Stock', risk: 'Low', opportunity: 'Improve premium mix and check stock turn contribution.' },
      { id: 'trackman-services', name: 'Trackman Services', spendMonth: '£3.8k', spendYtd: '£19.9k', spendLastYear: '£16.1k', yoy: '+23.6%', avgInvoice: '£1.9k', invoices: '3', lastPayment: '2026-06-18', category: 'Subscriptions & Support', risk: 'Medium', opportunity: 'Check usage and contract alignment versus operating value.' }
    ],
    risks: [
      { level: 'High', impact: '£6k–£8k cash timing pressure', probability: 'Medium', mitigation: 'Escalate overdue follow-up and set explicit payment dates.', owner: 'CFO', reviewDate: 'This week', trend: 'Worsening', commentary: 'Receivables concentration is the biggest near-term risk to flexibility.' },
      { level: 'Medium', impact: '£1k–£2k monthly margin erosion', probability: 'Medium', mitigation: 'Review contribution margin by supplier and category.', owner: 'CFO / COO', reviewDate: 'Next Sunday', trend: 'Stable', commentary: 'Supplier cost inflation is not dangerous yet, but it is strategically meaningful.' },
      { level: 'Medium', impact: 'Forecast confidence reduction', probability: 'Low–Medium', mitigation: 'Improve VAT and invoice coding discipline.', owner: 'Finance Ops', reviewDate: 'Month end', trend: 'Improving', commentary: 'Data quality is good enough for direction, but not perfect enough to ignore.' }
    ],
    opportunities: [
      { title: 'Speed up receivables follow-up cadence', description: 'A tighter collections rhythm is likely to pull forward £6.0k–£8.0k in cash without cutting growth activity.', revenueIncrease: '—', profitIncrease: '—', cost: 'Low', roi: 'High', timeToImplement: '1 week', confidence: 'High', strategicPriority: 'Immediate', status: 'Ready for approval', reviewDate: 'Friday', category: 'Cash Flow' },
      { title: 'Renegotiate a high-cost supplier relationship', description: 'The largest supplier line suggests room for pricing or payment-term improvement.', revenueIncrease: '—', profitIncrease: '£1.2k/month', cost: 'Low', roi: 'Medium–High', timeToImplement: '2–4 weeks', confidence: 'Medium', strategicPriority: 'High', status: 'Under review', reviewDate: 'Next Monday', category: 'Profit' },
      { title: 'Reduce low-yield discretionary operating spend', description: 'Travel and ad hoc support costs appear to be rising faster than their obvious commercial return.', revenueIncrease: '—', profitIncrease: '£900/month', cost: 'None', roi: 'High', timeToImplement: '2 weeks', confidence: 'Medium', strategicPriority: 'High', status: 'Requires decision', reviewDate: 'Wednesday', category: 'Cost Saving' }
    ],
    commentary: {
      workspace: { title: 'CFO Commentary', summary: 'The business is healthy, but the smartest decisions this week are about protecting flexibility rather than chasing more motion.', evidence: 'Revenue +8.4%, profit -3.1%, cash runway 5.4 months, supplier concentration elevated, overdue invoices still meaningful.', confidence: 'High', impact: 'Faster collections and better supplier discipline could improve both margin quality and short-term optionality.', risks: 'If the business focuses only on top-line confidence, it may underreact to soft margin compression.', alternatives: 'Push for more volume, hold the line temporarily, or slow selective spending while protecting high-return activity.', action: 'Approve collections escalation, review top supplier terms, and keep discretionary operating spend tightly controlled.', missing: 'Live bank, invoice, and booking integrations are intentionally deferred.', followUp: ['What if collections slip another 14 days?', 'Which supplier is actually hurting margin most?', 'Can we fund another investment this month?'] },
      revenue: { title: 'Revenue Commentary', summary: 'Revenue is encouraging, but quality still matters more than volume alone.', evidence: 'Monthly revenue ahead of plan, premium conversion up, and year-on-year growth healthy in placeholder data.', confidence: 'High', impact: 'Stronger revenue supports strategic freedom only if it improves profit and cash conversion too.', risks: 'Revenue strength could mask collection weakness or margin softness.', alternatives: 'Lean into volume, protect premium mix, or prioritise higher-conversion demand only.', action: 'Track revenue alongside invoice status and gross margin, not as a standalone success number.', missing: 'Bookings Dashboard integration is not connected yet.', followUp: ['Is the revenue mix improving margin?', 'How much is still uncollected?', 'What does next month look like?'] },
      profit: { title: 'Profit Commentary', summary: 'Profit remains solid, but cost pressure is reducing how much strategic confidence revenue growth should create.', evidence: 'Net profit down 3.1% month on month while supplier and support costs rose faster than ideal.', confidence: 'High', impact: 'If margin softness continues for another cycle, the business will feel richer than it actually is.', risks: 'Top-line celebration could delay necessary cost or supplier action.', alternatives: 'Absorb pressure temporarily, renegotiate upstream, or reduce lower-value spend.', action: 'Protect gross margin first, then challenge discretionary and supplier-heavy lines.', missing: 'Live invoice-level and supplier-level profitability data is not connected yet.', followUp: ['Which cost centre moved most?', 'Can margin recover without cutting growth?', 'Where is the easiest profit gain?'] },
      expenses: { title: 'Expense Commentary', summary: 'Expense growth is manageable, but several variable lines are becoming habits rather than choices.', evidence: 'Monthly expenses +6.8% with visible contractor, travel, and support drift.', confidence: 'Medium–High', impact: 'Early action could protect roughly £900+ monthly without impairing performance.', risks: 'Overreacting can cut useful capability; underreacting can normalise waste.', alternatives: 'Freeze discretionary spend, reclassify first, or selectively trim low-yield lines.', action: 'Review variable costs one by one and preserve only those with clear operating or commercial return.', missing: 'Live expense categorisation feeds remain intentionally offline.', followUp: ['What spend is strategic?', 'What is just drift?', 'What would I cut last?'] },
      suppliers: { title: 'Supplier Commentary', summary: 'Supplier spend is not yet dangerous, but it has become strategically important enough to justify explicit executive attention.', evidence: 'Top supplier +22.6% YoY, overall supplier costs rising faster than comfort allows, profit slightly softer.', confidence: 'Medium–High', impact: 'Improved terms or more disciplined buying could meaningfully lift margin and cash timing.', risks: 'Challenging suppliers without understanding dependency may reduce service quality or availability.', alternatives: 'Renegotiate, consolidate, reduce order frequency, or accept current terms temporarily.', action: 'Review the top three supplier relationships individually and decide which ones warrant negotiation now.', missing: 'Contract-level and inventory-linked supplier intelligence is not connected yet.', followUp: ['Which supplier matters most?', 'Where is pricing leverage strongest?', 'Can we improve payment timing?'] },
      cash: { title: 'Cash Flow Commentary', summary: 'Cash is strong enough to support calm decisions, but timing discipline still matters more than the headline balance alone.', evidence: 'Current cash £28.1k, 30-day close £21.3k, overdue invoices materially affecting flexibility.', confidence: 'High', impact: 'Collections improvement could increase decision freedom immediately without reducing growth activity.', risks: 'Supplier and tax timing could narrow the comfort zone faster than expected if receipts slip again.', alternatives: 'Hold spend steady, escalate collections, or stage outgoing commitments more conservatively.', action: 'Protect incoming timing first, then align outgoing approvals against confirmed receipts.', missing: 'Live banking feeds and settlement-level inflow data are not connected yet.', followUp: ['What weakens the 30-day view most?', 'Can we fund a new investment?', 'What approvals should wait?'] },
      vat: { title: 'VAT Commentary', summary: 'The VAT estimate appears manageable, but process confidence matters as much as the number itself.', evidence: 'Current estimate provisioned, with historical range broadly stable but still dependent on record completeness.', confidence: 'Medium', impact: 'Good VAT discipline improves planning confidence and reduces avoidable surprises.', risks: 'Late or misclassified purchase records reduce the reliability of both VAT and cash planning.', alternatives: 'Increase monthly controls, retain current pace, or defer clean-up until submission week.', action: 'Tighten purchase-side record discipline ahead of the next cycle.', missing: 'No live bookkeeping integration is connected in this sprint.', followUp: ['How sensitive is the estimate?', 'What if invoices arrive late?', 'How much buffer do we need?'] },
      forecasting: { title: 'Forecast Commentary', summary: 'The forecast is helpful because it frames choices, not because it predicts the future perfectly.', evidence: 'Positive revenue outlook, stable cash view, and scenario planning anchored on margin and collections assumptions.', confidence: 'Medium', impact: 'Better assumption discipline improves investment timing and approval quality.', risks: 'False precision can make the team less curious about what could go wrong.', alternatives: 'Use optimistic, conservative, or scenario-weighted planning.', action: 'Challenge the handful of assumptions that move the forecast most.', missing: 'Live pipeline, banking, and bookkeeping feeds are intentionally absent.', followUp: ['What breaks the plan first?', 'What improves it most?', 'What investment is safest?'] }
    },
    decisionJournal: [
      { id: 'DJ-017', date: '2026-07-03', executive: 'CFO', recommendation: 'Escalate overdue receivable follow-up on four concentrated invoices.', reasoning: 'Cash flexibility is being constrained by a small number of slow-paying balances.', evidence: '£9.4k outstanding, four overdue invoices, 30-day cash forecast depends on collections.', alternatives: 'Wait another week, or stage payables more conservatively instead.', decision: 'Pending approval', outcome: 'Awaiting decision', impact: 'Potential £6k–£8k cash acceleration', confidence: 'High', lessons: 'Collections cadence should tighten before balances become concentrated.', reviewDate: '2026-07-10', status: 'Pending' },
      { id: 'DJ-016', date: '2026-06-29', executive: 'CFO', recommendation: 'Review one major supplier relationship for margin protection.', reasoning: 'Supplier spend has risen faster than gross profit contribution.', evidence: 'Largest supplier up +22.6% YoY, margin softening 3.1% MoM.', alternatives: 'Absorb the cost, pass through selectively, or reduce order volume.', decision: 'Approved', outcome: 'Negotiation prep underway', impact: 'Estimated £1.2k monthly margin upside', confidence: 'Medium', lessons: 'Supplier concentration should be reviewed before it becomes embedded.', reviewDate: '2026-07-21', status: 'Active' },
      { id: 'DJ-015', date: '2026-06-18', executive: 'CFO', recommendation: 'Hold discretionary support costs flat for one cycle.', reasoning: 'Contractor and support spend drifted above the planned baseline.', evidence: 'Expense trend up 6.8% with unclear operating return on part of spend.', alternatives: 'Immediate reduction, continue unchanged, or reclassify first.', decision: 'Approved', outcome: 'Expense drift stabilised', impact: 'Avoided roughly £900 monthly cost escalation', confidence: 'Medium', lessons: 'Small discretionary lines need explicit ownership before they compound.', reviewDate: '2026-08-01', status: 'Reviewed' }
    ],
    weeklyBriefing: {
      summary: 'EP Golf Studios enters the week from a position of financial strength, but margin quality and collections speed remain the most important control levers for protecting strategic flexibility.',
      wins: ['Revenue remains ahead of the recent baseline.', 'Cash headroom is healthy enough to avoid reactive decisions.', 'Expense drift is visible early, which means it can still be managed calmly.'],
      risks: ['Receivables timing remains too concentrated.', 'Supplier spend is growing faster than comfort allows.', 'Forecast confidence still depends on better categorisation discipline.'],
      recommendations: ['Approve overdue receivables escalation plan.', 'Pressure-test the biggest supplier line before the next purchasing cycle.', 'Hold discretionary operating spend steady until profit quality improves.'],
      questions: ['Which current spend lines are genuinely strategic versus merely habitual?', 'If growth remains strong but margin weakens, what should be slowed first?', 'What assumptions in the 30/60/90 day cash view need the closest challenge?']
    },
    kpis: {
      groups: [
        ['Revenue', [['Revenue this month', '£46.8k'], ['YoY growth', '+14.2%'], ['Revenue forecast', '£49.5k']]],
        ['Profitability', [['Gross margin', '51.5%'], ['Net margin', '24.8%'], ['Net profit', '£11.6k']]],
        ['Cash', [['Cash balance', '£28.1k'], ['Runway', '5.4 months'], ['30d close', '£21.3k']]],
        ['Working Capital', [['Outstanding invoices', '£9.4k'], ['Bills due', '£6.1k'], ['Collections risk', 'Medium']]],
        ['Operating KPIs', [['Supplier concentration', 'Elevated'], ['Expense drift', '+6.8%'], ['Approvals active', '6']]],
        ['Growth KPIs', [['Bookings confidence', 'Placeholder'], ['Premium mix', 'Improving'], ['Repeat demand', 'Stable']]]
      ],
      weights: [
        { title: 'Profit quality', weight: '25%', note: 'Margin strength and conversion quality.' },
        { title: 'Cash resilience', weight: '25%', note: 'Liquidity and timing confidence.' },
        { title: 'Working capital control', weight: '20%', note: 'Receivables, payables, and operational discipline.' },
        { title: 'Growth quality', weight: '15%', note: 'Growth that supports long-term health.' },
        { title: 'Governance confidence', weight: '15%', note: 'Approval-first control and reasoning transparency.' }
      ]
    }
  },
  cmo: {
    dashboard: {
      healthScore: 82,
      previousScore: 78,
      trend: '+4 points vs last month',
      summary: 'Marketing is performing well overall, with YouTube and Instagram driving the strongest momentum. Website traffic and lead quality are improving, while email and LinkedIn need more consistency.',
      metrics: {
        followers: '128.4k',
        views: '1.86M',
        engagement: '74.2k',
        visitors: '21.7k',
        signups: '462',
        leads: '184',
        enquiries: '73'
      },
      bestPlatform: 'YouTube',
      worstPlatform: 'X (Twitter)',
      opportunities: [
        'Turn high-performing YouTube proof content into Instagram and LinkedIn sequences.',
        'Strengthen website conversion paths from social traffic into fitting enquiries.',
        'Increase email list growth by using top-performing educational content as lead magnets.'
      ],
      risks: [
        'X is absorbing time without creating strong growth or engagement quality.',
        'Email output is stable but not yet compounding as strongly as website and video.',
        'Without clear approval sequencing, marketing actions may become fragmented rather than strategic.'
      ],
      pendingApprovals: [
        'Publish social proof carousel',
        'Approve next YouTube video cut',
        'Schedule weekly email campaign',
        'Update conversion CTA on fitting landing page'
      ],
      weeklyBriefing: 'Marketing enters the week from a strong position. Video-led proof content and educational assets are driving the best traction, while the next growth lift is likely to come from stronger conversion pathways and better repurposing discipline.',
      aiSummary: {
        title: 'AI Marketing Summary',
        summary: 'Marketing momentum is healthy, but the highest-value next moves are about doubling down on the strongest channels and tightening weak conversion points.',
        evidence: 'YouTube leads platform rankings, Instagram is the strongest visual growth channel, website traffic is up, and booking enquiries are improving.',
        confidence: 'High',
        impact: 'Improved channel focus could increase lead quality and reduce wasted effort across weaker platforms.',
        risks: 'Spreading energy too evenly across all platforms could reduce the return from the strongest channels.',
        alternatives: 'Prioritise video, prioritise conversion optimisation, or continue with a balanced but slower multi-channel approach.',
        action: 'Prioritise YouTube, Instagram, and website conversion work. Keep weaker platforms on a lighter, more selective cadence.',
        missing: 'No live platform or attribution integrations are connected in this sprint.',
        followUp: ['Which channel deserves the next content push?', 'What content is actually driving leads?', 'Where is marketing wasting effort?']
      }
    },
    socialOverview: {
      combined: {
        followers: '128.4k',
        views: '1.86M',
        reach: '1.12M',
        engagement: '74.2k',
        gained: '+6.3k',
        growth: '+5.2%'
      },
      rankings: [
        { platform: 'YouTube', score: 92, growth: '+8.4%', note: 'Best-performing long-form proof channel.' },
        { platform: 'Instagram', score: 88, growth: '+7.1%', note: 'Strong visual engagement and follower growth.' },
        { platform: 'Facebook', score: 76, growth: '+3.8%', note: 'Solid reach but less efficient engagement quality.' },
        { platform: 'LinkedIn', score: 71, growth: '+2.9%', note: 'Authority-building potential, but posting cadence is inconsistent.' },
        { platform: 'X (Twitter)', score: 58, growth: '+1.1%', note: 'Conversation presence exists, but return remains limited.' }
      ],
      topContent: { title: 'YouTube: “Driver Fitting Truths Every Golfer Should Know”', platform: 'YouTube', metric: '182k views / 11.8k engagement' },
      lowestContent: { title: 'X thread: “Weekly fitting notes”', platform: 'X', metric: '8.2k impressions / 0.8% engagement' }
    },
    platforms: {
      youtube: {
        label: 'YouTube',
        health: 'High-performing authority channel',
        stats: [
          ['Subscribers', '42.6k'],
          ['Views', '784k'],
          ['Reach', '462k'],
          ['Impressions', '1.21M'],
          ['Likes', '26.4k'],
          ['Comments', '2.8k'],
          ['Shares', '1.3k'],
          ['Watch Time', '38.7k hrs'],
          ['Click Through Rate', '5.9%'],
          ['Engagement Rate', '6.4%'],
          ['Audience Growth', '+8.4%'],
          ['Posting Frequency', '2 long-form / 3 shorts weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [35.4, 36.2, 37.5, 38.9, 40.1, 41.2, 42.6], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [420, 466, 492, 544, 618, 702, 784], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [16, 17.4, 18.1, 19.3, 21.0, 24.2, 26.4], suffix: 'k' }
        },
        topContent: [
          'Driver Fitting Truths Every Golfer Should Know',
          'Why Most Players Buy the Wrong Shaft',
          'Inside a Premium Fitting Session at EP Golf Studios'
        ],
        recentPosts: ['Short: Launch monitor myth', 'Video: Wedge fitting breakdown', 'Short: Ball speed test']
      },
      instagram: {
        label: 'Instagram',
        health: 'Fast-moving visual growth channel',
        stats: [
          ['Followers', '31.8k'],
          ['Views', '422k'],
          ['Reach', '278k'],
          ['Impressions', '540k'],
          ['Likes', '18.9k'],
          ['Comments', '1.7k'],
          ['Shares', '2.6k'],
          ['Watch Time', '14.2k hrs'],
          ['Click Through Rate', '3.1%'],
          ['Engagement Rate', '7.2%'],
          ['Audience Growth', '+7.1%'],
          ['Posting Frequency', '5 reels / 4 stories weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [24.8, 25.6, 26.9, 28.1, 29.5, 30.6, 31.8], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [186, 208, 236, 272, 316, 358, 422], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [10.2, 11.3, 12.8, 14.4, 15.2, 16.8, 18.9], suffix: 'k' }
        },
        topContent: ['Reel: Iron fitting before / after', 'Carousel: What a real fitting changes', 'Reel: Ball flight proof clip'],
        recentPosts: ['Story: Studio day', 'Carousel: Fitting outcomes', 'Reel: Shaft test highlight']
      },
      facebook: {
        label: 'Facebook',
        health: 'Reliable community reach channel',
        stats: [
          ['Followers', '26.1k'],
          ['Views', '314k'],
          ['Reach', '204k'],
          ['Impressions', '418k'],
          ['Likes', '11.6k'],
          ['Comments', '1.1k'],
          ['Shares', '1.9k'],
          ['Watch Time', '8.6k hrs'],
          ['Click Through Rate', '2.6%'],
          ['Engagement Rate', '5.1%'],
          ['Audience Growth', '+3.8%'],
          ['Posting Frequency', '4 posts weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [22.5, 23.0, 23.7, 24.4, 25.0, 25.6, 26.1], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [168, 182, 199, 214, 238, 276, 314], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [7.8, 8.4, 9.0, 9.5, 10.1, 10.8, 11.6], suffix: 'k' }
        },
        topContent: ['Post: Client fitting win', 'Video clip: Driver session proof', 'Photo set: Premium fitting setup'],
        recentPosts: ['Photo: Studio detail', 'Post: Booking CTA', 'Video: Club comparison']
      },
      linkedin: {
        label: 'LinkedIn',
        health: 'Emerging authority-building channel',
        stats: [
          ['Followers', '18.7k'],
          ['Views', '196k'],
          ['Reach', '128k'],
          ['Impressions', '244k'],
          ['Likes', '6.2k'],
          ['Comments', '0.8k'],
          ['Shares', '0.7k'],
          ['Watch Time', '3.4k hrs'],
          ['Click Through Rate', '2.2%'],
          ['Engagement Rate', '4.6%'],
          ['Audience Growth', '+2.9%'],
          ['Posting Frequency', '2 posts weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [16.1, 16.4, 16.9, 17.3, 17.8, 18.2, 18.7], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [118, 124, 132, 148, 162, 179, 196], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [3.4, 3.8, 4.2, 4.6, 5.0, 5.6, 6.2], suffix: 'k' }
        },
        topContent: ['Article: The premium fitting difference', 'Post: Why trust matters in equipment choices', 'Carousel: Business lessons from fitting sessions'],
        recentPosts: ['Post: Customer trust angle', 'Article: Fitting quality', 'Update: Brand positioning']
      },
      x: {
        label: 'X (Twitter)',
        health: 'Lower-return awareness channel',
        stats: [
          ['Followers', '9.2k'],
          ['Views', '146k'],
          ['Reach', '52k'],
          ['Impressions', '238k'],
          ['Likes', '2.7k'],
          ['Comments', '0.2k'],
          ['Shares', '0.4k'],
          ['Watch Time', '1.1k hrs'],
          ['Click Through Rate', '1.2%'],
          ['Engagement Rate', '2.1%'],
          ['Audience Growth', '+1.1%'],
          ['Posting Frequency', '6 short posts weekly']
        ],
        charts: {
          followers: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [8.3, 8.4, 8.6, 8.7, 8.9, 9.0, 9.2], suffix: 'k' },
          views: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [118, 122, 124, 128, 134, 140, 146], suffix: 'k' },
          engagement: { type: 'bar', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [1.9, 2.0, 2.1, 2.2, 2.4, 2.5, 2.7], suffix: 'k' }
        },
        topContent: ['Post: Quick fitting take', 'Thread: Equipment notes', 'Clip: Short proof snippet'],
        recentPosts: ['Short post: Studio thought', 'Thread: Fitting insights', 'Clip: Product reaction']
      }
    },
    charts: {
      platformComparison: { type: 'bar', labels: ['YouTube', 'Instagram', 'Facebook', 'LinkedIn', 'X'], values: [92, 88, 76, 71, 58], suffix: '' },
      followerGrowth: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [96.2, 101.1, 106.4, 112.2, 118.5, 122.1, 128.4], suffix: 'k' },
      totalViews: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [1012, 1102, 1183, 1306, 1468, 1621, 1862], suffix: 'k' },
      engagementMix: { type: 'doughnut', labels: ['Likes', 'Comments', 'Shares', 'Clicks'], values: [52, 11, 14, 23], suffix: '%' },
      websiteTraffic: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [15.2, 16.1, 17.5, 18.9, 19.8, 20.6, 21.7], suffix: 'k' },
      emailGrowth: { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [5.8, 6.0, 6.3, 6.7, 7.1, 7.4, 7.9], suffix: 'k' },
      emailPerformance: { type: 'bar', labels: ['Open Rate', 'Click Rate', 'Unsubscribe Rate'], values: [42.4, 5.8, 0.6], suffix: '%' },
      campaignROI: { type: 'bar', labels: ['Fitting Proof Series', 'Summer Driver Push', 'Lead Magnet Email', 'Studio Launch Reel'], values: [4.8, 3.9, 3.2, 2.6], suffix: 'x' },
      websiteConversions: { type: 'bar', labels: ['Bookings', 'Contact Forms', 'Email Sign-ups'], values: [73, 58, 462], suffix: '' }
    },
    websiteAnalytics: {
      metrics: [
        ['Website Visitors', '21.7k'],
        ['Sessions', '28.4k'],
        ['Users', '18.9k'],
        ['New Users', '12.4k'],
        ['Returning Visitors', '6.5k'],
        ['Average Session Duration', '2m 41s'],
        ['Bounce Rate', '38.6%'],
        ['Conversion Rate', '3.2%'],
        ['Fitting Bookings', '73'],
        ['Contact Form Enquiries', '58'],
        ['Email Sign-ups', '462']
      ],
      summary: 'Website performance is healthy. Traffic quality is improving, and the strongest upside now comes from improving conversion paths rather than simply chasing more visits.'
    },
    emailMarketing: {
      metrics: [
        ['Subscribers', '7.9k'],
        ['Subscriber Growth', '+6.8%'],
        ['Campaigns Sent', '6'],
        ['Open Rate', '42.4%'],
        ['Click Rate', '5.8%'],
        ['Unsubscribe Rate', '0.6%'],
        ['Email Sign-ups', '462'],
        ['Best Performing Campaign', 'Fitting Myths Debunked'],
        ['Lowest Performing Campaign', 'Weekly Equipment Round-up']
      ],
      bestCampaign: 'Fitting Myths Debunked',
      worstCampaign: 'Weekly Equipment Round-up',
      summary: 'Email is stable and useful, but the next growth step is to make it feel more like a strategic conversion engine than a support channel.'
    },
    campaignPerformance: {
      activeCampaigns: 4,
      completedCampaigns: 9,
      roi: '3.7x avg',
      leads: '184',
      revenueAttribution: '£18.6k',
      conversionRate: '3.9%',
      engagement: '6.8%',
      campaigns: [
        { title: 'Fitting Proof Series', stage: 'Active', roi: '4.8x', leads: '58', revenue: '£6.7k', conversion: '4.4%', engagement: '8.2%' },
        { title: 'Summer Driver Push', stage: 'Active', roi: '3.9x', leads: '41', revenue: '£4.9k', conversion: '4.1%', engagement: '6.9%' },
        { title: 'Lead Magnet Email', stage: 'Completed', roi: '3.2x', leads: '36', revenue: '£3.1k', conversion: '3.6%', engagement: '5.4%' },
        { title: 'Studio Launch Reel', stage: 'Completed', roi: '2.6x', leads: '22', revenue: '£2.4k', conversion: '2.8%', engagement: '7.1%' }
      ]
    },
    contentLibrary: {
      items: [
        { title: 'Driver Fitting Truths Every Golfer Should Know', type: 'Video', publishDate: '2026-07-02', platform: 'YouTube', views: '182k', engagement: '11.8k', rating: 'A' },
        { title: 'What a Premium Fitting Changes', type: 'Carousel', publishDate: '2026-07-01', platform: 'Instagram', views: '64k', engagement: '6.2k', rating: 'A' },
        { title: 'Why Trust Matters in Club Fitting', type: 'Blog Post', publishDate: '2026-06-28', platform: 'Website', views: '8.4k', engagement: '1.1k', rating: 'B' },
        { title: 'Fitting Myths Debunked', type: 'Email Campaign', publishDate: '2026-06-26', platform: 'Email', views: '7.1k', engagement: '2.9k', rating: 'A' },
        { title: 'Ball Flight Test Short', type: 'Short', publishDate: '2026-06-25', platform: 'YouTube', views: '94k', engagement: '5.7k', rating: 'A' },
        { title: 'Studio Day Story Sequence', type: 'Social Post', publishDate: '2026-06-24', platform: 'Instagram', views: '28k', engagement: '2.1k', rating: 'B' },
        { title: 'Weekly Equipment Round-up', type: 'Email Campaign', publishDate: '2026-06-22', platform: 'Email', views: '4.2k', engagement: '1.1k', rating: 'C' },
        { title: 'Premium Fitting Lessons for Business', type: 'LinkedIn Article', publishDate: '2026-06-20', platform: 'LinkedIn', views: '12k', engagement: '1.6k', rating: 'B' }
      ]
    },
    competitorAnalysis: {
      competitors: [
        { name: 'Club Champion UK', rank: 1, growth: '+7.2%', frequency: 'High', engagement: 'Strong', opportunity: 'Position against scale by leaning into premium trust and expertise.', threat: 'Large content footprint and high awareness.' },
        { name: 'Precision Golf', rank: 2, growth: '+5.6%', frequency: 'Medium', engagement: 'Strong', opportunity: 'Differentiate with clearer educational proof content.', threat: 'Consistent premium authority tone.' },
        { name: 'My Golf Matters', rank: 3, growth: '+4.8%', frequency: 'High', engagement: 'Medium', opportunity: 'Outperform with better quality control and stronger brand polish.', threat: 'High publishing cadence.' },
        { name: 'SGGT', rank: 4, growth: '+3.9%', frequency: 'Medium', engagement: 'Medium', opportunity: 'Win on trust, clarity, and better conversion framing.', threat: 'Niche relevance in parts of the audience.' }
      ],
      opportunities: ['Use proof-led content to stand apart from higher-volume competitors.', 'Own premium education and trust positioning more aggressively.', 'Create more reusable flagship content instead of spreading effort thinly.'],
      threats: ['Competitors with higher publishing frequency may dominate attention.', 'If EP content cadence slips, the strongest brand position may still underperform in reach.', 'Higher-volume brands can win by sheer output unless EP stays clear and distinctive.']
    },
    marketingCalendar: {
      events: [
        { date: 'Mon 6 Jul', type: 'Video', title: 'Launch driver fitting myth-busting short', owner: 'CMO', status: 'Ready for approval' },
        { date: 'Tue 7 Jul', type: 'Email Campaign', title: 'Send “Fitting Myths Debunked” follow-up email', owner: 'Marketing Ops', status: 'Draft' },
        { date: 'Wed 8 Jul', type: 'Social Posts', title: 'Instagram carousel + Facebook proof post', owner: 'Content Lead', status: 'Queued' },
        { date: 'Thu 9 Jul', type: 'Website Update', title: 'Refresh fitting landing page CTA block', owner: 'Website Lead', status: 'Needs approval' },
        { date: 'Fri 10 Jul', type: 'Event', title: 'Weekend fitting push creative review', owner: 'CMO', status: 'Scheduled' },
        { date: 'Sun 12 Jul', type: 'Weekly Briefing', title: 'Prepare weekly marketing briefing', owner: 'AI Marketing Advisor', status: 'Placeholder' }
      ]
    },
    aiMarketingAdvisor: {
      executiveSummary: {
        title: 'AI Marketing Advisor',
        summary: 'Marketing is in a strong position, but the biggest upside comes from focusing harder on top-performing channels and sharpening conversion paths between content, traffic, and enquiries.',
        evidence: 'YouTube ranks first, Instagram is the strongest visual growth platform, website traffic is up, and booking enquiries are improving.',
        confidence: 'High',
        impact: 'A more concentrated channel strategy should improve lead quality and reduce lower-value content effort.',
        risks: 'Overextending into too many platforms could dilute the return from the strongest content formats.',
        alternatives: 'Scale video-first output, optimise for conversion first, or continue with a broad but slower channel mix.',
        action: 'Prioritise video-led proof content, reinforce website conversion pathways, and stage weaker channels for lighter-touch maintenance.',
        missing: 'Live attribution, live GA4, and platform-native performance APIs remain intentionally unconnected.',
        followUp: ['What content should we make next?', 'Which platform deserves more budget?', 'Where is the biggest conversion leak?']
      },
      weeklyBriefing: 'This week’s marketing outlook is positive. The smartest next moves are to back YouTube and Instagram more aggressively, strengthen conversion points on the website, and use email more strategically as a conversion layer rather than a background channel.',
      recommendedCampaigns: [
        { title: 'Proof-led premium fitting series', confidence: 'High', impact: 'High', evidence: 'Video and social proof content are producing the strongest engagement quality.', risks: 'Requires disciplined production quality.', alternatives: 'Short-form-only approach or educational email-led sequence.' },
        { title: 'Landing page conversion refresh', confidence: 'Medium–High', impact: 'High', evidence: 'Website traffic is healthy enough to justify conversion optimisation work.', risks: 'Improvement may be limited if messaging is not strong enough.', alternatives: 'More traffic acquisition or heavier email capture work first.' }
      ],
      contentIdeas: ['“What a real fitting changes” video series', 'Instagram carousel: fitting myths vs reality', 'LinkedIn article: premium trust in golf performance'],
      seoSuggestions: ['Build more pages around fitting outcomes, shaft fitting, and premium fitting trust.', 'Strengthen internal linking from educational content into booking pages.'],
      aeoSuggestions: ['Create concise Q&A content around golf fitting questions.', 'Structure key proof points more clearly for answer-engine visibility.'],
      videoIdeas: ['Driver fitting myths', 'Before / after launch monitor proof', 'Premium fitting session breakdown'],
      opportunities: ['Repurpose strong YouTube content into higher-frequency social assets.', 'Turn educational posts into better email sign-up magnets.', 'Use social proof more directly on the website.'],
      risks: ['Weak channels continue to consume time.', 'Website traffic may not convert strongly enough without UX/CTA refinement.', 'Campaign effort may become fragmented if approvals are not prioritised.'],
      missingInformation: ['True cross-channel attribution', 'Live platform post-level data', 'Real website event-level conversion data'],
      suggestedActions: ['Approve the proof-led video content series', 'Refresh fitting CTA messaging', 'Reduce X cadence and redeploy effort into YouTube / Instagram']
    },
    reports: {
      summary: 'Marketing reports should package platform movement, content performance, website impact, campaign results, source coverage, risks, and the next recommended actions into a leadership-ready narrative.',
      sections: ['Weekly marketing briefing', 'GA4 website summary', 'YouTube summary', 'Cross-channel findings', 'Content performance highlights', 'Website and lead generation movement', 'Executive actions and approvals']
    },
    settings: {
      placeholders: ['Platform weighting', 'Default reporting views', 'Approval preferences', 'Weekly briefing cadence', 'Content scoring logic', 'Future API connections'],
      integrations: ['YouTube', 'Instagram', 'Facebook', 'LinkedIn', 'X', 'Google Analytics', 'Mailchimp', 'Gmail']
    }
  },
  operations: {
    providerSummary: {
      label: 'Demo fallback active',
      body: 'Operations Calendar is currently using structured demo Google Calendar data until a local OAuth-backed snapshot is available.',
      tone: 'warn',
      state: 'demo-fallback',
      calendarName: 'EP Golf Studios Operations',
      syncedAt: null,
      health: 'Awaiting configuration',
      mode: 'demo',
      syncInterval: '15 minutes'
    },
    summary: {
      headline: 'Today includes 4 fittings, 3 meetings, and 3 open booking slots.',
      body: 'Today includes 4 fittings, 3 meetings, one deadline, and one travel block. Capacity is healthy overall, but the afternoon has one back-to-back pressure point.',
      dailySummary: 'First appointment starts at 08:30, last appointment ends at 18:15, with 4 fittings, 3 meetings, 3 open booking slots, and one scheduling conflict to watch.',
      boardSummary: 'Operations are stable overall. Today carries 4 fittings, 3 meetings, 3 open booking slots, and one late-afternoon capacity risk that should be watched closely.'
    },
    metrics: {
      todaysSchedule: 8,
      totalMeetings: 3,
      totalFittings: 4,
      capacityTodayPct: 72,
      capacityThisWeekPct: 81,
      availableBookingSlots: 3,
      schedulingRisks: 2,
      freeCapacityHours: 3.5,
      backToBackCount: 2,
      largeGaps: 1,
      deadlines: 2,
      staffAvailable: 3
    },
    widgets: [
      { iconName: 'calendar', label: "Today's Schedule", value: '8 items', body: 'Four fittings, three meetings, and one travel/admin block are visible today.', meta: 'Operations' },
      { iconName: 'arrowRight', label: 'Next Appointment', value: '08:30 Driver fitting', body: 'James Archer arrives first, so the studio day starts with revenue-relevant demand rather than internal admin.', meta: 'Studio Bay 1' },
      { iconName: 'pulse', label: 'Capacity Today', value: '72%', body: 'Today is busy but still leaves controlled room for one to three more high-value bookings.', meta: '3.5h free' },
      { iconName: 'grid', label: 'Capacity This Week', value: '81%', body: 'This week is commercially healthy, though Thursday and Saturday are now close to full.', meta: '2 high-load days' },
      { iconName: 'target', label: 'Available Booking Slots', value: '3', body: 'Three viable booking windows are still available without damaging service quality.', meta: 'Today + tomorrow' },
      { iconName: 'alert-triangle', label: 'Scheduling Risks', value: '2', body: 'One back-to-back stretch and one compressed late finish are the main operating watchpoints.', meta: 'Ops watchlist' }
    ],
    todaySchedule: [
      { id: 'ops-demo-1', title: 'Driver fitting — James Archer', type: 'Fitting', startAt: '2026-07-05T08:30:00.000Z', endAt: '2026-07-05T09:45:00.000Z', startTime: '08:30', endTime: '09:45', date: '2026-07-05', durationMinutes: 75, location: 'Studio Bay 1', staff: 'Kane', customer: 'James Archer', priority: 'High', status: 'Confirmed', body: 'Premium driver fitting with clear booking intent and strong revenue relevance.', route: '/operations' },
      { id: 'ops-demo-2', title: 'Daily leadership huddle', type: 'Meeting', startAt: '2026-07-05T10:00:00.000Z', endAt: '2026-07-05T10:30:00.000Z', startTime: '10:00', endTime: '10:30', date: '2026-07-05', durationMinutes: 30, location: 'Office', staff: 'Kane / Ops', customer: '', priority: 'Medium', status: 'Scheduled', body: 'Operations, finance, and marketing check-in to align the day.', route: '/operations' },
      { id: 'ops-demo-3', title: 'Iron fitting — Noah Bennett', type: 'Fitting', startAt: '2026-07-05T11:00:00.000Z', endAt: '2026-07-05T12:15:00.000Z', startTime: '11:00', endTime: '12:15', date: '2026-07-05', durationMinutes: 75, location: 'Studio Bay 2', staff: 'Kane', customer: 'Noah Bennett', priority: 'High', status: 'Confirmed', body: 'After-work customer moved into a daytime slot; high booking value and likely equipment follow-up.', route: '/operations' },
      { id: 'ops-demo-4', title: 'Supplier service call — TrackMan', type: 'Meeting', startAt: '2026-07-05T12:30:00.000Z', endAt: '2026-07-05T13:00:00.000Z', startTime: '12:30', endTime: '13:00', date: '2026-07-05', durationMinutes: 30, location: 'Video call', staff: 'Kane', customer: '', priority: 'Medium', status: 'Scheduled', body: 'Service continuity and contract timing review.', route: '/operations' },
      { id: 'ops-demo-5', title: 'Gap fitting — Charlotte Dean', type: 'Fitting', startAt: '2026-07-05T14:00:00.000Z', endAt: '2026-07-05T15:00:00.000Z', startTime: '14:00', endTime: '15:00', date: '2026-07-05', durationMinutes: 60, location: 'Studio Bay 1', staff: 'Kane', customer: 'Charlotte Dean', priority: 'High', status: 'Confirmed', body: 'Shorter fitting slot with strong same-week commercial intent.', route: '/operations' },
      { id: 'ops-demo-6', title: 'Travel block — supplier pickup', type: 'Travel', startAt: '2026-07-05T15:15:00.000Z', endAt: '2026-07-05T15:45:00.000Z', startTime: '15:15', endTime: '15:45', date: '2026-07-05', durationMinutes: 30, location: 'Off-site', staff: 'Ops runner', customer: '', priority: 'Low', status: 'Planned', body: 'Short supplier-related travel block that slightly reduces free afternoon capacity.', route: '/operations' },
      { id: 'ops-demo-7', title: 'Executive review — weekly operating cadence', type: 'Meeting', startAt: '2026-07-05T16:00:00.000Z', endAt: '2026-07-05T16:45:00.000Z', startTime: '16:00', endTime: '16:45', date: '2026-07-05', durationMinutes: 45, location: 'Office', staff: 'Kane', customer: '', priority: 'High', status: 'Scheduled', body: 'Key executive meeting on workload, bookings, and next-week staffing shape.', route: '/operations' },
      { id: 'ops-demo-8', title: 'Driver fitting follow-up — Amelia Fraser', type: 'Fitting', startAt: '2026-07-05T17:00:00.000Z', endAt: '2026-07-05T18:15:00.000Z', startTime: '17:00', endTime: '18:15', date: '2026-07-05', durationMinutes: 75, location: 'Studio Bay 2', staff: 'Kane', customer: 'Amelia Fraser', priority: 'High', status: 'Tentative', body: 'Late-day premium fitting creates useful revenue potential but pushes the day toward an overtime edge.', route: '/operations' }
    ],
    upcomingMeetings: [
      { id: 'ops-meeting-1', title: 'Weekend staffing review', type: 'Meeting', startAt: '2026-07-06T09:30:00.000Z', endAt: '2026-07-06T10:00:00.000Z', startTime: '09:30', endTime: '10:00', date: '2026-07-06', durationMinutes: 30, location: 'Office', staff: 'Kane / Ops', priority: 'Medium', status: 'Scheduled', body: 'Align staffing with expected fitting demand.', route: '/operations' },
      { id: 'ops-meeting-2', title: 'Customer fitting debrief — James Archer', type: 'Meeting', startAt: '2026-07-06T13:00:00.000Z', endAt: '2026-07-06T13:20:00.000Z', startTime: '13:00', endTime: '13:20', date: '2026-07-06', durationMinutes: 20, location: 'Phone', staff: 'Kane', customer: 'James Archer', priority: 'Medium', status: 'Planned', body: 'Follow-up on premium fitting recommendation and equipment options.', route: '/operations' }
    ],
    staffAvailability: [
      { id: 'ops-staff-1', name: 'Kane', role: 'Lead fitter', availability: 'Core schedule full with 3.5h controlled capacity remaining.', status: 'Available', detail: 'One late-day stretch should be watched for overtime risk.' },
      { id: 'ops-staff-2', name: 'Studio support', role: 'Operations support', availability: 'Available for admin, bay turnover, and customer handoff support.', status: 'Available', detail: 'Can protect flow if one extra booking is added.' },
      { id: 'ops-staff-3', name: 'Weekend cover', role: 'Flexible support', availability: 'Sunday support is currently on hold pending demand confirmation.', status: 'Conditional', detail: 'Useful if late-week bookings continue to rise.' }
    ],
    freeCapacity: [
      { id: 'ops-capacity-1', label: '12:15–12:30', duration: '15 mins', suitability: 'Admin / buffer only', note: 'Too short for a booking but useful for reset.' },
      { id: 'ops-capacity-2', label: '13:00–14:00', duration: '60 mins', suitability: 'Short fitting / review slot', note: 'Best same-day revenue opportunity.' },
      { id: 'ops-capacity-3', label: '15:45–16:00', duration: '15 mins', suitability: 'Buffer only', note: 'Protects travel compression.' },
      { id: 'ops-capacity-4', label: 'Tomorrow 11:30–12:45', duration: '75 mins', suitability: 'Premium fitting slot', note: 'Best next-day booking window.' }
    ],
    travel: [
      { id: 'ops-travel-1', title: 'Supplier pickup route', time: '15:15–15:45', location: 'Off-site', note: 'Short travel block reduces free afternoon capacity.' }
    ],
    deadlines: [
      { id: 'ops-deadline-1', title: 'Confirm weekend bay coverage', due: 'Today 18:00', owner: 'Operations', severity: 'High', note: 'Needed before weekend demand is fully locked.' },
      { id: 'ops-deadline-2', title: 'Accept TrackMan service window', due: 'Tomorrow 12:00', owner: 'Kane', severity: 'Medium', note: 'Impacts scheduling confidence next week.' }
    ],
    allDayEvents: [
      { id: 'ops-allday-1', title: 'Staff holiday — assistant fitter', date: '2026-07-06', owner: 'HR / Operations', note: 'Reduces optional weekend flexibility.' }
    ],
    weekCapacity: [
      { day: 'Mon', utilisation: '76%', note: 'Healthy balance of fittings and admin.' },
      { day: 'Tue', utilisation: '68%', note: 'Room for short-notice fitting demand.' },
      { day: 'Wed', utilisation: '83%', note: 'Good revenue density without overload.' },
      { day: 'Thu', utilisation: '92%', note: 'Near full; protect buffers carefully.' },
      { day: 'Fri', utilisation: '81%', note: 'Stable operating day.' },
      { day: 'Sat', utilisation: '94%', note: 'Highest-risk day for compression and overtime.' }
    ],
    insightCards: [
      { eyebrow: 'Fully booked days', title: 'Thursday and Saturday are close to full', body: 'Both days are above 90% utilisation, so any extra booking should be accepted only if service quality and bay turnover remain protected.', tone: 'warn' },
      { eyebrow: 'Free fitting opportunity', title: 'One same-day slot can still be monetised', body: 'The 13:00–14:00 window is currently the cleanest same-day fitting opportunity.', tone: 'good' },
      { eyebrow: 'Back-to-back pressure', title: 'Late afternoon has one compressed stretch', body: 'Travel, executive review, and a tentative premium fitting create the main overtime risk in the current schedule.', tone: 'risk' },
      { eyebrow: 'Under-utilised capacity', title: 'Tuesday still has room for premium demand', body: 'The week remains commercially healthy, but Tuesday can still absorb one more high-value fitting without strain.', tone: 'info' }
    ],
    approvalCards: [
      { id: 'ops-approval-1', title: 'Reschedule appointment — Amelia Fraser fitting follow-up', why: 'The tentative late-day fitting currently creates the clearest overtime risk in the schedule.', impact: 'Protects delivery quality and staff energy', risk: 'Medium', confidence: 'High' },
      { id: 'ops-approval-2', title: 'Extend fitting — James Archer driver session', why: 'A premium session may justify an extra 15-minute follow-up block if conversion quality remains strong.', impact: 'Higher booking value / customer experience', risk: 'Low', confidence: 'Medium' },
      { id: 'ops-approval-3', title: 'Block calendar time — Thursday buffer protection', why: 'Thursday is near full, so protecting a recovery buffer may prevent downstream service drift.', impact: 'Operational resilience', risk: 'Low', confidence: 'High' },
      { id: 'ops-approval-4', title: 'Accept invitation — TrackMan service window review', why: 'Accepting now keeps next-week service continuity visible rather than reactive.', impact: 'Supplier continuity', risk: 'Low', confidence: 'Medium' },
      { id: 'ops-approval-5', title: 'Decline invitation — low-priority partner catch-up', why: 'A low-value calendar hold is currently stealing one of the few useful operating gaps.', impact: 'Capacity preservation', risk: 'Low', confidence: 'Medium' }
    ],
    timelineEvents: [
      { id: 'ops-event-1', date: '2026-07-05', time: '08:30', title: 'Busy day reached', body: 'Today crossed the threshold for a commercially strong but operationally sensitive schedule.', category: 'Operational milestone', department: 'Operations', impact: 'Medium', relatedEntities: ['goal-booking-conversion'], status: 'Active', route: '/operations' },
      { id: 'ops-event-2', date: '2026-07-05', time: '11:00', title: 'Key customer fitting', body: 'Noah Bennett moved into a confirmed iron fitting slot with high conversion relevance.', category: 'Customer appointment', department: 'Sales / Operations', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Confirmed', route: '/operations' },
      { id: 'ops-event-3', date: '2026-07-05', time: '16:00', title: 'Executive meeting', body: 'Leadership operating cadence review scheduled to align workload, bookings, and staffing.', category: 'Executive meeting', department: 'Leadership / Operations', impact: 'Medium', relatedEntities: ['goal-booking-conversion'], status: 'Scheduled', route: '/operations' },
      { id: 'ops-event-4', date: '2026-07-06', time: 'All day', title: 'Staff holiday', body: 'Assistant fitter holiday reduces optional weekend flexibility.', category: 'Staff holiday', department: 'HR / Operations', impact: 'Medium', relatedEntities: ['goal-booking-conversion'], status: 'Upcoming', route: '/operations' },
      { id: 'ops-event-5', date: '2026-07-10', time: 'All day', title: 'Record utilisation risk on Saturday', body: 'Saturday is currently tracking as the heaviest utilisation day of the week.', category: 'Record utilisation', department: 'Operations', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Watchpoint', route: '/operations' }
    ],
    memoryCandidates: [
      { id: 'ops-memory-1', date: '2026-07-05', time: '11:00', title: 'Premium iron fitting moved into the live operating schedule', body: 'Noah Bennett confirmed into a high-value fitting slot, making scheduling capacity directly relevant to revenue quality.', category: 'Customer appointment', department: 'Sales / Operations', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Confirmed', route: '/operations' },
      { id: 'ops-memory-2', date: '2026-07-05', time: '16:00', title: 'Executive operating cadence review added to the calendar', body: 'A formal operating review is now part of the schedule so workload and staffing risks are surfaced before they become reactive.', category: 'Executive meeting', department: 'Leadership / Operations', impact: 'Medium', relatedEntities: ['goal-booking-conversion'], status: 'Scheduled', route: '/operations' },
      { id: 'ops-memory-3', date: '2026-07-06', time: 'All day', title: 'Staff holiday reduced weekend flexibility', body: 'A staff holiday now affects optional support capacity and should remain visible in operating memory.', category: 'Operational milestone', department: 'HR / Operations', impact: 'Medium', relatedEntities: ['goal-booking-conversion'], status: 'Upcoming', route: '/operations' }
    ],
    searchIndex: [
      { id: 'search-ops-1', type: 'Calendar event', title: 'Driver fitting — James Archer', body: 'Customer: James Archer. Location: Studio Bay 1. 2026-07-05 08:30–09:45. Premium driver fitting.', route: '/operations', meta: 'Fitting · Studio Bay 1 · 2026-07-05' },
      { id: 'search-ops-2', type: 'Calendar event', title: 'Executive review — weekly operating cadence', body: 'Meeting name: weekly operating cadence. Location: Office. 2026-07-05 16:00–16:45.', route: '/operations', meta: 'Meeting · Office · 2026-07-05' },
      { id: 'search-ops-3', type: 'Calendar event', title: 'Staff holiday — assistant fitter', body: 'All-day event on 2026-07-06 affecting weekend capacity.', route: '/operations', meta: 'All day · HR / Operations · 2026-07-06' },
      { id: 'search-ops-4', type: 'Calendar event', title: 'TrackMan service window review', body: 'Meeting name: TrackMan service window review. Location: Video call. Deadline tomorrow 12:00.', route: '/operations', meta: 'Deadline · Video call · 2026-07-06' }
    ]
  },
  communications: {
    providerSummary: {
      label: 'Demo fallback active',
      body: 'Executive Inbox is currently using structured demo Gmail data until a local OAuth-backed snapshot is available.',
      tone: 'warn',
      state: 'demo-fallback',
      account: 'hello@epgolfstudios.co.uk',
      syncedAt: null,
      health: 'Awaiting configuration',
      mode: 'demo',
      syncInterval: '15 minutes'
    },
    summary: {
      headline: 'Five customer enquiries require replies.',
      body: 'Five customer enquiries require replies. Two supplier issues require action. Three fitting requests arrived in the current inbox window.',
      dailySummary: 'Five customer enquiries require replies. Two supplier invoices are awaiting approval. Three fitting requests arrived overnight.',
      boardSummary: 'Five customer enquiries require replies, two supplier invoices are awaiting approval, and three fitting requests arrived overnight.'
    },
    metrics: {
      unreadCritical: 4,
      waitingCustomerReplies: 5,
      supplierIssues: 2,
      financeEmails: 3,
      bookingRequests: 3,
      needsReply: 8,
      recentlyCompleted: 3
    },
    widgets: [
      { iconName: 'alert-triangle', label: 'Unread Critical Emails', value: '4', body: 'High-priority unread conversations that deserve attention first.', meta: 'Demo Gmail' },
      { iconName: 'reply', label: 'Waiting Customer Replies', value: '5', body: 'Customer threads where delay now risks trust or conversion.', meta: 'Customer' },
      { iconName: 'building', label: 'Supplier Issues', value: '2', body: 'Supplier threads affecting timing, delivery, or margin.', meta: 'Supplier' },
      { iconName: 'coins', label: 'Finance Emails', value: '3', body: 'Invoices, approvals, and payment-sensitive conversations.', meta: 'Finance' },
      { iconName: 'target', label: 'Booking Requests', value: '3', body: 'New fitting requests in the visible inbox window.', meta: 'Booking' },
      { iconName: 'check-circle', label: "Today's Executive Inbox Summary", value: '8 live', body: 'Five customer replies, two supplier issues, and three fitting requests are currently visible.', meta: 'hello@epgolfstudios.co.uk' }
    ],
    inboxItems: [
      { id: 'gmail-demo-1', threadId: 'thread-demo-1', sender: 'James Archer', senderEmail: 'james.archer@example.com', subject: 'Driver fitting availability this week', receivedAt: '2026-07-05T07:12:00.000Z', receivedTime: '10h ago', ageLabel: '10h ago', category: 'Booking', priority: 'High', status: 'Needs Reply', aiSummary: 'James Archer is asking for a premium driver fitting slot this week. The enquiry is commercially relevant and should be answered quickly to protect conversion.', customer: 'James Archer', supplier: '', action: 'Reply', waitingHours: 10, unread: true, labels: ['INBOX', 'UNREAD'], route: '/executive-inbox' },
      { id: 'gmail-demo-2', threadId: 'thread-demo-2', sender: 'Amelia Fraser', senderEmail: 'amelia.fraser@example.com', subject: 'Follow-up on wedge fitting recommendation', receivedAt: '2026-07-04T12:05:00.000Z', receivedTime: '1d ago', ageLabel: '1d ago', category: 'Customer', priority: 'High', status: 'Needs Reply', aiSummary: 'Amelia Fraser is waiting on a recommendation before deciding whether to book. The thread is now old enough to risk trust if it sits longer.', customer: 'Amelia Fraser', supplier: '', action: 'Reply', waitingHours: 30, unread: true, labels: ['INBOX', 'UNREAD', 'IMPORTANT'], route: '/executive-inbox' },
      { id: 'gmail-demo-3', threadId: 'thread-demo-3', sender: 'Foresight Sports Trade', senderEmail: 'accounts@foresightsports.example', subject: 'Invoice 77841 now due for approval', receivedAt: '2026-07-05T06:20:00.000Z', receivedTime: '11h ago', ageLabel: '11h ago', category: 'Finance', priority: 'High', status: 'Review', aiSummary: 'A supplier invoice is waiting for approval and touches both payment timing and supplier continuity.', customer: '', supplier: 'Foresight Sports Trade', action: 'Approve', waitingHours: 11, unread: true, labels: ['INBOX', 'UNREAD'], route: '/executive-inbox' },
      { id: 'gmail-demo-4', threadId: 'thread-demo-4', sender: 'TrackMan Services', senderEmail: 'support@trackman.example', subject: 'Contract renewal and service window', receivedAt: '2026-07-04T08:30:00.000Z', receivedTime: '1d ago', ageLabel: '1d ago', category: 'Supplier', priority: 'High', status: 'Follow-up due', aiSummary: 'TrackMan is pushing on renewal timing and service continuity. This could affect operating confidence if it drifts.', customer: '', supplier: 'TrackMan Services', action: 'Review', waitingHours: 33, unread: false, labels: ['INBOX'], route: '/executive-inbox' },
      { id: 'gmail-demo-5', threadId: 'thread-demo-5', sender: 'Charlotte Dean', senderEmail: 'charlotte.dean@example.com', subject: 'Can I book a gapping session on Friday?', receivedAt: '2026-07-05T03:44:00.000Z', receivedTime: '14h ago', ageLabel: '14h ago', category: 'Booking', priority: 'High', status: 'Needs Reply', aiSummary: 'Charlotte Dean is trying to book a gapping session for Friday. The request is high-intent and should move quickly.', customer: 'Charlotte Dean', supplier: '', action: 'Reply', waitingHours: 14, unread: true, labels: ['INBOX', 'UNREAD'], route: '/executive-inbox' },
      { id: 'gmail-demo-6', threadId: 'thread-demo-6', sender: 'Oliver Singh', senderEmail: 'oliver.singh@example.com', subject: 'Question about premium fitting package', receivedAt: '2026-07-04T17:05:00.000Z', receivedTime: '1d ago', ageLabel: '1d ago', category: 'Customer', priority: 'Medium', status: 'Needs Reply', aiSummary: 'Oliver Singh needs clarity on the premium fitting package before deciding. This is a useful sales-quality conversation, not just inbox noise.', customer: 'Oliver Singh', supplier: '', action: 'Reply', waitingHours: 25, unread: false, labels: ['INBOX'], route: '/executive-inbox' },
      { id: 'gmail-demo-7', threadId: 'thread-demo-7', sender: 'Titleist Trade', senderEmail: 'trade@titleist.example', subject: 'Quote update for August stock allocation', receivedAt: '2026-07-05T05:15:00.000Z', receivedTime: '12h ago', ageLabel: '12h ago', category: 'Supplier', priority: 'Medium', status: 'Review', aiSummary: 'Titleist has updated a quote tied to upcoming stock allocation. This affects margin planning more than day-to-day admin.', customer: '', supplier: 'Titleist Trade', action: 'Review', waitingHours: 12, unread: true, labels: ['INBOX', 'UNREAD'], route: '/executive-inbox' },
      { id: 'gmail-demo-8', threadId: 'thread-demo-8', sender: 'EP Ops', senderEmail: 'ops@epgolfstudios.co.uk', subject: 'Weekend bay coverage and staffing check', receivedAt: '2026-07-05T08:05:00.000Z', receivedTime: '9h ago', ageLabel: '9h ago', category: 'Internal', priority: 'Medium', status: 'Review', aiSummary: 'Operations is checking weekend staffing coverage in case fitting demand stays strong. The thread matters because service quality could slip if ignored.', customer: '', supplier: '', action: 'Assess', waitingHours: 9, unread: false, labels: ['INBOX'], route: '/executive-inbox' },
      { id: 'gmail-demo-9', threadId: 'thread-demo-9', sender: 'LeadForm Partner', senderEmail: 'partner@example.com', subject: 'July campaign performance discussion', receivedAt: '2026-07-05T09:18:00.000Z', receivedTime: '8h ago', ageLabel: '8h ago', category: 'Marketing', priority: 'Medium', status: 'Review', aiSummary: 'A marketing partner is trying to review July performance and next steps. This may affect campaign focus, but it is not more urgent than customer replies or supplier approvals.', customer: '', supplier: '', action: 'Assess', waitingHours: 8, unread: false, labels: ['INBOX'], route: '/executive-inbox' },
      { id: 'gmail-demo-10', threadId: 'thread-demo-10', sender: 'Noah Bennett', senderEmail: 'noah.bennett@example.com', subject: 'Do you have any iron fitting slots after work?', receivedAt: '2026-07-05T01:42:00.000Z', receivedTime: '16h ago', ageLabel: '16h ago', category: 'Booking', priority: 'High', status: 'Needs Reply', aiSummary: 'Noah Bennett is asking for an after-work iron fitting slot. This is a direct booking opportunity and should stay near the top of the queue.', customer: 'Noah Bennett', supplier: '', action: 'Reply', waitingHours: 16, unread: true, labels: ['INBOX', 'UNREAD'], route: '/executive-inbox' },
      { id: 'gmail-demo-11', threadId: 'thread-demo-11', sender: 'Finance Desk', senderEmail: 'finance@epgolfstudios.co.uk', subject: 'Deposit reconciliation requires sign-off', receivedAt: '2026-07-04T15:26:00.000Z', receivedTime: '1d ago', ageLabel: '1d ago', category: 'Finance', priority: 'Medium', status: 'Follow-up due', aiSummary: 'Finance needs sign-off on a deposit reconciliation item. It is not a crisis, but it should not slip much further.', customer: '', supplier: '', action: 'Approve', waitingHours: 27, unread: false, labels: ['INBOX'], route: '/executive-inbox' },
      { id: 'gmail-demo-12', threadId: 'thread-demo-12', sender: 'Golf Monthly', senderEmail: 'news@golfmonthly.example', subject: 'This week in equipment launches', receivedAt: '2026-07-05T04:11:00.000Z', receivedTime: '13h ago', ageLabel: '13h ago', category: 'Newsletter', priority: 'Low', status: 'Review', aiSummary: 'A newsletter is visible in the inbox, but it does not deserve executive attention ahead of customer or finance conversations.', customer: '', supplier: '', action: 'Archive', waitingHours: 13, unread: false, labels: ['INBOX'], route: '/executive-inbox' }
    ],
    recentlyCompleted: [
      { id: 'gmail-demo-sent-1', threadId: 'thread-demo-sent-1', sender: 'Kane', senderEmail: 'hello@epgolfstudios.co.uk', subject: 'Reply sent — premium fitting enquiry', receivedAt: '2026-07-05T09:02:00.000Z', receivedTime: '8h ago', ageLabel: '8h ago', category: 'Customer', priority: 'Medium', status: 'Completed', aiSummary: 'A premium fitting enquiry was answered and can now move out of the active queue unless the customer replies again.', customer: 'Ben Howard', supplier: '', action: 'Archive', waitingHours: 0, unread: false, labels: ['SENT'], route: '/executive-inbox' },
      { id: 'gmail-demo-sent-2', threadId: 'thread-demo-sent-2', sender: 'Kane', senderEmail: 'hello@epgolfstudios.co.uk', subject: 'Forwarded supplier quote for review', receivedAt: '2026-07-05T07:40:00.000Z', receivedTime: '10h ago', ageLabel: '10h ago', category: 'Supplier', priority: 'Medium', status: 'Completed', aiSummary: 'A supplier quote was forwarded for review, reducing the risk of it getting buried.', customer: '', supplier: 'Foresight Sports Trade', action: 'Label', waitingHours: 0, unread: false, labels: ['SENT'], route: '/executive-inbox' },
      { id: 'gmail-demo-sent-3', threadId: 'thread-demo-sent-3', sender: 'Kane', senderEmail: 'hello@epgolfstudios.co.uk', subject: 'Task created for finance follow-up', receivedAt: '2026-07-04T18:12:00.000Z', receivedTime: '23h ago', ageLabel: '23h ago', category: 'Finance', priority: 'Low', status: 'Completed', aiSummary: 'A finance follow-up task was created so the thread no longer needs immediate manual review.', customer: '', supplier: '', action: 'Create Task', waitingHours: 0, unread: false, labels: ['SENT'], route: '/executive-inbox' }
    ],
    approvalCards: [
      { title: 'Reply — Driver fitting availability this week', why: 'High-intent booking request from James Archer is still waiting for a response.', impact: 'Booking demand capture', risk: 'High', confidence: 'High' },
      { title: 'Archive — This week in equipment launches', why: 'A newsletter is visible in the inbox but does not deserve executive attention ahead of customer, supplier, or finance conversations.', impact: 'Inbox hygiene', risk: 'Low', confidence: 'High' },
      { title: 'Label — Invoice 77841 now due for approval', why: 'Supplier invoice timing now affects both cash timing and supplier continuity, so it should be clearly labelled for the next finance review block.', impact: 'Finance / Supplier timing', risk: 'High', confidence: 'High' },
      { title: 'Forward — Quote update for August stock allocation', why: 'The latest quote needs owner visibility before purchasing decisions move forward.', impact: 'Margin planning', risk: 'Medium', confidence: 'Medium' },
      { title: 'Create Task — Deposit reconciliation requires sign-off', why: 'Finance follow-up should be tracked explicitly rather than left in the inbox.', impact: 'Finance control', risk: 'Low', confidence: 'Medium' },
      { title: 'Schedule Follow-up — Follow-up on wedge fitting recommendation', why: 'A valuable customer thread has now waited long enough to justify explicit follow-up timing.', impact: 'Customer trust / conversion', risk: 'Medium', confidence: 'High' }
    ],
    timelineEvents: [
      { id: 'gmail-event-1', date: '2026-07-05', time: '10h ago', title: 'Customer enquiry received', body: 'James Archer asked for driver fitting availability this week.', category: 'Booking email', department: 'Sales / Customer', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Needs Reply', route: '/executive-inbox' },
      { id: 'gmail-event-2', date: '2026-07-05', time: '11h ago', title: 'Invoice approval entered the executive queue', body: 'Foresight Sports Trade invoice 77841 now requires approval.', category: 'Finance email', department: 'Finance', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Review', route: '/executive-inbox' },
      { id: 'gmail-event-3', date: '2026-07-04', time: '1d ago', title: 'Major supplier quote needs action', body: 'TrackMan Services raised a renewal and service window discussion.', category: 'Supplier email', department: 'Operations / Finance', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Follow-up due', route: '/executive-inbox' },
      { id: 'gmail-event-4', date: '2026-07-05', time: '16h ago', title: 'High-value booking request arrived overnight', body: 'Noah Bennett asked for an after-work iron fitting slot.', category: 'Booking email', department: 'Sales / Customer', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Needs Reply', route: '/executive-inbox' },
      { id: 'gmail-event-5', date: '2026-07-04', time: '1d ago', title: 'Executive decision needed in finance follow-up', body: 'Deposit reconciliation requires sign-off before close.', category: 'Finance email', department: 'Finance', impact: 'Medium', relatedEntities: ['goal-booking-conversion'], status: 'Follow-up due', route: '/executive-inbox' }
    ],
    memoryCandidates: [
      { id: 'gmail-memory-1', date: '2026-07-05', time: '10h ago', title: 'Driver fitting availability this week', body: 'A high-intent booking enquiry arrived and needs fast follow-up to protect conversion.', category: 'Booking conversation', department: 'Sales / Customer', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Needs Reply', route: '/executive-inbox' },
      { id: 'gmail-memory-2', date: '2026-07-05', time: '11h ago', title: 'Invoice 77841 now due for approval', body: 'A supplier invoice entered the executive queue and now affects both finance timing and supplier continuity.', category: 'Finance conversation', department: 'Finance', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Review', route: '/executive-inbox' },
      { id: 'gmail-memory-3', date: '2026-07-04', time: '1d ago', title: 'Contract renewal and service window', body: 'TrackMan raised a supplier conversation with operating consequences if it drifts.', category: 'Supplier conversation', department: 'Operations / Finance', impact: 'High', relatedEntities: ['goal-booking-conversion'], status: 'Follow-up due', route: '/executive-inbox' }
    ]
  },
  approvals: {
    groups: {
      'Finance approvals': [
        { title: 'Approve supplier payment batch', why: 'Three invoices fall due this week including fitting bay consumables.', impact: 'Preserves supplier continuity but reduces near-term cash headroom.', risk: 'Low–Medium', confidence: 'High' },
        { title: 'Approve conservative Q3 growth assumption', why: 'The current plan assumes healthy demand but tighter margin conversion.', impact: 'Creates a more prudent planning baseline.', risk: 'Low', confidence: 'Medium–High' }
      ],
      'Marketing approvals': [
        { title: 'Publish Social Post', why: 'The next premium proof carousel is ready for review before publishing.', impact: 'Supports reach and authority on the highest-traction channels.', risk: 'Low', confidence: 'High' },
        { title: 'Publish YouTube Video', why: 'The next long-form fitting education video is prepared and staged for release.', impact: 'Expected to improve authority, views, and downstream enquiries.', risk: 'Medium', confidence: 'High' },
        { title: 'Schedule Email Campaign', why: 'A high-performing educational email follow-up is prepared for the current list.', impact: 'Supports subscriber engagement and lead conversion.', risk: 'Low', confidence: 'Medium–High' },
        { title: 'Update Website', why: 'The fitting landing page CTA and proof blocks are ready for a conversion refresh.', impact: 'Could improve bookings and enquiry conversion from existing traffic.', risk: 'Medium', confidence: 'Medium–High' },
        { title: 'Generate Blog Post', why: 'A premium-fitting educational article concept is ready to move into production.', impact: 'Supports SEO, brand authority, and content reuse.', risk: 'Low', confidence: 'Medium' },
        { title: 'Create LinkedIn Article', why: 'A thought-leadership article is staged to strengthen premium positioning for a professional audience.', impact: 'Improves authority and supports brand trust.', risk: 'Low', confidence: 'Medium' }
      ],
      'Sales approvals': [
        { title: 'Approve pricing exception review', why: 'One large prospective deal requires executive oversight on margin trade-off.', impact: 'Could protect conversion without setting a poor pricing precedent.', risk: 'Medium', confidence: 'Medium' }
      ],
      'Operations approvals': [
        { title: 'Approve process improvement sprint', why: 'Operations placeholder intelligence suggests a small workflow redesign opportunity.', impact: 'Should improve execution quality and reduce repeat friction.', risk: 'Low', confidence: 'Medium' }
      ],
      'HR approvals': [
        { title: 'Approve weekend staffing coverage review', why: 'Marketing momentum may lift weekend fitting demand enough to affect service quality and staff capacity.', impact: 'Protects customer experience while avoiding avoidable staffing strain.', risk: 'Low', confidence: 'Medium' }
      ],
      'AI-generated action approvals': [
        { title: 'Approve AI-generated weekly action set', why: 'The AI layer has proposed a grouped leadership action list for review.', impact: 'Creates a consistent executive rhythm while keeping humans in control.', risk: 'Medium', confidence: 'Medium' }
      ]
    }
  },
  reports: {
    overview: [
      { route: '/reports/weekly-briefings', title: 'Weekly Briefings', body: 'Sunday-style weekly summaries for leadership review.' },
      { route: '/reports/monthly-reports', title: 'Monthly Reports', body: 'Placeholder monthly reporting cadence and executive pack structure.' },
      { route: '/reports/quarterly-reviews', title: 'Quarterly Reviews', body: 'Board-style quarterly review output.' },
      { route: '/reports/board-meeting', title: 'Board Meeting Mode', body: 'A cleaner board-facing presentation mode.' },
      { route: '/reports/cfo-reports', title: 'CFO Reports', body: 'Finance-specific reporting pack placeholder.' },
      { route: '/reports/cmo-reports', title: 'Marketing Intelligence Report', body: 'Packaged GA4 + YouTube marketing intelligence report.' },
      { route: '/reports/ceo-reports', title: 'CEO Reports', body: 'CEO-level summary and decision pack placeholder.' }
    ],
    monthly: {
      summary: 'This placeholder will eventually package revenue, profit, cash, marketing, sales, and operating movement into a monthly executive view.',
      sections: ['Month-on-month business movement', 'Cross-functional KPI highlights', 'Key approvals accepted / rejected', 'Leadership narrative and next-step recommendations']
    },
    cfoReports: ['Financial performance pack', 'Working capital summary', 'Cash and forecast note', 'Risk and approvals appendix'],
    cmoReports: ['GA4 summary', 'YouTube summary', 'Cross-channel findings', 'Traffic and conversion movement', 'Campaign performance pack', 'Content and approval recommendations'],
    ceoReports: ['Business health summary', 'Cross-functional risk view', 'Executive actions and approvals', 'Board-ready narrative']
  },
  aiAssistant: {
    overview: {
      summary: 'The AI Assistant section is now the conversational executive layer for questions, briefings, assumptions, follow-up prompts, missing information, and staged actions.',
      status: 'Frontend-only executive conversation prototype',
      cards: [
        { route: '/ai-assistant/ask', title: 'Ask EP Hub', body: 'A conversational workspace for the most important executive questions.' },
        { route: '/ai-assistant/executive-briefing', title: 'Executive Briefing', body: 'A generated leadership briefing surface spanning finance, marketing, approvals, and priorities.' },
        { route: '/ai-assistant/follow-up-questions', title: 'Follow-up Questions', body: 'A curated next-question layer for deeper reasoning and challenge.' },
        { route: '/ai-assistant/suggested-actions', title: 'Suggested Actions', body: 'A staged list of AI-suggested actions awaiting explicit human review.' },
        { route: '/ai-assistant/assumptions', title: 'Assumptions', body: 'The assumptions behind every recommendation and briefing.' },
        { route: '/ai-assistant/missing-information', title: 'Missing Information', body: 'What the AI layer still needs surfaced before confidence increases.' },
        { route: '/ai-assistant/memory-context', title: 'AI Memory / Context', body: 'How EP Hub will preserve executive context over time.' }
      ]
    },
    askWorkspace: {
      intro: 'This workspace is designed to feel like asking an AI Chief of Staff direct questions about the business, then receiving concise, decision-ready answers.',
      prompts: [
        { question: 'Why has revenue changed?', answer: 'Revenue improved because premium fitting demand held up and accessory conversion strengthened. The reason the business should stay measured is that supplier and support costs softened margin conversion at the same time.' },
        { question: 'What is my biggest risk right now?', answer: 'Receivables timing is the clearest near-term risk because it affects flexibility faster than any other currently visible issue. It does not threaten the business structurally, but it does shape what should or should not be approved today.' },
        { question: 'Which marketing campaign performed best?', answer: 'The proof-led YouTube campaign performed best because it improved reach, watch time, website traffic, and fitting enquiry quality more clearly than the lower-return channels.' },
        { question: 'What should I focus on today?', answer: 'Protect cash timing, approve the highest-confidence marketing action, and keep the approval queue focused on the small number of decisions that materially affect the next seven days.' },
        { question: 'Where am I losing money?', answer: 'The business is not losing money broadly, but margin is being eroded by supplier concentration, some support costs, and by website traffic that is not yet converting into enough bookings.' }
      ],
      suggestedFollowUps: ['What changed since yesterday?', 'Which approval matters most?', 'Why is booking conversion softer?', 'Where is the easiest profit improvement?']
    },
    pages: {
      '/ai-assistant/ask': { description: 'A conversational executive workspace for asking direct cross-functional business questions.', exampleMetrics: ['Questions answered today', 'Confidence score', 'Cross-functional evidence linked'], exampleInsights: ['Why did margin compress?', 'What should the CEO focus on today?', 'Which campaign created the best commercial return?'], exampleActions: ['Open the relevant module', 'Stage an approval review', 'Request a weekly briefing update'] },
      '/ai-assistant/executive-briefing': { description: 'This route packages a concise executive briefing spanning business health, priorities, risks, and opportunities.', exampleMetrics: ['Briefing freshness', 'Coverage by module', 'Leadership priority count'], exampleInsights: ['Health score movement', 'Cross-functional changes', 'Recommended executive focus'], exampleActions: ['Create weekly pack', 'Open board view', 'Review priorities'] },
      '/ai-assistant/follow-up-questions': { description: 'This route surfaces the best next questions to ask after a report, recommendation, or approval review.', exampleMetrics: ['Suggested follow-ups', 'Decision depth', 'Outstanding unknowns'], exampleInsights: ['What should we challenge next?', 'Which assumption is weakest?', 'What evidence would change confidence?'], exampleActions: ['Open assumptions', 'Open missing information', 'Escalate to approval'] },
      '/ai-assistant/suggested-actions': { description: 'This route collects AI-suggested actions without ever executing them automatically.', exampleMetrics: ['Open suggestions', 'Pending approvals', 'Action categories'], exampleInsights: ['Top recommended actions this week', 'Most urgent staged decisions', 'Cross-functional dependencies'], exampleActions: ['Approve', 'Return for review', 'Hold in draft'] },
      '/ai-assistant/assumptions': { description: 'This route makes the assumptions behind AI recommendations visible and challengeable.', exampleMetrics: ['Assumptions tracked', 'High-risk assumptions', 'Confidence sensitivity'], exampleInsights: ['Which assumptions matter most?', 'What would change the forecast?', 'Where is the reasoning fragile?'], exampleActions: ['Challenge assumption', 'Request more evidence', 'Update briefing'] },
      '/ai-assistant/missing-information': { description: 'This route surfaces what the AI layer still does not know and why that matters.', exampleMetrics: ['Open data gaps', 'Unknowns affecting confidence', 'Blocked recommendations'], exampleInsights: ['Why confidence is limited', 'Which missing data matters most', 'What evidence would improve output'], exampleActions: ['Mark for review', 'Request data source', 'Keep as placeholder'] },
      '/ai-assistant/memory-context': { description: 'This route explains how executive memory, decision history, and recurring context themes can persist over time.', exampleMetrics: ['Context windows', 'Saved decisions', 'Historical briefing references'], exampleInsights: ['What leadership already decided', 'What lessons should persist', 'Which themes are recurring'], exampleActions: ['Open decision journal', 'Review prior reports', 'Pin context item'] }
    }
  },
  placeholders: {
    '/coo': { module: 'COO', description: 'This module will eventually track operational execution, fulfilment quality, service capacity, process friction, and delivery reliability.', metrics: ['Capacity usage', 'Workflow bottlenecks', 'Operational turnaround time', 'Delivery quality'], insights: ['Where is execution slowing down?', 'Which process changes would reduce friction?', 'What is threatening consistency?'], actions: ['Approve process changes', 'Prioritise service improvements', 'Review delivery risk areas'], status: 'Mock placeholder only' },
    '/sales': { module: 'Sales', description: 'This module will eventually track pipeline health, conversion quality, revenue potential, pricing discipline, and commercial execution.', metrics: ['Pipeline value', 'Conversion rate', 'Average deal value', 'Sales cycle speed'], insights: ['Where is conversion improving?', 'Which deals need executive attention?', 'How is pricing affecting margin?'], actions: ['Approve pricing exceptions', 'Review large opportunities', 'Challenge pipeline assumptions'], status: 'Mock placeholder only' },
    '/customer-success': { module: 'Customer Success', description: 'This module will eventually track retention, customer satisfaction, service quality, referral strength, and long-term loyalty.', metrics: ['Customer health', 'Retention rate', 'Service quality', 'Referral activity'], insights: ['Where is customer experience strongest?', 'What could weaken loyalty?', 'Which accounts need proactive attention?'], actions: ['Approve service improvements', 'Review churn-risk interventions', 'Prioritise follow-up actions'], status: 'Mock placeholder only' },
    '/operations': { module: 'Operations', description: 'This module will eventually track workflow coordination, throughput, execution discipline, system friction, and operational visibility.', metrics: ['Throughput', 'Cycle time', 'Open blockers', 'Execution consistency'], insights: ['What is slowing execution?', 'Which bottlenecks are systemic?', 'Where would better tooling help most?'], actions: ['Approve workflow changes', 'Review bottlenecks', 'Prioritise process improvements'], status: 'Mock placeholder only' },
    '/hr': { module: 'HR', description: 'This module will eventually track staffing, role clarity, capability needs, workload, and people health across the business.', metrics: ['Capacity coverage', 'Hiring status', 'Team sentiment', 'Training priorities'], insights: ['Where is capacity stretched?', 'What capability is missing?', 'Which leadership risks are people-related?'], actions: ['Approve hiring plans', 'Review role changes', 'Prioritise development actions'], status: 'Mock placeholder only' },
    '/projects': { module: 'Projects', description: 'This module will eventually track strategic initiatives, ownership, deadlines, dependencies, and executive project risk.', metrics: ['Active projects', 'On-track rate', 'Blocked work', 'Upcoming deadlines'], insights: ['Which projects matter most now?', 'Where are dependencies creating risk?', 'What needs executive unblock?'], actions: ['Approve project priorities', 'Review timelines', 'Escalate blocked initiatives'], status: 'Mock placeholder only' }
  },
  settings: {
    integrations: ['QuickBooks', 'Starling', 'Bookings Dashboard', 'Gmail', 'Inventory', 'HR', 'Payroll', 'Google Analytics', 'Calendar'],
    placeholders: ['Navigation preferences', 'Health score weighting', 'Weekly briefing preferences', 'Command palette defaults', 'Executive personas', 'Historical memory controls']
  },
  shortcuts: [
    { keys: 'Ctrl/Cmd + K', action: 'Open command palette' },
    { keys: '/', action: 'Focus sidebar search' },
    { keys: 'G C', action: 'Jump to CEO Dashboard' },
    { keys: 'G F', action: 'Jump to CFO' },
    { keys: 'G M', action: 'Jump to CMO' },
    { keys: 'G R', action: 'Jump to Reports' },
    { keys: 'Esc', action: 'Close overlays and mobile nav' }
  ]
};
