/**
 * PravahAi Screen: Incident & Action Timeline View (incidents.js)
 * Clean, single-column chronological log of sensing, AI inference, and decentralized action
 */

import { sim } from '../sim.js';

let activeFilter = 'ALL';
let unsubscribeScenario = null;

export function renderIncidents(container) {
  container.innerHTML = `
    <div class="timeline-page-container">
      <div class="section-header">
        <div>
          <h1 class="section-title">Warning & Safety Action Log</h1>
          <p class="section-subtitle">
            Complete chronological record of all flood warnings, AI forecasts, and emergency safety actions
          </p>
        </div>
        <span class="status-pill status-pill-safe">Verified Safety Log</span>
      </div>

      <div class="timeline-filter-bar">
        <button class="filter-chip active" data-filter="ALL">All Events (${sim.incidents.length})</button>
        <button class="filter-chip" data-filter="CRITICAL">Severe Warnings</button>
        <button class="filter-chip" data-filter="ACT">Safety Actions</button>
        <button class="filter-chip" data-filter="PREDICT">AI Forecasts</button>
        <button class="filter-chip" data-filter="SENSE">Sensor Readings</button>
      </div>

      <div id="timeline-track-mount" class="timeline-track">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  const mountEl = container.querySelector('#timeline-track-mount');
  renderTimelineItems(mountEl);

  container.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter');
      renderTimelineItems(mountEl);
    });
  });

  if (unsubscribeScenario) unsubscribeScenario();
  unsubscribeScenario = sim.on('floodScenarioTriggered', () => {
    renderTimelineItems(mountEl);
  });
}

function renderTimelineItems(mountEl) {
  if (!mountEl) return;

  const filtered = sim.incidents.filter(inc => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return inc.severity === 'CRITICAL';
    if (activeFilter === 'ACT') return inc.stage === 'ACT';
    if (activeFilter === 'PREDICT') return inc.stage === 'PREDICT';
    if (activeFilter === 'SENSE') return inc.stage === 'SENSE';
    return true;
  });

  if (filtered.length === 0) {
    mountEl.innerHTML = `
      <div class="glass-panel" style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        No incident events match the selected filter.
      </div>
    `;
    return;
  }

  mountEl.innerHTML = filtered.map(item => {
    const isCritical = item.severity === 'CRITICAL';
    const isWarning = item.severity === 'WARNING';
    const pillClass = isCritical ? 'status-pill-unsafe' : isWarning ? 'status-pill-risk' : 'status-pill-safe';

    const stageNum = item.stage === 'SENSE' ? '1' :
                     item.stage === 'FUSE' ? '2' :
                     item.stage === 'PREDICT' ? '3' :
                     item.stage === 'ASSESS' ? '4' : '5';

    const metricsHtml = item.metrics ? Object.entries(item.metrics).map(([k, v]) => `
      <span class="timeline-metric-pill">
        ${k.replace(/_/g, ' ')}: <strong>${v}</strong>
      </span>
    `).join('') : '';

    return `
      <div class="timeline-item stage-${item.stage}">
        <div class="timeline-node-pin">${stageNum}</div>

        <div class="glass-panel timeline-card">
          <div class="timeline-card-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="timeline-stage-tag">STAGE ${stageNum}: ${item.stage}</span>
              <span class="status-pill ${pillClass}">
                <span class="status-dot ${isCritical ? 'status-dot-unsafe' : isWarning ? 'status-dot-risk' : 'status-dot-safe'}"></span>
                ${item.badge}
              </span>
            </div>
            <span class="timeline-time">${item.timestamp}</span>
          </div>

          <h3 class="timeline-title">${item.title}</h3>
          <p class="timeline-summary">${item.summary}</p>

          ${metricsHtml ? `<div class="timeline-metrics-strip">${metricsHtml}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}
