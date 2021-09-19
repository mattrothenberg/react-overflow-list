import React from 'react';

export interface OverflowListProps<T> {
  items: T[];
}

export function OverflowList<T>(props: OverflowListProps<T>) {
  const { items } = props;
  return <div>Hey {items.length}</div>;
}
