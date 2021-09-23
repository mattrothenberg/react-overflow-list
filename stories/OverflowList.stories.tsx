import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Resizable, ResizableProps } from 're-resizable';
import { MdDragHandle } from 'react-icons/md';

import * as Popover from '@radix-ui/react-popover';
import BoringAvatar from 'boring-avatars';
import faker from 'faker';
import TagsInput from 'react-tagsinput';
import { useClickAway } from 'react-use';
import cc from 'classcat';
import { OverflowList, OverflowListProps } from '../src';

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

const meta: Meta = {
  title: 'OverflowList',
  component: OverflowList,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const HandleComponent = () => {
  return (
    <div className="bg-gray-100 h-full border-l border-gray-200 opacity-100 w-3 flex items-center justify-center">
      <span className="text-gray-400 rotate rotate-90">
        <MdDragHandle />
      </span>
    </div>
  );
};

const ResizableBox: React.FC<ResizableProps> = ({ children, ...rest }) => {
  return (
    <div className="bg-gray-700">
      <Resizable
        defaultSize={{ width: 200, height: 'auto' }}
        maxWidth="100%"
        {...rest}
        enable={{
          right: true,
        }}
        handleStyles={{
          right: {
            right: 2,
          },
        }}
        handleComponent={{
          right: <HandleComponent />,
        }}
        className="border border-gray-200 py-2 pl-2 pr-4 bg-white overflow-hidden flex-shrink-0"
      >
        {children}
      </Resizable>
    </div>
  );
};

const Template: Story<OverflowListProps<string>> = (args) => {
  return (
    <ResizableBox>
      <OverflowList {...args} />
    </ResizableBox>
  );
};

export const Default = Template.bind({});

Default.args = {
  collapseFrom: 'end',
  minVisibleItems: 1,
  items: fruits,
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

function makeRandomNames(size = 10) {
  let arr = [];
  for (var i = 0; i < size; i++) {
    arr.push(faker.name.findName());
  }
  return arr;
}

const randomNames = makeRandomNames(10);

export const Avatar = Template.bind({});

Avatar.args = {
  items: randomNames,
  minVisibleItems: 1,
  itemRenderer: (item, index) => {
    return (
      <div
        key={index}
        className="flex-shrink-0 -ml-1 ring-4 ring-white rounded-full"
      >
        <BoringAvatar size={40} variant="beam" name={item} />
      </div>
    );
  },
  overflowRenderer: (items) => {
    return (
      <div className="flex-shrink-0 rounded-full w-[40px] h-[40px] bg-gray-200 flex items-center justify-center ml-2 text-xs font-bold text-gray-700">
        + {items.length}
      </div>
    );
  },
};

const Chip: React.FC<TagsInput.RenderTagProps<string>> = ({
  key,
  getTagDisplayValue,
  tag,
  disabled,
  onRemove,
}) => {
  return (
    <div key={key}>
      <span className="inline-flex whitespace-nowrap items-center py-0.5 pl-2 pr-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700 mr-2">
        {getTagDisplayValue(tag)}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onRemove(key);
          }}
          className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-pink-400 hover:bg-pink-200 hover:text-pink-500 focus:outline-none focus:bg-pink-500 focus:text-white"
        >
          <span className="sr-only">{getTagDisplayValue(tag)}</span>
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </button>
      </span>
    </div>
  );
};

const ChipLayout: React.FC<{
  tags: React.ReactElement[];
  input: React.ReactElement;
}> = ({ tags, input, ...rest }) => {
  const { isOpen, setIsOpen } = React.useContext(TagInputContext);
  const ref = React.useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <div
      tabIndex={0}
      ref={ref}
      onFocus={() => {
        setIsOpen(true);
      }}
      className={cc('')}
    >
      {isOpen ? (
        <div className="flex justify-between">
          <div className="flex-1 flex flex-wrap">
            {tags}
            {input}
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <OverflowList
            {...rest}
            className="w-full"
            items={tags}
            itemRenderer={(item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            )}
            overflowRenderer={(items) => (
              <div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  +{items.length} more fruits
                </span>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

type TagInputContext = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const TagInputContext = React.createContext<TagInputContext>({
  isOpen: false,
  setIsOpen: () => {},
});

const TagInputProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <TagInputContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </TagInputContext.Provider>
  );
};

const ChipInput = React.forwardRef<
  HTMLInputElement,
  TagsInput.RenderInputProps<string>
>((props, ref) => {
  const { isOpen, setIsOpen } = React.useContext(TagInputContext);
  const { onChange, value, addTag, ...other } = props;
  const inputClass = isOpen
    ? 'focus:outline-none'
    : 'absolute inset-0 w-full h-full bg-transparent';

  return (
    <input
      {...other}
      autoFocus
      className={inputClass}
      onFocus={() => setIsOpen(true)}
      ref={ref}
      type="text"
      placeholder={isOpen ? 'Add a tag' : ''}
      onChange={onChange}
      value={value}
    />
  );
});

const TagInputTemplate: Story<OverflowListProps<string>> = (args) => {
  const [items, setItems] = useState(args.items);

  return (
    <TagInputProvider>
      <ResizableBox defaultSize={{ width: '100%', height: 'auto' }}>
        <TagsInput
          className="focus-within:ring ring-offset-4"
          renderTag={Chip}
          renderLayout={(tags, input) => (
            <ChipLayout tags={tags} input={input} {...args} />
          )}
          renderInput={(props) => <ChipInput {...props} />}
          value={items}
          onChange={setItems}
        />
      </ResizableBox>
    </TagInputProvider>
  );
};

export const TagInput = TagInputTemplate.bind({});

TagInput.args = {
  minVisibleItems: 1,
  items: fruits,
};
