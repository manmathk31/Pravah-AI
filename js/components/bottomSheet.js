/**
 * PravahAi Mobile Bottom Sheet Component (bottomSheet.js)
 * Slides up from bottom on mobile viewports (<768px) when a map pin is tapped.
 */

export class BottomSheetComponent {
  constructor() {
    this.sheetEl = document.getElementById('mobile-bottom-sheet');
    this.overlayEl = document.getElementById('bottom-sheet-overlay');
    this.isOpen = false;
    this.initListeners();
  }

  initListeners() {
    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }

    // Touch gesture drag-to-dismiss
    let startY = 0;
    let currentY = 0;

    if (this.sheetEl) {
      const handle = this.sheetEl.querySelector('.sheet-handle') || this.sheetEl;

      handle.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });

      handle.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0) {
          this.sheetEl.style.transform = `translateY(${diff}px)`;
        }
      }, { passive: true });

      handle.addEventListener('touchend', () => {
        const diff = currentY - startY;
        if (diff > 80) {
          this.close();
        }
        this.sheetEl.style.transform = '';
        startY = 0;
        currentY = 0;
      });
    }
  }

  open(node) {
    if (!this.sheetEl) return;

    const isUnsafe = node.status === 'UNSAFE';
    const isRisk = node.status === 'AT_RISK';
    const pillClass = isUnsafe ? 'status-pill-unsafe' : isRisk ? 'status-pill-risk' : 'status-pill-safe';

    this.sheetEl.innerHTML = `
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <div>
          <div class="sheet-title">${node.name}</div>
          <div class="sheet-subtitle">${node.location}</div>
        </div>
        <span class="status-pill ${pillClass}">
          <span class="status-dot ${isUnsafe ? 'status-dot-unsafe' : isRisk ? 'status-dot-risk' : 'status-dot-safe'}"></span>
          ${node.status.replace('_', ' ')}
        </span>
      </div>

      <div class="sheet-meters-grid">
        <div class="sheet-meter-box">
          <div class="sheet-meter-label">Water Level</div>
          <div class="sheet-meter-val" style="color: ${isUnsafe ? 'var(--status-unsafe)' : isRisk ? 'var(--status-risk)' : 'var(--accent-deep)'};">
            ${node.water_level}m
          </div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">Threshold: ${node.critical_threshold}m</div>
        </div>

        <div class="sheet-meter-box">
          <div class="sheet-meter-label">Rate of Rise</div>
          <div class="sheet-meter-val">
            ${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} <span style="font-size: 0.75rem; font-weight: 500;">cm/h</span>
          </div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">Trend: ${node.rate_of_rise > 4 ? 'SURGING' : 'STABLE'}</div>
        </div>

        <div class="sheet-meter-box">
          <div class="sheet-meter-label">Rainfall (15m)</div>
          <div class="sheet-meter-val">${node.rainfall_15m} <span style="font-size: 0.75rem; font-weight: 500;">mm</span></div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">60m: ${node.rainfall_60m}mm</div>
        </div>

        <div class="sheet-meter-box">
          <div class="sheet-meter-label">Edge Health</div>
          <div class="sheet-meter-val" style="font-size: 1rem; margin-top: 4px; color: var(--status-safe);">
            ${node.battery_pct}% BAT
          </div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">${node.edge_device.split(' ')[0]}</div>
        </div>
      </div>

      <div style="display: flex; gap: 8px;">
        <a href="#node-detail?id=${node.id}" class="btn btn-primary" style="flex: 1; text-align: center;">
          Full Sensor Analytics
        </a>
        <button id="close-sheet-btn" class="btn btn-glass" style="width: 44px; padding: 0;">
          ✕
        </button>
      </div>
    `;

    this.sheetEl.querySelector('#close-sheet-btn')?.addEventListener('click', () => this.close());

    this.sheetEl.classList.add('open');
    this.overlayEl?.classList.add('open');
    this.isOpen = true;
  }

  close() {
    this.sheetEl?.classList.remove('open');
    this.overlayEl?.classList.remove('open');
    this.isOpen = false;
  }
}
