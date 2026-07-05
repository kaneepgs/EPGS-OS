const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/>',
  'trending-up': '<path d="M4 16l5-5 4 4 7-8"/><path d="M14 7h6v6"/>',
  coins: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  building: '<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-5h6v5"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 13h.01M12 13h.01M16 13h.01"/>',
  wallet: '<path d="M4 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4z"/><path d="M4 7V5a2 2 0 0 1 2-2h11"/><path d="M18 13h.01"/>',
  shield: '<path d="M12 3 5 6v6c0 5 3 8 7 9 4-1 7-4 7-9V6l-7-3Z"/>',
  sparkles: '<path d="m12 3 1.7 4.8L18 9.5l-4.3 1.7L12 16l-1.7-4.8L6 9.5l4.3-1.7Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/>',
  grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  'book-open': '<path d="M2 6.5C2 5.1 3.1 4 4.5 4H10v16H4.5A2.5 2.5 0 0 1 2 17.5z"/><path d="M22 6.5C22 5.1 20.9 4 19.5 4H14v16h5.5a2.5 2.5 0 0 0 2.5-2.5z"/>',
  presentation: '<path d="M4 4h16v10H4z"/><path d="M12 14v7"/><path d="M9 21h6"/>',
  settings: '<path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/><circle cx="12" cy="12" r="4"/>',
  pulse: '<path d="M2 12h4l2-5 4 10 2-5h8"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  'alert-triangle': '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  calendar: '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
  star: '<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  command: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m13 5 7 7-7 7"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  mail: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
  reply: '<path d="m9 17-5-5 5-5"/><path d="M4 12h9a7 7 0 0 1 7 7"/>'
};

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function icon(name, label = '') {
  const paths = ICONS[name] || ICONS.grid;
  const aria = label ? ` role="img" aria-label="${escapeHtml(label)}"` : ' aria-hidden="true"';
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"${aria}>${paths}</svg>`;
}

export function pill(text, tone = 'neutral') {
  return `<span class="pill ${tone}">${escapeHtml(text)}</span>`;
}

export function navLink({ id, label, iconName, active = false, favourite = false }) {
  return `
    <a href="#${id}" class="nav-link ${active ? 'active' : ''}" data-page="${id}">
      <span class="nav-link-main">${icon(iconName)}<span>${escapeHtml(label)}</span></span>
      <span class="nav-link-side">${favourite ? icon('star') : ''}</span>
    </a>
  `;
}

export function breadcrumb(parts) {
  return parts.map((part, index) => `${index ? '<span class="crumb-sep">/</span>' : ''}<span>${escapeHtml(part)}</span>`).join('');
}

export function sectionHeader({ eyebrow, title, body = '', actions = '' }) {
  return `
    <div class="panel-heading">
      <div>
        <div class="eyebrow">${escapeHtml(eyebrow)}</div>
        <h3>${escapeHtml(title)}</h3>
        ${body ? `<p>${escapeHtml(body)}</p>` : ''}
      </div>
      ${actions ? `<div class="panel-actions">${actions}</div>` : ''}
    </div>
  `;
}

export function statCard({ iconName = 'grid', label, value, body, meta = '' }) {
  return `
    <article class="stat-card">
      <div class="card-kicker">${icon(iconName)}<span class="label">${escapeHtml(label)}</span></div>
      <strong>${escapeHtml(value)}</strong>
      <p>${escapeHtml(body)}</p>
      ${meta ? `<div class="meta">${escapeHtml(meta)}</div>` : ''}
    </article>
  `;
}

export function metricCard({ key, label, value, trend, iconName = 'grid', active = false }) {
  return `
    <button class="metric-button ${active ? 'active' : ''}" type="button" data-metric="${escapeHtml(key)}" aria-pressed="${String(active)}">
      <div class="card-kicker">${icon(iconName)}<span class="label">${escapeHtml(label)}</span></div>
      <strong>${escapeHtml(value)}</strong>
      <p>${escapeHtml(trend)}</p>
    </button>
  `;
}

export function insightCard({ eyebrow, title, body, tone = 'neutral', footer = '' }) {
  return `
    <article class="insight-card ${tone}">
      <div class="label">${escapeHtml(eyebrow)}</div>
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(body)}</p>
      ${footer ? `<div class="meta">${escapeHtml(footer)}</div>` : ''}
    </article>
  `;
}

export function priorityCard({ index, title, body, tone }) {
  return `
    <article class="priority-card">
      <div class="priority-index">${index}</div>
      <div>
        <h4>${escapeHtml(title)}</h4>
        <p>${escapeHtml(body)}</p>
      </div>
      ${pill(tone === 'good' ? 'Positive' : tone === 'warn' ? 'Watch item' : 'Risk', tone)}
    </article>
  `;
}

export function chartCard({ title, eyebrow, canvasId, meta = '', actions = '' }) {
  return `
    <section class="chart-card">
      <div class="panel-heading compact">
        <div>
          <div class="eyebrow">${escapeHtml(eyebrow)}</div>
          <h4>${escapeHtml(title)}</h4>
        </div>
        ${actions ? `<div class="panel-actions">${actions}</div>` : ''}
      </div>
      <div class="chart-wrap"><canvas id="${escapeHtml(canvasId)}" aria-label="${escapeHtml(title)} chart" role="img"></canvas></div>
      ${meta ? `<div class="meta">${escapeHtml(meta)}</div>` : ''}
    </section>
  `;
}

export function executiveQuestionCard({ question, title, body }) {
  return `
    <article class="question-card">
      <div class="label">${escapeHtml(question)}</div>
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(body)}</p>
    </article>
  `;
}

export function commentaryCard({ title, data }) {
  return `
    <section class="panel commentary-panel">
      ${sectionHeader({ eyebrow: 'AI Executive Commentary', title, body: 'Every insight is framed for decision-making rather than passive reporting.' })}
      <div class="commentary-grid">
        <article class="commentary-card emphasis"><div class="label">Executive Summary</div><h4>${escapeHtml(data.summary)}</h4></article>
        <article class="commentary-card"><div class="label">Supporting Evidence</div><p>${escapeHtml(data.evidence)}</p></article>
        <article class="commentary-card"><div class="label">Confidence Rating</div><h4>${escapeHtml(data.confidence)}</h4></article>
        <article class="commentary-card"><div class="label">Financial Impact</div><p>${escapeHtml(data.impact)}</p></article>
        <article class="commentary-card"><div class="label">Risks</div><p>${escapeHtml(data.risks)}</p></article>
        <article class="commentary-card"><div class="label">Alternative Options</div><p>${escapeHtml(data.alternatives)}</p></article>
        <article class="commentary-card"><div class="label">Recommended Action</div><p>${escapeHtml(data.action)}</p></article>
        <article class="commentary-card"><div class="label">Missing Information</div><p>${escapeHtml(data.missing)}</p></article>
      </div>
      <div class="follow-up-shell" aria-label="Ask follow-up placeholder">
        <div class="label">Suggested Follow-up Questions</div>
        <div class="follow-up-list">
          ${data.followUp.map((question) => `<button type="button" class="follow-up-chip" data-follow-up="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join('')}
        </div>
        <div class="follow-up-input">
          <input type="text" placeholder="Ask follow-up (placeholder only)" aria-label="Ask follow-up placeholder" />
          <button type="button" class="inline-button" aria-label="Send follow-up placeholder">Ask Follow-up</button>
        </div>
      </div>
    </section>
  `;
}

export function approvalCard({ title, why, impact, risk, confidence }) {
  return `
    <article class="approval-card">
      <h4>${escapeHtml(title)}</h4>
      <p><strong>Why:</strong> ${escapeHtml(why)}</p>
      <p><strong>Impact:</strong> ${escapeHtml(impact)}</p>
      <div class="approval-meta">
        ${pill(`Risk: ${risk}`, String(risk).includes('Low') ? 'good' : 'warn')}
        ${pill(`Confidence: ${confidence}`, 'info')}
      </div>
    </article>
  `;
}

export function registerRow({ kicker = '', title, body, meta = '', extra = '' }) {
  return `
    <article class="register-row">
      ${kicker ? `<div class="register-meta">${kicker}</div>` : ''}
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(body)}</p>
      ${meta ? `<div class="meta">${meta}</div>` : ''}
      ${extra}
    </article>
  `;
}

export function supplierCard(supplier) {
  return `
    <article class="supplier-card">
      <div class="register-meta">${pill(`${supplier.risk} risk`, supplier.risk === 'Low' ? 'good' : 'warn')}${pill(supplier.category, 'info')}</div>
      <h4>${escapeHtml(supplier.name)}</h4>
      <div class="mini-kpi-grid">
        <div><span class="label">This month</span><strong>${escapeHtml(supplier.spendMonth)}</strong></div>
        <div><span class="label">YTD</span><strong>${escapeHtml(supplier.spendYtd)}</strong></div>
        <div><span class="label">Last year</span><strong>${escapeHtml(supplier.spendLastYear)}</strong></div>
        <div><span class="label">YoY</span><strong>${escapeHtml(supplier.yoy)}</strong></div>
      </div>
      <div class="mini-kpi-grid secondary">
        <div><span class="label">Average invoice</span><strong>${escapeHtml(supplier.avgInvoice)}</strong></div>
        <div><span class="label">Invoices</span><strong>${escapeHtml(supplier.invoices)}</strong></div>
        <div><span class="label">Last payment</span><strong>${escapeHtml(supplier.lastPayment)}</strong></div>
      </div>
      <p><strong>Opportunity:</strong> ${escapeHtml(supplier.opportunity)}</p>
      <button type="button" class="text-link supplier-link" data-supplier="${escapeHtml(supplier.id)}">${icon('arrowRight')} Open drill-down placeholder</button>
    </article>
  `;
}

export function searchRow({ id = 'page-search', value = '', placeholder = 'Search…', label = 'Search' }) {
  return `
    <div class="search-shell">
      ${icon('search')}
      <input id="${escapeHtml(id)}" type="text" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(label)}" />
    </div>
  `;
}

export function integrationTile(label) {
  return `
    <article class="integration-tile">
      <div class="label">Future connection</div>
      <h4>${escapeHtml(label)}</h4>
      <p>This will become a connected intelligence source or configuration surface in a later sprint.</p>
    </article>
  `;
}

export function loadingSkeleton() {
  return `
    <section class="page-grid loading-state" aria-hidden="true">
      <div class="skeleton hero"></div>
      <div class="skeleton-grid four">
        <div class="skeleton card"></div>
        <div class="skeleton card"></div>
        <div class="skeleton card"></div>
        <div class="skeleton card"></div>
      </div>
      <div class="skeleton-grid two">
        <div class="skeleton block"></div>
        <div class="skeleton block"></div>
      </div>
    </section>
  `;
}
