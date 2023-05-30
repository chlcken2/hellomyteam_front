import React, { FC, useEffect, useState, useRef } from "react";
import PostItem from "components/Home/PostItem";
import TeamItem from "components/Home/TeamItem";
import { Link } from "react-router-dom";
import getBoardList from "quires/board/getBoardList";
import UserState from "recoil/userAtom";
import { useRecoilValue } from "recoil";

const Home: FC = () => {
  const user = useRecoilValue(UserState);
  const reg = /<[^>]*>?/g;
  const {
    data: noticeList,
    isLoading: noticeListLoad,
    refetch: refetch1,
  } = getBoardList(
    0,
    user?.selectedTeamId || JSON.parse(localStorage.getItem("arrayData"))[0].teamId,
    "NOTICE_BOARD",
    "created_date",
    "",
    "",
    2,
  );
  // (4/27) selectedTeamId가 없을 경우 localStorage에서 가져오게
  const {
    data: freeList,
    isLoading: freeListLoad,
    refetch: refetch2,
  } = getBoardList(
    0,
    user?.selectedTeamId || JSON.parse(localStorage.getItem("arrayData"))[0].teamId,
    "FREE_BOARD",
    "created_date",
    "",
    "",
    5,
  );

  useEffect(() => {
    if (user && user.selectedTeamId) {
      refetch1();
      refetch2();
    }
  }, [user]);
  return (
    <div className="home-container">
      <div className="home-wrapper sub-notice">
        <section className="section-container">
          <div className="section-top">
            <h2>공지게시판</h2>
          </div>
          <ul className="post-list">
            {!noticeListLoad &&
              noticeList.data.content.map((el, idx) => (
                <li key={idx}>
                  <PostItem
                    title={el.title}
                    content={el.contents.replace(reg, "")}
                    commentCount={el.commentCount}
                    likeCount={el.likeCount}
                    createdAt={el.createdDate}
                    author={el.writer}
                    imageURL={null}
                  />
                </li>
              ))}
          </ul>
        </section>
      </div>
      <div className="home-wrapper sub-team">
        <section className="section-container">
          <div className="section-top">
            <h2>팀원</h2>
          </div>
          <div className="team-list">
            <div className="team-list-item">
              <div className="name">이름</div>
              <div className="role">역할</div>
              <div className="position">포지션</div>
            </div>
            <ul>
              {Array.from({ length: 4 }, () => ({ name: "손흥민" })).map((item, idx) => (
                <TeamItem key={idx} name={item.name} />
              ))}
            </ul>
          </div>
        </section>
      </div>
      <div className="home-wrapper sub-board">
        <section className="section-container">
          <div className="section-top">
            <h2>자유게시판</h2>
          </div>
          <ul className="post-list">
            {!freeListLoad &&
              freeList.data.content.map((el, idx) => (
                <li key={idx}>
                  <PostItem
                    title={el.title}
                    content={el.contents.replace(reg, "")}
                    commentCount={el.commentCount}
                    likeCount={el.likeCount}
                    createdAt={el.createdDate}
                    author={el.writer}
                    imageURL={null}
                  />
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
