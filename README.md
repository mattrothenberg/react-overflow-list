# react-overflow-list

A hooks based implementation of the `OverflowList` component from [Blueprint JS](https://blueprintjs.com/docs/#core/components/overflow-list).

## Installation

```
yarn add react-overflow-list
```

### Basic Usage

```jsx
import { OverflowList } from 'react-overflow-list';

const ItemRenderer = (item, index) => {
  return <span key={index}>{item}</span>;
};

const OverflowRenderer = (items) => {
  return <span>+ {items.length} more</span>;
};

export function App() {
  const [items] = React.useState(['Apple', 'Banana', 'Orange']);

  return (
    <OverflowList
      collapseFrom="end"
      minVisibleItems={0}
      items={items}
      itemRenderer={ItemRenderer}
      overflowRenderer={OverflowRenderer}
    />
  );
}
```
