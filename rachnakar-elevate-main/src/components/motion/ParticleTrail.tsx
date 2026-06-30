import { useEffect, useRef } from "react";

/**
 * Carved-wood sawdust — premium particle system.
 * Warm copper / walnut / cream flecks with realistic gravity, drift, and
 * irregular shapes. Reacts to cursor velocity and touch pressure.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  shape: 0 | 1 | 2; // 0 chip, 1 fleck, 2 mote
  drag: number;
  gravity: number;
};

// Warm sawdust palette — copper highlights, walnut shavings, cream motes
const PALETTE = [
  "#E8B98A", // sanded oak
  "#C98A4B", // copper shaving
  "#8B5A2B", // walnut chip
  "#F5D9B0", // cream dust
  "#D97A3C", // amber ember
  "#6B3F1D", // deep walnut
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function ParticleTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cores =
      (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
    // Touch gets a bigger budget — sawdust trails should feel generous
    const BUDGET = fine ? (cores >= 8 ? 260 : 180) : 220;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    let lastX = 0,
      lastY = 0,
      lastT = 0;

    function spawn(x: number, y: number, count: number, intensity = 1, dirX = 0, dirY = 0) {
      for (let i = 0; i < count; i++) {
        if (particles.length >= BUDGET) particles.shift();
        // Bias particle direction along inverse of motion (like dust trailing behind a tool)
        const angle = Math.atan2(-dirY, -dirX) + rand(-0.9, 0.9);
        const speed = rand(0.3, 1.6) * intensity;
        const shape = (Math.random() < 0.5 ? 2 : Math.random() < 0.7 ? 1 : 0) as 0 | 1 | 2;
        particles.push({
          x: x + rand(-3, 3),
          y: y + rand(-3, 3),
          vx: Math.cos(angle) * speed + rand(-0.2, 0.2),
          vy: Math.sin(angle) * speed - rand(0.4, 1.0) * intensity, // initial upward kick like fresh shaving
          life: 0,
          max: rand(1200, 2400),
          size: shape === 0 ? rand(2.2, 4.2) : shape === 1 ? rand(1.4, 2.6) : rand(0.8, 1.6),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.08, 0.08),
          color: PALETTE[(Math.random() * PALETTE.length) | 0],
          shape,
          drag: shape === 2 ? 0.992 : 0.978,
          gravity: shape === 0 ? 0.045 : shape === 1 ? 0.028 : 0.012,
        });
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastX,
        dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) return;
      const dt = Math.max(8, now - lastT);
      const velocity = dist / dt;
      const isTouch = e.pointerType === "touch";
      const baseN = isTouch ? 4 : 2;
      const n = Math.min(isTouch ? 10 : 7, baseN + Math.floor(velocity * 5));
      spawn(e.clientX, e.clientY, n, Math.min(1.6, 0.7 + velocity * 0.35), dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };

    const onPointerDown = (e: PointerEvent) => {
      // Burst on press — like the tool biting into wood
      spawn(e.clientX, e.clientY, e.pointerType === "touch" ? 30 : 18, 1.7);
    };

    const onTouchMove = (e: TouchEvent) => {
      for (const t of Array.from(e.touches)) spawn(t.clientX, t.clientY, 5, 1.1);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    if (!fine) window.addEventListener("touchmove", onTouchMove, { passive: true });

    let raf = 0;
    let prev = performance.now();
    const frame = (t: number) => {
      const dt = Math.min(48, t - prev);
      prev = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.max) {
          particles.splice(i, 1);
          continue;
        }
        const k = p.life / p.max;
        // Settling physics
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        // Subtle horizontal drift like air currents
        p.vx += Math.sin((p.life + p.rot * 100) * 0.003) * 0.015;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const alpha = k < 0.15 ? k / 0.15 : (1 - k) * 0.95;
        const sz = p.size * (1 - k * 0.35);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        if (p.shape === 0) {
          // Chip — angular flake, solid + glow
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(-sz, -sz * 0.4);
          ctx.lineTo(sz, -sz * 0.6);
          ctx.lineTo(sz * 0.7, sz * 0.5);
          ctx.lineTo(-sz * 0.8, sz * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = alpha * 0.35;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = sz * 2;
          ctx.fill();
        } else if (p.shape === 1) {
          // Fleck — small rectangular shaving
          ctx.fillStyle = p.color;
          ctx.fillRect(-sz, -sz * 0.3, sz * 2, sz * 0.6);
        } else {
          // Mote — soft glowing dust
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 2.4);
          g.addColorStop(0, p.color);
          g.addColorStop(0.5, p.color + "66");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, sz * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return <canvas ref={ref} className="rk-particle-canvas" aria-hidden />;
}
