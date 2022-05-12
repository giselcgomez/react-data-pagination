const Pagination = ({ items, pageSize, onPageChange }) => {
  const { Button } = ReactBootstrap;
  if (items.length <= 1) return null;
  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num );
  const list = pages.map(page => {
    return (
      <Button key={page} onClick={onPageChange} className="page-item">
        {page}
      </Button>
    );
  });
  return (
    <nav>
      <ul className="pagination">{list}</ul>
    </nav>
  );
};
const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};
function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}
const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });
  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const res = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
// App that gets data from crypto url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  //const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://api.chucknorris.io/jokes/search?query=science",
    {
      result: []
    }
  );
  //console.log(`Render App: ${JSON.stringify(data)}`);
  console.log("data result = " + data.result); //data yields object but I want array of items in it
  const handlePageChange = e => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data.result;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }
  return (
    <Fragment>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (

        <table>
          <th>CHUCK NORRIS' JOKES ABOUT SCIENCE</th>
            <tbody>
                {page.map(item => (
                  <tr>
                      <td key={item.value}> {item.value}</td>
                  </tr>
                ))}
            </tbody>
      </table>
      )}

      <Pagination
        items={data.result}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
