/**
 * PravahAi Screen: Landing / Hero Page (landing.js)
 * High-impact hero, animated stats, 5-step decision chain, inline SVG edge architecture
 */

export function renderLanding(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="landing-hero">
      <div class="hero-pill">
        <span class="live-beacon-dot"></span>
        Edge-AI Flood Nowcasting System
      </div>

      <h1 class="hero-title">
        Hyperlocal flood intelligence, <br class="hidden-xs">
        <span class="hero-title-accent">30–120 minutes ahead.</span>
      </h1>

      <p class="hero-tagline">
        A portable multimodal edge system that senses rainfall and water-level dynamics, interprets local road conditions with computer vision, predicts short-term flood risk, updates road accessibility, and provides resilient local alerts and safer-route guidance.
      </p>

      <div class="hero-cta-group">
        <a href="#dashboard" class="btn btn-primary" style="padding: 12px 28px; font-size: var(--text-base);">
          <svg style="width: 20px; height: 20px; fill: none; stroke: currentColor;" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Open Live Dashboard
        </a>
        <a href="#map" class="btn btn-glass" style="padding: 12px 24px; font-size: var(--text-base);">
          <svg style="width: 20px; height: 20px; fill: none; stroke: currentColor;" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          Explore Basin Map
        </a>
      </div>

      <!-- Quick Stat Strip (2x2 mobile, 4-col desktop) -->
      <div class="stats-strip">
        <div class="glass-panel stat-card">
          <div class="stat-number">6 Nodes</div>
          <div class="stat-label">Active Edge Mesh</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-number">42.8 km</div>
          <div class="stat-label">Roadways Monitored</div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-number">45–90 min</div>
          <div class="stat-label">Actionable Lead Time</div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-number">100%</div>
          <div class="stat-label">LoRa Offline Resilience</div>
        </div>
      </div>
    </section>

    <!-- 5-Step Core Decision Chain: SENSE -> FUSE -> PREDICT -> ASSESS -> ACT -->
    <section class="chain-section">
      <div class="section-header" style="text-align: center; display: block;">
        <h2 class="section-title">The Multimodal Decision Chain</h2>
        <p class="section-subtitle" style="margin-top: 6px;">From localized physical sensors to live community navigation guidance</p>
      </div>

      <div class="chain-steps-container">
        <div class="glass-panel chain-step-card">
          <span class="step-badge">1</span>
          <h3 class="step-name">SENSE</h3>
          <p class="step-desc">Dual ultrasonic water-level gauges, optical tipping-bucket rainmeters, and roadside cameras sample physical conditions every 2 seconds.</p>
        </div>

        <div class="glass-panel chain-step-card">
          <span class="step-badge">2</span>
          <h3 class="step-name">FUSE</h3>
          <p class="step-desc">Onboard NPU correlates acoustic flow velocity, millimeter-accuracy depth trends, and computer vision water ponding masks.</p>
        </div>

        <div class="glass-panel chain-step-card">
          <span class="step-badge">3</span>
          <h3 class="step-name">PREDICT</h3>
          <p class="step-desc">Lightweight hydrodynamic 1D/2D neural surrogate models nowcast flood crest and street overflow 30–120 minutes ahead.</p>
        </div>

        <div class="glass-panel chain-step-card">
          <span class="step-badge">4</span>
          <h3 class="step-name">ASSESS</h3>
          <p class="step-desc">Road network segments dynamically classified into <strong>SAFE</strong>, <strong>AT RISK</strong>, or <strong>UNSAFE</strong> based on vehicle clearance tolerances.</p>
        </div>

        <div class="glass-panel chain-step-card">
          <span class="step-badge">5</span>
          <h3 class="step-name">ACT</h3>
          <p class="step-desc">Automated dispatch of decentralized LoRa mesh alerts, API updates for navigation providers, and elevated detour rerouting.</p>
        </div>
      </div>
    </section>

    <!-- System Edge Architecture Inline SVG -->
    <section style="margin-bottom: var(--space-12);">
      <div class="glass-panel arch-diagram-card">
        <div class="chart-header">
          <div>
            <h3 style="font-size: var(--text-lg); font-weight: 800; color: var(--text-main);">Edge-to-Citizen System Architecture</h3>
            <p style="font-size: var(--text-xs); color: var(--text-muted);">Decentralized multimodal sensing with graceful offline LoRa fallback</p>
          </div>
          <span class="status-pill status-pill-safe">Zero Cloud Dependency</span>
        </div>

        <div class="arch-svg-container">
          <svg class="arch-svg" viewBox="0 0 920 320" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#e3f3fb" stop-opacity="0.75"/>
              </linearGradient>
              <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#1ea7db"/>
                <stop offset="100%" stop-color="#0a6ea8"/>
              </linearGradient>
              <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="125%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0a6ea8" flood-opacity="0.12"/>
              </filter>
            </defs>

            <!-- Layer 1: SENSING -->
            <rect x="20" y="30" width="220" height="260" rx="16" fill="url(#boxGrad)" stroke="#bfe3f2" stroke-width="2" filter="url(#boxShadow)"/>
            <text x="130" y="62" text-anchor="middle" font-weight="800" font-size="14" fill="#0a6ea8">MULTIMODAL SENSING</text>

            <rect x="35" y="85" width="190" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="48" y="106" font-weight="700" font-size="12" fill="#0c1f2e">🌧 Rainfall Dynamics</text>
            <text x="48" y="124" font-size="10" fill="#48667c">Optical tipping bucket (15m/60m)</text>

            <rect x="35" y="145" width="190" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="48" y="166" font-weight="700" font-size="12" fill="#0c1f2e">🌊 Water-Level Sensors</text>
            <text x="48" y="184" font-size="10" fill="#48667c">Ultrasonic + hydrostatic pressure</text>

            <rect x="35" y="205" width="190" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="48" y="226" font-weight="700" font-size="12" fill="#0c1f2e">📷 Roadside Vision</text>
            <text x="48" y="244" font-size="10" fill="#48667c">Edge camera puddle & curb analysis</text>

            <!-- Connector Arrow 1 -->
            <path d="M 245 160 L 295 160" stroke="url(#arrowGrad)" stroke-width="4" stroke-dasharray="6,4" marker-end="url(#arrowhead)"/>

            <!-- Layer 2: EDGE GATEWAY & INFERENCE -->
            <rect x="300" y="30" width="280" height="260" rx="16" fill="url(#boxGrad)" stroke="#1ea7db" stroke-width="2.5" filter="url(#boxShadow)"/>
            <text x="440" y="62" text-anchor="middle" font-weight="800" font-size="14" fill="#0a6ea8">PRAVAHAI EDGE GATEWAY</text>

            <rect x="315" y="85" width="250" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="328" y="106" font-weight="700" font-size="12" fill="#0c1f2e">⚡ Multimodal Data Fusion</text>
            <text x="328" y="124" font-size="10" fill="#48667c">Kalman filtering + anomaly rejection</text>

            <rect x="315" y="145" width="250" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="328" y="166" font-weight="700" font-size="12" fill="#0c1f2e">🧠 30–120m Nowcasting Model</text>
            <text x="328" y="184" font-size="10" fill="#48667c">Hydrodynamic surrogate (38ms inference)</text>

            <rect x="315" y="205" width="250" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="328" y="226" font-weight="700" font-size="12" fill="#0c1f2e">🚦 Road Accessibility Engine</text>
            <text x="328" y="244" font-size="10" fill="#48667c">SAFE / AT RISK / UNSAFE classification</text>

            <!-- Connector Arrow 2 -->
            <path d="M 585 160 L 635 160" stroke="url(#arrowGrad)" stroke-width="4" stroke-dasharray="6,4"/>

            <!-- Layer 3: RESILIENT DISPATCH & CITIZEN ACTION -->
            <rect x="640" y="30" width="260" height="260" rx="16" fill="url(#boxGrad)" stroke="#bfe3f2" stroke-width="2" filter="url(#boxShadow)"/>
            <text x="770" y="62" text-anchor="middle" font-weight="800" font-size="14" fill="#0a6ea8">ACT & DISPATCH</text>

            <rect x="655" y="85" width="230" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="668" y="106" font-weight="700" font-size="12" fill="#0c1f2e">📡 LoRa Offline Alert Mesh</text>
            <text x="668" y="124" font-size="10" fill="#48667c">Zero-internet direct acoustic beacons</text>

            <rect x="655" y="145" width="230" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="668" y="166" font-weight="700" font-size="12" fill="#0c1f2e">🗺 Dynamic Safe Routing</text>
            <text x="668" y="184" font-size="10" fill="#48667c">Instant detour away from flooded links</text>

            <rect x="655" y="205" width="230" height="50" rx="8" fill="#ffffff" stroke="#d5eaf5"/>
            <text x="668" y="226" font-weight="700" font-size="12" fill="#0c1f2e">🚨 Municipal & Responder API</text>
            <text x="668" y="244" font-size="10" fill="#48667c">Pump dispatch & automated road barrier</text>
          </svg>
        </div>
      </div>
    </section>
  `;
}
