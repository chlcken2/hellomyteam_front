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
import { Ring } from "@uiball/loaders";

const Notice: FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["keyword"]);

  const searchRef = useRef<HTMLInputElement>(null);
  const path = process.env.PUBLIC_URL;
  const reg = /<[^>]*>|&nbsp;/g;
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
  const [changeSearch, setChangeSearch] = useState(false);
  const [page, setPage] = useState(10);

  // (4/27) selectedTeamId가 없을 경우 localStorage에서 가져오게
  const {
    data: list,
    isLoading: listLoad,
    refetch: listRefetch,
  } = getBoardList(
    item - 1,
    user?.selectedTeamId ||
      JSON.parse(localStorage.getItem("arrayData"))?.[0].teamId ||
      0,
    "NOTICE_BOARD",
    sortType,
    searchKeyword,
    searchType,
    page,
  );

  const [moFlag, setMoFlag] = useState("small");
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  // 무한스크롤
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [scrollOpacity, setScrollOpacity] = useState(false);

  const fetchData = () => {
    setLoading(true);
    listRefetch().then((res) => {
      if (res.data.data) {
        setLoading(false);
        if (list?.data) setData((prevData) => [...prevData, ...list.data.content]);
        setPage((prevPage) => prevPage + 20);
        setHasMore(res.data.data.content.length > 0);
      }
    });
  };
  useEffect(() => {
    if (changeSearch) {
      setPage(20);
    } else {
      setPage(10);
    }
  }, [changeSearch]);

  useEffect(() => {
    if (changeSearch && page === 20) {
      fetchData();
    }
  }, [page, changeSearch]);
  const isScrollAtEnd = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );

    return scrollTop + windowHeight >= documentHeight;
  };

  const handleScroll = () => {
    const windowWidth = window.innerWidth;
    // 스크롤 이벤트 핸들러
    if (isScrollAtEnd() && windowWidth <= 768) {
      if (!loading && hasMore) {
        fetchData();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

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
      const currentValue = cookies?.keyword || [];
      const newValue = [inputValue, ...currentValue];
      setCookie("keyword", newValue, { path: "/", expires });
      setOpenTab(true);
      setSearchKeyword(inputValue);
      setBoardName({ label: "제목", value: "title" });
      setSearchType("title");
      searchRef.current.focus();
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

    const arr = cookies?.keyword.filter((element: string) => element !== el);
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

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleMediaQueryChange = (event: any) => {
      if (event.matches && cookies?.keyword?.length) {
        setOpenSearch(true);
        setOpenTab(true);
        setChangeSearch(true);
        setScrollOpacity(true);
      } else {
        setOpenSearch(false);
        setOpenTab(false);
        setChangeSearch(false);
        setScrollOpacity(false);
      }
    };

    if (windowWidth <= 768 && cookies?.keyword?.length) {
      setOpenSearch(true);
      setOpenTab(true);
      setChangeSearch(true);
      setScrollOpacity(true);
    } else {
      setOpenSearch(false);
      setOpenTab(false);
      setChangeSearch(false);
      setScrollOpacity(false);
    }
    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

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
              inputRef={searchRef}
            />
            <button
              onClick={() => {
                setOpenSearch(false);
                setOpenTab(false);
                setChangeSearch(false);
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
                  <button
                    onClick={() => {
                      removeCookie("keyword", { path: "/" });
                    }}
                  >
                    전체삭제
                  </button>
                </li>
              </ul>
              <div className="search-bottom__content">
                {!cookies?.keyword?.length && (
                  <div className="no-content">
                    <p>최근 검색어 내역이 없습니다.</p>
                  </div>
                )}
                <ul className="search-list">
                  {cookies?.keyword?.map((el: string, idx: number) => {
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
        <div className={`section-top  ${changeSearch ? "search-sort__mo" : ""}`}>
          <h2>공지게시판 {openTab && `검색결과 ${moTotalPage}건`}</h2>
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
          {openSearch &&
            data.map((el: any, idx: number) => (
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
            ))}
          {loading && <Ring size={36} lineWeight={4} speed={2} color="#5E81FF" />}
          {!listLoad && !openSearch && list.data.content.length === 0 && (
            <li className="no-content">게시글이 없습니다.</li>
          )}
          {!listLoad &&
            !openSearch &&
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
        {!openSearch && (
          <Pagination
            scrollOpacity={scrollOpacity}
            setItem={setItem}
            item={item}
            totalItem={totalItem}
            totalPage={totalPage}
          />
        )}
      </section>
    </div>
  );
};

export default Notice;
