import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Resizable } from 're-resizable';
import { MdDragHandle } from 'react-icons/md';
import { OverflowList, OverflowListProps } from '../src';

const meta: Meta = {
  title: 'OverflowList',
  component: OverflowList,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story<OverflowListProps<string>> = (args) => {
  return (
    <div className="bg-gray-700">
      <Resizable
        defaultSize={{ width: 200, height: 'auto' }}
        maxWidth="100%"
        minWidth={64}
        enable={{
          right: true,
        }}
        handleStyles={{
          right: {
            right: 2,
          },
        }}
        handleComponent={{
          right: (
            <div className="bg-gray-100 h-full border-l border-gray-200 opacity-100 w-3 flex items-center justify-center">
              <span className="text-gray-400 rotate rotate-90">
                <MdDragHandle />
              </span>
            </div>
          ),
        }}
        className="border border-gray-200 py-2 pl-2 overflow-hidden pr-4 bg-white"
      >
        <OverflowList {...args} />
      </Resizable>
    </div>
  );
};

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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
          + {items.length} more
        </span>
      </div>
    );
  },
  itemRenderer: (item, index) => {
    return (
      <div className="mr-2" key={index}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {item}
        </span>
      </div>
    );
  },
};
