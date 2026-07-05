const NAV_PRIMARY = [
  ['workspace', 'Workspace'],
  ['revenue', 'Revenue'],
  ['profit', 'Profit'],
  ['expenses', 'Expenses'],
  ['supplier-spend', 'Supplier Spend'],
  ['cash-flow', 'Cash Flow'],
  ['vat', 'VAT'],
  ['forecasting', 'Forecasting'],
  ['business-kpis', 'Business KPIs'],
  ['approval-centre', 'Approval Centre'],
  ['decision-journal', 'Decision Journal'],
  ['weekly-briefings', 'Weekly Briefings'],
  ['settings', 'Settings']
];

const NAV_SECONDARY = [
  ['financial-health', 'Financial Health Score'],
  ['opportunity-register', 'Opportunity Register'],
  ['risk-register', 'Risk Register'],
  ['quarterly-review', 'Quarterly Review']
];

const appState = {
  currentPage: 'workspace',
  mode: 'workspace',
  activeMetric: 'revenue',
  activeQuestion: 0,
  journalQuery: '',
  data: {
    welcome: {
      score: 84,
      previous: 81,
      trend: '+3 points vs last month',
      label: 'Stable with near-term control actions',
      summary:
        'The business is financially healthy overall, but collections discipline and supplier cost control will decide how much freedom EP Golf Studios has over the next six weeks.',
      narrative:
        'Revenue is holding up, profit is slightly compressed, and cash remains resilient if receivables land on time and discretionary spend stays deliberate.'
    },
    metrics: [
      {
        key: 'revenue',
        label: 'Revenue This Month',
        value: '£46.8k',
        trend: '+8.4% vs last month',
        detail:
          'Revenue is ahead of plan, with fitting demand and add-on sales providing momentum. The key CFO question is whether this higher top line is converting into durable margin and cash.'
      },
      {
        key: 'profit',
        label: 'Profit This Month',
        value: '£11.6k',
        trend: '-3.1% vs last month',
        detail:
          'Profit is still healthy, but it softened because cost growth outpaced revenue conversion. This matters because it quietly erodes strategic flexibility.'
      },
      {
        key: 'expenses',
        label: 'Monthly Expenses',
        value: '£24.9k',
        trend: '+6.8% vs last month',
        detail:
          'Expense growth remains manageable, but contractor and discretionary operating costs are drifting upward faster than the base plan assumed.'
      },
      {
        key: 'invoices',
        label: 'Outstanding Invoices',
        value: '£9.4k',
        trend: '4 overdue invoices',
        detail:
          'Receivables remain the cleanest short-term lever for improving cash. A concentrated overdue balance means a small number of actions can materially improve headroom.'
      },
      {
        key: 'bills',
        label: 'Bills To Pay',
        value: '£6.1k',
        trend: '7 due within 10 days',
        detail:
          'The near-term payable stack is manageable, but approval timing should follow strategic cash sequencing rather than simple habit.'
      },
      {
        key: 'vat',
        label: 'VAT Liability',
        value: '£4.8k',
        trend: 'Provisioned',
        detail:
          'The current VAT estimate appears covered, but confidence still depends on complete purchase-side record capture.'
      },
      {
        key: 'cash',
        label: 'Cash Flow Forecast',
        value: '£21.3k',
        trend: '30-day closing cash',
        detail:
          'Cash remains healthy enough for the current plan if receivables are collected on time and supplier spend does not drift further upward.'
      },
      {
        key: 'supplier',
        label: 'Largest Supplier Spend',
        value: '£8.7k',
        trend: 'Launch monitor inventory',
        detail:
          'One supplier now represents a disproportionate monthly cash outflow. That may be strategic, but it should be explicitly reviewed rather than passively inherited.'
      }
    ],
    priorities: [
      {
        title: 'Review overdue invoices',
        note: 'Collections speed is the simplest route to better cash flexibility this week.',
        tone: 'warn'
      },
      {
        title: 'Pressure-test supplier spend',
        note: 'Margin quality will depend on whether higher supplier costs are truly revenue-accretive.',
        tone: 'risk'
      },
      {
        title: 'Protect discretionary spend discipline',
        note: 'Cash is healthy enough for calm decision-making, but not for casual drift.',
        tone: 'good'
      }
    ],
    opportunities: [
      {
        title: 'Speed up receivables follow-up cadence',
        revenueIncrease: '—',
        profitIncrease: '—',
        cost: 'Low',
        roi: 'High',
        time: '1 week',
        confidence: 'High',
        priority: 'Immediate',
        status: 'Ready for approval',
        reviewDate: 'Friday',
        category: 'Cash Flow',
        description: 'A tighter collections rhythm is likely to pull forward £6.0k–£8.0k in cash without reducing growth activity.'
      },
      {
        title: 'Renegotiate one high-cost supplier relationship',
        revenueIncrease: '—',
        profitIncrease: '£1.2k/month',
        cost: 'Low',
        roi: 'Medium–High',
        time: '2–4 weeks',
        confidence: 'Medium',
        priority: 'High',
        status: 'Under review',
        reviewDate: 'Next Monday',
        category: 'Profit',
        description: 'Supplier spend suggests room to improve unit economics or payment terms without disrupting service quality.'
      },
      {
        title: 'Reduce low-yield discretionary operating spend',
        revenueIncrease: '—',
        profitIncrease: '£900/month',
        cost: 'None',
        roi: 'High',
        time: '2 weeks',
        confidence: 'Medium',
        priority: 'High',
        status: 'Requires decision',
        reviewDate: 'Wednesday',
        category: 'Cost Saving',
        description: 'Travel and ad hoc support costs appear to have expanded faster than their clear commercial return.'
      }
    ],
    risks: [
      {
        level: 'High',
        impact: '£6k–£8k cash timing pressure',
        probability: 'Medium',
        mitigation: 'Escalate overdue follow-up and set explicit collection dates.',
        owner: 'CFO',
        reviewDate: 'This week',
        trend: 'Worsening',
        commentary: 'Receivables concentration is a real but manageable control issue. The risk is not lack of demand; it is timing discipline.'
      },
      {
        level: 'Medium',
        impact: '£1k–£2k monthly margin erosion',
        probability: 'Medium',
        mitigation: 'Review supplier contribution by category before next buying cycle.',
        owner: 'CFO / COO',
        reviewDate: 'Next Sunday',
        trend: 'Stable',
        commentary: 'Supplier cost inflation is not yet dangerous, but it is becoming strategically meaningful.'
      },
      {
        level: 'Medium',
        impact: 'Forecast confidence reduction',
        probability: 'Low–Medium',
        mitigation: 'Tighten VAT and invoice capture workflow.',
        owner: 'Finance Ops',
        reviewDate: 'Month end',
        trend: 'Improving',
        commentary: 'Data quality is good enough for confident direction, but not perfect enough to be ignored.'
      }
    ],
    approvals: {
      Accounting: [
        {
          title: 'Approve supplier payment batch',
          why: 'Three invoices fall due this week including fitting bay consumables.',
          impact: 'Maintains supplier continuity but reduces near-term cash headroom.',
          risk: 'Low–Medium',
          confidence: 'High'
        }
      ],
      Invoices: [
        {
          title: 'Approve overdue invoice escalation plan',
          why: 'Passive reminders are no longer enough for the overdue balance.',
          impact: 'Likely positive cash acceleration with minimal operational downside.',
          risk: 'Low',
          confidence: 'High'
        }
      ],
      Bills: [
        {
          title: 'Approve staged payment timing review',
          why: 'Some bills can be sequenced more intelligently against incoming cash.',
          impact: 'Improves cash timing without damaging supplier trust if managed carefully.',
          risk: 'Medium',
          confidence: 'Medium'
        }
      ],
      Categorisation: [
        {
          title: 'Approve contractor spend reclassification',
          why: 'Current coding obscures whether spend is growth support or general overhead.',
          impact: 'Improves forecasting quality and cost-centre clarity.',
          risk: 'Low',
          confidence: 'Medium'
        }
      ],
      Recommendations: [
        {
          title: 'Approve supplier negotiation proposal',
          why: 'One supplier line is growing faster than profit contribution.',
          impact: 'Potential £1.2k monthly margin improvement.',
          risk: 'Medium',
          confidence: 'Medium'
        }
      ],
      'Forecast assumptions': [
        {
          title: 'Approve conservative Q3 growth assumption',
          why: 'The current forecast assumes stable demand but tighter margin conversion.',
          impact: 'Leads to more prudent cash and profit planning.',
          risk: 'Low',
          confidence: 'Medium–High'
        }
      ]
    },
    chat: [
      {
        question: 'Why has profit changed?',
        answer:
          'Profit softened because cost growth has been faster than margin expansion. Revenue is up, but supplier and fulfilment costs have eaten into the gain. That matters because good top-line momentum can otherwise create false confidence.'
      },
      {
        question: 'Can I afford another GCQuad?',
        answer:
          'On placeholder numbers, potentially yes — but only as a deliberate investment decision. I would want to test cash headroom, payback period, expected fitting uplift, and whether current receivables timing makes this month the right moment.'
      },
      {
        question: 'What should I focus on this week?',
        answer:
          'This week I would focus on invoice collection speed, supplier margin discipline, and controlled discretionary spend. Those three levers offer the strongest control benefit with the least disruption.'
      },
      {
        question: 'Which suppliers cost the most?',
        answer:
          'In this demo environment, the largest supplier line is launch monitor inventory at £8.7k this month. The more useful next question is whether that spend is aligned to profitable demand and the right payment timing.'
      },
      {
        question: "Forecast next month's profit.",
        answer:
          'Using placeholder assumptions, next month’s profit looks stable to slightly improved if collections normalise and supplier cost growth slows. If current expense drift continues, profit likely flattens rather than grows.'
      }
    ],
    charts: {
      revenueMonthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [34, 37, 39, 41, 43, 44, 47]
      },
      revenuePaymentMethods: {
        labels: ['Card', 'Bank Transfer', 'Finance', 'Cash'],
        values: [54, 24, 17, 5]
      },
      revenueInvoiceStatus: {
        labels: ['Paid', 'Pending', 'Overdue'],
        values: [72, 18, 10]
      },
      profitTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [8.4, 9.2, 10.1, 10.5, 11.1, 12.0, 11.6]
      },
      expenseTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [18.2, 19.1, 20.0, 21.0, 22.4, 23.1, 24.9]
      },
      supplierTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [5.4, 5.1, 5.9, 6.3, 7.0, 8.0, 8.7]
      },
      cashForecast: {
        labels: ['Now', '30d', '60d', '90d'],
        values: [28, 21, 24, 26]
      },
      historicalScores: {
        labels: ['Q4', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [76, 77, 78, 79, 80, 81, 82, 84]
      }
    },
    suppliers: [
      {
        id: 'foresight-sports',
        name: 'Foresight Sports',
        spendMonth: '£8.7k',
        spendYtd: '£41.2k',
        spendLastYear: '£33.6k',
        yoy: '+22.6%',
        avgInvoice: '£2.2k',
        invoices: '4',
        lastPayment: '2026-07-01',
        category: 'Launch Monitors',
        risk: 'Medium',
        opportunity: 'Payment terms review + bundle pricing check'
      },
      {
        id: 'titleist-pro-v1',
        name: 'Titleist Trade',
        spendMonth: '£5.2k',
        spendYtd: '£28.7k',
        spendLastYear: '£25.4k',
        yoy: '+13.0%',
        avgInvoice: '£1.3k',
        invoices: '8',
        lastPayment: '2026-06-27',
        category: 'Retail Stock',
        risk: 'Low',
        opportunity: 'Margin mix review on premium stock lines'
      },
      {
        id: 'trackman-services',
        name: 'Trackman Services',
        spendMonth: '£3.8k',
        spendYtd: '£19.9k',
        spendLastYear: '£16.1k',
        yoy: '+23.6%',
        avgInvoice: '£1.9k',
        invoices: '3',
        lastPayment: '2026-06-18',
        category: 'Subscriptions & Support',
        risk: 'Medium',
        opportunity: 'Usage and contract alignment review'
      }
    ],
    decisionJournal: [
      {
        id: 'DJ-017',
        date: '2026-07-03',
        executive: 'CFO',
        recommendation: 'Escalate overdue receivable follow-up on four concentrated invoices.',
        reasoning: 'Cash flexibility is being constrained by a small number of slow-paying balances.',
        evidence: '£9.4k outstanding, 4 invoices overdue, 30-day cash forecast dependent on collections.',
        alternatives: 'Wait another week; stage payment sequencing instead.',
        decision: 'Pending approval',
        outcome: 'Awaiting decision',
        impact: 'Potential £6k–£8k cash acceleration',
        confidence: 'High',
        lessons: 'Collections cadence should tighten before balances become concentrated.',
        reviewDate: '2026-07-10',
        status: 'Pending'
      },
      {
        id: 'DJ-016',
        date: '2026-06-29',
        executive: 'CFO',
        recommendation: 'Review one major supplier relationship for margin protection.',
        reasoning: 'Supplier spend has risen faster than gross profit contribution.',
        evidence: 'Largest supplier line up +22.6% YoY, margin softening 3.1% month on month.',
        alternatives: 'Absorb cost; pass through selectively; reduce order volume.',
        decision: 'Approved',
        outcome: 'Negotiation prep underway',
        impact: 'Estimated £1.2k monthly margin upside',
        confidence: 'Medium',
        lessons: 'Supplier concentration should be reviewed before it becomes embedded.',
        reviewDate: '2026-07-21',
        status: 'Active'
      },
      {
        id: 'DJ-015',
        date: '2026-06-18',
        executive: 'CFO',
        recommendation: 'Hold discretionary support costs flat for one cycle.',
        reasoning: 'Contractor and support spend drifted above the planned baseline.',
        evidence: 'Expense trend up 6.8% with unclear operating return on part of spend.',
        alternatives: 'Immediate reduction; continue unchanged; reclassify first.',
        decision: 'Approved',
        outcome: 'Expense drift stabilised',
        impact: 'Avoided roughly £900 monthly cost escalation',
        confidence: 'Medium',
        lessons: 'Small discretionary lines need explicit ownership before they compound.',
        reviewDate: '2026-08-01',
        status: 'Reviewed'
      }
    ],
    weeklyBriefing: {
      summary:
        'EP Golf Studios enters the week from a position of financial strength, but margin quality and collections speed remain the most important control levers for protecting strategic flexibility.',
      wins: [
        'Revenue remains ahead of the recent baseline.',
        'Cash headroom is healthy enough to avoid reactive decisions.',
        'Expense drift is visible early, which means it can still be managed calmly.'
      ],
      risks: [
        'Receivables timing remains too concentrated.',
        'Supplier spend is growing faster than comfort allows.',
        'Forecast confidence is slightly constrained by incomplete categorisation clarity.'
      ],
      recommendations: [
        'Approve overdue receivables escalation plan.',
        'Pressure-test the biggest supplier line before the next purchasing cycle.',
        'Hold discretionary operating spend steady until profit quality improves.'
      ],
      questions: [
        'Which current spend lines are genuinely strategic versus merely habitual?',
        'If growth remains strong but margin weakens, what should be slowed first?',
        'What assumptions in the 30/60/90 day cash view need the closest challenge?' 
      ]
    },
    futureIntegrations: [
      'CMO Workspace',
      'COO Workspace',
      'CEO Workspace',
      'Bookings Dashboard',
      'CRM',
      'Inventory',
      'HR',
      'Payroll',
      'Google Analytics',
      'Gmail',
      'Calendar',
      'Customer Portal'
    ]
  }
};

const pageContent = document.getElementById('page-content');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');
const breadcrumb = document.getElementById('breadcrumb');
const primaryNav = document.getElementById('primary-nav');
const secondaryNav = document.getElementById('secondary-nav');
const modeSwitcher = document.getElementById('mode-switcher');

const PAGE_META = {
  workspace: {
    title: 'CFO Workspace',
    subtitle: 'A conversational executive homepage for day-to-day financial management.'
  },
  revenue: { title: 'Revenue', subtitle: 'Revenue performance, mix, forecasts, and booking pipeline context.' },
  profit: { title: 'Profit', subtitle: 'Margin quality, cost pressure, and profitability decisions.' },
  expenses: { title: 'Expenses', subtitle: 'Expense discipline, categories, and operating cost insight.' },
  'supplier-spend': { title: 'Supplier Spend', subtitle: 'Supplier concentration, risk, opportunity, and drill-down placeholders.' },
  'cash-flow': { title: 'Cash Flow', subtitle: 'Liquidity strength, cash runway, and forecast risk.' },
  vat: { title: 'VAT', subtitle: 'Estimated position, timing, forecast, and confidence level.' },
  forecasting: { title: 'Forecasting', subtitle: 'Executive forecasting workspace with scenarios and investment thinking.' },
  'business-kpis': { title: 'Business KPIs', subtitle: 'Cross-business KPI framework with context, not just numbers.' },
  'approval-centre': { title: 'Approval Centre', subtitle: 'Approval-first decisions grouped by type and risk.' },
  'decision-journal': { title: 'Decision Journal', subtitle: 'Searchable timeline of recommendations, approvals, outcomes, and lessons.' },
  'weekly-briefings': { title: 'Weekly Briefings', subtitle: 'Sunday executive briefing presented like a board paper.' },
  settings: { title: 'Settings', subtitle: 'Future controls for integrations, personas, preferences, and governance.' },
  'financial-health': { title: 'Financial Health Score', subtitle: 'A transparent breakdown of the score, weightings, and how it changed.' },
  'opportunity-register': { title: 'Opportunity Register', subtitle: 'A permanent register of financial and strategic upside.' },
  'risk-register': { title: 'Risk Register', subtitle: 'A living document of business risks, mitigations, and review cadence.' },
  'quarterly-review': { title: 'Quarterly Executive Review', subtitle: 'A board-style quarterly review pack for what changed and what matters next.' }
};

function pill(text, tone = 'neutral') {
  return `<span class="pill ${tone}">${text}</span>`;
}

function escapeAttr(text) {
  return String(text).replace(/"/g, '&quot;');
}

function lineChart({ labels, values, suffix = '', color = '#7dd3fc' }) {
  const width = 640;
  const height = 220;
  const padding = 24;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y, value };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${padding},${height - padding} ${polyline} ${width - padding},${height - padding}`;

  return `
    <div class="chart-shell">
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="area-${Math.random().toString(36).slice(2)}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.35"></stop>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <path d="M ${padding} ${height - padding} L ${polyline} L ${width - padding} ${height - padding} Z" fill="rgba(125, 211, 252, 0.10)"></path>
        <polyline points="${polyline}" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></polyline>
        ${points
          .map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}"></circle>`)
          .join('')}
      </svg>
      <div class="axis-labels">${labels.map((label) => `<span>${label}</span>`).join('')}</div>
      <div class="meta muted">Latest: ${values[values.length - 1]}${suffix}</div>
    </div>
  `;
}

function barChart({ labels, values, suffix = '', color = '#38bdf8' }) {
  const max = Math.max(...values) || 1;
  return `
    <div class="chart-shell">
      <div style="display:grid; gap:10px;">
        ${values
          .map(
            (value, index) => `
              <div>
                <div class="meta-row" style="justify-content:space-between; margin-bottom:6px;">
                  <span class="muted">${labels[index]}</span>
                  <strong>${value}${suffix}</strong>
                </div>
                <div style="height:10px; border-radius:999px; background:rgba(255,255,255,0.05); overflow:hidden;">
                  <div style="height:100%; width:${(value / max) * 100}%; background:${color}; border-radius:999px;"></div>
                </div>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

function executiveQuestions(data) {
  return `
    <section class="panel">
      <div class="panel-heading compact">
        <div>
          <div class="eyebrow">Executive Intelligence</div>
          <h3>The four questions this page answers</h3>
        </div>
      </div>
      <div class="executive-questions">
        <div class="question-card"><div class="label">What happened?</div><h4>${data.what}</h4><p>${data.whatText}</p></div>
        <div class="question-card"><div class="label">Why did it happen?</div><h4>${data.why}</h4><p>${data.whyText}</p></div>
        <div class="question-card"><div class="label">Does it matter?</div><h4>${data.matters}</h4><p>${data.mattersText}</p></div>
        <div class="question-card"><div class="label">What should I do next?</div><h4>${data.next}</h4><p>${data.nextText}</p></div>
      </div>
    </section>
  `;
}

function commentaryCard(title, entry) {
  return `
    <section class="panel commentary-card">
      <div class="panel-heading compact">
        <div>
          <div class="eyebrow">AI Commentary Standard</div>
          <h3>${title}</h3>
        </div>
        ${pill(`${entry.confidence} confidence`, entry.confidence.includes('High') ? 'good' : 'warn')}
      </div>
      <div class="commentary-grid">
        <div class="commentary-card"><div class="label">Executive Summary</div><h4>${entry.summary}</h4></div>
        <div class="commentary-card"><div class="label">Supporting Evidence</div><p>${entry.evidence}</p></div>
        <div class="commentary-card"><div class="label">Financial Impact</div><p>${entry.impact}</p></div>
        <div class="commentary-card"><div class="label">Risks</div><p>${entry.risks}</p></div>
        <div class="commentary-card"><div class="label">Alternative Options</div><p>${entry.alternatives}</p></div>
        <div class="commentary-card"><div class="label">Recommended Action</div><p>${entry.action}</p></div>
        <div class="commentary-card" style="grid-column:1 / -1;"><div class="label">Missing Information</div><p>${entry.missing}</p></div>
      </div>
    </section>
  `;
}

function renderNav(container, items) {
  container.innerHTML = items
    .map(([id, label]) => {
      const meta = PAGE_META[id];
      const active = appState.currentPage === id && appState.mode === 'workspace';
      return `<a href="#${id}" class="nav-link ${active ? 'active' : ''}" data-page="${id}"><span>${label}</span><small>→</small></a>`;
    })
    .join('');

  container.querySelectorAll('[data-page]').forEach((node) => {
    node.addEventListener('click', (event) => {
      event.preventDefault();
      setMode('workspace');
      setPage(node.dataset.page);
    });
  });
}

function renderModeSwitcher() {
  modeSwitcher.innerHTML = ['workspace', 'board']
    .map(
      (mode) => `<button class="mode-button ${appState.mode === mode ? 'active' : ''}" data-mode="${mode}">${
        mode === 'workspace' ? 'Workspace' : 'Board Meeting'
      }</button>`
    )
    .join('');

  modeSwitcher.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.mode));
  });
}

function setPage(page) {
  appState.currentPage = page;
  syncUrl();
  render();
}

function setMode(mode) {
  appState.mode = mode;
  syncUrl();
  render();
}

function syncUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set('page', appState.currentPage);
  params.set('mode', appState.mode);
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');
  const mode = params.get('mode');
  const validPages = new Set([...NAV_PRIMARY, ...NAV_SECONDARY].map(([id]) => id));
  if (validPages.has(page)) appState.currentPage = page;
  if (mode === 'workspace' || mode === 'board') appState.mode = mode;
}

function statsGrid(items) {
  return `<div class="metric-grid">${items
    .map(
      (item) => `
      <button class="metric-button ${appState.activeMetric === item.key ? 'active' : ''}" data-metric="${item.key}">
        <div class="label">${item.label}</div>
        <strong>${item.value}</strong>
        <p>${item.trend}</p>
      </button>
    `
    )
    .join('')}</div>`;
}

function workspacePage() {
  const metric = appState.data.metrics.find((item) => item.key === appState.activeMetric) || appState.data.metrics[0];
  return `
    <div class="page-grid">
      <section class="hero">
        <div class="panel">
          <div class="eyebrow">Good morning, Kane.</div>
          <div class="hero-title">Your CFO is ready.</div>
          <p class="hero-summary">${appState.data.welcome.summary}</p>
          <div class="page-note" style="margin-top:16px;">
            <div class="label">Current status summary</div>
            <h4>${appState.data.welcome.label}</h4>
            <p>${appState.data.welcome.narrative}</p>
          </div>
        </div>
        <div class="hero-side">
          <div class="score-tile">
            <div class="label">Financial Health Score</div>
            <strong>${appState.data.welcome.score}</strong>
            <small>${appState.data.welcome.trend}</small>
          </div>
          <div class="panel">
            <div class="label">One-sentence health view</div>
            <p>${appState.data.welcome.narrative}</p>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-heading">
          <div>
            <div class="eyebrow">Executive Summary</div>
            <h3>What matters right now</h3>
          </div>
          <p>Every number is explained in the language of decisions, not accounting administration.</p>
        </div>
        ${statsGrid(appState.data.metrics)}
        <div class="drilldown-card">
          <div class="label">CFO Readout</div>
          <h4>${metric.label}</h4>
          <p>${metric.detail}</p>
        </div>
      </section>

      ${executiveQuestions({
        what: 'Revenue is healthy, profit is slightly tighter',
        whatText: 'The business is growing, but the shape of that growth is more important than the volume alone.',
        why: 'Cost pressure has risen faster than ideal',
        whyText: 'Supplier concentration and expense drift have moderated the benefit of revenue growth.',
        matters: 'Yes — it affects flexibility',
        mattersText: 'The business is still healthy, but strategic room narrows if margin quality keeps slipping.',
        next: 'Prioritise collections and margin control',
        nextText: 'The best next decisions are around receivables, supplier discipline, and selective spend restraint.'
      })}

      <div class="grid-2">
        <section class="panel">
          <div class="panel-heading compact"><div><div class="eyebrow">My Priorities</div><h3>Top three CFO priorities</h3></div></div>
          <div class="section-stack">
            ${appState.data.priorities
              .map(
                (item, index) => `
                  <div class="timeline-entry">
                    <div class="tone-row"><strong>${index + 1}. ${item.title}</strong>${pill(item.tone === 'good' ? 'Positive' : item.tone === 'warn' ? 'Watch item' : 'Risk', item.tone)}</div>
                    <p>${item.note}</p>
                  </div>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="panel">
          <div class="panel-heading compact"><div><div class="eyebrow">Weekly Briefing</div><h3>Sunday executive briefing preview</h3></div></div>
          <div class="timeline-entry">
            <strong>${appState.data.weeklyBriefing.summary}</strong>
          </div>
          <ul class="briefing-list">
            ${appState.data.weeklyBriefing.recommendations.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </section>
      </div>

      <div class="grid-2">
        <section class="panel">
          <div class="panel-heading compact"><div><div class="eyebrow">Opportunities</div><h3>Where the CFO sees upside</h3></div></div>
          <div class="opportunity-list">
            ${appState.data.opportunities
              .map(
                (item) => `
                  <div class="register-row">
                    <div class="register-meta">${pill(item.category, 'info')}${pill(`${item.confidence} confidence`, item.confidence === 'High' ? 'good' : 'warn')}</div>
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <strong>${item.profitIncrease === '—' ? item.roi : item.profitIncrease}</strong>
                  </div>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="panel">
          <div class="panel-heading compact"><div><div class="eyebrow">Risks</div><h3>What needs watching</h3></div></div>
          <div class="risk-list">
            ${appState.data.risks
              .map(
                (item) => `
                  <div class="register-row">
                    <div class="register-meta">${pill(item.level, item.level === 'High' ? 'risk' : 'warn')}${pill(item.trend, item.trend === 'Improving' ? 'good' : item.trend === 'Stable' ? 'neutral' : 'warn')}</div>
                    <h4>${item.impact}</h4>
                    <p><strong>Reason:</strong> ${item.commentary}</p>
                    <p><strong>Recommended mitigation:</strong> ${item.mitigation}</p>
                  </div>
                `
              )
              .join('')}
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="panel-heading"><div><div class="eyebrow">Approval Centre</div><h3>Actions waiting for approval</h3></div><p>Nothing executes automatically. The CFO always stages decisions first.</p></div>
        <div class="approval-grid">
          ${Object.entries(appState.data.approvals)
            .slice(0, 4)
            .map(
              ([group, entries]) => `
                <div class="approval-card">
                  <div class="label">${group}</div>
                  <h4>${entries[0].title}</h4>
                  <p><strong>Why:</strong> ${entries[0].why}</p>
                  <p><strong>Impact:</strong> ${entries[0].impact}</p>
                  <div class="approval-meta">${pill(`Risk: ${entries[0].risk}`, entries[0].risk.includes('Low') ? 'good' : 'warn')}${pill(`Confidence: ${entries[0].confidence}`, 'info')}</div>
                </div>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="panel">
        <div class="panel-heading"><div><div class="eyebrow">Ask My CFO</div><h3>Natural-language finance workspace</h3></div><p>This sprint uses placeholder answers, but the interface is designed for real executive conversation.</p></div>
        <div class="grid-2">
          <div class="section-stack">
            ${appState.data.chat
              .map(
                (entry, index) => `
                  <button class="question-card ${index === appState.activeQuestion ? 'active' : ''}" data-question="${index}">
                    <div class="label">Suggested prompt</div>
                    <h4>${entry.question}</h4>
                  </button>
                `
              )
              .join('')}
          </div>
          <div class="section-stack">
            <div class="question-card active">
              <div class="label">Kane asks</div>
              <h4>${appState.data.chat[appState.activeQuestion].question}</h4>
            </div>
            <div class="question-card">
              <div class="label">CFO response</div>
              <p>${appState.data.chat[appState.activeQuestion].answer}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function revenuePage() {
  return `
    <div class="page-grid">
      <section class="panel">
        <div class="panel-heading"><div><div class="eyebrow">Revenue</div><h3>Revenue performance and quality</h3></div><p>The page explains what changed, why it changed, and whether that growth is strategically useful.</p></div>
        <div class="grid-4">
          <div class="stat-card"><div class="label">Revenue this month</div><strong>£46.8k</strong><p>Strong month driven by fitting demand and accessory conversion.</p></div>
          <div class="stat-card"><div class="label">Revenue vs last year</div><strong>+14.2%</strong><p>Healthy year-on-year growth without obvious discount-led distortion.</p></div>
          <div class="stat-card"><div class="label">Revenue forecast</div><strong>£49.5k</strong><p>Assumes bookings remain stable and conversion quality holds.</p></div>
          <div class="stat-card"><div class="label">Future bookings placeholder</div><strong>Bookings feed</strong><p>Future Bookings Dashboard integration will feed high-confidence pipeline here later.</p></div>
        </div>
      </section>
      ${executiveQuestions({
        what: 'Revenue is trending up',
        whatText: 'Monthly revenue is ahead of both recent months and the implied prior-year baseline.',
        why: 'Demand and conversion improved',
        whyText: 'Fitting demand appears stronger and premium conversion is supporting basket quality.',
        matters: 'Yes, if margin quality holds',
        mattersText: 'Revenue growth matters only if it converts into profit and cash rather than masking cost inflation.',
        next: 'Track mix and booking quality',
        nextText: 'The best next step is to compare revenue growth against gross margin, collections, and booking intent.'
      })}
      <div class="chart-grid">
        <section class="chart-card"><div class="label">Revenue trend chart</div><h4>Revenue by month</h4>${lineChart({ labels: appState.data.charts.revenueMonthly.labels, values: appState.data.charts.revenueMonthly.values, suffix: 'k' })}</section>
        <section class="chart-card"><div class="label">Revenue mix</div><h4>Revenue by payment method</h4>${barChart({ labels: appState.data.charts.revenuePaymentMethods.labels, values: appState.data.charts.revenuePaymentMethods.values, suffix: '%' })}</section>
        <section class="chart-card"><div class="label">Collection profile</div><h4>Revenue by invoice status</h4>${barChart({ labels: appState.data.charts.revenueInvoiceStatus.labels, values: appState.data.charts.revenueInvoiceStatus.values, suffix: '%' })}</section>
      </div>
      ${commentaryCard('Revenue AI Commentary', {
        summary: 'Revenue is encouraging, but the important question is whether quality is improving alongside quantity.',
        evidence: 'Monthly revenue +8.4%, YoY +14.2%, premium bookings and add-on conversion both up in placeholder data.',
        confidence: 'High',
        impact: 'Higher revenue supports flexibility, but only if gross margin and collection speed remain healthy.',
        risks: 'Revenue could feel stronger than it is if supplier cost inflation or receivable slippage continues.',
        alternatives: 'Push volume harder, protect premium mix, or slow lower-margin activity to improve profit conversion.',
        action: 'Keep watching revenue mix, booking quality, and margin conversion before celebrating the top line too early.',
        missing: 'Future bookings data and live attribution sources are not connected in this sprint.'
      })}
      <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Future integration placeholder</div><h3>Bookings Dashboard</h3></div></div><div class="integration-tile"><p>This area is reserved for the Future Bookings Dashboard so the CFO can connect demand pipeline with revenue forecasting and cash planning.</p></div></section>
    </div>
  `;
}

function profitPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Profit</div><h3>Margin quality and profitability</h3></div><p>This page turns profitability into decision language instead of static accounting output.</p></div>
        <div class="grid-4">
          <div class="stat-card"><div class="label">Gross profit</div><strong>£24.1k</strong><p>Gross profit remains healthy but is being pressured by supplier costs.</p></div>
          <div class="stat-card"><div class="label">Net profit</div><strong>£11.6k</strong><p>Still strong, though slightly below last month’s level.</p></div>
          <div class="stat-card"><div class="label">Gross margin</div><strong>51.5%</strong><p>Margin is acceptable but should improve if supplier terms tighten.</p></div>
          <div class="stat-card"><div class="label">Net margin</div><strong>24.8%</strong><p>Net margin remains solid for the current growth stage.</p></div>
        </div>
      </section>
      ${executiveQuestions({ what: 'Profit softened slightly', whatText: 'Top-line growth has not fully translated into stronger net output this month.', why: 'Costs rose faster than ideal', whyText: 'Supplier, fulfilment, and discretionary operating costs compressed the gain.', matters: 'Yes, because it changes confidence', mattersText: 'The business is still strong, but weaker conversion limits room for casual investment decisions.', next: 'Defend margin quality', nextText: 'Review cost centres, challenge supplier terms, and keep discretionary spend disciplined.' })}
      <div class="chart-grid">
        <section class="chart-card"><div class="label">Profit trend</div><h4>Monthly profit trend</h4>${lineChart({ labels: appState.data.charts.profitTrend.labels, values: appState.data.charts.profitTrend.values, suffix: 'k' })}</section>
        <section class="chart-card"><div class="label">Cost centres</div><h4>Biggest cost centres</h4>${barChart({ labels: ['Suppliers', 'Team/Support', 'Rent', 'Software'], values: [42, 23, 19, 16], suffix: '%' })}</section>
      </div>
      ${commentaryCard('Profit AI Commentary', {
        summary: 'Profit remains strong enough for confidence, but margin discipline is now more strategically important than further top-line celebration.',
        evidence: 'Net profit down 3.1% month on month while supplier and support-related cost pressure increased.',
        confidence: 'High',
        impact: 'Sustained margin leakage would reduce reinvestment flexibility within one to two cycles.',
        risks: 'Good revenue can disguise weakening unit economics if cost discipline is not visible enough.',
        alternatives: 'Absorb pressure temporarily, cut selectively, or negotiate margin improvements upstream.',
        action: 'Protect gross margin first, then challenge the biggest soft-cost lines before new investment decisions are made.',
        missing: 'Live SKU, invoice, and supplier-level margin data is not connected yet.'
      })}
      <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Recommendations</div><h3>Ways to improve profitability</h3></div></div><div class="section-stack"><div class="register-row"><h4>Renegotiate one major supplier</h4><p>Potential £1.2k monthly margin improvement.</p></div><div class="register-row"><h4>Reduce low-yield discretionary costs</h4><p>Protects net profit without reducing growth capacity.</p></div><div class="register-row"><h4>Review premium service mix</h4><p>Higher-value booking conversion may widen margin faster than volume alone.</p></div></div></section>
    </div>
  `;
}

function expensesPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Expenses</div><h3>Operating cost intelligence</h3></div><p>Expense visibility should help prioritise decisions, not just explain where money went.</p></div>
        <div class="grid-4">
          <div class="stat-card"><div class="label">Monthly expenses</div><strong>£24.9k</strong><p>Expense growth is visible early enough to manage calmly.</p></div>
          <div class="stat-card"><div class="label">Fixed vs variable</div><strong>58 / 42</strong><p>Fixed costs remain stable; variable costs need more attention.</p></div>
          <div class="stat-card"><div class="label">Software subscriptions</div><strong>£1.4k</strong><p>Software is manageable but should be reviewed for overlap later.</p></div>
          <div class="stat-card"><div class="label">Largest expense</div><strong>Inventory & supply</strong><p>Supplier-related spend remains the primary cost driver.</p></div>
        </div>
      </section>
      ${executiveQuestions({ what: 'Expenses are trending upward', whatText: 'Spend is still under control, but variable lines are rising faster than the baseline plan.', why: 'Activity, support, and discretionary lines increased', whyText: 'Contractor, travel, and supplier-related costs rose alongside commercial activity.', matters: 'Yes, because profit conversion depends on it', mattersText: 'Expenses only matter strategically when they outpace the return generated by revenue growth.', next: 'Separate strategic spend from drift', nextText: 'Keep valuable spend, but remove spend that lacks a clear return or owner.' })}
      <div class="chart-grid">
        <section class="chart-card"><div class="label">Monthly trend</div><h4>Expense trend</h4>${lineChart({ labels: appState.data.charts.expenseTrend.labels, values: appState.data.charts.expenseTrend.values, suffix: 'k' })}</section>
        <section class="chart-card"><div class="label">Expense categories</div><h4>Category mix</h4>${barChart({ labels: ['Suppliers', 'Support', 'Travel', 'Software', 'Premises'], values: [41, 21, 9, 14, 15], suffix: '%' })}</section>
        <section class="chart-card"><div class="label">Largest expenses</div><h4>Current cost concentration</h4>${barChart({ labels: ['Inventory', 'Contractors', 'Rent', 'Tools'], values: [8.7, 3.1, 2.8, 1.4], suffix: 'k' })}</section>
      </div>
      ${commentaryCard('Expense AI Insights', {
        summary: 'Expenses are not alarming, but several lines are growing more from habit than from intentional strategy.',
        evidence: 'Monthly expense growth +6.8%, especially in contractor support and discretionary movement.',
        confidence: 'Medium–High',
        impact: 'Controlled action now can protect roughly £900+ monthly without reducing important growth work.',
        risks: 'Overreacting could cut useful capability; underreacting could normalise avoidable leakage.',
        alternatives: 'Freeze discretionary lines, reclassify before cutting, or protect only the spend tied to strong return.',
        action: 'Review variable cost lines one by one and keep only the ones with a clear commercial or operational case.',
        missing: 'Live invoice and subscription-level feeds will improve confidence later.'
      })}
    </div>
  `;
}

function supplierSpendPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Supplier Spend</div><h3>Supplier concentration, leverage, and risk</h3></div><p>This is one of the strongest strategic pages because supplier behaviour shapes both margin and cash quality.</p></div>
        <div class="grid-4">
          <div class="stat-card"><div class="label">Spend this month</div><strong>£17.7k</strong><p>Concentrated in a small number of critical supplier relationships.</p></div>
          <div class="stat-card"><div class="label">Spend year-to-date</div><strong>£89.8k</strong><p>Running ahead of the prior trajectory.</p></div>
          <div class="stat-card"><div class="label">Spend last year</div><strong>£75.1k</strong><p>Used as the placeholder comparison base.</p></div>
          <div class="stat-card"><div class="label">Year-on-year</div><strong>+19.6%</strong><p>Higher than the comfort zone if gross margin does not keep pace.</p></div>
        </div>
      </section>
      ${executiveQuestions({ what: 'Supplier spend is rising and concentrated', whatText: 'A few suppliers account for a meaningful share of outgoing cash and margin pressure.', why: 'Inventory, support, and premium product positioning have lifted supplier exposure', whyText: 'The growth profile appears commercially rational, but not all of it has been pressure-tested recently.', matters: 'Yes, because supplier concentration shapes margin and liquidity', mattersText: 'The strategic issue is not just cost — it is dependency, payment timing, and bargaining power.', next: 'Review top suppliers one by one', nextText: 'Challenge whether the biggest suppliers are earning their share of spend and whether terms are still optimal.' })}
      <div class="grid-3">
        <section class="chart-card"><div class="label">Monthly trend</div><h4>Supplier spend trend</h4>${lineChart({ labels: appState.data.charts.supplierTrend.labels, values: appState.data.charts.supplierTrend.values, suffix: 'k' })}</section>
        <section class="chart-card"><div class="label">Top spending categories</div><h4>Category mix</h4>${barChart({ labels: ['Launch Monitors', 'Retail Stock', 'Subscriptions', 'Consumables'], values: [39, 29, 19, 13], suffix: '%' })}</section>
        <section class="chart-card"><div class="label">Supplier risk indicator</div><h4>Risk distribution</h4>${barChart({ labels: ['Low', 'Medium', 'High'], values: [34, 52, 14], suffix: '%' })}</section>
      </div>
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Top suppliers</div><h3>Supplier drill-down placeholders</h3></div><p>Each supplier links to its own future drill-down page placeholder.</p></div>
        <div class="supplier-list">
          ${appState.data.suppliers.map((supplier) => `
            <div class="supplier-card">
              <div class="supplier-meta">${pill(supplier.risk + ' risk', supplier.risk === 'Low' ? 'good' : 'warn')}${pill(supplier.category, 'info')}</div>
              <h4>${supplier.name}</h4>
              <div class="grid-4">
                <div><div class="label">This month</div><strong>${supplier.spendMonth}</strong></div>
                <div><div class="label">YTD</div><strong>${supplier.spendYtd}</strong></div>
                <div><div class="label">Last year</div><strong>${supplier.spendLastYear}</strong></div>
                <div><div class="label">YoY</div><strong>${supplier.yoy}</strong></div>
              </div>
              <div class="drilldown-meta"><span class="muted">Average invoice: ${supplier.avgInvoice}</span><span class="muted">Invoices: ${supplier.invoices}</span><span class="muted">Last payment: ${supplier.lastPayment}</span></div>
              <p><strong>Supplier opportunity:</strong> ${supplier.opportunity}</p>
              <a href="#" class="text-link supplier-link" data-supplier="${escapeAttr(supplier.id)}">Open drill-down placeholder →</a>
            </div>
          `).join('')}
        </div>
      </section>
      <div class="grid-2">
        <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Supplier opportunities</div><h3>Current upside</h3></div></div><div class="section-stack"><div class="register-row"><h4>Term review with top supplier</h4><p>Potential to improve margin and cash timing at the same time.</p></div><div class="register-row"><h4>Bundle volume strategically</h4><p>Larger, more intentional orders may improve unit economics without losing control.</p></div></div></section>
        <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">AI recommendations</div><h3>What the CFO would do next</h3></div></div><div class="section-stack"><div class="register-row"><p>Review the top three supplier relationships individually, test contribution margin, and decide whether current spend reflects strategy or drift.</p></div></div></section>
      </div>
      ${commentaryCard('Supplier Spend AI Commentary', {
        summary: 'Supplier spend is strategically meaningful now — not dangerous, but important enough to deserve explicit executive attention.',
        evidence: 'Top supplier up +22.6% YoY, overall supplier spend +19.6% vs placeholder last year, and profit conversion slightly softer.',
        confidence: 'Medium–High',
        impact: 'Better terms or spend discipline could improve both margin quality and cash timing.',
        risks: 'Challenging suppliers without understanding service dependency could create friction or reduce fulfilment quality.',
        alternatives: 'Renegotiate, re-sequence orders, accept current terms temporarily, or redesign product mix.',
        action: 'Open individual supplier reviews and decide which relationships justify negotiation, consolidation, or reduced dependence.',
        missing: 'Live contract, invoice, and inventory dependency data is not connected yet.'
      })}
    </div>
  `;
}

function cashFlowPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Cash Flow</div><h3>Liquidity, runway, and confidence</h3></div><p>Cash flow is presented as a decision engine, not a backward-looking statement.</p></div>
        <div class="grid-4">
          <div class="stat-card"><div class="label">Cash balance</div><strong>£28.1k</strong><p>Healthy current position with short-term flexibility.</p></div>
          <div class="stat-card"><div class="label">Cash inflow</div><strong>£44.6k</strong><p>Strong enough to support current operating plans.</p></div>
          <div class="stat-card"><div class="label">Cash outflow</div><strong>£37.2k</strong><p>Outflows remain manageable but require sequencing discipline.</p></div>
          <div class="stat-card"><div class="label">Cash runway</div><strong>5.4 months</strong><p>Comfortable under placeholder assumptions.</p></div>
        </div>
      </section>
      ${executiveQuestions({ what: 'Cash is healthy but collection timing matters', whatText: 'There is no immediate liquidity stress, but short-term flexibility relies on receipts arriving when expected.', why: 'Strong inflows are offset by concentrated receivables and planned supplier payments', whyText: 'The cash picture is structurally sound, but timing sensitivity remains real.', matters: 'Yes, because timing changes decision freedom', mattersText: 'Healthy cash without strong timing discipline can still force weaker decisions than necessary.', next: 'Protect timing and challenge assumptions', nextText: 'Pressure-test receivables, staged payables, and forecast assumptions for the next 90 days.' })}
      <div class="chart-grid">
        <section class="chart-card"><div class="label">Forecast</div><h4>30 / 60 / 90 day cash view</h4>${lineChart({ labels: appState.data.charts.cashForecast.labels, values: appState.data.charts.cashForecast.values, suffix: 'k' })}</section>
        <section class="chart-card"><div class="label">Risk analysis</div><h4>Cash risk distribution</h4>${barChart({ labels: ['Collections', 'Supplier timing', 'Discretionary spend', 'Tax timing'], values: [38, 29, 17, 16], suffix: '%' })}</section>
      </div>
      ${commentaryCard('Cash Flow Commentary', {
        summary: 'Cash is strong enough to avoid panic, but not strong enough to ignore timing discipline.',
        evidence: 'Current balance £28.1k, 30-day closing cash £21.3k, overdue invoices materially affecting timing confidence.',
        confidence: 'High',
        impact: 'Better collections discipline could improve flexibility immediately without cutting growth activity.',
        risks: 'If supplier spend rises again or receipts slip further, comfort narrows quickly.',
        alternatives: 'Hold spend steady, pull forward collections, or sequence outgoing commitments more deliberately.',
        action: 'Approve receivables escalation and stage significant payments against confirmed incoming cash.',
        missing: 'Live banking and invoice-status feeds are intentionally not connected yet.'
      })}
    </div>
  `;
}

function vatPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">VAT</div><h3>VAT position and confidence</h3></div><p>VAT should feel governed and explainable, not like a black-box year-end surprise.</p></div>
        <div class="grid-4">
          <div class="stat-card"><div class="label">Current VAT estimate</div><strong>£4.8k</strong><p>Provisioned in the current placeholder cash plan.</p></div>
          <div class="stat-card"><div class="label">Upcoming payment</div><strong>£4.6k</strong><p>Timing remains manageable under current assumptions.</p></div>
          <div class="stat-card"><div class="label">Historical VAT</div><strong>£4.1k avg</strong><p>Recent average settlement level for comparison.</p></div>
          <div class="stat-card"><div class="label">Forecast VAT</div><strong>£5.0k</strong><p>Assumes current trading pattern continues.</p></div>
        </div>
      </section>
      ${executiveQuestions({ what: 'VAT looks provisioned', whatText: 'The estimate is not currently alarming and appears covered in the short-term plan.', why: 'Trading remains healthy and taxable activity is broadly stable', whyText: 'The forecast moves mainly with revenue and purchase record completeness.', matters: 'Yes, because confidence matters as much as the amount', mattersText: 'A tolerable liability can still become disruptive if record quality is weak or timing slips.', next: 'Tighten record capture confidence', nextText: 'Preserve discipline on purchase invoices and category integrity ahead of the next filing cycle.' })}
      ${commentaryCard('VAT AI Explanation', {
        summary: 'The VAT position is acceptable, but confidence depends on process discipline rather than the estimated number alone.',
        evidence: 'Current estimate £4.8k, payment provisioned, but purchase-side completeness remains a live dependency.',
        confidence: 'Medium',
        impact: 'Good discipline avoids avoidable surprises and protects forecast reliability.',
        risks: 'Late invoices or weak categorisation reduce accuracy and may distort cash planning.',
        alternatives: 'Increase monthly controls, keep current process, or defer detailed cleanup until filing week.',
        action: 'Use a tighter monthly review rhythm so VAT confidence does not depend on last-minute effort.',
        missing: 'No live bookkeeping or filing system is connected in this sprint.'
      })}
    </div>
  `;
}

function forecastingPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Forecasting</div><h3>Executive forecasting workspace</h3></div><p>Forecasting exists to support good decisions, not to create false precision.</p></div>
        <div class="grid-4">
          <div class="forecast-tile"><div class="label">Revenue forecast</div><strong>£49.5k</strong><p>Assumes healthy demand and steady booking conversion.</p></div>
          <div class="forecast-tile"><div class="label">Profit forecast</div><strong>£12.1k</strong><p>Dependent on stabilising supplier cost growth.</p></div>
          <div class="forecast-tile"><div class="label">Cash forecast</div><strong>£24.0k</strong><p>Requires collections to normalise on time.</p></div>
          <div class="forecast-tile"><div class="label">Investment modelling</div><strong>Placeholder</strong><p>Future modelling for GCQuad and similar investments will live here.</p></div>
        </div>
      </section>
      ${executiveQuestions({ what: 'Forecasts are positive but assumption-sensitive', whatText: 'The current outlook is constructive under a controlled set of placeholder assumptions.', why: 'Demand looks stable and cash is healthy, but margins remain sensitive', whyText: 'A few assumptions drive most of the model: collections speed, supplier costs, and discretionary expense control.', matters: 'Yes, because forecast quality should shape confidence', mattersText: 'The right forecast improves timing, investment discipline, and approval confidence.', next: 'Challenge assumptions, not just outputs', nextText: 'The best use of the page is testing what could break the plan and what could improve it.' })}
      <div class="grid-2">
        <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Scenario planning</div><h3>What if...</h3></div></div><div class="section-stack"><div class="scenario-card"><h4>What if collections slip by 14 days?</h4><p>30-day cash closes lower and approval sequencing becomes more important.</p></div><div class="scenario-card"><h4>What if supplier costs rise another 5%?</h4><p>Profit forecast softens and margin-control actions become urgent.</p></div><div class="scenario-card"><h4>What if bookings outperform by 10%?</h4><p>Revenue improves, but margin quality still decides whether that upside is strategically meaningful.</p></div></div></section>
        <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Future investment modelling</div><h3>Decision sandbox placeholder</h3></div></div><div class="page-note"><h4>Future investment modelling</h4><p>This area is reserved for capital and growth scenario modelling, including equipment purchases, hiring, software, and marketing investment cases.</p></div></section>
      </div>
      ${commentaryCard('Forecast Commentary', {
        summary: 'The forecast is directionally strong, but the value lies in challenging the assumptions rather than admiring the numbers.',
        evidence: 'Positive revenue, stable cash, and controlled margin pressure under current placeholder assumptions.',
        confidence: 'Medium',
        impact: 'A better forecast improves investment timing, approval quality, and strategic calm.',
        risks: 'False confidence can form if assumptions are not actively challenged each week.',
        alternatives: 'Optimistic plan, conservative plan, or scenario-weighted planning by risk band.',
        action: 'Review what changes the forecast most and treat those assumptions as executive priorities.',
        missing: 'No live system data is feeding forecast logic yet.'
      })}
    </div>
  `;
}

function businessKpisPage() {
  const groups = [
    ['Revenue', [['Revenue this month', '£46.8k'], ['YoY growth', '+14.2%'], ['Forecast', '£49.5k']]],
    ['Profitability', [['Gross margin', '51.5%'], ['Net margin', '24.8%'], ['Net profit', '£11.6k']]],
    ['Cash', [['Cash balance', '£28.1k'], ['Runway', '5.4 months'], ['30d closing cash', '£21.3k']]],
    ['Working Capital', [['Outstanding invoices', '£9.4k'], ['Bills due', '£6.1k'], ['Collections risk', 'Medium']]],
    ['Operating KPIs', [['Supplier concentration', 'High enough to watch'], ['Expense drift', '+6.8%'], ['Approval load', '6 active items']]],
    ['Growth KPIs', [['Bookings confidence', 'Placeholder'], ['Premium mix', 'Improving'], ['Repeat demand', 'Stable']]]
  ];
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Business KPIs</div><h3>Connected KPI view with context</h3></div><p>Every KPI category is translated into what it means for current decision-making.</p></div>
        <div class="kpi-groups">
          ${groups
            .map(
              ([title, entries]) => `
                <div class="kpi-group">
                  <div class="label">${title}</div>
                  <div class="kpi-row">
                    ${entries
                      .map(
                        ([label, value]) => `
                          <div class="kpi-chip">
                            <div class="label">${label}</div>
                            <strong>${value}</strong>
                          </div>
                        `
                      )
                      .join('')}
                  </div>
                </div>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Financial Health Score breakdown</div><h3>How the score is constructed</h3></div><a href="#" class="text-link" data-page-link="financial-health">Open full Financial Health page →</a></div>
        <div class="health-breakdown">
          <div class="register-row"><h4>Profit quality — 25%</h4><p>Softened slightly because cost growth outpaced the last month of revenue improvement.</p></div>
          <div class="register-row"><h4>Cash resilience — 25%</h4><p>Healthy, but still dependent on receivables timing.</p></div>
          <div class="register-row"><h4>Working capital control — 20%</h4><p>Acceptable, though collections concentration needs attention.</p></div>
          <div class="register-row"><h4>Growth quality — 15%</h4><p>Positive growth, but still needs bookings and margin proof.</p></div>
          <div class="register-row"><h4>Governance and confidence — 15%</h4><p>Approval-first approach and visible reasoning improve trust in decisions.</p></div>
        </div>
      </section>
    </div>
  `;
}

function decisionJournalPage() {
  const rows = appState.data.decisionJournal.filter((entry) => {
    const q = appState.journalQuery.trim().toLowerCase();
    if (!q) return true;
    return [entry.id, entry.recommendation, entry.reasoning, entry.executive, entry.status, entry.outcome]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Decision Journal</div><h3>Searchable executive timeline</h3></div><p>One of the most valuable parts of the platform: preserved recommendations, approvals, outcomes, and lessons.</p></div>
        <div class="search-shell"><span class="label">Search timeline</span><input id="journal-search" type="text" placeholder="Search decisions, reasoning, outcomes, status..." value="${escapeAttr(appState.journalQuery)}" /></div>
      </section>
      <section class="panel"><div class="timeline-list">
        ${rows
          .map(
            (entry) => `
              <article class="timeline-entry">
                <div class="timeline-meta">${pill(entry.id, 'info')}${pill(entry.status, entry.status === 'Pending' ? 'warn' : entry.status === 'Active' ? 'info' : 'good')}${pill(entry.executive, 'neutral')}</div>
                <h4>${entry.recommendation}</h4>
                <div class="grid-3">
                  <div><div class="label">Reasoning</div><p>${entry.reasoning}</p></div>
                  <div><div class="label">Supporting evidence</div><p>${entry.evidence}</p></div>
                  <div><div class="label">Alternatives considered</div><p>${entry.alternatives}</p></div>
                  <div><div class="label">User decision</div><p>${entry.decision}</p></div>
                  <div><div class="label">Outcome</div><p>${entry.outcome}</p></div>
                  <div><div class="label">Financial impact</div><p>${entry.impact}</p></div>
                  <div><div class="label">Confidence</div><p>${entry.confidence}</p></div>
                  <div><div class="label">Lessons learned</div><p>${entry.lessons}</p></div>
                  <div><div class="label">Scheduled review date</div><p>${entry.reviewDate}</p></div>
                </div>
              </article>
            `
          )
          .join('')}
      </div></section>
    </div>
  `;
}

function weeklyBriefingsPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Weekly Briefings</div><h3>Sunday Executive Briefing</h3></div><p>Designed to feel closer to a board paper than a dashboard.</p></div>
        <div class="briefing-sections">
          <div class="page-note"><div class="label">Executive Summary</div><h4>${appState.data.weeklyBriefing.summary}</h4></div>
          <div class="grid-4">
            <div class="stat-card"><div class="label">KPIs</div><strong>Stable+</strong><p>Core KPIs remain healthy with targeted watch items.</p></div>
            <div class="stat-card"><div class="label">Wins</div><strong>3</strong><p>Revenue strength, healthy cash, visible cost drift before it becomes embedded.</p></div>
            <div class="stat-card"><div class="label">Risks</div><strong>3</strong><p>Collections, supplier pressure, and data confidence are the current watchpoints.</p></div>
            <div class="stat-card"><div class="label">Approval Queue</div><strong>6</strong><p>Approval-first queue remains intentionally visible and controlled.</p></div>
          </div>
          <div class="grid-2">
            <div class="register-row"><div class="label">Wins</div><ul class="mini-list">${appState.data.weeklyBriefing.wins.map((item) => `<li>${item}</li>`).join('')}</ul></div>
            <div class="register-row"><div class="label">Risks</div><ul class="mini-list">${appState.data.weeklyBriefing.risks.map((item) => `<li>${item}</li>`).join('')}</ul></div>
            <div class="register-row"><div class="label">Forecasts</div><ul class="mini-list"><li>Revenue forecast: £49.5k</li><li>Profit forecast: £12.1k</li><li>30-day closing cash: £21.3k</li></ul></div>
            <div class="register-row"><div class="label">Recommendations</div><ul class="mini-list">${appState.data.weeklyBriefing.recommendations.map((item) => `<li>${item}</li>`).join('')}</ul></div>
          </div>
          <div class="register-row"><div class="label">Questions Worth Asking This Week</div><ul class="mini-list">${appState.data.weeklyBriefing.questions.map((item) => `<li>${item}</li>`).join('')}</ul></div>
        </div>
      </section>
    </div>
  `;
}

function approvalCentrePage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Approval Centre</div><h3>Expanded executive approval queue</h3></div><p>Grouped by type so approvals can be reviewed in the context of control, impact, and confidence.</p></div>
        <div class="approval-groups">
          ${Object.entries(appState.data.approvals)
            .map(
              ([group, items]) => `
                <section class="panel">
                  <div class="panel-heading compact"><div><div class="eyebrow">${group}</div><h3>${group} approvals</h3></div></div>
                  <div class="section-stack">
                    ${items
                      .map(
                        (item) => `
                          <div class="approval-card">
                            <h4>${item.title}</h4>
                            <p><strong>Why:</strong> ${item.why}</p>
                            <p><strong>Impact:</strong> ${item.impact}</p>
                            <p><strong>Risk:</strong> ${item.risk}</p>
                            <p><strong>Confidence:</strong> ${item.confidence}</p>
                          </div>
                        `
                      )
                      .join('')}
                  </div>
                </section>
              `
            )
            .join('')}
        </div>
      </section>
    </div>
  `;
}

function settingsPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Settings</div><h3>Future control surface</h3></div><p>These are placeholders only — they show the future operating model without enabling live connections yet.</p></div>
        <div class="integration-grid">
          ${[
            'QuickBooks',
            'Starling',
            'Permissions',
            'Notification preferences',
            'Health score weighting',
            'Weekly briefing preferences',
            'Quarterly reviews',
            'Historical database',
            'Executive personas'
          ]
            .map(
              (item) => `
                <div class="integration-tile">
                  <div class="label">Placeholder</div>
                  <h4>${item}</h4>
                  <p>This will become a connected control or configuration surface in a later implementation sprint.</p>
                </div>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Future integration sources</div><h3>Connected intelligence placeholders</h3></div></div>
        <div class="integration-grid">
          ${appState.data.futureIntegrations
            .map(
              (item) => `
                <div class="integration-tile">
                  <h4>${item}</h4>
                  <p>Will become a connected intelligence source in future versions of EP Intelligence.</p>
                </div>
              `
            )
            .join('')}
        </div>
      </section>
    </div>
  `;
}

function financialHealthPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Financial Health Score</div><h3>Dedicated score breakdown</h3></div><p>The score should be trusted because it is explained, weighted, and reviewable.</p></div>
        <div class="grid-4">
          <div class="stat-card"><div class="label">Current score</div><strong>${appState.data.welcome.score}</strong><p>${appState.data.welcome.label}</p></div>
          <div class="stat-card"><div class="label">Previous score</div><strong>${appState.data.welcome.previous}</strong><p>Used as the immediate comparison point.</p></div>
          <div class="stat-card"><div class="label">Trend</div><strong>${appState.data.welcome.trend}</strong><p>The score is improving, but not for passive reasons.</p></div>
          <div class="stat-card"><div class="label">Why it changed</div><strong>Cash and growth</strong><p>Revenue resilience and cash stability improved the score.</p></div>
        </div>
      </section>
      <section class="chart-card"><div class="label">Historical scores</div><h4>Score history</h4>${lineChart({ labels: appState.data.charts.historicalScores.labels, values: appState.data.charts.historicalScores.values })}</section>
      <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Weighting breakdown</div><h3>Current score components</h3></div></div>
        <div class="health-breakdown">
          <div class="register-row"><h4>Profit quality — 25%</h4><p>Improves when margin strength is stable and not dependent on one-off wins.</p></div>
          <div class="register-row"><h4>Cash resilience — 25%</h4><p>Weighted highly because liquidity preserves decision quality.</p></div>
          <div class="register-row"><h4>Working capital control — 20%</h4><p>Captures receivables, payables, and operating discipline.</p></div>
          <div class="register-row"><h4>Growth quality — 15%</h4><p>Growth should be real, not vanity-driven.</p></div>
          <div class="register-row"><h4>Governance confidence — 15%</h4><p>Approval-first behaviour and transparent reasoning increase trustworthiness.</p></div>
        </div>
      </section>
      ${commentaryCard('Why the score changed', {
        summary: 'The score improved because growth remained healthy and cash remained resilient despite mild margin softness.',
        evidence: 'Revenue trend up, cash comfortable, but profit conversion slightly softer than ideal.',
        confidence: 'Medium–High',
        impact: 'A stronger score supports confidence, but should never replace direct judgment.',
        risks: 'An improving score can still hide structural issues if weighting is not interpreted carefully.',
        alternatives: 'Use custom weighting later, emphasise cash more, or increase governance weighting.',
        action: 'Keep treating the score as an executive summary, not as the decision itself.',
        missing: 'Custom weighting is a future feature and no live data sources are connected yet.'
      })}
    </div>
  `;
}

function opportunityRegisterPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Opportunity Register</div><h3>Permanent upside register</h3></div><p>Every opportunity is framed for executive decision-making, not idea collection.</p></div>
        <div class="register-list">
          ${appState.data.opportunities
            .map(
              (item) => `
                <article class="register-row">
                  <div class="register-meta">${pill(item.category, 'info')}${pill(item.priority, item.priority === 'Immediate' ? 'warn' : 'good')}${pill(item.status, 'neutral')}</div>
                  <h4>${item.title}</h4>
                  <p>${item.description}</p>
                  <div class="grid-4">
                    <div><div class="label">Revenue increase</div><strong>${item.revenueIncrease}</strong></div>
                    <div><div class="label">Profit increase</div><strong>${item.profitIncrease}</strong></div>
                    <div><div class="label">Estimated cost</div><strong>${item.cost}</strong></div>
                    <div><div class="label">ROI</div><strong>${item.roi}</strong></div>
                    <div><div class="label">Time to implement</div><strong>${item.time}</strong></div>
                    <div><div class="label">Confidence</div><strong>${item.confidence}</strong></div>
                    <div><div class="label">Strategic priority</div><strong>${item.priority}</strong></div>
                    <div><div class="label">Review date</div><strong>${item.reviewDate}</strong></div>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
    </div>
  `;
}

function riskRegisterPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Risk Register</div><h3>Permanent business risk register</h3></div><p>The Risk Register is designed to become a living executive document.</p></div>
        <div class="register-list">
          ${appState.data.risks
            .map(
              (item) => `
                <article class="register-row">
                  <div class="register-meta">${pill(item.level, item.level === 'High' ? 'risk' : 'warn')}${pill(item.trend, item.trend === 'Improving' ? 'good' : item.trend === 'Stable' ? 'neutral' : 'warn')}</div>
                  <h4>${item.impact}</h4>
                  <div class="grid-4">
                    <div><div class="label">Probability</div><strong>${item.probability}</strong></div>
                    <div><div class="label">Owner</div><strong>${item.owner}</strong></div>
                    <div><div class="label">Review date</div><strong>${item.reviewDate}</strong></div>
                    <div><div class="label">Trend</div><strong>${item.trend}</strong></div>
                  </div>
                  <p><strong>Recommended mitigation:</strong> ${item.mitigation}</p>
                  <p><strong>AI commentary:</strong> ${item.commentary}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
    </div>
  `;
}

function quarterlyReviewPage() {
  return `
    <div class="page-grid">
      <section class="panel"><div class="panel-heading"><div><div class="eyebrow">Quarterly Executive Review</div><h3>Board-style quarterly review paper</h3></div><p>This page is designed to feel like a prepared board review, not an operations screen.</p></div>
        <div class="grid-3">
          <div class="page-note"><div class="label">Business performance</div><h4>Healthy with margin watchpoints</h4><p>Growth is positive, cash is strong, but margin conversion deserves active challenge.</p></div>
          <div class="page-note"><div class="label">Lessons learned</div><h4>Small drifts compound fast</h4><p>Supplier concentration and discretionary spend drift become strategic issues sooner than expected.</p></div>
          <div class="page-note"><div class="label">Executive summary</div><h4>Protect flexibility</h4><p>The quarter argues for better control and stronger confidence, not panic or unnecessary austerity.</p></div>
        </div>
      </section>
      <div class="grid-2">
        <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Quarter highlights</div><h3>Performance review</h3></div></div><ul class="mini-list"><li>Revenue trends: improving</li><li>Profit trends: slightly softer</li><li>Cash trends: strong</li><li>Supplier trends: rising faster than ideal</li><li>KPI improvements: growth quality and visibility both better</li></ul></section>
        <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Recommendation review</div><h3>Accepted, rejected, revisited</h3></div></div><ul class="mini-list"><li>Recommendations accepted: cost restraint and supplier review</li><li>Recommendations rejected: none in placeholder set</li><li>Worth revisiting: capital investment timing and software stack review</li></ul></section>
      </div>
      <div class="grid-2">
        <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Top opportunities</div><h3>Next quarter</h3></div></div><ul class="mini-list"><li>Improve supplier terms</li><li>Accelerate collections</li><li>Refine premium revenue mix</li></ul></section>
        <section class="panel"><div class="panel-heading compact"><div><div class="eyebrow">Top risks</div><h3>Next quarter</h3></div></div><ul class="mini-list"><li>Margin softness persisting</li><li>Receivables timing reducing flexibility</li><li>Cost drift normalising if not challenged</li></ul></section>
      </div>
    </div>
  `;
}

function boardMeetingPage() {
  return `
    <div class="board-stage">
      <section class="board-hero">
        <div class="panel">
          <div class="eyebrow">Board Meeting Mode</div>
          <div class="hero-title">Sunday Executive Briefing</div>
          <p class="hero-summary">This mode turns the workspace into a weekly executive conversation. Instead of dashboards, the focus is on business health, executive reports, approvals, risks, and the best decisions for EP Golf Studios this week.</p>
        </div>
        <div class="score-tile">
          <div class="label">Business Health Score</div>
          <strong>${appState.data.welcome.score}</strong>
          <small>${appState.data.welcome.label}</small>
        </div>
      </section>

      <section class="board-report-grid">
        <div class="panel"><div class="panel-heading compact"><div><div class="eyebrow">CEO Executive Summary</div><h3>Future integration placeholder</h3></div></div><p>This will later summarise strategic direction, major business trade-offs, and executive alignment.</p></div>
        <div class="panel"><div class="panel-heading compact"><div><div class="eyebrow">CFO Executive Report</div><h3>Financial position this week</h3></div></div><p>${appState.data.weeklyBriefing.summary}</p></div>
        <div class="panel"><div class="panel-heading compact"><div><div class="eyebrow">CMO Executive Report</div><h3>Placeholder</h3></div></div><p>Future marketing intelligence will explain demand quality, growth, and campaign effectiveness.</p></div>
        <div class="panel"><div class="panel-heading compact"><div><div class="eyebrow">COO Executive Report</div><h3>Placeholder</h3></div></div><p>Future operations intelligence will explain delivery capacity, process friction, and execution risk.</p></div>
      </section>

      <section class="board-matrix">
        <div class="mode-tile active"><div class="label">Top Opportunities</div><h3>${appState.data.opportunities[0].title}</h3><p>${appState.data.opportunities[0].description}</p></div>
        <div class="mode-tile active"><div class="label">Top Risks</div><h3>${appState.data.risks[0].impact}</h3><p>${appState.data.risks[0].commentary}</p></div>
        <div class="mode-tile active"><div class="label">Decisions Required</div><h3>${Object.values(appState.data.approvals).flat().length}</h3><p>Approval-first queue remains intentionally visible and controlled.</p></div>
        <div class="mode-tile"><div class="label">Approvals Waiting</div><h3>6 active approvals</h3><p>Grouped by accounting, invoices, bills, categorisation, recommendations, and forecast assumptions.</p></div>
        <div class="mode-tile"><div class="label">This Week's Priorities</div><h3>${appState.data.priorities[0].title}</h3><p>${appState.data.priorities[0].note}</p></div>
        <div class="mode-tile"><div class="label">Questions Worth Asking</div><h3>Are we protecting flexibility?</h3><p>Challenge the assumptions around collections, margin, and spend before approving new commitments.</p></div>
      </section>

      <section class="panel">
        <div class="panel-heading compact"><div><div class="eyebrow">Board Questions</div><h3>Questions worth asking this week</h3></div></div>
        <ul class="board-question-list">
          ${appState.data.weeklyBriefing.questions.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </section>
    </div>
  `;
}

function renderPage() {
  if (appState.mode === 'board') return boardMeetingPage();

  const renderers = {
    workspace: workspacePage,
    revenue: revenuePage,
    profit: profitPage,
    expenses: expensesPage,
    'supplier-spend': supplierSpendPage,
    'cash-flow': cashFlowPage,
    vat: vatPage,
    forecasting: forecastingPage,
    'business-kpis': businessKpisPage,
    'decision-journal': decisionJournalPage,
    'weekly-briefings': weeklyBriefingsPage,
    'approval-centre': approvalCentrePage,
    settings: settingsPage,
    'financial-health': financialHealthPage,
    'opportunity-register': opportunityRegisterPage,
    'risk-register': riskRegisterPage,
    'quarterly-review': quarterlyReviewPage
  };

  return (renderers[appState.currentPage] || workspacePage)();
}

function attachEvents() {
  pageContent.querySelectorAll('[data-metric]').forEach((button) => {
    button.addEventListener('click', () => {
      appState.activeMetric = button.dataset.metric;
      render();
    });
  });

  pageContent.querySelectorAll('[data-question]').forEach((button) => {
    button.addEventListener('click', () => {
      appState.activeQuestion = Number(button.dataset.question);
      render();
    });
  });

  pageContent.querySelectorAll('[data-page-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setPage(link.dataset.pageLink);
    });
  });

  pageContent.querySelectorAll('.supplier-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const supplier = appState.data.suppliers.find((item) => item.id === link.dataset.supplier);
      if (!supplier) return;
      const card = document.createElement('div');
      card.className = 'drilldown-card';
      card.innerHTML = `
        <div class="label">Supplier drill-down placeholder</div>
        <h4>${supplier.name}</h4>
        <p>This placeholder page will later expand into a full supplier intelligence view with invoice history, term analysis, margin impact, and payment pattern review.</p>
        <div class="drilldown-meta">${pill(supplier.risk + ' risk', supplier.risk === 'Low' ? 'good' : 'warn')}${pill(supplier.category, 'info')}</div>
      `;
      link.parentElement.appendChild(card);
      link.remove();
    });
  });

  const search = document.getElementById('journal-search');
  if (search) {
    search.addEventListener('input', (event) => {
      appState.journalQuery = event.target.value;
      render();
    });
  }
}

function render() {
  const meta = PAGE_META[appState.currentPage] || PAGE_META.workspace;
  pageTitle.textContent = appState.mode === 'board' ? 'Board Meeting Mode' : meta.title;
  pageSubtitle.textContent =
    appState.mode === 'board'
      ? 'A Sunday-morning executive briefing view for leadership-level discussion.'
      : meta.subtitle;
  breadcrumb.textContent = appState.mode === 'board' ? 'EP Intelligence / Board Meeting' : `EP Intelligence / CFO Workspace / ${meta.title}`;

  renderNav(primaryNav, NAV_PRIMARY);
  renderNav(secondaryNav, NAV_SECONDARY);
  renderModeSwitcher();

  pageContent.innerHTML = renderPage();
  attachEvents();
}

loadFromUrl();
render();
