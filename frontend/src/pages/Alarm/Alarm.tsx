import NotiCard from "components/common/NotiCard";
import { useJoinAlarmAcceptMutation } from "quires/alarm/useJoinAlarmMutation";
import useJoinAlarmQuery from "quires/alarm/useJoinAlarmQuery";
import { FC } from "react";

import "styles/pages/alarm.scss";

// API 사용을 위한 임시 데이터
const TEMP_DATA = {
  teamId: 91,
  teamMemberInfoId: 105,
};

const Alarm: FC = () => {
  // 가입 신청 알람 fetch query
  const { data: JoinAlarmResponse } = useJoinAlarmQuery({
    teamId: TEMP_DATA.teamId,
    teamMemberInfoId: TEMP_DATA.teamMemberInfoId,
  });

  // 가입 신청 수락 및 거절 mutation
  const {
    mutate: acceptJoinTeam,
    error: acceptJoinTeamError,
    isLoading: isAcceptJoinTeamLoading,
  } = useJoinAlarmAcceptMutation(TEMP_DATA.teamId);
  const {
    mutate: rejectJoinTeam,
    error: rejectJoinTeamError,
    isLoading: isRejectJoinTeamLoading,
  } = useJoinAlarmAcceptMutation(TEMP_DATA.teamId);

  const handleJoinTeamAlarm = (judge: "accept" | "reject", memberId: number) => {
    if (isAcceptJoinTeamLoading || isRejectJoinTeamLoading) return;
    if (judge === "accept") acceptJoinTeam(memberId);
    if (judge === "reject") rejectJoinTeam(memberId);
  };

  return (
    <div className="main-wrap">
      <h1 className="main-title">알림</h1>
      <div className="alram-container">
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
      </div>
    </div>
  );
};

export default Alarm;
