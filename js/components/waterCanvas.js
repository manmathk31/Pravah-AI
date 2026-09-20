/**
 * PravahAi Ambient Hydrological Matrix Canvas (waterCanvas.js)
 * High-tech bioluminescent aquatic flow-field with cursor tracking and interactive ripple physics.
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
    this.ripples = [];
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    window.addEventListener('pointermove', (e) => {
      this.pointer.tx = e.clientX;
      this.pointer.ty = e.clientY;
    }, { passive: true });

    // Click to generate glowing water shockwave / pulse
    window.addEventListener('pointerdown', (e) => {
      this.createRipple(e.clientX, e.clientY);
    }, { passive: true });

    // Initialize glowing flow-field particles
    // Initialize glowing flow-field particles with dark oceanic & emerald palette
    const count = window.innerWidth < 768 ? 32 : 64;
    const colors = ['#38bdf8', '#10b981', '#0d9488', '#0284c7', '#34d399'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.35 - 0.15,
        baseAlpha: Math.random() * 0.45 + 0.25,
        pulseOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    this.loop();
  }

  createRipple(x, y) {
    this.ripples.push({
      x,
      y,
      radius: 6,
      maxRadius: Math.min(this.width, this.height) * 0.5,
      alpha: 0.75,
      speed: 4.8,
      color: Math.random() > 0.4 ? '#38bdf8' : '#10b981'
    });
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  loop() {
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

    // 1. Ambient Dynamic Oceanic Glow & Cursor Halo
    if (this.pointer.x > 0 && this.pointer.y > 0) {
      const grad = ctx.createRadialGradient(this.pointer.x, this.pointer.y, 0, this.pointer.x, this.pointer.y, 420);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      grad.addColorStop(0.35, 'rgba(16, 185, 129, 0.05)');
      grad.addColorStop(0.7, 'rgba(2, 132, 199, 0.02)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Bioluminescent Hydro-Current Waves (Deep oceanic blues & dark emeralds)
    const waves = [
      { y: h * 0.22, len: 0.0012, amp: 32, spd: 0.6, color: 'rgba(56, 189, 248, 0.04)' },
      { y: h * 0.50, len: 0.0018, amp: 44, spd: -0.45, color: 'rgba(16, 185, 129, 0.035)' },
      { y: h * 0.78, len: 0.0014, amp: 52, spd: 0.55, color: 'rgba(2, 132, 199, 0.045)' },
      { y: h * 0.92, len: 0.0024, amp: 26, spd: -0.7, color: 'rgba(13, 148, 136, 0.03)' }
    ];

    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 20) {
        const y = wave.y + Math.sin(x * wave.len + this.time * wave.spd) * wave.amp +
                          Math.cos(x * 0.0008 + this.time * 0.35) * (wave.amp * 0.5);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    });

    // 3. Interactive Sonar Shockwave Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color === '#10b981'
        ? `rgba(16, 185, 129, ${r.alpha})`
        : `rgba(56, 189, 248, ${r.alpha})`;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Echo ring
      if (r.radius > 30) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius - 20, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(14, 165, 233, ${r.alpha * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      r.radius += r.speed;
      r.alpha -= 0.014;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }

    // 4. Luminous Constellation Nodes & Connecting Fibers
    const pLen = this.particles.length;
    for (let i = 0; i < pLen; i++) {
      const p = this.particles[i];

      // Distance to cursor
      const dx = p.x - this.pointer.x;
      const dy = p.y - this.pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repulsion/attraction aura
      if (dist < 180) {
        const force = (180 - dist) / 180;
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      }

      // Connect nearby particles with subtle energy threads
      for (let j = i + 1; j < pLen; j++) {
        const p2 = this.particles[j];
        const pdist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pdist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const linkAlpha = (1 - pdist / 110) * 0.14;
          ctx.strokeStyle = `rgba(56, 189, 248, ${linkAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Pulse alpha
      const currentAlpha = p.baseAlpha + Math.sin(this.time * 2 + p.pulseOffset) * 0.15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, currentAlpha);
      ctx.shadowBlur = 10;
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
