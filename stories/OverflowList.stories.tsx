import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Resizable } from 're-resizable';
import { MdDragHandle } from 'react-icons/md';
import * as Popover from '@radix-ui/react-popover';
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
        className="border border-gray-200 py-2 pl-2 pr-4 bg-white"
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
      <Popover.Root>
        <Popover.Trigger className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 whitespace-nowrap">
          + {items.length} more
        </Popover.Trigger>
        <Popover.Anchor />
        <Popover.Content className="bg-white border border-gray-200 shadow-lg w-64 p-2 rounded-lg flex flex-col space-y-2">
          {items.map((item, index) => {
            return (
              <div key={index}>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
                  {item}
                </span>
              </div>
            );
          })}
          <Popover.Arrow fill="white" />
        </Popover.Content>
      </Popover.Root>
    );
  },
  itemRenderer: (item, index) => {
    return (
      <div className="mr-2" key={index}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
          {item}
        </span>
      </div>
    );
  },
};
