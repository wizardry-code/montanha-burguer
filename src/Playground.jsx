{/*IMPORTS DE BIBLIOTECAS E ETC*/}
import { useState, useEffect } from 'react'
{/*IMPORTS DE COMPONENTES*/}
import  PreLoader  from './components/PreLoader/PreLoader'
{/*IMPORTS DE ESTILOS*/}
import './App.css'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import { Section } from 'postprocessing'
import Section2 from './components/Section2/Section2'

function Playground () {
return (
    <div>
        <PreLoader/>
        <Header/>
        <Hero/>
        <Section2/>
    </div>
);
}

export default Playground;