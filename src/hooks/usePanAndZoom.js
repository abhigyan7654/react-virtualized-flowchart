import { useEffect, useRef, useCallback, useState } from 'react';
import usePanZoom from 'use-pan-and-zoom';
import { useDiagramContext } from '../diagramContext';

import { MIN_ZOOM, MAX_ZOOM, STEP_SIZE, CENTER, DEFAULT_ZOOM } from '../constants';

import { getTranslate3DCoordinates, getContainerScroll } from '../helper';

const usePanAndZoom = ({ scroll, contentSpan }) => {
  const previousZoom = useRef(DEFAULT_ZOOM);
  const diagramContainerRef = useRef();
  const { panZoomHandlers, setContainer, zoom, pan, setZoom, transform } = usePanZoom({
    enablePan: false,
    //disableWheel: true,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
  });

  const { setZoom: setDiagramZoom, containerRef } = useDiagramContext();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  function handleWheel(event) {
    console.log(`ex:${event.clientX}`);
    console.log(`ey:${event.clientY}`);
    setCursor({ x: event.clientX, y: event.clientY });
    event.deltaY > 0 ? decrementZoom() : incrementZoom();
    // console.log(`cx:${cursor.x}`);
    // console.log(`cy:${cursor.y}`)
  }

  const incrementZoom = useCallback(() => {
    const incrementedZoom = zoom + STEP_SIZE / 100;
    setZoom(incrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const decrementZoom = useCallback(() => {
    const decrementedZoom = zoom - STEP_SIZE / 100;
    //setCursor({x:0,y:0});
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

    diagramContainerRef.current.style.transform = `translate3D(${translateX +
      (cursor.x - (clientWidth + 32) / 2)}px, ${translateY -
      (-cursor.y + (clientHeight + 32) / 2)}px, 0) scale(${zoom})`;

    //    diagramContainerRef.current.style.transform = `scale(${zoom})`;

    const { scrollLeft, scrollTop } = getContainerScroll(
      scroll.left + (cursor.x - (clientWidth + 32) / 2),
      scroll.top - (-cursor.y + (clientHeight + 32) / 2),
      zoom,
      previousZoom.current,
      clientWidth,
      clientHeight
    );

    container.scrollLeft = scrollLeft; //+(cursor.x-(clientWidth+32)/2);
    container.scrollTop = scrollTop; //-(-cursor.y+(clientHeight+32)/2);

    // console.log(`sl:${scrollLeft}`);
    // console.log(`st:${scrollTop}`)
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
  };
};

export { usePanAndZoom };
