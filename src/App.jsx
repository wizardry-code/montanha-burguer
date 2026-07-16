{/*IMPORTS DE BIBLIOTECAS E ETC*/}
import { useState, useEffect } from 'react'
{/*IMPORTS DE COMPONENTES*/}
import { Castelo } from './components/Castelo'
import  PreLoader  from './components/PreLoader/PreLoader'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
{/*IMPORTS DE ESTILOS*/}
import './App.css'

function App() {
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


  return (
    <>
      {showLoader && (
        <PreLoader 
          isLoaded={isLoaded} 
          onComplete={() => setShowLoader(false)} 
        />
      )}
      
      {/* Mantemos o site visível por trás para o GSAP poder medir o Header */}
      <div style={{ opacity: showLoader ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        <Header />
        <Content />
      </div>
    </>
  );
}

export default App
