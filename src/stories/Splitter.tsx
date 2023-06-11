import { useEffect, useRef, useState } from "react";

import "./spliiter.css";

const Splitter = ({
  left: Left,
  right: Right,
  initialX = "50%",
  minWidth = "20%"
}: {
  left: () => React.ReactElement<unknown>;
  right: () => React.ReactElement<unknown>;
  initialX?: number | string;
  minWidth?: number | string;
}) => {
  const splitter = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string>("");
  const [x, setX] = useState<number | string>(initialX);

  useEffect(() => {
    if (!splitter.current) {
      return;
    }

    const handleDragStart = (e: DragEvent) => {
      if (!e.dataTransfer || !splitter.current) {
        return;
      }

      setDragging("dragging");
      e.dataTransfer?.setDragImage(splitter.current, -99999, -99999);
    };

    const handleDragEnd = (e: DragEvent) => {
      if (!splitter.current) {
        return;
      }

      setDragging("");
      setX(e.clientX - splitter.current.offsetLeft);
    };

    const handleDragOver = (e: DragEvent) => {
      if (!splitter.current) {
        return;
      }

      setX(e.clientX - splitter.current.offsetLeft);
    };

    setX(initialX);

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
  }, [initialX]);

  return (
    <div className="splitter" ref={splitter}>
      <div className="side l" style={{ width: x, minWidth }}>
        <Left />
      </div>

      <div className="separator">
        <div className={`handle ${dragging}`} draggable tabIndex={0} />
      </div>

      <div className="side r" style={{ minWidth }}>
        <Right />
      </div>
    </div>
  );
};

export { Splitter };
