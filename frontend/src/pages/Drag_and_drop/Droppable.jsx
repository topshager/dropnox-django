import React from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    border: isOver ? "2px dashed green" : "2px dashed gray",
    padding: "20px",
    minHeight: "100px",
    textAlign: "center",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
