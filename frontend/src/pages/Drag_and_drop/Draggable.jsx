import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

export function Draggable({ id, children }) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
    {children}
  </div>
  );
}
