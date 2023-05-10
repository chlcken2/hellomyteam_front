import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import PostItem from "components/Home/PostItem";
import getBoardList from "quires/board/getBoardList";
import Pagination from "components/common/Pagination";
import UserState from "recoil/userAtom";
import { useRecoilValue } from "recoil";
import Select from "components/common/Select";
import Input from "components/common/Input";

const Board: FC = () => {
  const path = process.env.PUBLIC_URL;
  const reg = /<[^>]*>?/g;
  const user = useRecoilValue(UserState);

  const [item, setItem] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [idx, setIdx] = useState(0);

  const [sortType, setSortType] = useState("created_date");
  const [flag, setFlag] = useState(false);

  const [boardName, setBoardName] = useState({
    label: "자유게시판",
    value: "FREE_BOARD",
  });

  const [inputValue, setInputValue] = useState("");
  // (4/27) selectedTeamId가 없을 경우 localStorage에서 가져오게
  const {
    data: list,
    isLoading: listLoad,
    refetch: listRefetch,
  } = getBoardList(
    item - 1,
    user?.selectedTeamId || JSON.parse(localStorage.getItem("arrayData"))[0].teamId,
    "FREE_BOARD",
    sortType,
  );

  useEffect(() => {
    if (listLoad) return;
    setTotalItem(list?.data.totalElements);
    setTotalPage(list?.data.totalPages);
  }, [list]);

  useEffect(() => {
    listRefetch();
  }, [item, sortType]);

  console.log(user);
  const option = [
    { label: "자유게시판", value: "FREE_BOARD" },
    { label: "공지게시판", value: "NOTICE_BOARD" },
  ];

  return (
    <div>
      <section className="section-container">
        <div className="section-top">
          <h2>자유게시판</h2>
          <div className="option-box board-input">
            <ul>
              <li>
                <img src={`${path}/icons/board-search.png`} alt="" />
              </li>
              <li>
                <Select
                  placeholder="자유게시판"
                  options={option}
                  defaultValue="FREE_BOARD"
                  onChange={(e) => setBoardName(e)}
                />
              </li>
              <li>
                <Input value={inputValue} />
              </li>
              <li>
                <div className="sort-box">
                  <button className="sort-type" onClick={() => setFlag(!flag)}>
                    <img src={`${path}/common/board-list.png`} alt="arrow-up" />
                  </button>
                  {flag && (
                    <div className="main-teams__wrap board-list">
                      <div className="main-teams">
                        <ul>
                          <li className={idx === 0 ? "on" : ""}>
                            <button
                              onClick={() => {
                                setIdx(0);
                                setSortType("created_date");
                              }}
                            >
                              최신순
                            </button>
                          </li>
                          <li className={idx === 1 ? "on" : ""}>
                            <button
                              onClick={() => {
                                setIdx(1);
                                setSortType("like_count");
                              }}
                            >
                              좋아요순
                            </button>
                          </li>
                          <li className={idx === 2 ? "on" : ""}>
                            <button
                              onClick={() => {
                                setIdx(2);
                                setSortType("like_count");
                              }}
                            >
                              오래된순
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <ul className="post-list">
          {!listLoad &&
            list?.data.content.map((el: any, idx: number) => {
              return (
                <Link to={`/board/${el.id}?likeCount=${el.likeCount}`} key={idx}>
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
