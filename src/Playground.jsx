//IMPORTS DE EStilos
import './App.css'
//IMPORTS DE BIBLIOTECAS E ETC*
import { useState, useEffect } from 'react'
//IMPORTS DE COMPONENTES*
import  PreLoader  from './sections/PreLoader/PreLoader'
import Header from './sections/Header/Header'
import Hero from './sections/Hero/Hero'
import Section2 from './sections/Section2/Section2'
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator';
import TrilhaHero from './components/TrilhaHero/TrilhaHero';

function Playground () {
return (
    <div>
        <ScrollIndicator/>
        <TrilhaHero/>
    </div>
);
}

export default Playground;