# Infinity Scroll React

The Scroller component is a React component designed for infinite scrolling. It continuously loads more data as the user scrolls down the page, using the Intersection Observer API to detect when the user has reached the end of the current data set.

## Features

- Infinite scrolling with Intersection Observer API
- Customizable render function for data items
- Customizable loader component for loading state
- Efficient data handling and appending

## Installation

You can install the package via npm:

```bash
npm i infinity-scroll-react
```

## Usage

We recommend using axios and useSwr hook with this package for better results. here is a full example.
```
import { Scroller } from "infinity-scroll-react";
import axios from "axios";
import useSWR from "swr";
import { useState } from "react";

/**
 * Base URL for the API Calls
 */
const BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * Function to fetch data
 * @param url API URL ENDPOINT
 * @returns Response Data
 */
const fetchData = async (url: string) => {
  const response = await axios.get(`${BASE_URL}${url}`);
  return response.data;
};

/**
 * React component to render single data
 * Modify this according to your needs
 * @param param item details
 * @returns ReactNode
 */
const SingleItem = ({ item }: { item: { title: string; body: string } }) => {
  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.body}</p>
    </div>
  );
};

/**
 * Loader component to render when data is loading
 * Modify this according to your needs
 * @returns ReactNode
 */
const Loader = () => {
  return <div>Loading...</div>;
};

function App() {
  // set the page to 1 for first page
  const [page, setPage] = useState<number>(1);

  // setting the url here with pagination. limit is 10 as we do not need it here. if you want to have the option to change it you can use a useState hook for this
  const { data, isLoading } = useSWR(`/posts?page=${page}&limit=10`, fetchData);

  // function to load more data. will be called when user scrolls down to the bottom of the page
  const loadMore = () => {
    setPage(page + 1);
  };

  // finally the actual scroller
  return (
    <Scroller
      data={data?.data}
      loading={isLoading}
      RenderFn={SingleItem}
      loadMore={loadMore}
      hasMore={data.pagination?.hasMore}
      LoaderFn={Loader}
    />
  );
}

export default App;
```
## Props
| Prop | Required | Type |Description |
|:----:|:--------:|:-----------:| :--- |
| data | True     | Array |It is an array of the data returned from the server |
| loading | True | Boolean |This indicates if the data is being fetched from the server |
| RenderFn | True | ReactNode | This is a react component that will receive one item from the given data and render it |
| loadMore | True | Function | This will be a function that will increase the page number by 1. It is called each time the user scrolls to the bottom of the screen |
| hasMore | True | Boolean |This indicates if there is more data to load or not. if false next time a user scrolls to the bottom loadMore will not be executed |
| LoaderFn | False | Function | A react component for showing the loading state. default will show Loading... |

## Author
Arnab Gupta (arnab95gupta@gmail.com)

## License
This project is licensed under the MIT License.
