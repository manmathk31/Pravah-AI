/**
 * PravahAi Ambient Hydrological Matrix Canvas (waterCanvas.js)
 * High-tech bioluminescent aquatic flow-field with cursor tracking.
 * Disabled on smaller screens (<768px). Droplet/ripple click effects completely removed.
 */

export class WaterCanvas {
  constructor(canvasId = 'ambient-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.time = 0;
    this.pointer = { x: -1000, y: -1000, tx: -1000, ty: -1000, isDown: false };
    this.particles = [];
    this.animId = null;
    this.isRunning = false;

    this.init();
  }

  init() {
    window.addEventListener('resize', () => this.handleResize(), { passive: true });

    // If small screen, do not run canvas animation
    if (window.innerWidth < 768) {
      this.canvas.style.display = 'none';
      return;
    }

    this.resize();

    window.addEventListener('pointermove', (e) => {
      this.pointer.tx = e.clientX;
      this.pointer.ty = e.clientY;
    }, { passive: true });

    // Initialize glowing flow-field particles with dark oceanic & emerald palette
    const count = 56;
    const colors = ['#38bdf8', '#10b981', '#0d9488', '#0284c7', '#34d399'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        baseAlpha: Math.random() * 0.4 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    this.start();
  }

  handleResize() {
    if (window.innerWidth < 768) {
      this.stop();
      if (this.canvas) this.canvas.style.display = 'none';
    } else {
      if (this.canvas) this.canvas.style.display = 'block';
      this.resize();
      if (!this.isRunning) this.start();
    }
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.time += 0.012;

    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.09;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.09;

    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Deep midnight base
    ctx.clearRect(0, 0, w, h);

    // 1. Ambient Dynamic Oceanic Glow & Cursor Halo (Desktop only)
    if (this.pointer.x > 0 && this.pointer.y > 0) {
      const grad = ctx.createRadialGradient(this.pointer.x, this.pointer.y, 0, this.pointer.x, this.pointer.y, 380);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
      grad.addColorStop(0.35, 'rgba(16, 185, 129, 0.04)');
      grad.addColorStop(0.7, 'rgba(2, 132, 199, 0.015)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Bioluminescent Hydro-Current Waves (Deep oceanic blues & dark emeralds)
    const waves = [
      { y: h * 0.22, len: 0.0012, amp: 28, spd: 0.5, color: 'rgba(56, 189, 248, 0.035)' },
      { y: h * 0.50, len: 0.0018, amp: 38, spd: -0.4, color: 'rgba(16, 185, 129, 0.03)' },
      { y: h * 0.78, len: 0.0014, amp: 44, spd: 0.45, color: 'rgba(2, 132, 199, 0.035)' },
      { y: h * 0.92, len: 0.0024, amp: 22, spd: -0.6, color: 'rgba(13, 148, 136, 0.025)' }
    ];

    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 24) {
        const y = wave.y + Math.sin(x * wave.len + this.time * wave.spd) * wave.amp +
                          Math.cos(x * 0.0008 + this.time * 0.35) * (wave.amp * 0.5);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    });

    // 3. Luminous Constellation Nodes & Connecting Fibers
    const pLen = this.particles.length;
    for (let i = 0; i < pLen; i++) {
      const p = this.particles[i];

      // Distance to cursor
      const dx = p.x - this.pointer.x;
      const dy = p.y - this.pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repulsion/attraction aura
      if (dist < 160) {
        const force = (160 - dist) / 160;
        p.x += (dx / dist) * force * 1.3;
        p.y += (dy / dist) * force * 1.3;
      }

      // Connect nearby particles with subtle energy threads
      for (let j = i + 1; j < pLen; j++) {
        const p2 = this.particles[j];
        const pdist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pdist < 105) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const linkAlpha = (1 - pdist / 105) * 0.12;
          ctx.strokeStyle = `rgba(56, 189, 248, ${linkAlpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // Pulse alpha
      const currentAlpha = p.baseAlpha + Math.sin(this.time * 2 + p.pulseOffset) * 0.14;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, currentAlpha);
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Motion
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    }
  }
}
