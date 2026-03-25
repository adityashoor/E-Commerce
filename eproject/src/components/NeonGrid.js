import { useEffect, useRef } from 'react';

export default function NeonGrid() {
  const ref = useRef(null);

  useEffect(() => {
    let raf = 0;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (t) => {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle scanline
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }

      // Pulsating grid
      const cell = 32;
      const phase = t * 0.001;
      for (let x = 0; x < w; x += cell) {
        for (let y = 0; y < h; y += cell) {
          const d = Math.hypot(x - w * 0.5, y - h * 0.45);
          const pulse = 0.6 + 0.4 * Math.sin(phase * 2 + d * 0.02);
          ctx.strokeStyle = `rgba(0,255,133,${0.06 * pulse})`;
          ctx.strokeRect(x + 0.5, y + 0.5, cell, cell);
        }
      }

      // Glow dots
      for (let i = 0; i < 40; i++) {
        const rx = (i * 179 + t * 0.08) % w;
        const ry = (i * 97 + t * 0.05) % h;
        const alpha = 0.2 + 0.8 * Math.abs(Math.sin((t * 0.001) + i));
        ctx.fillStyle = `rgba(0,255,133,${0.15 * alpha})`;
        ctx.beginPath();
        ctx.arc(rx, ry, 2 + 2 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="fz-bg-canvas" aria-hidden />;
}
