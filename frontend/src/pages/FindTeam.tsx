import TeamCard from "components/common/TeamCard";
import Input from "components/common/Input";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import "../styles/components/common.scss";
import "../styles/pages/findTeam.scss";
import useInfiniteTeamListQuery from "quires/team/useTeamList";
import { useSetRecoilState } from "recoil";
import { useTeamJoin, useJoinTeamCancel } from "quires/team/useTeamJoinMutation";
import useSearchTeamQuery from "quires/team/useSearchTeamQuery";
import { TeamCardContentsType } from "types/teamCardType";
import useOutsideClick from "hooks/useOutsideClick";
import Toast from "components/common/Toast";
import ToastState from "recoil/toastAtom";
import { useLocation, useNavigate, useRouteLoaderData } from "react-router-dom";
import NoTeamFound from "components/FindTeam/NoTeamFound";
import LoadingSpinner from "components/common/LoadingSpinner";
import { joinTeamTypes } from "types/UserTypes";

const img = process.env.PUBLIC_URL;

type MemberAuthorityType = "WAIT" | null;
type DropDownMenuType = "all" | "asc" | "desc";

type ActionType =
  | { type: "SET_TEAM_LIST"; value: TeamCardContentsType[] }
  | { type: "TOGGLE_TEAM_JOIN"; value: number };

const reducer = (state: TeamCardContentsType[], action: ActionType) => {
  switch (action.type) {
    case "SET_TEAM_LIST":
      return action.value;
    case "TOGGLE_TEAM_JOIN":
      return state.map((el) => {
        if (el.teamId === action.value) {
          const memberAuthority = el.member_authority === "WAIT" ? null : "WAIT";
          el.member_authority = memberAuthority;
          return el;
        }
        return el;
      });
    default:
      throw new Error("Unhandled action");
  }
};

const FindTeam = () => {
  const joinedTeams = useRouteLoaderData("nav") as joinTeamTypes[];
  const setToastModal = useSetRecoilState(ToastState);
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState<boolean>(false);
  const [dropDownUnit, setDropDownUnit] = useState<DropDownMenuType>("all");
  const [teamListState, teamListDispatch] = useReducer(reducer, []);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const searchQuery = searchParams.get("contents");
  const memberId = Number(localStorage.getItem("userId"));
  const [value, setValue] = useState<string>(!searchQuery ? "" : searchQuery);

  const bottomObserver = useRef(null);

  const teamJoinMuation = useTeamJoin(memberId);

  const {
    data: searchTeamListResponse,
    isLoading: searchTeamIsLoading,
    refetch: searchTeamListRefetch,
    isFetching: searchTeamListIsFetching,
  } = useSearchTeamQuery(memberId, value);

  const {
    data: teamListResponse,
    fetchNextPage,
    isLoading: teamListIsLoading,
    hasNextPage,
    isFetching: teamListIsFetching,
    isFetchingNextPage,
  } = useInfiniteTeamListQuery(memberId);

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !value.length) {
      navigate("/search");
    }
    if (e.key === "Enter" && value.length >= 2) {
      navigate(`?contents=${value}`);
      searchTeamListRefetch().then((data) =>
        teamListDispatch({ type: "SET_TEAM_LIST", value: data.data.data }),
      );
    }
  };

  const userJoinedTeam = (teamId: number) => {
    if (!joinedTeams) return false;
    return joinedTeams.some((el) => el.teamId === teamId);
  };

  useEffect(() => {
    if (searchQuery) {
      searchTeamListRefetch().then((data) =>
        teamListDispatch({ type: "SET_TEAM_LIST", value: data.data.data }),
      );
    } else {
      teamListDispatch({
        type: "SET_TEAM_LIST",
        value: teamListResponse
          ? teamListResponse.pages.flatMap((el) => el.data.data.content)
          : [],
      });
    }
  }, [teamListResponse, location.search]);

  const intersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (hasNextPage && !searchQuery) {
        fetchNextPage();
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(intersection, { threshold: 1 });

    observer.observe(bottomObserver.current);
    if (searchQuery) {
      observer.disconnect();
    }
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, searchQuery]);

  const handleJoinButton = (teamId: number, memberAuthority: MemberAuthorityType) => {
    if (memberAuthority === "WAIT") {
      useJoinTeamCancel(teamId, memberId);
      setToastModal({
        message: "가입 취소가 완료되었습니다.",
        visible: true,
        type: "default",
      });
    }
    if (!memberAuthority) {
      teamJoinMuation.mutate(teamId);
      if (!teamJoinMuation.error) {
        setToastModal({
          message: "가입 신청이 완료되었습니다!",
          visible: true,
          type: "default",
        });
      }
    }
    teamListDispatch({ type: "TOGGLE_TEAM_JOIN", value: teamId });
  };

  const handleDropDown = (type: DropDownMenuType) => {
    setDropDownUnit(type);
  };

  const setButtonState = (state: MemberAuthorityType) => {
    if (state === "WAIT") return true;
    if (!state) return false;
  };

  const teamCardComponent = useMemo(() => {
    let teamCardData;
    if (!dropDownMenuOpen) {
      teamCardData = teamListState;
    } else if (dropDownUnit === "all") {
      teamCardData = teamListState.sort(() => 0.5 - Math.random());
    } else if (dropDownUnit === "asc") {
      teamCardData = teamListState.sort((a, b) => a.teamId - b.teamId);
    } else if (dropDownUnit === "desc") {
      teamCardData = teamListState.sort((a, b) => b.teamId - a.teamId);
    } else {
      teamCardData = searchTeamListResponse.data;
    }

    if (
      (teamListIsLoading ||
        searchTeamIsLoading ||
        teamListIsFetching ||
        searchTeamListIsFetching) &&
      !isFetchingNextPage
    )
      return <LoadingSpinner />;

    if (!teamCardData.length) return <NoTeamFound searchValue={value} />;

    teamCardData = teamCardData.filter((el) => el.teamId !== 1);

    return teamCardData.map((el) => {
      return (
        <TeamCard
          isTeamJoined={userJoinedTeam(el.teamId)}
          title={el.teamName}
          slogan={el.oneIntro}
          num={el.memberCount ? el.memberCount : 0}
          imageUrl={el.imageUrl}
          key={el.teamId}
          teamId={el.teamId}
          joinHandler={() => handleJoinButton(el.teamId, el.member_authority)}
          buttonText={setButtonState(el.member_authority) ? "가입취소" : "가입"}
          buttonColor={setButtonState(el.member_authority) ? "white" : "blue"}
        />
      );
    });
  }, [
    dropDownUnit,
    teamListState,
    joinedTeams,
    searchQuery,
    teamListIsFetching,
    searchTeamListIsFetching,
  ]);

  const drowDownRef = useOutsideClick({
    onClickOutside: () => {
      setDropDownMenuOpen(false);
    },
  });

  const getInputRightIcon = () => {
    const onClick = () => {
      setValue("");
      navigate("/search");
    };
    return (
      value && (
        <button onClick={onClick}>
          <img src={`${img}/icons/close-gray.svg`} alt="" />
        </button>
      )
    );
  };

  return (
    <>
      <div className="main-wrap find-team">
        <div className="find-team-container">
          <h1 className="main-title">팀 찾기</h1>
          <div className="find-team-input-container">
            <div className="find-team-input">
              <Input
                setValue={setValue}
                value={value}
                placeholder="팀 이름 또는 팀 고유 코드"
                keyDownHandler={onEnterPress}
                leftIcon={<img src={`${img}/icons/board-search.png`} alt="" />}
                rightIcon={getInputRightIcon()}
              />
            </div>
            <div ref={drowDownRef}>
              <input
                id="checked"
                type="checkbox"
                name="dropdownMenu"
                checked={dropDownMenuOpen}
                onChange={({ target: { checked } }) => setDropDownMenuOpen(checked)}
              />
              <label htmlFor="checked">
                <img
                  width={16}
                  height={19}
                  src={`${img}/icons/arrow-sort.svg`}
                  alt="arrow-sort-icon"
                />
              </label>
              <ul>
                <li
                  className={dropDownUnit === "all" ? "selection" : null}
                  onClick={() => handleDropDown("all")}
                  role="presentation"
                >
                  모든팀
                  <img src={`${img}/icons/check-blue.svg`} alt="check-blue" />
                </li>
                <li
                  className={dropDownUnit === "asc" ? "selection" : null}
                  onClick={() => handleDropDown("asc")}
                  role="presentation"
                >
                  최신순
                  <img src={`${img}/icons/check-blue.svg`} alt="check-blue" />
                </li>
                <li
                  className={dropDownUnit === "desc" ? "selection" : null}
                  onClick={() => handleDropDown("desc")}
                  role="presentation"
                >
                  오래된 순
                  <img src={`${img}/icons/check-blue.svg`} alt="check-blue" />
                </li>
              </ul>
            </div>
          </div>
          <div className="team-card-container">{teamCardComponent}</div>
          {isFetchingNextPage && <LoadingSpinner position="auto" />}
        </div>
        <div className="find-team-observer" ref={bottomObserver} />
      </div>
      <Toast />
    </>
  );
};

export default FindTeam;
