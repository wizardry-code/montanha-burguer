import styles from './Hero.module.css';
import {Castelo} from '../Castelo.jsx';
const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.heroBelt}>
                {/*canvas travadão no fundo*/}
                <div className={styles.canvasContainer}>
                    <Castelo />
                </div>
                {/*Futuras divs de texto que passarão por cima do canvas ficarão aqui*/}
            </div>
        </section>
    );
};
export default Hero;