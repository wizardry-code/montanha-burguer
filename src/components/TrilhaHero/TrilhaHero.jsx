import { forwardRef, useRef } from 'react';

// Ícones
import Caminho from '../ui/icons/Caminho/Caminho';
import Espada from '../ui/icons/Espadas';
import MagoHat from '../ui/icons/MagoHat';
import DragaoSvg from '../ui/icons/DragaoSvg';
import Logo from '../ui/icons/Logo';

import styles from './TrilhaHero.module.css';

export const TrilhaHero = forwardRef(function TrilhaHero({ iconRefs = {}, activePathRef }, ref) {
const dragaoInternalRef = useRef(null);

return (
    <div className={styles.trilhaHero} ref={ref}>
    <div className={styles.caminhoDiv}>
        <Caminho ref={activePathRef} />
    </div>

    <div className={styles.magoHatDiv}>
        <div ref={iconRefs.magoHatRef} className={styles.iconScaler}>
        <MagoHat />
        </div>
    </div>

    <div className={styles.dragaoSvgDiv}>
        <div ref={iconRefs.dragaoRef} className={styles.iconScaler}>
        <DragaoSvg ref={dragaoInternalRef} />
        </div>
    </div>

    <div className={styles.espadaDiv}>
        <div ref={iconRefs.espadaRef} className={styles.iconScaler}>
        <Espada />
        </div>
    </div>

    <div className={styles.casteloDiv}>
        <div ref={iconRefs.casteloRef} className={styles.iconScaler}>
        <Logo />
        </div>
    </div>
    </div>
);
});

export default TrilhaHero;