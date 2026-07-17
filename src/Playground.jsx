{/*IMPORTS DE BIBLIOTECAS E ETC*/}
import { useState, useEffect } from 'react'
{/*IMPORTS DE COMPONENTES*/}
import  PreLoader  from './components/PreLoader/PreLoader'
{/*IMPORTS DE ESTILOS*/}
import './App.css'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'

function Playground () {
return (
    <div>
        <PreLoader />
    </div>
);
}

export default Playground;