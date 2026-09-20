/**
 * PravahAi Screen: Overview Dashboard (dashboard.js)
 * Dark cyber-civic operational console with glowing charts and telemetry pods
 */

import { sim } from '../sim.js';
import { RiskGaugeComponent } from '../components/riskGauge.js';
import { AlertFeedComponent } from '../components/alertFeed.js';

let chartInstance = null;
let gaugeComponent = null;
let alertFeedComponent = null;
let unsubscribeTick = null;

export function renderDashboard(container) {
  container.innerHTML = `
    <!-- Mobile Sticky Risk Bar -->
    <div class="mobile-sticky-risk-bar">
      <div class="sticky-risk-left">
        <span class="live-beacon-dot"></span>
        <span>CITY FLOOD RISK:</span>
        <span id="mobile-sticky-risk-score" class="sticky-risk-score">--%</span>
      </div>
      <span id="mobile-sticky-status-pill" class="status-pill status-pill-safe">SAFE</span>
    </div>

    <!-- Section Header -->
    <div class="section-header">
      <div>
        <h1 class="section-title">Live Flood Console</h1>
        <p class="section-subtitle">Live water levels and smart flood predictions for the next 1 to 2 hours</p>
      </div>
      <div class="live-beacon">
        <span class="live-beacon-dot"></span>
        6 STATIONS ONLINE
      </div>
    </div>

    <!-- Top Grid: Risk Gauge & Horizon Forecast Chart -->
    <div class="dashboard-top-grid">
      <div id="risk-gauge-container" class="glass-panel gauge-card">
        <!-- Injected by RiskGaugeComponent -->
      </div>

      <div class="glass-panel horizon-chart-card">
        <div class="section-header" style="margin-bottom: 12px;">
          <div>
            <h3 style="font-size: 1rem; font-weight: 800; color: #ffffff;">
              Predicted Flood Risk (Next 2 Hours)
            </h3>
            <p style="font-size: 0.75rem; color: var(--text-muted);">
              AI forecast showing how water levels will change over the next 30, 60, and 120 minutes
            </p>
          </div>
          <span class="status-pill status-pill-safe" id="forecast-trend-tag">STATUS: STABLE</span>
        </div>

        <div class="chart-container-box">
          <canvas id="horizon-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- Fleet / Node Status Strip -->
    <div class="fleet-section">
      <div class="fleet-header-row">
        <div>
          <div class="fleet-tag">LIVE STREET SENSORS</div>
          <h3 class="fleet-title">Live Water Monitoring Stations</h3>
          <p class="fleet-subtitle">Swipe or use arrows to view all 6 monitoring stations</p>
        </div>
        <div class="fleet-controls-group">
          <span class="status-pill status-pill-safe" style="font-size: 0.68rem;">6 Stations Active</span>
          <div class="scroll-nav-buttons">
            <button id="btn-fleet-prev" class="btn-scroll-arrow" aria-label="Scroll left" title="Scroll left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button id="btn-fleet-next" class="btn-scroll-arrow" aria-label="Scroll right" title="Scroll right">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div id="fleet-nodes-mount" class="fleet-scroll-container">
        <!-- Rendered dynamically -->
      </div>
    </div>

    <!-- Active Alerts Feed -->
    <div id="alerts-feed-mount">
      <!-- Injected by AlertFeedComponent -->
    </div>
  `;

  const gaugeMount = container.querySelector('#risk-gauge-container');
  gaugeComponent = new RiskGaugeComponent(gaugeMount);

  const alertsMount = container.querySelector('#alerts-feed-mount');
  alertFeedComponent = new AlertFeedComponent(alertsMount);
  alertFeedComponent.update(sim.alerts);

  initHorizonChart(container.querySelector('#horizon-chart'));
  
  const fleetMount = container.querySelector('#fleet-nodes-mount');
  renderFleetStrip(fleetMount);

  // Arrow scroll buttons
  const prevBtn = container.querySelector('#btn-fleet-prev');
  const nextBtn = container.querySelector('#btn-fleet-next');
  prevBtn?.addEventListener('click', () => {
    fleetMount?.scrollBy({ left: -240, behavior: 'smooth' });
  });
  nextBtn?.addEventListener('click', () => {
    fleetMount?.scrollBy({ left: 240, behavior: 'smooth' });
  });

  const initialRisk = sim.getOverallSystemRisk();
  gaugeComponent.update(initialRisk);
  updateMobileStickyBar(initialRisk);

  if (unsubscribeTick) unsubscribeTick();
  unsubscribeTick = sim.on('tick', ({ systemRisk }) => {
    gaugeComponent?.update(systemRisk);
    updateMobileStickyBar(systemRisk);
    renderFleetStrip(fleetMount);
    alertFeedComponent?.update(sim.alerts);
    updateHorizonChart(systemRisk);
  });
}

function updateMobileStickyBar(risk) {
  const scoreEl = document.getElementById('mobile-sticky-risk-score');
  const pillEl = document.getElementById('mobile-sticky-status-pill');
  if (!scoreEl || !pillEl) return;

  scoreEl.textContent = `${risk}%`;
  if (risk >= 75) {
    pillEl.className = 'status-pill status-pill-unsafe';
    pillEl.textContent = 'UNSAFE';
  } else if (risk >= 45) {
    pillEl.className = 'status-pill status-pill-risk';
    pillEl.textContent = 'AT RISK';
  } else {
    pillEl.className = 'status-pill status-pill-safe';
    pillEl.textContent = 'SAFE';
  }
}

function renderFleetStrip(mountEl) {
  if (!mountEl) return;
  mountEl.innerHTML = sim.nodes.map(node => {
    const isUnsafe = node.status === 'UNSAFE';
    const isRisk = node.status === 'AT_RISK';
    const pillClass = isUnsafe ? 'status-pill-unsafe' : isRisk ? 'status-pill-risk' : 'status-pill-safe';
    const pct = Math.min(100, Math.round((node.water_level / node.critical_threshold) * 100));
    const barColor = isUnsafe ? '#ef4444' : isRisk ? '#f59e0b' : '#38bdf8';

    return `
      <a href="#node-detail?id=${node.id}" class="fleet-node-card" title="Click to view full diagnostics for ${node.name}">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
          <span class="fleet-node-name" title="${node.name}">${node.name}</span>
          <span class="status-pill ${pillClass}" style="padding: 2px 7px; font-size: 0.62rem; flex-shrink: 0;">
            ${node.status.replace('_', ' ')}
          </span>
        </div>

        <div class="node-water-bar-track">
          <div class="node-water-bar-fill" style="width: ${pct}%; background: ${barColor};"></div>
        </div>

        <div class="fleet-metrics-row">
          <span>Water Depth</span>
          <span class="fleet-water-val" style="color: ${barColor};">
            ${node.water_level}m
          </span>
        </div>

        <div class="fleet-metrics-row">
          <span>Rising Speed</span>
          <span style="font-weight: 700; color: #ffffff;">${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} cm/h</span>
        </div>

        <div class="fleet-card-footer">
          <span>Battery ${node.battery_pct}%</span>
          <span>Radio ${node.lora_rssi} dBm</span>
          <span>${node.last_ping}</span>
        </div>
      </a>
    `;
  }).join('');
}

function initHorizonChart(canvasEl) {
  if (!canvasEl || typeof Chart === 'undefined') return;
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = canvasEl.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 220);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
  gradient.addColorStop(1, 'rgba(56, 189, 248, 0.01)');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0m (Now)', '+30m', '+60m', '+90m', '+120m'],
      datasets: [
        {
          label: 'Surrogate Risk Nowcast',
          data: [28, 42, 65, 78, 85],
          borderColor: '#38bdf8',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#060d16',
          pointBorderColor: '#38bdf8',
          pointBorderWidth: 2.5,
          pointRadius: 4.5,
          pointHoverRadius: 6
        },
        {
          label: 'Critical Clearance Threshold (75%)',
          data: [75, 75, 75, 75, 75],
          borderColor: 'rgba(239, 68, 68, 0.65)',
          borderWidth: 1.5,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 8,
            usePointStyle: true,
            font: { family: "'Inter', sans-serif", size: 10, weight: '600' },
            color: '#94a3b8'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(6, 13, 22, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          bodyFont: { size: 11 }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            callback: v => `${v}%`,
            font: { size: 9, family: "'Inter', sans-serif" },
            color: '#64748b'
          },
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        x: {
          ticks: {
            font: { size: 10, family: "'Inter', sans-serif" },
            color: '#94a3b8'
          },
          grid: { display: false }
        }
      }
    }
  });
}

function updateHorizonChart(systemRisk) {
  if (!chartInstance) return;
  const isSurge = systemRisk >= 65;
  const mult = isSurge ? 1.25 : 0.85;
  const data = [
    systemRisk,
    Math.min(99, Math.round(systemRisk * mult)),
    Math.min(99, Math.round(systemRisk * mult * 1.15)),
    Math.min(99, Math.round(systemRisk * mult * 1.25)),
    Math.min(99, Math.round(systemRisk * mult * 1.3))
  ];

  chartInstance.data.datasets[0].data = data;
  chartInstance.update('none');

  const trendTag = document.getElementById('forecast-trend-tag');
  if (trendTag) {
    if (systemRisk >= 75) {
      trendTag.className = 'status-pill status-pill-unsafe';
      trendTag.textContent = 'TREND: INUNDATION IMMINENT';
    } else if (systemRisk >= 45) {
      trendTag.className = 'status-pill status-pill-risk';
      trendTag.textContent = 'TREND: ACCELERATING';
    } else {
      trendTag.className = 'status-pill status-pill-safe';
      trendTag.textContent = 'TREND: STABLE';
    }
  }
}
