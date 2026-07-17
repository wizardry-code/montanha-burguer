import styles from './Hero.module.css';
import {Castelo} from '../Castelo.jsx';
const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <Castelo />
            </div>
        </section>
    );
};
export default Hero;