import './App.css';
import PreLoader from './sections/PreLoader/PreLoader';
import Header from './sections/Header/Header';
import Hero from './sections/Hero/Hero';
import Section2 from './sections/Section2/Section2';
import Section3 from './sections/Section3/Section3b';


function App() {
  return (
    <div className="appContainer">
      <PreLoader/>
      <Header/>
      <Hero/>
      <Section2/>
      <Section3/>
    </div>
  );
}

export default App;