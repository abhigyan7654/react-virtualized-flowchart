import * as React from 'react';
import { useEffect } from 'react';
import { usePanAndZoom } from './hooks/usePanAndZoom';

const STYLES = {
  height: '100%',
  width: '100%',
};

const PanAndZoomContainer = ({
  children,
  handleScroll,
  diagramContainerStyles,
  scroll,
  contentSpan,
  renderControlPanel,
  renderHeader,
  updateScroll,
}) => {
  const {
    zoom,
    panZoomHandlers,
    combinedRef,
    diagramContainerRef,
    incrementZoom,
    decrementZoom,
    resetZoom,
    transform,
    handleWheel,
  } = usePanAndZoom({ updateScroll, scroll, contentSpan });

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div style={{ ...STYLES, position: 'relative' }}>
      <div style={STYLES}>
        <div
          style={{ ...STYLES, display: 'flex', flexDirection: 'column', overflow: 'auto', ...diagramContainerStyles }}
          onScroll={handleScroll}
          ref={combinedRef}
          className="diagramContainer"
        >
          {renderHeader ? renderHeader() : null}
          <div
            ref={diagramContainerRef}
            style={{
              ...STYLES,
              overflow: 'visible',
              position: 'fixed',
              transform: transform, //`translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            }}
          >
            {children()}
          </div>
        </div>
      </div>
      {renderControlPanel({
        zoom,
        incrementZoom,
        decrementZoom,
        resetZoom,
      })}
    </div>
  );
};

export default PanAndZoomContainer;
