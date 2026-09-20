/**
 * PravahAi Alert Feed Component (alertFeed.js)
 * Clean, uncluttered live alerts with dark cyber-civic aesthetic
 */

export class AlertFeedComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.alerts = [];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="glass-panel" style="padding: 24px;">
        <div class="section-header" style="margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">
              Active Flood Warnings & Alerts
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-muted);">
              Live road danger warnings sorted by flood urgency
            </p>
          </div>
          <div class="live-beacon">
            <span class="live-beacon-dot"></span>
            LIVE ALERTS
          </div>
        </div>

        <div id="alerts-items-mount" style="display: flex; flex-direction: column; gap: 12px;">
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
        <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
          <div style="font-weight: 700; font-size: 0.95rem; color: #34d399;">All Roads Are Clear & Safe</div>
          <div style="font-size: 0.78rem; margin-top: 4px;">No flooded streets or road closures detected right now.</div>
        </div>
      `;
      return;
    }

    this.mountEl.innerHTML = this.alerts.map(alert => {
      const isCritical = alert.severity === 'CRITICAL';
      const isWarning = alert.severity === 'WARNING';
      const pillClass = isCritical ? 'status-pill-unsafe' : isWarning ? 'status-pill-risk' : 'status-pill-safe';
      const severityClass = isCritical ? 'critical' : isWarning ? 'warning' : 'info';

      return `
        <div class="alert-feed-card ${severityClass}">
          <div class="alert-card-header">
            <div class="alert-card-title-group">
              <span class="status-pill ${pillClass}">
                <span class="status-dot ${isCritical ? 'status-dot-unsafe' : isWarning ? 'status-dot-risk' : 'status-dot-safe'}"></span>
                ${alert.severity}
              </span>
              <h4 class="alert-card-title">${alert.title}</h4>
            </div>
            <span class="alert-card-time">${alert.timestamp}</span>
          </div>

          <p class="alert-card-desc">${alert.description}</p>

          <div class="alert-card-footer">
            <div class="alert-action-pill">
              <span>⚡ Action:</span>
              <span>${alert.action}</span>
            </div>
            <div class="alert-confidence-wrap">
              <div class="alert-confidence-bar">
                <div class="alert-confidence-fill" style="width: ${alert.confidence}%;"></div>
              </div>
              <span>${alert.confidence}% Confidence</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}
