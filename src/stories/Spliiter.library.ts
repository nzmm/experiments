type SplitterProps = {
  orientation: "vertical" | "horizontal";
  initialPosition?: number | string;
  minSize?: number | string;
  children: [React.ReactNode, React.ReactNode];
};

const getPosition = (
  orientation: "vertical" | "horizontal",
  e: DragEvent,
  splitter: HTMLDivElement
) => {
  return orientation === "vertical"
    ? e.clientX - splitter.offsetLeft
    : e.clientY - splitter.offsetTop;
};

const getStyles = (
  orientation: "vertical" | "horizontal",
  position: string | number,
  minSize: string | number
) => {
  return orientation === "vertical"
    ? [{ width: position, minWidth: minSize }, { minWidth: minSize }]
    : [{ height: position, minHeight: minSize }, { minHeight: minSize }];
};

export { getPosition, getStyles };
export type { SplitterProps };
