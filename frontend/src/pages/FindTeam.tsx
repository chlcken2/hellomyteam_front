import TeamCard from "components/common/TeamCard";
import Input from "components/common/Input";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import "../styles/components/common.scss";
import "../styles/pages/findTeam.scss";
import useInfiniteTeamListQuery from "quires/team/useTeamList";
import { useRecoilValue, useSetRecoilState } from "recoil";
import UserState from "recoil/userAtom";
import { Ring } from "@uiball/loaders";
import color from "constants/color";
import { useTeamJoin, useJoinTeamCancel } from "quires/team/useTeamJoinMutation";
import useSearchTeamQuery from "quires/team/useSearchTeamQuery";
import { TeamCardContentsType } from "types/teamCardType";
import useOutsideClick from "hooks/useOutsideClick";
import Toast from "components/common/Toast";
import ToastState from "recoil/toastAtom";
import { useLocation, useNavigate } from "react-router-dom";
import joinedTeamsAtom from "recoil/joinedTeams";

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
  const joinedTeams = useRecoilValue(joinedTeamsAtom);
  const userState = useRecoilValue(UserState);
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
  } = useSearchTeamQuery(value);

  const {
    data: teamListResponse,
    fetchNextPage,
    isLoading: teamListIsLoading,
    hasNextPage,
  } = useInfiniteTeamListQuery(memberId);

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.length >= 2) {
      navigate(`?contents=${value}`);
      searchTeamListRefetch().then((data) =>
        teamListDispatch({ type: "SET_TEAM_LIST", value: data.data.data }),
      );
    }
  };

  useEffect(() => {
    if (searchQuery) {
      searchTeamListRefetch().then((data) =>
        teamListDispatch({ type: "SET_TEAM_LIST", value: data.data.data }),
      );
    } else {
      navigate("");
      fetchNextPage().then((data) =>
        teamListDispatch({
          type: "SET_TEAM_LIST",
          value: data.data.pages.flatMap((el) => el.data.data.content),
        }),
      );
    }
  }, [location.search]);

  const userJoinedTeam = useCallback(
    (teamId: number) => {
      if (joinedTeams) {
        return joinedTeams.some((el) => el.teamId === teamId);
      }
    },
    [joinedTeams],
  );

  useEffect(() => {
    teamListDispatch({
      type: "SET_TEAM_LIST",
      value: teamListResponse
        ? teamListResponse.pages.flatMap((el) => el.data.data.content)
        : [],
    });
  }, [teamListResponse]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (hasNextPage) fetchNextPage();
      });
    });

    observer.observe(bottomObserver.current);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage]);

  const handleJoinButton = (teamId: number, memberAuthority: MemberAuthorityType) => {
    if (memberAuthority === "WAIT") {
      useJoinTeamCancel(teamId, userState.id);
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
  }, [dropDownUnit, teamListState, joinedTeams]);

  const drowDownRef = useOutsideClick({
    onClickOutside: () => {
      setDropDownMenuOpen(false);
    },
  });

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
                <img src={`${img}/icons/arrow-sort.svg`} alt="arrow-sort-icon" />
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
          {(teamListIsLoading || searchTeamIsLoading) && (
            <div className="team-card-loading-spinner">
              <Ring size={40} lineWeight={5} speed={2} color={color["--main-blue-100"]} />
            </div>
          )}
        </div>
      </div>
      <div className="find-team-observer" ref={bottomObserver} />
      <Toast />
    </>
  );
};

export default FindTeam;
