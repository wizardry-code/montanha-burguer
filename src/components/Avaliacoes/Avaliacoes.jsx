import React, { useEffect } from 'react';
import styles from './Avaliacoes.module.css';
import { HERO_END_WIDGET_EVENT } from '../../sections/Hero/Hero'; // ajuste o path se necessário

const SCRIPT_ID = 'elfsight-platform-script';

function loadElfsightScript() {
if (document.getElementById(SCRIPT_ID)) return; 

const script = document.createElement('script');
script.id = SCRIPT_ID;
script.src = 'https://elfsightcdn.com/platform.js';
script.async = true;
document.body.appendChild(script);
}

export default function Avaliacoes() {
useEffect(() => {
    // Antes: o script (536KB) carregava assim que o componente montava —
    // e como Section2 (que contém Avaliacoes) já está na árvore desde o
    // primeiro render do App, isso significava carregar cedo demais.
    //
    // Agora: só injeta o script quando a Hero avisar (via evento
    // customizado) que já passou de 90% do seu scroll — momento em que
    // o usuário já está avançando pro resto do site de qualquer forma.
    if (document.readyState === 'complete' && window.__heroWidgetAlreadyFired) {
    // Página já carregada de vez E o evento já disparou antes deste
    // componente montar (ex: navegação/hot-reload) — carrega direto.
    loadElfsightScript();
    return;
    }

    const handleReady = () => {
    window.__heroWidgetAlreadyFired = true;
    loadElfsightScript();
    };

    window.addEventListener(HERO_END_WIDGET_EVENT, handleReady, { once: true });

    // Fallback de segurança: se por algum motivo o evento da Hero nunca
    // disparar (ex: JS de scroll travou, refresh no meio do caminho),
    // garante que o widget carregue o mais tardar quando a própria
    // Avaliacoes estiver perto de entrar na viewport.
    const observer = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) {
        handleReady();
        observer.disconnect();
        }
    },
    { rootMargin: '300px' }
    );

    const el = document.getElementById('avaliacoesFramer');
    if (el) observer.observe(el);

    return () => {
    window.removeEventListener(HERO_END_WIDGET_EVENT, handleReady);
    observer.disconnect();
    };
}, []);

return (
    <section className={styles.container}>
    <div className={styles.headerGroup}>
        <h2 className={styles.titulo}>
        <span>49 a cada 50</span> Pessoas
        </h2>
        <p className={styles.subtitulo}>
        Amaram absolutamente tudo da taverna! S2
        </p>
    </div>

    <div className={styles.widgetWrapper}>
        <div
        className="elfsight-app-efff0fd0-7f82-4baa-b517-f9708c1063ed"
        data-elfsight-app-lazy
        id="avaliacoesFramer"
        />
    </div>
    </section>
);
}