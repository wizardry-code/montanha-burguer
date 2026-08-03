import { useEffect, Suspense, lazy } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import './App.css';
import PreLoader from './sections/PreLoader/PreLoader';
import Header from './sections/Header/Header';
import Hero from './sections/Hero/Hero';
import EmberCursor from './components/EmbedCursor/EmbedCursor';
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator';

const Section2 = lazy(() => import('./sections/Section2/Section2'));
const Section3 = lazy(() => import('./sections/Section3/Section3b'));
const Section4 = lazy(() => import('./sections/Section4/Section4'));
const SectionCardapio = lazy(() => import('./sections/SectionCardapio/SectionCardapio'));

// Registra os plugins do GSAP
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollTrigger.config({ ignoreMobileResize: true });

function App() {
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      normalizeScroll: true,
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
    });
    ScrollTrigger.refresh();

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <div className="appContainer">
      <EmberCursor />
      <PreLoader />
      <Header />
      <ScrollIndicator/>

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />

          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <Section2 />
          </Suspense>

          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <Section3 />
          </Suspense>
          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <Section4 />
          </Suspense>
          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <SectionCardapio />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;