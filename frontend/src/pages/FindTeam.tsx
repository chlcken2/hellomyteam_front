import TeamCard from "components/common/TeamCard";
import Input from "components/Input/Input";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import "../styles/components/common.scss";
import { findTeamAPI, joinTeamAPI } from "api/team/findTeam";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";
import "../styles/pages/findTeam.scss";

const FindTeam = () => {
  const [value, setValue] = useState<string>("");
  const user = useRecoilValue(UserState);

  const { data: findTeamData, refetch } = useQuery("/find/team", () =>
    findTeamAPI(value),
  );

  const { mutate } = useMutation((teamId: number) => joinTeamAPI(user.id, teamId));

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refetch();
    }
  };

  return (
    <div className="main-wrap find-team">
      <h1 className="main-title">팀 찾기</h1>
      <div className="input-container">
        <Input
          setValue={setValue}
          value={value}
          placeholder="팀 검색"
          keyDownHandler={onEnterPress}
        />
      </div>
      <div className="team-card-container">
        {findTeamData &&
          findTeamData.map((el) => {
            return (
              <TeamCard
                title={el.teamName}
                slogan={el.oneIntro}
                num={el.memberCount}
                imageUrl={el.imageUrl}
                key={el.teamId}
                joinHandler={() => mutate(el.teamId)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default FindTeam;
