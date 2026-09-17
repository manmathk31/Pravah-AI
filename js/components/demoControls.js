/**
 * PravahAi Demo Controls Component (demoControls.js)
 * Floating Action Button & Modal for judges to trigger scenarios on mobile or desktop on cue.
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
    // Inject floating button & modal into body
    const container = document.createElement('div');
    container.id = 'demo-controls-root';
    container.innerHTML = `
      <!-- Floating Action Button (Always reachable on mobile & desktop) -->
      <button id="demo-fab" class="demo-fab" aria-label="Open Hackathon Demo Controls" title="Hackathon Demo Controls">
        <span class="fab-icon">⚡</span>
        <span class="fab-text">Demo Tools</span>
      </button>

      <!-- Glass Modal Popover -->
      <div id="demo-modal-overlay" class="demo-modal-overlay"></div>
      <div id="demo-modal" class="demo-modal glass-panel-elevated">
        <div class="demo-modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.2rem;">⚡</span>
            <div>
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--text-main);">Live Demo Trigger Panel</h3>
              <p style="font-size: var(--text-xs); color: var(--text-muted);">Fast-forward hydrological events for hackathon judging</p>
            </div>
          </div>
          <button id="demo-modal-close" class="btn btn-glass btn-sm" style="width: 36px; height: 36px; padding: 0;">✕</button>
        </div>

        <div class="demo-modal-body">
          <div class="demo-action-box">
            <div style="font-weight: 700; font-size: var(--text-sm); margin-bottom: 4px; color: var(--status-unsafe);">
              🚨 Primary Hackathon Beat: Flash Inundation
            </div>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 10px;">
              Simulates extreme cloudburst over Node 03 (Lowland Causeway). Water surges past critical barrier, pushes urgent alert, triggers CV detection, and shifts recommended navigation route to Ridge Bypass.
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button id="btn-trigger-flood" class="btn btn-danger" style="flex: 1;">
                🌊 Trigger Flood Scenario
              </button>
              <button id="btn-reset-scenario" class="btn btn-glass" style="flex: 1;">
                🔄 Reset Baseline
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">
            <button id="btn-speed-toggle" class="btn btn-glass" style="font-size: var(--text-xs);">
              ⚡ Speed: <strong id="speed-label" style="margin-left: 4px;">1x (Normal)</strong>
            </button>
            <button id="btn-lora-toggle" class="btn btn-glass" style="font-size: var(--text-xs);">
              📡 Mode: <strong id="lora-mode-label" style="margin-left: 4px;">Cloud Online</strong>
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
        position: fixed;
        bottom: calc(76px + env(safe-area-inset-bottom));
        right: 16px;
        z-index: var(--z-floating);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        min-height: 44px;
        border-radius: var(--radius-full);
        background: linear-gradient(135deg, var(--accent-deep) 0%, var(--accent-primary) 100%);
        color: #ffffff;
        border: 2px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 8px 24px rgba(10, 110, 168, 0.4);
        cursor: pointer;
        font-family: inherit;
        font-size: var(--text-xs);
        font-weight: 800;
        letter-spacing: 0.02em;
        transition: all var(--transition-fast);
      }
      @media (min-width: 1024px) {
        .demo-fab {
          bottom: 24px;
          right: 24px;
          padding: 12px 22px;
          font-size: var(--text-sm);
        }
      }
      .demo-fab:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 12px 30px rgba(10, 110, 168, 0.55);
      }
      .demo-fab:active {
        transform: translateY(0) scale(0.97);
      }
      .demo-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(14, 34, 51, 0.5);
        backdrop-filter: blur(6px);
        z-index: var(--z-modal);
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
        bottom: calc(84px + env(safe-area-inset-bottom));
        right: 16px;
        max-width: 380px;
        width: calc(100vw - 32px);
        z-index: calc(var(--z-modal) + 1);
        padding: 20px;
        border-radius: var(--radius-lg);
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
      }
      @media (min-width: 1024px) {
        .demo-modal {
          bottom: 80px;
          right: 24px;
        }
      }
      .demo-modal.open {
        transform: translateY(0) scale(1);
        opacity: 1;
        visibility: visible;
      }
      .demo-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(10, 110, 168, 0.12);
      }
      .demo-action-box {
        padding: 12px 14px;
        border-radius: var(--radius-sm);
        background: rgba(230, 243, 250, 0.7);
        border: 1px solid rgba(10, 110, 168, 0.15);
      }
    `;
    document.head.appendChild(style);
  }

  initListeners() {
    this.fabEl.addEventListener('click', () => this.toggleModal());
    this.closeBtn.addEventListener('click', () => this.closeModal());
    this.overlayEl.addEventListener('click', () => this.closeModal());

    this.triggerFloodBtn.addEventListener('click', () => {
      sim.triggerFloodScenario();
      this.triggerFloodBtn.textContent = '🌊 Flood Scenario Active!';
      setTimeout(() => {
        this.triggerFloodBtn.textContent = '🌊 Trigger Flood Scenario';
      }, 3000);
    });

    this.resetBtn.addEventListener('click', () => {
      sim.resetScenario();
      this.resetBtn.textContent = '✓ Baseline Restored';
      setTimeout(() => {
        this.resetBtn.textContent = '🔄 Reset Baseline';
      }, 2500);
    });

    this.speedBtn.addEventListener('click', () => {
      const nextSpeed = sim.simulationSpeed === 1 ? 5 : 1;
      sim.setSpeed(nextSpeed);
      if (this.speedLabel) {
        this.speedLabel.textContent = nextSpeed === 5 ? '5x (Fast)' : '1x (Normal)';
      }
    });

    this.loraBtn.addEventListener('click', () => {
      const nextMode = sim.isLoRaMode ? 'online' : 'lora';
      sim.setConnectivityMode(nextMode);
      if (this.loraLabel) {
        this.loraLabel.textContent = nextMode === 'lora' ? 'LoRa Offline' : 'Cloud Online';
      }
    });

    sim.on('connectivityChanged', ({ isLoRaMode }) => {
      if (this.loraLabel) {
        this.loraLabel.textContent = isLoRaMode ? 'LoRa Offline' : 'Cloud Online';
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
