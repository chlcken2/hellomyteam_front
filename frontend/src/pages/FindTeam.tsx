import TeamCard from "components/common/TeamCard";
import Input from "components/common/Input";
import { useState } from "react";
import "../styles/components/common.scss";
import "../styles/pages/findTeam.scss";
import useGetTeamListQuery from "quires/team/useTeamList";

const FindTeam = () => {
  const [value, setValue] = useState<string>("");

  const { data: TeamListResponse, refetch } = useGetTeamListQuery(0, 40, "SHUFFLE");

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
        {TeamListResponse &&
          TeamListResponse.data.content.map((el) => {
            return (
              <TeamCard
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
