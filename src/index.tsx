import React from 'react';
import {
  useIsomorphicLayoutEffect,
  useMeasure,
  useShallowCompareLayoutEffect,
} from './hooks';

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
  tagName?: keyof React.JSX.IntrinsicElements;
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
    collapseFrom = 'end',
    minVisibleItems = 0,
    tagName = 'div',
    className = '',
    alwaysRenderOverflow = false,
    overflowRenderer,
    itemRenderer,
  } = props;
  const [state, setState] = React.useState<OverflowListState<T>>({
    visible: items,
    overflow: [],
    lastOverflowCount: 0,
    overflowDirection: 'none',
  });

  const spacer = React.useRef<HTMLDivElement>(null);

  // Layout effects throughout: repartitioning measures the DOM and may take
  // several renders to settle, all of which must happen before paint.
  const previousDirection = React.useRef(state.overflowDirection);
  useShallowCompareLayoutEffect(() => {
    repartition(false);

    // A resize has just settled (transition back to 'none'): report the new
    // overflow if it differs from what it was before the resize started.
    const { overflowDirection, overflow, lastOverflowCount } = state;
    if (
      overflowDirection === 'none' &&
      overflowDirection !== previousDirection.current &&
      overflow.length !== lastOverflowCount
    ) {
      props.onOverflow?.(overflow.slice());
    }
    previousDirection.current = overflowDirection;
  }, [state]);

  const isFirstRender = React.useRef(true);
  useIsomorphicLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setState(() => ({
      overflowDirection: 'none',
      lastOverflowCount: 0,
      overflow: [],
      visible: items,
    }));
  }, [items]);

  const WrapperComponent = tagName;

  const maybeOverflow =
    state.overflow.length === 0 && !alwaysRenderOverflow
      ? null
      : overflowRenderer(state.overflow);

  const repartition = (growing: boolean) => {
    if (!spacer.current) {
      return;
    }

    if (growing) {
      setState((state) => ({
        overflowDirection: 'grow',
        lastOverflowCount:
          state.overflowDirection === 'none'
            ? state.overflow.length
            : state.lastOverflowCount,
        overflow: [],
        visible: props.items,
      }));
    } else if (spacer.current.getBoundingClientRect().width < 0.9) {
      setState((state) => {
        // Can't collapse any further: treat the resize as settled.
        const settled: OverflowListState<T> =
          state.overflowDirection === 'none'
            ? state
            : { ...state, overflowDirection: 'none' };
        if (state.visible.length <= minVisibleItems!) {
          return settled;
        }
        const collapseFromStart = collapseFrom === 'start';
        const visible = state.visible.slice();
        const next = collapseFromStart ? visible.shift() : visible.pop();
        if (!next) {
          return settled;
        }
        const overflow = collapseFromStart
          ? [...state.overflow, next]
          : [next, ...state.overflow];
        return {
          ...state,
          // Shrink unless a grow is already in progress, in which case keep
          // shrinking until we fit and then report the overflow.
          overflowDirection:
            state.overflowDirection === 'none'
              ? 'shrink'
              : state.overflowDirection,
          lastOverflowCount:
            state.overflowDirection === 'none'
              ? state.overflow.length
              : state.lastOverflowCount,
          overflow,
          visible,
        };
      });
    } else {
      setState((prevState) => {
        return { ...prevState, overflowDirection: 'none' };
      });
    }
  };

  const [ref, { width }] = useMeasure<any>();
  const previousWidth = React.useRef(width);

  useIsomorphicLayoutEffect(() => {
    const prev = previousWidth.current;
    previousWidth.current = width;
    if (!prev || width === prev) return;

    repartition(width > prev);
  }, [width]);

  return (
    <WrapperComponent
      // @ts-ignore
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        minWidth: 0,
      }}
    >
      {collapseFrom === 'start' ? maybeOverflow : null}
      {state.visible.map(itemRenderer)}
      {collapseFrom === 'end' ? maybeOverflow : null}
      <div style={{ flexShrink: 1, width: 1 }} ref={spacer} />
    </WrapperComponent>
  );
}
