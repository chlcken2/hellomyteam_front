import React from "react";
import CheckBox from "components/common/CheckBox";
import NotifyCard from "components/common/NotifyCard";

const Shorcut = () => {
  return (
    <div style={{ paddingTop: "40px" }}>
      <CheckBox id="agree" />
      <NotifyCard applyTime={3} userName="ddd" />
    </div>
  );
};

export default Shorcut;
