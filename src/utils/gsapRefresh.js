import { ScrollTrigger } from 'gsap/ScrollTrigger';

let refreshTimeout = null;

export function debouncedRefresh(delay = 150) {
if (refreshTimeout) clearTimeout(refreshTimeout);
refreshTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
    refreshTimeout = null;
}, delay);
}