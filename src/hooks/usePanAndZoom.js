import { useEffect, useRef, useCallback, useState } from 'react';
import usePanZoom from 'use-pan-and-zoom';
import { useDiagramContext } from '../diagramContext';

import { MIN_ZOOM, MAX_ZOOM, STEP_SIZE, CENTER, DEFAULT_ZOOM } from '../constants';

import { getTranslate3DCoordinates, getContainerScroll } from '../helper';

const usePanAndZoom = ({ scroll, contentSpan }) => {
  const previousZoom = useRef(DEFAULT_ZOOM);
  const diagramContainerRef = useRef();
  const { panZoomHandlers, setContainer, zoom, pan, setZoom, transform } = usePanZoom({
    // enablePan: false,
    //disableWheel: true,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
  });

  const { setZoom: setDiagramZoom, containerRef } = useDiagramContext();
  const [panning, setPanning] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });

  const [viewport, setViewport] = useState({
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 1,
  });

  const handleMouseDown = e => {
    setPanning(true);
    setStartPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = e => {
    setPanning(false);
  };

  const handleMouseMove = e => {
    if (panning) {
      const dx = e.clientX - startPanPoint.x;
      const dy = e.clientY - startPanPoint.y;
      setViewport(prevViewport => ({
        ...prevViewport,
        x: prevViewport.x - dx / prevViewport.zoom,
        y: prevViewport.y - dy / prevViewport.zoom,
      }));
      setStartPanPoint({ x: e.clientX, y: e.clientY });
    }
  };
  function handleWheel(e) {
    if (e.ctrlKey) {
      setZoom(prev => prev * 1.1);
      setZoom(prev => prev * (1 / 1.1));
    }
    // If `ctrlKey` is `false`, it's a two-finger scroll (panning)
    else {
      console.log('in handleWheel two finger scroll');
      setViewport(prevViewport => ({
        ...prevViewport,
        x: prevViewport.x - e.deltaX / prevViewport.zoom,
        y: prevViewport.y - e.deltaY / prevViewport.zoom,
      }));
    }
    // console.log('in handleWheel');
    // setZoom(prev=>prev*1.1)
    // setZoom(prev=>(prev*(1/1.1)));
  }

  const incrementZoom = useCallback(() => {
    const incrementedZoom = zoom + STEP_SIZE;
    //console.log(incrementedZoom);
    setZoom(incrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const decrementZoom = useCallback(() => {
    const decrementedZoom = zoom - STEP_SIZE;
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

    //diagramContainerRef.current.style.transform =  `translate3D(${translateX}px, ${translateY}px, 0) scale(${zoom})`
    //`translate3D(${translateX}px, ${translateY}px, 0)
    //    diagramContainerRef.current.style.transform = `scale(${zoom})`;
    console.log('in use effect');

    const { scrollLeft, scrollTop } = getContainerScroll(
      scroll.left, //+ (cursor.x - (clientWidth + 32) / 2),
      scroll.top, // - (-cursor.y + (clientHeight + 32) / 2),
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
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  };
};

export { usePanAndZoom };
