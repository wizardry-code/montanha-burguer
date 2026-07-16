import { useEffect,useRef } from 'react';
import  gsap  from 'gsap';
import styles from './PreLoader.module.css';
import logoMinimalista from "../../assets/logoMinimalista.svg";
import preLoaderBg from "../../assets/preLoader.png";


const PreLoader = () => {
    

    return(
            <div className={styles.preLoaderContainer} style={{ backgroundImage: `url(${preLoaderBg})` }}>
                <img src={logoMinimalista} alt="preLoader" className={styles.logoLoader}/>
            </div>
        );
};

export default PreLoader;
