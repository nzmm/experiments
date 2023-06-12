import { useEffect, useId, useRef, useState } from "react";
import { getPosition, getStyles, SplitterProps } from "./Splitter.library";
import "./splitter.css";

let dragOwner: string | null = null;

const Splitter = ({
  orientation,
  children,
  minSize = "20%",
  initialPosition = "50%"
}: SplitterProps) => {
  const id = useId();
  const splitter = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string>("");
  const [position, setPosition] = useState<number | string>(initialPosition);

  useEffect(() => {
    if (!splitter.current) {
      return;
    }

    const handleDragStart = (e: DragEvent) => {
      if (!e.dataTransfer || !splitter.current) {
        return;
      }
      if (dragOwner) {
        return;
      }

      e.stopPropagation();
      e.dataTransfer?.setDragImage(splitter.current, -99999, -99999);
      dragOwner = id;

      setDragging("dragging");
    };

    const handleDragEnd = (e: DragEvent) => {
      if (!splitter.current) {
        return;
      }
      if (id !== dragOwner) {
        return;
      }

      e.stopPropagation();
      dragOwner = null;

      const pos = getPosition(orientation, e, splitter.current);
      setPosition(pos);
      setDragging("");
    };

    const handleDragOver = (e: DragEvent) => {
      if (!splitter.current) {
        return;
      }
      if (id !== dragOwner) {
        return;
      }

      e.stopPropagation();

      const pos = getPosition(orientation, e, splitter.current);
      setPosition(pos);
    };

    setPosition(initialPosition);

    splitter.current.addEventListener("dragstart", handleDragStart);
    splitter.current.addEventListener("dragend", handleDragEnd);
    splitter.current.addEventListener("dragover", handleDragOver);

    return () => {
      if (!splitter.current) {
        return;
      }

      splitter.current.removeEventListener("dragstart", handleDragStart);
      splitter.current.removeEventListener("dragend", handleDragEnd);
      splitter.current.removeEventListener("dragover", handleDragOver);
    };
  }, [initialPosition]);

  const [styleA, styleB] = getStyles(orientation, position, minSize);

  return (
    <div className={`split ${orientation}`} ref={splitter}>
      <div className="side a" style={styleA}>
        {children[0]}
      </div>

      <div className="separator">
        <div className={`handle ${dragging}`} draggable tabIndex={0} />
      </div>

      <div className="side b" style={styleB}>
        {children[1]}
      </div>
    </div>
  );
};

export { Splitter };
