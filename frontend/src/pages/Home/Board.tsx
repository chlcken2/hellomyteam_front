import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import PostItem from "components/Home/PostItem";
import getBoardList from "quires/board/getBoardList";
import UserState from "recoil/userAtom";
import { useRecoilValue } from "recoil";

const Board: FC = () => {
  const reg = /<[^>]*>?/g;
  const user = useRecoilValue(UserState);
  const { data: list, isLoading: listLoad } = getBoardList(
    0,
    user?.selectedTeamId,
    "FREE_BOARD",
  );

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
          {/* <li>
            <PostItem
              title="여러분은 맥북 청소할때 스피커 부분은 어떻게 청소하시나요?"
              content="액정클리너 같은걸로 닦고있는데 스피커 사이에 낀 손떼는 안지워지더라고요"
              commentCount={7}
              likeCount={7}
              createdAt="2022.12.12"
              author="juhpark"
              imageURL="https://imagedelivery.net/R2WiK4wfRK3oBXTwjgzQfA/21a6cc15-e13e-4e6e-1a80-38ec12630b00/blogThumbnail"
            />
          </li> */}
          {list?.data.map((el, idx) => {
            return (
              <Link to={`/board/${el.id}`} key={idx}>
                <PostItem
                  title={el.title}
                  content={el.contents.replace(reg, "")}
                  commentCount={el.commentCount}
                  likeCount={el.likeCount}
                  createdAt={el.createdDate}
                  author={el.writer}
                />
              </Link>
            );
          })}
        </ul>
        <div className="pagination-wrapper">페이지네이션</div>
      </section>
    </div>
  );
};

export default Board;
