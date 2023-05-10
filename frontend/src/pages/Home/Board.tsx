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
    label: "제목",
    value: "title",
  });

  const [searchType, setSearchType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
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
    searchKeyword,
    searchType,
  );

  useEffect(() => {
    if (listLoad) return;
    setTotalItem(list?.data.totalElements);
    setTotalPage(list?.data.totalPages);
  }, [list]);

  useEffect(() => {
    listRefetch();
  }, [item, sortType, searchKeyword, searchType]);

  const option = [
    { label: "제목", value: "title" },
    { label: "내용", value: "contents" },
    { label: "작성자", value: "writer" },
  ];
  const handleInput = (e: any) => {
    setInputValue(e.target.value);
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchKeyword(inputValue);
    }
  };

  console.log(searchKeyword, inputValue);

  useEffect(() => {
    if (boardName) setSearchType(boardName.value);
  }, [boardName]);
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
                  placeholder="제목"
                  options={option}
                  defaultValue="title"
                  onChange={(e) => setBoardName(e)}
                />
              </li>
              <li>
                <Input
                  value={inputValue}
                  placeholder="검색어 입력"
                  onChange={handleInput}
                  keyDownHandler={onEnterPress}
                />
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
