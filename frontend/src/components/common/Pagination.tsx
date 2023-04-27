import React, { memo, useState, useEffect } from "react";
import axios from "axios";

const Pagination = ({ setItem, item, totalItem }: any) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const handleClickPage = (newPage: number) => {
    setPage(newPage);
    setItem(newPage);
  };

  const handleClickPrevPage = () => {
    setPage(page - 1);
    setItem(page - 1);
  };

  const handleClickNextPage = () => {
    setPage(page + 1);
    setItem(page + 1);
  };

  const handleClickFirstPage = () => {
    setPage(1);
    setItem(1);
  };

  const handleClickLastPage = () => {
    setPage(Math.ceil(totalItem / perPage));
    setItem(Math.ceil(totalItem / perPage));
  };

  useEffect(() => {
    if (item) {
      setPage(item);
    }
  }, [item]);

  console.log(item);

  return (
    <div>
      <button disabled={page === 1} onClick={handleClickFirstPage}>
        첫 페이지
      </button>
      <button disabled={page === 1} onClick={handleClickPrevPage}>
        이전 페이지
      </button>
      {Array.from({ length: Math.ceil(totalItem / perPage) }, (_, index) => (
        <button
          key={index}
          onClick={() => handleClickPage(index + 1)}
          disabled={page === index + 1}
        >
          {index + 1}
        </button>
      ))}
      <button
        disabled={page === Math.ceil(totalItem / perPage)}
        onClick={handleClickNextPage}
      >
        다음 페이지
      </button>

      <button
        disabled={page === Math.ceil(totalItem / perPage)}
        onClick={handleClickLastPage}
      >
        마지막 페이지
      </button>
    </div>
  );
};

export default memo(Pagination);
