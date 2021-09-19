import React from 'react';
import useResizeObserver from 'use-resize-observer';

type CollapseDirection = 'start' | 'end';
type OverflowDirection = 'none' | 'grow' | 'shrink';

export interface OverflowListProps<T> {
  items: T[];
  itemRenderer: (item: T, index: number) => React.ReactNode;
  overflowRenderer: (items: T[]) => React.ReactNode;
  minVisibleItems?: number;
  onOverflow?: (items: T[]) => void;
  collapseFrom?: CollapseDirection;
  className?: string;
  tagName?: keyof JSX.IntrinsicElements;
  alwaysRenderOverflow?: boolean;
}

interface OverflowListState<T> {
  visible: T[];
  overflow: T[];
  lastOverflowCount: number;
  overflowDirection: OverflowDirection;
}

export function OverflowList<T>(props: OverflowListProps<T>) {
  const {
    items,
    collapseFrom = 'start',
    // minVisibleItems = 0,
    tagName = 'div',
    className = '',
    alwaysRenderOverflow = false,
    overflowRenderer,
    itemRenderer,
  } = props;
  const [state] = React.useState<OverflowListState<T>>({
    visible: items,
    overflow: [],
    lastOverflowCount: 0,
    overflowDirection: 'none',
  });

  const spacer = React.useRef<HTMLDivElement>(null);

  const { ref } = useResizeObserver({
    onResize: ({ width }) => {
      console.log('Resize', width);
    },
  });

  const WrapperComponent = tagName;

  const maybeOverflow =
    state.overflow.length === 0 && alwaysRenderOverflow
      ? null
      : overflowRenderer(state.overflow);

  return (
    <>
      <div ref={ref}>
        <WrapperComponent className={className}>
          {collapseFrom === 'start' ? maybeOverflow : null}
          {state.visible.map(itemRenderer)}
          {collapseFrom === 'end' ? maybeOverflow : null}
          <div style={{ flexShrink: 1, width: 1 }} ref={spacer} />
        </WrapperComponent>
      </div>
    </>
  );
}
