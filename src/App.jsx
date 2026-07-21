import './App.css';
import PreLoader from './sections/PreLoader/PreLoader';
import Header from './sections/Header/Header';
import Hero from './sections/Hero/Hero';
import Section2 from './sections/Section2/Section2';


function App() {
  return (
    <div className="appContainer">
      <PreLoader/>
      <Header/>
      <Hero/>
      <Section2/>
    </div>
  );
}

export default App;