import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface IProps {
  data: { [key: string]: any }[];
  RenderFn: (item: any) => ReactNode;
  LoaderFn?: () => ReactNode;
  loadMore: () => void;
  loading: boolean;
  hasMore: boolean;
}

/**
 * Scroller component is a infinite scroll component. It will keep loading data as the user scrolls. 
 * Uses Intersection Observer API to detect when the user has scrolled to the end.
 * @author Arnab Gupta (<arnab95gupta@gmail.com>)
 * @param {Object} props - An object containing the following properties:
 * @param {Array} props.data - An array of items to display.
 * @param {Function} props.RenderFn - A react function that will render a single item from the data array.
 * @param {Function} [props.LoaderFn] - A react function that renders a loading message when more items are being loaded.
 * @param {Function} props.loadMore - A function that should add 1 to the current page.
 * @param {boolean} props.loading - A boolean indicating if items are currently being loaded.
 * @param {boolean} props.hasMore - A boolean indicating if there are more items to load.
 * @returns {ReactNode} - A React component.
 */
export default function Scroller({
  data,
  RenderFn,
  loadMore,
  loading,
  hasMore,
  LoaderFn = () => <div className="loader">Loading...</div>,
}: IProps): ReactNode {
  const [alldata, setAlldata] = useState<any>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadMore, hasMore]
  );

  useEffect(() => {
    if (data) {
      setAlldata((predata: any) => [...predata, ...data]);
    }
  }, [data]);

  return (
    <>
      {alldata?.map((item: any, index: number) => {
        if (index === alldata?.length - 1) {
          return (
            <div key={item?.id} ref={lastItemRef}>
              <RenderFn item={item} />
            </div>
          );
        } else {
          return (
            <div key={item?.id}>
              <RenderFn item={item} />
            </div>
          );
        }
      })}
      {loading && <LoaderFn />}
    </>
  );
}
