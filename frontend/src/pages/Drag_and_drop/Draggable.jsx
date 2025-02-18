import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export funxtion Droppable(props){
  const {isOver,setNodeRef} = useDroppable({
    id:propd.id
  });
  const style = {
    opacity:isOver? 1:0.5,
  };
  <div ref={setNodeRef} style={style}>
  {props.children}
</div>
}
