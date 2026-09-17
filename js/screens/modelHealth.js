/**
 * PravahAi Screen: Model Health & System Telemetry View (modelHealth.js)
 * Edge AI latency, model performance benchmarks, and sensor health audit.
 */

import { sim } from '../sim.js';

let confidenceChart = null;

export function renderModelHealth(container) {
  container.innerHTML = `
    <div class="health-page-container">
      <!-- Section Header -->
      <div class="section-header">
        <div>
          <h1 class="section-title">Edge AI & System Health</h1>
          <p class="section-subtitle">
            Diagnostic metrics for onboard neural NPUs, hydrodynamic surrogate models, and sensor network integrity
          </p>
        </div>
        <div class="prototype-disclaimer" style="margin: 0;">
          Illustrative Evaluation Benchmarks
        </div>
      </div>

      <!-- Metric Cards: 1 col (mobile) -> 2 col (tablet) -> 4 col (desktop) -->
      <div class="health-metrics-grid">
        <div class="glass-panel health-metric-card">
          <span class="health-metric-title">Model Precision</span>
          <div class="health-metric-val">96.4%</div>
          <span class="health-metric-sub">✓ Validated on 14 Flood Events</span>
          <span class="illustrative-tag">*Illustrative demo benchmark</span>
        </div>

        <div class="glass-panel health-metric-card">
          <span class="health-metric-title">Recall (Critical Inundation)</span>
          <div class="health-metric-val">98.1%</div>
          <span class="health-metric-sub">✓ Zero missed road breaches</span>
          <span class="illustrative-tag">*Illustrative demo benchmark</span>
        </div>

        <div class="glass-panel health-metric-card">
          <span class="health-metric-title">Edge Inference Latency</span>
          <div class="health-metric-val">38 ms</div>
          <span class="health-metric-sub">NVIDIA Jetson / Rockchip NPU</span>
          <span class="illustrative-tag">Quantized FP16 TensorRT</span>
        </div>

        <div class="glass-panel health-metric-card">
          <span class="health-metric-title">False Alarm Rate (FAR)</span>
          <div class="health-metric-val">1.8%</div>
          <span class="health-metric-sub">Acoustic + CV Cross-Verification</span>
          <span class="illustrative-tag">Prevents panic reroutes</span>
        </div>
      </div>

      <!-- Health Details: Confidence Chart & Sensor Table -->
      <div class="health-details-grid">
        <!-- Confidence Chart -->
        <div class="glass-panel health-detail-card">
          <div class="chart-header">
            <div>
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--text-main);">
                Prediction Confidence & Data Completeness (24h)
              </h3>
              <p style="font-size: var(--text-xs); color: var(--text-muted);">
                Tracking Kalman filter certainty and spatial interpolation stability
              </p>
            </div>
            <span class="status-pill status-pill-safe">98.8% Uptime</span>
          </div>

          <div style="position: relative; width: 100%; height: 260px;">
            <canvas id="confidence-chart"></canvas>
          </div>
        </div>

        <!-- Sensor Fault Diagnostics Table -->
        <div class="glass-panel health-detail-card">
          <div class="chart-header">
            <div>
              <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--text-main);">
                Fleet Sensor Diagnostic Ledger
              </h3>
              <p style="font-size: var(--text-xs); color: var(--text-muted);">
                Real-time fault detection and missing-data imputation flags
              </p>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="sensor-uptime-table">
              <thead>
                <tr>
                  <th>Node</th>
                  <th>Hardware</th>
                  <th>Ultrasonic</th>
                  <th>Vision</th>
                  <th>LoRa Mesh</th>
                </tr>
              </thead>
              <tbody>
                ${sim.nodes.map(n => `
                  <tr>
                    <td><strong>${n.id.toUpperCase()}</strong></td>
                    <td style="font-size: 0.72rem; color: var(--text-muted);">${n.edge_device.split(' ')[0]}</td>
                    <td><span class="status-pill status-pill-safe" style="padding: 1px 6px; font-size: 0.65rem;">ONLINE</span></td>
                    <td><span class="status-pill ${n.camera_health === 'OPTIMAL' ? 'status-pill-safe' : 'status-pill-risk'}" style="padding: 1px 6px; font-size: 0.65rem;">${n.camera_health}</span></td>
                    <td><strong style="color: var(--accent-deep);">${n.lora_rssi} dBm</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  initConfidenceChart(container.querySelector('#confidence-chart'));
}

function initConfidenceChart(canvasEl) {
  if (!canvasEl || typeof Chart === 'undefined') return;
  if (confidenceChart) {
    confidenceChart.destroy();
  }

  const ctx = canvasEl.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, 'rgba(34, 167, 96, 0.4)');
  gradient.addColorStop(1, 'rgba(34, 167, 96, 0.02)');

  confidenceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
      datasets: [
        {
          label: 'Multimodal Fusion Confidence (%)',
          data: [96.2, 97.5, 95.8, 93.4, 98.2, 97.9, 96.8],
          borderColor: '#22a760',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#22a760'
        },
        {
          label: 'Acceptable Confidence Floor (85%)',
          data: [85, 85, 85, 85, 85, 85, 85],
          borderColor: 'rgba(224, 139, 0, 0.6)',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 75,
          max: 100,
          ticks: {
            callback: v => `${v}%`,
            color: '#48667c',
            font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" }
          },
          grid: { color: 'rgba(10, 110, 168, 0.08)' }
        },
        x: {
          ticks: {
            color: '#48667c',
            font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" }
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
            color: '#243e52'
          }
        }
      }
    }
  });
}
