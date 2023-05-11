import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import PostItem from "components/Home/PostItem";
import getBoardList from "quires/board/getBoardList";
import Pagination from "components/common/Pagination";
import UserState from "recoil/userAtom";
import { useRecoilValue } from "recoil";
import Select from "components/common/Select";
import Input from "components/common/Input";
import { useCookies } from "react-cookie"; // useCookies import

const Board: FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["keyword"]);

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
  const [openTab, setOpenTab] = useState(false);
  const [moTotalPage, setMoTotalPage] = useState(0);
  const [moIdx, setMoIdx] = useState(0);

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

  const [moFlag, setMoFlag] = useState("small");
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleMediaQueryChange = (event: any) => {
      if (event.matches) {
        setMoFlag("small");
      } else {
        setMoFlag("large");
      }
    };

    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

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
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 후
      const currentValue = cookies.keyword || [];
      const newValue = [inputValue, ...currentValue];
      setCookie("keyword", newValue, { path: "/", expires });
    }
  };

  const handleMobile = () => {
    // setMoFlag(!moFlag);
    if (open) {
      setOpenSearch(true);
    } else {
      setOpenSearch(false);
    }
  };

  const removeCookieData = (el: string) => {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 후

    const arr = cookies.keyword.filter((element: string) => element !== el);
    setCookie("keyword", arr, { path: "/", expires });
  };

  useEffect(() => {
    if (boardName) setSearchType(boardName.value);
  }, [boardName]);

  useEffect(() => {
    if (moFlag === "small") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [moFlag]);

  useEffect(() => {
    if (list?.data.content) {
      setMoTotalPage(list?.data.content.length);
      // setMoTotalPage
    }
  }, [list, searchType, openTab]);

  return (
    <div>
      {openSearch && (
        <div className="mo-search">
          <div className="search-top">
            <Input
              value={inputValue}
              placeholder="검색어 입력"
              onChange={handleInput}
              keyDownHandler={onEnterPress}
            />
            <button
              onClick={() => {
                setOpenSearch(false);
                setOpenTab(false);
              }}
            >
              <img src={`${path}/common/close.png`} alt="닫기" />
            </button>
          </div>
          {openTab && (
            <ul className="open-tab">
              {[{ title: "제목" }, { content: "내용" }, { writer: "작성자" }].map(
                (el: any, idx: number) => {
                  const keys = Object.keys(el)[0];
                  return (
                    <li key={idx} className={moIdx === idx ? "on" : ""}>
                      <button
                        onClick={() => {
                          // setBoardName({ label: el[keys], value: keys });
                          setSearchType(keys);
                          setMoIdx(idx);
                        }}
                      >
                        {el[keys]}
                      </button>
                    </li>
                  );
                },
              )}
            </ul>
          )}
          {!openTab && (
            <div className="search-bottom">
              <ul>
                <li>
                  <button disabled>최근검색어</button>
                </li>
                <li>
                  <button>전체삭제</button>
                </li>
              </ul>
              <div className="search-bottom__content">
                {!cookies.keyword.length && (
                  <div className="no-content">
                    <p>최근 검색어 내역이 없습니다.</p>
                  </div>
                )}
                <ul className="search-list">
                  {cookies.keyword.map((el: string, idx: number) => {
                    return (
                      <li key={idx}>
                        <button
                          onClick={() => {
                            setBoardName({ label: "제목", value: "title" });
                            setSearchKeyword(el);
                            setOpenTab(true);
                            setInputValue(el);
                          }}
                        >
                          <span>{el}</span>
                        </button>
                        <button onClick={() => removeCookieData(el)}>
                          <img src={`${path}/common/close.png`} alt="제거하기" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      <section className="section-container">
        <div className={`section-top  ${openTab ? "search-sort__mo" : ""}`}>
          <h2>자유게시판 {openTab && `검색결과 ${moTotalPage}건`}</h2>
          <div className="option-box board-input">
            <ul>
              <li className="search-icon" onClick={handleMobile} onKeyDown={handleMobile}>
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
