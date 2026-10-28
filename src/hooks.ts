/**
 * Dependency-free ports of the handful of `react-use` hooks this library
 * used. Each one mirrors the upstream implementation (react-use@17.3.1) so
 * behaviour is identical; only the dev-mode console warnings were dropped.
 * `useShallowCompareLayoutEffect` deliberately deviates (see below).
 */
import {
  DependencyList,
  EffectCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const isBrowser = typeof window !== 'undefined';
const noop = () => {};

export const useIsomorphicLayoutEffect = isBrowser
  ? useLayoutEffect
  : useEffect;

// fast-shallow-equal
const isShallowEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (!(a instanceof Object) || !(b instanceof Object)) return false;
  const keys = Object.keys(a);
  const length = keys.length;
  for (let i = 0; i < length; i++) if (!(keys[i] in b)) return false;
  for (let i = 0; i < length; i++) if (a[keys[i]] !== b[keys[i]]) return false;
  return length === Object.keys(b).length;
};

const shallowEqualDepsList = (
  prevDeps: DependencyList,
  nextDeps: DependencyList
) => prevDeps.every((dep, index) => isShallowEqual(dep, nextDeps[index]));

// react-use/useShallowCompareEffect (via useCustomCompareEffect), but run as
// a layout effect so the measure/collapse loop settles before the browser
// paints. As a passive effect each intermediate step can be painted under
// React 18+ concurrent roots, which shows up as flicker while resizing.
export const useShallowCompareLayoutEffect = (
  effect: EffectCallback,
  deps: DependencyList
) => {
  const ref = useRef<DependencyList | undefined>(undefined);
  if (!ref.current || !shallowEqualDepsList(deps, ref.current)) {
    ref.current = deps;
  }
  useIsomorphicLayoutEffect(effect, ref.current);
};

// react-use/useMeasure
export type UseMeasureRect = Pick<
  DOMRectReadOnly,
  'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' | 'height' | 'width'
>;
export type UseMeasureRef<E extends Element = Element> = (element: E) => void;
export type UseMeasureResult<E extends Element = Element> = [
  UseMeasureRef<E>,
  UseMeasureRect,
];

const defaultState: UseMeasureRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

function useMeasureImpl<E extends Element = Element>(): UseMeasureResult<E> {
  const [element, ref] = useState<E | null>(null);
  const [rect, setRect] = useState<UseMeasureRect>(defaultState);

  const observer = useMemo(
    () =>
      new ResizeObserver((entries) => {
        if (entries[0]) {
          const { x, y, width, height, top, left, bottom, right } =
            entries[0].contentRect;
          setRect({ x, y, width, height, top, left, bottom, right });
        }
      }),
    []
  );

  useIsomorphicLayoutEffect(() => {
    if (!element) return;
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return [ref, rect];
}

export const useMeasure: <
  E extends Element = Element,
>() => UseMeasureResult<E> =
  isBrowser && typeof ResizeObserver !== 'undefined'
    ? useMeasureImpl
    : () => [noop, defaultState];
