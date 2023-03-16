import React, { useState, useEffect } from "react";
import { MutateOptions } from "react-query";
import Button from "./button";

interface NotiType {
  title: string;
  slogan: string;
  num: number;
  imageUrl: string;
  joinHandler?: () => void;
}
const TeamCard = ({ title, slogan, num, imageUrl, joinHandler }: NotiType) => {
  const img = process.env.PUBLIC_URL;

  return (
    <div className="team-card">
      <div className="wrap">
        <span>
          <img src={imageUrl} alt="teamLogo" />
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
        <Button text="가입" width="fullWidth" handler={joinHandler} />
      </div>
    </div>
  );
};

export default TeamCard;
