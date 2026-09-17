/**
 * PravahAi Risk Gauge Component (riskGauge.js)
 * Circular SVG gauge with animated counter and status color interpolation
 */

export class RiskGaugeComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.circumference = 2 * Math.PI * 90; // 565.48px
    this.currentVal = 0;
    this.targetVal = 0;
    this.animating = false;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="gauge-wrapper">
        <svg class="gauge-svg" viewBox="0 0 200 200">
          <circle class="gauge-bg-circle" cx="100" cy="100" r="90" />
          <circle id="gauge-circle-progress" class="gauge-progress-circle" cx="100" cy="100" r="90"
            stroke-dasharray="${this.circumference}"
            stroke-dashoffset="${this.circumference}" />
        </svg>
        <div class="gauge-center-content">
          <span id="gauge-num-val" class="gauge-value">0%</span>
          <span id="gauge-status-label" class="status-pill status-pill-safe" style="margin-top: 6px;">
            <span class="status-dot status-dot-safe"></span>
            NORMAL
          </span>
          <span class="gauge-label">System Nowcast Risk</span>
        </div>
      </div>
    `;

    this.progressCircle = this.container.querySelector('#gauge-circle-progress');
    this.numValEl = this.container.querySelector('#gauge-num-val');
    this.statusLabelEl = this.container.querySelector('#gauge-status-label');
  }

  update(percentage) {
    this.targetVal = Math.max(0, Math.min(100, Math.round(percentage)));
    const offset = this.circumference - (this.targetVal / 100) * this.circumference;
    if (this.progressCircle) {
      this.progressCircle.style.strokeDashoffset = offset;

      // Color selection based on risk tiers
      let strokeColor = 'var(--status-safe)';
      let statusClass = 'status-pill-safe';
      let dotClass = 'status-dot-safe';
      let labelText = 'SAFE';

      if (this.targetVal >= 75) {
        strokeColor = 'var(--status-unsafe)';
        statusClass = 'status-pill-unsafe';
        dotClass = 'status-dot-unsafe';
        labelText = 'UNSAFE';
      } else if (this.targetVal >= 45) {
        strokeColor = 'var(--status-risk)';
        statusClass = 'status-pill-risk';
        dotClass = 'status-dot-risk';
        labelText = 'AT RISK';
      }

      this.progressCircle.style.stroke = strokeColor;

      if (this.statusLabelEl) {
        this.statusLabelEl.className = `status-pill ${statusClass}`;
        this.statusLabelEl.innerHTML = `<span class="status-dot ${dotClass}"></span>${labelText}`;
      }
    }

    this.animateNumber();
  }

  animateNumber() {
    if (this.animating) return;
    this.animating = true;

    const step = () => {
      if (this.currentVal < this.targetVal) {
        this.currentVal = Math.min(this.targetVal, this.currentVal + Math.ceil((this.targetVal - this.currentVal) / 8));
      } else if (this.currentVal > this.targetVal) {
        this.currentVal = Math.max(this.targetVal, this.currentVal - Math.ceil((this.currentVal - this.targetVal) / 8));
      }

      if (this.numValEl) {
        this.numValEl.textContent = `${this.currentVal}%`;
      }

      if (this.currentVal !== this.targetVal) {
        requestAnimationFrame(step);
      } else {
        this.animating = false;
      }
    };

    requestAnimationFrame(step);
  }
}
