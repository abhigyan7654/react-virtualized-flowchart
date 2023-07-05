import { useEffect, useRef, useCallback, useState } from 'react';
import usePanZoom from 'use-pan-and-zoom';
import { useDiagramContext } from '../diagramContext';

import { MIN_ZOOM, MAX_ZOOM, STEP_SIZE, CENTER, DEFAULT_ZOOM } from '../constants';

import { getTranslate3DCoordinates, getContainerScroll } from '../helper';

const usePanAndZoom = ({ scroll, contentSpan }) => {
  const previousZoom = useRef(DEFAULT_ZOOM);
  const diagramContainerRef = useRef();
  const { panZoomHandlers, setContainer, zoom, pan, setZoom, transform, setPan, getPositionOnElement } = usePanZoom({
    enablePan: false,
    disableWheel: true,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
  });

  const { setZoom: setDiagramZoom, containerRef } = useDiagramContext();
  const [key, setKey] = useState(true);

  // function handleWheel(e) {
  //   if (e.ctrlKey) {
  //     setZoom(prev => prev * 1.1);
  //    setZoom(prev => prev * (1 / 1.1));
  //   }
  //   else{
  //   console.log('in handleWheel');
  //   // setZoom(prev=>prev*1.1)
  //   // setZoom(prev=>(prev*(1/1.1)));
  //   }

  // }
  // const [viewport, setViewport] = useState({
  //   x: 0,
  //   y: 0,
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  //   zoom: 1
  // });

  // const [panning, setPanning] = useState(false);
  // const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });

  // const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
  // const [translation, setTranslation] = useState({x: 0, y: 0});

  // const handleMouseDown = (e) => {
  //   setPanning(true);
  //   console.log('Mouse down event:', e);
  //   setStartPanPoint({ x: e.clientX, y: e.clientY });
  // };

  // const handleMouseUp = (e) => {
  //   console.log('Mouse up event:', e);
  //   setPanning(false);
  // };

  // const handleMouseMove = (e) => {
  //   console.log('Mouse moving:', e);
  //   if (panning) {
  //     setTranslation({
  //         x: translation.x + e.clientX - mousePosition.x,
  //         y: translation.y + e.clientY - mousePosition.y,
  //     });
  //     setMousePosition({
  //         x: e.clientX,
  //         y: e.clientY,
  //     });
  // }
  // };

  const handleWheel = e => {
    // You can adjust the zoom speed here if needed
    // const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;

    // const rect = e.target.getBoundingClientRect();
    // const x = e.clientX - rect.left; // x position within the element.
    // const y = e.clientY - rect.top; // y position within the element.

    // // Calculate the point under cursor in world coordinates
    // const cursorX = (x / viewport.width) * viewport.zoom + viewport.x;
    // const cursorY = (y / viewport.height) * viewport.zoom + viewport.y;
    // console.log(e.deltaY);
    // // If `ctrlKey` is `true`, it's a pinch-to-zoom gesture
    let prevZoom = zoom;
    console.log('prevZoom', prevZoom);
    if (e.ctrlKey) {
      setKey(true);
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
      const pointerPosition = {
        x: e.pageX,
        y: e.pageY,
      };
      setZoom(previousZoom => previousZoom * scaleChange, pointerPosition);
    }
    // If `ctrlKey` is `false`, it's a two-finger scroll (panning)
    else {
      // e.preventDefault();
      console.log('ctrlKey false');
      // setKey(false);
      setPan(({ x, y }) => ({
        x: x - e.deltaX,
        y: y - e.deltaY,
      }));

      console.log('inTwoFingerScroll', zoom);
    }
  };

  const incrementZoom = useCallback(() => {
    const incrementedZoom = zoom + STEP_SIZE;
    setKey(true);
    console.log('increment zoom');
    //console.log(incrementedZoom);
    setZoom(incrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const decrementZoom = useCallback(() => {
    const decrementedZoom = zoom - STEP_SIZE;
    setKey(true);
    //setCursor({x:0,y:0});
    setZoom(decrementedZoom, CENTER);
  }, [zoom, setZoom]);

  const resetZoom = useCallback(() => {
    setKey(true);
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
    //console.log('in use effect');

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
    pan,
    key,
    setKey,
    // handleMouseDown,
    // handleMouseUp,
    // handleMouseMove,
    //viewport
  };
};

export { usePanAndZoom };
