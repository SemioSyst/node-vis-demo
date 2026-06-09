// src/renderer/viewport/createRenderFrame.js

import { getVisualBounds, getExplicitRootSize } from './getVisualBounds.js';

const FALLBACK_BOUNDS = {
  minX: 0,
  minY: 0,
  maxX: 100,
  maxY: 100,
  width: 100,
  height: 100,
};

export function createRenderFrame(output, renderOptions = {}) {
  const mode = normalizeRenderMode(renderOptions.mode ?? 'fit');

  const viewportWidth = Math.max(
    1,
    Number(renderOptions.viewportWidth ?? 240)
  );

  const viewportHeight = Math.max(
    1,
    Number(renderOptions.viewportHeight ?? 160)
  );

  // Important:
  // fixedViewport / embed mode must not depend on visual bounds.
  // Dynamic elements such as tooltips, labels, or transitions should not
  // cause the whole visualisation to be re-centered or re-scaled.
  if (mode === 'fixedViewport') {
    return createFixedViewportRenderFrame({
      viewportWidth,
      viewportHeight,
      renderOptions,
    });
  }

  const contentBounds = getVisualBounds(output) ?? FALLBACK_BOUNDS;
  const explicitSize = getExplicitRootSize(output);

  const renderBounds = resolveRenderBounds({
    contentBounds,
    explicitSize,
    renderOptions,
  });

  if (mode === 'actual') {
    return createActualRenderFrame({
      viewportWidth,
      viewportHeight,
      contentBounds,
      explicitSize,
      renderBounds,
      renderOptions,
    });
  }

  return createFitRenderFrame({
    viewportWidth,
    viewportHeight,
    contentBounds,
    explicitSize,
    renderBounds,
    renderOptions,
  });
}

function normalizeRenderMode(mode) {
  if (mode === 'embed') return 'fixedViewport';
  if (mode === 'fixed') return 'fixedViewport';
  if (mode === 'fixedViewport') return 'fixedViewport';
  if (mode === 'actual') return 'actual';
  return 'fit';
}

function createFixedViewportRenderFrame({
  viewportWidth,
  viewportHeight,
  renderOptions,
}) {
  const viewportX = Number(renderOptions.viewportX ?? 0);
  const viewportY = Number(renderOptions.viewportY ?? 0);

  const viewWidth = Math.max(
    1,
    Number(renderOptions.viewBoxWidth ?? renderOptions.viewportWidth ?? viewportWidth)
  );

  const viewHeight = Math.max(
    1,
    Number(renderOptions.viewBoxHeight ?? renderOptions.viewportHeight ?? viewportHeight)
  );

  const viewBoxRect = {
    x: Number.isFinite(viewportX) ? viewportX : 0,
    y: Number.isFinite(viewportY) ? viewportY : 0,
    width: viewWidth,
    height: viewHeight,
  };

  const renderBounds = makeBounds(
    viewBoxRect.x,
    viewBoxRect.y,
    viewBoxRect.x + viewBoxRect.width,
    viewBoxRect.y + viewBoxRect.height
  );

  return {
    mode: 'fixedViewport',

    viewportWidth,
    viewportHeight,

    // In fixedViewport mode these are intentionally fixed to the authored
    // viewport rather than measured from dynamic content.
    contentBounds: renderBounds,
    explicitSize: {
      x: viewBoxRect.x,
      y: viewBoxRect.y,
      width: viewBoxRect.width,
      height: viewBoxRect.height,
    },
    renderBounds,

    viewBox: `${viewBoxRect.x} ${viewBoxRect.y} ${viewBoxRect.width} ${viewBoxRect.height}`,
    viewBoxRect,

    // Fill the embed container, but use a fixed authored viewBox.
    // xMinYMin prevents SVG from visually centering content if the CSS box
    // aspect ratio differs from the authored viewport.
    svgWidth: renderOptions.svgWidth ?? '100%',
    svgHeight: renderOptions.svgHeight ?? '100%',
    preserveAspectRatio:
      renderOptions.preserveAspectRatio ??
      'xMinYMin meet',

    scaleMode: 'fixedViewport',

    // Tooltips / pointer-following overlays should be allowed to render
    // outside the authored viewport unless the caller explicitly clips them.
    overflow: renderOptions.overflow ?? 'visible',
  };
}

function createFitRenderFrame({
  viewportWidth,
  viewportHeight,
  contentBounds,
  explicitSize,
  renderBounds,
  renderOptions,
}) {
  const paddingRatio = Number(renderOptions.paddingRatio ?? 0.12);
  const minPadding = Number(renderOptions.fitMinPadding ?? renderOptions.minPadding ?? 8);

  const safeWidth = Math.max(renderBounds.width, 1);
  const safeHeight = Math.max(renderBounds.height, 1);

  const padX = Math.max(safeWidth * paddingRatio, minPadding);
  const padY = Math.max(safeHeight * paddingRatio, minPadding);

  const viewX = renderBounds.minX - padX;
  const viewY = renderBounds.minY - padY;
  const viewWidth = safeWidth + padX * 2;
  const viewHeight = safeHeight + padY * 2;

  return {
    mode: 'fit',

    viewportWidth,
    viewportHeight,

    contentBounds,
    explicitSize,
    renderBounds,

    viewBox: `${viewX} ${viewY} ${viewWidth} ${viewHeight}`,
    viewBoxRect: {
      x: viewX,
      y: viewY,
      width: viewWidth,
      height: viewHeight,
    },

    svgWidth: '100%',
    svgHeight: '100%',
    preserveAspectRatio: 'xMidYMid meet',

    scaleMode: 'fit',
    overflow: 'hidden',
  };
}

function createActualRenderFrame({
  viewportWidth,
  viewportHeight,
  contentBounds,
  explicitSize,
  renderBounds,
  renderOptions,
}) {
  const safePadding = Number(renderOptions.actualPadding ?? 8);

  const actualRect = expandBoundsToRect(renderBounds, safePadding);

  const overflow = renderOptions.overflow ?? 'auto';

  return {
    mode: 'actual',

    viewportWidth,
    viewportHeight,

    contentBounds,
    explicitSize,
    renderBounds,

    viewBox: `${actualRect.x} ${actualRect.y} ${actualRect.width} ${actualRect.height}`,
    viewBoxRect: actualRect,

    svgWidth: actualRect.width,
    svgHeight: actualRect.height,
    preserveAspectRatio: 'xMinYMin meet',

    scaleMode: 'actual',
    overflow,
  };
}

function resolveRenderBounds({
  contentBounds,
  explicitSize,
  renderOptions,
}) {
  const explicitBounds = explicitSizeToBounds(explicitSize);

  if (!explicitBounds) {
    return contentBounds ?? FALLBACK_BOUNDS;
  }

  // If true, actual/fit preview behaves like a clipped container.
  // Default false because authoring preview should not accidentally crop labels,
  // strokes, axis ticks, or procedural renderer output.
  if (renderOptions.clipToExplicitSize) {
    return explicitBounds;
  }

  return unionBounds([
    explicitBounds,
    contentBounds,
  ]) ?? explicitBounds;
}

function explicitSizeToBounds(explicitSize) {
  if (!explicitSize) return null;

  const x = Number(explicitSize.x ?? 0);
  const y = Number(explicitSize.y ?? 0);
  const width = Number(explicitSize.width);
  const height = Number(explicitSize.height);

  if (![x, y, width, height].every(Number.isFinite)) return null;

  return makeBounds(x, y, x + Math.max(width, 1), y + Math.max(height, 1));
}

function expandBoundsToRect(bounds, padding) {
  const p = Number(padding ?? 0);

  return {
    x: bounds.minX - p,
    y: bounds.minY - p,
    width: Math.max(bounds.width + p * 2, 1),
    height: Math.max(bounds.height + p * 2, 1),
  };
}

function unionBounds(boundsList) {
  const valid = boundsList.filter(Boolean);
  if (!valid.length) return null;

  return makeBounds(
    Math.min(...valid.map((b) => b.minX)),
    Math.min(...valid.map((b) => b.minY)),
    Math.max(...valid.map((b) => b.maxX)),
    Math.max(...valid.map((b) => b.maxY))
  );
}

function makeBounds(minX, minY, maxX, maxY) {
  if (![minX, minY, maxX, maxY].every(Number.isFinite)) {
    return FALLBACK_BOUNDS;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
}