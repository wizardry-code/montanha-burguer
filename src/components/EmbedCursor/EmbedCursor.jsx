import { useEffect, useRef } from 'react';

// ============================================
// PALETA DE CORES — escolha uma combinação pelo nome
// ============================================

const EMBER_PALETTES = {
dourado: { core: '#f2ca50', edge: '#ff6b00' },
fogoIntenso: { core: '#ffb347', edge: '#ff2d00' },
azulMagico: { core: '#7fd8ff', edge: '#0066ff' },
roxoArcano: { core: '#d9a6ff', edge: '#7c3aed' },
verdeVeneno: { core: '#9dffb0', edge: '#0f9b3f' },
gelo: { core: '#e6f9ff', edge: '#5ec8e0' },
sangue: { core: '#ff8080', edge: '#8b0000' },
espectral: { core: '#e0e0ff', edge: '#5a4fcf' },
};

const EMBER_PALETTE_KEY = 'espectral'; // padrão: 'dourado' — troque pela chave desejada acima

// ============================================
// OUTRAS PROPRIEDADES MODIFICÁVEIS
// ============================================

const SPAWN_CHANCE = 0.5;    // padrão: 0.5
const PARTICLE_LIFE = 1000;  // padrão: 1000 (ms)
const MAX_PARTICLES = 150;   // padrão: 150

// ============================================

function hexToRgbString(hex) {
const clean = hex.replace('#', '');
const r = parseInt(clean.substring(0, 2), 16);
const g = parseInt(clean.substring(2, 4), 16);
const b = parseInt(clean.substring(4, 6), 16);
return `${r}, ${g}, ${b}`;
}

function createEmberSprite() {
const size = 32;
const spriteCanvas = document.createElement('canvas');
spriteCanvas.width = size;
spriteCanvas.height = size;
const sctx = spriteCanvas.getContext('2d');

const palette = EMBER_PALETTES[EMBER_PALETTE_KEY] || EMBER_PALETTES.dourado;
const coreRgb = hexToRgbString(palette.core);
const edgeRgb = hexToRgbString(palette.edge);

const gradient = sctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
);
gradient.addColorStop(0, `rgba(${coreRgb}, 1)`);
gradient.addColorStop(0.4, `rgba(${coreRgb}, 0.6)`);
gradient.addColorStop(1, `rgba(${edgeRgb}, 0)`);

sctx.fillStyle = gradient;
sctx.fillRect(0, 0, size, size);

return spriteCanvas;
}

export default function EmberCursor() {
const canvasRef = useRef(null);

useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const emberSprite = createEmberSprite();

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
        vy: Math.sin(angle) * speed - 0.3,
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

        const t = age / PARTICLE_LIFE;
        p.x += p.vx;
        p.y += p.vy;

        const opacity = 1 - t;
        const scale = 1 - t * 0.9;
        const drawSize = p.size * scale * 2;

        ctx.globalAlpha = opacity;
        ctx.drawImage(
        emberSprite,
        p.x - drawSize / 2,
        p.y - drawSize / 2,
        drawSize,
        drawSize
        );
        ctx.globalAlpha = 1;

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