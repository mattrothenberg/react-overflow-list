import React from 'react';
import { Meta, Story } from '@storybook/react';
import { OverflowList, OverflowListProps } from '../src';

const meta: Meta = {
  title: 'OverflowList',
  component: OverflowList,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story<OverflowListProps<string>> = (args) => (
  <OverflowList {...args} />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  collapseFrom: 'end',
  minVisibleItems: 0,
  items: [
    'Apple',
    'Mango',
    'Banana',
    'Pear',
    'Grapefruit',
    'Orange',
    'Lime',
    'Lemon',
    'Jackfruit',
  ],
  overflowRenderer: (items) => {
    return (
      <div>
        <span
          style={{
            padding: 4,
            background: 'tomato',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          + {items.length} more
        </span>
      </div>
    );
  },
  itemRenderer: (item, index) => {
    return (
      <div key={index}>
        <span
          style={{
            marginRight: 8,
            padding: 4,
            background: 'cornflowerblue',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          {item}
        </span>
      </div>
    );
  },
};
