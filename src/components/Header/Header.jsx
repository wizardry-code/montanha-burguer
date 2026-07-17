import styles from './Header.module.css';
import {useRef} from 'react';
import logoHeader from '../../assets/logoMinimalista.svg';
const Header = () => {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                {/* Lado Esquerdo: Logo que receberá o foco do preloader futuramente */}
                <div className={styles.logoWrapper}>
                    <img src={logoHeader} alt="Montanha Burguer Logo" className={styles.logo} />
                </div>

                {/* Centro: Menu de Navegação Limpo */}
                <nav className={styles.navMenu}>
                    <a href="#home" className={styles.navLink}>Início</a>
                    <a href="#cardapio" className={styles.navLink}>Cardápio</a>
                    <a href="#quests" className={styles.navLink}>Quests & Eventos</a>
                    <a href="#localizacao" className={styles.navLink}>Fortaleza</a>
                </nav>

                {/* Lado Direito: Botão de Ação Direta (CTA) para conversão de reservas */}
                <div className={styles.ctaWrapper}>
                    <a href="#reservas" className={styles.ctaButton}>Iniciar Quest</a>
                </div>
            </div>
        </header>
    );
};

export default Header;
