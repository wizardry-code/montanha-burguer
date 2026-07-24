import './App.css';
import PreLoader from './sections/PreLoader/PreLoader';
import Header from './sections/Header/Header';
import Hero from './sections/Hero/Hero';
import Section2 from './sections/Section2/Section2';
import Section3 from './sections/Section3/Section3b';
import Section4 from './sections/Section4/Teste';
import EmberCursor from './components/EmbedCursor/EmbedCursor';


function App() {
  return (
    <div className="appContainer">
      <EmberCursor/>
      <PreLoader/>
      <Header/>
      <Hero/>
      <Section2/>
      <Section3/>
      <Section4/>
    </div>
  );
}

export default App;