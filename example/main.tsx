import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { OverflowList } from '../src';

const fruits = [
  'Apple',
  'Mango',
  'Banana',
  'Pear',
  'Grapefruit',
  'Orange',
  'Lime',
  'Lemon',
  'Jackfruit',
];

const renderItem = (item: string) => (
  <span key={item} className="item">
    {item}
  </span>
);

const renderOverflow = (items: string[]) => (
  <span className="more">+{items.length}</span>
);

function App() {
  const [items, setItems] = useState(fruits);
  const [minVisible, setMinVisible] = useState(0);

  return (
    <>
      <h1>react-overflow-list</h1>
      <p className="hint">
        Drag the bottom-right corner of each box to resize it.
      </p>
      <label>
        minVisibleItems:{' '}
        <input
          type="number"
          min={0}
          max={items.length}
          value={minVisible}
          onChange={(e) => setMinVisible(Number(e.target.value))}
        />
      </label>{' '}
      <button
        onClick={() => setItems([...items].sort(() => Math.random() - 0.5))}
      >
        Shuffle items
      </button>{' '}
      <button
        onClick={() => setItems(items.slice(0, -1))}
        disabled={!items.length}
      >
        Remove one
      </button>{' '}
      <button onClick={() => setItems(fruits)}>Reset</button>
      <h2>collapseFrom="end"</h2>
      <div className="box">
        <OverflowList
          items={items}
          minVisibleItems={minVisible}
          collapseFrom="end"
          itemRenderer={renderItem}
          overflowRenderer={renderOverflow}
        />
      </div>
      <h2>collapseFrom="start"</h2>
      <div className="box">
        <OverflowList
          items={items}
          minVisibleItems={minVisible}
          collapseFrom="start"
          itemRenderer={renderItem}
          overflowRenderer={renderOverflow}
        />
      </div>
      <h2>alwaysRenderOverflow</h2>
      <div className="box">
        <OverflowList
          items={items}
          alwaysRenderOverflow
          itemRenderer={renderItem}
          overflowRenderer={renderOverflow}
        />
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
