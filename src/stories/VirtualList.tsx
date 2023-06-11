import { useEffect, useRef, useState, useCallback } from 'react';
import {
    IVirtualListItem,
    IVisibleItem,
    NumericRange,
    ListItemRenderer,
    VirtualListItemProps,
    VirtualListProps,
    getHeight,
    getVisible
} from './VirtualList.library';

import './virtuallist.css';

const VirtualListItem = ({ index, top, height, onFocus, children }: VirtualListItemProps) => {
    return (
        <li tabIndex={0} style={{ top, height }} onFocusCapture={() => onFocus(index)}>
            {children}
        </li>);
}

/**
 * A list component which renders only the visible items.
 */
const VirtualList = <T extends IVirtualListItem>({ items, renderer: ItemRenderer }: VirtualListProps<T>) => {
    const vlist = useRef<HTMLDivElement>(null);
    const scrollTop = useRef<number>(0);
    const indexRange = useRef<NumericRange>([0, 0]);
    const pixelRange = useRef<NumericRange>([0, 0]);

    const [height, setHeight] = useState<number>(0);
    const [visible, setVisible] = useState<IVisibleItem<T>[]>([]);

    useEffect(() => {
        if (vlist.current == null) {
            return;
        }

        const handleScroll = () => {
            const [vis, ir, pr, update] = getVisible(
                items,
                indexRange.current,
                pixelRange.current,
                vlist.current!.scrollTop,
                vlist.current!.scrollTop - scrollTop.current,
                vlist.current!.clientHeight);

            if (update) {
                indexRange.current = ir;
                pixelRange.current = pr;
                setVisible(vis); 
            }

            scrollTop.current = vlist.current!.scrollTop;
        }
 
        const handleResize = () => {
            scrollTop.current = vlist.current!.scrollTop;
            indexRange.current = [0, 0];
            pixelRange.current = [0, 0];

            const h = getHeight(items);
            setHeight(h);
            handleScroll();            
        }

        handleResize();

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentBoxSize) {
                    handleResize();
                }
            }
        });

        vlist.current.addEventListener('scroll', handleScroll);
        resizeObserver.observe(vlist.current);

        return () => {
            if (!vlist.current) return;
            vlist.current.removeEventListener('scroll', handleScroll);
            resizeObserver.unobserve(vlist.current);
        }
    }, [items]);

    const onFocus = useCallback((i: number) => {
        if (vlist.current == null) {
            return;
        }

        const [imin, imax] = indexRange.current;

        if (i >= imax - 1) {
            vlist.current.scrollBy(0, items[imax].height);
        }
        else if (i <= imin + 1) {
            vlist.current.scrollBy(0, -(items[imin].height));
        }
    }, [items]);

    return (
        <div tabIndex={0} className='vlist' ref={vlist}>
            <ol style={{ height }}>
                {visible.map(v => (
                    <VirtualListItem key={v.i} index={v.i} top={v.y} height={v.data.height} onFocus={onFocus}>
                        <ItemRenderer {...v.data} />
                    </VirtualListItem>))}
            </ol>
        </div>
    )
}

export { VirtualList }
export type { ListItemRenderer }