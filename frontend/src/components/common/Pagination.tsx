import React, { memo, useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";

interface pageProps {
  setItem: Dispatch<SetStateAction<number>>;
  item: number;
  totalItem: number;
}
const Pagination = ({ setItem, item, totalItem }: pageProps) => {
  const path = process.env.PUBLIC_URL;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [clicked, setClicked] = useState(0);
  const [count, setCount] = useState(1);
  const [num, setNum] = useState(1);

  const handleClickPrevPage = () => {
    setPage(page - 1);
    setItem(page - 1);
    if (page % 4 === 1) {
      setNum(num - 4);
    }
  };

  const handleClickNextPage = () => {
    setPage(page + 1);
    setItem(page + 1);
    if (page >= 4 && page % 4 === 0 && page !== Math.ceil(totalItem / perPage)) {
      setNum(num + 4);
    }
  };

  useEffect(() => {
    if (page === Math.ceil(totalItem / perPage) + 1) {
      return;
    }
    if (page % 4 === 1) {
      setNum(page);
    }
    setItem(page);
  }, [page]);

  console.log(page, num, count, Math.ceil(totalItem / perPage) + 1);

  return (
    <div className="paging">
      {/* <button disabled={page === 1} onClick={handleClickFirstPage}>
        첫 페이지
      </button> */}
      <button className="arrow" disabled={page === 1} onClick={handleClickPrevPage}>
        <span>
          <img src={`${path}/common/arrow-left.png`} alt="페이지 이전" />
        </span>
      </button>
      {/* Array.from({length:4}, (_,idx))에서 수정 - 4/27 */}
      {[0, 1, 2, 3].map((_, index) => {
        if (index + num !== Math.ceil(totalItem / perPage) + 1) {
          return (
            <button
              key={index}
              disabled={page - (num - 1) === index + 1}
              className={clicked === index ? "on" : ""}
              onClick={() => {
                setCount(index + 1);
                setPage(index + num);
              }}
            >
              {index + num}
            </button>
          );
        }
      })}
      {Math.ceil(totalItem / perPage) > 5 && <span className="period">...</span>}
      <button>{Math.ceil(totalItem / perPage) + 1}</button>
      <button
        className="arrow"
        disabled={page === Math.ceil(totalItem / perPage) + 1}
        onClick={() => {
          handleClickNextPage();
        }}
      >
        <span>
          <img src={`${path}/common/arrow-right.png`} alt="페이지 다음" />
        </span>
      </button>

      {/* <button
        disabled={page === Math.ceil(totalItem / perPage)}
        onClick={handleClickLastPage}
      >
        마지막 페이지
      </button> */}
    </div>
  );
};

export default memo(Pagination);
