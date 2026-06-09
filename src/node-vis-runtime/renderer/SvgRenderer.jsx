// src/renderer/SvgRenderer.jsx

import { renderVisualNode } from './renderVisualNode.jsx';

export default function SvgRenderer({
  spec,
  renderFrame,
  renderOptions = {},
  runtime = null,
}) {
  if (!spec || !renderFrame) return null;

  const svgOverflow =
    renderFrame.overflow ??
    (renderFrame.mode === 'fixedViewport' ? 'visible' : 'hidden');

  const svgStyle = {
    display: 'block',
    overflow: svgOverflow,
    background: renderOptions.background ?? undefined,
  };

  return (
    <svg
      className={`output-renderer-svg output-renderer-svg--${renderFrame.mode}`}
      width={renderFrame.svgWidth}
      height={renderFrame.svgHeight}
      viewBox={renderFrame.viewBox}
      preserveAspectRatio={renderFrame.preserveAspectRatio}
      overflow={svgOverflow}
      style={svgStyle}
    >
      {renderVisualNode(spec.root, {
        spec,
        renderFrame,
        renderOptions,
        runtime,
      })}
    </svg>
  );
}