import React, { useLayoutEffect, useRef, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';

export const ResizableColumnTitle = (
  props: React.HTMLAttributes<any> & {
    onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void;
    width: number;
  },
) => {
  const layoutRef = useRef(null);
  const timerRef = useRef<any>(null);
  const [initialWidth] = useState(200);

  const { onResize, width, ...restProps } = props;

  useLayoutEffect(() => {
    if (!!!width && layoutRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onResize?.({} as any, { size: { width: (layoutRef.current as any).offsetWidth } } as any)
      }, 200)
    }
  });

  return (
    <Resizable
      width={width || initialWidth}
      height={0}
      minConstraints={[50, 0]}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th ref={layoutRef}
        {...restProps} />
    </Resizable>
  );
};