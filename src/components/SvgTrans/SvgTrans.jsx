import React, { forwardRef } from 'react';
import styles from './SvgTrans.module.css'; 

export const SvgTrans = forwardRef(function SvgTrans(props, ref) {
return (
    <div className={styles.divSVGTransS2}>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 1316 664"
        fill="none"
        preserveAspectRatio="none"
    >
        <path
        ref={ref} /* Corrigido de svgPathRef para ref */
        d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
        stroke="#F0E3CF"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </svg>
    </div>
);
});