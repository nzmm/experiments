import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { PopoverProps, getContentStyle, getPath, getPositionStyle } from "./Popover.library";
import "./Popover.css";

const Popover = ({
  show = false,
  borderRadius = 6,
  arrowWidth = 28,
  arrowHeight = 16,
  arrowOffset = 0.5,
  margin = 15,
  offset = 8,
  anchor,
  children
}: PopoverProps) => {
  const svg = useRef<SVGSVGElement>(null);
  const [svgRect, setSvgRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));
  const [position, setPosition] = useState<React.CSSProperties>({});

  const { width, height } = svgRect;

  useLayoutEffect(() => {
    if (!show || !svg.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          setSvgRect(entry.contentRect);
        }
      }
    });

    setSvgRect(svg.current.getBoundingClientRect());
    observer.observe(svg.current);

    return () => {
      if (!svg.current) return;
      observer.unobserve(svg.current);
    };
  }, [show]);

  useLayoutEffect(() => {
    if (!show || !anchor?.current) {
      return;
    }

    const handleReposition = () => {
      const el = anchor.current as HTMLElement;
      const position = getPositionStyle(el, width, height, offset);
      setPosition(position);
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          handleReposition();
        }
      }
    });

    handleReposition();
    observer.observe(anchor.current);
    observer.observe(document.body);

    return () => {
      if (!anchor.current) return;
      observer.unobserve(anchor.current);
      observer.unobserve(document.body);
    };
  }, [width, height, show, anchor?.current]);

  const contentStyle = getContentStyle(margin, offset, arrowHeight);

  const d = useMemo(
    () =>
      getPath(
        offset,
        offset,
        width - offset,
        height - offset,
        borderRadius,
        arrowWidth,
        arrowHeight,
        arrowOffset
      ),
    [width, height, offset, borderRadius, arrowWidth, arrowHeight, arrowOffset]
  );

  return show ? (
    <div
      className={`popover ${anchor?.current ? "anchored" : ""}`}
      style={position}
    >
      <svg ref={svg} viewBox={`0 0 ${width} ${height}`}>
        <path d={d} />
      </svg>
      <div className="content" role="tooltip" style={contentStyle}>
        {children}
      </div>
    </div>
  ) : null;
};

export { Popover };
