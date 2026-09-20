/**
 * PravahAi Mobile Bottom Sheet Component (bottomSheet.js)
 * Clean, touch-ergonomic bottom sheet for inspecting map nodes on mobile viewports (<768px).
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

    let startY = 0;
    let currentY = 0;

    if (this.sheetEl) {
      this.sheetEl.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });

      this.sheetEl.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0) {
          this.sheetEl.style.transform = `translateY(${diff}px)`;
        }
      }, { passive: true });

      this.sheetEl.addEventListener('touchend', () => {
        const diff = currentY - startY;
        if (diff > 70) {
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
      <div class="sheet-handle" style="width: 38px; height: 4px; border-radius: 2px; background: rgba(255, 255, 255, 0.25); margin: 0 auto 14px; cursor: grab;"></div>
      <div class="sheet-header" style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 14px;">
        <div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #ffffff; line-height: 1.2;">${node.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${node.location}</div>
        </div>
        <span class="status-pill ${pillClass}">
          <span class="status-dot ${isUnsafe ? 'status-dot-unsafe' : isRisk ? 'status-dot-risk' : 'status-dot-safe'}"></span>
          ${node.status.replace('_', ' ')}
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px;">
        <div style="padding: 12px; background: rgba(14, 28, 46, 0.85); border-radius: var(--radius-sm); border: 1px solid rgba(255, 255, 255, 0.06);">
          <div style="font-size: 0.68rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; font-family: var(--font-family-mono);">Water Depth</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: ${isUnsafe ? '#f87171' : isRisk ? '#fbbf24' : '#34d399'}; margin-top: 2px;">
            ${node.water_level}m
          </div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">Danger Line: ${node.critical_threshold}m</div>
        </div>

        <div style="padding: 12px; background: rgba(14, 28, 46, 0.85); border-radius: var(--radius-sm); border: 1px solid rgba(255, 255, 255, 0.06);">
          <div style="font-size: 0.68rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; font-family: var(--font-family-mono);">Rising Speed</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-top: 2px;">
            ${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} <span style="font-size: 0.75rem; font-weight: 500;">cm/h</span>
          </div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">Trend: ${node.rate_of_rise > 4 ? 'RISING FAST' : 'STEADY'}</div>
        </div>

        <div style="padding: 12px; background: rgba(14, 28, 46, 0.85); border-radius: var(--radius-sm); border: 1px solid rgba(255, 255, 255, 0.06);">
          <div style="font-size: 0.68rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; font-family: var(--font-family-mono);">Rain (Last 15 Min)</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-top: 2px;">
            ${node.rainfall_15m} <span style="font-size: 0.75rem; font-weight: 500;">mm</span>
          </div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">Past hour: ${node.rainfall_60m}mm</div>
        </div>

        <div style="padding: 12px; background: rgba(14, 28, 46, 0.85); border-radius: var(--radius-sm); border: 1px solid rgba(255, 255, 255, 0.06);">
          <div style="font-size: 0.68rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; font-family: var(--font-family-mono);">Battery & Station</div>
          <div style="font-size: 1.15rem; font-weight: 800; color: #34d399; margin-top: 4px;">
            ${node.battery_pct}% Battery
          </div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">${node.edge_device.split(' ')[0]}</div>
        </div>
      </div>

      <div style="display: flex; gap: 8px;">
        <a href="#node-detail?id=${node.id}" class="btn btn-primary" style="flex: 1; text-align: center;">
          View Station Details →
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
