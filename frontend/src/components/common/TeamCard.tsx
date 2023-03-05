import React, { useState, useEffect } from "react";
import Button from "./button";

interface NotiType {
  title: string;
  slogan: string;
  num: number;
}
const TeamCard = ({ title, slogan, num }: NotiType) => {
  const img = process.env.PUBLIC_URL;
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
