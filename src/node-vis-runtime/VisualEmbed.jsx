// src/node-vis-runtime/VisualEmbed.jsx

import { useMemo } from 'react';

import OutputRenderer from './renderer/OutputRenderer.jsx';
import { getVisualBounds } from './renderer/viewport/getVisualBounds.js';
import './VisualEmbed.css';

const EMPTY_OBJECT = Object.freeze({});

export default function VisualEmbed({
  bundle,
  className = '',
  renderOptions = EMPTY_OBJECT,
  style = EMPTY_OBJECT,
}) {
  const visual = bundle?.visual ?? null;

  const stableViewport = useMemo(() => {
    const bundleRenderOptions = bundle?.renderOptions ?? EMPTY_OBJECT;
    const bundleEmbed = bundle?.embed ?? EMPTY_OBJECT;

    return resolveStableViewport({
      visual,
      bundleRenderOptions,
      bundleEmbed,
      renderOptions,
    });
  }, [bundle, visual, renderOptions]);

  const background =
    renderOptions.background ??
    bundle?.renderOptions?.background ??
    '#ffffff';

  return (
    <div
      className={[
        'node-vis-embed',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        '--node-vis-embed-width': `${stableViewport.viewportWidth}px`,
        '--node-vis-embed-height': `${stableViewport.viewportHeight}px`,
        background,
        ...style,
      }}
      data-node-vis-embed={bundle?.name ?? 'untitled'}
    >
      <div className="node-vis-embed__surface">
        <OutputRenderer
          output={visual}
          emptyText="No visual bundle"
          renderOptions={{
            ...(bundle?.renderOptions ?? {}),
            ...renderOptions,

            mode: 'fixedViewport',

            viewportX: stableViewport.viewBoxX,
            viewportY: stableViewport.viewBoxY,

            viewportWidth: stableViewport.viewportWidth,
            viewportHeight: stableViewport.viewportHeight,

            viewBoxWidth: stableViewport.viewBoxWidth,
            viewBoxHeight: stableViewport.viewBoxHeight,

            svgWidth: stableViewport.viewportWidth,
            svgHeight: stableViewport.viewportHeight,

            background,
            overflow: renderOptions.overflow ?? 'visible',
          }}
        />
      </div>
    </div>
  );
}

function resolveStableViewport({
  visual,
  bundleRenderOptions,
  bundleEmbed,
  renderOptions,
}) {
  const padding = toFiniteNumber(
    renderOptions.viewportPadding ??
      bundleRenderOptions.viewportPadding,
    40
  );

  /**
   * Important:
   * viewportWidth / viewportHeight are display size hints.
   * They should NOT by themselves force viewBox = 0 0 width height.
   *
   * Only viewportX / viewportY / viewBoxWidth / viewBoxHeight mean:
   * "I, the author, explicitly want this viewBox."
   */
  const hasExplicitViewBox =
    renderOptions.viewportX != null ||
    renderOptions.viewportY != null ||
    renderOptions.viewBoxWidth != null ||
    renderOptions.viewBoxHeight != null ||
    renderOptions.forceViewport === true;

  const preferredWidth = toPositiveNumber(
    renderOptions.viewportWidth ??
      bundleRenderOptions.viewportWidth ??
      bundleEmbed.preferredWidth,
    null
  );

  const preferredHeight = toPositiveNumber(
    renderOptions.viewportHeight ??
      bundleRenderOptions.viewportHeight ??
      bundleEmbed.preferredHeight,
    null
  );

  if (hasExplicitViewBox) {
    const viewBoxX = toFiniteNumber(
      renderOptions.viewportX ??
        bundleRenderOptions.viewportX,
      0
    );

    const viewBoxY = toFiniteNumber(
      renderOptions.viewportY ??
        bundleRenderOptions.viewportY,
      0
    );

    const viewBoxWidth = toPositiveNumber(
      renderOptions.viewBoxWidth ??
        bundleRenderOptions.viewBoxWidth ??
        renderOptions.viewportWidth ??
        bundleRenderOptions.viewportWidth,
      preferredWidth ?? 900
    );

    const viewBoxHeight = toPositiveNumber(
      renderOptions.viewBoxHeight ??
        bundleRenderOptions.viewBoxHeight ??
        renderOptions.viewportHeight ??
        bundleRenderOptions.viewportHeight,
      preferredHeight ?? 520
    );

    return {
      viewBoxX,
      viewBoxY,
      viewBoxWidth,
      viewBoxHeight,
      viewportWidth: preferredWidth ?? viewBoxWidth,
      viewportHeight: preferredHeight ?? viewBoxHeight,
    };
  }

  const bounds = getVisualBounds(visual);

  if (bounds) {
    const viewBoxX = bounds.minX - padding;
    const viewBoxY = bounds.minY - padding;
    const viewBoxWidth = Math.max(1, bounds.width + padding * 2);
    const viewBoxHeight = Math.max(1, bounds.height + padding * 2);

    return {
      viewBoxX,
      viewBoxY,
      viewBoxWidth,
      viewBoxHeight,

      // By default, display at authored visual size.
      // This keeps the visual stable and prevents preview-style recentering.
      viewportWidth: preferredWidth ?? viewBoxWidth,
      viewportHeight: preferredHeight ?? viewBoxHeight,
    };
  }

  const fallbackWidth = preferredWidth ?? 900;
  const fallbackHeight = preferredHeight ?? 520;

  return {
    viewBoxX: 0,
    viewBoxY: 0,
    viewBoxWidth: fallbackWidth,
    viewBoxHeight: fallbackHeight,
    viewportWidth: fallbackWidth,
    viewportHeight: fallbackHeight,
  };
}

function toPositiveNumber(value, fallback) {
  const n = Number(value);

  if (Number.isFinite(n) && n > 0) return n;

  return fallback;
}

function toFiniteNumber(value, fallback) {
  const n = Number(value);

  if (Number.isFinite(n)) return n;

  return fallback;
}