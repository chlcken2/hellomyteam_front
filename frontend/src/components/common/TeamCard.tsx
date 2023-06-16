import Button from "./Button";
import DefaultAvatar from "./DefaultAvatar";

interface NotiType {
  title: string;
  slogan: string;
  num: number;
  imageUrl: string;
  joinHandler?: () => void;
  teamId?: number;
  isTeamJoined: boolean;
  buttonText: string;
  buttonColor?: "blue" | "white";
  hoverTransition?: boolean;
}

const img = process.env.PUBLIC_URL;

const TeamCard = ({
  title,
  slogan,
  num,
  imageUrl,
  teamId,
  isTeamJoined,
  buttonText,
  buttonColor,
  joinHandler,
  hoverTransition = true,
}: NotiType) => {
  const joinButtonClassName = hoverTransition
    ? "team-card-join-button"
    : "team-card-join-button-no-transition";

  const teamCardButton = () => {
    if ((hoverTransition && !isTeamJoined) || (!hoverTransition && isTeamJoined)) {
      return (
        <Button
          text={buttonText}
          width="fullWidth"
          handler={joinHandler}
          color={buttonColor}
        />
      );
    }

    return null;
  };
  return (
    <div className="team-card">
      <div className="team-card-contents">
        <DefaultAvatar
          type="TEAM"
          width={46}
          height={46}
          imageUrl={imageUrl}
          alt="teamLogo"
          uniqueNum={teamId}
        />
        <div className="title">
          <h4>{title}</h4>
          {isTeamJoined && <span>가입한 팀</span>}
        </div>
        <p className="slogan">{slogan}</p>
        <div className="person">
          <span>
            <img width={18} height={14} src={`${img}/common/person.png`} alt="인원수" />
          </span>
          <p>{num}명</p>
        </div>
      </div>
      <div className={joinButtonClassName}>{teamCardButton()}</div>
    </div>
  );
};

export default TeamCard;
