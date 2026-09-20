/**
 * PravahAi Screen: About & System Overview (about.js)
 * Clear, simple, easy-to-understand explanation of why PravahAi exists and how it works
 */

const hardwareModules = [
  {
    id: 'compute',
    name: 'On-Site AI Computer',
    chip: 'NVIDIA Jetson Orin Nano',
    spec: 'Fast Local AI • Low 15W Power',
    details: 'Runs smart flood prediction models right inside the street station. Calculates future water rise in 38 milliseconds without sending private video or sensor data to slow cloud servers.',
    tag: 'LOCAL AI'
  },
  {
    id: 'sensors',
    name: 'All-Weather Water Sensors',
    chip: 'Sound Waves + Rain Gauge',
    spec: 'Millimeter Accuracy • All-Weather',
    details: 'Acoustic sound sensors measure water depth accurately, ignoring floating leaves and surface ripples. High-speed rain gauges detect sudden cloudbursts before city storm drains begin to overflow.',
    tag: 'HIGH ACCURACY'
  },
  {
    id: 'comms',
    name: 'Emergency Long-Range Radio',
    chip: 'Long-Range Radio Transmitter',
    spec: 'Up to 12 km Range • Works Without Internet',
    details: 'Broadcasts flood warnings and safe detour routes directly to cars, electronic highway signs, and municipal teams. Works completely without cellular towers, phone cables, or internet.',
    tag: 'WORKS OFFLINE'
  },
  {
    id: 'power',
    name: 'Solar Battery System',
    chip: 'Solar Panel + Long-Life Battery',
    spec: 'Waterproof • 7-Day Battery Backup',
    details: 'Weatherproof enclosure powered by an efficient solar panel and long-lasting lithium battery. Designed to stay fully powered even through a week of dark, stormy monsoon weather.',
    tag: 'SOLAR POWERED'
  }
];

let activeHwModule = hardwareModules[0];

export function renderAbout(container) {
  container.innerHTML = `
    <div class="about-page-container">
      <!-- Mission Hero -->
      <div class="glass-panel about-hero-box">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 18px;">
          <img src="assets/paravahai.jpeg" alt="PravahAi Logo" style="width: 80px; height: 80px; border-radius: 20px; object-fit: contain; background: #ffffff; padding: 3px; box-shadow: 0 0 24px rgba(2, 132, 199, 0.45); border: 2px solid rgba(56, 189, 248, 0.5);">
        </div>
        <span class="status-pill status-pill-safe">
          Smart Flood Protection Platform
        </span>
        <h1 class="about-brand-title">Pravah<span>Ai</span></h1>
        <p class="about-tagline">
          Predicting street flooding <strong>30 to 120 minutes in advance</strong> — and guiding drivers to safety even when power and cell towers go down.
        </p>
        <div class="hero-quick-highlights">
          <div class="highlight-chip">
            <span class="highlight-val">38ms</span>
            <span class="highlight-lbl">Fast AI Calculation</span>
          </div>
          <div class="highlight-chip">
            <span class="highlight-val">100%</span>
            <span class="highlight-lbl">Works Without Internet</span>
          </div>
          <div class="highlight-chip">
            <span class="highlight-val">0 Cloud</span>
            <span class="highlight-lbl">No Cloud Delays</span>
          </div>
        </div>
      </div>

      <!-- The Problem vs The Solution -->
      <div class="comparison-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">The Urban Flood Challenge</h2>
            <p class="section-subtitle">Why traditional city flood warnings fail motorists and commuters</p>
          </div>
        </div>

        <div class="three-pillar-grid">
          <!-- Pillar 1 -->
          <div class="pillar-card">
            <div class="pillar-num">01</div>
            <h3 class="pillar-title">The City Blindspot</h3>
            <div class="pillar-problem">
              <span class="problem-label">THE PROBLEM:</span>
              <p>Old flood stations are placed kilometers apart along big rivers. They cannot see street underpasses, culverts, or dips in the road where cars actually get submerged.</p>
            </div>
            <div class="pillar-solution">
              <span class="solution-label">PRAVAHAI SOLUTION:</span>
              <p>Compact, affordable sensor stations install directly at dangerous road dips, measuring rising water every 2 seconds.</p>
            </div>
          </div>

          <!-- Pillar 2 -->
          <div class="pillar-card">
            <div class="pillar-num">02</div>
            <h3 class="pillar-title">Slow Cloud Warnings</h3>
            <div class="pillar-problem">
              <span class="problem-label">THE PROBLEM:</span>
              <p>Traditional flood computer models take 4 to 8 hours to calculate reports. Flash floods cover roads in less than 20 minutes.</p>
            </div>
            <div class="pillar-solution">
              <span class="solution-label">PRAVAHAI SOLUTION:</span>
              <p>Lightweight AI runs in <strong>38 milliseconds</strong> right on street poles, warning drivers 30 to 120 minutes before roads go underwater.</p>
            </div>
          </div>

          <!-- Pillar 3 -->
          <div class="pillar-card">
            <div class="pillar-num">03</div>
            <h3 class="pillar-title">Cell Towers Going Down</h3>
            <div class="pillar-problem">
              <span class="problem-label">THE PROBLEM:</span>
              <p>Severe storms often knock down power lines and cell towers. When people need warnings most, mobile apps stop working.</p>
            </div>
            <div class="pillar-solution">
              <span class="solution-label">PRAVAHAI SOLUTION:</span>
              <p>Emergency <strong>long-range radios</strong> broadcast safe detour routes directly to highway signs and emergency teams without internet.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Hardware Pod Showcase -->
      <div class="glass-panel" style="padding: 28px 24px;">
        <div class="section-header" style="margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff;">Street Station Components</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Click each part below to learn how it works</p>
          </div>
          <span class="status-pill status-pill-safe">Weatherproof & Solar</span>
        </div>

        <!-- Hardware Module Selector Chips -->
        <div class="hw-module-chips" id="hw-chips-container">
          ${hardwareModules.map(mod => `
            <button class="hw-chip-btn ${mod.id === activeHwModule.id ? 'active' : ''}" data-mod-id="${mod.id}">
              <span class="hw-chip-dot"></span>
              <span>${mod.name}</span>
            </button>
          `).join('')}
        </div>

        <!-- Active Module Inspector Card -->
        <div class="hw-inspector-card glass-panel-elevated" id="hw-inspector-card">
          <div class="hw-card-top">
            <div>
              <span class="status-pill status-pill-safe" style="font-size: 0.65rem;" id="hw-inspector-tag">
                ${activeHwModule.tag}
              </span>
              <h4 class="hw-chip-title" id="hw-inspector-name">${activeHwModule.name}</h4>
              <div class="hw-chip-hardware" id="hw-inspector-chip">${activeHwModule.chip}</div>
            </div>
            <div class="hw-spec-callout" id="hw-inspector-spec">
              ${activeHwModule.spec}
            </div>
          </div>
          <p class="hw-details-text" id="hw-inspector-details">
            ${activeHwModule.details}
          </p>
        </div>
      </div>

      <!-- Simple 4-Step How It Works Walkthrough -->
      <div class="glass-panel" style="padding: 28px 24px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin-bottom: 4px;">
          How PravahAi Works in the Field
        </h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 20px;">
          From rainfall detection to safe detours for motorists
        </p>

        <div class="flow-steps-grid">
          <div class="flow-box">
            <span class="flow-step-tag">STEP 1 • MEASURE</span>
            <h4 class="flow-box-title">Measure Rain & Water</h4>
            <p class="flow-box-desc">Every 2 seconds, outdoor sensors measure river height and track sudden heavy downpours.</p>
          </div>

          <div class="flow-box">
            <span class="flow-step-tag">STEP 2 • PREDICT</span>
            <h4 class="flow-box-title">Fast AI Calculation</h4>
            <p class="flow-box-desc">A fast AI model calculates if water will overflow onto the road over the next 1 to 2 hours.</p>
          </div>

          <div class="flow-box">
            <span class="flow-step-tag">STEP 3 • CHECK</span>
            <h4 class="flow-box-title">Check Car Clearance</h4>
            <p class="flow-box-desc">If water rises above 25cm (car exhaust height), the road is instantly marked UNSAFE.</p>
          </div>

          <div class="flow-box">
            <span class="flow-step-tag">STEP 4 • PROTECT</span>
            <h4 class="flow-box-title">Send Alerts & Detours</h4>
            <p class="flow-box-desc">Emergency radios guide drivers to safe dry roads and automatically turn on city drainage pumps.</p>
          </div>
        </div>
      </div>

      <!-- Hackathon Prototype Credits -->
      <div class="glass-panel team-credits-card">
        <h3 style="font-size: 1rem; font-weight: 800; color: #ffffff;">
          Interactive Prototype Demo
        </h3>
        <p style="font-size: 0.8rem; color: var(--text-secondary); max-width: 680px; line-height: 1.6;">
          Built as a lightweight static web app. All water forecasts, camera views, detour routes, and radio alerts run directly in your browser without needing an external backend.
        </p>
        <div class="team-tags-row">
          <span class="team-badge">PravahAi Flood Intelligence</span>
          <span class="team-badge">Civic Climate Safety</span>
          <span class="team-badge">Works 100% Offline</span>
          <span class="team-badge">Emergency Long-Range Radio</span>
        </div>
      </div>
    </div>
  `;

  // Attach hardware chip click handlers
  const hwButtons = container.querySelectorAll('.hw-chip-btn');
  hwButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modId = btn.getAttribute('data-mod-id');
      const mod = hardwareModules.find(m => m.id === modId);
      if (!mod) return;

      activeHwModule = mod;
      hwButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const nameEl = container.querySelector('#hw-inspector-name');
      const chipEl = container.querySelector('#hw-inspector-chip');
      const specEl = container.querySelector('#hw-inspector-spec');
      const tagEl = container.querySelector('#hw-inspector-tag');
      const detailsEl = container.querySelector('#hw-inspector-details');

      if (nameEl) nameEl.textContent = mod.name;
      if (chipEl) chipEl.textContent = mod.chip;
      if (specEl) specEl.textContent = mod.spec;
      if (tagEl) tagEl.textContent = mod.tag;
      if (detailsEl) detailsEl.textContent = mod.details;
    });
  });
}
