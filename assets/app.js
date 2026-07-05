const state = {
  header: {
    score: 84,
    label: 'Stable with near-term control actions',
    summary:
      'The business is trading from a position of strength, but invoice collection speed and supplier cost discipline will decide how much flexibility you have over the next six weeks.',
    narrative:
      'Revenue quality is solid, profit is slightly compressed by higher delivery and supplier costs, and cash remains healthy if overdue receivables are pushed through this week.'
  },
  metrics: [
    {
      key: 'revenue',
      label: 'Revenue This Month',
      value: '£46.8k',
      trend: '+8.4% vs last month',
      narrative:
        'Monthly revenue is ahead of plan, driven by fitting demand and stronger accessory conversion. The current question is whether the quality of that revenue is converting into durable margin.',
      why: 'Top-line momentum is good, but it matters because it creates room for investment only if gross profit holds.'
    },
    {
      key: 'profit',
      label: 'Profit This Month',
      value: '£11.6k',
      trend: '-3.1% vs last month',
      narrative:
        'Profit remains healthy, but it has softened because supplier and delivery costs rose faster than revenue. This is not a crisis, but it is the main signal to watch.',
      why: 'If margin leakage continues for another cycle, revenue growth will feel better than the cash outcome actually is.'
    },
    {
      key: 'expenses',
      label: 'Monthly Expenses',
      value: '£24.9k',
      trend: '+6.8% vs last month',
      narrative:
        'Expenses are still controllable, but contractor and travel spend are running above the recent base line and deserve tighter scrutiny before they become normalised.',
      why: 'The CFO priority here is not blanket cutting — it is preserving operating quality while removing soft cost drift.'
    },
    {
      key: 'invoices',
      label: 'Outstanding Invoices',
      value: '£9.4k',
      trend: '4 invoices overdue',
      narrative:
        'Receivables are the cleanest short-term lever available. A small number of overdue invoices is slowing otherwise healthy cash timing.',
      why: 'Collecting this faster improves optionality without reducing spend or delaying plans.'
    },
    {
      key: 'bills',
      label: 'Bills To Pay',
      value: '£6.1k',
      trend: '7 bills due in 10 days',
      narrative:
        'The upcoming payable stack is manageable, but supplier payment timing needs sequencing against incoming cash rather than habit.',
      why: 'This is where an executive workspace beats reporting — it helps decide what to approve first, not just list what exists.'
    },
    {
      key: 'vat',
      label: 'VAT Liability',
      value: '£4.8k',
      trend: 'Provisioned',
      narrative:
        'The estimated VAT position is covered in the short term, though purchase invoice capture needs to stay disciplined to avoid preventable surprises later in the cycle.',
      why: 'Confidence is reasonable, but the data capture process matters as much as the number.'
    },
    {
      key: 'cashflow',
      label: 'Cash Flow Forecast',
      value: '£21.3k',
      trend: '30-day closing cash',
      narrative:
        'The forecast suggests enough headroom for current plans, provided overdue cash lands and supplier increases do not accelerate again next month.',
      why: 'The business can afford planned activity, but not if conversion from invoice to cash keeps slipping.'
    },
    {
      key: 'supplier',
      label: 'Largest Supplier Spend',
      value: '£8.7k',
      trend: 'Launch monitor inventory',
      narrative:
        'One supplier is now absorbing a disproportionate share of outgoing cash this month. That may be strategic, but it should be explicitly reviewed rather than passively accepted.',
      why: 'Concentration is fine when intentional. It becomes risky when it is merely inherited from momentum.'
    }
  ],
  priorities: [
    {
      title: 'Review overdue invoices',
      note: 'Four invoices now account for most of the receivables drag on this month’s cash timing.',
      tag: 'warn',
      tagLabel: 'Cash timing'
    },
    {
      title: 'Supplier spend increased',
      note: 'The largest supplier line has risen faster than sales contribution and needs a margin check.',
      tag: 'risk',
      tagLabel: 'Margin pressure'
    },
    {
      title: 'Cash flow healthy',
      note: 'Headroom is still good if current collections land on time and non-essential spend stays disciplined.',
      tag: 'good',
      tagLabel: 'Positive'
    }
  ],
  opportunities: [
    {
      title: 'Tighten invoice follow-up cadence',
      impact: '£6.0k–£8.0k cash acceleration',
      confidence: 'High',
      explanation:
        'A tighter weekly receivables rhythm is likely to pull forward cash without needing to cut growth activity.'
    },
    {
      title: 'Renegotiate high-cost supplier terms',
      impact: '£1.2k monthly margin upside',
      confidence: 'Medium',
      explanation:
        'The current spend profile suggests room to improve unit economics or payment terms with one major supplier.'
    },
    {
      title: 'Reallocate low-yield discretionary spend',
      impact: '£900 monthly savings',
      confidence: 'Medium',
      explanation:
        'Travel and ad hoc support costs appear to have expanded faster than their clear commercial return.'
    }
  ],
  risks: [
    {
      severity: 'High',
      reason: 'Receivables concentration means a handful of invoices controls short-term cash flexibility.',
      action: 'Escalate overdue follow-up and confirm expected payment dates this week.'
    },
    {
      severity: 'Medium',
      reason: 'Supplier cost growth is outpacing profit improvement.',
      action: 'Review contribution margin by product or service line before next buying decision.'
    },
    {
      severity: 'Medium',
      reason: 'VAT confidence depends on complete and timely capture of purchase-side records.',
      action: 'Tighten invoice bookkeeping workflow ahead of the next submission cycle.'
    }
  ],
  approvals: [
    {
      title: 'Approve supplier payment batch',
      amount: '£3,420',
      reason: 'Three invoices due this week, including fitting bay consumables.',
      impact: 'Preserves supplier continuity but reduces near-term cash headroom.',
      owner: 'CFO Workspace',
      status: 'Awaiting approval'
    },
    {
      title: 'Approve revised contractor budget',
      amount: '£1,150',
      reason: 'Support costs rose above the original monthly operating assumption.',
      impact: 'May protect delivery speed, but should be checked against current margin pressure.',
      owner: 'CFO Workspace',
      status: 'Needs review'
    },
    {
      title: 'Approve receivables escalation plan',
      amount: '£9,400 affected',
      reason: 'Overdue invoice follow-up should move from passive reminders to direct outreach.',
      impact: 'Likely positive cash effect with minimal downside if handled carefully.',
      owner: 'CFO Workspace',
      status: 'Awaiting approval'
    }
  ],
  briefing: {
    headline:
      'EP Golf Studios is financially healthy overall, but this week should focus on collections discipline and margin protection rather than new discretionary spend.',
    points: [
      'Revenue is strong enough to support confidence, but profit quality has softened slightly.',
      'Cash remains stable if overdue invoices are actively collected this week.',
      'Supplier concentration and rising expense drift are the two most important control points before next Sunday.'
    ]
  },
  chat: [
    {
      question: 'Why has profit changed?',
      answer:
        'Profit has slipped slightly because cost growth has been faster than margin expansion. Revenue is up, but supplier and delivery-related costs have eaten into the benefit. My recommendation would be to protect margin before assuming current top-line growth automatically improves cash.'
    },
    {
      question: 'Can I afford another GCQuad?',
      answer:
        'On placeholder numbers, the business could probably support it only if you treat it as a deliberate strategic investment rather than a casual purchase. I would want to test cash headroom, payback period, expected fitting uplift, and whether current receivables timing makes this month the right moment.'
    },
    {
      question: 'What should I focus on this week?',
      answer:
        'This week I would focus on three things: collect overdue invoices, check whether supplier spend is earning its keep, and hold discretionary costs steady until margin quality improves. Those three moves give the biggest control benefit with the least operational disruption.'
    },
    {
      question: 'Which suppliers cost the most?',
      answer:
        'In this demo environment, one core equipment-related supplier is the largest spend line at £8.7k this month. The important follow-up is not just who costs the most, but whether that spend is aligned to profitable demand and acceptable payment timing.'
    },
    {
      question: "Forecast next month's profit.",
      answer:
        'Using placeholder assumptions, next month’s profit looks stable to slightly improved if collections normalise and supplier spend does not rise again. If expense drift continues at the current rate, profit would likely flatten rather than grow.'
    }
  ]
};

const metricGrid = document.getElementById('metric-grid');
const metricDetail = document.getElementById('metric-detail');
const priorityList = document.getElementById('priority-list');
const opportunitiesList = document.getElementById('opportunities-list');
const risksList = document.getElementById('risks-list');
const approvalGrid = document.getElementById('approval-grid');
const briefingPreview = document.getElementById('briefing-preview');
const chatPrompts = document.getElementById('chat-prompts');
const chatQuestion = document.getElementById('chat-question');
const chatAnswer = document.getElementById('chat-answer');

function renderHeader() {
  document.getElementById('health-score').textContent = state.header.score;
  document.getElementById('health-label').textContent = state.header.label;
  document.getElementById('status-summary').textContent = state.header.summary;
  document.getElementById('health-narrative').textContent = state.header.narrative;
}

function renderMetricDetail(metric) {
  metricDetail.innerHTML = `
    <div class="detail-grid">
      <div>
        <span class="eyebrow">CFO Readout</span>
        <h4>${metric.label}</h4>
        <p>${metric.narrative}</p>
      </div>
      <div class="detail-meta">
        <div class="meta-box">
          <div class="label">Current number</div>
          <strong>${metric.value}</strong>
        </div>
        <div class="meta-box">
          <div class="label">Movement</div>
          <strong>${metric.trend}</strong>
        </div>
        <div class="meta-box">
          <div class="label">Why it matters</div>
          <p>${metric.why}</p>
        </div>
      </div>
    </div>
  `;
}

function renderMetrics() {
  metricGrid.innerHTML = '';
  state.metrics.forEach((metric, index) => {
    const card = document.createElement('button');
    card.className = `metric-card${index === 0 ? ' active' : ''}`;
    card.type = 'button';
    card.innerHTML = `
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
      <p>${metric.trend}</p>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.metric-card').forEach((node) => node.classList.remove('active'));
      card.classList.add('active');
      renderMetricDetail(metric);
    });
    metricGrid.appendChild(card);
  });

  renderMetricDetail(state.metrics[0]);
}

function renderPriorities() {
  priorityList.innerHTML = state.priorities
    .map(
      (item, index) => `
      <div class="priority-item">
        <div class="priority-index">${index + 1}</div>
        <div>
          <h4>${item.title}</h4>
          <p>${item.note}</p>
        </div>
        <span class="tag ${item.tag}">${item.tagLabel}</span>
      </div>
    `
    )
    .join('');
}

function renderOpportunities() {
  opportunitiesList.innerHTML = state.opportunities
    .map(
      (item) => `
      <div class="stack-item">
        <div class="stack-top">
          <div>
            <span class="meta-chip">Estimated impact</span>
            <h4>${item.title}</h4>
          </div>
          <span class="pill good">${item.confidence} confidence</span>
        </div>
        <strong>${item.impact}</strong>
        <p>${item.explanation}</p>
      </div>
    `
    )
    .join('');
}

function renderRisks() {
  risksList.innerHTML = state.risks
    .map(
      (item) => `
      <div class="stack-item">
        <div class="stack-top">
          <h4>${item.severity} severity</h4>
          <span class="pill ${item.severity === 'High' ? 'risk' : 'warn'}">${item.severity}</span>
        </div>
        <p><strong>Reason:</strong> ${item.reason}</p>
        <p><strong>Suggested action:</strong> ${item.action}</p>
      </div>
    `
    )
    .join('');
}

function renderApprovals() {
  approvalGrid.innerHTML = state.approvals
    .map(
      (item) => `
      <div class="approval-card">
        <div class="approval-top">
          <div>
            <span class="meta-chip">Awaiting approval</span>
            <h4>${item.title}</h4>
          </div>
          <span class="pill info">${item.status}</span>
        </div>
        <strong>${item.amount}</strong>
        <p>${item.reason}</p>
        <p><strong>Expected impact:</strong> ${item.impact}</p>
        <div class="approval-footer">
          <span>${item.owner}</span>
          <span>No automation active</span>
        </div>
      </div>
    `
    )
    .join('');
}

function renderBriefing() {
  briefingPreview.innerHTML = `
    <blockquote>${state.briefing.headline}</blockquote>
    <div class="briefing-points">
      ${state.briefing.points.map((point) => `<div class="briefing-point">${point}</div>`).join('')}
    </div>
  `;
}

function renderChat(activeIndex = 0) {
  chatPrompts.innerHTML = '';

  state.chat.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `prompt-button${index === activeIndex ? ' active' : ''}`;
    button.textContent = item.question;
    button.addEventListener('click', () => renderChat(index));
    chatPrompts.appendChild(button);
  });

  chatQuestion.textContent = state.chat[activeIndex].question;
  chatAnswer.textContent = state.chat[activeIndex].answer;
}

function highlightCurrentNav() {
  const sections = [...document.querySelectorAll('main [id]')];
  const navLinks = [...document.querySelectorAll('.nav-link')];

  const update = () => {
    let current = 'workspace';
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top <= 140) current = section.id;
    });

    navLinks.forEach((link) => {
      const target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === current);
    });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

renderHeader();
renderMetrics();
renderPriorities();
renderOpportunities();
renderRisks();
renderApprovals();
renderBriefing();
renderChat();
highlightCurrentNav();
