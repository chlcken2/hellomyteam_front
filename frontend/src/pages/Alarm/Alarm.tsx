import NotiCard from "components/common/NotiCard";
import { useJoinAlarmAcceptMutation } from "quires/alarm/useJoinAlarmMutation";
import useJoinAlarmQuery from "quires/alarm/useJoinAlarmQuery";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";

import "styles/pages/alarm.scss";

const Alarm: FC = () => {
  const user = useRecoilValue(UserState);

  // 가입 신청 알람 fetch query
  const { data: JoinAlarmResponse } = useJoinAlarmQuery({
    teamId: user?.selectedTeamId,
    teamMemberInfoId: user?.teamMemberInfoId,
  });

  // 가입 신청 수락 및 거절 mutation
  const {
    mutate: acceptJoinTeam,
    error: acceptJoinTeamError,
    isLoading: isAcceptJoinTeamLoading,
  } = useJoinAlarmAcceptMutation(user?.selectedTeamId);
  const {
    mutate: rejectJoinTeam,
    error: rejectJoinTeamError,
    isLoading: isRejectJoinTeamLoading,
  } = useJoinAlarmAcceptMutation(user?.selectedTeamId);

  const handleJoinTeamAlarm = (judge: "accept" | "reject", memberId: number) => {
    if (isAcceptJoinTeamLoading || isRejectJoinTeamLoading) return;
    if (judge === "accept") acceptJoinTeam(memberId);
    if (judge === "reject") rejectJoinTeam(memberId);
  };

  return (
    <div className="main-wrap">
      <h1 className="main-title">알림</h1>
      <div className="alram-container">
        {JoinAlarmResponse?.data?.length > 0 ? (
          <ul className="alram-list">
            {typeof JoinAlarmResponse?.data !== "string" &&
              JoinAlarmResponse?.data.map((joinAlarmItem, idx) => {
                return (
                  <li key={idx}>
                    <NotiCard
                      onClickAcceptButton={() =>
                        handleJoinTeamAlarm("accept", joinAlarmItem.memberId)
                      }
                      onClickRejectButton={() =>
                        handleJoinTeamAlarm("reject", joinAlarmItem.memberId)
                      }
                      applyTime={1}
                      userName={joinAlarmItem.name}
                    />
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className="alart-null-box">알림이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Alarm;
