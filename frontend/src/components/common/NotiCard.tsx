import React from "react";
import Button from "./button";

interface notifyType {
  applyTime: number;
  userName: string;
  time: string;
}
const test = () => {
  alert("hi");
};

const NotiCard = ({ applyTime, userName, time }: notifyType) => {
  return (
    <div className="noti-card">
      <div>
        <div className="date">
          <p>가입 신청</p>
          <span>
            {applyTime}
            {time} 전
          </span>
        </div>
        <div className="name">{userName}님이 헬로우마이팀에 가입신청했어요</div>
      </div>
      <ul className="buttons">
        <li>
          <Button text="거절" handler={test} />
        </li>
        <li>
          <Button text="수락" handler={test} />
        </li>
      </ul>
    </div>
  );
};

export default NotiCard;
