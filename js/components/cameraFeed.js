/**
 * PravahAi Roadside Camera Edge Vision Simulator (cameraFeed.js)
 * Draws a real-time procedural edge camera view with AI object detection overlays.
 */

export class CameraFeedComponent {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl?.getContext('2d');
    this.waterHeight = 0.2; // 0.0 (dry) to 1.0 (deep flood)
    this.waterTarget = 0.2;
    this.animId = null;
    this.rainDrops = [];
    this.nodeState = 'SAFE';
    this.initRain();
    this.startLoop();
  }

  initRain() {
    this.rainDrops = [];
    for (let i = 0; i < 40; i++) {
      this.rainDrops.push({
        x: Math.random() * 400,
        y: Math.random() * 250,
        len: Math.random() * 12 + 8,
        speed: Math.random() * 8 + 12
      });
    }
  }

  setState(status, waterLevel) {
    this.nodeState = status;
    if (status === 'UNSAFE') {
      this.waterTarget = 0.75;
    } else if (status === 'AT_RISK') {
      this.waterTarget = 0.45;
    } else {
      this.waterTarget = 0.15;
    }
  }

  startLoop() {
    const loop = () => {
      this.draw();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  draw() {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.width = 480;
    const h = this.canvas.height = 300;
    const ctx = this.ctx;

    // Smooth water level transition
    this.waterHeight += (this.waterTarget - this.waterHeight) * 0.04;

    // 1. Sky & Distant Horizon
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    skyGrad.addColorStop(0, '#1a2e3b');
    skyGrad.addColorStop(1, '#3b5565');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.45);

    // Distant City / Bridge Outline
    ctx.fillStyle = '#223847';
    ctx.fillRect(40, h * 0.3, 80, h * 0.15);
    ctx.fillRect(140, h * 0.25, 60, h * 0.2);
    ctx.fillRect(220, h * 0.28, 120, h * 0.17);
    ctx.fillRect(360, h * 0.22, 90, h * 0.23);

    // Bridge Overpass Barrier
    ctx.fillStyle = '#4a606e';
    ctx.fillRect(0, h * 0.42, w, 16);
    ctx.fillStyle = '#2a3b45';
    ctx.fillRect(0, h * 0.45, w, 6);

    // 2. Road Perspective (Asphalt)
    ctx.fillStyle = '#1b252c';
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.46);
    ctx.lineTo(w * 0.65, h * 0.46);
    ctx.lineTo(w + 60, h);
    ctx.lineTo(-60, h);
    ctx.closePath();
    ctx.fill();

    // Road Curbs / Sidewalks
    ctx.fillStyle = '#43545f';
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.46);
    ctx.lineTo(w * 0.32, h * 0.46);
    ctx.lineTo(-60, h);
    ctx.lineTo(-30, h);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w * 0.65, h * 0.46);
    ctx.lineTo(w * 0.68, h * 0.46);
    ctx.lineTo(w + 60, h);
    ctx.lineTo(w + 30, h);
    ctx.closePath();
    ctx.fill();

    // Lane Markings (Dashed)
    ctx.strokeStyle = '#d5e68d';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 18]);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.46);
    ctx.lineTo(w * 0.5, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Water Inundation Layer (Dynamic Height & Murky Reflections)
    const waterTopY = h - (this.waterHeight * h * 0.48);
    const waterGrad = ctx.createLinearGradient(0, waterTopY, 0, h);
    if (this.nodeState === 'UNSAFE') {
      waterGrad.addColorStop(0, 'rgba(38, 70, 83, 0.75)');
      waterGrad.addColorStop(1, 'rgba(18, 38, 48, 0.95)');
    } else if (this.nodeState === 'AT_RISK') {
      waterGrad.addColorStop(0, 'rgba(42, 110, 130, 0.6)');
      waterGrad.addColorStop(1, 'rgba(20, 60, 75, 0.85)');
    } else {
      waterGrad.addColorStop(0, 'rgba(50, 140, 170, 0.3)');
      waterGrad.addColorStop(1, 'rgba(30, 90, 120, 0.5)');
    }

    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, (waterTopY + h) / 2, w * 0.55, (h - waterTopY) / 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Water Ripple Highlights
    const time = Date.now() * 0.003;
    ctx.strokeStyle = 'rgba(180, 235, 255, 0.45)';
    ctx.lineWidth = 1.5;
    for (let r = 0; r < 3; r++) {
      const rippleY = waterTopY + 15 + r * 22 + Math.sin(time + r) * 4;
      if (rippleY < h) {
        ctx.beginPath();
        ctx.moveTo(w * 0.25 - r * 20, rippleY);
        ctx.quadraticCurveTo(w * 0.5, rippleY + Math.cos(time + r) * 3, w * 0.75 + r * 20, rippleY);
        ctx.stroke();
      }
    }

    // 4. Rain Particles
    ctx.strokeStyle = 'rgba(200, 230, 255, 0.45)';
    ctx.lineWidth = 1.2;
    this.rainDrops.forEach(drop => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 3, drop.y + drop.len);
      ctx.stroke();

      drop.y += drop.speed;
      drop.x -= 1.5;
      if (drop.y > h) {
        drop.y = 0;
        drop.x = Math.random() * (w + 40);
      }
    });

    // 5. Edge-AI Vision Bounding Boxes
    if (this.nodeState === 'UNSAFE') {
      // Critical Red Bounding Box
      const bx = w * 0.22, by = waterTopY - 10, bw = w * 0.56, bh = h - waterTopY + 8;
      ctx.strokeStyle = '#ff3344';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = 'rgba(255, 51, 68, 0.85)';
      ctx.fillRect(bx, by - 22, 230, 22);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('⚠ INUNDATION: 31cm [IMPASSABLE]', bx + 6, by - 7);

      // Detection Tag
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(bx, by + bh - 20, 180, 20);
      ctx.fillStyle = '#ff6677';
      ctx.fillText('FLOW VELOCITY: 1.4 m/s', bx + 6, by + bh - 6);
    } else if (this.nodeState === 'AT_RISK') {
      // Warning Amber Bounding Box
      const bx = w * 0.28, by = waterTopY - 5, bw = w * 0.44, bh = h - waterTopY;
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = 'rgba(255, 170, 0, 0.9)';
      ctx.fillRect(bx, by - 20, 200, 20);
      ctx.fillStyle = '#111';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('⚡ PONDING DETECTED: 14cm', bx + 6, by - 6);
    } else {
      // Safe Green Bounding Box
      const bx = w * 0.25, by = h * 0.52, bw = w * 0.5, bh = h * 0.4;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = 'rgba(34, 197, 94, 0.85)';
      ctx.fillRect(bx, by - 18, 170, 18);
      ctx.fillStyle = '#052e16';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('✓ ROAD CLEAR | CONF: 97%', bx + 6, by - 5);
    }
  }
}
