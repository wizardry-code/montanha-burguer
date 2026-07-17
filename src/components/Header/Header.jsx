import styles from './Header.module.css';
import logoHeader from '../../assets/logoMinimalista.svg';

const Header = () => {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                
                {/* Lado Esquerdo: Logo (Ganha peso 1 à esquerda no CSS) */}
                <div className={styles.logoWrapper}>
                    <img src={logoHeader} alt="Montanha Burguer Logo" className={styles.logo} />
                </div>

                {/* Centro: Menu de Navegação Limpo (Centralizado perfeitamente) */}
                <nav className={styles.navMenu}>
                    <a href="#home" className={styles.navLink}>Início</a>
                    <a href="#cardapio" className={styles.navLink}>Cardápio</a>
                    <a href="#quests" className={styles.navLink}>Quests & Eventos</a>
                    <a href="#localizacao" className={styles.navLink}>Fortaleza</a>
                </nav>

                {/* Lado Direito: Bloco de Ações (Ganha peso 1 à direita no CSS) */}
                <div className={styles.rightWrapper}>
                    {/* CTA visível no Desktop */}
                    <a href="#reservas" className={styles.ctaButton}>Iniciar Quest</a>
                    
                    {/* Ícone Hambúrguer isolado, controlado pelo CSS para aparecer só no Mobile */}
                    <svg 
                        width="200" 
                        height="200" 
                        viewBox="0 0 200 200" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={styles.menuIcon}
                    >
                        <g clipPath="url(#clip0_28_85)">
                            <path d="M188.127 16.6505H69.3548C62.808 16.6505 57.4814 21.9771 57.4814 28.5239V45.7374C57.4814 52.2842 62.808 57.6108 69.3548 57.6108H188.127C194.673 57.6108 200 52.2842 200 45.7374V28.5239C200 21.9771 194.673 16.6505 188.127 16.6505Z" fill="black"/>
                            <path d="M188.127 79.5199H69.3548C62.808 79.5199 57.4814 84.8465 57.4814 91.3933V108.607C57.4814 115.154 62.808 120.48 69.3548 120.48H188.127C194.673 120.48 200 115.154 200 108.607V91.3933C200 84.8465 194.673 79.5199 188.127 79.5199Z" fill="black"/>
                            <path d="M188.127 142.389H69.3548C62.808 142.389 57.4814 147.716 57.4814 154.263V171.476C57.4814 178.023 62.808 183.349 69.3548 183.349H188.127C194.673 183.349 200 178.023 200 171.476V154.263C200 147.716 194.673 142.389 188.127 142.389Z" fill="black"/>
                            <path d="M30.9529 16.6505H11.8734C5.3266 16.6505 0 21.9771 0 28.5239V45.7374C0 52.2842 5.3266 57.6108 11.8734 57.6108H30.9529C37.4997 57.6108 42.8263 52.2842 42.8263 45.7374V28.5239C42.8263 21.9771 37.4997 16.6505 30.9529 16.6505Z" fill="black"/>
                            <path d="M30.9529 79.5199H11.8734C5.3266 79.5199 0 84.8465 0 91.3933V108.607C0 115.154 5.3266 120.48 11.8734 120.48H30.9529C37.4997 120.48 42.8263 115.154 42.8263 108.607V91.3933C42.8263 84.8465 37.4997 79.5199 30.9529 79.5199Z" fill="black"/>
                            <path d="M30.9529 142.389H11.8734C5.3266 142.389 0 147.716 0 154.263V171.476C0 178.023 5.3266 183.349 11.8734 183.349H30.9529C37.4997 183.349 42.8263 178.023 42.8263 171.476V154.263C42.8263 147.716 37.4997 142.389 30.9529 142.389Z" fill="black"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_28_85">
                                <rect width="200" height="200" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>

            </div>
        </header>
    );
};

export default Header;