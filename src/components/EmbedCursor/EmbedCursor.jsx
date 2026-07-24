import { useEffect, useRef } from 'react';

const SPAWN_CHANCE = 0.5; // chance de spawnar partícula a cada movimento (ajuste à vontade)
const PARTICLE_LIFE = 1000; // ms
const MAX_PARTICLES = 150; // teto de segurança

export default function EmberCursor() {
const canvasRef = useRef(null);

useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;

    function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // spawna baseado na distância percorrida, não só em "todo evento"
    // evita rajada de partículas quando o mouse anda pouco (movimento lento)
    const dx = mouseX - lastX;
    const dy = mouseY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 4 && Math.random() < SPAWN_CHANCE && particles.length < MAX_PARTICLES) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.6;

        particles.push({
        x: mouseX,
        y: mouseY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3, // leve tendência de subir
        size: Math.random() * 2 + 2,
        born: performance.now(),
        });
    }

    lastX = mouseX;
    lastY = mouseY;
    }

    function draw(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((p) => {
        const age = now - p.born;
        if (age >= PARTICLE_LIFE) return false;

        const t = age / PARTICLE_LIFE; // 0 -> 1
        p.x += p.vx;
        p.y += p.vy;

        const opacity = 1 - t;
        const scale = 1 - t * 0.9;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 202, 80, ${opacity})`;
        ctx.shadowColor = '#ff6b00';
        ctx.shadowBlur = 8;
        ctx.fill();

        return true;
    });

    animationId = requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', handleMouseMove);
    animationId = requestAnimationFrame(draw);

    return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
    };
}, []);

return (
    <canvas
    ref={canvasRef}
    aria-hidden="true"
    style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
    }}
    />
);
}