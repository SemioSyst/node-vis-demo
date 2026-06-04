// src/node-vis-runtime/VisualEmbed.jsx

import OutputRenderer from './renderer/OutputRenderer.jsx';
import './VisualEmbed.css';

export default function VisualEmbed({
  bundle,
  className = '',
}) {
  const visual = bundle?.visual ?? null;

  const viewportWidth =
    bundle?.renderOptions?.viewportWidth ??
    bundle?.embed?.preferredWidth ??
    900;

  const viewportHeight =
    bundle?.renderOptions?.viewportHeight ??
    bundle?.embed?.preferredHeight ??
    520;

  return (
    <div
      className={[
        'node-vis-embed',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        maxWidth: viewportWidth,
      }}
    >
      <OutputRenderer
        output={visual}
        emptyText="No visual bundle"
        renderOptions={{
          mode: bundle?.renderOptions?.mode ?? 'fit',
          viewportWidth,
          viewportHeight,
          background: bundle?.renderOptions?.background ?? '#ffffff',
          overflow: bundle?.renderOptions?.overflow ?? 'visible',
        }}
      />
    </div>
  );
}