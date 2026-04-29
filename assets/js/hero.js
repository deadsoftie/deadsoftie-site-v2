// Particle hero — "deadsoftie" sampled to a 4px grid
// Left half: --accent (blue), right half: --accent-2 (red)
(function () {
  const canvas = document.getElementById('hero-particle-canvas');
  const wrapper = document.getElementById('hero-canvas');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  const style = getComputedStyle(document.documentElement);
  const blue = style.getPropertyValue('--accent').trim() || '#3b82f6';
  const red  = style.getPropertyValue('--accent-2').trim() || '#e84a3c';

  let W, H, particles, mouse = { x: -999, y: -999 };
  const GRID = 4, REPEL = 80, SPRING = 0.06, DAMP = 0.78;

  function resize() {
    W = canvas.width  = wrapper.offsetWidth;
    H = canvas.height = wrapper.offsetHeight;
    init();
  }

  function sampleText() {
    const off = document.createElement('canvas');
    off.width  = W;
    off.height = H;
    const c = off.getContext('2d');
    const fs = Math.min(H * 0.65, W / 5.5);
    c.font = `700 ${fs}px "Inter Tight", sans-serif`;
    c.fillStyle = '#fff';
    c.textAlign  = 'center';
    c.textBaseline = 'middle';
    c.fillText('deadsoftie', W / 2, H / 2);
    const px = c.getImageData(0, 0, W, H).data;
    const pts = [];
    for (let y = 0; y < H; y += GRID) {
      for (let x = 0; x < W; x += GRID) {
        const i = (y * W + x) * 4;
        if (px[i + 3] > 128) pts.push({ ox: x, oy: y });
      }
    }
    return pts;
  }

  function init() {
    const pts = sampleText();
    const midX = W / 2;
    particles = pts.map(function (p) {
      return {
        ox: p.ox, oy: p.oy,
        x: Math.random() * W, y: Math.random() * H,
        vx: 0, vy: 0,
        color: p.ox < midX ? blue : red,
      };
    });
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      // Spring toward origin
      let fx = (p.ox - p.x) * SPRING;
      let fy = (p.oy - p.y) * SPRING;

      // Repel from mouse
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL && dist > 0) {
        const force = (REPEL - dist) / REPEL * 3;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }

      p.vx = (p.vx + fx) * DAMP;
      p.vy = (p.vy + fy) * DAMP;
      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(p.x, p.y, GRID - 1, GRID - 1);
    });
    requestAnimationFrame(tick);
  }

  wrapper.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  wrapper.addEventListener('mouseleave', function () { mouse.x = -999; mouse.y = -999; });

  resize();
  window.addEventListener('resize', resize);
  tick();
})();
