/**
 * PravahAi Roadside Camera Edge Vision Simulator (cameraFeed.js)
 * Clean, high-contrast edge camera perspective with YOLOv8-nano AI object detection bounding boxes
 */

export class CameraFeedComponent {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl?.getContext('2d');
    this.waterHeight = 0.15;
    this.waterTarget = 0.15;
    this.animId = null;
    this.rainDrops = [];
    this.nodeState = 'SAFE';
    this.initRain();
    this.startLoop();
  }

  initRain() {
    this.rainDrops = [];
    for (let i = 0; i < 35; i++) {
      this.rainDrops.push({
        x: Math.random() * 480,
        y: Math.random() * 300,
        len: Math.random() * 10 + 6,
        speed: Math.random() * 7 + 10
      });
    }
  }

  setState(status, waterLevel) {
    this.nodeState = status;
    if (status === 'UNSAFE') {
      this.waterTarget = 0.72;
    } else if (status === 'AT_RISK') {
      this.waterTarget = 0.42;
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

    this.waterHeight += (this.waterTarget - this.waterHeight) * 0.04;

    // Sky & Horizon
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.45);

    // Overpass Structure
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, h * 0.42, w, 14);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, h * 0.45, w, 6);

    // Road Asphalt
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.46);
    ctx.lineTo(w * 0.65, h * 0.46);
    ctx.lineTo(w + 50, h);
    ctx.lineTo(-50, h);
    ctx.closePath();
    ctx.fill();

    // Road Curbs
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.46);
    ctx.lineTo(w * 0.33, h * 0.46);
    ctx.lineTo(-50, h);
    ctx.lineTo(-25, h);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w * 0.65, h * 0.46);
    ctx.lineTo(w * 0.67, h * 0.46);
    ctx.lineTo(w + 50, h);
    ctx.lineTo(w + 25, h);
    ctx.closePath();
    ctx.fill();

    // Lane Markings
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 16]);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.46);
    ctx.lineTo(w * 0.5, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Water Accumulation Layer
    const waterTopY = h - (this.waterHeight * h * 0.48);
    const waterGrad = ctx.createLinearGradient(0, waterTopY, 0, h);
    if (this.nodeState === 'UNSAFE') {
      waterGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
      waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0.45)');
    } else if (this.nodeState === 'AT_RISK') {
      waterGrad.addColorStop(0, 'rgba(15, 23, 42, 0.65)');
      waterGrad.addColorStop(1, 'rgba(14, 165, 233, 0.35)');
    } else {
      waterGrad.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
      waterGrad.addColorStop(1, 'rgba(56, 189, 248, 0.25)');
    }

    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, (waterTopY + h) / 2, w * 0.55, (h - waterTopY) / 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rain Streaks
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.4)';
    ctx.lineWidth = 1.2;
    this.rainDrops.forEach(drop => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 2, drop.y + drop.len);
      ctx.stroke();

      drop.y += drop.speed;
      drop.x -= 1.2;
      if (drop.y > h) {
        drop.y = 0;
        drop.x = Math.random() * (w + 20);
      }
    });

    // Computer Vision Bounding Box Overlay
    if (this.nodeState === 'UNSAFE') {
      const bx = w * 0.22, by = waterTopY - 8, bw = w * 0.56, bh = h - waterTopY + 6;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bx, by - 20, 190, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('INUNDATION: 31cm [IMPASSABLE]', bx + 6, by - 6);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(bx, by + bh - 18, 150, 18);
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('FLOW: 1.4 m/s (TURBULENT)', bx + 6, by + bh - 5);
    } else if (this.nodeState === 'AT_RISK') {
      const bx = w * 0.28, by = waterTopY - 4, bw = w * 0.44, bh = h - waterTopY;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(bx, by - 18, 170, 18);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('PONDING DETECTED: 14cm', bx + 6, by - 5);
    } else {
      const bx = w * 0.25, by = h * 0.52, bw = w * 0.5, bh = h * 0.4;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = '#10b981';
      ctx.fillRect(bx, by - 18, 150, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('LANE CLEAR | CONF: 97%', bx + 6, by - 5);
    }
  }
}
