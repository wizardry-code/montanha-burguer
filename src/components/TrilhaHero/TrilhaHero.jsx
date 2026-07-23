import { useRef } from 'react';

// Ícones
import Caminho from '../ui/icons/Caminho';
import Espada from '../ui/icons/Espadas';
import MagoHat from '../ui/icons/MagoHat';
import DragaoSvg from '../ui/icons/DragaoSvg';
import Logo from '../ui/icons/Logo';

import styles from './TrilhaHero.module.css';

export function TrilhaHero() {
const dragaoRef = useRef(null);

return (
    <div className={styles.trilhaHero}>
        <div className={styles.caminhoDiv}>
            <Caminho />
        </div>
        <div className={styles.magoHatDiv}>
            <MagoHat />
        </div>
        <div className={styles.dragaoSvgDiv}>
            <DragaoSvg ref={dragaoRef} />
        </div>
        <div className={styles.espadaDiv}>
            <Espada />
        </div>
        <div className={styles.casteloDiv}>
            <Logo />
        </div>
    </div>
);
}

export default TrilhaHero;