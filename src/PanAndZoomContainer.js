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
    // handleClick,
    handleWheel,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    key,
    viewport,
  } = usePanAndZoom({ scroll, contentSpan });

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Make sure to clean up event listener when component unmounts
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
          //  {...panZoomHandlers}
          // onClick={handleClick}
          //onWheel={handleWheel}
          //  onMouseDown={handleMouseDown}
          //  onMouseUp={handleMouseUp}
          //  onMouseMove={handleMouseMove}
        >
          {renderHeader ? renderHeader() : null}
          <div
            ref={diagramContainerRef}
            style={{
              ...STYLES,
              overflow: 'visible',
              position: 'fixed',
              transform: key ? transform : transform, //`translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
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
