import { useState } from 'react'
import { Castelo } from './components/Castelo'
import './App.css'

function App() {
  return (
    <div className="divPai">
      <div className="divConteudo">
        <h1>Montanha Burguer</h1>
      </div>
      <div className="div3d">
        <Castelo />
      </div>
    </div>
  )
}

export default App
