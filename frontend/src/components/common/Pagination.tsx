import React, { memo, useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";

interface pageProps {
  setItem: Dispatch<SetStateAction<number>>;
  item: number;
  totalItem: number;
  totalPage: number;
  scrollOpacity: boolean;
}

const Pagination = ({
  setItem,
  item,
  totalItem,
  totalPage,
  scrollOpacity,
}: pageProps) => {
  const path = process.env.PUBLIC_URL;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [clicked, setClicked] = useState(0);
  const [count, setCount] = useState(1);
  const [num, setNum] = useState(1);

  const handleClickPrevPage = () => {
    setPage(page - 1);
    setItem(page - 1);
    setCount(page - 1);
    if (page % 3 === 1) {
      setNum(num - 3);
    }
  };

  const handleClickNextPage = () => {
    setPage(page + 1);
    setItem(page + 1);
    setCount(page + 1);
    if (page >= 3 && page % 3 === 0 && page !== Math.ceil(totalItem / perPage)) {
      setNum(num + 3);
    }
  };

  useEffect(() => {
    if (page === Math.ceil(totalItem / perPage) + 1) {
      setItem(page);
      return;
    }
    if (page % 3 === 1) {
      setNum(page);
      setItem(page);
    }
  }, [page]);

  return (
    <div className="paging" style={{ opacity: scrollOpacity ? 0 : 1 }}>
      {/* <button disabled={page === 1} onClick={handleClickFirstPage}>
        첫 페이지
      </button> */}
      <button className="arrow" disabled={page === 1} onClick={handleClickPrevPage}>
        <span>
          <img src={`${path}/common/arrow-left.png`} alt="페이지 이전" />
        </span>
      </button>
      {/* Array.from({length:4}, (_,idx))에서 수정 - 4/27 */}
      {Array(totalPage > 1 ? 3 : 1)
        .fill(0)
        .map((_, index) => {
          if (index + num < totalPage || totalPage === 0) {
            return (
              <button
                key={index}
                disabled={page - (num - 1) === index + 1}
                className={clicked === index ? "on" : ""}
                onClick={() => {
                  // setCount(index + 1);
                  setPage(index + num);
                }}
              >
                {index + num}
              </button>
            );
          }
        })}
      {Math.ceil(totalItem / perPage) > 5 && <span className="period">...</span>}
      {Math.ceil(totalItem / perPage) > 5 && (
        <button
          disabled={page === totalPage}
          onClick={() => {
            setPage(totalPage);
          }}
        >
          {totalPage}
        </button>
      )}
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
