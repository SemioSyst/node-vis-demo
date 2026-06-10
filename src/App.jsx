import { useEffect, useMemo, useState } from 'react';

import VisualEmbed from './node-vis-runtime/VisualEmbed.jsx';

import scenario1 from './demos/Scenario1.min.json';
import scenario2 from './demos/Scenario2.min.json';
import scenario3Scroll from './demos/Scenario3-1.min.json';
import scenario3Slider from './demos/Scenario3-2.min.json';

import './App.css';

const CRITERIA = [
  {
    id: 'C1',
    title: 'Event composition',
    description: 'Whether reader input can be represented as authorable event or progress triggers.',
  },
  {
    id: 'C2',
    title: 'State-based behaviour',
    description: 'Whether interaction can drive registered visual states.',
  },
  {
    id: 'C3',
    title: 'Animation authoring',
    description: 'Whether state changes can be turned into editable visual transitions.',
  },
  {
    id: 'C4',
    title: 'Data and parameter mapping',
    description: 'Whether data-derived parameters can drive visual structure and style.',
  },
  {
    id: 'C5',
    title: 'Live preview',
    description: 'Whether partial and final outputs can be inspected during authoring.',
  },
  {
    id: 'C6',
    title: 'Modifiability',
    description: 'Whether an existing interaction can be changed locally without rebuilding the whole graph.',
  },
  {
    id: 'C7',
    title: 'Low-code workflow',
    description: 'Whether interaction behaviour can be authored through node composition rather than custom scripts.',
  },
  {
    id: 'C8',
    title: 'Web suitability',
    description: 'Whether the exported result can run as an interactive browser-based visualisation.',
  },
];

const DEMOS = [
  {
    id: 'scenario-1',
    number: '01',
    shortTitle: 'CO₂ heatmap',
    eyebrow: 'Scenario 01 · Hover-triggered response',
    title: 'CO₂ emissions per capita, 2000–2023',
    focus: 'Hover input, data identity, context-driven tooltip',
    description:
      'A country-by-year heatmap generated from matrix data. Each cell retains country, year, and value tags. Hovering over a cell reveals a tooltip filled from the hovered cell context.',
    interaction:
      'Interaction: hover over any heatmap cell. The tooltip is generated through Context Slots and positioned through a pointer-based Position Rule.',
    evidence: [
      'Matrix input is converted into heatmap cells.',
      'Tag Mapper preserves country, year, and value information.',
      'Hover input is registered through Element Selector and Event Trigger.',
      'Context Slots fill tooltip text from the hovered cell context.',
      'Position Rule places the tooltip near the pointer.',
    ],
    criteria: ['C1', 'C4', 'C5', 'C7'],
    bundle: scenario1,
    figureCaption:
      'Figure 1. CO₂ per-capita heatmap. Hovering over a cell displays the corresponding country, year, and value.',
    renderOptions: {
      viewportPadding: 48,
    },
  },
  {
    id: 'scenario-2',
    number: '02',
    shortTitle: 'COVID transition',
    eyebrow: 'Scenario 02 · Animated state transition',
    title: 'COVID-19 trajectories by calendar date and outbreak-relative time',
    focus: 'Button trigger, grouped chart states, path interpolation',
    description:
      'The same COVID-19 trajectories are shown under two x-axis definitions. One state positions each country by calendar date, while the other aligns each trajectory by outbreak-relative time. The y-values remain the same while the x positions change.',
    interaction:
      'Interaction: click the Switch button to animate the paths between the two temporal alignments.',
    evidence: [
      'Matrix-driven Path Generator creates one path per country.',
      'Two complete chart states are registered in a States node.',
      'A custom visual button is converted into a click trigger.',
      'Transition interpolates path geometry between the two states.',
    ],
    criteria: ['C2', 'C3', 'C4', 'C6'],
    bundle: scenario2,
    figureCaption:
      'Figure 2. Animated transition between calendar-date and outbreak-relative temporal encodings.',
    renderOptions: {
      viewportPadding: 56,
    },

    // Display-only adjustment for the webpage.
    figureOffsetX: '160px',
    figureSurfacePadding: '28px 20px',
  },
  {
    id: 'scenario-3-scroll',
    number: '03A',
    shortTitle: 'Scroll driver',
    eyebrow: 'Scenario 03A · Scroll progress driver',
    title: 'Global electricity generation by source: scroll-driven story',
    focus: 'Page scroll steps, progress-driven states, web-native behaviour',
    description:
      'A stacked-bar visualisation of global electricity generation by source across several year states. Page scroll position is mapped to progress and used to drive the same States and Transition pipeline.',
    interaction:
      'Interaction: scroll through the scenario page. The visual remains fixed while scroll progress moves through the year states.',
    evidence: [
      'Five year states are registered in a States node.',
      'Scroll Event Trigger uses page scroll steps as a progress driver.',
      'Transition follows progress to interpolate between adjacent year states.',
      'The visual is tested as a web-native scroll interaction.',
    ],
    criteria: ['C1', 'C2', 'C3', 'C8'],
    bundle: scenario3Scroll,
    layout: 'scroll',
    figureCaption:
      'Figure 3A. Scroll-driven electricity mix story. Scroll position drives the state transition.',
    renderOptions: {
      forceViewport: true,
      viewportX: -40,
      viewportY: -90,
      viewBoxWidth: 900,
      viewBoxHeight: 330,
      viewportWidth: 900,
      viewportHeight: 330,
      overflow: 'visible',
    },

    // Display-only adjustment for the webpage.
    figureFrameless: true,
    figureOffsetX: '40px',
    figureOffsetY: '300px',
    figureCaptionOffsetY: '300px',
    figureSurfacePadding: '12px 0 6px',
    figureCaptionMarginTop: '6px',
  },
  {
    id: 'scenario-3-slider',
    number: '03B',
    shortTitle: 'Slider replacement',
    eyebrow: 'Scenario 03B · Slider driver replacement',
    title: 'Global electricity generation by source: slider-driven replacement',
    focus: 'Progress driver replacement and local modification',
    description:
      'This version uses the same year states and transition structure as the scroll-driven version. The only conceptual change is that the scroll progress driver is replaced by a Slider node.',
    interaction:
      'Interaction: drag the slider to move through the year states. This demonstrates that the downstream visual state and transition structure can be reused with a different progress input.',
    evidence: [
      'The same multi-year visual states are reused.',
      'The same Transition node logic is reused.',
      'The scroll driver is replaced by Slider.event.',
      'Slider.visual is rendered as part of the final visual composition.',
    ],
    criteria: ['C2', 'C3', 'C6', 'C7'],
    bundle: scenario3Slider,
    figureCaption:
      'Figure 3B. Slider-driven version of the electricity mix story, demonstrating local modification of the interaction driver.',
    renderOptions: {
      forceViewport: true,
      viewportX: -40,
      viewportY: -90,
      viewBoxWidth: 900,
      viewBoxHeight: 380,
      viewportWidth: 900,
      viewportHeight: 380,
      overflow: 'visible',
    },

    // Display-only adjustment for the webpage.
    figureFrameless: true,
    figureOffsetX: '-36px',
    figureSurfacePadding: '12px 0 6px',
    figureCaptionMarginTop: '6px',
  },
];

function getPageFromHash() {
  if (typeof window === 'undefined') return 'home';

  const hash = window.location.hash.replace(/^#/, '');

  if (!hash) return 'home';

  return DEMOS.some((demo) => demo.id === hash)
    ? hash
    : 'home';
}

function getRenderableVisual(bundle) {
  if (!bundle || typeof bundle !== 'object') return null;

  if (bundle.visual) return bundle.visual;
  if (bundle.output) return bundle.output;
  if (bundle.outputType === 'visual') return bundle;

  if (bundle.root && !bundle.reactFlow) {
    return {
      outputType: bundle.outputType ?? 'visual',
      ...bundle,
    };
  }

  return null;
}

function getBundleKind(bundle) {
  if (!bundle || typeof bundle !== 'object') return 'empty';

  if (getRenderableVisual(bundle)) return 'visual';

  if (
    Array.isArray(bundle?.reactFlow?.nodes) ||
    Array.isArray(bundle?.reactFlow?.edges)
  ) {
    return 'editor-graph';
  }

  return 'unknown';
}

function createEmbedBundle(bundle, demo) {
  const visual = getRenderableVisual(bundle);

  return {
    ...(bundle && typeof bundle === 'object' ? bundle : {}),
    visual,
    embed: {
      ...(bundle?.embed ?? {}),
    },
    renderOptions: {
      ...(bundle?.renderOptions ?? {}),
      ...(demo.renderOptions ?? {}),

      // Final web embedding should use a stable viewport, not Preview-style fit/actual.
      mode: 'fixedViewport',

      background:
        demo.renderOptions?.background ??
        bundle?.renderOptions?.background ??
        '#ffffff',

      overflow: 'visible',
    },
  };
}

function setHashPage(page) {
  if (page === 'home') {
    window.history.pushState(null, '', window.location.pathname);
  } else {
    window.history.pushState(null, '', `#${page}`);
  }

  window.dispatchEvent(new Event('hashchange'));
}

function AppHeader({ page, onNavigate }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          type="button"
          className="site-title-button"
          onClick={() => onNavigate('home')}
        >
          <span>A Node-Based Authoring Environment</span>
          <strong>Interactive Evaluation Showcase</strong>
        </button>

        <nav className="site-nav" aria-label="Scenario navigation">
          <button
            type="button"
            className={page === 'home' ? 'is-active' : ''}
            aria-current={page === 'home' ? 'page' : undefined}
            onClick={() => onNavigate('home')}
          >
            Overview
          </button>

          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              className={page === demo.id ? 'is-active' : ''}
              aria-current={page === demo.id ? 'page' : undefined}
              onClick={() => onNavigate(demo.id)}
            >
              {demo.number}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HomePage({ onNavigate }) {
  return (
    <div className="page page--home">
      <section className="hero">
        <p className="kicker">Evaluation web companion</p>

        <h1>
          Interactive evaluation scenarios for a node-based visualisation
          authoring prototype.
        </h1>

        <p className="hero-copy">
          This page accompanies the evaluation section of the project report. It
          presents runnable versions of the visualisations authored in the
          prototype and exported as embeddable visual bundles.
        </p>
      </section>

      <section className="method-section">
        <div className="section-heading">
          <p className="kicker">Methodology</p>
          <h2>Scenario-based evaluation</h2>
        </div>

        <div className="method-grid">
          <p>
            The evaluation uses scenario-based walkthroughs to test whether the
            node graph can express data transformation, visual construction,
            interaction input, state change, transition, and final browser
            rendering.
          </p>

          <p>
            Each scenario focuses on a different part of the authoring model.
            The exported figures below are not static screenshots; they are
            interactive visual bundles replayed through a separate runtime.
          </p>
        </div>
      </section>

      <section className="criteria-section">
        <div className="section-heading">
          <p className="kicker">Criteria</p>
          <h2>Evaluation criteria referenced by the scenarios</h2>
        </div>

        <div className="criteria-list">
          {CRITERIA.map((criterion) => (
            <article key={criterion.id} className="criteria-item">
              <span>{criterion.id}</span>
              <div>
                <h3>{criterion.title}</h3>
                <p>{criterion.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="scenario-index">
        <div className="section-heading">
          <p className="kicker">Interactive figures</p>
          <h2>Scenario pages</h2>
        </div>

        <div className="scenario-card-grid">
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              className="scenario-card"
              onClick={() => onNavigate(demo.id)}
            >
              <span className="scenario-card__number">{demo.number}</span>
              <span className="scenario-card__eyebrow">{demo.eyebrow}</span>
              <strong>{demo.title}</strong>
              <span>{demo.focus}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ScenarioPage({ demo, onNavigate }) {
  const bundleKind = getBundleKind(demo.bundle);
  const embedBundle = createEmbedBundle(demo.bundle, demo);
  const isRenderable = bundleKind === 'visual';

  if (demo.layout === 'scroll') {
    return (
      <ScrollScenarioPage
        demo={demo}
        embedBundle={embedBundle}
        isRenderable={isRenderable}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <article className="page page--scenario">
      <ScenarioIntro demo={demo} onNavigate={onNavigate} />

      <FigureBlock
        demo={demo}
        embedBundle={embedBundle}
        isRenderable={isRenderable}
      />

      <ScenarioNotes demo={demo} />
    </article>
  );
}

function ScrollScenarioPage({
  demo,
  embedBundle,
  isRenderable,
  onNavigate,
}) {
  return (
    <article className="page page--scenario page--scroll-scenario">
      <ScenarioIntro demo={demo} onNavigate={onNavigate} />

      <section className="scroll-stage">
        <div className="scroll-stage__copy">
          <p className="kicker">Scroll stages</p>

          <div className="scroll-step">
            <span>01</span>
            <p>Begin at the first year state.</p>
          </div>

          <div className="scroll-step">
            <span>02</span>
            <p>Scroll down to move the progress driver through the intermediate states.</p>
          </div>

          <div className="scroll-step">
            <span>03</span>
            <p>The stacked bar remains fixed while the runtime transition updates the visual.</p>
          </div>

          <div className="scroll-step">
            <span>04</span>
            <p>The companion slider version demonstrates the same downstream structure with a different driver.</p>
          </div>
        </div>

        <div className="scroll-stage__figure">
          <FigureBlock
            demo={demo}
            embedBundle={embedBundle}
            isRenderable={isRenderable}
            compact
          />
        </div>
      </section>

      <ScenarioNotes demo={demo} />
    </article>
  );
}

function ScenarioIntro({ demo, onNavigate }) {
  return (
    <header className="scenario-intro">
      <button
        type="button"
        className="back-link"
        onClick={() => onNavigate('home')}
      >
        ← Evaluation overview
      </button>

      <p className="kicker">{demo.eyebrow}</p>

      <div className="scenario-title-row">
        <h1>{demo.title}</h1>
        <span>{demo.number}</span>
      </div>

      <p className="scenario-focus">{demo.focus}</p>

      <p className="scenario-description">{demo.description}</p>

      <div className="criteria-pills">
        {demo.criteria.map((id) => (
          <span key={id}>{id}</span>
        ))}
      </div>
    </header>
  );
}

function FigureBlock({
  demo,
  embedBundle,
  isRenderable,
  compact = false,
}) {
  const surfaceStyle = {
    '--figure-offset-x': demo.figureOffsetX ?? '0px',
    '--figure-offset-y': demo.figureOffsetY ?? '0px',
  };

  if (demo.figureSurfacePadding) {
    surfaceStyle.padding = demo.figureSurfacePadding;
  }

  if (demo.figureFrameless) {
    surfaceStyle.border = 'none';
  }

  return (
    <figure
      className={[
        'figure-block',
        compact ? 'figure-block--compact' : '',
        demo.figureFrameless ? 'figure-block--frameless' : '',
      ].filter(Boolean).join(' ')}
    >
      <div
        className="figure-block__surface"
        style={surfaceStyle}
      >
        {isRenderable ? (
          <div
            className="figure-block__embed-shell"
            style={{
              transform: `translate(${demo.figureOffsetX ?? '0px'}, ${demo.figureOffsetY ?? '0px'})`,
            }}
          >
            <VisualEmbed
              bundle={embedBundle}
              className="figure-embed"
              renderOptions={embedBundle.renderOptions}
            />
          </div>
        ) : (
          <BundleWarning bundle={demo.bundle} />
        )}
      </div>

      <figcaption
        style={{
          marginTop: getFigureCaptionMarginTop(demo),
        }}
      >
        <strong>{demo.figureCaption}</strong>
        <span>{demo.interaction}</span>
      </figcaption>
    </figure>
  );
}

function getFigureCaptionMarginTop(demo) {
  const base = demo.figureCaptionMarginTop ?? '12px';
  const offset = demo.figureCaptionOffsetY;

  if (!offset) return demo.figureCaptionMarginTop ?? undefined;

  return `calc(${base} + ${offset})`;
}

function ScenarioNotes({ demo }) {
  return (
    <section className="scenario-notes">
      <div>
        <p className="kicker">Evidence</p>
        <h2>What this scenario demonstrates</h2>
      </div>

      <ul>
        {demo.evidence.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function BundleWarning({ bundle }) {
  const nodeCount = Array.isArray(bundle?.reactFlow?.nodes)
    ? bundle.reactFlow.nodes.length
    : null;

  const edgeCount = Array.isArray(bundle?.reactFlow?.edges)
    ? bundle.reactFlow.edges.length
    : null;

  const kind = getBundleKind(bundle);

  return (
    <div className="bundle-warning">
      <p className="kicker">Runtime bundle required</p>

      <h3>This JSON is not directly renderable by the demo runtime.</h3>

      {kind === 'editor-graph' ? (
        <p>
          This file looks like an editor graph save. It contains React Flow
          nodes and edges, while this demo page expects a compiled visual embed
          bundle.
        </p>
      ) : (
        <p>
          The file was imported successfully, but it does not contain a
          recognised visual output field such as <code>visual</code>,{' '}
          <code>output</code>, or a direct <code>outputType: &quot;visual&quot;</code>{' '}
          object.
        </p>
      )}

      <dl>
        <div>
          <dt>Bundle app</dt>
          <dd>{bundle?.app ?? 'Unknown'}</dd>
        </div>

        <div>
          <dt>Version</dt>
          <dd>{bundle?.version ?? 'Unknown'}</dd>
        </div>

        <div>
          <dt>Nodes</dt>
          <dd>{nodeCount ?? '—'}</dd>
        </div>

        <div>
          <dt>Edges</dt>
          <dd>{edgeCount ?? '—'}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => {
      setPage(getPageFromHash());
      window.scrollTo({ top: 0, left: 0 });
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const currentDemo = useMemo(
    () => DEMOS.find((demo) => demo.id === page) ?? null,
    [page]
  );

  const handleNavigate = (nextPage) => {
    setHashPage(nextPage);
  };

  return (
    <main className="app-shell">
      <AppHeader page={page} onNavigate={handleNavigate} />

      {currentDemo ? (
        <ScenarioPage demo={currentDemo} onNavigate={handleNavigate} />
      ) : (
        <HomePage onNavigate={handleNavigate} />
      )}
    </main>
  );
}