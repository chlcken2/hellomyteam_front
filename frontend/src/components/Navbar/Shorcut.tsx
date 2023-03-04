import React from "react";
import NotiCard from "components/common/NotiCard";
import TeamCard from "components/common/TeamCard";

const Shorcut = () => {
  return (
    <div style={{ paddingTop: "40px" }}>
      <TeamCard />
      <TeamCard />
      <TeamCard />
      <TeamCard />
      <NotiCard applyTime={3} time="시간" userName="dddd" />
    </div>
  );
};

export default Shorcut;
