import NotiCard from "components/common/NotiCard";
import useJoinAlarmQuery from "quires/alarm/useJoinAlarmQuery";
import { FC } from "react";

import "styles/pages/alarm.scss";

// API 사용을 위한 임시 데이터
const TEMP_DATA = {
  teamId: 91,
  teamMemberInfoId: 105,
};

const Alarm: FC = () => {
  const { data: JoinAlarmResponse } = useJoinAlarmQuery({
    teamId: TEMP_DATA.teamId,
    teamMemberInfoId: TEMP_DATA.teamMemberInfoId,
  });

  return (
    <div className="main-wrap">
      <h1 className="main-title">알림</h1>
      <div className="alram-container">
        <ul className="alram-list">
          {JoinAlarmResponse?.data.map((joinAlarmItem, idx) => (
            <li key={idx}>
              <NotiCard applyTime={1} userName={joinAlarmItem.name} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Alarm;
