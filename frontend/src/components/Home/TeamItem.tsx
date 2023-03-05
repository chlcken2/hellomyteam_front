import { FC, memo } from "react";

interface PropsType {
  name: string;
}

const TeamItem: FC<PropsType> = ({ name }) => {
  return (
    <li className="team-list-item">
      <div className="name">
        <div className="profile" />
        <span>{name}</span>
      </div>
      <div className="role">
        <span>팀원</span>
      </div>
      <div className="position">
        <span>공격수</span>
      </div>
    </li>
  );
};

export default memo(TeamItem);
