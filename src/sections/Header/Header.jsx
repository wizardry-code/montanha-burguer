import styles from './Header.module.css';
import Logo from '../../components/ui/icons/Logo';
import { headerLogoRef } from "../../utils/logoRef";
const Header = () => {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                
                <div className={styles.logoWrapper}>
                    <Logo className={styles.logo} svgRef={headerLogoRef}/>
                </div>

                {/* Centro: Menu */}
                <nav className={styles.navMenu}>
                    <a href="#home" className={styles.navLink}>Início</a>
                    <a href="#fortalezas" className={styles.navLink}>Fortalezas</a>
                    <a href="#quests" className={styles.navLink}>Quests & Eventos</a>
                    <a href="#cardapio" className={styles.navLink}>Cardápio</a>
                </nav>

                {/* Direita */}
                <div className={styles.rightWrapper}>
                    <a href="#login" className={styles.ctaButton}>Iniciar Quest</a>
                </div>
            </div>
        </header>
    );
};

export default Header;