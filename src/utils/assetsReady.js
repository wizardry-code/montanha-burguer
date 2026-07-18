import { useProgress } from '@react-three/drei';

/**
 * assetsReadyPromise
 * -------------------
 * O evento nativo `window.load` só espera recursos referenciados direto no
 * HTML (<script>, <link>, <img>...). Modelos .glb, texturas etc. carregados
 * via `useGLTF`/`useTexture` (Three.js/R3F) são buscados via fetch DEPOIS,
 * programaticamente pelo JS — o `load` nunca espera por eles.
 *
 * Esse módulo assina o LoadingManager global do Three.js (por baixo do
 * `useProgress` do drei) e resolve uma Promise quando:
 *   1) algum carregamento realmente começou (evita falso "pronto" no frame
 *      inicial, antes de qualquer asset começar a baixar), e
 *   2) esse carregamento chegou a 100% sem estar mais ativo.
 *
 * Se algum asset falhar, resolve mesmo assim (fail-open: melhor deixar o
 * usuário entrar no site do que travar o preloader pra sempre por causa de
 * 1 asset quebrado). Também tem um timeout de segurança pro mesmo motivo,
 * caso nenhum asset comece a carregar nos primeiros segundos.
 */

let hasStarted = false;
let resolveReady;

export const assetsReadyPromise = new Promise((resolve) => {
    resolveReady = resolve;
});

useProgress.subscribe((state) => {
    if (state.active) hasStarted = true;

    if (state.errors.length > 0) {
        resolveReady();
        return;
    }

    if (hasStarted && !state.active && state.progress >= 100) {
        resolveReady();
    }
});

// Failsafe: se nada começar a carregar em 20s (ex: página sem cena 3D nessa
// rota), libera o preloader mesmo assim.
setTimeout(() => resolveReady(), 20000);