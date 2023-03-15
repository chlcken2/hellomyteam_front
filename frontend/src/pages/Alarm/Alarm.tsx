import NotiCard from "components/common/NotiCard";
import { FC } from "react";

import "styles/pages/alarm.scss";

const Alarm: FC = () => {
  return (
    <div className="main-wrap">
      <h1 className="main-title">알림</h1>
      <div className="alram-container">
        <ul className="alram-list">
          <li>
            <NotiCard applyTime={3} userName="찬영" />
          </li>
          <li>
            <NotiCard applyTime={3} userName="찬영" />
          </li>
          <li>
            <NotiCard applyTime={3} userName="찬영" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Alarm;
