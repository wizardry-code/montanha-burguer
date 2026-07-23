import React, { useEffect } from 'react';
import styles from './Avaliacoes.module.css';

export default function Avaliacoes() {
useEffect(() => {
    // Carrega o script do Elfsight dinamicamente se ainda não existir na página
    const scriptId = 'elfsight-platform-script';
    let script = document.getElementById(scriptId);

    if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);
    }
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
        className="elfsight-app-efff0fd0-7f82-4baa-b517-f9708c1063ed" data-elfsight-app-lazy
        />
    </div>
    </section>
);
}