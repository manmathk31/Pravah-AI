/**
 * PravahAi Screen: Landing / Hero View (landing.js)
 * Fully interactive, clickable cards, live telemetry inspector, and responsive architecture pipeline
 */

const decisionStepsData = [
  {
    step: '01 MEASURE',
    name: 'Check Water & Rain',
    metric: 'Every 2 Seconds',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
    desc: 'Weatherproof sensors measure rainfall, river levels, and street puddles continuously in real time.',
    sampleTelemetry: 'Station 03 (Lowland Causeway) • Water Depth: 1.76m • Rising: +8.4 cm/hour • Heavy Rain: 19 mm in last 15 min',
    confidence: '99% Sensor Accuracy',
    badge: 'Dual Water Sensors Active',
    actionHash: '#node-detail?id=node-03',
    actionText: 'View Station Water Levels'
  },
  {
    step: '02 VERIFY',
    name: 'Double-Check Data',
    metric: 'Instant Verification',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>`,
    desc: 'Combines camera images with water sensors to filter out splashes, passing cars, and false alarms.',
    sampleTelemetry: 'Verification Match: Water depth sensor + street camera both confirm water is rising onto road curb',
    confidence: '94% Sensors Agree',
    badge: 'False Alarms Filtered Out',
    actionHash: '#node-detail?id=node-03',
    actionText: 'View Verification Details'
  },
  {
    step: '03 FORECAST',
    name: 'Predict Water Rise',
    metric: '30–120 Min Ahead',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`,
    desc: 'Fast AI models predict if and when the road will flood before water covers the road.',
    sampleTelemetry: 'Flood Prediction: Water will overflow road in 48 minutes with 89% probability if rain continues',
    confidence: '89% Forecast Confidence',
    badge: 'AI Calculation in 38ms',
    actionHash: '#dashboard',
    actionText: 'Open Live Forecast Chart'
  },
  {
    step: '04 CHECK SAFETY',
    name: 'Mark Road Safety',
    metric: '25cm Safe Car Limit',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
    desc: 'Labels each road as SAFE, AT RISK, or UNSAFE based on standard car clearance.',
    sampleTelemetry: 'Road Section 3B: Water depth over 25cm -> Marked UNSAFE (Cars cannot pass safely)',
    confidence: 'Zero Risk Tolerance',
    badge: 'Automatic Safety Rating',
    actionHash: '#incidents',
    actionText: 'See Warning History'
  },
  {
    step: '05 PROTECT',
    name: 'Guide Drivers to Safety',
    metric: 'Works Offline',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>`,
    desc: 'Broadcasts instant road warnings and shows higher, dry detour roads even if cellular internet goes down.',
    sampleTelemetry: 'Emergency Alert Sent: 142 nearby signs and radios alerted • Traffic safely routed to Ridge Highway',
    confidence: '100% Radio Coverage',
    badge: 'Offline Radio Broadcast',
    actionHash: '#routing',
    actionText: 'Find Safe Detour Routes'
  }
];

const archLayersData = [
  {
    id: 'layer-sense',
    title: '01 / STREET SENSORS',
    badge: 'SOLAR POWERED',
    chip: 'All-Weather Hardware',
    desc: 'Waterproof outdoor sensors watch rain intensity, river levels, and flooded street curbs around the clock.',
    subitems: [
      {
        id: 'sub-rain',
        title: 'Rain Gauges',
        desc: 'Measures heavy rain in real time',
        spec: 'High-precision rain gauge tracks sudden cloudbursts before storm drains begin to overflow.',
        status: 'ACTIVE • 18.4 mm/hour Rain'
      },
      {
        id: 'sub-depth',
        title: 'Water Level Sounders',
        desc: 'Measures exact water height in meters',
        spec: 'Uses acoustic sound waves to measure water depth accurately, filtering out leaves and surface ripples.',
        status: 'ACTIVE • Depth: 1.76m (+8.4 cm/h)'
      },
      {
        id: 'sub-vision',
        title: 'Street Safety Cameras',
        desc: 'Spots puddles and road curb water',
        spec: 'Smart camera inspects the road surface to measure standing water and curb submersion in real time.',
        status: 'ACTIVE • 12cm Water on Right Lane'
      }
    ]
  },
  {
    id: 'layer-edge',
    title: '02 / ON-SITE AI BRAIN',
    badge: 'LOCAL AI COMPUTER',
    chip: 'Runs Without Cloud',
    desc: 'Compact AI computers on utility poles analyze data right on the street without sending video to slow cloud servers.',
    subitems: [
      {
        id: 'sub-fusion',
        title: 'Smart Sensor Checker',
        desc: 'Cross-checks camera and water sensors',
        spec: 'Checks camera images against water gauges to make sure an alert is real and not just a splash or camera glare.',
        status: 'CONFIRMED • 94% Sensors Agree'
      },
      {
        id: 'sub-surrogate',
        title: 'Water Rise Predictor',
        desc: 'Calculates future flooding in 38 milliseconds',
        spec: 'Fast mathematical AI model predicts how water will spread across the street over the next 1 to 2 hours.',
        status: 'RUNNING • 38ms Fast Calculation'
      },
      {
        id: 'sub-passability',
        title: 'Road Safety Evaluator',
        desc: 'Labels roads as Safe, At Risk, or Flooded',
        spec: 'Compares water depth against standard car height (25cm). Instantly flags roads that are unsafe for drivers.',
        status: 'WARNING • Causeway Marked Flooded'
      }
    ]
  },
  {
    id: 'layer-act',
    title: '03 / PUBLIC SAFETY ALERTS',
    badge: 'WORKS WITHOUT INTERNET',
    chip: 'Emergency Radio Mesh',
    desc: 'Delivers instant warnings and safe detours directly to drivers and city teams, even during power and cellular outages.',
    subitems: [
      {
        id: 'sub-lora',
        title: 'Offline Long-Range Radio',
        desc: 'Direct alerts when mobile towers fail',
        spec: 'Emergency long-range radio relays send safety alerts up to 12 km without needing internet or cell towers.',
        status: 'BROADCASTING • 142 Radios Connected'
      },
      {
        id: 'sub-routing',
        title: 'Safe Detour Navigation',
        desc: 'Directs drivers to dry, elevated streets',
        spec: 'Automatically finds the fastest dry roads around flooded lowlands so motorists avoid submerged underpasses.',
        status: 'DETOUR OPEN • Ridge Highway (+7 min)'
      },
      {
        id: 'sub-dispatch',
        title: 'Automatic Pumps & Gates',
        desc: 'Starts city drainage pumps and gates',
        spec: 'Sends direct signals to close flood gates, display warning signs on highways, and turn on emergency drainage pumps.',
        status: 'TRIGGERED • Pump 2B Running'
      }
    ]
  }
];

let selectedStepIndex = 0;
let selectedLayerIndex = 0;
let selectedSubitem = archLayersData[0].subitems[0];

export function renderLanding(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="landing-hero">
      <div class="hero-pill">
        <span class="live-beacon-dot"></span>
        Smart Street-Level Flood Warnings
      </div>

      <h1 class="hero-title">
        Predict flood risk <br>
        <span class="hero-title-accent">before roads submerge.</span>
      </h1>

      <p class="hero-tagline">
        Smart street sensors and AI predict road flooding 30 to 120 minutes in advance — guiding drivers to safe, dry routes even when internet and cell towers fail.
      </p>

      <div class="hero-cta-group">
        <a href="#dashboard" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Open Live Flood Console
        </a>
        <a href="#map" class="btn btn-glass">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          Explore City Flood Map
        </a>
      </div>

      <!-- Key Stat Strip -->
      <div class="stats-strip">
        <div class="stat-card">
          <div class="stat-number">30–120 min</div>
          <div class="stat-label">Early Warning</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">6 Stations</div>
          <div class="stat-label">Live Street Nodes</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">42.8 km</div>
          <div class="stat-label">Roads Protected</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">100%</div>
          <div class="stat-label">Works Offline</div>
        </div>
      </div>
    </section>

    <!-- 5-Step Interactive Decision Flow -->
    <section class="chain-section">
      <div class="section-header" style="text-align: center; display: block;">
        <span class="status-pill status-pill-safe" style="margin-bottom: 8px;">HOW IT WORKS</span>
        <h2 class="section-title">From Rain to Safe Drivers in 5 Steps</h2>
        <p class="section-subtitle" style="margin-top: 4px;">Click any step below to see what the system does at each stage</p>
      </div>

      <div class="chain-steps-container" id="steps-card-container">
        ${decisionStepsData.map((item, idx) => `
          <div class="chain-step-card ${idx === selectedStepIndex ? 'active' : ''}" data-step-idx="${idx}" tabindex="0" role="button" aria-label="${item.step}: ${item.name}">
            <div class="step-card-top">
              <div class="step-icon-badge">${item.icon}</div>
              <span class="step-num">${item.step}</span>
              <span class="step-active-dot"></span>
            </div>
            <h3 class="step-name">${item.name}</h3>
            <span class="step-metric-chip">${item.metric}</span>
            <p class="step-desc">${item.desc}</p>
            <div class="step-click-prompt">
              <span>Click to inspect</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Mobile Horizontal Swipe Indicator -->
      <div class="mobile-chain-swipe-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        <span>Swipe sideways to see all 5 steps</span>
      </div>

      <!-- Live Inspector Bar for Selected Step -->
      <div class="step-inspector-box glass-panel-elevated" id="step-inspector-box">
        <div class="inspector-left">
          <div class="inspector-header-row">
            <span class="inspector-tag" id="inspector-tag">STEP 01 LIVE DETAILS:</span>
            <span class="status-pill status-pill-safe" id="inspector-badge">
              ${decisionStepsData[selectedStepIndex].badge}
            </span>
          </div>
          <div class="inspector-content" id="inspector-content">
            ${decisionStepsData[selectedStepIndex].sampleTelemetry}
          </div>
          <div class="inspector-confidence" id="inspector-confidence">
            <span class="conf-dot"></span>
            <span id="conf-text">${decisionStepsData[selectedStepIndex].confidence}</span>
          </div>
        </div>
        <div class="inspector-right">
          <a href="${decisionStepsData[selectedStepIndex].actionHash}" class="btn btn-primary btn-sm" id="inspector-action-btn">
            <span id="inspector-action-text">${decisionStepsData[selectedStepIndex].actionText}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Downside Card: Beast Responsive Interactive Architecture Pipeline -->
    <section class="arch-section" style="margin-bottom: 56px;">
      <div class="glass-panel arch-card">
        <div class="section-header">
          <div>
            <div class="arch-sub-heading">HOW THE SYSTEM IS BUILT</div>
            <h3 class="arch-main-title">Three Layers of Flood Protection</h3>
            <p class="arch-subtitle">From street sensors to on-site AI brains and emergency radio alerts</p>
          </div>
          <div class="arch-badges-group">
            <span class="status-pill status-pill-safe">No Cloud Needed</span>
            <span class="status-pill status-pill-risk" style="color: var(--accent-cyan); border-color: rgba(56, 189, 248, 0.4); background: rgba(56, 189, 248, 0.1);">6 Active Street Stations</span>
          </div>
        </div>

        <!-- Layer Selector Tabs for Quick Mobile Access -->
        <div class="arch-nav-tabs">
          ${archLayersData.map((layer, idx) => `
            <button class="arch-tab-btn ${idx === selectedLayerIndex ? 'active' : ''}" data-layer-idx="${idx}">
              <span>${layer.title}</span>
              <span class="tab-chip">${layer.chip}</span>
            </button>
          `).join('')}
        </div>

        <!-- 3-Column Interactive Architecture Display Grid -->
        <div class="arch-pipeline-grid" id="arch-pipeline-grid">
          ${archLayersData.map((layer, idx) => `
            <div class="arch-layer-card ${idx === selectedLayerIndex ? 'highlighted' : ''}" data-layer-idx="${idx}">
              <div class="layer-header">
                <div>
                  <span class="layer-title">${layer.title}</span>
                  <div class="layer-sub-chip">${layer.chip}</div>
                </div>
                <span class="status-pill status-pill-safe" style="font-size: 0.65rem;">${layer.badge}</span>
              </div>
              <p class="layer-lead-desc">${layer.desc}</p>
              <div class="layer-subitems">
                ${layer.subitems.map(sub => `
                  <div class="subitem-box ${sub.id === selectedSubitem.id ? 'subitem-active' : ''}" data-sub-id="${sub.id}" data-layer-idx="${idx}">
                    <div class="subitem-header">
                      <span class="subitem-title">${sub.title}</span>
                      <span class="subitem-indicator"></span>
                    </div>
                    <span class="subitem-desc">${sub.desc}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Live Subsystem Telemetry & Field Specs Drawer (Informative & Interactive) -->
        <div class="arch-spec-inspector glass-panel-elevated" id="arch-spec-inspector">
          <div class="spec-inspector-header">
            <div>
              <div class="spec-category-tag">SELECTED COMPONENT DETAILS:</div>
              <h4 class="spec-title" id="spec-subsystem-title">${selectedSubitem.title}</h4>
            </div>
            <span class="status-pill status-pill-safe" id="spec-subsystem-status">${selectedSubitem.status}</span>
          </div>
          <p class="spec-detail-text" id="spec-subsystem-detail">
            ${selectedSubitem.spec}
          </p>
          <div class="spec-footer-actions">
            <span class="spec-latency-note">Instant Local Response • Runs On-Site</span>
            <a href="#node-detail?id=node-03" class="btn btn-glass btn-sm">
              View Station Hardware Details →
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  // Attach interactive step clicks
  const stepCards = container.querySelectorAll('.chain-step-card');
  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-step-idx'), 10);
      selectedStepIndex = idx;

      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const data = decisionStepsData[idx];
      const tagEl = container.querySelector('#inspector-tag');
      const contentEl = container.querySelector('#inspector-content');
      const badgeEl = container.querySelector('#inspector-badge');
      const confEl = container.querySelector('#conf-text');
      const actionBtn = container.querySelector('#inspector-action-btn');
      const actionText = container.querySelector('#inspector-action-text');

      if (tagEl) tagEl.textContent = `STEP ${data.step} LIVE DETAILS:`;
      if (contentEl) contentEl.textContent = data.sampleTelemetry;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (confEl) confEl.textContent = data.confidence;
      if (actionBtn) actionBtn.setAttribute('href', data.actionHash);
      if (actionText) actionText.textContent = data.actionText;
    });

    // Keyboard navigation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Architecture layer selection logic
  const archTabs = container.querySelectorAll('.arch-tab-btn');
  const archCards = container.querySelectorAll('.arch-layer-card');
  const subitemBoxes = container.querySelectorAll('.subitem-box');

  const updateSubsystemDrawer = (sub) => {
    selectedSubitem = sub;
    const titleEl = container.querySelector('#spec-subsystem-title');
    const statusEl = container.querySelector('#spec-subsystem-status');
    const detailEl = container.querySelector('#spec-subsystem-detail');

    if (titleEl) titleEl.textContent = sub.title;
    if (statusEl) statusEl.textContent = sub.status;
    if (detailEl) detailEl.textContent = sub.spec;

    subitemBoxes.forEach(box => {
      if (box.getAttribute('data-sub-id') === sub.id) {
        box.classList.add('subitem-active');
      } else {
        box.classList.remove('subitem-active');
      }
    });
  };

  const selectLayer = (layerIdx) => {
    selectedLayerIndex = layerIdx;
    archTabs.forEach(t => t.classList.remove('active'));
    archCards.forEach(c => c.classList.remove('highlighted'));

    archTabs[layerIdx]?.classList.add('active');
    archCards[layerIdx]?.classList.add('highlighted');

    const firstSub = archLayersData[layerIdx].subitems[0];
    if (firstSub) updateSubsystemDrawer(firstSub);
  };

  archTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.getAttribute('data-layer-idx'), 10);
      selectLayer(idx);
    });
  });

  archCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on subitem
      if (e.target.closest('.subitem-box')) return;
      const idx = parseInt(card.getAttribute('data-layer-idx'), 10);
      selectLayer(idx);
    });
  });

  // Attach click to each subitem for rich interactive exploration
  subitemBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const subId = box.getAttribute('data-sub-id');
      const layerIdx = parseInt(box.getAttribute('data-layer-idx'), 10);

      selectedLayerIndex = layerIdx;
      archTabs.forEach(t => t.classList.remove('active'));
      archCards.forEach(c => c.classList.remove('highlighted'));
      archTabs[layerIdx]?.classList.add('active');
      archCards[layerIdx]?.classList.add('highlighted');

      const targetSub = archLayersData[layerIdx].subitems.find(s => s.id === subId);
      if (targetSub) updateSubsystemDrawer(targetSub);
    });
  });
}
