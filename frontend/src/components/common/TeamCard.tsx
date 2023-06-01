import React, { useState, useEffect } from "react";
import { MutateOptions } from "react-query";
import Button from "./Button";
import DefaultAvatar from "./DefaultAvatar";

interface NotiType {
  title: string;
  slogan: string;
  num: number;
  imageUrl: string;
  joinHandler?: () => void;
  teamId?: number;
  isTeamJoined: boolean;
  buttonText: string;
  buttonColor?: "blue" | "white";
}

const img = process.env.PUBLIC_URL;

const TeamCard = ({
  title,
  slogan,
  num,
  imageUrl,
  teamId,
  isTeamJoined,
  buttonText,
  buttonColor,
  joinHandler,
}: NotiType) => {
  return (
    <div className="team-card">
      <div className="team-card-contents">
        <DefaultAvatar
          type="TEAM"
          width={46}
          height={46}
          imageUrl={imageUrl}
          alt="teamLogo"
          uniqueNum={teamId}
        />
        <div className="title">
          <h4>{title}</h4>
          {isTeamJoined && <span>가입한 팀</span>}
        </div>
        <p className="slogan">{slogan}</p>
        <div className="person">
          <span>
            <img width={18} height={18} src={`${img}/common/person.png`} alt="인원수" />
          </span>
          <p>{num}명</p>
        </div>
      </div>
      <div className="team-card-join-button">
        {!isTeamJoined && (
          <Button
            text={buttonText}
            width="fullWidth"
            handler={joinHandler}
            color={buttonColor}
          />
        )}
      </div>
    </div>
  );
};

export default TeamCard;
