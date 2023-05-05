import { useState } from "react";
import "styles/pages/profile.scss";
import { ProfileInfoType } from "types/profileType";
import EditProfileDefaultInfoCard from "components/Home/pforile/EditProfileDefaultInfoCard";
import EditProfileTeamInfoCard from "components/Home/pforile/EditProfileTeamInfoCard";
import EditProfileEtcInfoCard from "components/Home/pforile/EditProfileEtcInfoCard";
import Button from "components/common/Button";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_INFO: ProfileInfoType = {
  name: "손흥민",
  intro: "",
  state: [],
  local: [],
  phone: "",
  birth: "2001. 12. 20",
  backNum: "",
  position: "",
  weakInfo: "",
  condition: "",
  amountOfAlcohol: "",
  isPhoneOpen: true,
  isBirthOpen: true,
};

const EditProfile = () => {
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState<ProfileInfoType>(DEFAULT_PROFILE_INFO);

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleSubmit = () => {
    alert("저장");
  };

  const handleProfileInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileInfo({ ...profileInfo, [e.target.id]: e.target.value });
  };

  return (
    <div className="main-wrap">
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <button onClick={handleCancel}>
            <svg
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 15L1 8L8 1"
                stroke="#1D1D1D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="edit-profile-content">
          <h2>프로필 수정</h2>
          <div className="card-list">
            <EditProfileDefaultInfoCard
              profileInfo={profileInfo}
              handleProfileInfo={handleProfileInfo}
              setProfileInfo={setProfileInfo}
            />
            <EditProfileTeamInfoCard
              profileInfo={profileInfo}
              handleProfileInfo={handleProfileInfo}
              setProfileInfo={setProfileInfo}
            />
            <EditProfileEtcInfoCard
              profileInfo={profileInfo}
              handleProfileInfo={handleProfileInfo}
              setProfileInfo={setProfileInfo}
            />
          </div>
        </div>
        <div className="edit-profile-footer">
          <div>
            <Button text="취소" handler={handleCancel} color="white" width="fullWidth" />
          </div>
          <div>
            <Button text="저장" handler={handleSubmit} color="blue" width="fullWidth" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
