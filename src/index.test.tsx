import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { OverflowList } from './index';

const items = ['Apple', 'Banana', 'Orange', 'Pear'];

function mount(ui: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(ui, container);
  });
  return {
    container,
    rerender: (next: React.ReactElement) =>
      act(() => {
        ReactDOM.render(next, container);
      }),
    unmount: () => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    },
  };
}

const visibleText = (el: HTMLElement) =>
  Array.from(el.querySelectorAll('[data-item]')).map((n) => n.textContent);

const renderList = (
  props: Partial<React.ComponentProps<typeof OverflowList<string>>> = {}
) => (
  <OverflowList
    items={items}
    itemRenderer={(item) => (
      <span key={item} data-item>
        {item}
      </span>
    )}
    overflowRenderer={(overflow) => (
      <span data-overflow>+{overflow.length}</span>
    )}
    {...props}
  />
);

// jsdom has no layout engine, so getBoundingClientRect() is all zeros. That
// makes the spacer read as "squeezed", which drives the collapse loop.
describe('OverflowList', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('collapses items one at a time until minVisibleItems is reached', () => {
    const { container, unmount } = mount(renderList({ minVisibleItems: 2 }));
    expect(visibleText(container)).toEqual(['Apple', 'Banana']);
    expect(container.querySelector('[data-overflow]')?.textContent).toBe('+2');
    unmount();
  });

  it('collapses from the start when collapseFrom="start"', () => {
    const { container, unmount } = mount(
      renderList({ minVisibleItems: 1, collapseFrom: 'start' })
    );
    expect(visibleText(container)).toEqual(['Pear']);
    unmount();
  });

  it('shows everything when the spacer has room', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 1,
    } as DOMRect);
    const { container, unmount } = mount(renderList());
    expect(visibleText(container)).toEqual(items);
    expect(container.querySelector('[data-overflow]')).toBeNull();
    unmount();
  });

  it('renders the overflow slot when alwaysRenderOverflow is set', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 1,
    } as DOMRect);
    const { container, unmount } = mount(
      renderList({ alwaysRenderOverflow: true })
    );
    expect(container.querySelector('[data-overflow]')?.textContent).toBe('+0');
    unmount();
  });

  it('resets and re-partitions when items change', () => {
    const { container, rerender, unmount } = mount(
      renderList({ minVisibleItems: 1 })
    );
    expect(visibleText(container)).toEqual(['Apple']);
    rerender(renderList({ minVisibleItems: 1, items: ['Kiwi', 'Lime'] }));
    expect(visibleText(container)).toEqual(['Kiwi']);
    expect(container.querySelector('[data-overflow]')?.textContent).toBe('+1');
    unmount();
  });

  it('respects the tagName prop', () => {
    const { container, unmount } = mount(renderList({ tagName: 'ul' }));
    expect(container.firstElementChild?.tagName).toBe('UL');
    unmount();
  });
});
