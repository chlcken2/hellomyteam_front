import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import PostItem from "components/Home/PostItem";
import getBoardList from "quires/board/getBoardList";
import Pagination from "components/common/Pagination";
import UserState from "recoil/userAtom";
import { useRecoilValue } from "recoil";

const Board: FC = () => {
  const reg = /<[^>]*>?/g;
  const user = useRecoilValue(UserState);

  const [item, setItem] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  // (4/27) selectedTeamId가 없을 경우 localStorage에서 가져오게
  const {
    data: list,
    isLoading: listLoad,
    refetch: listRefetch,
  } = getBoardList(
    item - 1,
    user?.selectedTeamId || JSON.parse(localStorage.getItem("arrayData"))[0].teamId,
    "FREE_BOARD",
  );

  useEffect(() => {
    if (listLoad) return;
    setTotalItem(list?.data.totalElements);
    setTotalPage(list?.data.totalPages);
  }, [list]);

  useEffect(() => {
    listRefetch();
  }, [item]);

  console.log(user);

  return (
    <div>
      <section className="section-container">
        <div className="section-top">
          <h2>자유게시판</h2>
          <div className="option-box">
            <div className="sort-box">
              <span className="sort-type">최신순</span>
              <div className="icon-box">
                <span>
                  <img className="active" src="/icons/arrow_down.svg" alt="arrow-down" />
                </span>
                <span>
                  <img src="/icons/arrow_up.svg" alt="arrow-up" />
                </span>
              </div>
            </div>
            <div className="sort-box">
              <span className="sort-type">좋아요</span>
              <div className="icon-box">
                <span>
                  <img src="/icons/arrow_down.svg" alt="arrow-down" />
                </span>
                <span>
                  <img src="/icons/arrow_up.svg" alt="arrow-up" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <ul className="post-list">
          {!listLoad &&
            list?.data.content.map((el: any, idx: number) => {
              return (
                <Link to={`/board/${el.id}`} key={idx}>
                  <PostItem
                    title={el.title}
                    content={el.contents.replace(reg, "")}
                    commentCount={el.commentCount}
                    likeCount={el.likeCount}
                    createdAt={`${el.createdDate.split("T")[0]} ${
                      el.createdDate.split("T")[1]
                    }`}
                    author={el.writer}
                  />
                </Link>
              );
            })}
        </ul>
        <Pagination
          setItem={setItem}
          item={item}
          totalItem={totalItem}
          totalPage={totalPage}
        />
      </section>
    </div>
  );
};

export default Board;
