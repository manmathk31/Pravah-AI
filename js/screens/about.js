/**
 * PravahAi Screen: About & System Documentation View (about.js)
 * Executive summary, problem context, multimodal edge innovation, team credits, and prototype disclaimer
 */

export function renderAbout(container) {
  container.innerHTML = `
    <div class="about-page-container">
      <!-- Hero Box -->
      <div class="glass-panel about-hero-box">
        <span class="prototype-disclaimer">
          Hackathon Idea Submission Prototype • Simulated Data
        </span>
        <h1 class="hero-title" style="font-size: var(--text-2xl); margin-bottom: 0;">
          PravahAi
        </h1>
        <p class="about-definition-text">
          “A portable multimodal edge system that senses rainfall and water-level dynamics, interprets local road conditions with computer vision, predicts short-term flood risk, updates road accessibility, and provides resilient local alerts and safer-route guidance.”
        </p>
      </div>

      <!-- Problem vs Innovation Grid -->
      <div class="about-section-grid">
        <!-- Problem Statement -->
        <div class="glass-panel about-content-card">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.4rem;">🚨</span>
            <h3>The Urban Flood Blindspot</h3>
          </div>
          <p>
            Traditional municipal flood warnings rely on sparse regional river basin gauges and coarse meteorological radar. They consistently miss hyperlocal flash inundations in low-lying underpasses, arterial road culverts, and urban basins until vehicles are already submerged and lives are at risk.
          </p>
          <p>
            Crucially, cloud-dependent warning systems fail precisely when they are needed most — extreme weather knocks out cellular base stations and power grids, rendering centralized alert dashboards inaccessible.
          </p>
        </div>

        <!-- PravahAi Contribution -->
        <div class="glass-panel-elevated about-content-card" style="border-left: 4px solid var(--accent-primary);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.4rem;">⚡</span>
            <h3>The PravahAi Innovation</h3>
          </div>
          <p>
            PravahAi deploys low-power, solar-harvesting edge nodes directly at critical flood chokepoints. By fusing ultrasonic water gauges, optical rainmeters, and onboard computer vision, it predicts roadway overtopping <strong>30–120 minutes ahead</strong> of physical breach.
          </p>
          <p>
            When internet infrastructure goes down, PravahAi degrades gracefully to a decentralized <strong>LoRa peer-to-peer mesh network</strong>. Local acoustic beacons and vehicle navigation nodes continue broadcasting safe reroute coordinates completely offline.
          </p>
        </div>
      </div>

      <!-- Core Technical Pillars -->
      <div class="glass-panel" style="padding: var(--space-6);">
        <h3 style="font-size: var(--text-lg); font-weight: 800; margin-bottom: var(--space-4); text-align: center;">
          Core Decision Chain
        </h3>
        <div class="chain-steps-container" style="margin-top: 0;">
          <div style="text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">📡</div>
            <strong style="color: var(--accent-deep); font-size: var(--text-sm);">1. SENSE</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">Multimodal physical & optical sensing every 2 seconds</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">⚡</div>
            <strong style="color: var(--accent-deep); font-size: var(--text-sm);">2. FUSE</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">Edge Kalman filtering & acoustic flow correlation</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">🧠</div>
            <strong style="color: var(--accent-deep); font-size: var(--text-sm);">3. PREDICT</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">30–120m hydrodynamic neural surrogate nowcasting</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">🚦</div>
            <strong style="color: var(--accent-deep); font-size: var(--text-sm);">4. ASSESS</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">Dynamic road classification (SAFE / RISK / UNSAFE)</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">🗺</div>
            <strong style="color: var(--accent-deep); font-size: var(--text-sm);">5. ACT</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">LoRa offline beacons & elevated detour guidance</p>
          </div>
        </div>
      </div>

      <!-- Team & Hackathon Credits -->
      <div class="glass-panel team-credits-card">
        <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--text-main);">
          Project Submission & Credits
        </h3>
        <p style="font-size: var(--text-xs); color: var(--text-muted); max-width: 600px;">
          Developed for the Hackathon Idea Submission Stage. This prototype is engineered to demonstrate the end-to-end user experience, edge intelligence, and resilient civic interaction patterns envisioned for PravahAi.
        </p>

        <div class="team-tags-row">
          <span class="team-badge">PravahAi Engineering Team</span>
          <span class="team-badge">Edge AI & Hydrology Research</span>
          <span class="team-badge">Civic Resilience Prototype</span>
          <span class="team-badge">Zero Build Step Architecture</span>
        </div>

        <div style="margin-top: 10px; font-size: 0.75rem; color: var(--text-muted);">
          Ready for one-click static deployment on Render, GitHub Pages, or Vercel.
        </div>
      </div>
    </div>
  `;
}
