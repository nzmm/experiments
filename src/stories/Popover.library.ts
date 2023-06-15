import React, { ForwardedRef, MutableRefObject } from "react";

type PopoverProps = React.PropsWithChildren & {
  /**
   * Optional element id.
   */
  id?: string;

  /**
   * When true displays the popover.
   */
  show?: boolean;

  /**
   * The width of the arrow point in pixels.
   */
  arrowWidth?: number;

  /**
   * The height of the arrow point in pixels.
   */
  arrowHeight?: number;

  /**
   * The value of the arrow offset.
   * It should be a float value between 0 and 1. Defaults to 0.5.
   */
  arrowOffset?: number;

  /**
   * The border radius (in pixels) of the popover corners.
   */
  borderRadius?: number;

  /**
   * The value in pixels to offset the popover, to allow for dropshadows.
   */
  offset?: number;

  /**
   * The value in pixels of the popover content margin.
   */
  margin?: number;

  /**
   * Optional ref to an anchor element.
   */
  subject?: React.RefObject<HTMLElement>;
};

type Refs = ForwardedRef<unknown> | MutableRefObject<unknown> | null;

const refs = (...refs: Refs[]) => {
  return (el: HTMLElement | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      ref instanceof Function ? ref(el) : (ref.current = el);
    }
  };
};

const getPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  br: number,
  aw: number,
  ah: number,
  ao: number,
  po = 1
) => {
  return `
    M${x + po} ${y + br}
    Q${x + po} ${y + po} ${br + x} ${po + y}
    H${w - br - po}
    Q${w - po} ${y + po} ${w - po} ${y + br}
    V${h - br - ah - po}
    Q${w - po} ${h - ah - po} ${w - br - po} ${h - ah - po}
    H${w * ao + aw / 2 - po}
    L${w * ao} ${h - po}
    L${w * ao - aw / 2 + po} ${h - ah}
    H${x + br + po}
    Q${x + po} ${h - ah - po} ${x + po} ${h - ah - br - po}
    Z`;
};

const getContentStyle = (m: number, so: number, ah: number) => {
  return {
    margin: m + so,
    marginBottom: ah + m + so
  };
};

const getPositionStyle = (
  el: HTMLElement,
  width: number,
  height: number,
  offset: number,
  gap = 2
) => {
  // top center
  return {
    left: el.offsetLeft + (offset + el.offsetWidth - width) / 2,
    top: el.offsetTop - height + offset - gap
  };
};

export { refs, getPath, getContentStyle, getPositionStyle };
export type { PopoverProps };
