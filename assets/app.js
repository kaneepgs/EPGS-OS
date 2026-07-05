import { TOP_LEVEL_NAV, SUBNAV, MODE_OPTIONS, ROUTE_META, QUESTION_SETS, MOCK_DATA } from './data/mock-data.js';
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

const STORAGE_KEY = 'ep-intelligence.workspace.v0.5a';
const VALID_ROUTES = new Set(Object.keys(ROUTE_META));

const appShell = document.getElementById('app-shell');
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
  route: '/ceo',
  theme: 'dark',
  navQuery: '',
  commandQuery: '',
  commandOpen: false,
  sidebarCollapsed: false,
  sidebarOpen: false,
  activeMetric: 'revenue',
  journalQuery: '',
  favourites: ['/ceo', '/cfo', '/reports/board-meeting'],
  recent: ['/ceo', '/cfo', '/approvals']
};

let skeletonTimer;
let keySequence = '';
let keySequenceTimer = null;

function metaFor(route = state.route) {
  return ROUTE_META[route] || ROUTE_META['/ceo'];
}

function topLevelKey(route = state.route) {
  const meta = metaFor(route);
  return meta.sidebarKey;
}

function currentSubnav() {
  const key = topLevelKey();
  if (key === '/cfo') return SUBNAV.cfo;
  if (key === '/reports') return SUBNAV.reports;
  if (key === '/ai-assistant') return SUBNAV.aiAssistant;
  return [];
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      route: state.route,
      theme: state.theme,
      sidebarCollapsed: state.sidebarCollapsed,
      favourites: state.favourites,
      recent: state.recent
    })
  );
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
  } catch {}
}

function syncUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set('route', state.route);
  history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const route = params.get('route');
  if (route && VALID_ROUTES.has(route)) state.route = route;
  if (params.get('nav') === 'open') state.sidebarOpen = true;
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

function updateRecent(route) {
  state.recent = [route, ...state.recent.filter((item) => item !== route)].slice(0, 8);
}

function setRoute(route, { withLoading = true } = {}) {
  if (!VALID_ROUTES.has(route)) route = '/ceo';
  state.route = route;
  updateRecent(route);
  saveState();
  syncUrl();
  if (window.innerWidth <= 1080) {
    state.sidebarOpen = false;
    appShell.classList.remove('sidebar-open');
  }
  withLoading ? renderWithSkeleton() : render();
}

function toggleFavourite(route) {
  if (state.favourites.includes(route)) {
    state.favourites = state.favourites.filter((item) => item !== route);
  } else {
    state.favourites = [route, ...state.favourites].slice(0, 8);
  }
  saveState();
  renderSidebarMeta();
}

function isRouteActive(route) {
  return state.route === route;
}

function visibleTopLevelRoutes() {
  return TOP_LEVEL_NAV.filter(([, label]) => label.toLowerCase().includes(state.navQuery.toLowerCase()));
}

function breadcrumbParts(route = state.route) {
  const meta = metaFor(route);
  const parts = ['EP Intelligence'];
  if (meta.parentLabel && meta.parentLabel !== meta.title) parts.push(meta.parentLabel);
  parts.push(meta.title);
  return parts;
}

function routeLabel(route) {
  return metaFor(route).title;
}

function routeMode() {
  return state.route === '/reports/board-meeting' ? 'board' : 'executive';
}

function renderModeSwitcher() {
  modeSwitcher.innerHTML = MODE_OPTIONS.map(([value, label, route]) => {
    const active = routeMode() === value;
    return `<button type="button" class="mode-button ${active ? 'active' : ''}" data-mode-route="${route}" role="tab" aria-selected="${String(active)}">${escapeHtml(label)}</button>`;
  }).join('');

  modeSwitcher.querySelectorAll('[data-mode-route]').forEach((button) => {
    button.addEventListener('click', () => setRoute(button.dataset.modeRoute));
  });
}

function renderTopbar() {
  const meta = metaFor();
  breadcrumbNode.innerHTML = breadcrumb(breadcrumbParts());
  pageTitle.textContent = meta.title;
  pageSubtitle.textContent = meta.subtitle;
  document.title = `EP Intelligence — ${meta.title}`;
  sidebarToggle.innerHTML = icon('menu');
  commandLauncher.innerHTML = `${icon('command')}<span class="command-hint">Ctrl/Cmd + K</span>`;
  paletteClose.innerHTML = icon('chevronLeft');
  renderModeSwitcher();
  updateThemeButton();
}

function renderSidebarMeta() {
  sidebarFavourites.innerHTML = state.favourites
    .filter((route) => VALID_ROUTES.has(route))
    .map((route) => `<button type="button" class="sidebar-chip" data-route="${route}">${icon('star')}${escapeHtml(routeLabel(route))}</button>`)
    .join('');

  sidebarRecent.innerHTML = state.recent
    .filter((route) => VALID_ROUTES.has(route))
    .map((route) => `<button type="button" class="sidebar-chip" data-route="${route}">${icon('arrowRight')}${escapeHtml(routeLabel(route))}</button>`)
    .join('');
}

function renderSidebar() {
  const visible = visibleTopLevelRoutes();
  primaryNav.innerHTML = visible
    .map(([route, label, iconName]) => navLink({ id: route, label, iconName, active: topLevelKey() === route, favourite: state.favourites.includes(route) }))
    .join('');

  const subnav = currentSubnav();
  secondaryNav.innerHTML = subnav.length
    ? `<div class="label">${escapeHtml(metaFor().parentLabel || metaFor().module)} pages</div>${subnav
        .map(([route, label]) => navLink({ id: route, label, iconName: 'arrowRight', active: isRouteActive(route), favourite: state.favourites.includes(route) }))
        .join('')}`
    : '';

  renderSidebarMeta();

  document.querySelectorAll('[data-page], [data-route]').forEach((node) => {
    const route = node.dataset.page || node.dataset.route;
    if (!route || !VALID_ROUTES.has(route)) return;
    node.addEventListener('click', (event) => {
      event.preventDefault();
      setRoute(route);
    });
  });
}

function chartSpec(key, canvasId, label = '') {
  return { id: canvasId, label, ...MOCK_DATA.cfo.charts[key] };
}

function renderRoutePillbar(items) {
  return `<div class="page-pillbar">${items
    .map(([route, label]) => `<button type="button" class="chip-button" data-route="${route}">${state.route === route ? icon('check-circle') : icon('arrowRight')}${escapeHtml(label)}</button>`)
    .join('')}</div>`;
}

function pageQuestions(route = state.route) {
  const set = QUESTION_SETS[route];
  const fallback = {
    what: ['The module will surface what changed', `The ${metaFor(route).module} module will explain the most important movement in this area.`],
    why: ['It will explain why those changes happened', 'The goal is to connect performance movement to evidence and operating context rather than isolated metrics.'],
    matters: ['It will show whether it matters', 'Executive time is limited, so the module should separate noise from real strategic relevance.'],
    next: ['It will stage what to do next', 'The output should always help leadership decide what to approve, challenge, or prioritise next.']
  };
  const q = set || fallback;
  return `
    <section class="panel">
      ${sectionHeader({ eyebrow: 'Executive Intelligence', title: 'The four questions this page answers' })}
      <div class="executive-question-grid">
        ${executiveQuestionCard({ question: 'What happened?', title: q.what[0], body: q.what[1] })}
        ${executiveQuestionCard({ question: 'Why did it happen?', title: q.why[0], body: q.why[1] })}
        ${executiveQuestionCard({ question: 'Does it matter?', title: q.matters[0], body: q.matters[1] })}
        ${executiveQuestionCard({ question: 'What should I do next?', title: q.next[0], body: q.next[1] })}
      </div>
    </section>
  `;
}

function attachPageEvents() {
  pageContent.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => setRoute(button.dataset.route));
  });

  pageContent.querySelectorAll('[data-favourite-route]').forEach((button) => {
    button.addEventListener('click', () => toggleFavourite(button.dataset.favouriteRoute));
  });

  pageContent.querySelectorAll('[data-metric]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeMetric = button.dataset.metric;
      render();
    });
  });

  pageContent.querySelectorAll('.follow-up-chip').forEach((button) => {
    button.addEventListener('click', () => openCommandPalette(button.dataset.followUp || button.textContent.trim()));
  });

  pageContent.querySelectorAll('.supplier-link').forEach((button) => {
    button.addEventListener('click', () => {
      const supplier = MOCK_DATA.cfo.suppliers.find((item) => item.id === button.dataset.supplier);
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
}

function renderCommandPalette() {
  const query = state.commandQuery.trim().toLowerCase();
  const routes = Object.entries(ROUTE_META)
    .map(([route, meta]) => ({ route, title: meta.title, module: meta.module }))
    .filter((item) => [item.route, item.title, item.module].join(' ').toLowerCase().includes(query));

  paletteResults.innerHTML = routes
    .map(
      (item) => `
        <button type="button" class="command-result" data-route="${item.route}">
          <span class="card-kicker">${icon('arrowRight')}<span>${escapeHtml(item.title)}</span></span>
          <small>${escapeHtml(item.module)}</small>
        </button>
      `
    )
    .join('');

  paletteResults.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => {
      closeCommandPalette();
      setRoute(button.dataset.route);
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

function queueKey(key) {
  keySequence += key;
  clearTimeout(keySequenceTimer);
  keySequenceTimer = setTimeout(() => {
    keySequence = '';
  }, 900);

  if (keySequence === 'gc') {
    keySequence = '';
    setRoute('/ceo');
  }
  if (keySequence === 'gf') {
    keySequence = '';
    setRoute('/cfo');
  }
  if (keySequence === 'gr') {
    keySequence = '';
    setRoute('/reports');
  }
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
    if (event.key === 'Escape') {
      closeCommandPalette();
      if (window.innerWidth <= 1080) {
        state.sidebarOpen = false;
        appShell.classList.remove('sidebar-open');
      }
      return;
    }
    if (!event.metaKey && !event.ctrlKey && !event.altKey) {
      queueKey(event.key.toLowerCase());
    }
  });
}

function ceoDashboardView() {
  const data = MOCK_DATA.ceo;
  return {
    html: `
      <div class="page-grid">
        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">CEO Dashboard</div>
              <div class="hero-title">EP Intelligence now opens at the leadership shell.</div>
              <p class="hero-summary">${escapeHtml(data.summary)}</p>
            </section>
            <section class="snapshot-grid">
              ${data.businessHealth.map((item) => statCard({ iconName: item.icon, label: item.label, value: item.value, body: item.body })).join('')}
            </section>
          </div>
          <div class="hero-side">
            <section class="score-panel">
              <div class="score-tile">
                <div class="label">Business Health Score</div>
                <strong class="score-value">${data.score}</strong>
                <div class="score-note">${escapeHtml(data.trend)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">What changed</div>
                <h3>${escapeHtml(data.label)}</h3>
                <p>Revenue, cash, and execution quality remain strong enough for calm leadership. The biggest decisions now are around timing, discipline, and approvals.</p>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Today’s Priorities', title: 'What needs attention today', body: 'The CEO home view is designed to separate important signals from background noise.' })}
          <div class="grid-3">
            ${data.todayPriorities.map((item, index) => priorityCard({ index: index + 1, title: item.title, body: item.note, tone: item.tone })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Cross-business snapshots', title: 'What changed across the business', body: 'These are deliberately high-level so leadership can decide where to go deeper next.' })}
          <div class="grid-3">
            ${data.snapshots.map((item) => statCard({ iconName: item.icon, label: item.label, value: item.value, body: item.body })).join('')}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Key Risks', title: 'What could hurt confidence', body: 'Current watchpoints are known, visible, and manageable.' })}
            <div class="section-stack">${data.risks.map((item) => insightCard({ eyebrow: 'Risk', title: item, body: 'Executive attention required only if it remains unresolved or starts compounding.', tone: 'risk' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Key Opportunities', title: 'Where the leverage is', body: 'The best opportunities are clear enough to guide leadership attention now.' })}
            <div class="section-stack">${data.opportunities.map((item) => insightCard({ eyebrow: 'Opportunity', title: item, body: 'A future module or approval route will eventually turn this into a more actionable executive workflow.', tone: 'good' })).join('')}</div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Pending Approvals', title: 'Open decisions', body: 'Approvals are now grouped business-wide rather than living only inside finance.' })}
            <div class="section-stack">
              ${data.approvalsPreview.map((item) => insightCard({ eyebrow: 'Pending approval', title: item, body: 'Everything remains staged for human review only.', tone: 'warn' })).join('')}
              <button type="button" class="quick-action-button" data-route="/approvals">Open central Approvals ${icon('arrowRight')}</button>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Weekly Summary Preview', title: 'Sunday summary preview', body: 'Reporting now sits in a shared Reports section inside the broader shell.' })}
            <div class="snapshot-panel">
              <h3>${escapeHtml(data.weeklySummaryPreview.headline)}</h3>
              <p>${escapeHtml(data.weeklySummaryPreview.body)}</p>
              <button type="button" class="quick-action-button" data-route="/reports/weekly-briefings">Open Weekly Briefings ${icon('arrowRight')}</button>
            </div>
          </section>
        </div>

        ${commentaryCard({ title: data.aiBriefing.title, data: data.aiBriefing })}

        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Revenue Snapshot', title: 'Revenue trend', canvasId: 'chart-ceo-revenue', meta: 'Shared placeholder trend used at the shell level.' })}
          ${chartCard({ eyebrow: 'Business Health Score', title: 'Score history', canvasId: 'chart-ceo-health', meta: 'A quick historic view for the executive home.' })}
          <section class="chart-card">
            <div class="panel-heading compact"><div><div class="eyebrow">What should I do next?</div><h4>Recommended next step</h4></div></div>
            <div class="snapshot-panel">
              <h3>Open CFO, Approvals, or Reports</h3>
              <p>The shell is designed to help leadership move quickly from overview into the module or report that best supports the next decision.</p>
              <div class="page-pillbar">
                <button type="button" class="chip-button" data-route="/cfo">${icon('coins')}Open CFO</button>
                <button type="button" class="chip-button" data-route="/approvals">${icon('check-circle')}Open Approvals</button>
                <button type="button" class="chip-button" data-route="/reports">${icon('presentation')}Open Reports</button>
              </div>
            </div>
          </section>
        </div>

        ${pageQuestions('/ceo')}
      </div>
    `,
    charts: [chartSpec('revenueTrend', 'chart-ceo-revenue', 'Revenue trend'), chartSpec('historicalScores', 'chart-ceo-health', 'Business health score history')]
  };
}

function cfoHomeView() {
  const data = MOCK_DATA.cfo;
  const activeMetric = data.metrics.find((metric) => metric.key === state.activeMetric) || data.metrics[0];
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Finance now lives as one module inside EP Intelligence', body: 'The CFO Workspace remains fully functional, but now sits inside the wider CEO-led operating system.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
        </section>

        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">${escapeHtml(data.welcome.greeting)}</div>
              <div class="hero-title">${escapeHtml(data.welcome.title)}</div>
              <p class="hero-summary">${escapeHtml(data.welcome.summary)}</p>
            </section>
            <section class="snapshot-grid">
              ${statCard({ iconName: 'trending-up', label: 'Revenue Summary', value: data.welcome.snapshot.revenue, body: 'Demand remains strong with premium conversion holding up.' })}
              ${statCard({ iconName: 'coins', label: 'Profit Summary', value: data.welcome.snapshot.profit, body: 'Profit is solid, though slightly softer than last month.' })}
              ${statCard({ iconName: 'wallet', label: 'Cash Position', value: data.welcome.snapshot.cash, body: 'Healthy enough for calm decision-making under current assumptions.' })}
              ${statCard({ iconName: 'check-circle', label: 'Recent Approvals', value: data.welcome.snapshot.approvals, body: 'All material actions remain staged for explicit review.' })}
            </section>
          </div>
          <div class="hero-side">
            <section class="score-panel">
              <div class="score-tile">
                <div class="label">Financial Health Score</div>
                <strong class="score-value">${data.welcome.score}</strong>
                <div class="score-note">${escapeHtml(data.welcome.trend)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">Business Snapshot</div>
                <h3>${escapeHtml(data.welcome.label)}</h3>
                <p>${escapeHtml(data.welcome.narrative)}</p>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: data.workspace.banner.title, title: 'Today’s priorities', body: 'A curated executive finance view of what deserves attention before anything else.' })}
          <div class="grid-3">
            ${data.workspace.priorities.map((item, index) => priorityCard({ index: index + 1, title: item.title, body: item.note, tone: item.tone })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Workspace summary', title: 'Executive cards', body: 'Use these as fast launchpads into the most important finance pages.' })}
          <div class="metric-grid">
            ${data.metrics.map((metric) => metricCard({ key: metric.key, label: metric.label, value: metric.value, trend: metric.trend, iconName: metric.key === 'revenue' ? 'trending-up' : metric.key === 'profit' ? 'coins' : metric.key === 'cash' ? 'wallet' : metric.key === 'supplier' ? 'building' : 'grid', active: metric.key === state.activeMetric })).join('')}
          </div>
          <div class="metric-detail">
            <div class="label">Selected CFO readout</div>
            <h4>${escapeHtml(activeMetric.label)}</h4>
            <p>${escapeHtml(activeMetric.detail)}</p>
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Weekly Briefing Preview', title: 'Sunday executive summary', body: 'The full output now lives in Reports, but remains accessible from finance.' })}
            <div class="snapshot-panel">
              <h3>${escapeHtml(data.weeklyBriefing.summary)}</h3>
              <ul class="briefing-list">${data.weeklyBriefing.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
              <button type="button" class="quick-action-button" data-route="/reports/weekly-briefings">Open weekly briefing ${icon('arrowRight')}</button>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Business Snapshot', title: 'What the CFO wants you to remember' })}
            <div class="snapshot-panel">
              <ul class="mini-list">${data.workspace.businessSnapshot.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
          </section>
        </div>

        ${commentaryCard({ title: data.commentary.workspace.title, data: data.commentary.workspace })}
        ${pageQuestions('/cfo')}
      </div>
    `,
    charts: []
  };
}

function cfoRevenueView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Revenue performance and collection quality', body: 'Every revenue number is paired with context about quality, timing, and strategic usefulness.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="grid-4">
            ${statCard({ iconName: 'trending-up', label: 'Revenue this month', value: '£46.8k', body: 'Ahead of plan with healthier premium conversion.' })}
            ${statCard({ iconName: 'calendar', label: 'Revenue by month', value: '7 months tracked', body: 'Steady progression in placeholder monthly trend.' })}
            ${statCard({ iconName: 'wallet', label: 'Revenue vs last year', value: '+14.2%', body: 'Growth is positive without obvious discount-led distortion.' })}
            ${statCard({ iconName: 'sparkles', label: 'Revenue forecast', value: MOCK_DATA.cfo.forecasts.revenue, body: 'Forecast stays constructive under current assumptions.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/revenue')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Revenue Trends', title: 'Revenue trend chart', canvasId: 'chart-revenue-trend', meta: 'Interactive placeholder data using Chart.js.' })}
          ${chartCard({ eyebrow: 'Payment mix', title: 'Revenue by payment method', canvasId: 'chart-payment-methods', meta: 'Card, transfer, finance, and cash mix.' })}
          ${chartCard({ eyebrow: 'Invoice status', title: 'Revenue by invoice status', canvasId: 'chart-invoice-status', meta: 'Paid, pending, and overdue profile.' })}
        </div>
        ${commentaryCard({ title: MOCK_DATA.cfo.commentary.revenue.title, data: MOCK_DATA.cfo.commentary.revenue })}
      </div>
    `,
    charts: [chartSpec('revenueTrend', 'chart-revenue-trend', 'Revenue trend'), chartSpec('paymentMethods', 'chart-payment-methods', 'Payment method mix'), chartSpec('invoiceStatus', 'chart-invoice-status', 'Invoice status mix')]
  };
}

function cfoProfitView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Margin quality and profitability', body: 'Profit should feel like an executive conversation about leverage and trade-offs.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="grid-4">
            ${statCard({ iconName: 'coins', label: 'Gross profit', value: '£24.1k', body: 'Strong, but pressured by higher supplier costs.' })}
            ${statCard({ iconName: 'coins', label: 'Net profit', value: '£11.6k', body: 'Still healthy, though softer than last month.' })}
            ${statCard({ iconName: 'grid', label: 'Gross margin', value: '51.5%', body: 'Should improve if supplier terms tighten.' })}
            ${statCard({ iconName: 'grid', label: 'Net margin', value: '24.8%', body: 'A solid level for the current growth stage.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/profit')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Monthly Profit', title: 'Profit trend', canvasId: 'chart-profit', meta: 'Interactive monthly profit trend.' })}
          ${chartCard({ eyebrow: 'Cost Centres', title: 'Biggest cost centres', canvasId: 'chart-profit-costs', meta: 'Shows where profitability pressure originates.' })}
          <section class="chart-card">
            <div class="panel-heading compact"><div><div class="eyebrow">Recommendations</div><h4>Ways to improve profitability</h4></div></div>
            <div class="section-stack">
              ${insightCard({ eyebrow: 'Recommendation', title: 'Renegotiate one major supplier', body: 'Potential £1.2k monthly margin improvement with limited disruption.', tone: 'good' })}
              ${insightCard({ eyebrow: 'Recommendation', title: 'Reduce low-yield discretionary costs', body: 'Protects net profit without reducing meaningful growth activity.', tone: 'warn' })}
              ${insightCard({ eyebrow: 'Recommendation', title: 'Review premium service mix', body: 'Improving mix may widen margin faster than chasing raw volume.', tone: 'info' })}
            </div>
          </section>
        </div>
        ${commentaryCard({ title: MOCK_DATA.cfo.commentary.profit.title, data: MOCK_DATA.cfo.commentary.profit })}
      </div>
    `,
    charts: [chartSpec('monthlyProfit', 'chart-profit', 'Monthly profit trend'), { id: 'chart-profit-costs', type: 'bar', labels: ['Suppliers', 'Support', 'Rent', 'Software'], values: [42, 23, 19, 16], label: 'Cost centre mix', suffix: '%' }]
  };
}

function cfoExpensesView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Operating cost discipline', body: 'Expense visibility is only useful when it improves judgment about what to keep, reduce, or challenge.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="grid-4">
            ${statCard({ iconName: 'receipt', label: 'Monthly expenses', value: '£24.9k', body: 'Still manageable, but visibly rising.' })}
            ${statCard({ iconName: 'grid', label: 'Fixed vs variable', value: '58 / 42', body: 'Variable lines deserve the most attention.' })}
            ${statCard({ iconName: 'settings', label: 'Software subscriptions', value: '£1.4k', body: 'Stable, but worth future overlap review.' })}
            ${statCard({ iconName: 'building', label: 'Largest expenses', value: 'Inventory & supply', body: 'Supplier-linked costs remain the dominant driver.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/expenses')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Expense trend', title: 'Monthly expenses', canvasId: 'chart-expenses', meta: 'Interactive monthly trend.' })}
          ${chartCard({ eyebrow: 'Categories', title: 'Expense categories', canvasId: 'chart-expense-categories', meta: 'Share of total expense by category.' })}
        </div>
        ${commentaryCard({ title: MOCK_DATA.cfo.commentary.expenses.title, data: MOCK_DATA.cfo.commentary.expenses })}
      </div>
    `,
    charts: [chartSpec('expenseTrend', 'chart-expenses', 'Expense trend'), chartSpec('expenseCategories', 'chart-expense-categories', 'Expense categories')]
  };
}

function cfoSupplierView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Supplier leverage, concentration, and risk', body: 'One of the strongest pages in the prototype because supplier behaviour affects both margin and cash quality.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="grid-4">
            ${statCard({ iconName: 'building', label: 'Spend this month', value: '£17.7k', body: 'Concentrated in a small number of critical relationships.' })}
            ${statCard({ iconName: 'building', label: 'Spend year-to-date', value: '£89.8k', body: 'Running ahead of the placeholder prior-year pace.' })}
            ${statCard({ iconName: 'building', label: 'Spend last year', value: '£75.1k', body: 'Reference point for YoY control.' })}
            ${statCard({ iconName: 'trending-up', label: 'Year-on-year', value: '+19.6%', body: 'Higher than comfort if gross margin does not keep pace.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/supplier-spend')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Supplier Spend', title: 'Monthly trend', canvasId: 'chart-supplier-trend', meta: 'Interactive placeholder monthly supplier spend.' })}
          ${chartCard({ eyebrow: 'Categories', title: 'Top spending categories', canvasId: 'chart-supplier-categories', meta: 'Where supplier cash outflow is concentrated.' })}
          ${chartCard({ eyebrow: 'Risk indicator', title: 'Supplier risk indicator', canvasId: 'chart-supplier-risk', meta: 'Low, medium, and high-risk mix.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Top suppliers', title: 'Supplier drill-down placeholders', body: 'Every supplier includes a future drill-down placeholder.' })}
          <div class="tile-grid">${MOCK_DATA.cfo.suppliers.map((supplier) => supplierCard(supplier)).join('')}</div>
        </section>
        ${commentaryCard({ title: MOCK_DATA.cfo.commentary.suppliers.title, data: MOCK_DATA.cfo.commentary.suppliers })}
      </div>
    `,
    charts: [chartSpec('supplierTrend', 'chart-supplier-trend', 'Supplier monthly spend'), { id: 'chart-supplier-categories', type: 'doughnut', labels: ['Launch Monitors', 'Retail Stock', 'Subscriptions', 'Consumables'], values: [39, 29, 19, 13], label: 'Supplier categories', suffix: '%' }, { id: 'chart-supplier-risk', type: 'bar', labels: ['Low', 'Medium', 'High'], values: [34, 52, 14], label: 'Risk indicator', suffix: '%' }]
  };
}

function cfoCashView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Liquidity, runway, and timing confidence', body: 'Cash should feel like a strategic narrative rather than a number trapped in a ledger.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="grid-4">
            ${statCard({ iconName: 'wallet', label: 'Cash balance', value: '£28.1k', body: 'Healthy current position with short-term flexibility.' })}
            ${statCard({ iconName: 'trending-up', label: 'Cash inflow', value: '£44.6k', body: 'Strong enough to support current plans.' })}
            ${statCard({ iconName: 'receipt', label: 'Cash outflow', value: '£37.2k', body: 'Manageable, but requires sequencing discipline.' })}
            ${statCard({ iconName: 'sparkles', label: 'Cash runway', value: '5.4 months', body: 'Comfortable under current placeholder assumptions.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/cash-flow')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Cash Flow', title: '30/60/90 day forecast', canvasId: 'chart-cash-flow', meta: 'Interactive placeholder forecast.' })}
          ${chartCard({ eyebrow: 'Risk analysis', title: 'Cash flow sensitivity', canvasId: 'chart-cash-risk', meta: 'Which factors most affect confidence in the view.' })}
        </div>
        ${commentaryCard({ title: MOCK_DATA.cfo.commentary.cash.title, data: MOCK_DATA.cfo.commentary.cash })}
      </div>
    `,
    charts: [chartSpec('cashFlow', 'chart-cash-flow', 'Cash flow forecast'), { id: 'chart-cash-risk', type: 'bar', labels: ['Collections', 'Supplier timing', 'Discretionary spend', 'Tax timing'], values: [38, 29, 17, 16], label: 'Cash risk', suffix: '%' }]
  };
}

function cfoVatView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'VAT position and confidence', body: 'VAT should feel governed and explainable, not like a surprise waiting at the edge of the month.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="grid-4">
            ${statCard({ iconName: 'shield', label: 'Current VAT estimate', value: '£4.8k', body: 'Provisioned in the current cash plan.' })}
            ${statCard({ iconName: 'calendar', label: 'Upcoming payment', value: '£4.6k', body: 'Timing remains manageable under current assumptions.' })}
            ${statCard({ iconName: 'grid', label: 'Historical VAT', value: '£4.1k avg', body: 'Recent settlement range in the demo environment.' })}
            ${statCard({ iconName: 'sparkles', label: 'Forecast VAT', value: '£5.0k', body: 'Assumes broadly similar trading pattern continues.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/vat')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'VAT History', title: 'Historical VAT trend', canvasId: 'chart-vat', meta: 'Quarterly placeholder VAT history.' })}
          ${chartCard({ eyebrow: 'KPI Gauge', title: 'VAT confidence gauge', canvasId: 'chart-vat-gauge', meta: 'Proxy for confidence rather than a direct liability measure.' })}
        </div>
        ${commentaryCard({ title: MOCK_DATA.cfo.commentary.vat.title, data: MOCK_DATA.cfo.commentary.vat })}
      </div>
    `,
    charts: [chartSpec('vatHistory', 'chart-vat', 'VAT history'), chartSpec('kpiGauge', 'chart-vat-gauge', 'VAT confidence gauge')]
  };
}

function cfoForecastingView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Executive forecasting workspace', body: 'Use this page to challenge assumptions and model choices, not to seek false precision.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="grid-4">
            ${statCard({ iconName: 'trending-up', label: 'Revenue forecast', value: MOCK_DATA.cfo.forecasts.revenue, body: 'Assumes healthy demand and stable booking conversion.' })}
            ${statCard({ iconName: 'coins', label: 'Profit forecast', value: MOCK_DATA.cfo.forecasts.profit, body: 'Depends on stabilising supplier cost growth.' })}
            ${statCard({ iconName: 'wallet', label: 'Cash forecast', value: MOCK_DATA.cfo.forecasts.cash, body: 'Requires collections to normalise on time.' })}
            ${statCard({ iconName: 'sparkles', label: 'Investment modelling', value: 'Placeholder', body: 'Reserved for future capital and equipment decision models.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/forecasting')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Financial Forecast', title: 'Scenario comparison', canvasId: 'chart-forecast', meta: 'Base, conservative, and upside scenarios.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'What if…', title: 'Scenario planning placeholders', body: 'A forecasting workspace should feel like a thinking environment rather than a static report.' })}
          <div class="tile-grid">${MOCK_DATA.cfo.forecasts.scenarios.map((item) => insightCard({ eyebrow: 'Scenario', title: item.title, body: item.body, tone: 'neutral' })).join('')}</div>
        </section>
        ${commentaryCard({ title: MOCK_DATA.cfo.commentary.forecasting.title, data: MOCK_DATA.cfo.commentary.forecasting })}
      </div>
    `,
    charts: [chartSpec('financialForecast', 'chart-forecast', 'Forecast scenario comparison')]
  };
}

function cfoBusinessKpisView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Connected KPI framework', body: 'KPIs are grouped by the questions they help answer, not by accounting table structure.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="section-stack">
            ${MOCK_DATA.cfo.kpis.groups
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
        ${pageQuestions('/cfo/business-kpis')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'KPI Gauge', title: 'Financial Health Score breakdown', canvasId: 'chart-kpi-gauge', meta: 'Weighted gauge of current business health.' })}
          ${chartCard({ eyebrow: 'Historical Scores', title: 'Score history', canvasId: 'chart-score-history', meta: 'How the score has moved over time.' })}
        </div>
      </div>
    `,
    charts: [chartSpec('kpiGauge', 'chart-kpi-gauge', 'Health score gauge'), chartSpec('historicalScores', 'chart-score-history', 'Historical scores')]
  };
}

function cfoDecisionJournalView() {
  const query = state.journalQuery.trim().toLowerCase();
  const filtered = MOCK_DATA.cfo.decisionJournal.filter((entry) => {
    if (!query) return true;
    return [entry.id, entry.recommendation, entry.reasoning, entry.decision, entry.outcome, entry.status].join(' ').toLowerCase().includes(query);
  });

  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Searchable executive timeline', body: 'The platform should learn from decisions and outcomes, not just store them.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          ${searchRow({ value: state.journalQuery })}
        </section>
        ${pageQuestions('/cfo/decision-journal')}
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

function cfoFinancialHealthView() {
  const data = MOCK_DATA.cfo;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Score transparency', body: 'The score is useful because the weighting, movement, and recommendations are visible.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
          <div class="grid-4">
            ${statCard({ iconName: 'pulse', label: 'Current score', value: String(data.welcome.score), body: data.welcome.label })}
            ${statCard({ iconName: 'pulse', label: 'Previous score', value: String(data.welcome.previousScore), body: 'Immediate comparison point.' })}
            ${statCard({ iconName: 'trending-up', label: 'Trend', value: data.welcome.trend, body: 'Higher because cash and growth quality improved.' })}
            ${statCard({ iconName: 'sparkles', label: 'Why it changed', value: 'Cash + growth', body: 'Margin softened slightly, but the broader balance still improved.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/financial-health')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'KPI Gauge', title: 'Current score gauge', canvasId: 'chart-health-gauge', meta: 'Placeholder gauge using Chart.js.' })}
          ${chartCard({ eyebrow: 'Historical Scores', title: 'Historical score trend', canvasId: 'chart-health-history', meta: 'How the score has evolved over time.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Weighting breakdown', title: 'Why the score looks the way it does' })}
          <div class="tile-grid">${data.kpis.weights.map((item) => insightCard({ eyebrow: item.weight, title: item.title, body: item.note, tone: 'neutral' })).join('')}</div>
        </section>
      </div>
    `,
    charts: [chartSpec('kpiGauge', 'chart-health-gauge', 'Financial health gauge'), chartSpec('historicalScores', 'chart-health-history', 'Historical score trend')]
  };
}

function cfoOpportunityRegisterView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Permanent opportunity register', body: 'Each opportunity is structured for action, not just recorded as an idea.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
        </section>
        ${pageQuestions('/cfo/opportunity-register')}
        <section class="panel">
          <div class="section-stack">
            ${MOCK_DATA.cfo.opportunities
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

function cfoRiskRegisterView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Permanent risk register', body: 'A living document of business risk, mitigation, trend, and ownership.' })}
          ${renderRoutePillbar(SUBNAV.cfo)}
        </section>
        ${pageQuestions('/cfo/risk-register')}
        <section class="panel">
          <div class="section-stack">
            ${MOCK_DATA.cfo.risks
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

function placeholderModuleView(route) {
  const data = MOCK_DATA.placeholders[route];
  return {
    html: `
      <div class="page-grid">
        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">${escapeHtml(data.module)} Module</div>
              <div class="hero-title">A clean placeholder for the future ${escapeHtml(data.module)} workspace.</div>
              <p class="hero-summary">${escapeHtml(data.description)}</p>
            </section>
          </div>
          <div class="hero-side">
            <section class="score-panel">
              <div class="snapshot-panel">
                <div class="label">Current status</div>
                <h3>${escapeHtml(data.status)}</h3>
                <p>This module follows the same executive design language as the CFO workspace, but remains deliberately static and demo-only in this sprint.</p>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'What it will track', title: 'Example metrics', body: 'Each future module is framed around executive-readable outputs rather than operational clutter.' })}
          <div class="grid-4">${data.metrics.map((item) => statCard({ iconName: 'grid', label: item, value: 'Placeholder', body: 'Example metric only.' })).join('')}</div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Example AI insights', title: 'How this module will think' })}
            <div class="section-stack">${data.insights.map((item) => insightCard({ eyebrow: 'Example insight', title: item, body: 'This is the kind of decision-support question the future module should answer clearly.', tone: 'info' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Example approvals / actions', title: 'What this module could stage for leadership' })}
            <div class="section-stack">${data.actions.map((item) => insightCard({ eyebrow: 'Example action', title: item, body: 'No actions execute automatically. Everything remains approval-first and mock-only.', tone: 'warn' })).join('')}</div>
          </section>
        </div>

        ${pageQuestions(route)}
      </div>
    `,
    charts: []
  };
}

function approvalsView() {
  const groups = Object.entries(MOCK_DATA.approvals.groups);
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Central Approval Centre', title: 'Business-wide approvals', body: 'Approvals are now grouped across finance, marketing, sales, operations, and AI-generated actions.' })}
          <div class="snapshot-panel">
            <h3>No approvals execute automatically</h3>
            <p>Everything in this prototype remains staged for review only. This section exists to demonstrate approval-first governance beyond the CFO module.</p>
          </div>
        </section>
        ${pageQuestions('/approvals')}
        <div class="settings-grid">
          ${groups
            .map(
              ([group, entries]) => `
                <section class="panel">
                  ${sectionHeader({ eyebrow: 'Approval group', title: group })}
                  <div class="section-stack">${entries.map((entry) => approvalCard(entry)).join('')}</div>
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

function reportsOverviewView() {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Reports', title: 'Executive reporting layer', body: 'Weekly, monthly, quarterly, and board outputs now sit in one shared reporting section.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
        </section>
        ${pageQuestions('/reports')}
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Available report routes', title: 'What to open next', body: 'Use this area to move from module work into packaged executive outputs.' })}
          <div class="tile-grid">
            ${MOCK_DATA.reports.overview
              .map(
                (item) => `
                  <article class="insight-card neutral">
                    <div class="label">Report route</div>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>${escapeHtml(item.body)}</p>
                    <button type="button" class="text-link" data-route="${item.route}">${icon('arrowRight')} Open route</button>
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
  const data = MOCK_DATA.cfo.weeklyBriefing;
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Weekly Briefings', title: 'Sunday Executive Briefing', body: 'A board-style briefing designed for Sunday mornings.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="grid-4">
            ${statCard({ iconName: 'pulse', label: 'Business health score', value: String(MOCK_DATA.ceo.score), body: MOCK_DATA.ceo.label })}
            ${statCard({ iconName: 'trending-up', label: 'Revenue', value: '£46.8k', body: 'Ahead of the baseline.' })}
            ${statCard({ iconName: 'coins', label: 'Profit', value: '£11.6k', body: 'Healthy with margin watchpoints.' })}
            ${statCard({ iconName: 'check-circle', label: 'Approval queue', value: '11 items', body: 'Approval-first queue remains visible and deliberate.' })}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'Executive Summary', title: 'Board opening statement', body: data.summary, tone: 'info' })}
            ${insightCard({ eyebrow: 'Forecasts', title: 'Current outlook', body: 'Revenue forecast £49.5k, profit forecast £12.1k, 30-day closing cash £21.3k.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Wins', title: 'What went well', body: data.wins.join(' '), tone: 'good' })}
            ${insightCard({ eyebrow: 'Risks', title: 'What needs watching', body: data.risks.join(' '), tone: 'risk' })}
            ${insightCard({ eyebrow: 'Recommendations', title: 'What to do', body: data.recommendations.join(' '), tone: 'warn' })}
            ${insightCard({ eyebrow: 'Questions Worth Asking', title: 'The right board questions', body: data.questions.join(' '), tone: 'neutral' })}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function monthlyReportsView() {
  const data = MOCK_DATA.reports.monthly;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Monthly Reports', title: 'Placeholder monthly reporting route', body: 'This route exists to show the permanent structure of the Reports section.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="snapshot-panel">
            <h3>Mock placeholder only</h3>
            <p>${escapeHtml(data.summary)}</p>
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Future monthly structure', title: 'Example monthly report sections' })}
          <div class="tile-grid">${data.sections.map((item) => insightCard({ eyebrow: 'Monthly report section', title: item, body: 'This section will eventually be packaged as part of a monthly executive report.', tone: 'neutral' })).join('')}</div>
        </section>
      </div>
    `,
    charts: []
  };
}

function quarterlyReviewsView() {
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Quarterly Executive Review', title: 'Prepared board paper', body: 'This page is intended to feel like a professionally prepared executive review rather than a dashboard.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
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
          ${sectionHeader({ eyebrow: 'Board Meeting Mode', title: 'Sunday Executive Briefing', body: 'This mode transforms EP Intelligence into a board conversation rather than a dashboard view.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="board-hero">
            <div class="summary-banner">
              <div class="hero-title">Leadership briefing for EP Golf Studios</div>
              <p class="hero-summary">This board-focused view is designed to feel like sitting down with the executive team. Instead of widgets, the emphasis is on business health, executive narratives, top opportunities, top risks, approvals waiting, and the best questions worth asking this week.</p>
            </div>
            <div class="score-tile">
              <div class="label">Business Health Score</div>
              <strong class="score-value">${MOCK_DATA.ceo.score}</strong>
              <div class="score-note">${escapeHtml(MOCK_DATA.ceo.label)}</div>
            </div>
          </div>
          <div class="board-shell-grid">
            ${insightCard({ eyebrow: 'CEO Executive Summary', title: 'Whole-business leadership view', body: MOCK_DATA.ceo.summary, tone: 'neutral' })}
            ${insightCard({ eyebrow: 'CFO Executive Report', title: 'Current financial position', body: MOCK_DATA.cfo.weeklyBriefing.summary, tone: 'info' })}
            ${insightCard({ eyebrow: 'CMO Executive Report', title: 'Placeholder', body: 'Future marketing intelligence will explain demand quality, campaign return, and brand momentum.', tone: 'neutral' })}
            ${insightCard({ eyebrow: 'COO Executive Report', title: 'Placeholder', body: 'Future operations intelligence will explain capacity, delivery friction, and execution risk.', tone: 'neutral' })}
          </div>
          <div class="chart-grid board-mode-grid">
            ${insightCard({ eyebrow: 'Top Opportunities', title: MOCK_DATA.cfo.opportunities[0].title, body: MOCK_DATA.cfo.opportunities[0].description, tone: 'good' })}
            ${insightCard({ eyebrow: 'Top Risks', title: MOCK_DATA.cfo.risks[0].impact, body: MOCK_DATA.cfo.risks[0].commentary, tone: 'risk' })}
            ${insightCard({ eyebrow: 'Decisions Required', title: '11 approvals waiting', body: 'The approval queue is visible and grouped to preserve control.', tone: 'warn' })}
            ${insightCard({ eyebrow: 'This Week’s Priorities', title: MOCK_DATA.ceo.todayPriorities[0].title, body: MOCK_DATA.ceo.todayPriorities[0].note, tone: 'info' })}
            ${insightCard({ eyebrow: 'Approvals Waiting', title: 'High signal, low noise', body: 'Finance, marketing, sales, operations, and AI-generated actions are all visible in one governed queue.', tone: 'neutral' })}
            ${insightCard({ eyebrow: 'Questions Worth Asking', title: 'Are we protecting flexibility?', body: 'Challenge assumptions around collections, margin, approvals, and operating discipline before new commitments are approved.', tone: 'neutral' })}
          </div>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Questions Worth Asking', title: 'Board conversation prompts' })}
            <ul class="board-question-list">${MOCK_DATA.cfo.weeklyBriefing.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </section>
        </section>
      </div>
    `,
    charts: []
  };
}

function reportPlaceholderView(route, title, items) {
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Reports', title, body: 'This route exists to show the permanent structure of executive reporting inside EP Intelligence.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="snapshot-panel"><h3>Mock placeholder only</h3><p>No APIs, backend, or report engine are connected in this sprint. This is a static route and presentation placeholder.</p></div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Example sections', title: 'What this report area will eventually contain' })}
          <div class="tile-grid">${items.map((item) => insightCard({ eyebrow: 'Example section', title: item, body: 'This will eventually become a packaged report component.', tone: 'neutral' })).join('')}</div>
        </section>
      </div>
    `,
    charts: []
  };
}

function aiAssistantOverviewView() {
  const data = MOCK_DATA.aiAssistant.overview;
  return {
    html: `
      <div class="page-grid">
        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">AI Assistant</div>
              <div class="hero-title">A dedicated executive AI layer inside EP Intelligence.</div>
              <p class="hero-summary">${escapeHtml(data.summary)}</p>
            </section>
          </div>
          <div class="hero-side">
            <section class="snapshot-panel">
              <div class="label">Current status</div>
              <h3>Frontend-only placeholder</h3>
              <p>No AI actions execute automatically. This section is about structure, visibility, and future design direction only.</p>
            </section>
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'AI routes', title: 'What lives here', body: 'These routes define the future structure of the AI Assistant section.' })}
          ${renderRoutePillbar(SUBNAV.aiAssistant)}
          <div class="tile-grid">
            ${data.cards
              .map(
                (item) => `
                  <article class="insight-card neutral">
                    <div class="label">AI route</div>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>${escapeHtml(item.body)}</p>
                    <button type="button" class="text-link" data-route="${item.route}">${icon('arrowRight')} Open route</button>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>
        ${pageQuestions('/ai-assistant')}
      </div>
    `,
    charts: []
  };
}

function aiAssistantPlaceholderView(route) {
  const data = MOCK_DATA.aiAssistant.pages[route];
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'AI Assistant', title: metaFor(route).title, body: data.description })}
          ${renderRoutePillbar(SUBNAV.aiAssistant)}
          <div class="snapshot-panel"><h3>Mock placeholder only</h3><p>This is a static route showing how the future AI layer will be organised inside the shell.</p></div>
        </section>
        <div class="grid-3">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Example metrics', title: 'What this route could track' })}
            <div class="section-stack">${data.exampleMetrics.map((item) => insightCard({ eyebrow: 'Metric', title: item, body: 'Placeholder only.', tone: 'neutral' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Example AI insights', title: 'What this route could explain' })}
            <div class="section-stack">${data.exampleInsights.map((item) => insightCard({ eyebrow: 'Insight', title: item, body: 'Placeholder executive reasoning only.', tone: 'info' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Example approvals / actions', title: 'What this route could stage' })}
            <div class="section-stack">${data.exampleActions.map((item) => insightCard({ eyebrow: 'Action', title: item, body: 'Everything remains review-only and frontend-only.', tone: 'warn' })).join('')}</div>
          </section>
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
          ${sectionHeader({ eyebrow: 'Settings', title: 'Shell preferences and future connections', body: 'This page exists to make the future operating model clear before anything live is connected.' })}
          <div class="settings-grid">
            ${MOCK_DATA.settings.placeholders.map((item) => integrationTile(item)).join('')}
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Future integration placeholders', title: 'Connected intelligence sources', body: 'Each item below is intentionally a placeholder for future connection.' })}
          <div class="tile-grid">${MOCK_DATA.settings.integrations.map((item) => integrationTile(item)).join('')}</div>
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

const routeRenderers = {
  '/ceo': ceoDashboardView,
  '/cfo': cfoHomeView,
  '/cfo/revenue': cfoRevenueView,
  '/cfo/profit': cfoProfitView,
  '/cfo/expenses': cfoExpensesView,
  '/cfo/supplier-spend': cfoSupplierView,
  '/cfo/cash-flow': cfoCashView,
  '/cfo/vat': cfoVatView,
  '/cfo/forecasting': cfoForecastingView,
  '/cfo/business-kpis': cfoBusinessKpisView,
  '/cfo/decision-journal': cfoDecisionJournalView,
  '/cfo/financial-health': cfoFinancialHealthView,
  '/cfo/opportunity-register': cfoOpportunityRegisterView,
  '/cfo/risk-register': cfoRiskRegisterView,
  '/cmo': () => placeholderModuleView('/cmo'),
  '/coo': () => placeholderModuleView('/coo'),
  '/sales': () => placeholderModuleView('/sales'),
  '/customer-success': () => placeholderModuleView('/customer-success'),
  '/operations': () => placeholderModuleView('/operations'),
  '/hr': () => placeholderModuleView('/hr'),
  '/projects': () => placeholderModuleView('/projects'),
  '/approvals': approvalsView,
  '/reports': reportsOverviewView,
  '/reports/weekly-briefings': weeklyBriefingsView,
  '/reports/monthly-reports': monthlyReportsView,
  '/reports/quarterly-reviews': quarterlyReviewsView,
  '/reports/board-meeting': boardMeetingView,
  '/reports/cfo-reports': () => reportPlaceholderView('/reports/cfo-reports', 'CFO Reports', MOCK_DATA.reports.cfoReports),
  '/reports/cmo-reports': () => reportPlaceholderView('/reports/cmo-reports', 'CMO Reports', MOCK_DATA.reports.cmoReports),
  '/reports/ceo-reports': () => reportPlaceholderView('/reports/ceo-reports', 'CEO Reports', MOCK_DATA.reports.ceoReports),
  '/ai-assistant': aiAssistantOverviewView,
  '/ai-assistant/ask': () => aiAssistantPlaceholderView('/ai-assistant/ask'),
  '/ai-assistant/executive-briefing': () => aiAssistantPlaceholderView('/ai-assistant/executive-briefing'),
  '/ai-assistant/follow-up-questions': () => aiAssistantPlaceholderView('/ai-assistant/follow-up-questions'),
  '/ai-assistant/suggested-actions': () => aiAssistantPlaceholderView('/ai-assistant/suggested-actions'),
  '/ai-assistant/assumptions': () => aiAssistantPlaceholderView('/ai-assistant/assumptions'),
  '/ai-assistant/missing-information': () => aiAssistantPlaceholderView('/ai-assistant/missing-information'),
  '/ai-assistant/memory-context': () => aiAssistantPlaceholderView('/ai-assistant/memory-context'),
  '/settings': settingsView
};

function renderView() {
  const renderer = routeRenderers[state.route] || ceoDashboardView;
  return renderer();
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

function renderWithSkeleton() {
  clearTimeout(skeletonTimer);
  destroyCharts();
  pageContent.innerHTML = loadingSkeleton();
  skeletonTimer = setTimeout(() => render(), 140);
}

function validateStartup() {
  const required = [primaryNav, secondaryNav, pageContent, modeSwitcher, navSearch, breadcrumbNode];
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
