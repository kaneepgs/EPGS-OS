import { NAV_PRIMARY, NAV_SECONDARY, MODE_OPTIONS, PAGE_META, MOCK_DATA } from './data/mock-data.js';
import {
  icon,
  navLink,
  breadcrumb,
  sectionHeader,
  statCard,
  metricCard,
  insightCard,
  priorityCard,
  chartCard,
  executiveQuestionCard,
  commentaryCard,
  approvalCard,
  registerRow,
  supplierCard,
  searchRow,
  integrationTile,
  loadingSkeleton,
  pill,
  escapeHtml
} from './ui/components.js';
import { renderCharts, destroyCharts } from './ui/charts.js';

const STORAGE_KEY = 'ep-intelligence.workspace.v0.3';
const appShell = document.getElementById('app-shell');
const sidebar = document.getElementById('sidebar');
const primaryNav = document.getElementById('primary-nav');
const secondaryNav = document.getElementById('secondary-nav');
const sidebarFavourites = document.getElementById('sidebar-favourites');
const sidebarRecent = document.getElementById('sidebar-recent');
const navSearch = document.getElementById('nav-search');
const breadcrumbNode = document.getElementById('breadcrumb');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');
const pageContent = document.getElementById('page-content');
const modeSwitcher = document.getElementById('mode-switcher');
const themeToggle = document.getElementById('theme-toggle');
const sidebarToggle = document.getElementById('sidebar-toggle');
const commandLauncher = document.getElementById('command-launcher');
const paletteBackdrop = document.getElementById('palette-backdrop');
const paletteClose = document.getElementById('palette-close');
const paletteInput = document.getElementById('palette-input');
const paletteResults = document.getElementById('palette-results');

const state = {
  page: 'workspace',
  mode: 'workspace',
  activeMetric: 'revenue',
  activeQuestion: 0,
  journalQuery: '',
  navQuery: '',
  commandQuery: '',
  commandOpen: false,
  theme: 'dark',
  sidebarCollapsed: false,
  sidebarOpen: false,
  favourites: ['supplier-spend', 'cash-flow', 'weekly-briefings'],
  recent: ['workspace', 'supplier-spend', 'cash-flow'],
  loading: false
};

const questionSets = {
  workspace: {
    what: ['Revenue is healthy, profit is slightly tighter', 'The business is growing, but the quality of that growth matters more than volume alone.'],
    why: ['Supplier and support costs rose faster than ideal', 'Supplier concentration and expense drift have moderated how much confidence top-line growth should create.'],
    matters: ['Yes — it affects flexibility', 'The business remains strong, but weaker margin conversion reduces room for casual decisions.'],
    next: ['Prioritise collections and margin control', 'The best next decisions are around receivables, supplier discipline, and selective spend restraint.']
  },
  revenue: {
    what: ['Revenue is trending up', 'Revenue is ahead of both recent months and the placeholder prior-year baseline.'],
    why: ['Demand and conversion improved', 'Fitting demand appears stronger and premium conversion is supporting basket quality.'],
    matters: ['Yes, if margin quality holds', 'Top-line growth only matters strategically if it improves profit and cash rather than hiding cost inflation.'],
    next: ['Track mix and booking quality', 'Compare revenue growth against gross margin, collections, and future bookings confidence.']
  },
  profit: {
    what: ['Profit softened slightly', 'Top-line growth has not fully translated into stronger net output this month.'],
    why: ['Costs rose faster than ideal', 'Supplier, fulfilment, and discretionary operating costs compressed the gain.'],
    matters: ['Yes, because it changes confidence', 'Good revenue can still leave less room for investment if margin quality weakens.'],
    next: ['Defend margin quality', 'Review cost centres, supplier leverage, and discretionary spend before approving new commitments.']
  },
  expenses: {
    what: ['Expenses are trending upward', 'Spend remains controllable, but variable lines are rising faster than the original baseline.'],
    why: ['Activity and support costs expanded', 'Contractor, travel, and supplier-related spend rose alongside commercial activity.'],
    matters: ['Yes, because profit conversion depends on it', 'Expenses only become strategic when they outpace the return created by revenue growth.'],
    next: ['Separate strategic spend from drift', 'Keep valuable spend, but remove lines that lack a clear return or owner.']
  },
  'supplier-spend': {
    what: ['Supplier spend is rising and concentrated', 'A small number of suppliers now account for a meaningful share of cash outflow and margin pressure.'],
    why: ['Growth and inventory choices lifted exposure', 'The current pattern may be rational, but it has not all been pressure-tested recently.'],
    matters: ['Yes, because supplier leverage shapes margin and cash', 'The issue is not just cost — it is dependency, timing, and bargaining power.'],
    next: ['Review top suppliers one by one', 'Decide where terms, volumes, or payment timing should be challenged rather than inherited.']
  },
  'cash-flow': {
    what: ['Cash is healthy but timing matters', 'There is no immediate liquidity stress, but short-term flexibility still depends on planned receipts landing.'],
    why: ['Receivables concentration remains a factor', 'Strong inflows are offset by a handful of overdue balances and planned outgoing supplier payments.'],
    matters: ['Yes, because timing changes decision freedom', 'Healthy cash without good timing discipline can still force weaker decisions than necessary.'],
    next: ['Protect timing and challenge assumptions', 'Pressure-test receivables, staged payables, and forecast assumptions for the next 90 days.']
  },
  vat: {
    what: ['VAT looks provisioned', 'The estimate is not alarming and appears covered in the short-term plan.'],
    why: ['Trading remains healthy and the liability is stable', 'The forecast moves mainly with revenue and purchase record completeness.'],
    matters: ['Yes, because confidence matters as much as the amount', 'A manageable liability can still become disruptive if record quality slips.'],
    next: ['Tighten record capture confidence', 'Keep purchase-side discipline high ahead of the next filing cycle.']
  },
  forecasting: {
    what: ['Forecasts are positive but assumption-sensitive', 'The current outlook is constructive under a controlled set of placeholder assumptions.'],
    why: ['Demand is stable and cash is healthy', 'A small number of assumptions still drive most of the model: collections speed, supplier costs, and discretionary expense control.'],
    matters: ['Yes, because forecast quality shapes confidence', 'The right forecast improves timing, investment discipline, and approval quality.'],
    next: ['Challenge assumptions, not just outputs', 'The best use of the page is to test what could break the plan and what could improve it.']
  },
  'business-kpis': {
    what: ['KPIs are broadly healthy', 'Core revenue, profit, and cash KPIs support confidence, with working-capital watchpoints still visible.'],
    why: ['Growth stayed positive and governance stayed tight', 'The score is rising because cash resilience and growth quality improved while controls remained strong.'],
    matters: ['Yes, because KPIs shape the health score', 'The KPI layer helps explain the business in aggregate before leadership goes deeper.'],
    next: ['Use KPIs to guide deeper reviews', 'Follow the KPI signals into supplier, cash-flow, and approval pages rather than stopping at the surface.']
  },
  'decision-journal': {
    what: ['Recommendations are becoming a reusable knowledge base', 'The journal shows what was recommended, what was decided, and what happened next.'],
    why: ['The platform is built to learn from decisions', 'Executive quality improves when outcomes and lessons are preserved, not forgotten.'],
    matters: ['Yes, because memory compounds quality', 'The Decision Journal becomes one of the most valuable assets once it builds history.'],
    next: ['Review, search, and revisit decisions', 'Use the journal to question assumptions and surface recommendations worth revisiting.']
  },
  'weekly-briefings': {
    what: ['The weekly briefing frames the board conversation', 'It condenses the business into what matters most this week, not just what happened.'],
    why: ['Leaders need a decision-focused Sunday view', 'The right briefing reduces noise and creates alignment before the week begins.'],
    matters: ['Yes, because cadence shapes quality', 'A strong weekly briefing is how the executive operating system becomes habitual.'],
    next: ['Use the page like a board paper', 'Review wins, risks, forecasts, approvals, and the questions worth asking before action is taken.']
  },
  'approval-centre': {
    what: ['Approvals are grouped by decision type', 'Accounting, invoices, bills, categorisation, recommendations, and forecast assumptions all sit in one governed view.'],
    why: ['Approval-first design protects the business', 'The workspace is built to stage decisions before any future automation exists.'],
    matters: ['Yes, because governance quality is strategic', 'Approval design is one of the clearest ways to preserve control as the platform grows.'],
    next: ['Prioritise high-impact approvals', 'Start with the approvals that most affect cash, margin, and forecast confidence.']
  },
  settings: {
    what: ['Settings define the future operating model', 'This page shows the future control surface for integrations, personas, and preferences.'],
    why: ['Good configuration is part of good governance', 'Executive systems should be explainable and controllable as they scale.'],
    matters: ['Yes, because future integrations need safe defaults', 'Architecture quality now reduces risk when live systems are connected later.'],
    next: ['Prepare for future integration', 'Keep the settings model clear, modular, and executive-readable before anything live is connected.']
  },
  'financial-health': {
    what: ['The score improved', 'The Financial Health Score rose because revenue resilience and cash stability improved.'],
    why: ['Cash and growth quality were the main contributors', 'Margin was slightly softer, but the broader balance still improved overall.'],
    matters: ['Yes, because the score helps orient leadership', 'The score is useful as a summary — provided the weighting and logic remain transparent.'],
    next: ['Treat the score as guidance, not an answer', 'Use the score to direct attention, then examine the pages beneath it.']
  },
  'opportunity-register': {
    what: ['The register captures practical upside', 'Each opportunity is written as an executive decision rather than an abstract idea.'],
    why: ['The best opportunities sit between insight and timing', 'Clear structure helps leadership choose which upside matters now versus later.'],
    matters: ['Yes, because not all opportunities deserve the same attention', 'The register prevents good ideas from being lost or over-valued.'],
    next: ['Prioritise by ROI, timing, and confidence', 'Use the register to decide what deserves action, review, or deferment.']
  },
  'risk-register': {
    what: ['The register captures the real business watchpoints', 'Risk is expressed in operational and financial terms rather than vague caution.'],
    why: ['Executive calm requires explicit ownership', 'A clear register prevents known risks from becoming recurring surprises.'],
    matters: ['Yes, because risk visibility improves decision quality', 'Known risk with a plan is different from unseen risk with false confidence.'],
    next: ['Review mitigation quality regularly', 'Treat the risk register as a living document rather than a one-time report.']
  },
  'quarterly-review': {
    what: ['The quarterly review consolidates what changed', 'It captures business performance, accepted recommendations, lessons learned, and the next quarter’s opportunities.'],
    why: ['Quarterly rhythm supports strategic memory', 'A prepared board paper helps leadership see patterns beyond weekly noise.'],
    matters: ['Yes, because the platform should improve over time', 'Quarterly review is where tactical activity becomes strategic learning.'],
    next: ['Use it to revisit decisions', 'Challenge which accepted, rejected, and pending ideas still make sense under current conditions.']
  }
};

function saveState() {
  const snapshot = {
    page: state.page,
    mode: state.mode,
    theme: state.theme,
    sidebarCollapsed: state.sidebarCollapsed,
    favourites: state.favourites,
    recent: state.recent
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
  } catch {}
}

function setTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  updateThemeButton();
  saveState();
}

function updateThemeButton() {
  themeToggle.innerHTML = `${icon('moon')}<span class="visually-hidden">Toggle theme</span>`;
  themeToggle.title = state.theme === 'dark' ? 'Switch to midnight theme' : 'Switch to dark theme';
}

function visiblePages() {
  return [...NAV_PRIMARY, ...NAV_SECONDARY].filter(([, label]) => label.toLowerCase().includes(state.navQuery.toLowerCase()));
}

function updateRecent(page) {
  state.recent = [page, ...state.recent.filter((item) => item !== page)].slice(0, 6);
}

function toggleFavourite(page) {
  if (state.favourites.includes(page)) {
    state.favourites = state.favourites.filter((item) => item !== page);
  } else {
    state.favourites = [page, ...state.favourites].slice(0, 6);
  }
  saveState();
  renderSidebarMeta();
}

function setPage(page, { withLoading = true } = {}) {
  state.page = page;
  state.mode = state.mode || 'workspace';
  updateRecent(page);
  syncUrl();
  saveState();
  if (window.innerWidth <= 1080) {
    state.sidebarOpen = false;
    appShell.classList.remove('sidebar-open');
  }
  withLoading ? renderWithSkeleton() : render();
}

function setMode(mode, { withLoading = false } = {}) {
  state.mode = mode;
  syncUrl();
  saveState();
  withLoading ? renderWithSkeleton() : render();
}

function syncUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set('page', state.page);
  params.set('mode', state.mode);
  history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');
  const mode = params.get('mode');
  const validPages = new Set([...NAV_PRIMARY, ...NAV_SECONDARY].map(([id]) => id));
  if (validPages.has(page)) state.page = page;
  if (mode === 'board' || mode === 'workspace') state.mode = mode;
}

function renderSidebarMeta() {
  sidebarFavourites.innerHTML = state.favourites
    .map((page) => {
      const meta = PAGE_META[page];
      return `<button type="button" class="sidebar-chip" data-chip-page="${page}">${icon('star')}${escapeHtml(meta.title)}</button>`;
    })
    .join('');

  sidebarRecent.innerHTML = state.recent
    .map((page) => {
      const meta = PAGE_META[page];
      return `<button type="button" class="sidebar-chip" data-chip-page="${page}">${icon('arrowRight')}${escapeHtml(meta.title)}</button>`;
    })
    .join('');

  document.querySelectorAll('[data-chip-page]').forEach((button) => {
    button.addEventListener('click', () => setPage(button.dataset.chipPage));
  });
}

function renderSidebar() {
  const pages = visiblePages();
  primaryNav.innerHTML = pages
    .filter(([id]) => NAV_PRIMARY.some(([navId]) => navId === id))
    .map(([id, label, iconName]) => navLink({ id, label, iconName, active: state.mode === 'workspace' && state.page === id, favourite: state.favourites.includes(id) }))
    .join('');

  secondaryNav.innerHTML = pages
    .filter(([id]) => NAV_SECONDARY.some(([navId]) => navId === id))
    .map(([id, label, iconName]) => navLink({ id, label, iconName, active: state.mode === 'workspace' && state.page === id, favourite: state.favourites.includes(id) }))
    .join('');

  document.querySelectorAll('[data-page]').forEach((node) => {
    node.addEventListener('click', (event) => {
      event.preventDefault();
      setMode('workspace');
      setPage(node.dataset.page);
    });
  });

  renderSidebarMeta();
}

function renderModeSwitcher() {
  modeSwitcher.innerHTML = MODE_OPTIONS.map(([value, label]) => `<button type="button" class="mode-button ${state.mode === value ? 'active' : ''}" data-mode="${value}" role="tab" aria-selected="${String(state.mode === value)}">${escapeHtml(label)}</button>`).join('');
  modeSwitcher.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.mode, { withLoading: true }));
  });
}

function breadcrumbParts() {
  if (state.mode === 'board') return ['EP Intelligence', 'Board Meeting'];
  return ['EP Intelligence', 'CFO Executive Workspace', PAGE_META[state.page].title];
}

function renderTopbar() {
  const meta = PAGE_META[state.page];
  breadcrumbNode.innerHTML = breadcrumb(breadcrumbParts());
  pageTitle.textContent = state.mode === 'board' ? 'Board Meeting Mode' : meta.title;
  pageSubtitle.textContent = state.mode === 'board' ? 'A Sunday-morning executive briefing view for leadership-level conversations.' : meta.subtitle;
  sidebarToggle.innerHTML = icon('menu');
  commandLauncher.innerHTML = `${icon('command')}<span class="command-hint">Ctrl/Cmd + K</span>`;
  paletteClose.innerHTML = icon('chevronLeft');
  renderModeSwitcher();
  updateThemeButton();
}

function chartSpec(key, canvasId, label = '') {
  return { id: canvasId, label, ...MOCK_DATA.charts[key] };
}

function pageQuestions(key) {
  const set = questionSets[key];
  return `
    <section class="panel">
      ${sectionHeader({ eyebrow: 'Executive Intelligence', title: 'The four questions this page answers' })}
      <div class="executive-question-grid">
        ${executiveQuestionCard({ question: 'What happened?', title: set.what[0], body: set.what[1] })}
        ${executiveQuestionCard({ question: 'Why did it happen?', title: set.why[0], body: set.why[1] })}
        ${executiveQuestionCard({ question: 'Does it matter?', title: set.matters[0], body: set.matters[1] })}
        ${executiveQuestionCard({ question: 'What should I do next?', title: set.next[0], body: set.next[1] })}
      </div>
    </section>
  `;
}

function workspaceView() {
  const activeMetric = MOCK_DATA.metrics.find((metric) => metric.key === state.activeMetric) || MOCK_DATA.metrics[0];
  return {
    html: `
      <div class="page-grid">
        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">${escapeHtml(MOCK_DATA.welcome.greeting)}</div>
              <div class="hero-title">${escapeHtml(MOCK_DATA.welcome.title)}</div>
              <p class="hero-summary">${escapeHtml(MOCK_DATA.welcome.summary)}</p>
            </section>
            <section class="snapshot-grid">
              ${statCard({ iconName: 'trending-up', label: 'Revenue Summary', value: MOCK_DATA.welcome.snapshot.revenue, body: 'Demand remains strong with premium conversion holding up.' })}
              ${statCard({ iconName: 'coins', label: 'Profit Summary', value: MOCK_DATA.welcome.snapshot.profit, body: 'Profit is solid, though slightly softer than last month.' })}
              ${statCard({ iconName: 'wallet', label: 'Cash Position', value: MOCK_DATA.welcome.snapshot.cash, body: 'Healthy enough for calm decision-making under current assumptions.' })}
              ${statCard({ iconName: 'check-circle', label: 'Recent Approvals', value: MOCK_DATA.welcome.snapshot.approvals, body: 'All material actions remain staged for explicit review.' })}
            </section>
          </div>
          <div class="hero-side">
            <section class="score-panel">
              <div class="score-tile">
                <div class="label">Financial Health Score</div>
                <strong class="score-value">${MOCK_DATA.welcome.score}</strong>
                <div class="score-note">${escapeHtml(MOCK_DATA.welcome.trend)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">Business Snapshot</div>
                <h3>${escapeHtml(MOCK_DATA.welcome.label)}</h3>
                <p>${escapeHtml(MOCK_DATA.welcome.narrative)}</p>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: MOCK_DATA.homepage.banner.title, title: 'Today’s priorities', body: 'A curated executive view of what deserves attention before anything else.' })}
          <div class="grid-3">
            ${MOCK_DATA.homepage.priorities.map((item, index) => priorityCard({ index: index + 1, title: item.title, body: item.note, tone: item.tone })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Workspace summary', title: 'Executive cards', body: 'Use these as your fast launchpads into the most important parts of the business.' })}
          <div class="metric-grid">
            ${MOCK_DATA.metrics.map((metric) => metricCard({ key: metric.key, label: metric.label, value: metric.value, trend: metric.trend, iconName: metric.key === 'revenue' ? 'trending-up' : metric.key === 'profit' ? 'coins' : metric.key === 'cash' ? 'wallet' : metric.key === 'supplier' ? 'building' : 'grid', active: metric.key === state.activeMetric })).join('')}
          </div>
          <div class="metric-detail">
            <div class="label">Selected CFO readout</div>
            <h4>${escapeHtml(activeMetric.label)}</h4>
            <p>${escapeHtml(activeMetric.detail)}</p>
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Weekly Briefing Preview', title: 'Sunday executive summary', body: 'This is the version that later becomes a full board-quality briefing.' })}
            <div class="snapshot-panel">
              <h3>${escapeHtml(MOCK_DATA.weeklyBriefing.summary)}</h3>
              <ul class="briefing-list">${MOCK_DATA.weeklyBriefing.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Business Snapshot', title: 'What the CFO wants you to remember', body: 'A compact narrative of the current business state.' })}
            <div class="snapshot-panel">
              <ul class="mini-list">${MOCK_DATA.homepage.businessSnapshot.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
          </section>
        </div>

        ${commentaryCard({ title: MOCK_DATA.commentary.workspace.title, data: MOCK_DATA.commentary.workspace })}

        <div class="grid-3">
          <section class="quick-action-panel">
            ${sectionHeader({ eyebrow: 'Quick Actions', title: 'Launch common executive tasks' })}
            <div class="section-stack">
              ${MOCK_DATA.homepage.quickActions.map((action) => `<button type="button" class="quick-action-button">${escapeHtml(action)}${icon('arrowRight')}</button>`).join('')}
            </div>
          </section>
          <section class="recent-panel">
            ${sectionHeader({ eyebrow: 'Recently Viewed Pages', title: 'Pick up where you left off' })}
            <div class="recent-trail">${state.recent.map((page) => `<button type="button" class="chip-button" data-quick-page="${page}">${icon('arrowRight')}${escapeHtml(PAGE_META[page].title)}</button>`).join('')}</div>
          </section>
          <section class="favourites-panel">
            ${sectionHeader({ eyebrow: 'Favourite Reports', title: 'Your pinned executive views' })}
            <div class="favourite-trail">${state.favourites.map((page) => `<button type="button" class="chip-button" data-quick-page="${page}">${icon('star')}${escapeHtml(PAGE_META[page].title)}</button>`).join('')}</div>
          </section>
        </div>

        ${pageQuestions('workspace')}
      </div>
    `,
    charts: []
  };
}

function revenueView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Revenue Page', title: 'Revenue performance and collection quality', body: 'Every revenue number is paired with context about quality, timing, and strategic usefulness.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'trending-up', label: 'Revenue this month', value: '£46.8k', body: 'Ahead of plan with healthier premium conversion.' })}
            ${statCard({ iconName: 'calendar', label: 'Revenue by month', value: '7 months tracked', body: 'Steady progression in placeholder monthly trend.' })}
            ${statCard({ iconName: 'wallet', label: 'Revenue vs last year', value: '+14.2%', body: 'Growth is positive without obvious discount-led distortion.' })}
            ${statCard({ iconName: 'sparkles', label: 'Revenue forecast', value: MOCK_DATA.forecasts.revenue, body: 'Forecast stays constructive under current assumptions.' })}
          </div>
        </section>
        ${pageQuestions('revenue')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Revenue Trends', title: 'Revenue trend chart', canvasId: 'chart-revenue-trend', meta: 'Interactive placeholder data using Chart.js.' })}
          ${chartCard({ eyebrow: 'Payment mix', title: 'Revenue by payment method', canvasId: 'chart-payment-methods', meta: 'Card, transfer, finance, and cash mix.' })}
          ${chartCard({ eyebrow: 'Invoice status', title: 'Revenue by invoice status', canvasId: 'chart-invoice-status', meta: 'Paid, pending, and overdue profile.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Future integration', title: 'Bookings Dashboard placeholder', body: 'This will later connect future bookings and pipeline quality to revenue forecasting.' })}
          ${insightCard({ eyebrow: 'Placeholder', title: 'Future Bookings Dashboard integration', body: 'Reserved for a live bookings and pipeline feed that will help the CFO connect demand quality to revenue and cash confidence.' })}
        </section>
        ${commentaryCard({ title: MOCK_DATA.commentary.revenue.title, data: MOCK_DATA.commentary.revenue })}
      </div>
    `,
    charts: [
      chartSpec('revenueTrend', 'chart-revenue-trend', 'Revenue trend'),
      chartSpec('paymentMethods', 'chart-payment-methods', 'Payment method mix'),
      chartSpec('invoiceStatus', 'chart-invoice-status', 'Invoice status mix')
    ]
  };
}

function profitView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Profit Page', title: 'Margin quality and profitability', body: 'Profit should feel like an executive conversation about leverage and trade-offs, not a ledger export.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'coins', label: 'Gross profit', value: '£24.1k', body: 'Strong, but pressured by higher supplier costs.' })}
            ${statCard({ iconName: 'coins', label: 'Net profit', value: '£11.6k', body: 'Still healthy, though softer than last month.' })}
            ${statCard({ iconName: 'grid', label: 'Gross margin', value: '51.5%', body: 'Should improve if supplier terms tighten.' })}
            ${statCard({ iconName: 'grid', label: 'Net margin', value: '24.8%', body: 'A solid level for the current growth stage.' })}
          </div>
        </section>
        ${pageQuestions('profit')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Monthly Profit', title: 'Profit trend', canvasId: 'chart-profit', meta: 'Interactive monthly profit trend.' })}
          ${chartCard({ eyebrow: 'Cost Centres', title: 'Biggest cost centres', canvasId: 'chart-profit-costs', meta: 'Shows where profitability pressure originates.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Recommendations', title: 'Ways to improve profitability', body: 'Profit improvement options should be concrete, financial, and sequenced.' })}
          <div class="tile-grid">
            ${insightCard({ eyebrow: 'Recommendation', title: 'Renegotiate one major supplier', body: 'Potential £1.2k monthly margin improvement with limited disruption.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Recommendation', title: 'Reduce low-yield discretionary costs', body: 'Protects net profit without reducing meaningful growth activity.', tone: 'warn' })}
            ${insightCard({ eyebrow: 'Recommendation', title: 'Review premium service mix', body: 'Improving mix may widen margin faster than chasing raw volume.', tone: 'info' })}
          </div>
        </section>
        ${commentaryCard({ title: MOCK_DATA.commentary.profit.title, data: MOCK_DATA.commentary.profit })}
      </div>
    `,
    charts: [
      chartSpec('monthlyProfit', 'chart-profit', 'Monthly profit trend'),
      { id: 'chart-profit-costs', type: 'bar', labels: ['Suppliers', 'Support', 'Rent', 'Software'], values: [42, 23, 19, 16], label: 'Cost centre mix', suffix: '%' }
    ]
  };
}

function expensesView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Expenses Page', title: 'Operating cost discipline', body: 'Expense visibility is only useful when it improves judgment about what to keep, reduce, or challenge.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'receipt', label: 'Monthly expenses', value: '£24.9k', body: 'Still manageable, but visibly rising.' })}
            ${statCard({ iconName: 'grid', label: 'Fixed vs variable', value: '58 / 42', body: 'Variable lines deserve the most attention.' })}
            ${statCard({ iconName: 'settings', label: 'Software subscriptions', value: '£1.4k', body: 'Stable, but worth future overlap review.' })}
            ${statCard({ iconName: 'building', label: 'Largest expenses', value: 'Inventory & supply', body: 'Supplier-linked costs remain the dominant driver.' })}
          </div>
        </section>
        ${pageQuestions('expenses')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Expense trend', title: 'Monthly expenses', canvasId: 'chart-expenses', meta: 'Interactive monthly trend.' })}
          ${chartCard({ eyebrow: 'Categories', title: 'Expense categories', canvasId: 'chart-expense-categories', meta: 'Share of total expense by category.' })}
        </div>
        ${commentaryCard({ title: MOCK_DATA.commentary.expenses.title, data: MOCK_DATA.commentary.expenses })}
      </div>
    `,
    charts: [chartSpec('expenseTrend', 'chart-expenses', 'Expense trend'), chartSpec('expenseCategories', 'chart-expense-categories', 'Expense categories')]
  };
}

function supplierSpendView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Supplier Spend', title: 'Supplier leverage, concentration, and risk', body: 'One of the strongest pages in the prototype because supplier behaviour affects both margin and cash quality.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'building', label: 'Spend this month', value: '£17.7k', body: 'Concentrated in a small number of critical relationships.' })}
            ${statCard({ iconName: 'building', label: 'Spend year-to-date', value: '£89.8k', body: 'Running ahead of the placeholder prior-year pace.' })}
            ${statCard({ iconName: 'building', label: 'Spend last year', value: '£75.1k', body: 'Reference point for YoY control.' })}
            ${statCard({ iconName: 'trending-up', label: 'Year-on-year', value: '+19.6%', body: 'Higher than comfort if gross margin does not keep pace.' })}
          </div>
        </section>
        ${pageQuestions('supplier-spend')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Supplier Spend', title: 'Monthly trend', canvasId: 'chart-supplier-trend', meta: 'Interactive placeholder monthly supplier spend.' })}
          ${chartCard({ eyebrow: 'Categories', title: 'Top spending categories', canvasId: 'chart-supplier-categories', meta: 'Where supplier cash outflow is concentrated.' })}
          ${chartCard({ eyebrow: 'Risk indicator', title: 'Supplier risk indicator', canvasId: 'chart-supplier-risk', meta: 'Low, medium, and high-risk mix.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Top suppliers', title: 'Supplier drill-down placeholders', body: 'Every supplier includes a future drill-down placeholder.' })}
          <div class="tile-grid">
            ${MOCK_DATA.suppliers.map((supplier) => supplierCard(supplier)).join('')}
          </div>
        </section>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Supplier opportunities', title: 'Current upside' })}
            <div class="section-stack">
              ${insightCard({ eyebrow: 'Opportunity', title: 'Term review with top supplier', body: 'Potential to improve margin and cash timing at the same time.', tone: 'good' })}
              ${insightCard({ eyebrow: 'Opportunity', title: 'Bundle volume strategically', body: 'Larger, more intentional orders may improve unit economics without losing control.', tone: 'info' })}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'AI recommendations', title: 'What the CFO would do next' })}
            ${insightCard({ eyebrow: 'Recommended action', title: 'Open individual supplier reviews', body: 'Test contribution margin, payment timing, and whether current relationships justify their share of spend.', tone: 'warn' })}
          </section>
        </div>
        ${commentaryCard({ title: MOCK_DATA.commentary.suppliers.title, data: MOCK_DATA.commentary.suppliers })}
      </div>
    `,
    charts: [
      chartSpec('supplierTrend', 'chart-supplier-trend', 'Supplier monthly spend'),
      { id: 'chart-supplier-categories', type: 'doughnut', labels: ['Launch Monitors', 'Retail Stock', 'Subscriptions', 'Consumables'], values: [39, 29, 19, 13], label: 'Supplier categories', suffix: '%' },
      { id: 'chart-supplier-risk', type: 'bar', labels: ['Low', 'Medium', 'High'], values: [34, 52, 14], label: 'Risk indicator', suffix: '%' }
    ]
  };
}

function cashFlowView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Cash Flow', title: 'Liquidity, runway, and timing confidence', body: 'Cash should feel like a strategic narrative rather than a number trapped in a ledger.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'wallet', label: 'Cash balance', value: '£28.1k', body: 'Healthy current position with short-term flexibility.' })}
            ${statCard({ iconName: 'trending-up', label: 'Cash inflow', value: '£44.6k', body: 'Strong enough to support current plans.' })}
            ${statCard({ iconName: 'receipt', label: 'Cash outflow', value: '£37.2k', body: 'Manageable, but requires sequencing discipline.' })}
            ${statCard({ iconName: 'sparkles', label: 'Cash runway', value: '5.4 months', body: 'Comfortable under current placeholder assumptions.' })}
          </div>
        </section>
        ${pageQuestions('cash-flow')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Cash Flow', title: '30/60/90 day forecast', canvasId: 'chart-cash-flow', meta: 'Interactive placeholder forecast.' })}
          ${chartCard({ eyebrow: 'Risk analysis', title: 'Cash flow sensitivity', canvasId: 'chart-cash-risk', meta: 'Which factors most affect confidence in the view.' })}
        </div>
        ${commentaryCard({ title: MOCK_DATA.commentary.cash.title, data: MOCK_DATA.commentary.cash })}
      </div>
    `,
    charts: [chartSpec('cashFlow', 'chart-cash-flow', 'Cash flow forecast'), { id: 'chart-cash-risk', type: 'bar', labels: ['Collections', 'Supplier timing', 'Discretionary spend', 'Tax timing'], values: [38, 29, 17, 16], label: 'Cash risk', suffix: '%' }]
  };
}

function vatView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'VAT', title: 'VAT position and confidence', body: 'VAT should feel governed and explainable, not like a surprise waiting at the edge of the month.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'shield', label: 'Current VAT estimate', value: '£4.8k', body: 'Provisioned in the current cash plan.' })}
            ${statCard({ iconName: 'calendar', label: 'Upcoming payment', value: '£4.6k', body: 'Timing remains manageable under current assumptions.' })}
            ${statCard({ iconName: 'grid', label: 'Historical VAT', value: '£4.1k avg', body: 'Recent settlement range in the demo environment.' })}
            ${statCard({ iconName: 'sparkles', label: 'Forecast VAT', value: '£5.0k', body: 'Assumes broadly similar trading pattern continues.' })}
          </div>
        </section>
        ${pageQuestions('vat')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'VAT History', title: 'Historical VAT trend', canvasId: 'chart-vat', meta: 'Quarterly placeholder VAT history.' })}
          ${chartCard({ eyebrow: 'KPI Gauge', title: 'VAT confidence gauge', canvasId: 'chart-vat-gauge', meta: 'Proxy for confidence rather than a direct liability measure.' })}
        </div>
        ${commentaryCard({ title: MOCK_DATA.commentary.vat.title, data: MOCK_DATA.commentary.vat })}
      </div>
    `,
    charts: [chartSpec('vatHistory', 'chart-vat', 'VAT history'), chartSpec('kpiGauge', 'chart-vat-gauge', 'VAT confidence gauge')]
  };
}

function forecastingView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Forecasting', title: 'Executive forecasting workspace', body: 'Use this page to challenge assumptions and model choices, not to seek false precision.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'trending-up', label: 'Revenue forecast', value: MOCK_DATA.forecasts.revenue, body: 'Assumes healthy demand and stable booking conversion.' })}
            ${statCard({ iconName: 'coins', label: 'Profit forecast', value: MOCK_DATA.forecasts.profit, body: 'Depends on stabilising supplier cost growth.' })}
            ${statCard({ iconName: 'wallet', label: 'Cash forecast', value: MOCK_DATA.forecasts.cash, body: 'Requires collections to normalise on time.' })}
            ${statCard({ iconName: 'sparkles', label: 'Investment modelling', value: 'Placeholder', body: 'Reserved for future capital and equipment decision models.' })}
          </div>
        </section>
        ${pageQuestions('forecasting')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Financial Forecast', title: 'Scenario comparison', canvasId: 'chart-forecast', meta: 'Base, conservative, and upside scenarios.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'What if…', title: 'Scenario planning placeholders', body: 'A forecasting workspace should feel like a thinking environment rather than a static report.' })}
          <div class="tile-grid">${MOCK_DATA.forecasts.scenarios.map((item) => insightCard({ eyebrow: 'Scenario', title: item.title, body: item.body, tone: 'neutral' })).join('')}</div>
        </section>
        ${commentaryCard({ title: MOCK_DATA.commentary.forecasting.title, data: MOCK_DATA.commentary.forecasting })}
      </div>
    `,
    charts: [chartSpec('financialForecast', 'chart-forecast', 'Forecast scenario comparison')]
  };
}

function businessKpisView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Business KPIs', title: 'Connected KPI framework', body: 'KPIs are grouped by the questions they help answer, not by accounting table structure.' })}
          <div class="section-stack">
            ${MOCK_DATA.kpis.groups
              .map(
                ([title, entries]) => `
                  <section class="panel">
                    <div class="label">${escapeHtml(title)}</div>
                    <div class="kpi-row">
                      ${entries.map(([label, value]) => statCard({ iconName: 'grid', label, value, body: 'Executive context placeholder.' })).join('')}
                    </div>
                  </section>
                `
              )
              .join('')}
          </div>
        </section>
        ${pageQuestions('business-kpis')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'KPI Gauge', title: 'Financial Health Score breakdown', canvasId: 'chart-kpi-gauge', meta: 'Weighted gauge of current business health.' })}
          ${chartCard({ eyebrow: 'Historical Scores', title: 'Score history', canvasId: 'chart-score-history', meta: 'How the score has moved over time.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Weighting Breakdown', title: 'How the score is built', body: 'Future versions will allow custom weighting, but this prototype keeps the logic visible.' })}
          <div class="tile-grid">${MOCK_DATA.kpis.weights.map((item) => insightCard({ eyebrow: item.weight, title: item.title, body: item.note, tone: 'neutral' })).join('')}</div>
        </section>
      </div>
    `,
    charts: [chartSpec('kpiGauge', 'chart-kpi-gauge', 'Health score gauge'), chartSpec('historicalScores', 'chart-score-history', 'Historical scores')]
  };
}

function decisionJournalView() {
  const q = state.journalQuery.trim().toLowerCase();
  const filtered = MOCK_DATA.decisionJournal.filter((entry) => {
    if (!q) return true;
    return [entry.id, entry.recommendation, entry.reasoning, entry.decision, entry.outcome, entry.status].join(' ').toLowerCase().includes(q);
  });
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Decision Journal', title: 'Searchable executive timeline', body: 'The platform should learn from decisions and outcomes, not just store them.' })}
          ${searchRow({ value: state.journalQuery })}
        </section>
        ${pageQuestions('decision-journal')}
        <section class="panel">
          <div class="section-stack">
            ${filtered
              .map(
                (entry) => `
                  <article class="register-row">
                    <div class="register-meta">${pill(entry.id, 'info')}${pill(entry.status, entry.status === 'Pending' ? 'warn' : entry.status === 'Active' ? 'info' : 'good')}${pill(entry.executive, 'neutral')}</div>
                    <h4>${escapeHtml(entry.recommendation)}</h4>
                    <div class="grid-3">
                      ${insightCard({ eyebrow: 'Reasoning', title: 'Why', body: entry.reasoning, tone: 'neutral' })}
                      ${insightCard({ eyebrow: 'Supporting Evidence', title: 'Evidence', body: entry.evidence, tone: 'neutral' })}
                      ${insightCard({ eyebrow: 'Alternatives', title: 'Considered', body: entry.alternatives, tone: 'neutral' })}
                      ${insightCard({ eyebrow: 'User Decision', title: entry.decision, body: entry.outcome, tone: 'info' })}
                      ${insightCard({ eyebrow: 'Financial Impact', title: entry.impact, body: entry.confidence, tone: 'good' })}
                      ${insightCard({ eyebrow: 'Scheduled Review', title: entry.reviewDate, body: entry.lessons, tone: 'warn' })}
                    </div>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function weeklyBriefingsView() {
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Weekly Briefings', title: 'Sunday Executive Briefing', body: 'A board-style briefing designed for Sunday mornings.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'pulse', label: 'Business health score', value: String(MOCK_DATA.welcome.score), body: MOCK_DATA.welcome.label })}
            ${statCard({ iconName: 'trending-up', label: 'Revenue', value: '£46.8k', body: 'Ahead of the baseline.' })}
            ${statCard({ iconName: 'coins', label: 'Profit', value: '£11.6k', body: 'Healthy with margin watchpoints.' })}
            ${statCard({ iconName: 'check-circle', label: 'Approval queue', value: '6 items', body: 'Approval-first queue remains visible and deliberate.' })}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'Executive Summary', title: 'Board opening statement', body: MOCK_DATA.weeklyBriefing.summary, tone: 'info' })}
            ${insightCard({ eyebrow: 'Forecasts', title: 'Current outlook', body: 'Revenue forecast £49.5k, profit forecast £12.1k, 30-day closing cash £21.3k.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Wins', title: 'What went well', body: MOCK_DATA.weeklyBriefing.wins.join(' '), tone: 'good' })}
            ${insightCard({ eyebrow: 'Risks', title: 'What needs watching', body: MOCK_DATA.weeklyBriefing.risks.join(' '), tone: 'risk' })}
            ${insightCard({ eyebrow: 'Recommendations', title: 'What to do', body: MOCK_DATA.weeklyBriefing.recommendations.join(' '), tone: 'warn' })}
            ${insightCard({ eyebrow: 'Questions Worth Asking', title: 'The right board questions', body: MOCK_DATA.weeklyBriefing.questions.join(' '), tone: 'neutral' })}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function approvalCentreView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Approval Centre', title: 'Grouped approvals', body: 'The queue is grouped by the kinds of judgment leadership needs to make.' })}
          ${pageQuestions('approval-centre')}
        </section>
        <div class="settings-grid">
          ${Object.entries(MOCK_DATA.approvals)
            .map(
              ([group, entries]) => `
                <section class="panel">
                  ${sectionHeader({ eyebrow: group, title: `${group} approvals` })}
                  <div class="section-stack">
                    ${entries.map((entry) => approvalCard(entry)).join('')}
                  </div>
                </section>
              `
            )
            .join('')}
        </div>
      </div>
    `,
    charts: []
  };
}

function settingsView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Settings', title: 'Prototype controls and future connections', body: 'This page exists to make the future operating model clear before anything live is connected.' })}
          ${pageQuestions('settings')}
          <div class="settings-grid">
            ${['QuickBooks', 'Starling', ...MOCK_DATA.settingsPlaceholders].map((item) => integrationTile(item)).join('')}
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Future integration placeholders', title: 'Connected intelligence sources', body: 'Each item below is intentionally a placeholder for future connection.' })}
          <div class="tile-grid">
            ${MOCK_DATA.integrations.map((item) => integrationTile(item)).join('')}
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Keyboard shortcuts', title: 'Fast navigation', body: 'Designed to make the workspace feel fast and executive-friendly.' })}
          <div class="shortcut-grid">${MOCK_DATA.shortcuts.map((item) => `<div class="command-chip"><strong>${escapeHtml(item.keys)}</strong><span>${escapeHtml(item.action)}</span></div>`).join('')}</div>
        </section>
      </div>
    `,
    charts: []
  };
}

function financialHealthView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Financial Health Score', title: 'Score transparency', body: 'The score is useful because the weighting, movement, and recommendations are visible.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'pulse', label: 'Current score', value: String(MOCK_DATA.welcome.score), body: MOCK_DATA.welcome.label })}
            ${statCard({ iconName: 'pulse', label: 'Previous score', value: String(MOCK_DATA.welcome.previousScore), body: 'Immediate comparison point.' })}
            ${statCard({ iconName: 'trending-up', label: 'Trend', value: MOCK_DATA.welcome.trend, body: 'Higher because cash and growth quality improved.' })}
            ${statCard({ iconName: 'sparkles', label: 'Why it changed', value: 'Cash + growth', body: 'Margin softened slightly, but the broader balance still improved.' })}
          </div>
        </section>
        ${pageQuestions('financial-health')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'KPI Gauge', title: 'Current score gauge', canvasId: 'chart-health-gauge', meta: 'Placeholder gauge using Chart.js.' })}
          ${chartCard({ eyebrow: 'Historical Scores', title: 'Historical score trend', canvasId: 'chart-health-history', meta: 'How the score has evolved over time.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Weighting breakdown', title: 'Why the score looks the way it does' })}
          <div class="tile-grid">${MOCK_DATA.kpis.weights.map((item) => insightCard({ eyebrow: item.weight, title: item.title, body: item.note, tone: 'neutral' })).join('')}</div>
        </section>
      </div>
    `,
    charts: [chartSpec('kpiGauge', 'chart-health-gauge', 'Financial health gauge'), chartSpec('historicalScores', 'chart-health-history', 'Historical score trend')]
  };
}

function opportunityRegisterView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Opportunity Register', title: 'Permanent opportunity register', body: 'Each opportunity is structured for action, not just recorded as an idea.' })}
          ${pageQuestions('opportunity-register')}
          <div class="section-stack">
            ${MOCK_DATA.opportunities
              .map(
                (entry) => registerRow({
                  kicker: `${pill(entry.category, 'info')}${pill(entry.confidence, entry.confidence === 'High' ? 'good' : 'warn')}${pill(entry.strategicPriority, entry.strategicPriority === 'Immediate' ? 'warn' : 'good')}`,
                  title: entry.title,
                  body: entry.description,
                  extra: `
                    <div class="grid-4">
                      ${statCard({ iconName: 'trending-up', label: 'Revenue increase', value: entry.revenueIncrease, body: 'Placeholder estimate.' })}
                      ${statCard({ iconName: 'coins', label: 'Profit increase', value: entry.profitIncrease, body: 'Placeholder estimate.' })}
                      ${statCard({ iconName: 'wallet', label: 'Estimated cost', value: entry.cost, body: 'Execution cost placeholder.' })}
                      ${statCard({ iconName: 'calendar', label: 'Review date', value: entry.reviewDate, body: `Status: ${entry.status}` })}
                    </div>
                  `
                })
              )
              .join('')}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function riskRegisterView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Risk Register', title: 'Permanent risk register', body: 'A living document of business risk, mitigation, trend, and ownership.' })}
          ${pageQuestions('risk-register')}
          <div class="section-stack">
            ${MOCK_DATA.risks
              .map(
                (risk) => registerRow({
                  kicker: `${pill(risk.level, risk.level === 'High' ? 'risk' : 'warn')}${pill(risk.trend, risk.trend === 'Improving' ? 'good' : risk.trend === 'Stable' ? 'neutral' : 'warn')}`,
                  title: risk.impact,
                  body: risk.commentary,
                  extra: `
                    <div class="grid-4">
                      ${statCard({ iconName: 'alert-triangle', label: 'Probability', value: risk.probability, body: 'Placeholder risk probability.' })}
                      ${statCard({ iconName: 'shield', label: 'Mitigation', value: 'Plan active', body: risk.mitigation })}
                      ${statCard({ iconName: 'home', label: 'Owner', value: risk.owner, body: 'Review owner placeholder.' })}
                      ${statCard({ iconName: 'calendar', label: 'Review date', value: risk.reviewDate, body: `Trend: ${risk.trend}` })}
                    </div>
                  `
                })
              )
              .join('')}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function quarterlyReviewView() {
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Quarterly Executive Review', title: 'Prepared board paper', body: 'This page is intended to feel like a professionally prepared executive review rather than a dashboard.' })}
          <div class="grid-3">
            ${insightCard({ eyebrow: 'Business Performance', title: 'Healthy with margin watchpoints', body: 'Growth and cash remain positive, but margin quality deserves close control.', tone: 'info' })}
            ${insightCard({ eyebrow: 'Recommendations Accepted', title: 'Control-focused wins', body: 'Cost restraint and supplier review were the most valuable accepted recommendations.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Lessons Learned', title: 'Small drifts compound fast', body: 'Supplier concentration and discretionary spend drift become strategic issues sooner than expected.', tone: 'warn' })}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'Top Opportunities for Next Quarter', title: 'Collections, supplier terms, premium mix', body: 'These are the clearest routes to improving flexibility and margin quality.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Top Risks for Next Quarter', title: 'Margin softness, timing, and control drift', body: 'If left unchecked, these could erode strategic calm.', tone: 'risk' })}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function boardMeetingView() {
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Board Meeting Mode', title: 'Sunday Executive Briefing', body: 'This mode transforms the workspace into a board conversation rather than a dashboard view.' })}
          <div class="board-hero">
            <div class="summary-banner">
              <div class="hero-title">Leadership briefing for EP Golf Studios</div>
              <p class="hero-summary">This board-focused view is designed to feel like sitting down with the executive team. Instead of pages and widgets, the emphasis is on the business health score, executive summaries, top opportunities, top risks, approvals waiting, and the best questions worth asking this week.</p>
            </div>
            <div class="score-tile">
              <div class="label">Business Health Score</div>
              <strong class="score-value">${MOCK_DATA.welcome.score}</strong>
              <div class="score-note">${escapeHtml(MOCK_DATA.welcome.label)}</div>
            </div>
          </div>
          <div class="board-shell-grid">
            ${insightCard({ eyebrow: 'CEO Executive Summary', title: 'Future integration placeholder', body: 'This will later summarise strategic priorities, major trade-offs, and business direction.', tone: 'neutral' })}
            ${insightCard({ eyebrow: 'CFO Executive Report', title: 'Current financial position', body: MOCK_DATA.weeklyBriefing.summary, tone: 'info' })}
            ${insightCard({ eyebrow: 'CMO Executive Report', title: 'Placeholder', body: 'Future marketing intelligence will explain demand quality, campaign return, and brand momentum.', tone: 'neutral' })}
            ${insightCard({ eyebrow: 'COO Executive Report', title: 'Placeholder', body: 'Future operations intelligence will explain capacity, delivery friction, and execution risk.', tone: 'neutral' })}
          </div>
          <div class="chart-grid board-mode-grid">
            ${insightCard({ eyebrow: 'Top Opportunities', title: MOCK_DATA.opportunities[0].title, body: MOCK_DATA.opportunities[0].description, tone: 'good' })}
            ${insightCard({ eyebrow: 'Top Risks', title: MOCK_DATA.risks[0].impact, body: MOCK_DATA.risks[0].commentary, tone: 'risk' })}
            ${insightCard({ eyebrow: 'Decisions Required', title: '6 approvals waiting', body: 'The approval queue is visible and grouped to preserve control.', tone: 'warn' })}
            ${insightCard({ eyebrow: 'This Week’s Priorities', title: MOCK_DATA.homepage.priorities[0].title, body: MOCK_DATA.homepage.priorities[0].note, tone: 'info' })}
            ${insightCard({ eyebrow: 'Approvals Waiting', title: 'High signal, low noise', body: 'Accounting, invoices, bills, recommendations, and forecast assumptions are all visible in one governed queue.', tone: 'neutral' })}
            ${insightCard({ eyebrow: 'Questions Worth Asking', title: 'Are we protecting flexibility?', body: 'Challenge assumptions around collections, margin, and spend before new commitments are approved.', tone: 'neutral' })}
          </div>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Questions Worth Asking', title: 'Board conversation prompts' })}
            <ul class="board-question-list">${MOCK_DATA.weeklyBriefing.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </section>
        </section>
      </div>
    `,
    charts: []
  };
}

function renderView() {
  if (state.mode === 'board') return boardMeetingView();
  const renderers = {
    workspace: workspaceView,
    revenue: revenueView,
    profit: profitView,
    expenses: expensesView,
    'supplier-spend': supplierSpendView,
    'cash-flow': cashFlowView,
    vat: vatView,
    forecasting: forecastingView,
    'business-kpis': businessKpisView,
    'decision-journal': decisionJournalView,
    'weekly-briefings': weeklyBriefingsView,
    'approval-centre': approvalCentreView,
    settings: settingsView,
    'financial-health': financialHealthView,
    'opportunity-register': opportunityRegisterView,
    'risk-register': riskRegisterView,
    'quarterly-review': quarterlyReviewView
  };
  return (renderers[state.page] || workspaceView)();
}

function attachPageEvents() {
  pageContent.querySelectorAll('[data-metric]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeMetric = button.dataset.metric;
      render();
    });
  });

  pageContent.querySelectorAll('[data-quick-page]').forEach((button) => {
    button.addEventListener('click', () => setPage(button.dataset.quickPage));
  });

  pageContent.querySelectorAll('.follow-up-chip').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeQuestion = 0;
      const question = button.dataset.followUp || '';
      openCommandPalette(question);
    });
  });

  pageContent.querySelectorAll('.supplier-link').forEach((button) => {
    button.addEventListener('click', () => {
      const supplier = MOCK_DATA.suppliers.find((item) => item.id === button.dataset.supplier);
      if (!supplier) return;
      const holder = document.createElement('div');
      holder.className = 'drilldown-card';
      holder.innerHTML = `${sectionHeader({ eyebrow: 'Supplier drill-down placeholder', title: supplier.name, body: 'This placeholder will later expand into invoice history, term analysis, payment timing, and margin contribution intelligence.' })}${insightCard({ eyebrow: 'Future view', title: 'Supplier drill-down page', body: 'Will include invoice history, term changes, category contribution, and AI supplier commentary.', tone: 'info' })}`;
      button.replaceWith(holder);
    });
  });

  const search = document.getElementById('journal-search');
  if (search) {
    search.addEventListener('input', (event) => {
      state.journalQuery = event.target.value;
      render();
    });
  }

  pageContent.querySelectorAll('.quick-action-button').forEach((button) => {
    button.addEventListener('click', () => openCommandPalette(button.textContent.trim()));
  });
}

function renderCommandPalette() {
  const query = state.commandQuery.trim().toLowerCase();
  const pages = [...NAV_PRIMARY, ...NAV_SECONDARY]
    .map(([id, label, iconName]) => ({ id, label, iconName, type: 'Page' }))
    .concat(MOCK_DATA.homepage.quickActions.map((label) => ({ id: 'workspace', label, iconName: 'sparkles', type: 'Action' })));

  const filtered = pages.filter((item) => item.label.toLowerCase().includes(query));

  paletteResults.innerHTML = filtered
    .map(
      (item) => `
        <button type="button" class="command-result" data-command-page="${item.id}">
          <span class="card-kicker">${icon(item.iconName)}<span>${escapeHtml(item.label)}</span></span>
          <small>${escapeHtml(item.type)}</small>
        </button>
      `
    )
    .join('');

  paletteResults.querySelectorAll('[data-command-page]').forEach((button) => {
    button.addEventListener('click', () => {
      closeCommandPalette();
      setMode('workspace');
      setPage(button.dataset.commandPage);
    });
  });
}

function openCommandPalette(prefill = '') {
  state.commandOpen = true;
  state.commandQuery = prefill;
  paletteBackdrop.classList.remove('hidden');
  paletteBackdrop.setAttribute('aria-hidden', 'false');
  paletteInput.value = prefill;
  renderCommandPalette();
  setTimeout(() => paletteInput.focus(), 0);
}

function closeCommandPalette() {
  state.commandOpen = false;
  paletteBackdrop.classList.add('hidden');
  paletteBackdrop.setAttribute('aria-hidden', 'true');
}

function attachGlobalEvents() {
  navSearch.value = state.navQuery;
  navSearch.addEventListener('input', (event) => {
    state.navQuery = event.target.value;
    renderSidebar();
  });

  sidebarToggle.addEventListener('click', () => {
    if (window.innerWidth <= 1080) {
      state.sidebarOpen = !state.sidebarOpen;
      appShell.classList.toggle('sidebar-open', state.sidebarOpen);
    } else {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      appShell.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
      saveState();
    }
  });

  themeToggle.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'midnight' : 'dark'));
  commandLauncher.addEventListener('click', () => openCommandPalette());
  paletteClose.addEventListener('click', closeCommandPalette);
  paletteBackdrop.addEventListener('click', (event) => {
    if (event.target === paletteBackdrop) closeCommandPalette();
  });
  paletteInput.addEventListener('input', (event) => {
    state.commandQuery = event.target.value;
    renderCommandPalette();
  });

  document.addEventListener('keydown', (event) => {
    const isMetaK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    if (isMetaK) {
      event.preventDefault();
      openCommandPalette();
      return;
    }
    if (event.key === '/' && document.activeElement !== paletteInput && document.activeElement !== navSearch) {
      event.preventDefault();
      navSearch.focus();
      return;
    }
    if (event.key.toLowerCase() === 'b' && !event.metaKey && !event.ctrlKey) {
      setMode('board', { withLoading: true });
      return;
    }
    if (event.key.toLowerCase() === 'w' && !event.metaKey && !event.ctrlKey) {
      setMode('workspace', { withLoading: true });
      return;
    }
    if (event.key === 'Escape') {
      closeCommandPalette();
      if (window.innerWidth <= 1080) {
        state.sidebarOpen = false;
        appShell.classList.remove('sidebar-open');
      }
    }
  });
}

function render() {
  destroyCharts();
  appShell.classList.toggle('sidebar-collapsed', state.sidebarCollapsed && window.innerWidth > 1080);
  appShell.classList.toggle('sidebar-open', state.sidebarOpen && window.innerWidth <= 1080);
  renderSidebar();
  renderTopbar();
  const view = renderView();
  pageContent.innerHTML = view.html;
  attachPageEvents();
  renderCharts(view.charts);
  pageContent.focus();
}

let skeletonTimer;
function renderWithSkeleton() {
  clearTimeout(skeletonTimer);
  destroyCharts();
  pageContent.innerHTML = loadingSkeleton();
  skeletonTimer = setTimeout(() => render(), 140);
}

function validateStartup() {
  const required = [primaryNav, secondaryNav, pageContent, modeSwitcher];
  if (required.some((node) => !node)) {
    throw new Error('EP Intelligence failed to initialise required DOM nodes.');
  }
}

function bootstrap() {
  validateStartup();
  loadState();
  loadFromUrl();
  attachGlobalEvents();
  setTheme(state.theme);
  renderWithSkeleton();
}

bootstrap();
