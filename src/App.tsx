import './App.css';
import Hero from './sections/Hero';
import About from './sections/About';
import QuizSection from './sections/QuizSection';
import MediaSection from './sections/MediaSection';
import SupportSection from './sections/SupportSection';

import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <QuizSection />
      <MediaSection />
      <SupportSection />
    </Layout>
  );
}

export default App;
