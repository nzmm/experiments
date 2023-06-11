import { PropsWithChildren } from "react";

interface IVirtualListItem {
    height: number;
}

interface IVisibleItem<T extends IVirtualListItem = IVirtualListItem> {
    i: number;
    y: number;
    data: T;
}

type ListItemRenderer<T extends IVirtualListItem> = (props: PropsWithChildren & T) => React.ReactElement<T>;

type VirtualListProps<T extends IVirtualListItem> = {
    /**
     * The list items to be rendered.
     */
    items: T[];

    /**
     * A component to render each list item.
     */
    renderer: ListItemRenderer<T>;
}

type VirtualListItemProps = PropsWithChildren & {
    index: number;
    top: number;
    height: number;
    onFocus: (i: number) => void;
}

type VisibleResult<T extends IVirtualListItem> = [IVisibleItem<T>[], NumericRange, NumericRange, boolean];

type NumericRange = [number, number];

const getHeight = (data: IVirtualListItem[]) => data.reduce((acc, cur) => acc + cur.height, 0);

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
    const updateRequired = force || (pmin + items[imin].height) < topOffset || pmax <= topExtent;

    if (!updateRequired) {
        return NO_UPDATE;
    }

    let yo = pmin;
    const visible: IVisibleItem<T>[] = [];

    for (let index = imin; index < items.length; index++) {       
        const it = items[index];

        const above = (yo + it.height) >= topOffset;
        if (!above) {
            yo += it.height;
            continue;
        }

        const beneath = yo <= topExtent;
        if (!beneath) break;

        visible.push({ i: index, y: yo, data: it });
        yo += it.height;
    }

    const [ir, pr] = getVisibleRanges(visible);

    return [visible, ir, pr, true];
}

const getVisibleDownward = <T extends IVirtualListItem>(
    items: T[],
    imax: number,
    pmin: number,
    pmax: number,
    topOffset: number,
    topExtent: number
): VisibleResult<T> => {
    const updateRequired = (topOffset <= pmin || topExtent < (pmax - items[imax].height));

    if (!updateRequired) {
        return NO_UPDATE;
    }

    let yo = pmax;
    const visible: IVisibleItem<T>[] = [];

    for (let index = imax; index >= 0; index--) {       
        const it = items[index];    

        const above = (yo - it.height) < topExtent;
        if (!above) {
            yo -= it.height;
            continue;
        }

        const beneath = yo >= topOffset;
        if (!beneath) {
            break;
        }

        yo -= it.height;
        visible.unshift({ i: index, y: yo, data: it });
    }

    const [ir, pr] = getVisibleRanges(visible);

    return [visible, ir, pr, true];
}

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
        // upward scrolling (down arrow clicked)
        ? getVisibleUpward(items, imin, pmin, pmax, topOffset, topExtent, scrollDelta === 0)
        // downward scrolling (up arrow clicked)
        : getVisibleDownward(items, imax, pmin, pmax, topOffset, topExtent);
}

const getVisibleRanges = (v: IVisibleItem[]): [NumericRange, NumericRange] => {
    const min = v[0];
    const max = v[v.length - 1];
    const indexRange: NumericRange = [min.i, max.i];
    const pixelRange: NumericRange = [min.y, max.y + max.data.height]
    return [indexRange, pixelRange];
}

export { getHeight, getVisible }
export type { NumericRange, VirtualListProps, VirtualListItemProps, ListItemRenderer, IVirtualListItem, IVisibleItem }