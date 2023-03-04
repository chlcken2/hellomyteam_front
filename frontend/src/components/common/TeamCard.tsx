import React, { useState, useEffect } from "react";
import Button from "./button";

const TeamCard = () => {
  const img = process.env.PUBLIC_URL;
  const [title, setTitle] = useState("헬로우마이팀");
  const [slogan, setSlogan] = useState("안녕하세요 헬로우마이팀입니다.");
  const [num, setNum] = useState(24);
  const test = () => {
    console.log("test");
  };
  return (
    <div className="team-card">
      <div className="wrap">
        <span>
          <img src={`${img}/common/person.png`} alt="" />
        </span>
        <h4 className="title">{title}</h4>
        <p className="slogan">{slogan}</p>
        <div className="person">
          <span>
            <img src={`${img}/common/person.png`} alt="인원수" />
          </span>
          <p>{num}명</p>
        </div>
      </div>
      <div>
        <Button text="가입" width="fullWidth" handler={test} />
      </div>
    </div>
  );
};

export default TeamCard;
