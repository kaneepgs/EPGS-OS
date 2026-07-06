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

const STORAGE_KEY = `ep-intelligence.workspace.${APP_RUNTIME.release.version}`;
const VALID_ROUTES = new Set(Object.keys(ROUTE_META));

const appShell = document.getElementById('app-shell');
const primaryNav = document.getElementById('primary-nav');
const secondaryNav = document.getElementById('secondary-nav');
const sidebarFavourites = document.getElementById('sidebar-favourites');
const sidebarRecent = document.getElementById('sidebar-recent');
const sidebarFooter = document.getElementById('sidebar-footer');
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
  memoryQuery: '',
  selectedActionId: '',
  boardSlide: 0,
  favourites: ['/ceo', '/executive-action-centre', '/reports/board-meeting'],
  recent: ['/ceo', '/executive-action-centre', '/approvals']
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
  if (key === '/executive-inbox') return SUBNAV.executiveInbox;
  if (key === '/executive-action-centre') return SUBNAV.executiveActionCentre;
  if (key === '/executive-copilot' || key === '/ai-assistant') return SUBNAV.executiveCopilot;
  if (key === '/cfo') return SUBNAV.cfo;
  if (key === '/cmo') return SUBNAV.cmo;
  if (key === '/operations') return [['/operations', 'Operations Calendar']];
  if (key === '/reports') return SUBNAV.reports;
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
      recent: state.recent,
      selectedActionId: state.selectedActionId
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
  if (state.selectedActionId) params.set('action', state.selectedActionId);
  else params.delete('action');
  history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const route = params.get('route');
  if (route && VALID_ROUTES.has(route)) state.route = route;
  state.selectedActionId = params.get('action') || state.selectedActionId;
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
  const parts = ['EP Hub'];
  if (meta.parentLabel && meta.parentLabel !== meta.title) parts.push(meta.parentLabel);
  parts.push(meta.title);
  return parts;
}

function routeLabel(route) {
  return metaFor(route).title;
}

function selectedAction() {
  const actions = WORKSPACE_DATA.actions?.actions || [];
  return actions.find((item) => item.id === state.selectedActionId) || actions[0] || null;
}

function openActionDetail(actionId) {
  state.selectedActionId = actionId;
  setRoute('/executive-action-centre/action-detail');
}

function memoryStatusTone(status = '') {
  const value = String(status).toLowerCase();
  if (value.includes('high') || value.includes('severe')) return 'risk';
  if (value.includes('completed') || value.includes('on track')) return 'good';
  if (value.includes('active') || value.includes('planned')) return 'info';
  if (value.includes('risk') || value.includes('review')) return 'warn';
  return 'neutral';
}

function globalSearchEntries(query = '') {
  const needle = query.trim().toLowerCase();
  const routeEntries = Object.entries(ROUTE_META).map(([route, meta]) => ({
    id: `route-${route}`,
    type: 'Route',
    title: meta.title,
    body: meta.subtitle,
    route,
    meta: meta.module
  }));
  const memoryEntries = WORKSPACE_DATA.memory.searchIndex || [];
  const communicationsEntries = WORKSPACE_DATA.communications.searchIndex || [];
  const operationsEntries = WORKSPACE_DATA.operations.searchIndex || [];
  const actionEntries = WORKSPACE_DATA.actions.searchIndex || [];
  const combined = [...routeEntries, ...actionEntries, ...communicationsEntries, ...operationsEntries, ...memoryEntries];
  if (!needle) return combined.slice(0, 12);
  return combined.filter((item) => [item.title, item.body, item.meta, item.type, item.route].join(' ').toLowerCase().includes(needle)).slice(0, 12);
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
  document.title = `EP Hub — ${meta.title}`;
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

function renderSidebarFooter() {
  if (!sidebarFooter) return;
  const release = APP_RUNTIME.release;
  const overlayText = release.activeOverlays.length ? `Live overlays: ${release.activeOverlays.join(' + ')}.` : 'No live overlays active.';
  sidebarFooter.innerHTML = `${icon('check-circle')}<span><strong>${escapeHtml(release.displayName)}</strong> · Build ${escapeHtml(release.buildNumber)} · ${escapeHtml(release.environment)}.<br />${escapeHtml(overlayText)}</span>`;
}

function renderSidebar() {
  const visible = visibleTopLevelRoutes();
  primaryNav.innerHTML = visible
    .map(([route, label, iconName]) => navLink({ id: route, label, iconName, active: topLevelKey() === route, favourite: state.favourites.includes(route) }))
    .join('');

  const subnav = currentSubnav();
  const searchResults = state.navQuery.trim() ? globalSearchEntries(state.navQuery) : [];
  secondaryNav.innerHTML = [
    subnav.length
      ? `<div class="label">${escapeHtml(metaFor().parentLabel || metaFor().module)} pages</div>${subnav
          .map(([route, label]) => navLink({ id: route, label, iconName: 'arrowRight', active: isRouteActive(route), favourite: state.favourites.includes(route) }))
          .join('')}`
      : '',
    searchResults.length
      ? `<div class="label">Search results</div>${searchResults
          .map(
            (item) => `<button type="button" class="sidebar-chip" data-route="${escapeHtml(item.route)}">${icon('search')}${escapeHtml(item.title)}<span>${escapeHtml(item.type)}</span></button>`
          )
          .join('')}`
      : ''
  ]
    .filter(Boolean)
    .join('');

  renderSidebarMeta();
  renderSidebarFooter();

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
  const operations = WORKSPACE_DATA.operations;
  const actions = WORKSPACE_DATA.actions;
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
      key: 'communications',
      eyebrow: 'Executive Inbox',
      title: 'The inbox is now an executive operating surface',
      body: WORKSPACE_DATA.communications.summary.boardSummary,
      html: `
        <div class="grid-3">
          ${WORKSPACE_DATA.communications.widgets.slice(0, 6).map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
        </div>
        <div class="grid-2">
          ${WORKSPACE_DATA.communications.sections.slice(0, 2).map((section) => insightCard({ eyebrow: section.title, title: section.items[0]?.subject || 'No urgent items', body: section.items[0]?.aiSummary || section.body, tone: section.items[0]?.priority === 'High' ? 'warn' : 'info' })).join('')}
        </div>
      `
    },
    {
      key: 'operations',
      eyebrow: 'Operations Calendar',
      title: 'Capacity, workload, and scheduling risk are now visible',
      body: operations.summary.boardSummary,
      html: `
        <div class="grid-3">
          ${operations.widgets.slice(0, 6).map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
        </div>
        <div class="grid-2">
          ${operations.insightCards.slice(0, 2).map((item) => insightCard({ eyebrow: item.eyebrow, title: item.title, body: item.body, tone: item.tone || 'info' })).join('')}
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
      eyebrow: 'Executive Actions',
      title: 'What should be approved or acted on today',
      body: 'Board Mode now ends with a real operating queue rather than just general recommendations.',
      html: `
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Executive queue', title: 'Top action priorities', body: 'These are the actions currently leading the operating system.' })}
            <div class="section-stack">${actions.queues.urgent.slice(0, 4).map((item, index) => priorityCard({ index: index + 1, title: item.title, body: `${item.summary} Owner ${item.owner} · ${item.status}.`, tone: toneFromPriority(item.priority) })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Outstanding approvals', title: 'Approval backlog', body: 'Approval-stage actions remain visible and non-executing.' })}
            <div class="section-stack">${actions.queues.waitingForMe.slice(0, 4).map((item) => registerRow({ kicker: `${pill(item.status, memoryStatusTone(item.status))}${pill(item.category, 'info')}`, title: item.title, body: item.summary })).join('')}</div>
          </section>
        </div>
        <div class="grid-3">
          ${insightCard({ eyebrow: 'Business risks', title: `${ceo.executiveRisks.length} visible`, body: ceo.executiveRisks[0]?.title || 'No major risk registered.', tone: 'warn' })}
          ${insightCard({ eyebrow: 'Major decisions', title: ceo.recentDecisions?.[0]?.title || ceo.memory?.recentDecisions?.[0]?.title || 'Decision history active', body: ceo.memory?.recentDecisions?.[0]?.summary || 'Recent approved, rejected, and completed actions now feed Executive Memory.', tone: 'info' })}
          ${insightCard({ eyebrow: 'Department workload', title: actions.departmentWorkload[0]?.department || 'Workload view active', body: actions.departmentWorkload[0]?.summary || 'Department-level action workload is now available.', tone: 'good' })}
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

  pageContent.querySelectorAll('[data-action-id]').forEach((button) => {
    button.addEventListener('click', () => openActionDetail(button.dataset.actionId));
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

  const memorySearch = document.getElementById('memory-search');
  if (memorySearch) {
    memorySearch.addEventListener('input', (event) => {
      state.memoryQuery = event.target.value;
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
  const results = globalSearchEntries(state.commandQuery);

  paletteResults.innerHTML = results
    .map(
      (item) => `
        <button type="button" class="command-result" data-route="${item.route}" ${item.actionId ? `data-action-id="${item.actionId}"` : ''}>
          <span class="card-kicker">${icon(item.type === 'Route' ? 'arrowRight' : 'search')}<span>${escapeHtml(item.title)}</span></span>
          <small>${escapeHtml(`${item.type} · ${item.meta || item.route}`)}</small>
        </button>
      `
    )
    .join('');

  paletteResults.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => {
      closeCommandPalette();
      if (button.dataset.actionId) {
        openActionDetail(button.dataset.actionId);
        return;
      }
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
  const website = data.websiteIntelligence;
  const youtube = data.youtubeIntelligence;
  const marketing = data.marketingIntelligence;
  const communications = data.executiveInbox;
  const operations = WORKSPACE_DATA.operations;
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
              ${insightCard({ eyebrow: 'Website data source', title: website.source.label, body: website.source.body, tone: website.source.tone || 'info' })}
              ${insightCard({ eyebrow: 'YouTube data source', title: youtube.source.label, body: youtube.source.body, tone: youtube.source.tone || 'info' })}
              ${insightCard({ eyebrow: 'Supporting evidence', title: `${intelligence.insights.topInsight.confidence} confidence`, body: intelligence.insights.topInsight.supportingEvidence.join(' '), tone: 'good' })}
            </div>
          </div>
          <div class="tile-grid">
            ${intelligence.insights.executive.slice(0, 3).map((item) => insightCard({ eyebrow: `${item.priority} priority`, title: item.title, body: item.executiveSummary, tone: toneFromPriority(item.priority) })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Action Centre', title: 'What should happen next', body: 'The CEO dashboard now surfaces queue pressure, approvals, risks, opportunities, and recommended actions directly from the operating system.' })}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: "Today's Executive Queue", value: String(data.todaysExecutiveQueue.length), body: 'Actions due now or needing same-day review.' })}
            ${statCard({ iconName: 'alert-triangle', label: 'Top Priorities', value: String(data.topPriorities.length), body: 'Highest-priority or highest-risk actions.' })}
            ${statCard({ iconName: 'calendar', label: 'Pending Approvals', value: String(data.pendingApprovals.length), body: 'Approval-stage items waiting for leadership.' })}
            ${statCard({ iconName: 'sparkles', label: 'Recommended Actions', value: String(data.todaysRecommendedActions.length), body: 'Actions most worth approving or challenging next.' })}
          </div>
          <div class="grid-2">
            <section class="panel">
              ${sectionHeader({ eyebrow: 'Top priorities', title: 'Queue leaders', body: 'The action layer now tells the CEO what deserves attention first.' })}
              <div class="section-stack">${data.topPriorities.slice(0, 4).map((item) => registerRow({ kicker: `${pill(item.priority, toneFromPriority(item.priority))}${pill(item.category, 'info')}${pill(item.status, memoryStatusTone(item.status))}`, title: item.title, body: item.summary, extra: `<button type="button" class="text-link" data-action-id="${item.id}">${icon('arrowRight')} Open action</button>` })).join('')}</div>
            </section>
            <section class="panel">
              ${sectionHeader({ eyebrow: 'Pending approvals', title: 'What leadership still needs to decide', body: 'These items remain approval-first and non-executing.' })}
              <div class="section-stack">${data.pendingApprovals.slice(0, 4).map((item) => registerRow({ kicker: `${pill(item.status, memoryStatusTone(item.status))}${pill(item.owner, 'neutral')}`, title: item.title, body: item.summary, extra: `<button type="button" class="text-link" data-action-id="${item.id}">${icon('arrowRight')} Open action</button>` })).join('')}</div>
            </section>
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Business Risks', title: 'What could hurt the business if ignored', body: 'Risks are now visible alongside the action backlog.' })}
            <div class="section-stack">${data.executiveRisks.slice(0, 4).map((item) => insightCard({ eyebrow: item.severity, title: item.title, body: item.mitigation || item.financialImpact, tone: 'warn' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Business Opportunities', title: 'What could create value fastest', body: 'Opportunities remain visible so the queue is not only defensive.' })}
            <div class="section-stack">${data.executiveOpportunities.slice(0, 4).map((item) => insightCard({ eyebrow: item.estimatedValue, title: item.title, body: item.nextAction, tone: 'good' })).join('')}</div>
          </section>
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Website Intelligence', title: website.source.label, body: website.source.body })}
          <div class="grid-3">
            ${website.kpis.map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'Executive readout', title: website.isLive ? 'Live demand visibility is now active' : 'Demo fallback remains active', body: website.summary, tone: website.source.tone || 'info' })}
            ${insightCard({ eyebrow: 'Fallback behaviour', title: website.isLive ? 'Live GA4 is isolated to website analytics' : 'Website metrics are safely falling back', body: website.isLive ? 'If the GA4 snapshot disappears, the CEO and CMO views automatically revert to demo website intelligence without breaking the broader dashboard.' : 'A missing snapshot does not break the CEO Dashboard. It simply returns website intelligence to the structured demo baseline.', tone: website.isLive ? 'good' : 'warn' })}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'YouTube Intelligence', title: youtube.source.label, body: youtube.source.body })}
          <div class="grid-3">
            ${youtube.kpis.map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'Executive readout', title: youtube.isLive ? 'Live channel visibility is now active' : 'Demo fallback remains active', body: youtube.summary, tone: youtube.source.tone || 'info' })}
            ${insightCard({ eyebrow: 'Fallback behaviour', title: youtube.isLive ? 'Live YouTube is isolated to one provider path' : 'YouTube metrics are safely falling back', body: youtube.isLive ? 'If the generated YouTube snapshot disappears, the CMO and CEO views automatically revert to demo YouTube data without breaking the rest of the workspace.' : 'A missing YouTube snapshot does not break the dashboard. It simply returns YouTube to the structured demo baseline.', tone: youtube.isLive ? 'good' : 'warn' })}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Inbox', title: communications.summary.headline, body: communications.providerSummary.body })}
          <div class="grid-3">
            ${communications.widgets.map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'Inbox summary', title: communications.summary.headline, body: communications.summary.dailySummary, tone: communications.providerSummary.tone || 'info' })}
            ${insightCard({ eyebrow: 'Provider health', title: communications.providerSummary.health || communications.providerSummary.label, body: `${communications.providerSummary.account || 'Inbox account'}${communications.providerSummary.syncedAt ? ` · synced ${communications.providerSummary.syncedAt}` : ''}`, tone: communications.providerSummary.tone || 'info' })}
          </div>
          <div class="tile-grid">
            ${communications.sections.slice(0, 4).map((section) => insightCard({ eyebrow: section.title, title: section.items[0]?.subject || 'No active items', body: section.items[0]?.aiSummary || section.body, tone: section.items[0]?.priority === 'High' ? 'warn' : 'neutral' })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Operations Calendar', title: operations.summary.headline, body: operations.providerSummary.body })}
          <div class="grid-3">
            ${operations.widgets.map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'Schedule summary', title: operations.summary.headline, body: operations.summary.dailySummary, tone: operations.providerSummary.tone || 'info' })}
            ${insightCard({ eyebrow: 'Provider health', title: operations.providerSummary.health || operations.providerSummary.label, body: `${operations.providerSummary.calendarName || 'Calendar'}${operations.providerSummary.syncedAt ? ` · synced ${operations.providerSummary.syncedAt}` : ''}`, tone: operations.providerSummary.tone || 'info' })}
          </div>
          <div class="tile-grid">
            ${operations.insightCards.slice(0, 4).map((item) => insightCard({ eyebrow: item.eyebrow, title: item.title, body: item.body, tone: item.tone || 'info' })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Marketing Intelligence', title: `Marketing Health Score ${marketing.health.score}`, body: marketing.report.summary })}
          <div class="grid-4">
            ${statCard({ iconName: 'sparkles', label: 'Score', value: String(marketing.health.score), body: marketing.health.label, meta: marketing.health.sourceStatus })}
            ${statCard({ iconName: 'trending-up', label: 'Trend', value: marketing.health.trend.split(' ')[0], body: marketing.health.trend, meta: marketing.health.confidence })}
            ${statCard({ iconName: 'check-circle', label: 'Confidence', value: marketing.health.confidence, body: 'Confidence reflects how much of the score is supported by live provider paths versus demo fallback.', meta: marketing.sourceStatus.label })}
            ${statCard({ iconName: 'grid', label: 'Source status', value: marketing.health.sourceStatus, body: marketing.sourceStatus.body, meta: marketing.sourceStatus.label })}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'GA4 summary', title: marketing.report.ga4Summary.title, body: marketing.report.ga4Summary.body, tone: website.source.tone || 'info' })}
            ${insightCard({ eyebrow: 'YouTube summary', title: marketing.report.youtubeSummary.title, body: marketing.report.youtubeSummary.body, tone: youtube.source.tone || 'info' })}
          </div>
          <div class="tile-grid">
            ${marketing.report.crossChannelFindings.slice(0, 4).map((item) => insightCard({ eyebrow: `${item.priority} · ${item.businessImpact}`, title: item.title, body: item.executiveSummary, tone: item.tone || toneFromPriority(item.priority) })).join('')}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Historical Context', title: 'What the business now remembers', body: 'The intelligence layer can now reference durable business memory instead of relying only on current-period movement.' })}
            <div class="section-stack">
              ${data.memory.historicalContext.map((item) => insightCard({ eyebrow: item.department || 'Executive memory', title: item.title, body: item.summary, tone: item.tone || 'info' })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Memory Highlights', title: 'Persistent context worth keeping visible', body: 'These are the patterns and lessons leadership should not keep rediscovering.' })}
            <div class="section-stack">
              ${data.memory.highlights.map((item) => insightCard({ eyebrow: 'Memory highlight', title: item.title, body: item.body || item.summary, tone: item.tone || 'neutral' }).replace('insight-card', `insight-card ${item.tone || 'neutral'}`)).join('')}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Strategic Goal Progress', title: 'Goals linked to decisions and metrics', body: 'Goals now persist independently of provider data, so the CEO can track direction as well as current health.' })}
            <div class="section-stack">
              ${data.memory.strategicGoals.map((goal) => registerRow({
                kicker: `${pill(`${goal.progress}%`, 'info')}${pill(goal.status, memoryStatusTone(goal.status))}${pill(goal.owner, 'neutral')}`,
                title: goal.title,
                body: `${goal.summary} Target: ${goal.target}. Current state: ${goal.currentValue}.`,
                extra: `<div class="chip-list">${goal.linkedMetrics.map((metric) => `<span class="sidebar-chip">${escapeHtml(metric)}</span>`).join('')}</div><button type="button" class="text-link" data-route="/reports/strategic-goals">${icon('arrowRight')} Open Strategic Goals</button>`
              })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Recent Decisions', title: 'Structured executive decision memory', body: 'Decisions now carry reasons, expected outcomes, actual outcomes, owners, linked KPIs, and status.' })}
            <div class="section-stack">
              ${data.memory.recentDecisions.map((decision) => registerRow({
                kicker: `${pill(decision.status, memoryStatusTone(decision.status))}${pill(decision.owner, 'info')}`,
                title: decision.title,
                body: `${decision.summary} Expected: ${decision.expectedOutcome}`,
                extra: `<div class="mini-list"><li>${escapeHtml(`Actual outcome: ${decision.actualOutcome}`)}</li><li>${escapeHtml(`Related KPIs: ${decision.relatedKpis.join(', ')}`)}</li></div><button type="button" class="text-link" data-route="/reports/decision-journal">${icon('arrowRight')} Open Decision Journal</button>`
              })).join('')}
            </div>
          </section>
        </div>

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
          ${sectionHeader({ eyebrow: 'Business Timeline', title: 'Recent business activity', body: 'The timeline is now permanent executive memory, combining structured milestones, decisions, launches, and generated intelligence events.' })}
          <div class="section-stack">
            ${data.businessTimeline.map((item) => registerRow({ kicker: `${pill(item.time, 'info')}${pill(item.type, 'neutral')}`, title: item.title, body: item.body })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Business Milestones', title: 'What crossed the line into memory', body: 'These milestone events are the moments leadership is likely to reference again in future reports and decisions.' })}
          <div class="tile-grid">
            ${data.memory.milestones.map((item) => insightCard({ eyebrow: `${item.date} · ${item.category}`, title: item.title, body: item.body, tone: item.impact === 'High' ? 'good' : 'info' })).join('')}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Cross-Department Intelligence', title: 'What the business signals mean when linked together', body: website.isLive && youtube.isLive ? 'These correlations are generated before the interface renders them, with live GA4 website signals and live YouTube channel data now feeding the CEO view.' : website.isLive ? 'These correlations are generated before the interface renders them, with live GA4 website signals now feeding the CEO view.' : youtube.isLive ? 'These correlations are generated before the interface renders them, with live YouTube channel data now feeding the CEO view.' : 'These correlations are generated before the interface renders them.' })}
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
          ${sectionHeader({ eyebrow: 'Ask EP Hub', title: 'A conversational executive workspace', body: 'The CEO should be able to ask direct business questions and get concise, decision-ready responses.' })}
          <div class="tile-grid">
            ${WORKSPACE_DATA.aiAssistant.askWorkspace.prompts.map((item) => insightCard({ eyebrow: item.question, title: `${item.confidence} confidence`, body: item.answer, tone: 'neutral' })).join('')}
          </div>
          <div class="page-pillbar">
            <button type="button" class="chip-button" data-route="/ai-assistant/ask">${icon('sparkles')}Open Ask EP Hub</button>
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


function executiveInboxView() {
  const data = WORKSPACE_DATA.communications;
  return {
    html: `
      <div class="page-grid">
        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">Executive Inbox</div>
              <div class="hero-title">${escapeHtml(data.summary.headline)}</div>
              <p class="hero-summary">${escapeHtml(data.summary.body)}</p>
            </section>
            <section class="snapshot-grid">
              ${data.widgets.map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
            </section>
          </div>
          <div class="hero-side">
            <section class="score-panel">
              <div class="score-tile">
                <div class="label">Inbox provider state</div>
                <strong class="score-value">${escapeHtml(data.providerSummary.label)}</strong>
                <div class="score-note">${escapeHtml(data.providerSummary.health || data.providerSummary.state)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">Current account</div>
                <h3>${escapeHtml(data.providerSummary.account || 'Demo inbox')}</h3>
                <p>${escapeHtml(data.providerSummary.body)}</p>
              </div>
            </section>
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Approval-first communications', title: 'Nothing executes automatically', body: 'Executive Inbox stages reply, archive, label, forward, task, and follow-up actions as approval cards only.' })}
          ${renderRoutePillbar(SUBNAV.executiveInbox)}
          <div class="page-pillbar">
            <button type="button" class="chip-button" data-route="/approvals">${icon('check-circle')}Open Approval Centre</button>
            <button type="button" class="chip-button" data-route="/settings/integrations">${icon('settings')}Open Integration Status</button>
          </div>
        </section>
        ${pageQuestions('/executive-inbox')}
        <div class="settings-grid">
          ${data.sections.map((section) => `
            <section class="panel">
              ${sectionHeader({ eyebrow: 'Inbox section', title: section.title, body: section.body })}
              <div class="section-stack">
                ${section.items.length ? section.items.map((item) => registerRow({
                  kicker: `${pill(item.category, 'info')}${pill(item.priority, toneFromPriority(item.priority))}${pill(item.status, item.status.toLowerCase().includes('completed') ? 'good' : item.priority === 'High' ? 'warn' : 'neutral')}`,
                  title: `${item.subject}`,
                  body: `${item.sender} · ${item.aiSummary}`,
                  meta: `${item.receivedTime}${item.customer ? ` · ${item.customer}` : ''}${item.supplier ? ` · ${item.supplier}` : ''}`
                })).join('') : insightCard({ eyebrow: section.title, title: 'No items currently visible', body: 'This section is clear in the current inbox state.', tone: 'good' })}
              </div>
            </section>
          `).join('')}
        </div>
      </div>
    `,
    charts: []
  };
}

function cfoHomeView() {
  const data = WORKSPACE_DATA.cfo;
  const activeMetric = data.metrics.find((metric) => metric.key === state.activeMetric) || data.metrics[0];
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CFO Module', title: 'Finance now lives as one module inside EP Hub', body: 'The CFO Workspace remains fully functional, but now sits inside the wider CEO-led operating system.' })}
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

function marketingSourceCards(sourceStatus = {}) {
  return (sourceStatus.cards || sourceStatus.sourceCards || []).map((item) => insightCard({ eyebrow: item.label, title: item.status, body: item.body, tone: item.tone || 'neutral' })).join('');
}

function cmoPlatformCommentary(platform) {
  const name = platform.label;
  const growth = platform.stats.find(([label]) => label === 'Audience Growth')?.[1] || 'Growth placeholder';
  const engagement = platform.stats.find(([label]) => label === 'Engagement Rate')?.[1] || platform.stats.find(([label]) => label === 'Average Views / Video')?.[1] || 'Engagement placeholder';
  const cadence = platform.stats.find(([label]) => label === 'Posting Frequency')?.[1] || platform.stats.find(([label]) => label === 'Publishing Activity')?.[1] || 'Cadence placeholder';
  const isLive = platform.dataSource?.state === 'live-youtube';
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
      missing: isLive ? `${name} is now using the live provider path, but other social platforms and deeper attribution remain in Demo Mode.` : `All ${name} data remains realistic mock/demo data only in this sprint.`,
      followUp: [`What content performs best on ${name}?`, `Should ${name} get more effort next week?`, `What is the next approval-worthy action on ${name}?`]
    }
  };
}

function cmoDashboardView() {
  const data = WORKSPACE_DATA.cmo.dashboard;
  const marketingHealth = data.marketingHealth;
  const marketingSourceLabel = WORKSPACE_DATA.cmo.reports?.marketingIntelligence?.sourceStatus?.label || marketingHealth.sourceStatus;
  const marketingSourceBody = WORKSPACE_DATA.cmo.reports?.marketingIntelligence?.sourceStatus?.body || 'This score blends live and demo marketing coverage depending on which provider paths are active.';
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'The executive marketing command centre', body: 'The CMO Workspace now sits inside the wider EP Hub shell as the first complete non-finance executive module.' })}
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
                <strong class="score-value">${marketingHealth.score}</strong>
                <div class="score-note">${escapeHtml(marketingHealth.trend)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">Source status</div>
                <h3>${escapeHtml(marketingHealth.sourceStatus)}</h3>
                <p>${escapeHtml(marketingSourceLabel)}. ${escapeHtml(marketingHealth.summary)}</p>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Marketing Intelligence', title: marketingSourceLabel, body: `${marketingSourceBody} The score now blends live website demand, live YouTube authority, publishing cadence, content performance, and conversion capture into one executive marketing readout.` })}
          <div class="grid-4">
            ${statCard({ iconName: 'sparkles', label: 'Score', value: String(marketingHealth.score), body: marketingHealth.label, meta: marketingHealth.confidence })}
            ${statCard({ iconName: 'trending-up', label: 'Trend', value: marketingHealth.trend.startsWith('Up') ? 'Up' : 'Mixed', body: marketingHealth.trend, meta: marketingHealth.sourceStatus })}
            ${statCard({ iconName: 'check-circle', label: 'Confidence', value: marketingHealth.confidence, body: 'Confidence rises when more of the marketing stack is backed by live provider paths.', meta: data.bestPlatform })}
            ${statCard({ iconName: 'grid', label: 'Best platform', value: data.bestPlatform, body: `Weakest current platform is ${data.worstPlatform}.`, meta: marketingHealth.sourceStatus })}
          </div>
          <div class="tile-grid">
            ${marketingHealth.components.map((item) => insightCard({ eyebrow: item.label, title: `${Math.round(item.score)} / 100 · ${item.value}`, body: item.body, tone: toneFromScore(item.score) })).join('')}
          </div>
          <div class="tile-grid">
            ${marketingSourceCards(marketingHealth)}
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

        ${data.dataSource ? `
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Hybrid source coverage', title: data.sourceStatus?.label || data.dataSource.label, body: data.sourceStatus?.body || data.dataSource.body })}
            <div class="tile-grid">
              ${marketingSourceCards(data.sourceStatus || data.dataSource)}
            </div>
          </section>
        ` : ''}

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

        <div class="grid-3">
          ${insightCard({ eyebrow: 'Social Health Score', title: `${data.socialHealth?.score || '—'} / 100`, body: data.socialHealth?.summary || 'Social health summary unavailable.', tone: data.socialHealth?.tone || 'info' })}
          ${insightCard({ eyebrow: 'Attribution', title: data.attribution?.bestAssistedChannel || 'Attribution summary', body: data.attribution?.summary || 'Attribution summary unavailable.', tone: 'info' })}
          ${insightCard({ eyebrow: 'Competitor benchmark', title: data.competitorBenchmark?.leader || 'Benchmark summary', body: data.competitorBenchmark?.summary || 'Competitor benchmark summary unavailable.', tone: 'good' })}
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

        ${data.dataSource ? `
          <section class="panel">
            ${sectionHeader({ eyebrow: `${data.label} data source`, title: data.dataSource.label, body: data.dataSource.body })}
            ${insightCard({ eyebrow: data.dataSource.state === 'live-youtube' ? 'Live provider path' : 'Demo fallback path', title: data.dataSource.channelId ? `Channel ${data.dataSource.channelId}` : `${data.label} demo data`, body: data.dataSource.state === 'live-youtube' ? `This platform card is now live. Last synced ${data.dataSource.syncedAt || 'recently'}, while the rest of the social estate may still be demo-backed.` : 'This platform remains demo-backed until a live provider path exists for it.', tone: data.dataSource.tone || 'info' })}
          </section>
        ` : ''}

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
          <div class="grid-4">${pairStats(data.metrics, 'Website analytics metric.')}</div>
        </section>

        ${pageQuestions('/cmo/website-analytics')}

        <div class="chart-grid">
          ${chartCard({ eyebrow: 'Website Traffic', title: 'Traffic trend', canvasId: 'chart-website-traffic', meta: 'How website attention has moved over time.' })}
          ${chartCard({ eyebrow: 'Website Conversions', title: 'Bookings, enquiries, and sign-ups', canvasId: 'chart-website-conversions', meta: 'The clearest current conversion outputs.' })}
          ${chartCard({ eyebrow: 'Visitor Mix', title: 'Users vs new vs returning visitors', canvasId: 'chart-website-visitors-mix', meta: 'A quick view of visitor composition in the current scenario.' })}
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Data source', title: data.dataSource?.label || 'Demo fallback active', body: data.dataSource?.body || 'Website Analytics is still using demo data until a local GA4 snapshot is synced.' })}
          <div class="grid-3">
            ${insightCard({ eyebrow: 'Summary', title: 'Traffic quality is improving', body: data.summary, tone: 'info' })}
            ${insightCard({ eyebrow: 'Commercial relevance', title: 'Bookings and enquiries matter most', body: 'These cards are live only when the GA4 snapshot is active. The wider marketing context may still be hybrid or demo-led elsewhere.', tone: data.dataSource?.tone === 'good' ? 'good' : 'neutral' })}
            ${insightCard({ eyebrow: 'Next step', title: 'Optimise conversion before chasing more traffic', body: 'The clearest next action is to improve booking and enquiry pathways around already-healthy attention.', tone: 'warn' })}
          </div>
          <div class="tile-grid">
            ${marketingSourceCards(data.sourceStatus)}
          </div>
        </section>
      </div>
    `,
    charts: [
      entryChartSpec(WORKSPACE_DATA.cmo.charts.websiteTraffic, 'chart-website-traffic', 'Website traffic'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.websiteConversions, 'chart-website-conversions', 'Website conversions'),
      entryChartSpec(WORKSPACE_DATA.cmo.charts.websiteVisitorMix || { type: 'bar', labels: ['Users', 'New Users', 'Returning'], values: [18.9, 12.4, 6.5], label: 'Visitor mix', suffix: 'k' }, 'chart-website-visitors-mix', 'Visitor mix')
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
          ${sectionHeader({ eyebrow: 'Marketing attribution', title: data.attribution?.bestAssistedChannel || 'Attribution summary', body: data.attribution?.summary || 'Attribution summary unavailable.' })}
          <div class="grid-3">
            ${statCard({ iconName: 'coins', label: 'Attributed revenue', value: data.attribution?.revenueAttributed || '—', body: 'Deterministic attribution summary across the current marketing estate.' })}
            ${statCard({ iconName: 'sparkles', label: 'Best assisted channel', value: data.attribution?.bestAssistedChannel || '—', body: 'The channel doing the most visible assisted-demand work right now.' })}
            ${statCard({ iconName: 'target', label: 'Weakest channel', value: data.attribution?.weakestChannel || '—', body: 'A candidate for lighter-touch maintenance unless its role becomes clearer.' })}
          </div>
          <div class="tile-grid">
            ${(data.attribution?.touchpoints || []).map((item) => insightCard({ eyebrow: `${item.channel} · ${item.share}`, title: item.channel, body: item.note, tone: 'info' })).join('')}
          </div>
        </section>

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
  const data = WORKSPACE_DATA.cmo.contentLibrary;
  const query = state.contentQuery.trim().toLowerCase();
  const youtubeLive = (data.sourceStatus?.cards || []).some((item) => item.label === 'YouTube' && /live/i.test(item.status));
  const items = data.items.filter((item) => {
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
          ${sectionHeader({ eyebrow: 'Content source coverage', title: data.sourceStatus?.label || 'Content library source status', body: data.sourceStatus?.body || 'This library can blend live and demo content depending on which provider paths are active.' })}
          <div class="tile-grid">
            ${marketingSourceCards(data.sourceStatus)}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Library results', title: `${items.length} content item${items.length === 1 ? '' : 's'}`, body: 'This page is intentionally searchable so future live content feeds can slot into the same structure cleanly.' })}
          <div class="tile-grid">
            ${items
              .map((item) => insightCard({
                eyebrow: `${item.type} · ${item.platform}`,
                title: item.title,
                body: `Published ${item.publishDate}. ${item.views} views and ${item.engagement} engagement. Performance rating ${item.rating}. Source: ${item.platform === 'YouTube' && youtubeLive ? 'Live YouTube snapshot' : item.platform === 'YouTube' ? 'Demo YouTube baseline' : 'Demo or static content layer'}.`,
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
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Competitor analysis', body: 'A deterministic executive comparison surface for positioning, benchmark pressure, and where EP should attack with stronger proof.' })}
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

        ${data.benchmark ? `
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Benchmark summary', title: data.benchmark.leader || 'Competitive positioning', body: data.benchmark.summary || 'Competitive benchmark summary unavailable.' })}
            <div class="tile-grid">
              ${(data.benchmark.benchmark || []).map((item) => insightCard({ eyebrow: `${item.platform} · ${item.standing}`, title: `${item.score} / 100`, body: `${item.gap}. ${item.note}`, tone: item.standing === 'Leader' ? 'good' : item.standing === 'Underweight' ? 'warn' : 'info' })).join('')}
            </div>
          </section>
        ` : ''}
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
  const report = data.marketingIntelligence;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'CMO Module', title: 'Marketing reports', body: 'A dedicated reporting surface for channel summaries, weekly briefings, and the new Marketing Intelligence Report.' })}
          ${renderRoutePillbar(SUBNAV.cmo)}
          <div class="snapshot-panel">
            <h3>${escapeHtml(report.title)}</h3>
            <p>${escapeHtml(report.summary)}</p>
          </div>
        </section>

        ${pageQuestions('/cmo/reports')}

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Reporting sections', title: 'What the v1.1 marketing pack now contains', body: 'The reporting layer now combines live summaries, deterministic findings, risks, and recommended actions.' })}
          <div class="tile-grid">
            ${data.sections.map((item) => insightCard({ eyebrow: 'Report section', title: item, body: 'This section is now part of the reusable marketing reporting pack.', tone: 'neutral' })).join('')}
            ${insightCard({ eyebrow: 'New in Sprint 18', title: 'Unified Social Provider', body: 'The marketing report now packages GA4, YouTube, Instagram, Facebook, LinkedIn, X, competitor benchmarking, attribution, risks, and recommended actions together.', tone: 'good' })}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Source coverage', title: report.health.sourceStatus, body: report.sourceStatus.body })}
          <div class="grid-4">
            ${statCard({ iconName: 'sparkles', label: 'Health score', value: String(report.health.score), body: report.health.label, meta: report.health.confidence })}
            ${statCard({ iconName: 'trending-up', label: 'Trend', value: report.health.trend.startsWith('Up') ? 'Up' : 'Mixed', body: report.health.trend, meta: report.health.sourceStatus })}
            ${statCard({ iconName: 'check-circle', label: 'Confidence', value: report.health.confidence, body: 'Confidence rises when both GA4 and YouTube are live.', meta: report.sourceStatus.label })}
            ${statCard({ iconName: 'grid', label: 'Live paths', value: report.health.sourceStatus, body: report.sourceStatus.body, meta: report.sourceStatus.label })}
          </div>
          <div class="tile-grid">${marketingSourceCards(report.sourceStatus)}</div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Shared report routes', title: 'Cross-functional reporting links', body: 'The CMO workspace plugs into the wider shared reporting layer when needed.' })}
            <div class="section-stack">
              ${insightCard({ eyebrow: 'Shared reports', title: 'Weekly Briefings', body: 'Open the shared Sunday briefing view when leadership wants the cross-functional version.', tone: 'info' })}
              <button type="button" class="quick-action-button" data-route="/reports/weekly-briefings">Open Weekly Briefings ${icon('arrowRight')}</button>
              <button type="button" class="quick-action-button" data-route="/reports/cmo-reports">Open Marketing Intelligence Report ${icon('arrowRight')}</button>
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
  const communications = WORKSPACE_DATA.communications;
  const operations = WORKSPACE_DATA.operations;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Central Approval Centre', title: 'Business-wide approvals', body: 'Approvals are now grouped across finance, marketing, sales, operations, and AI-generated actions.' })}
          <div class="snapshot-panel">
            <h3>No approvals execute automatically</h3>
            <p>Everything in this prototype remains staged for review only. This section exists to demonstrate approval-first governance beyond the CFO module.</p>
          </div>
          <div class="grid-3">
            ${communications.widgets.slice(0, 3).map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
            ${operations.widgets.slice(0, 3).map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
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
  const memory = WORKSPACE_DATA.reports.memory;
  const memoryRoutes = [
    { title: 'Executive Inbox', body: 'Communications intelligence, approval-first inbox triage, and executive email summaries.', route: '/executive-inbox' },
    { title: 'Executive Actions Report', body: 'A packaged view of active actions, backlog, and what leadership should do next.', route: '/reports/executive-actions' },
    { title: 'Outstanding Approvals', body: 'Approval-stage work organised for fast executive review.', route: '/reports/outstanding-approvals' },
    { title: 'Operations Calendar', body: 'Operations capacity, fittings, deadlines, scheduling risks, and free capacity in one executive operations surface.', route: '/operations' },
    { title: 'Executive Timeline', body: 'Permanent business chronology of launches, milestones, and structural changes.', route: '/reports/executive-timeline' },
    { title: 'Decision Journal', body: 'Structured executive decision memory with reasons, outcomes, and linked KPIs.', route: '/reports/decision-journal' },
    { title: 'Strategic Goals', body: 'Persistent goals linked to metrics, decisions, and owners.', route: '/reports/strategic-goals' },
    { title: 'Marketing Intelligence Report', body: 'Packaged GA4, YouTube, Unified Social, competitor benchmarking, attribution, risks, and actions.', route: '/reports/cmo-reports' }
  ];
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Reports', title: 'Executive reporting layer', body: 'Weekly, monthly, quarterly, and board outputs now sit in one shared reporting section, now with persistent memory context behind them.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="grid-4">
            ${memory.summaryCards.map((item) => statCard({ iconName: 'book-open', label: item.label, value: item.value, body: item.body })).join('')}
          </div>
        </section>
        ${pageQuestions('/reports')}
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Memory-backed reporting', title: 'What reports now remember', body: 'Historical context, previous decisions, strategic goal progress, and milestones can now follow the report output.' })}
            <div class="section-stack">
              ${memory.historicalContext.map((item) => registerRow({ kicker: `${pill(item.department || 'Executive Memory', 'info')}`, title: item.title, body: item.summary })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Knowledge graph', title: 'Relationship coverage', body: memory.graphNote })}
            <div class="tile-grid">
              ${insightCard({ eyebrow: 'Timeline retention', title: memory.retention.timelineHistory, body: 'Executive timeline history is retained as structured memory.', tone: 'good' })}
              ${insightCard({ eyebrow: 'Decision retention', title: memory.retention.completedDecisions, body: 'Completed decisions remain available for later learning.', tone: 'info' })}
              ${insightCard({ eyebrow: 'Goal retention', title: memory.retention.archivedGoals, body: 'Archived goals stay useful as strategic reference points.', tone: 'neutral' })}
            </div>
          </section>
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Available report routes', title: 'What to open next', body: 'Use this area to move from module work into packaged executive outputs.' })}
          <div class="tile-grid">
            ${[...memoryRoutes, ...WORKSPACE_DATA.reports.overview]
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
  const memory = WORKSPACE_DATA.reports.memory;
  const operations = WORKSPACE_DATA.operations;
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Weekly Briefings', title: 'Sunday Executive Briefing', body: 'A board-style briefing generated from structured executive insights and persistent executive memory.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="grid-4">
            ${statCard({ iconName: 'pulse', label: 'Business health score', value: String(WORKSPACE_DATA.intelligence.health.overall.score), body: WORKSPACE_DATA.intelligence.health.overall.label })}
            ${statCard({ iconName: 'trending-up', label: 'Revenue', value: WORKSPACE_DATA.cfo.metrics[0].value, body: WORKSPACE_DATA.cfo.metrics[0].detail })}
            ${statCard({ iconName: 'coins', label: 'Profit', value: WORKSPACE_DATA.cfo.metrics[1].value, body: WORKSPACE_DATA.cfo.metrics[1].detail })}
            ${memory.summaryCards.map((item) => statCard({ iconName: 'book-open', label: item.label, value: item.value, body: item.body })).join('')}
          </div>
          <div class="grid-2">
            ${insightCard({ eyebrow: 'Executive Summary', title: 'Board opening statement', body: data.summary, tone: 'info' })}
            ${insightCard({ eyebrow: 'Forecasts', title: 'Current outlook', body: 'Revenue forecast £49.5k, profit forecast £12.1k, 30-day closing cash £21.3k.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Wins', title: 'What went well', body: data.wins.join(' '), tone: 'good' })}
            ${insightCard({ eyebrow: 'Risks', title: 'What needs watching', body: data.risks.join(' '), tone: 'risk' })}
            ${insightCard({ eyebrow: 'Recommendations', title: 'What to do', body: data.recommendations.join(' '), tone: 'warn' })}
            ${insightCard({ eyebrow: 'Executive Inbox', title: 'Communications summary', body: WORKSPACE_DATA.communications.summary.dailySummary, tone: WORKSPACE_DATA.communications.providerSummary.tone || 'info' })}
            ${insightCard({ eyebrow: 'Operations Calendar', title: 'Schedule summary', body: operations.summary.dailySummary, tone: operations.providerSummary.tone || 'info' })}
            ${insightCard({ eyebrow: 'Questions Worth Asking', title: 'The right board questions', body: data.questions.join(' '), tone: 'neutral' })}
          </div>
        </section>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Historical events', title: 'What this week should be compared against', body: 'Reports can now reference prior milestones instead of behaving like stateless snapshots.' })}
            <div class="section-stack">${memory.milestones.map((item) => registerRow({ kicker: `${pill(item.date, 'info')}${pill(item.category, 'neutral')}`, title: item.title, body: item.body })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Previous decisions', title: 'What leadership already committed to', body: 'Decision memory now follows the report so executive review can stay grounded.' })}
            <div class="section-stack">${memory.previousDecisions.map((item) => registerRow({ kicker: `${pill(item.status, memoryStatusTone(item.status))}${pill(item.owner, 'neutral')}`, title: item.title, body: `${item.summary} Expected outcome: ${item.expectedOutcome}` })).join('')}</div>
          </section>
        </div>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Goal progress', title: 'Strategic goal movement', body: 'Goal progress now persists across reports and can be reviewed independently of today\'s metrics.' })}
            <div class="section-stack">${memory.goalProgress.map((goal) => registerRow({ kicker: `${pill(`${goal.progress}%`, 'info')}${pill(goal.status, memoryStatusTone(goal.status))}`, title: goal.title, body: `${goal.currentValue} against target ${goal.target}` })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Knowledge graph', title: 'Memory relationship coverage', body: memory.graphNote })}
            <div class="tile-grid">
              ${insightCard({ eyebrow: 'Retention', title: memory.retention.timelineHistory, body: 'Timeline history remains available as a persistent executive chronology.', tone: 'good' })}
              ${insightCard({ eyebrow: 'Decisions', title: memory.retention.completedDecisions, body: 'Completed decisions stay available for later review and learning.', tone: 'info' })}
              ${insightCard({ eyebrow: 'Archived goals', title: memory.retention.archivedGoals, body: 'Goal history can continue informing future executive planning.', tone: 'neutral' })}
            </div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function executiveTimelineView() {
  const timeline = WORKSPACE_DATA.memory.timeline;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Timeline', title: 'Permanent business timeline', body: 'This timeline now persists independently of any provider and holds milestones, launches, purchases, decisions, structural changes, executive inbox events, and operations calendar events.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
        </section>
        ${pageQuestions('/reports/executive-timeline')}
        <section class="panel">
          <div class="section-stack">
            ${timeline.map((item) => registerRow({
              kicker: `${pill(item.date, 'info')}${pill(item.category, 'neutral')}${pill(item.impact || 'Medium', memoryStatusTone(item.impact || 'Medium'))}`,
              title: item.title,
              body: `${item.body} Department: ${item.department}. Related entities: ${(item.relatedEntities || []).join(', ') || 'None yet'}`
            })).join('')}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function executiveDecisionJournalView() {
  const query = state.journalQuery.trim().toLowerCase();
  const decisions = WORKSPACE_DATA.memory.decisions.filter((entry) => {
    if (!query) return true;
    return [entry.title, entry.summary, entry.reason, entry.expectedOutcome, entry.actualOutcome, entry.owner, entry.department, entry.status, ...(entry.relatedKpis || [])].join(' ').toLowerCase().includes(query);
  });

  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Decision Journal', title: 'Structured executive memory', body: 'The executive memory layer now tracks why decisions were made, what they were meant to achieve, and how the outcomes evolved.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          ${searchRow({ id: 'journal-search', value: state.journalQuery, placeholder: 'Search decisions, outcomes, owners, KPIs…', label: 'Search executive decisions' })}
        </section>
        ${pageQuestions('/reports/decision-journal')}
        <section class="panel">
          <div class="section-stack">
            ${decisions.map((item) => `
              <article class="register-row">
                <div class="register-meta">${pill(item.date, 'info')}${pill(item.status, memoryStatusTone(item.status))}${pill(item.owner, 'neutral')}</div>
                <h4>${escapeHtml(item.title)}</h4>
                <div class="grid-3">
                  ${insightCard({ eyebrow: 'Summary', title: 'What we decided', body: item.summary, tone: 'info' })}
                  ${insightCard({ eyebrow: 'Reason', title: 'Why it was necessary', body: item.reason, tone: 'neutral' })}
                  ${insightCard({ eyebrow: 'Expected outcome', title: 'What success looked like', body: item.expectedOutcome, tone: 'good' })}
                  ${insightCard({ eyebrow: 'Actual outcome', title: item.actualOutcome || 'Pending', body: item.actualOutcome || 'Still unfolding.', tone: 'warn' })}
                  ${insightCard({ eyebrow: 'Ownership', title: item.owner, body: item.department, tone: 'neutral' })}
                  ${insightCard({ eyebrow: 'Related KPIs', title: item.relatedKpis.join(', ') || 'None yet', body: `Status: ${item.status}`, tone: 'info' })}
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function strategicGoalsView() {
  const goals = WORKSPACE_DATA.memory.goals;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Strategic Goals', title: 'Persistent business goals', body: 'Goals now persist as first-class business memory linked to metrics, decisions, deadlines, and executive ownership.' })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="grid-4">
            ${statCard({ iconName: 'target', label: 'Tracked goals', value: String(goals.length), body: 'The memory layer now carries strategic direction, not just observations.' })}
            ${statCard({ iconName: 'check-circle', label: 'On track', value: String(goals.filter((goal) => /on track/i.test(goal.status)).length), body: 'Goals progressing without immediate intervention.' })}
            ${statCard({ iconName: 'alert-triangle', label: 'Needs review', value: String(goals.filter((goal) => /risk|review/i.test(goal.status)).length), body: 'Goals that now need leadership attention.' })}
            ${statCard({ iconName: 'sparkles', label: 'Average progress', value: `${WORKSPACE_DATA.memory.dashboard.summary.averageGoalProgress}%`, body: 'A quick sense of how much strategic work has already moved.' })}
          </div>
        </section>
        ${pageQuestions('/reports/strategic-goals')}
        <section class="panel">
          <div class="section-stack">
            ${goals.map((goal) => registerRow({
              kicker: `${pill(goal.status, memoryStatusTone(goal.status))}${pill(`${goal.progress}%`, 'info')}${pill(goal.owner, 'neutral')}`,
              title: goal.title,
              body: `${goal.summary} Deadline: ${goal.deadline}. Current: ${goal.currentValue}. Target: ${goal.target}`,
              extra: `<div class="mini-list"><li>${escapeHtml(`Linked metrics: ${goal.linkedMetrics.join(', ')}`)}</li><li>${escapeHtml(`Linked decisions: ${goal.linkedDecisionIds.join(', ') || 'None yet'}`)}</li></div>`
            })).join('')}
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

function marketingIntelligenceReportView() {
  const data = WORKSPACE_DATA.reports.marketingIntelligence;
  return {
    html: `
      <div class="page-grid">
        <section class="board-shell">
          ${sectionHeader({ eyebrow: 'Reports', title: data.title, body: data.subtitle })}
          ${renderRoutePillbar(SUBNAV.reports)}
          <div class="grid-4">
            ${statCard({ iconName: 'sparkles', label: 'Marketing health score', value: String(data.health.score), body: data.health.label, meta: data.health.confidence })}
            ${statCard({ iconName: 'trending-up', label: 'Trend', value: data.health.trend.startsWith('Up') ? 'Up' : 'Mixed', body: data.health.trend, meta: data.health.sourceStatus })}
            ${statCard({ iconName: 'check-circle', label: 'Confidence', value: data.health.confidence, body: 'Confidence reflects how much of the marketing stack is live-backed.', meta: data.sourceStatus.label })}
            ${statCard({ iconName: 'grid', label: 'Source status', value: data.health.sourceStatus, body: data.sourceStatus.body, meta: data.sourceStatus.label })}
          </div>
          <div class="snapshot-panel">
            <h3>Executive summary</h3>
            <p>${escapeHtml(data.summary)}</p>
          </div>
        </section>

        ${pageQuestions('/reports/cmo-reports')}

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Live and demo coverage', title: data.sourceStatus.label, body: data.sourceStatus.body })}
          <div class="tile-grid">${marketingSourceCards(data.sourceStatus)}</div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'GA4 summary', title: data.ga4Summary.title, body: 'Website demand, traffic quality, and conversion visibility.' })}
            ${insightCard({ eyebrow: 'Website intelligence', title: 'What GA4 is saying', body: data.ga4Summary.body, tone: 'info' })}
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'YouTube summary', title: data.youtubeSummary.title, body: 'Authority, visibility, and publishing momentum.' })}
            ${insightCard({ eyebrow: 'Channel intelligence', title: 'What YouTube is saying', body: data.youtubeSummary.body, tone: 'good' })}
          </section>
        </div>

        <div class="grid-3">
          ${insightCard({ eyebrow: 'Social Health Score', title: `${data.socialHealth?.score || '—'} / 100`, body: data.socialSummary?.body || data.socialHealth?.summary || 'Unified social summary unavailable.', tone: data.socialHealth?.tone || 'info' })}
          ${insightCard({ eyebrow: 'Attribution', title: data.attribution?.bestAssistedChannel || 'Attribution summary', body: data.attribution?.summary || 'Attribution summary unavailable.', tone: 'info' })}
          ${insightCard({ eyebrow: 'Competitor benchmark', title: data.competitorBenchmark?.leader || 'Competitive positioning', body: data.competitorBenchmark?.summary || 'Competitor benchmark unavailable.', tone: 'good' })}
        </div>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Cross-channel findings', title: 'How website, YouTube, and the social estate now work together', body: 'These are deterministic findings generated from the current provider-backed marketing state.' })}
          <div class="tile-grid">
            ${data.crossChannelFindings.map((item) => insightCard({ eyebrow: `${item.priority} · ${item.businessImpact}`, title: item.title, body: item.executiveSummary, tone: item.tone || toneFromPriority(item.priority) })).join('')}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Opportunities', title: 'Where the leverage is', body: 'These actions should improve value capture without adding new providers or complexity.' })}
            <div class="section-stack">
              ${data.opportunities.map((item) => registerRow({ kicker: `${pill(item.priority, toneFromPriority(item.priority))}${pill(item.owner, 'neutral')}`, title: item.title, body: item.body })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Risks', title: 'What could limit return', body: 'The report should be honest about where marketing confidence is still capped.' })}
            <div class="section-stack">
              ${data.risks.map((item) => insightCard({ eyebrow: 'Risk', title: item.title, body: item.body, tone: item.tone || 'warn' })).join('')}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Competitor benchmark', title: data.competitorBenchmark?.leader || 'Competitive positioning', body: data.competitorBenchmark?.summary || 'Competitor benchmark summary unavailable.' })}
            <div class="section-stack">
              ${(data.competitorBenchmark?.benchmark || []).map((item) => insightCard({ eyebrow: `${item.platform} · ${item.standing}`, title: `${item.score} / 100`, body: `${item.gap}. ${item.note}`, tone: item.standing === 'Leader' ? 'good' : item.standing === 'Underweight' ? 'warn' : 'info' })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Attribution mix', title: data.attribution?.revenueAttributed || 'Attributed demand', body: data.attribution?.summary || 'Attribution summary unavailable.' })}
            <div class="section-stack">
              ${(data.attribution?.touchpoints || []).map((item) => insightCard({ eyebrow: `${item.channel} · ${item.share}`, title: item.channel, body: item.note, tone: 'info' })).join('')}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Recommended actions', title: 'What to do next', body: 'These stay approval-first and deterministic.' })}
            <div class="section-stack">
              ${data.recommendedActions.map((item) => registerRow({ kicker: `${pill(item.priority, toneFromPriority(item.priority))}${pill(item.suggestedOwner, 'neutral')}`, title: item.recommendation, body: item.why })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Memory milestones', title: 'What crossed into executive memory', body: 'Marketing milestones are now written into the provider-independent executive memory layer without duplicating events.' })}
            <div class="section-stack">
              ${data.memoryMilestones.map((item) => registerRow({ kicker: `${pill(item.date, 'info')}${pill(item.category, 'neutral')}`, title: item.title, body: item.body })).join('')}
            </div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function operationsCalendarView() {
  const data = WORKSPACE_DATA.operations;
  return {
    html: `
      <div class="page-grid">
        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">Operations Calendar</div>
              <div class="hero-title">Scheduling translated into executive operational intelligence.</div>
              <p class="hero-summary">${escapeHtml(data.summary.body)}</p>
            </section>
          </div>
          <div class="hero-side">
            <section class="snapshot-panel">
              <div class="label">Provider state</div>
              <h3>${escapeHtml(data.providerSummary.label)}</h3>
              <p>${escapeHtml(data.providerSummary.body)}</p>
            </section>
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Operations summary', title: data.summary.headline, body: 'The goal is to make schedule quality, workload, and capacity visible without turning EP Hub into a calendar client.' })}
          ${renderRoutePillbar([['/operations', 'Operations Calendar']])}
          <div class="grid-3">
            ${data.widgets.map((item) => statCard({ iconName: item.iconName, label: item.label, value: item.value, body: item.body, meta: item.meta })).join('')}
          </div>
        </section>

        ${pageQuestions('/operations')}

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Today\'s fittings', title: 'Revenue-relevant appointments first', body: 'These are the calendar items most directly tied to commercial output.' })}
            <div class="section-stack">
              ${data.todaySchedule.filter((item) => item.type === 'Fitting').map((item) => registerRow({ kicker: `${pill(item.startTime, 'info')}${pill(item.location, 'neutral')}${pill(item.priority, toneFromPriority(item.priority))}`, title: item.title, body: `${item.body} Staff: ${item.staff}. Status: ${item.status}.`, extra: `<div class="mini-list"><li>${escapeHtml(`Customer: ${item.customer || '—'}`)}</li><li>${escapeHtml(`Duration: ${item.durationMinutes} minutes`)}</li></div>` })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Upcoming meetings', title: 'Coordination points and deadlines', body: 'Operational meetings, reviews, and near-term timing commitments.' })}
            <div class="section-stack">
              ${[...data.upcomingMeetings, ...data.deadlines].slice(0, 6).map((item) => registerRow({ kicker: `${pill(item.startTime || item.due || 'Upcoming', 'info')}${pill(item.location || item.owner || 'Operations', 'neutral')}`, title: item.title, body: item.body || item.note || 'Timing-sensitive operating item.', extra: item.customer ? `<div class="mini-list"><li>${escapeHtml(`Customer: ${item.customer}`)}</li></div>` : '' })).join('')}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Staff availability', title: 'Who can absorb more work safely', body: 'Staff utilisation should stay commercially useful without drifting into avoidable compression.' })}
            <div class="section-stack">
              ${data.staffAvailability.map((item) => insightCard({ eyebrow: `${item.role} · ${item.status}`, title: item.name, body: `${item.availability} ${item.detail}`, tone: item.status === 'Tight' ? 'warn' : item.status === 'Conditional' ? 'info' : 'good' })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Free capacity', title: 'Where more demand can fit', body: 'These windows are the clearest opportunities to convert spare capacity into bookings.' })}
            <div class="section-stack">
              ${data.freeCapacity.map((item) => registerRow({ kicker: `${pill(item.duration, 'good')}${pill(item.suitability, 'neutral')}`, title: item.label, body: item.note })).join('')}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Travel and all-day events', title: 'Non-meeting schedule pressure', body: 'Travel and all-day holds still shape real operating capacity.' })}
            <div class="section-stack">
              ${[...data.travel, ...data.allDayEvents].map((item) => registerRow({ kicker: `${pill(item.time || item.date || 'All day', 'info')}${pill(item.location || item.owner || 'Operations', 'neutral')}`, title: item.title, body: item.note })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Operational intelligence', title: 'Deterministic scheduling insights', body: 'These insights are generated from utilisation, free capacity, back-to-back items, and workload shape.' })}
            <div class="tile-grid">
              ${data.insightCards.map((item) => insightCard({ eyebrow: item.eyebrow, title: item.title, body: item.body, tone: item.tone || 'info' })).join('')}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Week capacity', title: 'Where the week gets tight', body: 'Capacity today matters, but the week shape matters more for planning.' })}
            <div class="section-stack">
              ${data.weekCapacity.map((item) => registerRow({ kicker: `${pill(item.day, 'info')}${pill(item.utilisation, toneFromSeverity(Number.parseInt(item.utilisation, 10) >= 90 ? 'high' : Number.parseInt(item.utilisation, 10) >= 75 ? 'medium' : 'low'))}`, title: `${item.day} utilisation`, body: item.note })).join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Approval-first actions', title: 'What leadership could stage next', body: 'No scheduling action executes automatically. These cards only prepare decisions.' })}
            <div class="section-stack">
              ${data.approvalCards.map((item) => approvalCard(item)).join('')}
            </div>
          </section>
        </div>
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
          ${sectionHeader({ eyebrow: 'Reports', title, body: 'This route exists to show the permanent structure of executive reporting inside EP Hub.' })}
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
              <div class="hero-title">A dedicated executive AI layer inside EP Hub.</div>
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
          ${sectionHeader({ eyebrow: 'Ask EP Hub', title: 'Example executive conversations', body: WORKSPACE_DATA.aiAssistant.askWorkspace.intro })}
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
  const operations = WORKSPACE_DATA.operations;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'AI Assistant', title: 'Ask EP Hub', body: data.intro })}
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
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Inbox', title: 'What communications need from the CEO', body: WORKSPACE_DATA.communications.summary.dailySummary })}
          <div class="section-stack">${WORKSPACE_DATA.communications.sections.slice(0, 2).flatMap((section) => section.items.slice(0, 2)).map((item) => registerRow({ kicker: `${pill(item.category, 'info')}${pill(item.priority, toneFromPriority(item.priority))}`, title: item.subject, body: item.aiSummary })).join('')}</div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Operations Calendar', title: 'What the schedule needs from the CEO', body: operations.summary.dailySummary })}
          <div class="section-stack">${operations.todaySchedule.slice(0, 4).map((item) => registerRow({ kicker: `${pill(item.startTime, 'info')}${pill(item.type, 'neutral')}${pill(item.priority, toneFromPriority(item.priority))}`, title: item.title, body: item.body })).join('')}</div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Business memory', title: 'What the business memory says', body: 'These are the durable context prompts now available to the executive reasoning layer.' })}
          <div class="section-stack">${WORKSPACE_DATA.aiAssistant.memory.context.deterministic.map((item) => registerRow({ kicker: pill(item.department || 'Executive Memory', 'info'), title: item.title, body: item.summary })).join('')}</div>
        </section>
      </div>
    `,
    charts: []
  };
}

function aiAssistantExecutiveBriefingView() {
  const intelligence = WORKSPACE_DATA.intelligence;
  const communications = WORKSPACE_DATA.communications;
  const operations = WORKSPACE_DATA.operations;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'AI Assistant', title: 'Executive Briefing', body: intelligence.narratives.dailyBriefing.summary })}
          ${renderRoutePillbar(SUBNAV.aiAssistant)}
          <div class="grid-4">
            ${statCard({ iconName: 'pulse', label: 'Overall health', value: String(intelligence.health.overall.score), body: intelligence.health.overall.label })}
            ${statCard({ iconName: 'book-open', label: 'Inbox priorities', value: String(communications.metrics.needsReply || 0), body: communications.summary.headline })}
            ${statCard({ iconName: 'calendar', label: "Today's schedule", value: String(operations.metrics.todaysSchedule || 0), body: operations.summary.headline })}
            ${statCard({ iconName: 'target', label: 'Open booking slots', value: String(operations.metrics.availableBookingSlots || 0), body: 'Visible capacity that could still be turned into revenue.' })}
          </div>
        </section>
        ${pageQuestions('/ai-assistant/executive-briefing')}
        <div class="grid-2">
          ${insightCard({ eyebrow: 'Top insight', title: intelligence.insights.topInsight.title, body: intelligence.insights.topInsight.executiveSummary, tone: toneFromPriority(intelligence.insights.topInsight.priority) })}
          ${insightCard({ eyebrow: 'Top recommendation', title: intelligence.recommendations[0].recommendation, body: intelligence.recommendations[0].expectedBenefit, tone: toneFromPriority(intelligence.recommendations[0].priority) })}
          ${insightCard({ eyebrow: 'Operations summary', title: operations.summary.headline, body: operations.summary.dailySummary, tone: operations.providerSummary.tone || 'info' })}
          ${insightCard({ eyebrow: 'Communications summary', title: communications.summary.headline, body: communications.summary.dailySummary, tone: communications.providerSummary.tone || 'info' })}
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Suggested schedule improvements', title: 'What leadership should change next', body: 'These recommendations stay approval-first and deterministic.' })}
          <div class="section-stack">
            ${intelligence.recommendations.filter((item) => /Operations|COO|Sales/.test(item.suggestedOwner)).slice(0, 4).map((item) => registerRow({ kicker: `${pill(item.priority, toneFromPriority(item.priority))}${pill(item.suggestedOwner, 'neutral')}`, title: item.recommendation, body: item.why })).join('')}
          </div>
        </section>
      </div>
    `,
    charts: []
  };
}

function aiAssistantMemoryContextView() {
  const memory = WORKSPACE_DATA.aiAssistant.memory;
  const query = state.memoryQuery.trim().toLowerCase();
  const results = memory.searchIndex.filter((item) => {
    if (!query) return true;
    return [item.title, item.body, item.type, item.meta, item.route].join(' ').toLowerCase().includes(query);
  });
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'AI Memory / Context', title: 'Searchable executive memory', body: 'The business now has a structured memory layer that can be searched and referenced by deterministic executive reasoning.' })}
          ${renderRoutePillbar(SUBNAV.aiAssistant)}
          ${searchRow({ id: 'memory-search', value: state.memoryQuery, placeholder: 'Search timeline, goals, decisions, recommendations, historical events…', label: 'Search executive memory' })}
          <div class="grid-4">
            ${statCard({ iconName: 'book-open', label: 'Timeline events', value: String(memory.timeline.length), body: 'Permanent business chronology now lives outside any single provider.' })}
            ${statCard({ iconName: 'check-circle', label: 'Decisions', value: String(memory.decisions.length), body: 'Structured executive decisions are now persisted.' })}
            ${statCard({ iconName: 'target', label: 'Goals', value: String(memory.goals.length), body: 'Strategic goals now persist across the workspace.' })}
            ${statCard({ iconName: 'sparkles', label: 'Graph relationships', value: String(memory.graph.summary.edgeCount), body: `${memory.graph.summary.nodeCount} nodes linked through structured relationships.` })}
          </div>
        </section>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Deterministic context', title: 'What the engine can now reference', body: 'Historical patterns and recurring issues can now shape executive narratives without external AI.' })}
            <div class="section-stack">${memory.context.deterministic.map((item) => registerRow({ kicker: `${pill(item.department || 'Executive Memory', 'info')}${pill(item.severity || 'Context', memoryStatusTone(item.severity || 'Context'))}`, title: item.title, body: item.summary })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Knowledge graph', title: 'Structured relationship map', body: `The graph currently covers ${memory.graph.summary.nodeCount} nodes and ${memory.graph.summary.edgeCount} edges.` })}
            <div class="tile-grid">
              ${memory.graph.summary.types.map((type) => insightCard({ eyebrow: 'Node type', title: type, body: 'This entity type is now represented inside the business memory graph.', tone: 'neutral' })).join('')}
            </div>
          </section>
        </div>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Memory search', title: query ? `Results for “${state.memoryQuery}”` : 'Index coverage', body: 'Global search now includes routes, timeline entries, goals, decisions, recommendations, and historical context.' })}
          <div class="section-stack">${results.map((item) => registerRow({ kicker: `${pill(item.type, 'info')}${pill(item.meta || 'Indexed', 'neutral')}`, title: item.title, body: item.body, extra: `<button type="button" class="text-link" data-route="${item.route}">${icon('arrowRight')} Open source route</button>` })).join('')}</div>
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

function executiveActionCentreView() {
  const data = WORKSPACE_DATA.actions;
  return {
    html: `
      <div class="page-grid">
        <section class="hero-grid">
          <div class="hero-block">
            <section class="summary-banner">
              <div class="eyebrow">Executive Action Centre</div>
              <div class="hero-title">One queue for what the business needs next.</div>
              <p class="hero-summary">${escapeHtml(data.summary.body)}</p>
            </section>
            <section class="snapshot-grid">
              ${statCard({ iconName: 'check-circle', label: 'Active actions', value: String(data.metrics.active), body: 'Open executive work across the operating system.' })}
              ${statCard({ iconName: 'alert-triangle', label: 'Urgent items', value: String(data.metrics.urgent), body: 'High-priority or high-risk work needing fast attention.' })}
              ${statCard({ iconName: 'sparkles', label: 'Approval-stage items', value: String(data.metrics.approvals), body: 'Nothing executes automatically; everything stays approval-first.' })}
              ${statCard({ iconName: 'calendar', label: "Today's queue", value: String(data.queues.todaysActions.length), body: 'Due today or needing same-day executive attention.' })}
            </section>
          </div>
          <div class="hero-side">
            <section class="score-panel">
              <div class="score-tile">
                <div class="label">My Queue</div>
                <strong class="score-value">${data.queues.myQueue.length}</strong>
                <div class="score-note">${escapeHtml(data.summary.headline)}</div>
              </div>
              <div class="snapshot-panel">
                <div class="label">Categories</div>
                <h3>${escapeHtml(data.categories.slice(0, 4).join(' · '))}</h3>
                <p>${escapeHtml(`All ${data.categories.length} action categories are now available inside one operating queue.`)}</p>
              </div>
            </section>
          </div>
        </section>
        ${renderRoutePillbar(SUBNAV.executiveActionCentre)}
        ${pageQuestions('/executive-action-centre')}
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Top priorities', title: 'What leadership should handle first', body: 'These are the highest-value actions across finance, marketing, inbox, and operations.' })}
            <div class="section-stack">${data.queues.urgent.slice(0, 5).map((item) => registerRow({ kicker: `${pill(item.priority, toneFromPriority(item.priority))}${pill(item.category, 'info')}${pill(item.status, memoryStatusTone(item.status))}`, title: item.title, body: item.summary, extra: `<button type="button" class="text-link" data-action-id="${item.id}">${icon('arrowRight')} Open detail</button>` })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Queue segments', title: 'How the executive queue is organised', body: 'The queue is deliberately small, ranked, and explainable.' })}
            <div class="tile-grid">
              ${insightCard({ eyebrow: 'My Queue', title: `${data.queues.myQueue.length} items`, body: 'CEO-owned work awaiting attention.', tone: 'info' })}
              ${insightCard({ eyebrow: 'Today', title: `${data.queues.todaysActions.length} items`, body: 'Work due today or already pressing.', tone: 'warn' })}
              ${insightCard({ eyebrow: 'Waiting', title: `${data.queues.waitingForMe.length} items`, body: 'Items waiting for executive review or decision.', tone: 'neutral' })}
              ${insightCard({ eyebrow: 'Approved / Rejected', title: `${data.metrics.approved} / ${data.metrics.rejected}`, body: 'Decision history now persists as executive memory.', tone: 'good' })}
            </div>
          </section>
        </div>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Department workload', title: 'Where action pressure is accumulating', body: 'Action volume now makes department strain visible before it becomes operating drag.' })}
            <div class="section-stack">${data.departmentWorkload.slice(0, 6).map((item) => registerRow({ kicker: `${pill(`${item.active} active`, 'info')}${pill(`${item.urgent} urgent`, item.urgent ? 'warn' : 'neutral')}`, title: item.department, body: item.summary })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Future execution layer', title: 'Adapters are prepared, execution is still locked', body: 'Validate and preview exist now; execute intentionally returns Approval Required.' })}
            <div class="section-stack">${data.executionLayer.map((item) => insightCard({ eyebrow: item.label, title: item.provider, body: `${item.supports.join(', ')}. Execute → ${item.execution}.`, tone: 'neutral' })).join('')}</div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function executiveQueueView() {
  const data = WORKSPACE_DATA.actions;
  const sections = [
    ['My Queue', data.queues.myQueue],
    ["Today's Actions", data.queues.todaysActions],
    ['Urgent', data.queues.urgent],
    ['This Week', data.queues.thisWeek],
    ['Waiting For Me', data.queues.waitingForMe],
    ['Completed Today', data.queues.completedToday],
    ['Recently Approved', data.queues.recentlyApproved],
    ['Recently Rejected', data.queues.recentlyRejected]
  ];
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Queue', title: 'Queue segments for decision speed', body: 'The queue is split into practical executive buckets so the CEO sees sequence, not noise.' })}
          ${renderRoutePillbar(SUBNAV.executiveActionCentre)}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: 'My Queue', value: String(data.queues.myQueue.length), body: 'CEO-owned actions.' })}
            ${statCard({ iconName: 'alert-triangle', label: 'Urgent', value: String(data.queues.urgent.length), body: 'High priority or high risk.' })}
            ${statCard({ iconName: 'calendar', label: 'This Week', value: String(data.queues.thisWeek.length), body: 'Actions due before the week closes.' })}
            ${statCard({ iconName: 'sparkles', label: 'Completed Today', value: String(data.queues.completedToday.length), body: 'Completed actions remain searchable in memory.' })}
          </div>
        </section>
        <div class="settings-grid">${sections.map(([title, items]) => `
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Queue', title, body: items.length ? `${items.length} items currently in this bucket.` : 'No items currently in this bucket.' })}
            <div class="section-stack">${(items.length ? items : [{ title: 'No items', summary: 'Nothing currently visible here.', priority: 'Low', category: 'General', status: 'Clear', id: '' }]).map((item) => registerRow({ kicker: `${pill(item.priority || 'Low', toneFromPriority(item.priority || 'Low'))}${pill(item.category || 'General', 'info')}${pill(item.status || 'Clear', memoryStatusTone(item.status || 'Clear'))}`, title: item.title, body: item.summary, extra: item.id ? `<button type="button" class="text-link" data-action-id="${item.id}">${icon('arrowRight')} Open detail</button>` : '' })).join('')}</div>
          </section>
        `).join('')}</div>
      </div>
    `,
    charts: []
  };
}

function actionDetailView() {
  const action = selectedAction();
  if (!action) return executiveActionCentreView();
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: action.category, title: action.title, body: action.executiveSummary || action.summary })}
          ${renderRoutePillbar(SUBNAV.executiveActionCentre)}
          <div class="grid-4">
            ${statCard({ iconName: 'alert-triangle', label: 'Priority', value: action.priority, body: `Risk ${action.risk} · Confidence ${action.confidence}.` })}
            ${statCard({ iconName: 'calendar', label: 'Due', value: action.dueDate, body: `Created ${action.created}. Estimated ${action.estimatedTime}.` })}
            ${statCard({ iconName: 'check-circle', label: 'Status', value: action.status, body: `Owner ${action.owner}.` })}
            ${statCard({ iconName: 'sparkles', label: 'Business value', value: action.businessValue, body: 'This action exists because it should change an executive outcome, not just clear admin.' })}
          </div>
        </section>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Executive Summary', title: 'Business context', body: action.businessContext })}
            ${insightCard({ eyebrow: 'Recommended outcome', title: action.recommendedOutcome, body: action.summary, tone: toneFromPriority(action.priority) })}
            <div class="chip-list">${action.workflowActions.map((item) => `<span class="sidebar-chip">${escapeHtml(item)}</span>`).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Linked providers', title: action.linkedProviders.join(' · ') || 'Provider-linked action', body: 'The action detail page explains where the recommendation came from and what it connects to.' })}
            <div class="section-stack">${action.evidence.map((item) => insightCard({ eyebrow: item.label, title: item.value, body: item.note, tone: item.tone || 'info' })).join('')}</div>
          </section>
        </div>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Related Metrics', title: 'KPIs and dependencies', body: 'Every action carries the signals it should be judged against.' })}
            <div class="section-stack">${action.relatedKpis.map((item) => registerRow({ kicker: pill('KPI', 'info'), title: item, body: 'This KPI is directly relevant to the action outcome.' })).join('') || insightCard({ eyebrow: 'KPI', title: 'No linked KPIs', body: 'This action currently relies more on narrative and provider context than numeric KPIs.', tone: 'neutral' })}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Historical Context', title: 'Memory and decision history', body: 'Approved, rejected, and completed actions become part of Executive Memory.' })}
            <div class="section-stack">${action.history.map((item) => registerRow({ kicker: `${pill(item.type, 'info')}${pill(item.status, memoryStatusTone(item.status))}`, title: item.timestamp, body: item.summary })).join('')}</div>
          </section>
        </div>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Alternatives', title: 'Other options leadership could take', body: 'An action is explainable only when alternatives remain visible.' })}
            <div class="section-stack">${action.alternatives.map((item) => insightCard({ eyebrow: 'Alternative', title: item, body: 'Available but intentionally not executed automatically.', tone: 'neutral' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Supporting Evidence', title: 'Why this action exists', body: 'Evidence stays explicit so the recommendation can be challenged.' })}
            <div class="section-stack">${action.supportingEvidence.map((item) => registerRow({ kicker: pill('Evidence', 'good'), title: item, body: 'Provider-backed or memory-backed supporting signal.' })).join('')}</div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function approvalWorkflowView() {
  const data = WORKSPACE_DATA.actions.approvalWorkflow;
  const adapters = WORKSPACE_DATA.actions.adapters;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Approval Workflow', title: data.title, body: data.principle })}
          ${renderRoutePillbar(SUBNAV.executiveActionCentre)}
          <div class="chip-list">${data.workflowActions.map((item) => `<span class="sidebar-chip">${escapeHtml(item)}</span>`).join('')}</div>
          <div class="tile-grid">${data.stages.map((item) => insightCard({ eyebrow: 'Workflow stage', title: item, body: 'Every stage is explicit, explainable, and approval-first.', tone: 'neutral' })).join('')}</div>
        </section>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Approval-stage actions', title: 'What is currently moving through workflow', body: 'These items are staged, not executed.' })}
            <div class="section-stack">${data.items.map((item) => registerRow({ kicker: `${pill(item.status, memoryStatusTone(item.status))}${pill(item.priority, toneFromPriority(item.priority))}`, title: item.title, body: item.summary, extra: `<button type="button" class="text-link" data-action-id="${item.id}">${icon('arrowRight')} Open detail</button>` })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Execution adapters', title: 'Prepared for the future, blocked in v2.0', body: 'validate() and preview() work now; execute() intentionally returns Approval Required.' })}
            <div class="section-stack">${adapters.map((item) => insightCard({ eyebrow: item.label, title: item.execute.status, body: `${item.provider} · supports ${item.supports.join(', ')}.`, tone: 'warn' })).join('')}</div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function executiveCopilotOverviewView() {
  const data = WORKSPACE_DATA.executiveCopilot;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Copilot', title: 'Ask what to do next', body: data.intro })}
          ${renderRoutePillbar(SUBNAV.executiveCopilot)}
          <div class="grid-4">
            ${statCard({ iconName: 'sparkles', label: 'Prompt library', value: String(data.prompts.length), body: 'High-value executive questions are now pre-wired.' })}
            ${statCard({ iconName: 'grid', label: 'Architecture layers', value: String(data.architecture.length), body: data.architecture.join(' → ') })}
            ${statCard({ iconName: 'check-circle', label: 'Approval-first answers', value: 'Yes', body: 'Copilot explains actions but does not execute them.' })}
            ${statCard({ iconName: 'book-open', label: 'Memory-backed', value: 'Yes', body: 'Executive memory and action history now shape answers.' })}
          </div>
        </section>
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Suggested questions', title: 'What the CEO can ask now', body: 'These questions are resolved through provider data, services, intelligence, memory, and the knowledge graph.' })}
          <div class="chip-list">${data.suggestedQuestions.map((item) => `<button type="button" class="follow-up-chip" data-follow-up="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div>
        </section>
        <div class="grid-2">${data.prompts.slice(0, 4).map((item) => insightCard({ eyebrow: item.title, title: item.question, body: item.answer, tone: 'info' })).join('')}</div>
      </div>
    `,
    charts: []
  };
}

function executiveCopilotAskView() {
  const data = WORKSPACE_DATA.executiveCopilot;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Copilot', title: 'Ask EP Hub', body: 'Answers are action-oriented, explainable, and approval-first.' })}
          ${renderRoutePillbar(SUBNAV.executiveCopilot)}
        </section>
        <div class="section-stack">${data.prompts.map((item) => registerRow({ kicker: `${pill('Executive question', 'info')}${pill(item.supportingRoutes.join(' · '), 'neutral')}`, title: item.question, body: `${item.answer} ${item.rationale}`, extra: `<div class="chip-list">${item.supportingRoutes.map((route) => `<button type="button" class="sidebar-chip" data-route="${route}">${escapeHtml(routeLabel(route))}</button>`).join('')}</div>` })).join('')}</div>
      </div>
    `,
    charts: []
  };
}

function executiveCopilotBriefingView() {
  const actions = WORKSPACE_DATA.actions;
  const intelligence = WORKSPACE_DATA.intelligence;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Copilot', title: 'Executive Briefing', body: 'This briefing now includes queue pressure, approvals, and action history alongside performance signals.' })}
          ${renderRoutePillbar(SUBNAV.executiveCopilot)}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: 'Active actions', value: String(actions.metrics.active), body: 'Action backlog is now part of executive health.' })}
            ${statCard({ iconName: 'alert-triangle', label: 'Urgent', value: String(actions.metrics.urgent), body: 'Urgent work awaiting executive handling.' })}
            ${statCard({ iconName: 'calendar', label: 'Approvals', value: String(actions.metrics.approvals), body: 'Approval-stage work needing governance.' })}
            ${statCard({ iconName: 'sparkles', label: 'Business health', value: String(intelligence.health.overall.score), body: intelligence.health.overall.label })}
          </div>
        </section>
        <div class="grid-2">
          ${insightCard({ eyebrow: 'Top insight', title: intelligence.insights.topInsight.title, body: intelligence.insights.topInsight.executiveSummary, tone: toneFromPriority(intelligence.insights.topInsight.priority) })}
          ${insightCard({ eyebrow: 'Top action', title: actions.queues.myQueue[0]?.title || 'No active queue item', body: actions.queues.myQueue[0]?.summary || 'Queue currently clear.', tone: actions.queues.myQueue[0] ? toneFromPriority(actions.queues.myQueue[0].priority) : 'neutral' })}
        </div>
      </div>
    `,
    charts: []
  };
}

function executiveCopilotMemoryContextView() {
  const memory = WORKSPACE_DATA.aiAssistant.memory;
  const actionResults = WORKSPACE_DATA.actions.searchIndex.slice(0, 8);
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Executive Copilot', title: 'Memory & Action Context', body: 'Copilot can now see action history, executive memory, and knowledge-graph relationships together.' })}
          ${renderRoutePillbar(SUBNAV.executiveCopilot)}
          <div class="grid-4">
            ${statCard({ iconName: 'book-open', label: 'Memory events', value: String(memory.timeline.length), body: 'Structured chronology retained across the product.' })}
            ${statCard({ iconName: 'check-circle', label: 'Decisions', value: String(memory.decisions.length), body: 'Approved/rejected/completed decisions retained.' })}
            ${statCard({ iconName: 'sparkles', label: 'Graph edges', value: String(memory.graph.summary.edgeCount), body: 'Knowledge graph links actions, goals, and decisions.' })}
            ${statCard({ iconName: 'grid', label: 'Action search hits', value: String(actionResults.length), body: 'Actions are now part of global search.' })}
          </div>
        </section>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Memory context', title: 'Deterministic historical context', body: 'Longer-term patterns remain available to Copilot answers.' })}
            <div class="section-stack">${memory.context.deterministic.slice(0, 6).map((item) => registerRow({ kicker: pill(item.department || 'Executive Memory', 'info'), title: item.title, body: item.summary })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Indexed actions', title: 'Action coverage in search', body: 'Action detail routes are now first-class search targets.' })}
            <div class="section-stack">${actionResults.map((item) => registerRow({ kicker: `${pill(item.type, 'info')}${pill(item.meta, 'neutral')}`, title: item.title, body: item.body, extra: `<button type="button" class="text-link" data-action-id="${item.actionId || ''}">${icon('arrowRight')} Open</button>` })).join('')}</div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function actionReportView(key, title, body) {
  const report = WORKSPACE_DATA.actions.reports[key];
  const items = report.items || report.highlights || report.breakdown || report.backlogByStatus || [];
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Reports', title: report.title || title, body: report.summary || body })}
          ${renderRoutePillbar(SUBNAV.reports)}
        </section>
        <section class="panel">
          <div class="section-stack">${items.map((item) => registerRow({ kicker: `${pill(item.status || item.department || item.priority || 'Report', 'info')}${item.count != null ? pill(String(item.count), 'neutral') : ''}`, title: item.title || item.department || item.status, body: item.summary || item.body || item.note || `${item.count || ''}`.trim(), extra: item.id ? `<button type="button" class="text-link" data-action-id="${item.id}">${icon('arrowRight')} Open detail</button>` : '' })).join('')}</div>
        </section>
      </div>
    `,
    charts: []
  };
}

function settingsActionCentreView() {
  const config = WORKSPACE_DATA.actions.settings;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Settings', title: 'Action Centre configuration', body: 'v2.0 adds configurable queue rules for how the executive operating system should behave.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: 'Retention', value: 'Enabled', body: config.actionRetention })}
            ${statCard({ iconName: 'sparkles', label: 'Business hours', value: config.businessHours, body: 'Used to judge urgency and review cadence.' })}
            ${statCard({ iconName: 'grid', label: 'Store key', value: config.storeKey, body: 'Reserved for future persistent action-state overlays.' })}
            ${statCard({ iconName: 'alert-triangle', label: 'Execution state', value: 'Approval Required', body: 'Adapters are scaffolded, not live.' })}
          </div>
        </section>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Priority rules', title: 'What gets surfaced faster', body: 'Priority is now shaped by business value, risk, trust, and timing.' })}
            <div class="section-stack">${config.priorityRules.map((item) => insightCard({ eyebrow: 'Rule', title: item, body: 'Used inside the Executive Action Centre queueing logic.', tone: 'info' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Confidence thresholds', title: 'How confidence is interpreted', body: 'Confidence stays visible so leadership can challenge weak recommendations.' })}
            <div class="section-stack">${Object.entries(config.confidenceThresholds).map(([key, value]) => registerRow({ kicker: pill(key, 'neutral'), title: value, body: 'Confidence level used across action ranking and explanation.' })).join('')}</div>
          </section>
        </div>
        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Defaults', title: 'Approval and routing defaults', body: 'Nothing auto-executes; everything routes through explicit ownership and review.' })}
            <div class="section-stack">${config.approvalDefaults.concat(config.departmentRouting).map((item) => registerRow({ kicker: pill('Default', 'warn'), title: item, body: 'Action Centre configuration item.' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Notifications', title: 'Visibility preferences', body: 'The action layer should be visible without becoming noisy.' })}
            <div class="section-stack">${config.notificationPreferences.map((item) => insightCard({ eyebrow: 'Preference', title: item, body: 'Used to decide where action pressure is surfaced in the product.', tone: 'neutral' })).join('')}</div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

function settingsView() {
  const config = WORKSPACE_DATA.settings.configuration;
  const memory = WORKSPACE_DATA.settings.memory;
  const release = WORKSPACE_DATA.settings.release;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Settings', title: 'Architecture, release, and memory overview', body: 'EP Hub now combines provider/service/config architecture, provider-independent Executive Memory, and a formal release-management layer.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: 'Current Release', value: release.displayName, body: `${release.codename} is the current formal platform release.` })}
            ${statCard({ iconName: 'grid', label: 'Semantic Version', value: release.version, body: `Released ${release.releaseDate} in ${release.currentSprint}.` })}
            ${statCard({ iconName: 'settings', label: 'Environment', value: release.environment, body: release.environmentDetail, meta: release.overlayStatus })}
            ${statCard({ iconName: 'sparkles', label: 'Memory Relationships', value: String(memory.graph.edgeCount), body: 'Executive memory is now linked through a structured knowledge graph.' })}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'About', title: 'Release metadata and governance', body: 'Versioning, changelog discipline, and planning references now sit alongside the core platform settings.' })}
            <div class="snapshot-panel">
              <h3>${escapeHtml(release.fullName)}</h3>
              <p>${escapeHtml(`Build ${release.buildNumber}. ${release.overlayStatus}.`)}</p>
              <button type="button" class="quick-action-button" data-route="/settings/about">Open About ${icon('arrowRight')}</button>
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Integration Status', title: 'Health monitoring view', body: 'See the placeholder status for every future integration target.' })}
            <div class="snapshot-panel">
              <h3>${escapeHtml(APP_RUNTIME.config.liveData.gmail.available ? 'Gmail is now live-capable' : 'Gmail is ready for activation')}</h3>
              <p>The architecture is now ready for provider-by-provider activation without rewriting the executive UI, and Gmail now follows the same generated-snapshot pattern as GA4 and YouTube.</p>
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
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Executive Memory', title: 'Retention and persistence', body: 'Business knowledge is now retained independently of any live provider state.' })}
            <div class="snapshot-panel">
              <h3>${escapeHtml(memory.storeKey)}</h3>
              <p>${escapeHtml(`Timeline: ${memory.retention.timelineHistory}. Decisions: ${memory.retention.completedDecisions}. Archived goals: ${memory.retention.archivedGoals}.`)}</p>
              <button type="button" class="quick-action-button" data-route="/ai-assistant/memory-context">Open AI Memory / Context ${icon('arrowRight')}</button>
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
  const ga4 = APP_RUNTIME.config.liveData.ga4;
  const youtube = APP_RUNTIME.config.liveData.youtube;
  const gmail = APP_RUNTIME.config.liveData.gmail;
  const calendar = APP_RUNTIME.config.liveData.calendar;
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
          ${sectionHeader({ eyebrow: 'Integration Status', title: 'Health monitoring', body: 'EP Hub stays mostly in Demo Mode, but Website Analytics, YouTube, Executive Inbox, and Operations Calendar can now hydrate from generated local snapshots when configured.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: 'GA4 state', value: ga4.status, body: ga4.detail })}
            ${statCard({ iconName: 'sparkles', label: 'YouTube state', value: youtube.status, body: youtube.detail })}
            ${statCard({ iconName: 'book-open', label: 'Gmail state', value: gmail.status, body: gmail.detail })}
            ${statCard({ iconName: 'calendar', label: 'Calendar state', value: calendar.status, body: calendar.detail })}
            ${statCard({ iconName: 'grid', label: 'Registered integrations', value: String(WORKSPACE_DATA.settings.integrationStatus.length), body: 'Every future integration still has a status surface.' })}
            ${statCard({ iconName: 'settings', label: 'Provider classes', value: String(APP_RUNTIME.providers.length), body: 'AnalyticsProvider, YouTubeProvider, GmailProvider, and CalendarProvider now support selective live overlays with safe fallback to demo data.' })}
          </div>
        </section>

        <div class="settings-grid">
          ${groups
            .map(
              ([group, entries]) => `
                <section class="panel">
                  ${sectionHeader({ eyebrow: 'Integration group', title: group, body: 'Google Analytics, YouTube, Gmail, and Google Calendar may now be live on their specific provider paths; every other entry remains in Demo Mode.' })}
                  <div class="section-stack">
                    ${entries
                      .map((entry) =>
                        registerRow({
                          kicker: `${pill(entry.status, 'info')}${pill(entry.provider, 'neutral')}${pill(entry.service, 'good')}`,
                          title: entry.label,
                          body: entry.notes,
                          meta: `${entry.detail || 'No extra integration detail yet.'} Registration key: ${entry.id}`
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

function toolConnectionTone(status = '') {
  const value = String(status).toLowerCase();
  if (value.includes('active') || value.includes('ready')) return 'good';
  if (value.includes('live-capable')) return 'info';
  if (value.includes('blocked') || value.includes('credential')) return 'warn';
  if (value.includes('future')) return 'neutral';
  return 'info';
}

function getToolConnectionPlan() {
  const liveData = APP_RUNTIME.config.liveData;
  return [
    {
      group: 'Marketing & analytics',
      tools: [
        {
          name: 'Google Analytics 4',
          status: liveData.ga4.available ? 'Active snapshot' : 'Live-capable · needs credentials/sync',
          provider: 'AnalyticsProvider',
          feeds: 'Website Analytics, CMO reports, CEO demand signals, Marketing Health Score',
          needs: 'GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY, GA4_PROJECT_ID',
          command: 'npm run ga4:sync',
          action: 'Validate property/events, then run snapshot sync server-side only.'
        },
        {
          name: 'YouTube',
          status: liveData.youtube.available ? 'Active snapshot' : 'Live-capable · needs API key/channel sync',
          provider: 'YouTubeProvider',
          feeds: 'YouTube page, CMO social overview, CEO marketing momentum, content recommendations',
          needs: 'YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID',
          command: 'npm run youtube:sync',
          action: 'Confirm channel ID and run snapshot sync.'
        },
        {
          name: 'Instagram / Facebook / LinkedIn / X',
          status: liveData.social?.available ? 'Active snapshot' : 'Accounts confirmed · LinkedIn API key supplied',
          provider: 'UnifiedSocialProvider',
          feeds: 'Unified social score, platform rankings, social attribution, competitor benchmarking. Confirmed accounts: Instagram, Facebook, LinkedIn, X, TikTok.',
          needs: 'SOCIAL_SNAPSHOT_SOURCE or approved platform export/API bridge; LinkedIn API key has been supplied outside the checklist',
          command: 'npm run social:sync',
          action: 'Confirm whether to start with weekly exports or official APIs, then extend UnifiedSocialProvider to include LinkedIn and TikTok where available.'
        },
        {
          name: 'Mailchimp',
          status: 'Confirmed future provider · not connected',
          provider: 'MarketingProvider',
          feeds: 'Email Marketing, campaign performance, audience health, weekly marketing reports',
          needs: 'MAILCHIMP_API_KEY and audience/campaign mapping once provider is built',
          command: 'Not built yet',
          action: 'Build MailchimpProvider once Gmail and Calendar snapshots are activated.'
        }
      ]
    },
    {
      group: 'Communications & operations',
      tools: [
        {
          name: 'Gmail',
          status: liveData.gmail.available ? 'Active snapshot' : 'Live-capable · OAuth required',
          provider: 'GmailProvider',
          feeds: 'Executive Inbox, customer/supplier/finance triage, approval-first reply actions',
          needs: 'GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_ACCOUNT',
          command: 'npm run gmail:sync',
          action: 'Connect the EP Golf Studios Gmail account through server-side OAuth and sync a local inbox snapshot.'
        },
        {
          name: 'Google Calendar',
          status: liveData.calendar.available ? 'Active snapshot' : 'Live-capable · OAuth required',
          provider: 'CalendarProvider',
          feeds: 'Operations Calendar, schedule pressure, fitting capacity, executive timeline',
          needs: 'GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_SECRET, GOOGLE_CALENDAR_REFRESH_TOKEN, GOOGLE_CALENDAR_ID',
          command: 'npm run calendar:sync',
          action: 'Complete OAuth server-side and sync an operations calendar snapshot.'
        }
      ]
    },
    {
      group: 'Finance, sales & workflow',
      tools: [
        {
          name: 'QuickBooks',
          status: 'Confirmed future provider · not connected',
          provider: 'FinanceProvider',
          feeds: 'CFO workspace, cash flow, VAT, supplier spend, profitability, board reporting',
          needs: 'QuickBooks OAuth/API credentials, company ID, chart-of-accounts mapping',
          command: 'Not built yet',
          action: 'Build QuickBooksProvider v1.0 after booking/fitting source is confirmed.'
        },
        {
          name: 'Stripe / payments',
          status: 'Future provider · not connected',
          provider: 'FinanceProvider',
          feeds: 'Payment timing, deposit visibility, revenue confidence, conversion quality',
          needs: 'STRIPE_SECRET_KEY or approved payments export once provider is built',
          command: 'Not built yet',
          action: 'Connect after accounting/booking priorities are clear.'
        },
        {
          name: 'Booking / fitting system',
          status: 'Priority future provider · not connected',
          provider: 'BookingProvider',
          feeds: 'Primary conversion, fitting capacity, sales quality, marketing attribution',
          needs: 'Booking platform/API/export format and final conversion event names',
          command: 'Not built yet',
          action: 'This should be the next major connector because fittings are the primary conversion.'
        },
        {
          name: 'OpenClaw / approval workflow',
          status: 'Prepared · execution locked',
          provider: 'AIProvider / ActionService',
          feeds: 'Executive Copilot, action queues, approval history, future orchestration metadata',
          needs: 'Approval-first policy, execution adapters, optional server-side action gateway',
          command: 'No automatic execution',
          action: 'Keep execution locked until each live action path has explicit approval and audit logging.'
        }
      ]
    }
  ];
}

function settingsToolConnectionsView() {
  const groups = getToolConnectionPlan();
  const allTools = groups.flatMap((group) => group.tools);
  const activeCount = allTools.filter((tool) => tool.status.toLowerCase().includes('active')).length;
  const liveCapableCount = allTools.filter((tool) => tool.status.toLowerCase().includes('live-capable')).length;
  const futureCount = allTools.filter((tool) => tool.status.toLowerCase().includes('future')).length;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Tool Connections', title: 'Connect the rest of the business safely', body: 'This is the Hub-native checklist for turning external tools into provider snapshots, executive insight, and approval-first actions without putting credentials in the browser.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: 'Active snapshots', value: String(activeCount), body: 'Provider snapshots currently available to the runtime.' })}
            ${statCard({ iconName: 'settings', label: 'Live-capable tools', value: String(liveCapableCount), body: 'Tools with provider/sync paths already prepared.' })}
            ${statCard({ iconName: 'grid', label: 'Future providers', value: String(futureCount), body: 'Business tools that need a provider build before activation.' })}
            ${statCard({ iconName: 'shield', label: 'Execution policy', value: 'Approval-first', body: 'No emails, posts, calendar changes, or finance actions execute automatically.' })}
          </div>
        </section>

        <section class="panel">
          ${sectionHeader({ eyebrow: 'Credential safety', title: 'Server-side snapshots only', body: 'EP Hub is still a static frontend. Live credentials must stay in Replit secrets or a server-side sync environment, then write sanitized snapshots into the provider layer.' })}
          <div class="grid-3">
            ${insightCard({ eyebrow: 'Do', title: 'Use environment secrets', body: 'Keep API keys, OAuth refresh tokens, and private keys in server-side secrets only.', tone: 'good' })}
            ${insightCard({ eyebrow: 'Do not', title: 'Never ship secrets to assets/', body: 'Anything in assets/ is browser-readable after deployment, so only sanitized snapshot outputs belong there.', tone: 'risk' })}
            ${insightCard({ eyebrow: 'Approval-first', title: 'Actions remain locked', body: 'The Hub can recommend, preview, and queue actions. Execution still needs explicit approval and a future backend action gateway.', tone: 'warn' })}
          </div>
        </section>

        <div class="settings-grid">
          ${groups.map((group) => `
            <section class="panel">
              ${sectionHeader({ eyebrow: 'Connection group', title: group.group, body: 'Each row explains what the tool feeds, what it needs, and the safe activation path.' })}
              <div class="section-stack">
                ${group.tools.map((tool) => registerRow({
                  kicker: `${pill(tool.status, toolConnectionTone(tool.status))}${pill(tool.provider, 'neutral')}`,
                  title: tool.name,
                  body: `${tool.feeds} Needs: ${tool.needs}`,
                  meta: `${tool.command} · ${tool.action}`
                })).join('')}
              </div>
            </section>
          `).join('')}
        </div>
      </div>
    `,
    charts: []
  };
}

function settingsConfigurationView() {
  const config = WORKSPACE_DATA.settings.configuration;
  const memory = WORKSPACE_DATA.settings.memory;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'Demo Mode Configuration', title: 'Runtime mode, provider bindings, and memory behaviour', body: 'The wider app stays in Demo Mode even when Website Analytics, YouTube, Gmail, and Google Calendar are hydrated from locally generated snapshots, while Executive Memory persists separately.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'settings', label: 'Active mode', value: config.activeMode.label, body: config.activeMode.description })}
            ${statCard({ iconName: 'grid', label: 'Default provider', value: config.defaultProviderKey, body: 'MockProvider still anchors the default runtime; AnalyticsProvider, YouTubeProvider, GmailProvider, and CalendarProvider now selectively override their domains.' })}
            ${statCard({ iconName: 'shield', label: 'GA4 state', value: APP_RUNTIME.config.liveData.ga4.status, body: APP_RUNTIME.config.liveData.ga4.notes || APP_RUNTIME.config.liveData.ga4.detail })}
            ${statCard({ iconName: 'sparkles', label: 'YouTube state', value: APP_RUNTIME.config.liveData.youtube.status, body: APP_RUNTIME.config.liveData.youtube.notes || APP_RUNTIME.config.liveData.youtube.detail })}
            ${statCard({ iconName: 'book-open', label: 'Gmail state', value: APP_RUNTIME.config.liveData.gmail.status, body: APP_RUNTIME.config.liveData.gmail.notes || APP_RUNTIME.config.liveData.gmail.detail })}
            ${statCard({ iconName: 'calendar', label: 'Calendar state', value: APP_RUNTIME.config.liveData.calendar.status, body: APP_RUNTIME.config.liveData.calendar.notes || APP_RUNTIME.config.liveData.calendar.detail })}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Available modes', title: 'Current and future runtime states', body: 'Only Demo Mode is active today, but selective GA4, YouTube, Gmail, and Google Calendar overlays can still enrich the executive workspace while Future Live Mode remains reserved.' })}
            <div class="section-stack">
              ${config.availableModes
                .map((mode) =>
                  insightCard({
                    eyebrow: mode.available ? 'Available now' : 'Reserved for later',
                    title: mode.label,
                    body: mode.key === 'demo' ? `${mode.description} ${APP_RUNTIME.config.liveData.ga4.available || APP_RUNTIME.config.liveData.youtube.available || APP_RUNTIME.config.liveData.gmail.available || APP_RUNTIME.config.liveData.calendar.available ? `Current overlays: ${[APP_RUNTIME.config.liveData.ga4.available ? 'GA4 Website Analytics' : null, APP_RUNTIME.config.liveData.youtube.available ? 'YouTube channel data' : null, APP_RUNTIME.config.liveData.gmail.available ? 'Gmail Executive Inbox' : null, APP_RUNTIME.config.liveData.calendar.available ? 'Google Calendar operations' : null].filter(Boolean).join(' + ')}.` : 'No live snapshot is currently active.'}` : mode.description,
                    tone: mode.available ? 'good' : 'warn'
                  })
                )
                .join('')}
            </div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Domain bindings', title: 'Which provider each service domain uses', body: 'MockProvider remains the default baseline, while communications bind to GmailProvider, operations/timeline bind to CalendarProvider, and marketing binds to YouTubeProvider on top of AnalyticsProvider without forcing dashboard rewrites.' })}
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
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Memory retention', title: 'How business memory is kept', body: 'Retention stays configurable through structured local settings rather than a database or external service.' })}
            <div class="section-stack">
              ${registerRow({ kicker: `${pill('Timeline', 'info')}`, title: memory.retention.timelineHistory, body: 'Timeline history retention window for executive chronology.' })}
              ${registerRow({ kicker: `${pill('Decisions', 'good')}`, title: memory.retention.completedDecisions, body: 'Completed decisions remain available for later executive review.' })}
              ${registerRow({ kicker: `${pill('Goals', 'neutral')}`, title: memory.retention.archivedGoals, body: 'Archived goal history remains available as strategic context.' })}
              ${registerRow({ kicker: `${pill('Categories', 'warn')}`, title: memory.categories.join(', '), body: 'Active structured categories inside the memory layer.' })}
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
          ${sectionHeader({ eyebrow: 'Provider Architecture', title: 'Presentation, service, and provider layers', body: 'This abstraction now carries the first live-capable provider path without rewriting the executive dashboards.' })}
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
              ${statCard({ iconName: 'sparkles', label: 'CMO score', value: String(architecture.health.cmo), body: 'CMO workspace remains functional through MarketingService, including the GA4-aware Website Analytics route.' })}
              ${statCard({ iconName: 'check-circle', label: 'Approval groups', value: String(architecture.health.approvals), body: 'ApprovalService still powers grouped approvals.' })}
              ${statCard({ iconName: 'presentation', label: 'Report routes', value: String(architecture.health.reports), body: 'ReportService powers shared reporting outputs.' })}
              ${statCard({ iconName: 'calendar', label: 'Timeline events', value: String(architecture.health.timeline), body: 'TimelineService provides reusable timeline shaping.' })}
              ${statCard({ iconName: 'book-open', label: 'Memory events', value: String(architecture.health.memoryEvents), body: 'Persistent executive timeline coverage now comes from MemoryService.' })}
              ${statCard({ iconName: 'target', label: 'Memory goals', value: String(architecture.health.memoryGoals), body: 'Strategic goals now persist independently of providers.' })}
              ${statCard({ iconName: 'sparkles', label: 'Memory decisions', value: String(architecture.health.memoryDecisions), body: 'Decision memory is now available to reports and intelligence.' })}
            </div>
          </section>
        </div>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Service responsibilities', title: 'Reusable business logic layer', body: 'These services are the new contract between the UI and future integrations.' })}
            <div class="section-stack">${architecture.services.map((service) => insightCard({ eyebrow: 'Service', title: service.title, body: service.body, tone: 'info' })).join('')}</div>
          </section>
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Provider catalogue', title: 'Current and future providers', body: 'MockProvider remains the foundation, while AnalyticsProvider is now the first live-capable provider with safe demo fallback.' })}
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

function settingsAboutView() {
  const release = WORKSPACE_DATA.settings.release;
  return {
    html: `
      <div class="page-grid">
        <section class="panel">
          ${sectionHeader({ eyebrow: 'About', title: release.fullName, body: 'Formal release metadata now comes from one central release configuration so the product, docs, and governance stay aligned.' })}
          ${renderRoutePillbar(SUBNAV.settings)}
          <div class="grid-4">
            ${statCard({ iconName: 'check-circle', label: 'Version', value: release.displayName, body: 'User-facing release label used throughout the product.' })}
            ${statCard({ iconName: 'grid', label: 'Semantic Version', value: release.version, body: 'Canonical semver for package and release management.' })}
            ${statCard({ iconName: 'calendar', label: 'Release Date', value: release.releaseDate, body: `Current release sprint: ${release.currentSprint}.` })}
            ${statCard({ iconName: 'settings', label: 'Build / Environment', value: release.buildNumber, body: release.environmentDetail, meta: release.overlayStatus })}
          </div>
        </section>

        <div class="grid-2">
          <section class="panel">
            ${sectionHeader({ eyebrow: 'Release governance', title: 'Permanent release process', body: 'Each release should now update the formal changelog, roadmap, demo script, and version metadata from a single source.' })}
            <div class="section-stack">
              ${insightCard({ eyebrow: 'Changelog', title: release.docs.changelog, body: 'Formal release history lives at the project root using semantic versioning.', tone: 'good' })}
              ${insightCard({ eyebrow: 'Roadmap', title: release.docs.roadmap, body: 'Active planning is managed separately from shipped release history.', tone: 'info' })}
              ${insightCard({ eyebrow: 'Sprint history', title: release.docs.sprintHistory, body: 'Detailed sprint-by-sprint build notes remain available for deeper auditability.', tone: 'neutral' })}
              ${insightCard({ eyebrow: 'Principles', title: release.docs.principles, body: 'New roadmap items should be screened against the project principles before acceptance.', tone: 'warn' })}
            </div>
          </section>

          <section class="panel">
            ${sectionHeader({ eyebrow: 'Current release scope', title: release.codename, body: 'This release formalises the first usable executive marketing layer on top of the stable platform foundation.' })}
            <div class="section-stack">
              ${registerRow({ kicker: `${pill('v1.0 foundation', 'neutral')}`, title: 'Platform foundation is now codified as a release baseline', body: 'Executive shell, CEO/CFO/CMO workspaces, provider architecture, intelligence engine, executive memory, knowledge graph, GA4 provider, and YouTube provider all roll into the formal platform foundation.', meta: 'See CHANGELOG.md for the formal release summary.' })}
              ${registerRow({ kicker: `${pill('v1.1 current', 'good')}`, title: 'Marketing Intelligence is the active platform release', body: 'Live GA4, live YouTube, Marketing Health Score, cross-channel intelligence, the Marketing Intelligence Report, and marketing milestones now define the current public release.', meta: `Release build ${release.buildNumber}.` })}
              ${registerRow({ kicker: `${pill(release.environment, 'info')}`, title: release.overlayStatus, body: 'The product remains demo-first overall, but selective generated snapshot overlays can enrich the live marketing surfaces without changing the frontend-only deployment model.', meta: 'This status is derived from the release configuration plus current provider availability.' })}
            </div>
          </section>
        </div>
      </div>
    `,
    charts: []
  };
}

const routeRenderers = {
  '/ceo': ceoDashboardView,
  '/executive-action-centre': executiveActionCentreView,
  '/executive-action-centre/queue': executiveQueueView,
  '/executive-action-centre/action-detail': actionDetailView,
  '/executive-action-centre/approval-workflow': approvalWorkflowView,
  '/executive-copilot': executiveCopilotOverviewView,
  '/executive-copilot/ask': executiveCopilotAskView,
  '/executive-copilot/executive-briefing': executiveCopilotBriefingView,
  '/executive-copilot/memory-context': executiveCopilotMemoryContextView,
  '/executive-inbox': executiveInboxView,
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
  '/operations': operationsCalendarView,
  '/hr': () => placeholderModuleView('/hr'),
  '/projects': () => placeholderModuleView('/projects'),
  '/approvals': approvalsView,
  '/reports': reportsOverviewView,
  '/reports/executive-actions': () => actionReportView('executiveActionsReport', 'Executive Actions Report', 'Action backlog and current leadership priorities.'),
  '/reports/outstanding-approvals': () => actionReportView('outstandingApprovals', 'Outstanding Approvals', 'Approval-stage work awaiting executive review.'),
  '/reports/decision-history': () => actionReportView('decisionHistory', 'Decision History', 'Approved, rejected, and completed action outcomes.'),
  '/reports/action-analytics': () => actionReportView('actionAnalytics', 'Action Analytics', 'Backlog and throughput analysis across the operating system.'),
  '/reports/approval-performance': () => actionReportView('approvalPerformance', 'Approval Performance', 'Approval-stage performance and backlog shape.'),
  '/reports/department-workload': () => actionReportView('departmentWorkload', 'Department Workload', 'Department-level action pressure and throughput.'),
  '/reports/weekly-briefings': weeklyBriefingsView,
  '/reports/executive-timeline': executiveTimelineView,
  '/reports/decision-journal': executiveDecisionJournalView,
  '/reports/strategic-goals': strategicGoalsView,
  '/reports/monthly-reports': monthlyReportsView,
  '/reports/quarterly-reviews': quarterlyReviewsView,
  '/reports/board-meeting': boardMeetingView,
  '/reports/cfo-reports': () => reportPlaceholderView('/reports/cfo-reports', 'CFO Reports', WORKSPACE_DATA.reports.cfoReports),
  '/reports/cmo-reports': marketingIntelligenceReportView,
  '/reports/ceo-reports': () => reportPlaceholderView('/reports/ceo-reports', 'CEO Reports', WORKSPACE_DATA.reports.ceoReports),
  '/ai-assistant': executiveCopilotOverviewView,
  '/ai-assistant/ask': executiveCopilotAskView,
  '/ai-assistant/executive-briefing': executiveCopilotBriefingView,
  '/ai-assistant/follow-up-questions': () => aiAssistantPlaceholderView('/ai-assistant/follow-up-questions'),
  '/ai-assistant/suggested-actions': () => aiAssistantPlaceholderView('/ai-assistant/suggested-actions'),
  '/ai-assistant/assumptions': () => aiAssistantPlaceholderView('/ai-assistant/assumptions'),
  '/ai-assistant/missing-information': () => aiAssistantPlaceholderView('/ai-assistant/missing-information'),
  '/ai-assistant/memory-context': executiveCopilotMemoryContextView,
  '/settings': settingsView,
  '/settings/action-centre': settingsActionCentreView,
  '/settings/integrations': settingsIntegrationStatusView,
  '/settings/tool-connections': settingsToolConnectionsView,
  '/settings/configuration': settingsConfigurationView,
  '/settings/provider-architecture': settingsProviderArchitectureView,
  '/settings/about': settingsAboutView
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
    throw new Error('EP Hub failed to initialise required DOM nodes.');
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
