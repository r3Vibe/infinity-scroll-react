import { useEffect, useState } from "react";
import useSWR from "swr";
import Scroller from "./Scroller";

const fetchData = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      authorization: "Bearer guest-user",
    },
  });
  const data = await res.json();
  return {
    data: data?.data?.posts[0]?.data,
    pagination: data?.data?.posts[0]?.pagination[0],
  };
};

function App() {
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { data, isLoading } = useSWR(
    `https://api-mojiai.weavers-web.com/v1/web/get-post-by-category?page=${page}&limit=10`,
    fetchData
  );

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (data) {
      setHasMore(data?.pagination?.page < data?.pagination?.totalPages);
      setAllData((prevData) => [...prevData, ...data.data]);
    }
  }, [data]);

  return (
    <Scroller
      lastitemIndex={data?.data.length - 1}
      loading={isLoading}
      hasMore={hasMore}
      loadMore={loadMore}
    >
      {allData?.map((item: any) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      ))}
    </Scroller>
  );
}

export default App;
