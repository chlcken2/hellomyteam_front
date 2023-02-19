import React from "react";
import COLOR from "constants/color";
import Button from "./button";

interface notifyType {
  applyTime: number;
  userName: string;
}
const test = () => {
  alert("hi");
};
const NotifyCard = ({ applyTime, userName }: notifyType) => {
  return (
    <div className="noti-card">
      <div>
        <div className="noti-card__date">
          <p>가입 신청</p>
          <span>{applyTime}시간 전</span>
        </div>
        <div>{userName}님이 헬로우마이팀에 가입신청했어요</div>
      </div>
      <Button
        text="수락"
        handler={test}
        style={{
          background: COLOR.white,
          color: COLOR["--gray-400"],
          fontWeight: "bold",
          marginRight: "5px",
          width: "100%",
          border: "1px solid #E6E6E6",
        }}
      />
    </div>
  );
};

export default NotifyCard;
