import { TOP_LEVEL_NAV, SUBNAV, MODE_OPTIONS, ROUTE_META, QUESTION_SETS } from './config/shell-config.js';
import { WORKSPACE_DATA, APP_RUNTIME } from './data/runtime.js';
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

const STORAGE_KEY = 'ep-intelligence.workspace.v0.5c';
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
  contentQuery: '',
  boardSlide: 0,
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
  if (key === '/cmo') return SUBNAV.cmo;
  if (key === '/reports') return SUBNAV.reports;
  if (key === '/ai-assistant') return SUBNAV.aiAssistant;
  if (key === '/settings') return SUBNAV.settings;
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
  const previousRoute = state.route;
  state.route = route;
  if (route === '/reports/board-meeting' && previousRoute !== route) state.boardSlide = 0;
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
  return { id: canvasId, label, ...WORKSPACE_DATA.cfo.charts[key] };
}

function entryChartSpec(entry, canvasId, label = '') {
  return { id: canvasId, label: label || entry.label || 'Value', ...entry };
}

function toneFromScore(score) {
  if (score >= 85) return 'good';
  if (score >= 79) return 'info';
  if (score >= 72) return 'warn';
  return 'risk';
}

function toneFromSeverity(severity = '') {
  const value = String(severity).toLowerCase();
  if (value.includes('high')) return 'risk';
  if (value.includes('medium')) return 'warn';
  return 'good';
}

function toneFromPriority(priority = '') {
  const value = String(priority).toLowerCase();
  if (value === 'high') return 'risk';
  if (value === 'medium') return 'warn';
  return 'good';
}

function boardSlides() {
  const ceo = WORKSPACE_DATA.ceo;
  const intelligence = WORKSPACE_DATA.intelligence;
  return [
    {
      key: 'summary',
      eyebrow: 'Executive Summary',
      title: intelligence.reports.boardSummary.title,
      body: intelligence.reports.boardSummary.summary,
      html: `
        <div class="board-shell-grid">
          ${insightCard({ eyebrow: 'Top insight', title: intelligence.insights.topInsight.title, body: intelligence.insights.topInsight.executiveSummary, tone: toneFromPriority(intelligence.insights.topInsight.priority) })}
          ${insightCard({ eyebrow: 'Overall business health', title: `${intelligence.health.overall.score} / 100`, body: `Overall status is ${intelligence.health.overall.label.toLowerCase()} with deterministic scoring across finance, marketing, and CEO health.`, tone: 'info' })}
          ${insightCard({ eyebrow: 'Major recommendation', title: intelligence.recommendations[0].recommendation, body: intelligence.recommendations[0].expectedBenefit, tone: toneFromPriority(intelligence.recommendations[0].priority) })}
          ${insightCard({ eyebrow: 'Confidence', title: `${intelligence.insights.topInsight.confidence} confidence`, body: `Evidence base: ${intelligence.insights.topInsight.supportingEvidence.join(' ')}`, tone: 'good' })}
        </div>
      `
    },
    {
      key: 'kpis',
      eyebrow: 'KPI Slide',
      title: 'Executive KPI snapshot',
      body: 'Only the metrics that deserve CEO attention are shown here.',
      html: `
        <div class="grid-4">
          ${ceo.executiveKpis.slice(0, 8).map((item) => statCard({ iconName: item.icon, label: item.label, value: item.value, body: item.body, meta: item.trend })).join('')}
        </div>
      `
    },
    {
      key: 'finance',
      eyebrow: 'Financial Summary',
      title: 'Finance should preserve optionality',
      body: WORKSPACE_DATA.cfo.weeklyBriefing.summary,
      html: `
        <div class="grid-3">
          ${statCard({ iconName: 'trending-up', label: 'Revenue', value: WORKSPACE_DATA.cfo.metrics[0].value, body: WORKSPACE_DATA.cfo.metrics[0].detail })}
          ${statCard({ iconName: 'coins', label: 'Profit', value: WORKSPACE_DATA.cfo.metrics[1].value, body: WORKSPACE_DATA.cfo.metrics[1].detail })}
          ${statCard({ iconName: 'wallet', label: 'Cash Position', value: WORKSPACE_DATA.cfo.metrics[2].value, body: WORKSPACE_DATA.cfo.metrics[2].detail })}
        </div>
        <div class="grid-2">
          ${intelligence.insights.cfo.slice(0, 2).map((item) => insightCard({ eyebrow: item.priority, title: item.title, body: item.executiveSummary, tone: toneFromPriority(item.priority) })).join('')}
        </div>
      `
    },
    {
      key: 'marketing',
      eyebrow: 'Marketing Summary',
      title: 'Marketing is creating momentum, but conversion matters next',
      body: WORKSPACE_DATA.cmo.dashboard.weeklyBriefing,
      html: `
        <div class="grid-4">
          ${statCard({ iconName: 'sparkles', label: 'Marketing Health Score', value: String(WORKSPACE_DATA.cmo.dashboard.healthScore), body: WORKSPACE_DATA.cmo.dashboard.summary })}
          ${statCard({ iconName: 'pulse', label: 'Best Platform', value: WORKSPACE_DATA.cmo.dashboard.bestPlatform, body: 'The strongest current growth and trust engine.' })}
          ${statCard({ iconName: 'grid', label: 'Website Visitors', value: WORKSPACE_DATA.cmo.dashboard.metrics.visitors, body: 'Traffic is up, but conversion quality is the real lever.' })}
          ${statCard({ iconName: 'target', label: 'Booking Enquiries', value: WORKSPACE_DATA.cmo.dashboard.metrics.enquiries, body: 'The most commercially relevant current marketing output.' })}
        </div>
        <div class="grid-2">
          ${intelligence.insights.cmo.slice(0, 2).map((item) => insightCard({ eyebrow: item.priority, title: item.title, body: item.executiveSummary, tone: toneFromPriority(item.priority) })).join('')}
        </div>
      `
    },
    {
      key: 'correlations',
      eyebrow: 'Cross-Department Intelligence',
      title: 'What the business signals mean when linked together',
      body: 'The engine links departments together before the board sees the output.',
      html: `
        <div class="section-stack">
          ${intelligence.correlations.slice(0, 4).map((item) => registerRow({
            kicker: `${pill(item.priority, toneFromPriority(item.priority))}${pill(item.responsibleDepartment, 'info')}`,
            title: item.title,
            body: item.executiveSummary,
            extra: `<div class="mini-list"><li>${escapeHtml(item.supportingEvidence.join(' '))}</li></div>`
          })).join('')}
        </div>
      `
    },
    {
      key: 'actions',
      eyebrow: 'Actions',
      title: 'What should be approved or acted on today',
      body: 'The board view should end with clear actions, not just commentary.',
      html: `
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Executive recommendations', title: 'Priority actions', body: 'These are ranked by value, urgency, customer effect, and confidence.' })}
            <div class="section-stack">${intelligence.recommendations.slice(0, 4).map((item, index) => priorityCard({ index: index + 1, title: item.recommendation, body: `${item.why} Owner ${item.suggestedOwner} · Estimated value ${item.estimatedValue}.`, tone: toneFromPriority(item.priority) })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Approvals requiring CEO attention', title: 'CEO approval queue', body: 'Keep the queue selective, ranked, and time-bound.' })}
            <div class="section-stack">${ceo.approvalSummary.slice(0, 3).map((item) => approvalCard(item)).join('')}</div>
          </section>
        </div>
      `
    }
  ];
}

function setBoardSlide(nextSlide) {
  const slides = boardSlides();
  state.boardSlide = Math.max(0, Math.min(nextSlide, slides.length - 1));
  render();
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
      const supplier = WORKSPACE_DATA.cfo.suppliers.find((item) => item.id === button.dataset.supplier);
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

  const contentSearch = document.getElementById('content-library-search');
  if (contentSearch) {
    contentSearch.addEventListener('input', (event) => {
      state.contentQuery = event.target.value;
      render();
    });
  }

  pageContent.querySelectorAll('[data-board-step]').forEach((button) => {
    button.addEventListener('click', () => {
      setBoardSlide(state.boardSlide + Number.parseInt(button.dataset.boardStep, 10));
    });
  });

  pageContent.querySelectorAll('[data-board-slide]').forEach((button) => {
    button.addEventListener('click', () => {
      setBoardSlide(Number.parseInt(button.dataset.boardSlide, 10));
    });
  });
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
  if (keySequence === 'gm') {
    keySequence = '';
    setRoute('/cmo');
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
    const activeTag = document.activeElement?.tagName;
    const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA';
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
    if (state.route === '/reports/board-meeting' && !isTyping) {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        setBoardSlide(state.boardSlide + 1);
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setBoardSlide(state.boardSlide - 1);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setBoardSlide(0);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        setBoardSlide(boardSlides().length - 1);
        return;
      }
    }
    if (!event.metaKey && !event.ctrlKey && !event.altKey) {
      queueKey(event.key.toLowerCase());
    }
  });
}

function ceoDashboardView() {
  const data = WORKSPACE_DATA.ceo;
  const intelligence = WORKSPACE_DATA.intelligence;
  return {
    html: `
      <div class="page-grid">
        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">CEO Dashboard</div>
              <div class="hero-title">Your deterministic executive intelligence briefing.</div>
              <p class="hero-summary">${escapeHtml(intelligence.narratives.dailyBriefing.summary)}</p>
            </section>
            <section class="snapshot-grid">
              ${data.executiveKpis.slice(0, 4).map((item) => statCard({ iconName: item.icon, label: item.label, value: item.value, body: item.body, meta: item.trend })).join('')}
            </section>
          </div>
          <div class="hero-side">
            <section class="score-panel">
              <div class="score-tile">
                <div class="label">Business Health Score</div>
                <strong class="score-value">${data.businessHealthScore.overall}</strong>
                <div class="score-note">Confidence ${escapeHtml(data.businessHealthScore.confidence)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">Direction</div>
                <h3>${escapeHtml(intelligence.insights.topInsight.title)}</h3>
                <p>${escapeHtml(data.businessHealthScore.direction)}.</p>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Briefing', title: intelligence.narratives.dailyBriefing.headline, body: 'The engine explains what happened, why it happened, why it matters, and what should happen next.' })}
          <div class="grid-2">
            <div class="section-stack">
              ${insightCard({ eyebrow: 'Top insight', title: intelligence.insights.topInsight.title, body: intelligence.insights.topInsight.executiveSummary, tone: toneFromPriority(intelligence.insights.topInsight.priority) })}
              ${insightCard({ eyebrow: 'Recommended next move', title: intelligence.recommendations[0].recommendation, body: intelligence.recommendations[0].expectedBenefit, tone: toneFromPriority(intelligence.recommendations[0].priority) })}
            </div>
            <div class="section-stack">
              ${insightCard({ eyebrow: 'Business impact', title: intelligence.insights.topInsight.businessImpact, body: intelligence.insights.topInsight.financialImpact, tone: 'info' })}
              ${insightCard({ eyebrow: 'Supporting evidence', title: `${intelligence.insights.topInsight.confidence} confidence`, body: intelligence.insights.topInsight.supportingEvidence.join(' '), tone: 'good' })}
            </div>
          </div>
          <div class="tile-grid">
            ${intelligence.insights.executive.slice(0, 3).map((item) => insightCard({ eyebrow: `${item.priority} priority`, title: item.title, body: item.executiveSummary, tone: toneFromPriority(item.priority) })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Business Health Engine', title: 'Weighted executive health scoring', body: 'Finance, marketing, and overall leadership health are generated from configurable scoring weights and thresholds.' })}
          <div class="grid-2">
            <section class="score-panel">
              <div class="score-tile">
                <div class="label">Overall score</div>
                <strong class="score-value">${data.businessHealthScore.overall}</strong>
                <div class="score-note">${escapeHtml(intelligence.health.overall.label)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">Module health</div>
                <h3>CEO ${intelligence.health.ceo.score} · CFO ${intelligence.health.cfo.score} · CMO ${intelligence.health.cmo.score}</h3>
                <p>The HealthEngine combines weighted signals across revenue, margin, cash, marketing momentum, conversion quality, and governance.</p>
              </div>
            </section>
            <div class="chart-grid">
              ${chartCard({ eyebrow: 'Business Health', title: 'Score trend', canvasId: 'chart-ceo-health-trend', meta: 'A simple seven-day health trend for the CEO view.' })}
              ${chartCard({ eyebrow: 'Department Scores', title: 'Cross-functional score distribution', canvasId: 'chart-ceo-department-scores', meta: 'A compressed view of where health is strongest or weakest.' })}
              ${chartCard({ eyebrow: 'Approvals', title: 'CEO approval load by department', canvasId: 'chart-ceo-approval-load', meta: 'Where decisions are currently accumulating.' })}
            </div>
          </div>
          <div class="tile-grid">
            ${data.businessHealthScore.modules.map((item) => insightCard({ eyebrow: `${item.module} · ${item.trend}`, title: `${item.score} / 100`, body: item.summary, tone: toneFromScore(item.score) })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Recommendations', title: 'Ranked CEO actions', body: 'Recommendations are scored by financial impact, customer impact, strategic importance, time sensitivity, and confidence.' })}
          <div class="section-stack">
            ${intelligence.recommendations.map((item, index) => registerRow({
              kicker: `${pill(`#${index + 1}`, 'info')}${pill(item.priority, toneFromPriority(item.priority))}${pill(item.suggestedOwner, 'neutral')}`,
              title: item.recommendation,
              body: item.why,
              extra: `
                <div class="grid-4">
                  ${statCard({ iconName: 'coins', label: 'Estimated value', value: item.estimatedValue, body: item.expectedBenefit })}
                  ${statCard({ iconName: 'alert-triangle', label: 'Risk', value: item.risk, body: 'Execution risk if approved.' })}
                  ${statCard({ iconName: 'pulse', label: 'Confidence', value: item.confidence, body: `Priority score ${item.priorityScore}.` })}
                  ${statCard({ iconName: 'target', label: 'Suggested owner', value: item.suggestedOwner, body: 'Recommended accountable owner.' })}
                </div>
              `
            })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive KPIs', title: 'Only the metrics that deserve attention', body: 'These cards intentionally avoid operational clutter and stay focused on business-shaping signals.' })}
          <div class="grid-4">
            ${data.executiveKpis.map((item) => statCard({ iconName: item.icon, label: item.label, value: item.value, body: item.body, meta: item.trend })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Business Timeline', title: 'Recent business activity', body: 'The engine now adds generated timeline events for milestones, warnings, and significant shifts.' })}
          <div class="section-stack">
            ${data.businessTimeline.map((item) => registerRow({ kicker: `${pill(item.time, 'info')}${pill(item.type, 'neutral')}`, title: item.title, body: item.body })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Cross-Department Intelligence', title: 'What the business signals mean when linked together', body: 'These correlations are generated before the interface renders them.' })}
          <div class="tile-grid">
            ${WORKSPACE_DATA.intelligence.correlations.map((item) => insightCard({ eyebrow: `${item.priority} · ${item.businessImpact}`, title: item.title, body: item.executiveSummary, tone: item.tone || toneFromPriority(item.priority) })).join('')}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Executive Risks', title: 'Ranked business risks', body: 'These are the issues most likely to weaken confidence, value, or flexibility if ignored.' })}
            <div class="section-stack">
              ${data.executiveRisks.map((item) => registerRow({
                kicker: `${pill(item.severity, toneFromSeverity(item.severity))}${pill(item.department, 'info')}`,
                title: item.title,
                body: `Likelihood ${item.likelihood} · Financial impact ${item.financialImpact}. Suggested mitigation: ${item.mitigation}`
              })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Executive Opportunities', title: 'Where the leverage is', body: 'These are the deterministic recommendation opportunities currently ranked highest by the engine.' })}
            <div class="section-stack">
              ${intelligence.recommendations.slice(0, 3).map((item) => registerRow({
                kicker: `${pill(item.priority, toneFromPriority(item.priority))}${pill(item.suggestedOwner, 'info')}`,
                title: item.recommendation,
                body: `Expected benefit ${item.expectedBenefit} · Estimated value ${item.estimatedValue}`
              })).join('')}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Approval Summary', title: 'Pending CEO approvals', body: 'This is the company-wide decision queue that currently deserves executive attention.' })}
            <div class="section-stack">
              ${data.approvalSummary.map((item) => approvalCard(item)).join('')}
              <button type="button" class="quick-action-button" data-route="/approvals">Open central Approvals ${icon('arrowRight')}</button>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Department Health', title: 'How each executive function is doing', body: 'The CEO does not need every detail — just the status, trajectory, and summary for each function.' })}
            <div class="tile-grid">
              ${data.departmentHealth.map((item) => insightCard({ eyebrow: `${item.department} · ${item.trend}`, title: `${item.score} / 100 · ${item.status}`, body: item.summary, tone: toneFromScore(item.score) })).join('')}
            </div>
          </section>
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Decision Centre', title: 'The CEO decision workspace', body: 'This section separates what needs review now from what has been approved, deferred, or remains strategic.' })}
          <div class="settings-grid">
            <section class="panel">
              ${sectionHeader({ eyebrow: 'Decisions awaiting review', title: 'Needs CEO judgment' })}
              <div class="section-stack">${data.decisionCentre.awaitingReview.map((item) => insightCard({ eyebrow: 'Awaiting review', title: item, body: 'This item should be reviewed before the day loses focus.', tone: 'warn' })).join('')}</div>
            </section>
            <section class="panel">
              ${sectionHeader({ eyebrow: 'Recently approved decisions', title: 'Already moving' })}
              <div class="section-stack">${data.decisionCentre.recentlyApproved.map((item) => insightCard({ eyebrow: 'Approved', title: item, body: 'This decision is already moving into execution in the prototype storyline.', tone: 'good' })).join('')}</div>
            </section>
            <section class="panel">
              ${sectionHeader({ eyebrow: 'Deferred decisions', title: 'Intentionally not now' })}
              <div class="section-stack">${data.decisionCentre.deferred.map((item) => insightCard({ eyebrow: 'Deferred', title: item, body: 'Deferred deliberately to preserve focus and decision quality.', tone: 'neutral' })).join('')}</div>
            </section>
            <section class="panel">
              ${sectionHeader({ eyebrow: 'Strategic decisions', title: 'Larger choices still open' })}
              <div class="section-stack">${data.decisionCentre.strategic.map((item) => insightCard({ eyebrow: 'Strategic', title: item, body: 'This is a broader decision that deserves more deliberate CEO consideration.', tone: 'info' })).join('')}</div>
            </section>
          </div>
        </section>

        ${commentaryCard({ title: intelligence.ceo.commentary.title, data: intelligence.ceo.commentary })}

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Ask EP Intelligence', title: 'A conversational executive workspace', body: 'The CEO should be able to ask direct business questions and get concise, decision-ready responses.' })}
          <div class="tile-grid">
            ${WORKSPACE_DATA.aiAssistant.askWorkspace.prompts.map((item) => insightCard({ eyebrow: item.question, title: `${item.confidence} confidence`, body: item.answer, tone: 'neutral' })).join('')}
          </div>
          <div class="page-pillbar">
            <button type="button" class="chip-button" data-route="/ai-assistant/ask">${icon('sparkles')}Open Ask EP Intelligence</button>
            <button type="button" class="chip-button" data-route="/reports/board-meeting">${icon('presentation')}Open Board Meeting Mode</button>
            <button type="button" class="chip-button" data-route="/reports/weekly-briefings">${icon('arrowRight')}Open Weekly Briefings</button>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Sunday summary preview', title: 'Weekly executive narrative', body: 'Reporting now sits in a shared Reports section inside the broader shell.' })}
          <div class="snapshot-panel">
            <h3>${escapeHtml(data.weeklySummaryPreview.headline)}</h3>
            <p>${escapeHtml(intelligence.narratives.weeklyBriefing.summary)}</p>
            <button type="button" class="quick-action-button" data-route="/reports/weekly-briefings">Open Weekly Briefings ${icon('arrowRight')}</button>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Board Meeting Mode', title: data.boardMeeting.title, body: data.boardMeeting.summary })}
          <div class="chip-list">${data.boardMeeting.agenda.map((item) => `<button type="button" class="sidebar-chip" data-route="/reports/board-meeting">${escapeHtml(item)}</button>`).join('')}</div>
          <div class="page-pillbar"><button type="button" class="chip-button" data-route="/reports/board-meeting">${icon('presentation')}Open presentation mode</button></div>
        </section>

        ${pageQuestions('/ceo')}
      </div>
    `,
    charts: [
      entryChartSpec(data.charts.healthTrend, 'chart-ceo-health-trend', 'Business health score trend'),
      entryChartSpec(data.charts.departmentScores, 'chart-ceo-department-scores', 'Department scores'),
      entryChartSpec(data.charts.approvalLoad, 'chart-ceo-approval-load', 'Approval load by department')
    ]
  };
}

function cfoHomeView() {
  const data = WORKSPACE_DATA.cfo;
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
            ${statCard({ iconName: 'sparkles', label: 'Revenue forecast', value: WORKSPACE_DATA.cfo.forecasts.revenue, body: 'Forecast stays constructive under current assumptions.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/revenue')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Revenue Trends', title: 'Revenue trend chart', canvasId: 'chart-revenue-trend', meta: 'Interactive placeholder data using Chart.js.' })}
          ${chartCard({ eyebrow: 'Payment mix', title: 'Revenue by payment method', canvasId: 'chart-payment-methods', meta: 'Card, transfer, finance, and cash mix.' })}
          ${chartCard({ eyebrow: 'Invoice status', title: 'Revenue by invoice status', canvasId: 'chart-invoice-status', meta: 'Paid, pending, and overdue profile.' })}
        </div>
        ${commentaryCard({ title: WORKSPACE_DATA.cfo.commentary.revenue.title, data: WORKSPACE_DATA.cfo.commentary.revenue })}
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
        ${commentaryCard({ title: WORKSPACE_DATA.cfo.commentary.profit.title, data: WORKSPACE_DATA.cfo.commentary.profit })}
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
        ${commentaryCard({ title: WORKSPACE_DATA.cfo.commentary.expenses.title, data: WORKSPACE_DATA.cfo.commentary.expenses })}
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
          <div class="tile-grid">${WORKSPACE_DATA.cfo.suppliers.map((supplier) => supplierCard(supplier)).join('')}</div>
        </section>
        ${commentaryCard({ title: WORKSPACE_DATA.cfo.commentary.suppliers.title, data: WORKSPACE_DATA.cfo.commentary.suppliers })}
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
        ${commentaryCard({ title: WORKSPACE_DATA.cfo.commentary.cash.title, data: WORKSPACE_DATA.cfo.commentary.cash })}
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
        ${commentaryCard({ title: WORKSPACE_DATA.cfo.commentary.vat.title, data: WORKSPACE_DATA.cfo.commentary.vat })}
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
            ${statCard({ iconName: 'trending-up', label: 'Revenue forecast', value: WORKSPACE_DATA.cfo.forecasts.revenue, body: 'Assumes healthy demand and stable booking conversion.' })}
            ${statCard({ iconName: 'coins', label: 'Profit forecast', value: WORKSPACE_DATA.cfo.forecasts.profit, body: 'Depends on stabilising supplier cost growth.' })}
            ${statCard({ iconName: 'wallet', label: 'Cash forecast', value: WORKSPACE_DATA.cfo.forecasts.cash, body: 'Requires collections to normalise on time.' })}
            ${statCard({ iconName: 'sparkles', label: 'Investment modelling', value: 'Placeholder', body: 'Reserved for future capital and equipment decision models.' })}
          </div>
        </section>
        ${pageQuestions('/cfo/forecasting')}
        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Financial Forecast', title: 'Scenario comparison', canvasId: 'chart-forecast', meta: 'Base, conservative, and upside scenarios.' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'What if…', title: 'Scenario planning placeholders', body: 'A forecasting workspace should feel like a thinking environment rather than a static report.' })}
          <div class="tile-grid">${WORKSPACE_DATA.cfo.forecasts.scenarios.map((item) => insightCard({ eyebrow: 'Scenario', title: item.title, body: item.body, tone: 'neutral' })).join('')}</div>
        </section>
        ${commentaryCard({ title: WORKSPACE_DATA.cfo.commentary.forecasting.title, data: WORKSPACE_DATA.cfo.commentary.forecasting })}
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
            ${WORKSPACE_DATA.cfo.kpis.groups
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
  const filtered = WORKSPACE_DATA.cfo.decisionJournal.filter((entry) => {
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
  const data = WORKSPACE_DATA.cfo;
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
            ${WORKSPACE_DATA.cfo.opportunities
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
            ${WORKSPACE_DATA.cfo.risks
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

function marketingApprovals(limit = 6) {
  return (WORKSPACE_DATA.approvals.groups['Marketing approvals'] || []).slice(0, limit);
}

function pairStats(entries, body = 'Executive placeholder metric.') {
  const icons = ['pulse', 'sparkles', 'grid', 'trending-up'];
  return entries.map(([label, value], index) => statCard({ iconName: icons[index % icons.length], label, value, body })).join('');
}

function cmoToneFromRating(rating) {
  if (rating === 'A') return 'good';
  if (rating === 'C') return 'warn';
  return 'info';
}

function cmoPlatformCommentary(platform) {
  const name = platform.label;
  const growth = platform.stats.find(([label]) => label === 'Audience Growth')?.[1] || 'Growth placeholder';
  const engagement = platform.stats.find(([label]) => label === 'Engagement Rate')?.[1] || 'Engagement placeholder';
  const cadence = platform.stats.find(([label]) => label === 'Posting Frequency')?.[1] || 'Cadence placeholder';
  return {
    title: `${name} Executive Commentary`,
    data: {
      summary: `${name} is currently positioned as a ${platform.health.toLowerCase()}, with its best performance coming from proof-led, educational content formats.`,
      evidence: `${name} is showing ${growth} audience growth with ${engagement} engagement and a current cadence of ${cadence}. Top content remains concentrated around premium fitting proof and educational trust-building.`,
      confidence: 'Medium–High',
      impact: `${name} matters because it either compounds authority and demand efficiently or absorbs time without enough return.`,
      risks: `If ${name} publishing becomes inconsistent or drifts away from the formats that already perform well, growth quality could soften quickly.`,
      alternatives: 'Increase publishing cadence, focus more tightly on top-performing content formats, or maintain a selective cadence while resources stay concentrated elsewhere.',
      action: `Preserve the highest-performing themes on ${name}, keep cadence deliberate, and use this page to decide whether the next effort should scale or narrow.`,
      missing: `All ${name} data remains realistic mock/demo data only in this sprint.`,
      followUp: [`What content performs best on ${name}?`, `Should ${name} get more effort next week?`, `What is the next approval-worthy action on ${name}?`]
    }
  };
}

function cmoDashboardView() {
  const data = WORKSPACE_DATA.cmo.dashboard;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'The executive marketing command centre', body: 'The CMO Workspace now sits inside the wider EP Intelligence shell as the first complete non-finance executive module.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
        </section>

        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">CMO Workspace</div>
              <div class="hero-title">Marketing now has its own executive operating surface.</div>
              <p class="hero-summary">${escapeHtml(data.summary)}</p>
            </section>
            <section class="snapshot-grid">
              ${statCard({ iconName: 'pulse', label: 'Followers Across Platforms', value: data.metrics.followers, body: 'Combined social audience across the current demo estate.' })}
              ${statCard({ iconName: 'sparkles', label: 'Total Monthly Views', value: data.metrics.views, body: 'Video, social, and channel visibility combined.' })}
              ${statCard({ iconName: 'trending-up', label: 'Total Engagement', value: data.metrics.engagement, body: 'A composite signal across likes, comments, shares, and clicks.' })}
              ${statCard({ iconName: 'grid', label: 'Website Visitors', value: data.metrics.visitors, body: 'Traffic quality matters as much as raw volume.' })}
              ${statCard({ iconName: 'target', label: 'Email Sign-ups', value: data.metrics.signups, body: 'List growth is becoming a stronger owned-channel signal.' })}
              ${statCard({ iconName: 'target', label: 'Leads Generated', value: data.metrics.leads, body: 'A placeholder demand-generation signal across channels.' })}
              ${statCard({ iconName: 'target', label: 'Booking Enquiries', value: data.metrics.enquiries, body: 'The most commercially meaningful conversion signal in the current demo view.' })}
            </section>
          </div>
          <div class="hero-side">
            <section class="score-panel">
              <div class="score-tile">
                <div class="label">Marketing Health Score</div>
                <strong class="score-value">${data.healthScore}</strong>
                <div class="score-note">${escapeHtml(data.trend)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">Channel spread</div>
                <h3>Best: ${escapeHtml(data.bestPlatform)}</h3>
                <p>Worst performing platform right now is ${escapeHtml(data.worstPlatform)}. The executive job is to keep focus on the channels creating the clearest commercial momentum.</p>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Marketing Overview', title: 'What the CMO should understand at a glance', body: 'This page exists to separate channel health, business relevance, and next-step priorities clearly.' })}
          <div class="grid-3">
            ${insightCard({ eyebrow: 'Overall performance summary', title: 'Marketing momentum is positive', body: data.summary, tone: 'info' })}
            ${insightCard({ eyebrow: 'Best performing platform', title: data.bestPlatform, body: 'The strongest current platform should influence where content energy and approvals go next.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Weakest platform', title: data.worstPlatform, body: 'The weakest platform should either improve through clearer intent or be deliberately deprioritised.', tone: 'warn' })}
          </div>
        </section>

        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Platform Comparison', title: 'Marketing platform ranking', canvasId: 'chart-cmo-platform-comparison', meta: 'A cross-platform performance ranking for executive prioritisation.' })}
          ${chartCard({ eyebrow: 'Views', title: 'Total monthly visibility trend', canvasId: 'chart-cmo-total-views', meta: 'How overall views are moving over time in the mock environment.' })}
          ${chartCard({ eyebrow: 'Website', title: 'Website traffic trend', canvasId: 'chart-cmo-website-traffic', meta: 'A quick executive lens on marketing-driven website attention.' })}
          ${chartCard({ eyebrow: 'Conversions', title: 'Website conversion signals', canvasId: 'chart-cmo-website-conversions', meta: 'Bookings, enquiries, and sign-ups in one view.' })}
        </div>

        ${commentaryCard({ title: data.aiSummary.title, data: data.aiSummary })}
        ${pageQuestions('/cmo')}

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Opportunities', title: 'Where the leverage is', body: 'Marketing opportunities should help leadership decide where to focus effort next.' })}
            <div class="section-stack">${data.opportunities.map((item) => insightCard({ eyebrow: 'Opportunity', title: item, body: 'This should be treated as a priority candidate for the next content or channel cycle.', tone: 'good' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Risks', title: 'What could reduce return', body: 'A strong CMO view needs to surface where momentum could weaken or effort could get wasted.' })}
            <div class="section-stack">${data.risks.map((item) => insightCard({ eyebrow: 'Risk', title: item, body: 'If ignored, this could weaken either growth quality, conversion quality, or content efficiency.', tone: 'risk' })).join('')}</div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Pending Marketing Approvals', title: 'Nothing publishes automatically', body: 'Every meaningful marketing action stays approval-first in this prototype.' })}
            <div class="section-stack">
              ${marketingApprovals(6).map((entry) => approvalCard(entry)).join('')}
              <button type="button" class="quick-action-button" data-route="/approvals">Open central Approvals ${icon('arrowRight')}</button>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Weekly Marketing Briefing', title: 'This week’s executive readout', body: 'The weekly briefing is designed to package marketing movement into a calm, leadership-ready narrative.' })}
            <div class="snapshot-panel">
              <h3>Executive weekly briefing</h3>
              <p>${escapeHtml(data.weeklyBriefing)}</p>
              <div class="page-pillbar">
                <button type="button" class="chip-button" data-route="/cmo/reports">${icon('presentation')}Open Marketing Reports</button>
                <button type="button" class="chip-button" data-route="/reports/weekly-briefings">${icon('arrowRight')}Open Shared Weekly Briefings</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    `,
    charts: [
      entryChartSpec(WORKSPACE_DATA.cmo.charts.platformComparison, 'chart-cmo-platform-comparison', 'Platform ranking'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.totalViews, 'chart-cmo-total-views', 'Total views'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.websiteTraffic, 'chart-cmo-website-traffic', 'Website traffic'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.websiteConversions, 'chart-cmo-website-conversions', 'Website conversions')
    ]
  };
}

function cmoSocialOverviewView() {
  const data = WORKSPACE_DATA.cmo.socialOverview;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Cross-platform social performance', body: 'This page gives the executive team one ranked view of social growth, reach, engagement, and channel quality.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="grid-4">${pairStats([
            ['Combined Followers', data.combined.followers],
            ['Combined Views', data.combined.views],
            ['Combined Reach', data.combined.reach],
            ['Combined Engagement', data.combined.engagement],
            ['Followers Gained', data.combined.gained],
            ['Monthly Growth %', data.combined.growth]
          ], 'Cross-platform marketing metric.')}</div>
        </section>

        ${pageQuestions('/cmo/social-media-overview')}

        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Platform Rankings', title: 'Which channels are strongest', canvasId: 'chart-social-platform-comparison', meta: 'Higher scores indicate stronger overall platform performance.' })}
          ${chartCard({ eyebrow: 'Follower Growth', title: 'Combined audience growth', canvasId: 'chart-social-follower-growth', meta: 'Cross-platform follower growth over time.' })}
          ${chartCard({ eyebrow: 'Views', title: 'Combined visibility trend', canvasId: 'chart-social-total-views', meta: 'A trendline for total monthly views across the social estate.' })}
          ${chartCard({ eyebrow: 'Engagement Mix', title: 'How engagement is distributed', canvasId: 'chart-social-engagement-mix', meta: 'Likes, comments, shares, and clicks across the combined estate.' })}
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Platform rankings', title: 'Ranked by overall performance', body: 'These rankings should drive where the next content and approval decisions go first.' })}
          <div class="tile-grid">
            ${data.rankings.map((item, index) => insightCard({ eyebrow: `#${index + 1} · ${item.platform}`, title: `${item.score} / 100`, body: `${item.note} Growth: ${item.growth}.`, tone: index < 2 ? 'good' : index === data.rankings.length - 1 ? 'warn' : 'info' })).join('')}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Top content', title: 'What is working best', body: 'High-performing content should shape the next round of marketing effort.' })}
            ${insightCard({ eyebrow: data.topContent.platform, title: data.topContent.title, body: data.topContent.metric, tone: 'good' })}
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Lowest content', title: 'What is underperforming', body: 'Low-return formats should be improved, narrowed, or deprioritised.' })}
            ${insightCard({ eyebrow: data.lowestContent.platform, title: data.lowestContent.title, body: data.lowestContent.metric, tone: 'warn' })}
          </section>
        </div>
      </div>
    `,
    charts: [
      entryChartSpec(WORKSPACE_DATA.cmo.charts.platformComparison, 'chart-social-platform-comparison', 'Platform ranking'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.followerGrowth, 'chart-social-follower-growth', 'Follower growth'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.totalViews, 'chart-social-total-views', 'Total views'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.engagementMix, 'chart-social-engagement-mix', 'Engagement mix')
    ]
  };
}

function cmoPlatformView(key, route) {
  const data = WORKSPACE_DATA.cmo.platforms[key];
  const commentary = cmoPlatformCommentary(data);
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: `${data.label} performance`, body: data.health })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="grid-4">${pairStats(data.stats, 'Platform-level marketing metric.')}</div>
        </section>

        ${pageQuestions(route)}

        <div class="chart-grid">
          ${chartCard({ eyebrow: `${data.label} Audience`, title: 'Audience growth over time', canvasId: `chart-${key}-followers`, meta: 'Followers or subscribers over time.' })}
          ${chartCard({ eyebrow: `${data.label} Views`, title: 'Visibility trend', canvasId: `chart-${key}-views`, meta: 'Views or reach trend over time.' })}
          ${chartCard({ eyebrow: `${data.label} Engagement`, title: 'Engagement trend', canvasId: `chart-${key}-engagement`, meta: 'A monthly engagement trend for executive comparison.' })}
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Top performing posts', title: `What is working on ${data.label}`, body: 'Use these as signals for what to double down on next.' })}
            <div class="section-stack">${data.topContent.map((item) => insightCard({ eyebrow: data.label, title: item, body: 'Strong-performing placeholder content reference.', tone: 'good' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Recent posts', title: `Recent activity on ${data.label}`, body: 'Recent output helps leadership assess cadence and consistency.' })}
            <div class="section-stack">${data.recentPosts.map((item) => insightCard({ eyebrow: 'Recent post', title: item, body: 'Recent publishing placeholder reference.', tone: 'info' })).join('')}</div>
          </section>
        </div>

        ${commentaryCard({ title: commentary.title, data: commentary.data })}
      </div>
    `,
    charts: [
      entryChartSpec(data.charts.followers, `chart-${key}-followers`, `${data.label} audience`),
      entryChartSpec(data.charts.views, `chart-${key}-views`, `${data.label} views`),
      entryChartSpec(data.charts.engagement, `chart-${key}-engagement`, `${data.label} engagement`)
    ]
  };
}

function cmoWebsiteAnalyticsView() {
  const data = WORKSPACE_DATA.cmo.websiteAnalytics;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Website analytics', body: 'A Google Analytics-style executive dashboard focused on traffic quality, engagement, and conversion relevance.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="grid-4">${pairStats(data.metrics, 'Website analytics placeholder metric.')}</div>
        </section>

        ${pageQuestions('/cmo/website-analytics')}

        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Website Traffic', title: 'Traffic trend', canvasId: 'chart-website-traffic', meta: 'How website attention has moved over time.' })}
          ${chartCard({ eyebrow: 'Website Conversions', title: 'Bookings, enquiries, and sign-ups', canvasId: 'chart-website-conversions', meta: 'The clearest current conversion outputs.' })}
          ${chartCard({ eyebrow: 'Visitor Mix', title: 'Users vs new vs returning visitors', canvasId: 'chart-website-visitors-mix', meta: 'A quick view of visitor composition in the current demo scenario.' })}
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive readout', title: 'What this traffic means', body: 'Website traffic only matters if it leads to better-quality business outcomes.' })}
          <div class="grid-3">
            ${insightCard({ eyebrow: 'Summary', title: 'Traffic quality is improving', body: data.summary, tone: 'info' })}
            ${insightCard({ eyebrow: 'Commercial relevance', title: 'Bookings and enquiries matter most', body: 'This page keeps attention on the conversion signals most likely to matter commercially for EP Golf Studios.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Next step', title: 'Optimise conversion before chasing more traffic', body: 'The clearest next action is to improve booking and enquiry pathways around already-healthy attention.', tone: 'warn' })}
          </div>
        </section>
      </div>
    `,
    charts: [
      entryChartSpec(WORKSPACE_DATA.cmo.charts.websiteTraffic, 'chart-website-traffic', 'Website traffic'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.websiteConversions, 'chart-website-conversions', 'Website conversions'),
      { id: 'chart-website-visitors-mix', type: 'bar', labels: ['Users', 'New Users', 'Returning'], values: [18.9, 12.4, 6.5], label: 'Visitor mix', suffix: 'k' }
    ]
  };
}

function cmoEmailMarketingView() {
  const data = WORKSPACE_DATA.cmo.emailMarketing;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Email marketing', body: 'This executive email view frames list growth, campaign quality, and conversion usefulness rather than email volume alone.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="grid-4">${pairStats(data.metrics, 'Email marketing placeholder metric.')}</div>
        </section>

        ${pageQuestions('/cmo/email-marketing')}

        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Subscribers', title: 'Subscriber growth over time', canvasId: 'chart-email-growth', meta: 'How the owned audience is compounding.' })}
          ${chartCard({ eyebrow: 'Email Performance', title: 'Open, click, and unsubscribe rates', canvasId: 'chart-email-performance', meta: 'A quick executive view of campaign quality.' })}
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Best performing campaign', title: data.bestCampaign, body: 'This is the current benchmark for the kind of email content that appears to resonate best.' })}
            ${insightCard({ eyebrow: 'Why it matters', title: 'Use the best campaign as a model', body: 'High-performing email content should influence what gets repurposed, expanded, or reused in future sends.', tone: 'good' })}
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Lowest performing campaign', title: data.worstCampaign, body: 'This gives leadership a clear signal about what may need reframing or deprioritisation.' })}
            ${insightCard({ eyebrow: 'Risk', title: 'Email can look stable while underperforming strategically', body: data.summary, tone: 'warn' })}
          </section>
        </div>
      </div>
    `,
    charts: [entryChartSpec(WORKSPACE_DATA.cmo.charts.emailGrowth, 'chart-email-growth', 'Subscriber growth'), entryChartSpec(WORKSPACE_DATA.cmo.charts.emailPerformance, 'chart-email-performance', 'Email performance')]
  };
}

function cmoCampaignPerformanceView() {
  const data = WORKSPACE_DATA.cmo.campaignPerformance;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Campaign performance', body: 'Campaigns should be evaluated on commercial usefulness, engagement quality, and whether they deserve more effort next.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="grid-4">
            ${statCard({ iconName: 'sparkles', label: 'Active Campaigns', value: String(data.activeCampaigns), body: 'Currently live mock campaigns.' })}
            ${statCard({ iconName: 'check-circle', label: 'Completed Campaigns', value: String(data.completedCampaigns), body: 'Placeholder completed campaign count.' })}
            ${statCard({ iconName: 'trending-up', label: 'Campaign ROI', value: data.roi, body: 'Average return across the current mock campaign set.' })}
            ${statCard({ iconName: 'target', label: 'Leads Generated', value: data.leads, body: 'Combined campaign-driven lead signal.' })}
            ${statCard({ iconName: 'coins', label: 'Revenue Attribution', value: data.revenueAttribution, body: 'Placeholder attributed revenue view.' })}
            ${statCard({ iconName: 'grid', label: 'Conversion Rate', value: data.conversionRate, body: 'Combined campaign conversion performance.' })}
            ${statCard({ iconName: 'pulse', label: 'Engagement', value: data.engagement, body: 'Combined engagement output from live and completed campaigns.' })}
          </div>
        </section>

        ${pageQuestions('/cmo/campaign-performance')}

        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Campaign ROI', title: 'Return by campaign', canvasId: 'chart-campaign-roi', meta: 'Which campaigns are generating the strongest return.' })}
          ${chartCard({ eyebrow: 'Lead generation', title: 'Leads by campaign', canvasId: 'chart-campaign-leads', meta: 'A side-by-side view of campaign lead generation.' })}
          ${chartCard({ eyebrow: 'Conversion rate', title: 'Conversion by campaign', canvasId: 'chart-campaign-conversion', meta: 'A quick comparison of conversion quality by campaign.' })}
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Campaign register', title: 'Current mock campaign set', body: 'Each campaign is framed as a strategic asset, not just a line in a report.' })}
          <div class="section-stack">
            ${data.campaigns
              .map(
                (campaign) => registerRow({
                  kicker: `${pill(campaign.stage, campaign.stage === 'Active' ? 'good' : 'neutral')}${pill(campaign.roi, 'info')}`,
                  title: campaign.title,
                  body: `Leads ${campaign.leads} · Revenue ${campaign.revenue} · Conversion ${campaign.conversion} · Engagement ${campaign.engagement}.`,
                  extra: `
                    <div class="grid-4">
                      ${statCard({ iconName: 'trending-up', label: 'ROI', value: campaign.roi, body: 'Placeholder return multiple.' })}
                      ${statCard({ iconName: 'target', label: 'Leads', value: campaign.leads, body: 'Campaign lead generation signal.' })}
                      ${statCard({ iconName: 'coins', label: 'Revenue', value: campaign.revenue, body: 'Placeholder attributed revenue.' })}
                      ${statCard({ iconName: 'pulse', label: 'Engagement', value: campaign.engagement, body: `Conversion ${campaign.conversion}` })}
                    </div>
                  `
                })
              )
              .join('')}
          </div>
        </section>
      </div>
    `,
    charts: [
      entryChartSpec(WORKSPACE_DATA.cmo.charts.campaignROI, 'chart-campaign-roi', 'Campaign ROI'),
      { id: 'chart-campaign-leads', type: 'bar', labels: data.campaigns.map((item) => item.title), values: data.campaigns.map((item) => Number.parseFloat(item.leads)), label: 'Leads', suffix: '' },
      { id: 'chart-campaign-conversion', type: 'bar', labels: data.campaigns.map((item) => item.title), values: data.campaigns.map((item) => Number.parseFloat(item.conversion)), label: 'Conversion rate', suffix: '%' }
    ]
  };
}

function cmoContentLibraryView() {
  const query = state.contentQuery.trim().toLowerCase();
  const items = WORKSPACE_DATA.cmo.contentLibrary.items.filter((item) => {
    if (!query) return true;
    return [item.title, item.type, item.platform, item.rating, item.publishDate].join(' ').toLowerCase().includes(query);
  });

  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Content library', body: 'A searchable content inventory for videos, posts, blog articles, shorts, and email campaigns.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          ${searchRow({ id: 'content-library-search', value: state.contentQuery, placeholder: 'Search content by title, type, platform, or rating…', label: 'Search content library' })}
        </section>

        ${pageQuestions('/cmo/content-library')}

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Library results', title: `${items.length} content item${items.length === 1 ? '' : 's'}`, body: 'This page is intentionally searchable so future live content feeds can slot into the same structure cleanly.' })}
          <div class="tile-grid">
            ${items
              .map((item) => insightCard({
                eyebrow: `${item.type} · ${item.platform}`,
                title: item.title,
                body: `Published ${item.publishDate}. ${item.views} views and ${item.engagement} engagement. Performance rating ${item.rating}.`,
                tone: cmoToneFromRating(item.rating)
              }))
              .join('')}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function cmoCompetitorAnalysisView() {
  const data = WORKSPACE_DATA.cmo.competitorAnalysis;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Competitor analysis', body: 'A placeholder executive comparison surface for future competitive intelligence.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
        </section>

        ${pageQuestions('/cmo/competitor-analysis')}

        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Estimated Growth', title: 'Competitor growth comparison', canvasId: 'chart-competitor-growth', meta: 'Estimated growth across the tracked competitor set.' })}
          ${chartCard({ eyebrow: 'Content Frequency', title: 'Publishing intensity comparison', canvasId: 'chart-competitor-frequency', meta: 'A simple proxy for market content pressure.' })}
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Tracked competitors', title: 'Current placeholder competitor set', body: 'This is mock-only and designed to prepare the architecture for future live data replacement.' })}
          <div class="section-stack">
            ${data.competitors
              .map(
                (item) => registerRow({
                  kicker: `${pill(`#${item.rank}`, 'info')}${pill(item.engagement, item.engagement === 'Strong' ? 'good' : 'neutral')}`,
                  title: item.name,
                  body: `Estimated growth ${item.growth} · Content frequency ${item.frequency} · Opportunity: ${item.opportunity}`,
                  extra: `
                    <div class="grid-2">
                      ${insightCard({ eyebrow: 'Opportunity', title: 'Where EP can win', body: item.opportunity, tone: 'good' })}
                      ${insightCard({ eyebrow: 'Threat', title: 'What to watch', body: item.threat, tone: 'risk' })}
                    </div>
                  `
                })
              )
              .join('')}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Opportunities', title: 'Strategic openings', body: 'Use competitor analysis to sharpen positioning rather than chase volume blindly.' })}
            <div class="section-stack">${data.opportunities.map((item) => insightCard({ eyebrow: 'Opportunity', title: item, body: 'Positioning or content opportunity placeholder.', tone: 'good' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Threats', title: 'Where the market could outpace EP', body: 'Competitive pressure should be visible before it becomes strategically expensive.' })}
            <div class="section-stack">${data.threats.map((item) => insightCard({ eyebrow: 'Threat', title: item, body: 'Strategic watchpoint placeholder.', tone: 'risk' })).join('')}</div>
          </section>
        </div>
      </div>
    `,
    charts: [
      { id: 'chart-competitor-growth', type: 'bar', labels: data.competitors.map((item) => item.name), values: data.competitors.map((item) => Number.parseFloat(item.growth)), label: 'Estimated growth', suffix: '%' },
      { id: 'chart-competitor-frequency', type: 'bar', labels: data.competitors.map((item) => item.name), values: data.competitors.map((item) => (item.frequency === 'High' ? 3 : item.frequency === 'Medium' ? 2 : 1)), label: 'Content frequency', suffix: '' }
    ]
  };
}

function cmoMarketingCalendarView() {
  const data = WORKSPACE_DATA.cmo.marketingCalendar;
  const typeCounts = data.events.reduce((accumulator, item) => {
    accumulator[item.type] = (accumulator[item.type] || 0) + 1;
    return accumulator;
  }, {});
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Marketing calendar', body: 'A planning surface for campaigns, content, launches, and events.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="grid-4">
            ${statCard({ iconName: 'calendar', label: 'Upcoming Items', value: String(data.events.length), body: 'Current upcoming placeholder calendar entries.' })}
            ${statCard({ iconName: 'sparkles', label: 'Videos', value: String(typeCounts.Video || 0), body: 'Video items currently staged.' })}
            ${statCard({ iconName: 'book-open', label: 'Email Campaigns', value: String(typeCounts['Email Campaign'] || 0), body: 'Email items currently staged.' })}
            ${statCard({ iconName: 'grid', label: 'Social Posts', value: String(typeCounts['Social Posts'] || 0), body: 'Social publishing placeholder count.' })}
          </div>
        </section>

        ${pageQuestions('/cmo/marketing-calendar')}

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Calendar view', title: 'Upcoming marketing work', body: 'This is intentionally designed as a planning surface rather than an execution tool.' })}
          <div class="section-stack">
            ${data.events.map((item) => registerRow({
              kicker: `${pill(item.date, 'info')}${pill(item.type, 'neutral')}${pill(item.status, item.status.includes('approval') ? 'warn' : item.status === 'Scheduled' || item.status === 'Ready for approval' ? 'good' : 'info')}`,
              title: item.title,
              body: `${item.type} owned by ${item.owner}. Current status: ${item.status}.`,
              extra: `${insightCard({ eyebrow: 'Planning note', title: 'Calendar placeholder', body: 'This entry is here to show how future content, launch, and campaign scheduling will surface in the CMO workspace.', tone: 'neutral' })}`
            })).join('')}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function cmoAiAdvisorView() {
  const data = WORKSPACE_DATA.cmo.aiMarketingAdvisor;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'AI Marketing Advisor', body: 'A dedicated marketing strategy workspace for recommendations, risks, opportunities, and staged actions.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
        </section>

        ${commentaryCard({ title: data.executiveSummary.title, data: data.executiveSummary })}
        ${pageQuestions('/cmo/ai-marketing-advisor')}

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Weekly Marketing Briefing', title: 'Current AI readout', body: 'This is the kind of weekly briefing the future AI layer should generate across channels.' })}
            <div class="snapshot-panel"><h3>Weekly briefing</h3><p>${escapeHtml(data.weeklyBriefing)}</p></div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Suggested Actions', title: 'Approval-first next steps', body: 'No actions execute automatically. Recommendations are staged for executive review only.' })}
            <div class="section-stack">${data.suggestedActions.map((item) => insightCard({ eyebrow: 'Suggested action', title: item, body: 'Stage for review before anything operational happens.', tone: 'warn' })).join('')}</div>
          </section>
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Recommended Campaigns', title: 'High-potential campaign ideas', body: 'Each recommendation includes confidence, impact, evidence, risks, and alternatives.' })}
          <div class="section-stack">
            ${data.recommendedCampaigns.map((item) => registerRow({
              kicker: `${pill(item.confidence, item.confidence === 'High' ? 'good' : 'warn')}${pill(item.impact, item.impact === 'High' ? 'good' : 'info')}`,
              title: item.title,
              body: item.evidence,
              extra: `
                <div class="grid-3">
                  ${insightCard({ eyebrow: 'Supporting evidence', title: 'Why it is recommended', body: item.evidence, tone: 'info' })}
                  ${insightCard({ eyebrow: 'Risks', title: 'What could go wrong', body: item.risks, tone: 'risk' })}
                  ${insightCard({ eyebrow: 'Alternative options', title: 'Other routes', body: item.alternatives, tone: 'neutral' })}
                </div>
              `
            })).join('')}
          </div>
        </section>

        <div class="settings-grid">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Content Ideas', title: 'What marketing could create next' })}
            <div class="section-stack">${data.contentIdeas.map((item) => insightCard({ eyebrow: 'Content idea', title: item, body: 'Future content candidate staged by the advisor.', tone: 'good' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'SEO Suggestions', title: 'Search visibility ideas' })}
            <div class="section-stack">${data.seoSuggestions.map((item) => insightCard({ eyebrow: 'SEO', title: item, body: 'Placeholder organic search recommendation.', tone: 'info' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'AEO Suggestions', title: 'Answer engine opportunities' })}
            <div class="section-stack">${data.aeoSuggestions.map((item) => insightCard({ eyebrow: 'AEO', title: item, body: 'Placeholder answer-engine optimisation recommendation.', tone: 'info' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Video Ideas', title: 'Next high-potential video formats' })}
            <div class="section-stack">${data.videoIdeas.map((item) => insightCard({ eyebrow: 'Video', title: item, body: 'Future video concept placeholder.', tone: 'good' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Opportunities', title: 'Where the AI layer sees leverage' })}
            <div class="section-stack">${data.opportunities.map((item) => insightCard({ eyebrow: 'Opportunity', title: item, body: 'Advisor-identified leverage point.', tone: 'good' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Risks', title: 'What the AI layer is worried about' })}
            <div class="section-stack">${data.risks.map((item) => insightCard({ eyebrow: 'Risk', title: item, body: 'Advisor-identified risk to performance quality.', tone: 'risk' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Missing Information', title: 'What would improve confidence' })}
            <div class="section-stack">${data.missingInformation.map((item) => insightCard({ eyebrow: 'Missing information', title: item, body: 'This gap limits confidence until future integrations exist.', tone: 'warn' })).join('')}</div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function cmoReportsView() {
  const data = WORKSPACE_DATA.cmo.reports;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Marketing reports', body: 'A dedicated reporting surface for channel summaries, weekly briefings, and campaign-level executive packs.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="snapshot-panel">
            <h3>Marketing reporting should package a narrative, not just numbers.</h3>
            <p>${escapeHtml(data.summary)}</p>
          </div>
        </section>

        ${pageQuestions('/cmo/reports')}

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Reporting sections', title: 'What the marketing report pack contains', body: 'This keeps the marketing narrative structured and easy to present.' })}
          <div class="tile-grid">${data.sections.map((item) => insightCard({ eyebrow: 'Report section', title: item, body: 'This section is ready to evolve into a reusable reporting component.', tone: 'neutral' })).join('')}</div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Shared report routes', title: 'Cross-functional reporting links', body: 'The CMO workspace plugs into the wider shared reporting layer when needed.' })}
            <div class="section-stack">
              ${insightCard({ eyebrow: 'Shared reports', title: 'Weekly Briefings', body: 'Open the shared Sunday briefing view when leadership wants the cross-functional version.', tone: 'info' })}
              <button type="button" class="quick-action-button" data-route="/reports/weekly-briefings">Open Weekly Briefings ${icon('arrowRight')}</button>
              <button type="button" class="quick-action-button" data-route="/reports/cmo-reports">Open Shared CMO Reports ${icon('arrowRight')}</button>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Approval-first reporting', title: 'Reports should lead to reviewable actions', body: 'The point of a report is to clarify what needs human judgment next.' })}
            <div class="section-stack">${marketingApprovals(3).map((entry) => approvalCard(entry)).join('')}</div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function cmoSettingsView() {
  const data = WORKSPACE_DATA.cmo.settings;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Marketing settings', body: 'This placeholder settings area makes the future marketing operating model explicit before anything goes live.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="settings-grid">${data.placeholders.map((item) => integrationTile(item)).join('')}</div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Future marketing integrations', title: 'What this module is architected to connect later', body: 'Nothing here is connected in this sprint. These are future integration targets only.' })}
          <div class="tile-grid">${data.integrations.map((item) => integrationTile(item)).join('')}</div>
        </section>
      </div>
    `,
    charts: []
  };
}

function placeholderModuleView(route) {
  const data = WORKSPACE_DATA.placeholders[route];
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
  const groups = Object.entries(WORKSPACE_DATA.approvals.groups);
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
            ${WORKSPACE_DATA.reports.overview
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
  const data = WORKSPACE_DATA.reports.intelligence.weeklyBriefing;
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Weekly Briefings', title: 'Sunday Executive Briefing', body: 'A board-style briefing generated from structured executive insights.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="grid-4">
            ${statCard({ iconName: 'pulse', label: 'Business health score', value: String(WORKSPACE_DATA.intelligence.health.overall.score), body: WORKSPACE_DATA.intelligence.health.overall.label })}
            ${statCard({ iconName: 'trending-up', label: 'Revenue', value: WORKSPACE_DATA.cfo.metrics[0].value, body: WORKSPACE_DATA.cfo.metrics[0].detail })}
            ${statCard({ iconName: 'coins', label: 'Profit', value: WORKSPACE_DATA.cfo.metrics[1].value, body: WORKSPACE_DATA.cfo.metrics[1].detail })}
            ${statCard({ iconName: 'check-circle', label: 'Recommendations', value: String(WORKSPACE_DATA.intelligence.recommendations.length), body: 'Generated and priority-ranked by the engine.' })}
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
  const data = WORKSPACE_DATA.reports.monthly;
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
  const data = WORKSPACE_DATA.ceo;
  const slides = boardSlides();
  const slide = slides[state.boardSlide] || slides[0];
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Board Meeting Mode', title: data.boardMeeting.title, body: 'A presentation-style leadership experience designed for a TV, projector, or board discussion.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="board-hero">
            <div class="summary-banner">
              <div class="hero-title">${escapeHtml(slide.title)}</div>
              <p class="hero-summary">${escapeHtml(slide.body)}</p>
            </div>
            <div class="score-tile">
              <div class="label">Slide ${state.boardSlide + 1} of ${slides.length}</div>
              <strong class="score-value">${data.businessHealthScore.overall}</strong>
              <div class="score-note">${escapeHtml(data.businessHealthScore.direction)}</div>
            </div>
          </div>
          <div class="board-slide-bar">
            <div class="chip-list">${slides.map((item, index) => `<button type="button" class="sidebar-chip" data-board-slide="${index}">${index + 1}. ${escapeHtml(item.eyebrow)}</button>`).join('')}</div>
            <div class="page-pillbar">
              <button type="button" class="chip-button" data-board-step="-1">${icon('chevronLeft')}Previous</button>
              <button type="button" class="chip-button" data-board-step="1">Next${icon('chevronRight')}</button>
            </div>
          </div>
          <section class="panel board-focus-panel">
            <div class="eyebrow">${escapeHtml(slide.eyebrow)}</div>
            <h3>${escapeHtml(slide.title)}</h3>
            <p>${escapeHtml(slide.body)}</p>
            ${slide.html}
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Board conversation prompts', title: 'Questions worth asking', body: 'Use the keyboard: ← / → or Page Up / Page Down to move through the deck.' })}
            <ul class="board-question-list">${WORKSPACE_DATA.aiAssistant.askWorkspace.prompts.map((item) => `<li><strong>${escapeHtml(item.question)}</strong> — ${escapeHtml(item.answer)}</li>`).join('')}</ul>
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
  const data = WORKSPACE_DATA.aiAssistant.overview;
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
              <h3>${escapeHtml(data.status)}</h3>
              <p>No AI actions execute automatically. The value here is decision support, conversational clarity, and explicit reasoning.</p>
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
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Ask EP Intelligence', title: 'Example executive conversations', body: WORKSPACE_DATA.aiAssistant.askWorkspace.intro })}
          <div class="tile-grid">
            ${WORKSPACE_DATA.aiAssistant.askWorkspace.prompts.map((item) => insightCard({ eyebrow: item.question, title: 'AI response', body: item.answer, tone: 'neutral' })).join('')}
          </div>
          <div class="chip-list">${WORKSPACE_DATA.aiAssistant.askWorkspace.suggestedFollowUps.map((item) => `<button type="button" class="follow-up-chip" data-follow-up="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div>
        </section>
        ${pageQuestions('/ai-assistant')}
      </div>
    `,
    charts: []
  };
}

function aiAssistantAskView() {
  const data = WORKSPACE_DATA.aiAssistant.askWorkspace;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'AI Assistant', title: 'Ask EP Intelligence', body: data.intro })}
          ${renderRoutePillbar(SUBNAV.aiAssistant)}
          <div class="snapshot-panel">
            <h3>Executive questioning workspace</h3>
            <p>This is designed to feel like asking an AI Chief of Staff a direct question and receiving a concise, decision-ready answer.</p>
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Conversation examples', title: 'High-value CEO questions', body: 'These examples show how the AI layer should answer with synthesis, not raw metrics.' })}
          <div class="section-stack">
            ${data.prompts.map((item) => registerRow({ kicker: pill('Executive question', 'info'), title: item.question, body: item.answer })).join('')}
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Suggested follow-ups', title: 'What the CEO could ask next', body: 'Follow-up prompts keep the conversation moving toward decisions rather than curiosity alone.' })}
          <div class="chip-list">${data.suggestedFollowUps.map((item) => `<button type="button" class="follow-up-chip" data-follow-up="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div>
        </section>
      </div>
    `,
    charts: []
  };
}

function aiAssistantPlaceholderView(route) {
  const data = WORKSPACE_DATA.aiAssistant.pages[route];
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
  const config = WORKSPACE_DATA.settings.configuration;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Settings', title: 'Integration framework overview', body: 'Sprint 6 introduces a provider/service/config architecture while keeping the whole product in Demo Mode.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'settings', label: 'Active Mode', value: config.activeMode.label, body: config.activeMode.description })}
            ${statCard({ iconName: 'grid', label: 'Provider Strategy', value: APP_RUNTIME.config.providerStrategy, body: 'Provider + service + contract layers are now in place.' })}
            ${statCard({ iconName: 'check-circle', label: 'Domain Bindings', value: String(config.domainBindings.length), body: 'Every service domain currently resolves to Demo Mode mock providers.' })}
            ${statCard({ iconName: 'sparkles', label: 'Registered Integrations', value: String(WORKSPACE_DATA.settings.integrationStatus.length), body: 'Future integration registration points are defined without any live connections.' })}
          </div>
        </section>

        <div class="grid-3">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Integration Status', title: 'Health monitoring view', body: 'See the placeholder status for every future integration target.' })}
            <div class="snapshot-panel">
              <h3>All integrations remain in Demo Mode</h3>
              <p>The architecture is now ready for provider-by-provider activation later without rewriting the executive UI.</p>
              <button type="button" class="quick-action-button" data-route="/settings/integrations">Open Integration Status ${icon('arrowRight')}</button>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Configuration', title: 'Mode and provider bindings', body: 'Inspect runtime mode, available modes, and active provider-domain mapping.' })}
            <div class="snapshot-panel">
              <h3>${escapeHtml(config.activeMode.label)}</h3>
              <p>${escapeHtml(APP_RUNTIME.config.notes)}</p>
              <button type="button" class="quick-action-button" data-route="/settings/configuration">Open Demo Mode Configuration ${icon('arrowRight')}</button>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Provider Architecture', title: 'Layered system design', body: 'Presentation, service, and provider responsibilities are now separated clearly.' })}
            <div class="snapshot-panel">
              <h3>${escapeHtml(APP_RUNTIME.config.architectureVersion)}</h3>
              <p>Future APIs should now be a plug-in exercise rather than a dashboard rewrite.</p>
              <button type="button" class="quick-action-button" data-route="/settings/provider-architecture">Open Provider Architecture ${icon('arrowRight')}</button>
            </div>
          </section>
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Future connection placeholders', title: 'Connected intelligence sources', body: 'Each item below is intentionally a placeholder for future connection.' })}
          <div class="tile-grid">${WORKSPACE_DATA.settings.integrations.map((item) => integrationTile(item)).join('')}</div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Keyboard shortcuts', title: 'Fast navigation', body: 'Designed to make the workspace feel fast and executive-friendly.' })}
          <div class="shortcut-grid">${WORKSPACE_DATA.shortcuts.map((item) => `<div class="command-chip"><strong>${escapeHtml(item.keys)}</strong><span>${escapeHtml(item.action)}</span></div>`).join('')}</div>
        </section>
      </div>
    `,
    charts: []
  };
}

function settingsIntegrationStatusView() {
  const groups = Object.entries(
    WORKSPACE_DATA.settings.integrationStatus.reduce((acc, entry) => {
      acc[entry.group] = acc[entry.group] || [];
      acc[entry.group].push(entry);
      return acc;
    }, {})
  );
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Integration Status', title: 'Health monitoring', body: 'Everything is still running in Demo Mode, but every future integration now has a registration point and status surface.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: 'Current state', value: 'Demo Mode', body: 'No network requests, credentials, or external systems are active in this sprint.' })}
            ${statCard({ iconName: 'grid', label: 'Registered integrations', value: String(WORKSPACE_DATA.settings.integrationStatus.length), body: 'Placeholder status cards now exist for every future integration target.' })}
            ${statCard({ iconName: 'settings', label: 'Provider classes', value: String(APP_RUNTIME.providers.length), body: 'MockProvider is active; future providers are registered as placeholders.' })}
            ${statCard({ iconName: 'sparkles', label: 'Goal', value: 'Plug-in ready', body: 'Future live connections should swap providers without requiring UI rewrites.' })}
          </div>
        </section>

        <div class="settings-grid">
          ${groups
            .map(
              ([group, entries]) => `
                <section class="panel">
                  ${sectionHeader({ eyebrow: 'Integration group', title: group, body: 'Every entry remains in Demo Mode until a future live provider is implemented.' })}
                  <div class="section-stack">
                    ${entries
                      .map((entry) =>
                        registerRow({
                          kicker: `${pill(entry.status, 'info')}${pill(entry.provider, 'neutral')}${pill(entry.service, 'good')}`,
                          title: entry.label,
                          body: entry.notes,
                          meta: `Registration key: ${entry.id}`
                        })
                      )
                      .join('')}
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

function settingsConfigurationView() {
  const config = WORKSPACE_DATA.settings.configuration;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Demo Mode Configuration', title: 'Runtime mode and provider bindings', body: 'The app can now distinguish between demo architecture and future live architecture without changing the UI.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'settings', label: 'Active mode', value: config.activeMode.label, body: config.activeMode.description })}
            ${statCard({ iconName: 'grid', label: 'Default provider', value: config.defaultProviderKey, body: 'Every active domain currently resolves to the mock provider.' })}
            ${statCard({ iconName: 'shield', label: 'Live integrations', value: config.activeMode.allowLiveIntegrations ? 'Allowed' : 'Disabled', body: 'Live connections remain intentionally disabled in Sprint 6.' })}
            ${statCard({ iconName: 'book-open', label: 'Architecture version', value: APP_RUNTIME.config.architectureVersion, body: 'This sprint introduces the first provider/service/config abstraction layer.' })}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Available modes', title: 'Current and future runtime states', body: 'Only Demo Mode is active today, but Future Live Mode is explicitly reserved in config.' })}
            <div class="section-stack">
              ${config.availableModes
                .map((mode) =>
                  insightCard({
                    eyebrow: mode.available ? 'Available now' : 'Reserved for later',
                    title: mode.label,
                    body: mode.description,
                    tone: mode.available ? 'good' : 'warn'
                  })
                )
                .join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Domain bindings', title: 'Which provider each service domain uses', body: 'In Demo Mode, every domain binds to MockProvider. Future live work should update these bindings, not the dashboards.' })}
            <div class="section-stack">
              ${config.domainBindings
                .map((binding) =>
                  registerRow({
                    kicker: `${pill(binding.domain, 'info')}${pill(binding.provider, 'neutral')}${pill(binding.mode, 'good')}`,
                    title: `${binding.domain} → ${binding.provider}`,
                    body: 'This binding is the swap-point for future integration work.',
                    meta: `Provider key: ${binding.providerKey}`
                  })
                )
                .join('')}
            </div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function settingsProviderArchitectureView() {
  const architecture = WORKSPACE_DATA.settings.architecture;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Provider Architecture', title: 'Presentation, service, and provider layers', body: 'This is the abstraction that should let EP Intelligence adopt future APIs without rewriting the executive dashboards.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-3">
            ${architecture.layers.map((layer) => insightCard({ eyebrow: 'System layer', title: layer.title, body: layer.body, tone: layer.tone })).join('')}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Data flow', title: 'How information now moves through the app', body: 'The UI consumes shaped service outputs instead of raw datasets.' })}
            <div class="section-stack">${architecture.flow.map((item) => insightCard({ eyebrow: 'Flow step', title: item, body: 'This is an explicit handoff point in the integration architecture.', tone: 'neutral' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Architecture health', title: 'Current framework coverage', body: 'These are lightweight counts proving the framework is already plugged into the working product.' })}
            <div class="grid-3">
              ${statCard({ iconName: 'home', label: 'CEO score', value: String(architecture.health.ceo), body: 'CEO dashboard still renders through the new data path.' })}
              ${statCard({ iconName: 'coins', label: 'CFO score', value: String(architecture.health.cfo), body: 'CFO workspace remains functional through FinanceService.' })}
              ${statCard({ iconName: 'sparkles', label: 'CMO score', value: String(architecture.health.cmo), body: 'CMO workspace remains functional through MarketingService.' })}
              ${statCard({ iconName: 'check-circle', label: 'Approval groups', value: String(architecture.health.approvals), body: 'ApprovalService still powers grouped approvals.' })}
              ${statCard({ iconName: 'presentation', label: 'Report routes', value: String(architecture.health.reports), body: 'ReportService powers shared reporting outputs.' })}
              ${statCard({ iconName: 'calendar', label: 'Timeline events', value: String(architecture.health.timeline), body: 'TimelineService provides reusable timeline shaping.' })}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Service responsibilities', title: 'Reusable business logic layer', body: 'These services are the new contract between the UI and future integrations.' })}
            <div class="section-stack">${architecture.services.map((service) => insightCard({ eyebrow: 'Service', title: service.title, body: service.body, tone: 'info' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Provider catalogue', title: 'Current and future providers', body: 'Only MockProvider is active today. The rest are placeholder registration points for future work.' })}
            <div class="section-stack">${architecture.providers.map((provider) => registerRow({ kicker: `${pill(provider.status, provider.type === 'active' ? 'good' : 'warn')}${pill(provider.label, 'neutral')}`, title: provider.key, body: provider.notes, meta: `Domains: ${(provider.domains || []).join(', ') || 'all demo domains'}` })).join('')}</div>
          </section>
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Naming conventions', title: 'How future integrations should be added', body: 'This keeps future API onboarding consistent and reduces rewrite risk.' })}
          <div class="tile-grid">${architecture.conventions.map((item) => insightCard({ eyebrow: 'Convention', title: item, body: 'Follow this rule when adding future providers, services, or integrations.', tone: 'neutral' })).join('')}</div>
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
  '/cmo': cmoDashboardView,
  '/cmo/social-media-overview': cmoSocialOverviewView,
  '/cmo/youtube': () => cmoPlatformView('youtube', '/cmo/youtube'),
  '/cmo/instagram': () => cmoPlatformView('instagram', '/cmo/instagram'),
  '/cmo/facebook': () => cmoPlatformView('facebook', '/cmo/facebook'),
  '/cmo/linkedin': () => cmoPlatformView('linkedin', '/cmo/linkedin'),
  '/cmo/x': () => cmoPlatformView('x', '/cmo/x'),
  '/cmo/website-analytics': cmoWebsiteAnalyticsView,
  '/cmo/email-marketing': cmoEmailMarketingView,
  '/cmo/campaign-performance': cmoCampaignPerformanceView,
  '/cmo/content-library': cmoContentLibraryView,
  '/cmo/competitor-analysis': cmoCompetitorAnalysisView,
  '/cmo/marketing-calendar': cmoMarketingCalendarView,
  '/cmo/ai-marketing-advisor': cmoAiAdvisorView,
  '/cmo/reports': cmoReportsView,
  '/cmo/settings': cmoSettingsView,
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
  '/reports/cfo-reports': () => reportPlaceholderView('/reports/cfo-reports', 'CFO Reports', WORKSPACE_DATA.reports.cfoReports),
  '/reports/cmo-reports': () => reportPlaceholderView('/reports/cmo-reports', 'CMO Reports', WORKSPACE_DATA.reports.cmoReports),
  '/reports/ceo-reports': () => reportPlaceholderView('/reports/ceo-reports', 'CEO Reports', WORKSPACE_DATA.reports.ceoReports),
  '/ai-assistant': aiAssistantOverviewView,
  '/ai-assistant/ask': aiAssistantAskView,
  '/ai-assistant/executive-briefing': () => aiAssistantPlaceholderView('/ai-assistant/executive-briefing'),
  '/ai-assistant/follow-up-questions': () => aiAssistantPlaceholderView('/ai-assistant/follow-up-questions'),
  '/ai-assistant/suggested-actions': () => aiAssistantPlaceholderView('/ai-assistant/suggested-actions'),
  '/ai-assistant/assumptions': () => aiAssistantPlaceholderView('/ai-assistant/assumptions'),
  '/ai-assistant/missing-information': () => aiAssistantPlaceholderView('/ai-assistant/missing-information'),
  '/ai-assistant/memory-context': () => aiAssistantPlaceholderView('/ai-assistant/memory-context'),
  '/settings': settingsView,
  '/settings/integrations': settingsIntegrationStatusView,
  '/settings/configuration': settingsConfigurationView,
  '/settings/provider-architecture': settingsProviderArchitectureView
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
