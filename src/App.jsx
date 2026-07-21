import './App.css';
import PreLoader from './components/PreLoader/PreLoader';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Section2 from './components/Section2/Section2';
import Section3 from './components/Section3/Section3'


function App() {
  return (
    <div className="appContainer">
      <PreLoader />
      <Header />
      <Hero />
      <Section2 />
      <Section3 />
    </div>
  );
}

export default App;