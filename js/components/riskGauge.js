/**
 * PravahAi Risk Gauge Component (riskGauge.js)
 * Clean circular SVG donut gauge with glowing stroke and smooth number counter
 */

export class RiskGaugeComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.circumference = 2 * Math.PI * 85; // 534.07px
    this.currentVal = 0;
    this.targetVal = 0;
    this.animating = false;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="gauge-wrapper" style="position: relative; width: 200px; height: 200px; margin: 0 auto 10px;">
        <svg style="width: 100%; height: 100%; transform: rotate(-90deg);" viewBox="0 0 200 200">
          <defs>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="currentColor" flood-opacity="0.5"/>
            </filter>
          </defs>
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255, 255, 255, 0.07)" stroke-width="12" />
          <circle id="gauge-circle-progress" cx="100" cy="100" r="85" fill="none" stroke="var(--status-safe)" stroke-width="12"
            stroke-linecap="round"
            stroke-dasharray="${this.circumference}"
            stroke-dashoffset="${this.circumference}"
            style="transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease;" />
        </svg>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <span id="gauge-num-val" style="font-size: 2.8rem; font-weight: 800; line-height: 1; color: #ffffff; letter-spacing: -0.04em;">0%</span>
          <span id="gauge-status-label" class="status-pill status-pill-safe" style="margin-top: 6px;">
            <span class="status-dot status-dot-safe"></span>
            SAFE
          </span>
          <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 5px;">
            Basin Inundation Risk
          </span>
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

      let strokeColor = '#10b981';
      let statusClass = 'status-pill-safe';
      let dotClass = 'status-dot-safe';
      let labelText = 'SAFE';

      if (this.targetVal >= 75) {
        strokeColor = '#ef4444';
        statusClass = 'status-pill-unsafe';
        dotClass = 'status-dot-unsafe';
        labelText = 'UNSAFE';
      } else if (this.targetVal >= 45) {
        strokeColor = '#f59e0b';
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
