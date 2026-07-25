import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SectionCardapio.module.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

const currentFrame = (index) =>
`${import.meta.env.BASE_URL}frames/frame_${(index + 1).toString().padStart(4, '0')}.webp`;

export default function SectionCardapio() {
const containerRef = useRef(null);
const canvasRef = useRef(null);
const [imagesLoaded, setImagesLoaded] = useState(false);
const imagesRef = useRef([]);
// Ref espelhando o state, pra usar dentro do onUpdate sem closure velha
// e sem precisar recriar o ScrollTrigger toda vez que imagesLoaded mudar.
const imagesLoadedRef = useRef(false);

useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 1920;
    canvas.height = 1080;

    const sequence = { frame: 0 };

    const render = () => {
    const img = imagesRef.current[sequence.frame];
    if (!img || !img.complete) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
    );
    };

    const trigger = ScrollTrigger.create({
    trigger: containerRef.current,
    start: 'top top',
    end: '+=300%',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
        // Enquanto os frames não chegaram, não tem o que desenhar.
        if (!imagesLoadedRef.current) return;

        sequence.frame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(self.progress * TOTAL_FRAMES)
        );
        render();
    },
    });

    const preloadImages = () => {
    let loadedCount = 0;
    const loadedImages = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
        loadedCount++;
        if (i === 0) render(); // mostra o primeiro frame assim que possível
        if (loadedCount === TOTAL_FRAMES) {
            imagesLoadedRef.current = true;
            setImagesLoaded(true);
            render(); // garante que o frame correspondente ao progresso atual apareça
        }
        };
        loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
    };


    let preloadTrigger = null;
    const anchor = document.getElementById('s2PreloadAnchor');

    if (anchor) {
    preloadTrigger = ScrollTrigger.create({
        trigger: anchor,
        start: 'top bottom', // dispara assim que o topo do anchor entra na tela
        once: true,
        onEnter: preloadImages,
    });
    } else {
    // Fallback de segurança: se o anchor não existir (ex: mudou o id
    // e esqueceu de atualizar aqui), volta pro comportamento antigo
    // baseado na própria seção, pra não quebrar o carregamento.
    preloadTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom+=300',
        once: true,
        onEnter: preloadImages,
    });
    }

    return () => {
    if (preloadTrigger) preloadTrigger.kill();
    trigger.kill();
    };
}, []);

return (
    <section ref={containerRef} className={styles.root}>
    <div className={styles.stickyWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {!imagesLoaded && (
        <div className={styles.loadingOverlay} aria-hidden="true">
        </div>
        )}
    </div>
    </section>
);
}