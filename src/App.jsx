{/*IMPORTS DE BIBLIOTECAS E ETC*/}
import { useState, useEffect } from 'react'
{/*IMPORTS DE COMPONENTES*/}
import { Castelo } from './components/Castelo'
import  PreLoader  from './components/PreLoader/PreLoader'
{/*IMPORTS DE ESTILOS*/}
import './App.css'

function App() {
  /*
  const[isLoaded, setIsLoaded] = useState(false);
  const[showLoader,setShowLoader] = useState(true);

useEffect(() => {
    // Função para marcar como carregado

    const handleLoad = () => setIsLoaded(true);

    // Se o navegador já terminou de carregar tudo antes do JS rodar
    if (document.readyState === 'complete') {
      setIsLoaded(true);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);
*/

  return (
    <>
      {/* 
        Abaixo está toda a sua lógica comentada corretamente.
        Note o fechamento com
      */}
      {/*
      {showLoader && (
        <PreLoader 
          isLoaded={isLoaded} 
          onComplete={() => setShowLoader(false)} 
        />
      )}

      <div style={{ opacity: showLoader ? 0 : 1, transition: 'opacity 0.3s ease' }}>
      </div>
      */}

      {/* CHAMADA DO PRELOADER PURO PARA VOCÊ TRABALHAR */}
      <PreLoader />

      {/* Deixei o h1 aqui caso queira ver se algo vaza por baixo */}
      <div>
        <h1>dsadasdsada</h1>
      </div>
    </>
  );
}

export default App;