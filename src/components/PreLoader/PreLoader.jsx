import { useEffect,useRef } from 'react';
import styles from './PreLoader.module.css';
import logoMinimalista from "../../assets/logoMinimalista.svg";
import preLoaderBg from "../../assets/preLoader.png";
{/*GSAP*/}
import  {gsap}  from 'gsap';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(useGSAP);


const PreLoader = () => {
    const container = useRef(null);

useGSAP(() => {
	// gsap code here...
	gsap.to(`.${styles.logoLoader}`, {
            scale: 0.45,
            x: 0,
            y: 0,
            repeat: -1,
            duration: 1.5,
            yoyo: true,
            ease: "power1.inOut"
    }); // <-- automatically reverted
},{ scope: container }); // <-- scope is for selector text (optional)

    return(
            <div ref={container} className={styles.preLoaderContainer} style={{ backgroundImage: `url(${preLoaderBg})` }}>
                <img src={logoMinimalista} alt="preLoader" className={styles.logoLoader}/>
            </div>
        );
};

export default PreLoader;
