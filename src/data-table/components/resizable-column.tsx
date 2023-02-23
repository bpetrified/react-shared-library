import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DragPreviewImage, useDrag, useDrop, XYCoord } from 'react-dnd';

export const ResizableColumn = (
  props: React.HTMLAttributes<any> & { index: number, width: number, onResize: (delta: XYCoord | null, currentWidth: number, index: number) => void },
) => {
  const layoutRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [show, setShow] = useState(true);

  const [, drop] = useDrop(
    () => ({
      accept: 'BOX',
      drop(item: any, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        props.onResize?.(delta, item.width, item.id);
        return undefined;
      },
    }),
    [props],
  );

  const [, drag, preview] = useDrag(
    () => ({
      type: 'BOX',
      item: { id: props.index, width } as any,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props, width],
  );

  useLayoutEffect(() => {
    if ((layoutRef.current as any || {}).offsetWidth) {
      setWidth((layoutRef.current as any || {}).offsetWidth);
    }
  });

  useEffect(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 500);
  }, [width]);

  return (
    <>
      {/* We need to re-render this to fix the issue that preview doesn't show after the first resizing... */}
      {show && <DragPreviewImage connect={preview} src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAcCAYAAAB2+A+pAAAAAXNSR0IArs4c6QAAA09JREFUSEvFl09PE0EUwN/sLm2XwtJGo6kFPYAF1Bi49F6+gB48e6KJH8GLNw9+BJP25NmDfgHqmQMhRgUqHBqoDUTTslB2V7s75o3zyHSgpU0QJplsd5mZ3/s/DwbDDQYAOA35xN0cACL5xN8DDTxkmIFAU5m4N1QmCjDQGAaMaxE6sra2ll9cXPyEhEqlsrC0tFQFgD9SgIG0HgaM2loAEOecu8ViUWhWKpWAMeYAQAAAHWn2C7UeBiy0BYAE57yZy+XE4dVqFcFpAPAVrS8dHAMAm3P+SwPfAAAPAH5Lc18KmCKZNEbwTw18U4JVP/f1dT9Tq2mD/sWJGqOPDzTwLelj1Bgjm9KLnmcsoIPpnUCUOmoaxTjnPzTwHcXMmF4IpDQjQSjnhRAqmDQkKEYwTrPT6Xw2TTMbBMF6IpF4wjmvaeB7vu9/jMfjC2EY1i3LeizBGOUU6aolBFitRgIkgVYYht8Mw0AzwuTkJOzt7WEE3+ecf9fA4hutwfVRFB2YpvlAghGOFiAhOGlJMEyXWBiGXwzDuI0HTE1N4SHCPPV6HTKZzMNGo/FVBdO3bDYr1lmWBbVaTfyOomjfNM1H0hUYfEIIBJNJMWj2MXhwAx2iRsXq6urpdxVMQuXz+a4gYowJK8kRMMZQGVFoEIxajnDO272A6mnxuJALggD3A+jv5yWwKgBjLImF5gx4dnYWjo+PexaAmZkZ8bednR3xnJ6eFs/t7e2ee8bGxmBra+tfNCtgMnXM87wPiUSioPuWTsTDbdsWr7qpPc8DEorWG4YBu7u74tX3/Ypt20+lr4WpKUdRAGH2drtdHh0dxUUwPz8PruuKzRhc/aKa4sJxHNjY2BB7Tk5OPiSTyWVZx7uCS00nKhgogOW67tvx8fFneMDc3Bxsbm72BdMaXH90dPTecZwXMoqplFJxEelEQy2RJIBwQ6vVejMxMVFstVrv0un0q3MKyN1ms/k6lUo9Pzw8LKVSqZda/iJQ7VS6KpcugFo29ZLZ0ApIpkfJpGp1pmZfdEnoVqD7+LxLQr2PL+zDBmkErvxa1PMS/X6ljQAJcG2tT1ezt7yMqQlQLpf/e7N32t6urKzkCoXCOoKvor1FzrU09KLGX9a/MH8BY2i7RC/oNbMAAAAASUVORK5CYII='} />}
      <th
        ref={drop}
        {...props} >
        {/* layout checker */}
        <div ref={layoutRef} className={'layout-checker'}></div>
        {props.children}
        <span ref={drag} className='react-resizable-handle'></span>
      </th>
    </>
  );
};