import { forwardRef } from 'react';


export const Caminho = forwardRef(({ className = '', ...props }, ref) => (
<svg 
    ref={ref} 
    width="100%" 
    height="100%" 
    viewBox="0 0 1271 317" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
>
    <g clipPath="url(#clip0_26_10)">
    <path 
        className="dot-start"
        d="M49.95 202.9C57.6544 202.9 63.9 196.654 63.9 188.95C63.9 181.246 57.6544 175 49.95 175C42.2456 175 36 181.246 36 188.95C36 196.654 42.2456 202.9 49.95 202.9Z" 
        fill="#1E1B18" 
        stroke="#D97706" 
        strokeWidth="2"
    />
    <path 
        className="dashed-line" 
        d="M64.25 177.5C218.083 82.8334 383.75 88.75 561.25 195.25C738.75 301.75 934 289.917 1147 159.75" 
        stroke="#FF8900" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeDasharray="8 8"
    />
    </g>
    <defs>
    <clipPath id="clip0_26_10">
        <rect width="1147" height="355" fill="white"/>
    </clipPath>
    </defs>
</svg>
));
export default Caminho;
