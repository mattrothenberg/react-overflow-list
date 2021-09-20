# react-overflow-list

A hooks based implementation of the `OverflowList` component from [Blueprint JS](https://blueprintjs.com/docs/#core/components/overflow-list).


![ezgif-3-b0d519eb63c8](https://user-images.githubusercontent.com/5148596/134089559-81de1a38-06cd-4c84-8dd4-0937ca040edc.gif)


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
