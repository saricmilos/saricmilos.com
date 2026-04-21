"use client";

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  life: number;
  maxLife: number;
}

interface CassiopeiaStarsProps {
  className?: string;
}

const CassiopeiaStars: React.FC<CassiopeiaStarsProps> = ({
  className = 'absolute inset-0 w-full h-full',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const stars: Star[] = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const cassiopeia = [
      { x: canvas.width * 0.65, y: canvas.height * 0.25 },
      { x: canvas.width * 0.7, y: canvas.height * 0.3 },
      { x: canvas.width * 0.75, y: canvas.height * 0.25 },
      { x: canvas.width * 0.8, y: canvas.height * 0.32 },
      { x: canvas.width * 0.85, y: canvas.height * 0.27 },
    ];

    const shootingStars: ShootingStar[] = [];
    let animationFrame = 0;
    let time = 0;
    let lastTime = performance.now();
    let nextSpawnIn = 0.5;
    let spawnTimer = 0;

    const spawnShootingStar = () => {
      const sx = -10;
      const sy = Math.random() * canvas.height * 0.5;
      const targetX = canvas.width * (0.85 + Math.random() * 0.2);
      const targetY = canvas.height * (0.4 + Math.random() * 0.5);
      const dx = targetX - sx;
      const dy = targetY - sy;
      const angle = Math.atan2(dy, dx);

      shootingStars.push({
        x: sx,
        y: sy,
        angle,
        speed: 600 + Math.random() * 500,
        length: 80 + Math.random() * 120,
        life: 0,
        maxLife: 1.2 + Math.random() * 0.6,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      const darkMode = isDarkMode();

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        if (darkMode) {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        } else {
          ctx.fillStyle = `rgba(100, 116, 139, ${star.opacity * twinkle * 0.8})`;
        }
        ctx.fill();
      });

      cassiopeia.forEach((star, index) => {
        const pulse = Math.sin(time * 2 + index) * 0.2 + 0.8;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 3 * pulse, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 15);
        if (darkMode) {
          gradient.addColorStop(0, `rgba(147, 197, 253, ${0.9 * pulse})`);
          gradient.addColorStop(0.5, `rgba(147, 197, 253, ${0.4 * pulse})`);
          gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
        } else {
          gradient.addColorStop(0, `rgba(59, 130, 246, ${0.9 * pulse})`);
          gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.4 * pulse})`);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        if (darkMode) {
          ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
        } else {
          ctx.fillStyle = `rgba(37, 99, 235, ${pulse})`;
        }
        ctx.fill();
      });

      ctx.strokeStyle = darkMode ? 'rgba(147, 197, 253, 0.4)' : 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      cassiopeia.forEach((star, index) => {
        if (index === 0) {
          ctx.moveTo(star.x, star.y);
        } else {
          ctx.lineTo(star.x, star.y);
        }
      });
      ctx.stroke();

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      spawnTimer += dt;
      if (spawnTimer >= nextSpawnIn) {
        spawnShootingStar();
        spawnTimer = 0;
        nextSpawnIn = 3 + Math.random() * 5;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life += dt;
        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const progress = s.life / s.maxLife;
        const eased = 1 - (1 - progress) * (1 - progress);
        const totalDist = s.speed * s.maxLife;
        const dist = totalDist * eased;
        const headX = s.x + Math.cos(s.angle) * dist;
        const headY = s.y + Math.sin(s.angle) * dist;

        let alpha: number;
        if (progress < 0.15) {
          alpha = progress / 0.15;
        } else if (progress < 0.7) {
          alpha = 1;
        } else {
          alpha = 1 - (progress - 0.7) / 0.3;
        }
        alpha = Math.max(0, Math.min(1, alpha));

        const tailX = headX - Math.cos(s.angle) * s.length;
        const tailY = headY - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        if (darkMode) {
          grad.addColorStop(0, 'rgba(147, 197, 253, 0)');
          grad.addColorStop(0.6, `rgba(180, 210, 255, ${0.5 * alpha})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${0.95 * alpha})`);
        } else {
          grad.addColorStop(0, 'rgba(59, 130, 246, 0)');
          grad.addColorStop(0.6, `rgba(100, 150, 240, ${0.5 * alpha})`);
          grad.addColorStop(1, `rgba(37, 99, 235, ${0.95 * alpha})`);
        }
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        const glowR = 6 + (1 - progress) * 4;
        const glowGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, glowR);
        if (darkMode) {
          glowGrad.addColorStop(0, `rgba(220, 235, 255, ${0.9 * alpha})`);
          glowGrad.addColorStop(0.4, `rgba(147, 197, 253, ${0.4 * alpha})`);
          glowGrad.addColorStop(1, 'rgba(147, 197, 253, 0)');
        } else {
          glowGrad.addColorStop(0, `rgba(220, 235, 255, ${0.8 * alpha})`);
          glowGrad.addColorStop(0.4, `rgba(59, 130, 246, ${0.35 * alpha})`);
          glowGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }
        ctx.beginPath();
        ctx.arc(headX, headY, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(headX, headY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
};

export default CassiopeiaStars;
