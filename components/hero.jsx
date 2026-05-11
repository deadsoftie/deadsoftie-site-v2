// Animated hero — particle decay of the word "deadsoftie"
const Hero = () => {
  const canvasRef = React.useRef(null);
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // sample word into points
    const r = c.getBoundingClientRect();
    const off = document.createElement("canvas");
    off.width = r.width;
    off.height = r.height;
    const octx = off.getContext("2d");
    octx.fillStyle = "#fff";
    octx.font = "500 96px Inter Tight, system-ui, sans-serif";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.letterSpacing = "-3px";
    octx.fillText("deadsoftie", r.width / 2, r.height / 2);
    const img = octx.getImageData(0, 0, r.width, r.height).data;
    const points = [];
    const step = 4;
    for (let y = 0; y < r.height; y += step) {
      for (let x = 0; x < r.width; x += step) {
        const i = (y * r.width + x) * 4;
        if (img[i + 3] > 128) {
          points.push({
            x,
            y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
            seed: Math.random(),
          });
        }
      }
    }

    let mouse = { x: -1000, y: -1000 };
    const onMove = (e) => {
      const rect = c.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);

    let raf;
    let t = 0;
    // resolve accents once
    const resolve = (v) => {
      const probe = document.createElement("div");
      probe.style.color =
        getComputedStyle(document.documentElement).getPropertyValue(v) ||
        "rgb(140,180,235)";
      document.body.appendChild(probe);
      const m = getComputedStyle(probe).color.match(/\d+/g);
      document.body.removeChild(probe);
      return m
        ? [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])]
        : [140, 180, 235];
    };
    let cAccent = resolve("--accent");
    let cAccent2 = resolve("--accent-2");
    const cFg = [220, 220, 225];
    // re-resolve every 30 frames so tweaks are reflected live
    let frame = 0;
    const tick = () => {
      t += 0.016;
      if (++frame % 30 === 0) {
        cAccent = resolve("--accent");
        cAccent2 = resolve("--accent-2");
      }
      ctx.clearRect(0, 0, r.width, r.height);
      // word midpoint to split blue/red
      const midX = r.width / 2;
      for (const p of points) {
        // mouse repel
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 80 * 80) {
          const d = Math.sqrt(d2) || 1;
          const f = (80 - d) / 80;
          p.vx += (dx / d) * f * 0.9;
          p.vy += (dy / d) * f * 0.9;
        }
        // ambient drift
        p.vx += Math.sin(t * 0.6 + p.seed * 9) * 0.005;
        p.vy += Math.cos(t * 0.5 + p.seed * 11) * 0.005;
        // spring back
        p.vx += (p.ox - p.x) * 0.012;
        p.vy += (p.oy - p.y) * 0.012;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        const dist = Math.hypot(p.x - p.ox, p.y - p.oy);
        const heat = Math.min(1, dist / 30);
        // pick accent based on origin x — left half blue, right half red
        const acc = p.ox < midX ? cAccent : cAccent2;
        const cr = Math.round(acc[0] * heat + cFg[0] * (1 - heat));
        const cg = Math.round(acc[1] * heat + cFg[1] * (1 - heat));
        const cb = Math.round(acc[2] * heat + cFg[2] * (1 - heat));
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.85})`;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  React.useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="hero-canvas" style={{ marginTop: 14 }}>
      <div className="hero-grid" />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 14,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--muted)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          className="dot pulse"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "inline-block",
          }}
        />
        <span>hover_to_disturb()</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 18,
          top: 14,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        {now.toISOString().slice(0, 19).replace("T", " ")} UTC
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 14,
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--muted-2, #666)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        ~/notes/2026 · 47 essays · 132 notes · 18 papers · 7 projects
      </div>
    </div>
  );
};

window.Hero = Hero;
