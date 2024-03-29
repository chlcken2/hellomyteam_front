import { useNavigate, useRouteLoaderData } from "react-router-dom";
import "../../styles/pages/myTeam.scss";
import TeamCard from "components/common/TeamCard";
import { joinTeamTypes } from "types/UserTypes";
import Button from "components/common/Button";
import teamMemberId from "quires/team/getTeamMemberId";
import { useEffect, useState } from "react";
import useTeamExitQuery from "quires/team/useTeamExitQuery";
import { removeLocalCookie } from "utils/setAuthorization";

const isTeamJoined = true;

const MyTeam = () => {
  const myTeamList = useRouteLoaderData("nav") as joinTeamTypes[];
  const navigate = useNavigate();
  const memberId = Number(localStorage.getItem("userId"));
  const [exitTeamId, setExitTeamId] = useState<number>(null);

  const { data: teamMemeberIdResponse, refetch: teamMemberIdRefetch } = teamMemberId(
    exitTeamId,
    memberId,
    !!exitTeamId,
  );
  const { refetch: teamExitRefetch } = useTeamExitQuery(
    exitTeamId,
    teamMemeberIdResponse && teamMemeberIdResponse.data,
  );

  useEffect(() => {
    if (exitTeamId) {
      teamMemberIdRefetch().then(() => teamExitRefetch());
    }
  }, [exitTeamId]);

  const handleLogout = () => {
    removeLocalCookie();
    navigate("/onboarding");
  };

  const handleTeamExit = (exitTeamId: number) => {
    setExitTeamId(exitTeamId);
  };

  return (
    <div className="main-wrap">
      <div className="my-team-header">
        <h1 className="main-title">계정</h1>
        <div className="my-team-button-wrap">
          <Button key={1} text="로그아웃" handler={() => handleLogout()} />
          <Button
            key={2}
            text="팀 생성"
            handler={() => navigate("/account/create")}
            color="blue"
          />
        </div>
      </div>
      <div className="my-team-container">
        <h1 className="my-team-main-title">나의 팀</h1>
        <div className="my-team-card">
          {myTeamList?.map((el) => (
            <div key={el.teamId}>
              <TeamCard
                isTeamJoined={isTeamJoined}
                title={el.teamName}
                slogan={el.oneIntro}
                imageUrl={el.imageUrl}
                joinHandler={() => handleTeamExit(el.teamId)}
                buttonText="탈퇴"
                buttonColor="blue"
                num={el.memberCount}
                hoverTransition={false}
              />
              <div className="my-team-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
