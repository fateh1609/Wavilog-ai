
import React, { useEffect, useRef } from 'react';

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const particles: Particle[] = [];
    const particleCount = 120;

    class Particle {
      x!: number;
      y!: number;
      z!: number;
      pz!: number;
      color!: string;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = Math.random() * width;
        this.pz = this.z;
        this.color = Math.random() > 0.5 ? '#00ffff' : '#a855f7';
      }

      update() {
        this.pz = this.z;
        this.z -= 4.5; // Speed of moving outwards

        // Mouse influence
        const dx = (mouseX - width / 2) * 0.05;
        const dy = (mouseY - height / 2) * 0.05;
        this.x += dx;
        this.y += dy;

        if (this.z <= 1) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const sx = (this.x / this.z) * (width / 2) + width / 2;
        const sy = (this.y / this.z) * (height / 2) + height / 2;

        const px = (this.x / this.pz) * (width / 2) + width / 2;
        const py = (this.y / this.pz) * (height / 2) + height / 2;

        const size = (1 - this.z / width) * 2;
        const opacity = (1 - this.z / width) * 0.4;

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = size;
        ctx.globalAlpha = opacity;
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      init();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    init();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 mix-blend-screen"
      style={{ filter: 'blur(1px)' }}
    />
  );
};

export default HeroBackground;
