type Unit = "%" | "px" | "em" | "vw" | "vh";

type CSSDimension = `${number}${Unit}`;

type Orientation = "vertical" | "horizontal";

type SplitterProps = {
  /**
   * The orientation of the splitter handle.
   */
  orientation: Orientation;

  /**
   * The initial position of the splitter handle.
   */
  initialPosition?: number | CSSDimension;

  /**
   * The smallest size that a child can have.
   */
  minSize?: number | CSSDimension;

  /**
   * The component must be supplied with exactly two children.
   * The first child will occupy `side a` and the second child will occupy `side b`.
   */
  children: [React.ReactNode, React.ReactNode];
};

const SUPPORTED_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
]);

const getPosition = (
  e: DragEvent,
  orientation: Orientation,
  splitter: HTMLDivElement
) => {
  return orientation === "vertical"
    ? e.clientX - splitter.offsetLeft
    : e.clientY - splitter.offsetTop;
};

const getStyles = (
  orientation: Orientation,
  position: number | CSSDimension,
  minSize: number | CSSDimension
) => {
  return orientation === "vertical"
    ? [{ width: position, minWidth: minSize }, { minWidth: minSize }]
    : [{ height: position, minHeight: minSize }, { minHeight: minSize }];
};

export { SUPPORTED_KEYS, getPosition, getStyles };
export type { CSSDimension, SplitterProps };
