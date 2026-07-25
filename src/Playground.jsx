//IMPORTS DE EStilos
import './App.css'
//IMPORTS DE BIBLIOTECAS E ETC*
import gsap from 'gsap';
import { useState, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
//IMPORTS DE COMPONENTES*
import  PreLoader  from './sections/PreLoader/PreLoader'
import Header from './sections/Header/Header'
import Hero from './sections/Hero/Hero'
import Section2 from './sections/Section2/Section2'
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator';
import TrilhaHero from './components/TrilhaHero/TrilhaHero';
import Avaliacoes from './components/Avaliacoes/Avaliacoes'
import Section3b from './sections/Section3/Section3b'
import { MedievalCard } from './components/MedievalCard/MedievalCard'
import Section4 from './sections/Section4/Section4'
import SectionCardapio from './sections/SectionCardapio/SectionCardapio';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
export default function Playground() {
useEffect(() => {
    // Inicializa o ScrollSmoother global da página
    const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.5, // Tempo de suavização (quanto maior, mais macio/amanteigado)
    effects: true, // Permite efeitos parallax em outros elementos via data-speed
    });

    return () => {
    smoother.kill();
    };
}, []);

return (
    <div id="smooth-wrapper">
    <div id="smooth-content">
        {/* Suas seções anteriores */}
        <Header/>
        <Hero/>
        {/* Sua Seção 4 com a Animação no Canvas */}
        <SectionCardapio />
    </div>
    </div>
);
}