import React, { memo, useState, useEffect } from "react";
import axios from "axios";

const Pagination = ({ setItem, setTotalItem }: any) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    axios
      .get(`/items?page=${page}&per_page=${perPage}`)
      .then((response) => {
        setItems(response.data.items);
        setTotalItems(response.data.total_items);
      })
      .catch((error) => console.error(error));
  }, [page, perPage]);

  const handleClickPage = (newPage: number) => {
    setPage(newPage);
  };

  const handleClickPrevPage = () => {
    setPage(page - 1);
  };

  const handleClickNextPage = () => {
    setPage(page + 1);
  };

  const handleClickFirstPage = () => {
    setPage(1);
  };

  const handleClickLastPage = () => {
    setPage(Math.ceil(totalItems / perPage));
  };

  return (
    <div>
      <button disabled={page === 1} onClick={handleClickPrevPage}>
        이전 페이지
      </button>
      {Array.from({ length: Math.ceil(totalItems / perPage) }, (_, index) => (
        <button
          key={index}
          onClick={() => handleClickPage(index + 1)}
          disabled={page === index + 1}
        >
          {index + 1}
        </button>
      ))}
      <button
        disabled={page === Math.ceil(totalItems / perPage)}
        onClick={handleClickNextPage}
      >
        다음 페이지
      </button>
      <button disabled={page === 1} onClick={handleClickFirstPage}>
        첫 페이지
      </button>
      <button
        disabled={page === Math.ceil(totalItems / perPage)}
        onClick={handleClickLastPage}
      >
        마지막 페이지
      </button>
    </div>
  );
};

export default memo(Pagination);
