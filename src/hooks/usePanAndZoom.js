import { useEffect, useRef, useCallback, useState } from 'react';
import usePanZoom from 'use-pan-and-zoom';
import { useDiagramContext } from '../diagramContext';

import { MIN_ZOOM, MAX_ZOOM, STEP_SIZE, CENTER, DEFAULT_ZOOM } from '../constants';

import { getTranslate3DCoordinates, getContainerScroll } from '../helper';

const usePanAndZoom = ({ updateScroll, scroll, contentSpan }) => {
  const previousZoom = useRef(DEFAULT_ZOOM);
  const diagramContainerRef = useRef();
  const { panZoomHandlers, setContainer, zoom, pan, setZoom, transform, setPan } = usePanZoom({
    enablePan: false,
    disableWheel: true,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
  });

  const { setZoom: setDiagramZoom, containerRef } = useDiagramContext();

  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleWheel = e => {
    if (e.ctrlKey) {
      e.preventDefault();
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
      const pointerPosition = {
        x: e.pageX,
        y: e.pageY,
      };

      const width = 4740 * previousZoom.current * scaleChange; //determining the dimensions of diagramContainerRef
      const height = 2020 * previousZoom.current * scaleChange; // 4740*2020 is dimension on 100% or zoom =1

      scroll.left = (width - e.pageX) / 2; //
      scroll.top = (height - e.pageY) / 2;

      // updateScroll(e.pageX, e.pageY)
      // console.log(previousZoom.current);
      // console.log({ width, height });

      // //setCursorPosition({x:e.pageX,y:e.pageY});
      // console.log({ scroll });
      setZoom(previousZoom => previousZoom * scaleChange, pointerPosition);
    }
    // If `ctrlKey` is `false`, it's a two-finger scroll (panning)
    else {
      e.preventDefault();
      const width = 4740 * previousZoom.current;
      const height = 2020 * previousZoom.current;
      setPan(({ x, y }) => ({
        x: x - e.deltaX,
        y: y - e.deltaY,
      }));
    }
  };

  const incrementZoom = useCallback(() => {
    const incrementedZoom = zoom + STEP_SIZE;
    setZoom(incrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const decrementZoom = useCallback(() => {
    const decrementedZoom = zoom - STEP_SIZE;
    setZoom(decrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const resetZoom = useCallback(() => {
    setZoom(DEFAULT_ZOOM, CENTER);
  }, [setZoom]);

  const combinedRef = useCallback(
    el => {
      setContainer(el);
      containerRef.current = el;
    },
    [setContainer]
  );

  useEffect(() => {
    if (setDiagramZoom) {
      setDiagramZoom(zoom);
    }
  }, [zoom]);

  useEffect(() => {
    const container = containerRef.current;
    const { clientWidth, clientHeight } = container;

    const { translateX, translateY } = getTranslate3DCoordinates(clientWidth, clientHeight, pan, zoom, contentSpan);

    //diagramContainerRef.current.style.transform =  `translate3D(${translateX}px, ${translateY}px, 0) scale(${zoom})`

    const { scrollLeft, scrollTop } = getContainerScroll(
      scroll.left, //+ (cursor.x - (clientWidth + 32) / 2),
      scroll.top, // - (-cursor.y + (clientHeight + 32) / 2),
      zoom,
      previousZoom.current,
      clientWidth,
      clientHeight
    );
    // container.scrollLeft = scrollLeft; //+(cursor.x-(clientWidth+32)/2);
    // container.scrollTop = scrollTop; //-(-cursor.y+(clientHeight+32)/2);

    previousZoom.current = zoom;
  }, [contentSpan.x, contentSpan.y, pan.x, pan.y, zoom]);

  useEffect(() => {
    const container = containerRef.current;
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
  }, []);

  return {
    zoom,
    panZoomHandlers,
    combinedRef,
    diagramContainerRef,
    incrementZoom,
    decrementZoom,
    resetZoom,
    transform,
    //handleClick,
    handleWheel,
    pan,
    // handleMouseDown,
    // handleMouseUp,
    // handleMouseMove,
    //viewport
  };
};

export { usePanAndZoom };
