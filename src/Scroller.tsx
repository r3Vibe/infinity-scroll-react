import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import loaderSvg from "./loader.svg";

interface IProps {
  lastitemIndex: number;
  children: ReactNode;
  LoaderFn?: () => ReactNode;
  loadMore: () => void;
  loading: boolean;
  hasMore: boolean;
}

/**
 * Scroller component is an infinite scroll component. It will keep loading data as the user scrolls.
 * Uses Intersection Observer API to detect when the user has scrolled to the end.
 * @author
 * @param {Object} props - An object containing the following properties:
 * @param {Number} props.lastitemIndex - Last item index of the data array.
 * @param {Function} props.children - A react function that will render a single item from the data array.
 * @param {Function} [props.LoaderFn] - A react function that renders a loading message when more items are being loaded.
 * @param {Function} props.loadMore - A function that should add 1 to the current page.
 * @param {boolean} props.loading - A boolean indicating if items are currently being loaded.
 * @param {boolean} props.hasMore - A boolean indicating if there are more items to load.
 * @returns {ReactElement} - A React component.
 */
export const Scroller = ({
  lastitemIndex,
  children,
  loadMore,
  loading,
  hasMore,
  LoaderFn = () => (
    <div
      style={{
        textAlign: "center",
        width: "100%",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={loaderSvg} alt="loader" />
    </div>
  ),
}: IProps): React.ReactElement => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
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
    // Ensure to clean up observer on unmount
    return () => observer.current?.disconnect();
  }, []);

  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (index === lastitemIndex) {
          return <div ref={lastItemRef}>{child}</div>;
        } else {
          return <div>{child}</div>;
        }
      })}
      {loading && <LoaderFn />}
    </>
  );
};

export default Scroller;
