import TeamCard from "components/common/TeamCard";
import Input from "components/common/Input";
import { useCallback, useEffect, useState } from "react";
import "../styles/components/common.scss";
import "../styles/pages/findTeam.scss";
import useGetTeamListQuery from "quires/team/useTeamList";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";

const FindTeam = () => {
  const [value, setValue] = useState<string>("");

  const userState = useRecoilValue(UserState);

  const { data: TeamListResponse, refetch } = useGetTeamListQuery(0, 40, "SHUFFLE");

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refetch();
    }
  };

  const userJoinedTeam = useCallback(
    (teamId: number) => {
      if (userState) {
        return userState.termsAndCond.some((el) => el.id === teamId);
      }
    },
    [userState],
  );

  return (
    <div className="main-wrap find-team">
      <h1 className="main-title">팀 찾기</h1>
      <div className="input-container">
        <Input
          setValue={setValue}
          value={value}
          placeholder="팀 이름 또는 팀 고유 코드"
          keyDownHandler={onEnterPress}
        />
      </div>
      <div className="team-card-container">
        {TeamListResponse &&
          TeamListResponse.data.content.map((el) => {
            return (
              <TeamCard
                isTeamJoined={userJoinedTeam(el.teamId)}
                title={el.teamName}
                slogan={el.oneIntro}
                num={el.memberCount}
                imageUrl={el.imageUrl}
                key={el.teamId}
                teamId={el.teamId}
              />
            );
          })}
      </div>
    </div>
  );
};

export default FindTeam;
