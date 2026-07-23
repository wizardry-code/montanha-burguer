import { forwardRef } from 'react';
import styles from './Caminho.module.css';

// SVG real do traçado: um marcador de início (círculo, sempre visível e
// estático) + a linha laranja tracejada do caminho, que é a camada
// controlada via ref pelo Hero.jsx (DrawSVGPlugin).
// Não existe mais "camada base cinza": antes de ser desenhada, a linha
// simplesmente não existe visualmente (drawSVG "0% 0%").
export const Caminho = forwardRef(function Caminho(props, activePathRef) {
return (
    <svg
    className={styles.caminhoSvg}
    width="1271"
    height="317"
    viewBox="0 0 1271 317"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    {/* Marcador de início do caminho — estático, sempre visível */}
    <path
        d="M93.95 172.181C101.654 172.181 107.9 165.935 107.9 158.231C107.9 150.526 101.654 144.281 93.95 144.281C86.2456 144.281 80 150.526 80 158.231C80 165.935 86.2456 172.181 93.95 172.181Z"
        fill="#1E1B18"
        stroke="#D97706"
        strokeWidth="2"
    />

    {/* Linha do caminho — revelada progressivamente via DrawSVGPlugin */}
    <path
        ref={activePathRef}
        className={styles.pathActive}
        d="M107.9 146.824C261.733 52.1569 427.4 58.0735 604.9 164.574C782.4 271.074 977.65 259.24 1190.65 129.074"
        stroke="#FF8900"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 8"
    />
    </svg>
);
});

export default Caminho;