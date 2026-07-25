import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import './App.css';
import PreLoader from './sections/PreLoader/PreLoader';
import Header from './sections/Header/Header';
import Hero from './sections/Hero/Hero';
import Section2 from './sections/Section2/Section2';
import Section3 from './sections/Section3/Section3b';
import Section4 from './sections/Section4/Section4';
import EmberCursor from './components/EmbedCursor/EmbedCursor';
import SectionCardapio from './sections/SectionCardapio/SectionCardapio';

// Registra os plugins do GSAP
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollTrigger.config({ ignoreMobileResize: true })


function App() {
  useEffect(() => {
    // Inicializa o ScrollSmoother global do site
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5, // Suavização (1.2 a 1.8 é o ideal para o efeito amanteigado)
      effects: true, // Habilita atributos data-speed e data-lag para efeito parallax
    });
    ScrollTrigger.refresh()

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <div className="appContainer">
      {/* 🛑 Elementos fixos e overlays Globais ficam FORA do smooth-wrapper */}
      <EmberCursor />
      <PreLoader />
      <Header />

      {/* 🌊 Estrutura obrigatória do ScrollSmoother */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />
          <Section2 />
          <Section3 />
          <SectionCardapio/>
          <Section4 />
        </div>
      </div>
    </div>
  );
}

export default App;