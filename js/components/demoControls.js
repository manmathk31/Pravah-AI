/**
 * PravahAi Demo Controls Component (demoControls.js)
 * Prominent, high-contrast floating trigger panel with vivid glowing badge
 */

import { sim } from '../sim.js';

export class DemoControlsComponent {
  constructor() {
    this.fabEl = null;
    this.modalEl = null;
    this.isOpen = false;
    this.render();
    this.initListeners();
  }

  render() {
    const container = document.createElement('div');
    container.id = 'demo-controls-root';
    container.innerHTML = `
      <!-- High-Visibility Glowing Floating Action Button (Mobile-Optimized) -->
      <button id="demo-fab" class="demo-fab" aria-label="Open Demo Scenarios" title="Live Simulation Controls">
        <span class="fab-halo-ring"></span>
        <span class="fab-pulse-dot"></span>
        <span class="fab-icon-bolt">⚡</span>
        <span class="fab-label"><span class="fab-short">Demo</span><span class="fab-full"> Scenarios</span></span>
      </button>

      <!-- Glass Modal Popover -->
      <div id="demo-modal-overlay" class="demo-modal-overlay"></div>
      <div id="demo-modal" class="demo-modal glass-panel-elevated">
        <div class="demo-modal-header">
          <div>
            <div style="font-size: 0.7rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.06em;">
              Interactive Simulation
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-top: 2px;">Test Flood Scenarios</h3>
          </div>
          <button id="demo-modal-close" class="btn btn-glass btn-sm" style="width: 32px; height: 32px; padding: 0; font-size: 1rem;">✕</button>
        </div>

        <div class="demo-modal-body">
          <!-- Primary Scenario -->
          <div style="padding: 16px; background: rgba(14, 28, 46, 0.85); border: 1px solid rgba(239, 68, 68, 0.45); border-radius: var(--radius-sm); margin-bottom: 14px; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 0.86rem; color: #f87171; display: flex; align-items: center; gap: 6px;">
                <span class="status-dot status-dot-unsafe"></span>
                Flash Flood Test
              </span>
              <span class="status-pill status-pill-unsafe" style="font-size: 0.65rem; padding: 2px 8px;">TRY IT LIVE</span>
            </div>
            <p style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
              Simulate sudden heavy rain over <strong>Station 03 (Lowland Causeway)</strong>. Watch water rise quickly, trigger warnings, and automatically guide drivers to safe higher roads.
            </p>
            <div style="display: flex; gap: 8px;">
              <button id="btn-trigger-flood" class="btn btn-danger btn-sm" style="flex: 1.2; font-weight: 800; padding: 8px 12px; font-size: 0.78rem;">
                ⚡ Start Flash Flood
              </button>
              <button id="btn-reset-scenario" class="btn btn-glass btn-sm" style="flex: 1; padding: 8px 10px; font-size: 0.78rem;">
                Reset to Normal
              </button>
            </div>
          </div>

          <!-- Secondary Quick Toggles -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 6px;">
            <button id="btn-speed-toggle" class="btn btn-glass btn-sm" style="padding: 8px 12px; font-size: 0.76rem;">
              Speed: <strong id="speed-label" style="margin-left: 4px; color: var(--accent-cyan); font-weight: 800;">1x</strong>
            </button>
            <button id="btn-lora-toggle" class="btn btn-glass btn-sm" style="padding: 8px 12px; font-size: 0.76rem;">
              Mode: <strong id="lora-mode-label" style="margin-left: 4px; color: var(--status-safe); font-weight: 800;">Online</strong>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    this.fabEl = document.getElementById('demo-fab');
    this.modalEl = document.getElementById('demo-modal');
    this.overlayEl = document.getElementById('demo-modal-overlay');
    this.closeBtn = document.getElementById('demo-modal-close');
    this.triggerFloodBtn = document.getElementById('btn-trigger-flood');
    this.resetBtn = document.getElementById('btn-reset-scenario');
    this.speedBtn = document.getElementById('btn-speed-toggle');
    this.loraBtn = document.getElementById('btn-lora-toggle');
    this.speedLabel = document.getElementById('speed-label');
    this.loraLabel = document.getElementById('lora-mode-label');

    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .demo-fab {
        position: fixed !important;
        bottom: calc(64px + env(safe-area-inset-bottom)) !important;
        right: 12px !important;
        z-index: 350 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 5px !important;
        height: 32px !important;
        min-height: 32px !important;
        padding: 0 11px !important;
        border-radius: 16px !important;
        background: linear-gradient(135deg, #0284c7 0%, #0d9488 50%, #2563eb 100%) !important;
        color: #ffffff !important;
        border: 1px solid rgba(56, 189, 248, 0.7) !important;
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.5) !important;
        cursor: pointer !important;
        font-family: inherit !important;
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.02em !important;
        transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        backdrop-filter: blur(12px) !important;
      }
      .fab-full {
        display: none !important;
      }
      .fab-short {
        display: inline !important;
      }
      @media (min-width: 768px) {
        .demo-fab {
          bottom: 24px !important;
          right: 24px !important;
          height: 42px !important;
          min-height: 42px !important;
          padding: 0 18px !important;
          font-size: 0.82rem !important;
          gap: 8px !important;
          border-radius: 21px !important;
          box-shadow: 0 6px 24px rgba(2, 132, 199, 0.65), 0 0 20px rgba(16, 185, 129, 0.3) !important;
        }
        .fab-full {
          display: inline !important;
        }
      }
      .demo-fab:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 8px 30px rgba(2, 132, 199, 0.8), 0 0 30px rgba(56, 189, 248, 0.6);
        border-color: #7dd3fc;
      }
      .demo-fab:active {
        transform: translateY(0) scale(0.97);
      }
      .fab-halo-ring {
        display: none;
      }
      @media (min-width: 1024px) {
        .fab-halo-ring {
          display: block;
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: var(--radius-full);
          border: 1.5px solid rgba(56, 189, 248, 0.45);
          animation: fabHaloPulse 2.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          pointer-events: none;
        }
      }
      @keyframes fabHaloPulse {
        0% {
          transform: scale(0.95);
          opacity: 0.8;
        }
        70% {
          transform: scale(1.15);
          opacity: 0;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }
      .fab-pulse-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #34d399;
        box-shadow: 0 0 8px #34d399;
        animation: beaconPulse 1.6s infinite;
      }
      .fab-icon-bolt {
        font-size: 0.85rem;
        line-height: 1;
        filter: drop-shadow(0 0 4px #38bdf8);
      }
      .fab-label {
        font-weight: 800;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      }
      .demo-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(8px);
        z-index: 500;
        opacity: 0;
        visibility: hidden;
        transition: opacity var(--transition-fast), visibility var(--transition-fast);
      }
      .demo-modal-overlay.open {
        opacity: 1;
        visibility: visible;
      }
      .demo-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -46%) scale(0.96);
        max-width: 440px;
        width: calc(100vw - 32px);
        z-index: 501;
        padding: 22px;
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
        background: rgba(20, 27, 38, 0.97);
        border: 1px solid rgba(56, 189, 248, 0.35);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(2, 132, 199, 0.25);
        border-radius: var(--radius-lg);
      }
      .demo-modal.open {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        visibility: visible;
      }
      .demo-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 14px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(56, 189, 248, 0.15);
      }
    `;
    document.head.appendChild(style);
  }

  initListeners() {
    this.fabEl?.addEventListener('click', () => this.toggleModal());
    this.closeBtn?.addEventListener('click', () => this.closeModal());
    this.overlayEl?.addEventListener('click', () => this.closeModal());

    this.triggerFloodBtn.addEventListener('click', () => {
      sim.triggerFloodScenario();
      this.triggerFloodBtn.textContent = 'Scenario Active!';
      setTimeout(() => {
        this.triggerFloodBtn.textContent = 'Trigger Inundation';
      }, 2500);
    });

    this.resetBtn.addEventListener('click', () => {
      sim.resetScenario();
      this.resetBtn.textContent = 'Baseline Restored';
      setTimeout(() => {
        this.resetBtn.textContent = 'Reset Baseline';
      }, 2000);
    });

    this.speedBtn.addEventListener('click', () => {
      const nextSpeed = sim.simulationSpeed === 1 ? 5 : 1;
      sim.setSpeed(nextSpeed);
      if (this.speedLabel) {
        this.speedLabel.textContent = nextSpeed === 5 ? '5x' : '1x';
      }
    });

    this.loraBtn.addEventListener('click', () => {
      const nextMode = sim.isLoRaMode ? 'online' : 'lora';
      sim.setConnectivityMode(nextMode);
      if (this.loraLabel) {
        this.loraLabel.textContent = nextMode === 'lora' ? 'LoRa Mesh' : 'Cloud Sync';
      }
    });

    sim.on('connectivityChanged', ({ isLoRaMode }) => {
      if (this.loraLabel) {
        this.loraLabel.textContent = isLoRaMode ? 'LoRa Mesh' : 'Cloud Sync';
      }
    });
  }

  toggleModal() {
    if (this.isOpen) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }

  openModal() {
    this.modalEl.classList.add('open');
    this.overlayEl.classList.add('open');
    this.isOpen = true;
  }

  closeModal() {
    this.modalEl.classList.remove('open');
    this.overlayEl.classList.remove('open');
    this.isOpen = false;
  }
}
