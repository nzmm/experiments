import { PropsWithChildren } from "react";

interface IVirtualListItem {
  /**
   * The height of the list item
   */
  height: number;
}

interface IVisibleItem<T extends IVirtualListItem = IVirtualListItem> {
  i: number;
  y: number;
  data: T;
}

type ListItemRenderer<T extends IVirtualListItem> = (
  props: PropsWithChildren & T
) => React.ReactElement<T>;

type VirtualListProps<T extends IVirtualListItem> = {
  /**
   * The list items to be rendered.
   */
  items: T[];

  /**
   * A component to render each list item.
   */
  renderer: ListItemRenderer<T>;
};

type VirtualListItemProps = PropsWithChildren & {
  index: number;
  top: number;
  height: number;
  onFocus: (i: number) => void;
};

type VisibleResult<T extends IVirtualListItem> = [
  IVisibleItem<T>[],
  NumericRange,
  NumericRange,
  boolean
];

type NumericRange = [number, number];

const getHeight = (data: IVirtualListItem[]) =>
  data.reduce((acc, cur) => acc + cur.height, 0);

const NO_UPDATE: VisibleResult<any> = [[], [0, 0], [0, 0], false];

const getVisibleUpward = <T extends IVirtualListItem>(
  items: T[],
  imin: number,
  pmin: number,
  pmax: number,
  topOffset: number,
  topExtent: number,
  force = false
): VisibleResult<T> => {
  const updateRequired =
    force || pmin + items[imin].height < topOffset || pmax <= topExtent;

  if (!updateRequired) {
    return NO_UPDATE;
  }

  let y = pmin;
  const visible: IVisibleItem<T>[] = [];

  for (let i = imin; i < items.length; i++) {
    const data = items[i];

    if (y + data.height <= topOffset) {
      y += data.height;
      continue;
    }

    if (y > topExtent) {
      break;
    }

    visible.push({ i, y, data });
    y += data.height;
  }

  const [ir, pr] = getVisibleRanges(visible);

  return [visible, ir, pr, true];
};

const getVisibleDownward = <T extends IVirtualListItem>(
  items: T[],
  imax: number,
  pmin: number,
  pmax: number,
  topOffset: number,
  topExtent: number
): VisibleResult<T> => {
  const updateRequired =
    topOffset <= pmin || topExtent < pmax - items[imax].height;

  if (!updateRequired) {
    return NO_UPDATE;
  }

  let y = pmax;
  const visible: IVisibleItem<T>[] = [];

  for (let i = imax; i >= 0; i--) {
    const data = items[i];

    if (y - data.height >= topExtent) {
      y -= data.height;
      continue;
    }

    if (y < topOffset) {
      break;
    }

    y -= data.height;
    visible.unshift({ i, y, data });
  }

  const [ir, pr] = getVisibleRanges(visible);

  return [visible, ir, pr, true];
};

const getVisible = (
  items: IVirtualListItem[],
  indexRange: NumericRange,
  pixelRange: NumericRange,
  topOffset: number,
  scrollDelta: number,
  clientHeight: number
) => {
  if (!items) {
    return NO_UPDATE;
  }

  const [imin, imax] = indexRange;
  const [pmin, pmax] = pixelRange;

  const topExtent = topOffset + clientHeight;

  return scrollDelta >= 0
    ? // upward scrolling (down arrow clicked)
      getVisibleUpward(
        items,
        imin,
        pmin,
        pmax,
        topOffset,
        topExtent,
        scrollDelta === 0
      )
    : // downward scrolling (up arrow clicked)
      getVisibleDownward(items, imax, pmin, pmax, topOffset, topExtent);
};

const getVisibleRanges = (v: IVisibleItem[]): [NumericRange, NumericRange] => {
  const min = v[0];
  const max = v[v.length - 1];
  const indexRange: NumericRange = [min.i, max.i];
  const pixelRange: NumericRange = [min.y, max.y + max.data.height];
  return [indexRange, pixelRange];
};

export { getHeight, getVisible };
export type {
  NumericRange,
  VirtualListProps,
  VirtualListItemProps,
  ListItemRenderer,
  IVirtualListItem,
  IVisibleItem
};
