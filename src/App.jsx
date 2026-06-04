import VisualEmbed from './node-vis-runtime/VisualEmbed.jsx';

//import sliderDemo from './demos/slider-demo.nodevis-embed.json';

import './App.css';

export default function App() {
  return (
    <main className="demo-page">
      <section className="demo-hero">
        <h1>Interactive Visualisation Demos</h1>
        <p>
          These interactive visualisations were authored in the node-based visual communication editor.
        </p>
      </section>

      <section className="demo-section">
        <h2>Slider-driven state transition</h2>
        <p>
          Drag the generated slider to scrub between two visual states. The slider itself is both
          a visual component and a progress driver.
        </p>

        {/* <VisualEmbed bundle={sliderDemo} /> */}

        <p className="demo-caption">
          This embed is loaded from a visual bundle exported by the editor.
        </p>
      </section>
    </main>
  );
}