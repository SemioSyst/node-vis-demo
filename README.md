
---

# 2. Demo repository README

```md
# Node Visualisation Demo Site

A standalone Vite/React demo site for displaying interactive visualisation bundles exported from the node-based visualisation editor.

This repository is intentionally separate from the editor. It does not contain the React Flow authoring interface. Instead, it contains a lightweight runtime and renderer that can load exported visual bundles and embed them inside a traditional webpage.

## Purpose

The goal of this repository is to present interactive visualisations as part of a normal web page with explanatory text, sections, captions, and layout.

The authoring workflow is:

Node editor
→ Final Output node
→ export .nodevis-embed.json bundle
→ copy bundle into this demo project
→ render with VisualEmbed
→ deploy to GitHub Pages

Project Structure
node-vis-demo/
  public/
  src/
    assets/
    demos/
      exported visual bundles

    node-vis-runtime/
      VisualEmbed.jsx
      VisualEmbed.css
      renderer/
      runtime/

    App.jsx
    App.css
    main.jsx
    index.css

  package.json
  vite.config.js
Main Components
src/demos/

This folder stores exported .nodevis-embed.json files from the editor.

Example:

scenario1-co2-heatmap.nodevis-embed.json
scenario3-covid-transition.nodevis-embed.json
scenario4-energy-scroll-slider.nodevis-embed.json

These files should be committed to the repository because the deployed demo page needs them.

src/node-vis-runtime/

This folder contains the minimal renderer/runtime copied from the editor project. It is responsible for rendering exported bundles and running their interactions.

It includes:

renderer/
runtime/
VisualEmbed.jsx
VisualEmbed.css

It should not include editor-only files such as:

React Flow nodes
Custom node UI
GraphIRContext
OutputsContext
Data Inspector
editor panels
VisualEmbed

VisualEmbed is the wrapper component used by the demo page. It receives a visual bundle and renders it through the copied runtime renderer.

Example usage:

import VisualEmbed from './node-vis-runtime/VisualEmbed.jsx';
import co2Heatmap from './demos/scenario1-co2-heatmap.nodevis-embed.json';

export default function App() {
  return (
    <main>
      <section>
        <h1>CO₂ per-capita heatmap</h1>
        <p>Hover over a cell to inspect the country, year, and value.</p>

        <VisualEmbed bundle={co2Heatmap} />
      </section>
    </main>
  );
}
Included Demo Scenarios
Scenario 1: CO₂ Heatmap with Hover Tooltip

An interactive heatmap of national CO₂ emissions per capita from 2000 to 2023. Hovering over a cell reveals a tooltip containing the country, year, and exact value.

Data source: Our World in Data CO₂ and Greenhouse Gas Emissions dataset.

Scenario 2: COVID-19 Temporal Alignment Transition

A line chart showing COVID-19 case trajectories for selected countries. A button switches between calendar-date alignment and outbreak-relative time alignment.

Data source: Our World in Data COVID-19 dataset.

Scenario 3: Electricity Mix Scroll / Slider Story

A stacked bar visualisation showing changes in global electricity generation by source across several years. The same state transition can be driven by scroll progress or slider progress.

Data source: Our World in Data Energy dataset.

Data Sources
CO₂ Data

Our World in Data CO₂ and Greenhouse Gas Emissions dataset
Repository: https://github.com/owid/co2-data
CSV: https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv

COVID-19 Data

Our World in Data COVID-19 dataset documentation
Documentation: https://docs.owid.io/projects/covid/en/latest/dataset.html
Compact CSV: https://catalog.ourworldindata.org/garden/covid/latest/compact/compact.csv
Archived repository: https://github.com/owid/covid-19-data

Energy Data

Our World in Data Energy dataset
Repository: https://github.com/owid/energy-data
CSV: https://owid-public.owid.io/data/energy/owid-energy-data.csv
GitHub CSV page: https://github.com/owid/energy-data/blob/master/owid-energy-data.csv

Installation
npm install
Development
npm run dev

Then open the local Vite URL shown in the terminal.

Build
npm run build
Preview Production Build
npm run preview
Runtime Dependencies

The copied runtime uses a small subset of D3 modules for axis and scale rendering.

If dependencies are missing, install:

npm install d3-axis d3-scale d3-shape d3-array d3-format

This demo project should not require React Flow. If a copied file imports @xyflow/react, that file is likely editor-only and should be removed or replaced.

Adding a New Demo
Build the visualisation in the editor.
Connect the final visual output to a Final Output node.
Run the evaluator.
Download the .nodevis-embed.json bundle.
Copy the bundle into src/demos/.
Import it in App.jsx.
Add a new page section using VisualEmbed.

Example:

import newDemo from './demos/new-demo.nodevis-embed.json';

<section className="demo-section">
  <h2>New Demo</h2>
  <p>Description of the interaction.</p>
  <VisualEmbed bundle={newDemo} />
</section>
Deployment to GitHub Pages

If deploying to a repository page such as:

https://YOUR_USERNAME.github.io/node-vis-demo/

set the Vite base path in vite.config.js:

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/node-vis-demo/',
});

Install gh-pages:

npm install -D gh-pages

Add a deploy script in package.json:

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}

Deploy:

npm run deploy

Then configure GitHub Pages:

Settings → Pages
Source: Deploy from a branch
Branch: gh-pages
Folder: /root
Notes on Bundle Rendering

The exported bundle is data. It is rendered by the copied node-vis-runtime folder. This design separates:

visual authoring
from
web presentation

The demo page can be edited like a normal React page, while the visualisations are embedded as interactive components.

Current Limitations
This repository currently uses a copied runtime rather than an npm package.
Runtime files need to be manually synced if the editor renderer changes.
Standalone HTML export is not included.
Advanced responsive layout controls are still future work.
Some visual bundles may depend on runtime features that must be copied from the editor.

Future Work
Package the embed runtime as a reusable library.
Add a demo manifest for automatically listing exported visual bundles.
Support standalone HTML exports.
Improve responsive sizing for embedded visualisations.
Add richer explanatory layout around each demo.