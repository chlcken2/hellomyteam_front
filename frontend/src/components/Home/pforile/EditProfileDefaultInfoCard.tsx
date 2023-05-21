import { useState } from "react";
import Input from "components/common/Input";
import Select, { OptionType } from "components/common/Select";
import { ProfileInfoType } from "types/profileType";
import StateSelector from "./StateSelector";
import LocalSelector from "./LocalSelector";

interface PropsType {
  profileInfo: ProfileInfoType;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfoType>>;
  handleProfileInfo: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditProfileDefaultInfoCard = ({
  profileInfo,
  setProfileInfo,
  handleProfileInfo,
}: PropsType) => {
  const handlePhoneOpenState = (value: boolean) => {
    setProfileInfo((prev) => ({ ...prev, isPhoneOpen: value }));
  };
  const handleBirthOpenState = (value: boolean) => {
    setProfileInfo((prev) => ({ ...prev, isBirthOpen: value }));
  };

  return (
    <div className="card">
      <h3 className="title">기본</h3>
      <div className="card-content">
        <div className="edit-content-wrapper">
          <div className="label">이름</div>
          <div className="content">
            <div className="input">
              <Input
                id="name"
                value={profileInfo.name}
                onChange={handleProfileInfo}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">한줄소개</div>
          <div className="content">
            <div className="input">
              <Input
                id="memberOneIntro"
                value={profileInfo.memberOneIntro}
                onChange={handleProfileInfo}
                maxLength={30}
                placeholder="띄어쓰기 포함 30자"
              />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">상태</div>
          <div className="content">
            <StateSelector profileInfo={profileInfo} setProfileInfo={setProfileInfo} />
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">활동 지역</div>
          <div className="content">
            <LocalSelector profileInfo={profileInfo} setProfileInfo={setProfileInfo} />
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">휴대폰번호</div>
          <div className="content">
            <div className="input">
              <Input
                id="phone"
                type="number"
                maxLength={11}
                placeholder="11자리 숫자"
                value={profileInfo.phone}
                onChange={handleProfileInfo}
              />
            </div>
            <div className="radio-container">
              <button
                onClick={() => handlePhoneOpenState(true)}
                className="radio-wrapper"
              >
                <input type="radio" readOnly checked={profileInfo.isPhoneOpen} />
                <span>공개</span>
              </button>
              <button
                onClick={() => handlePhoneOpenState(false)}
                className="radio-wrapper"
              >
                <input type="radio" readOnly checked={!profileInfo.isPhoneOpen} />
                <span>비공개</span>
              </button>
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">생년월일</div>
          <div className="content">
            <div className="input">
              <Input
                id="birthday"
                value={profileInfo.birthday}
                onChange={handleProfileInfo}
                readOnly
              />
            </div>
            <div className="radio-container">
              <button
                onClick={() => handleBirthOpenState(true)}
                className="radio-wrapper"
              >
                <input type="radio" readOnly checked={profileInfo.isBirthOpen} />
                <span>공개</span>
              </button>
              <button
                onClick={() => handleBirthOpenState(false)}
                className="radio-wrapper"
              >
                <input type="radio" readOnly checked={!profileInfo.isBirthOpen} />
                <span>비공개</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDefaultInfoCard;
