import { useEffect, useId, useRef, useState } from "react";
import {
  CSSDimension,
  getPosition,
  getStyles,
  SplitterProps,
  SUPPORTED_KEYS
} from "./Splitter.library";
import "./Splitter.css";

let dragOwner: string | null = null;

const Splitter = ({
  orientation,
  children,
  minSize = "20%",
  initialPosition = "50%"
}: SplitterProps) => {
  const id = useId();
  const splitter = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string>("");
  const [position, setPosition] = useState<number | CSSDimension>(
    initialPosition
  );

  useEffect(() => {
    if (!splitter.current || !handle.current) {
      return;
    }

    const handleDragStart = (e: DragEvent) => {
      if (dragOwner) {
        return;
      }
      if (!e.dataTransfer || !splitter.current) {
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

      const pos = getPosition(e, orientation, splitter.current);
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

      const pos = getPosition(e, orientation, splitter.current);
      setPosition(pos);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      const parent = handle.current?.parentElement;
      if (!parent || !SUPPORTED_KEYS.has(e.key)) {
        return;
      }

      e.stopPropagation();
      const cs = getComputedStyle(parent);

      switch (`${orientation}.${e.key}`) {
        case "vertical.ArrowRight":
          setPosition(
            parent.offsetLeft -
              parseFloat(cs.paddingLeft) -
              parseFloat(cs.borderLeftWidth) +
              5
          );
          break;
        case "vertical.ArrowLeft":
          setPosition(
            parent.offsetLeft -
              parseFloat(cs.paddingLeft) -
              parseFloat(cs.borderLeftWidth) -
              5
          );
          break;
        case "horizontal.ArrowUp":
          setPosition(
            parent.offsetTop -
              parseFloat(cs.paddingTop) -
              parseFloat(cs.borderTopWidth) -
              5
          );
          break;
        case "horizontal.ArrowDown":
          setPosition(
            parent.offsetTop -
              parseFloat(cs.paddingTop) -
              parseFloat(cs.borderTopWidth) +
              5
          );
          break;
        default:
          return;
      }
    };

    setPosition(initialPosition);

    splitter.current.addEventListener("dragstart", handleDragStart);
    splitter.current.addEventListener("dragend", handleDragEnd);
    splitter.current.addEventListener("dragover", handleDragOver);
    handle.current.addEventListener("keydown", handleKeyPress);

    return () => {
      if (!splitter.current || !handle.current) {
        return;
      }

      splitter.current.removeEventListener("dragstart", handleDragStart);
      splitter.current.removeEventListener("dragend", handleDragEnd);
      splitter.current.removeEventListener("dragover", handleDragOver);
      handle.current.removeEventListener("keypress", handleKeyPress);
    };
  }, [initialPosition]);

  const [styleA, styleB] = getStyles(orientation, position, minSize);

  return (
    <div className={`split ${orientation}`} ref={splitter}>
      <div className="side a" style={styleA}>
        {children[0]}
      </div>

      <div className="separator">
        <div
          className={`handle ${dragging}`}
          draggable
          tabIndex={0}
          ref={handle}
        />
      </div>

      <div className="side b" style={styleB}>
        {children[1]}
      </div>
    </div>
  );
};

export { Splitter };
