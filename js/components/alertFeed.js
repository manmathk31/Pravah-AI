/**
 * PravahAi Alert Feed Component (alertFeed.js)
 * Live-updating alert cards with severity color-coding, action tags, and empty states.
 */

export class AlertFeedComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.alerts = [];
    this.activeFilter = 'ALL';
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="glass-panel alerts-section" style="padding: var(--space-6);">
        <div class="chart-header">
          <div>
            <h3 style="font-size: var(--text-lg); font-weight: 800; color: var(--text-main);">
              Active Early Warnings & Alerts
            </h3>
            <p style="font-size: var(--text-xs); color: var(--text-muted);">
              Hyperlocal edge-inferred alerts prioritized by time-to-inundation
            </p>
          </div>
          <div class="live-beacon">
            <span class="live-beacon-dot"></span>
            LIVE FEED
          </div>
        </div>

        <div id="alerts-items-mount" class="alerts-list">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;

    this.mountEl = this.container.querySelector('#alerts-items-mount');
  }

  update(alerts) {
    this.alerts = alerts || [];
    if (!this.mountEl) return;

    if (this.alerts.length === 0) {
      this.mountEl.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: var(--text-muted);">
          <svg style="width: 40px; height: 40px; margin-bottom: 8px; stroke: var(--status-safe); fill: none;" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div style="font-weight: 700; font-size: var(--text-sm); color: var(--text-main);">All Sectors Clear</div>
          <div style="font-size: var(--text-xs); margin-top: 4px;">No active flood warnings or road accessibility hazards at this time.</div>
        </div>
      `;
      return;
    }

    this.mountEl.innerHTML = this.alerts.map((alert, idx) => {
      const isCritical = alert.severity === 'CRITICAL';
      const isWarning = alert.severity === 'WARNING';
      const severityClass = isCritical ? 'alert-critical' : isWarning ? 'alert-warning' : 'alert-info';
      const pillClass = isCritical ? 'status-pill-unsafe' : isWarning ? 'status-pill-risk' : 'status-pill-safe';

      return `
        <div class="glass-panel-subtle alert-item-card ${severityClass} ${idx === 0 ? 'new-alert-pulse' : ''}">
          <div class="alert-item-top">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="status-pill ${pillClass}">
                <span class="status-dot ${isCritical ? 'status-dot-unsafe' : isWarning ? 'status-dot-risk' : 'status-dot-safe'}"></span>
                ${alert.severity}
              </span>
              <span class="alert-title-text">${alert.title}</span>
            </div>
            <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-family-mono);">
              ${alert.timestamp}
            </span>
          </div>

          <p class="alert-body-text">${alert.description}</p>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
            <span class="alert-action-pill">
              <svg style="width: 14px; height: 14px; fill: none; stroke: currentColor;" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              ${alert.action}
            </span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">
              Fusion Confidence: <strong>${alert.confidence}%</strong>
            </span>
          </div>
        </div>
      `;
    }).join('');
  }
}
