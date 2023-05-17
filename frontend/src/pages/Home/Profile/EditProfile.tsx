import { useEffect, useState } from "react";
import "styles/pages/profile.scss";
import { ChangeInfoType, ProfileInfoType } from "types/profileType";
import EditProfileDefaultInfoCard from "components/Home/pforile/EditProfileDefaultInfoCard";
import EditProfileTeamInfoCard from "components/Home/pforile/EditProfileTeamInfoCard";
import EditProfileEtcInfoCard from "components/Home/pforile/EditProfileEtcInfoCard";
import Button from "components/common/Button";
import { useNavigate } from "react-router-dom";
import { useEditProfileInfoMutation } from "quires/profile/useTeamProfileMutation";
import { useGetTeamProfileInfoQuery } from "quires/profile/useTeamProfileQuery";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";

const TEMP_TEAM_MEMBER_INFO_ID = 142;

const DEFAULT_PROFILE_INFO: ProfileInfoType = {
  name: "",
  memberOneIntro: "",
  conditionStatus: [],
  address: [],
  phone: "",
  birthday: "",
  backNumber: "",
  preferPosition: "",
  leftRightFoot: "",
  conditionIndicator: "",
  drinkingCapacity: "",
  isPhoneOpen: true,
  isBirthOpen: true,
};

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(UserState);
  const [profileInfo, setProfileInfo] = useState<ProfileInfoType>(DEFAULT_PROFILE_INFO);

  const { data: profileInfoData } = useGetTeamProfileInfoQuery({
    teamMemberInfoId: TEMP_TEAM_MEMBER_INFO_ID,
    teamId: user?.selectedTeamId,
  });

  const { mutate: editProfileInfo } = useEditProfileInfoMutation(
    110,
    TEMP_TEAM_MEMBER_INFO_ID,
  );

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleSubmit = () => {
    const changeInfo: ChangeInfoType = {
      changeAddress: "",
      changeBackNumber: Number(profileInfo.backNumber),
      changeBirthday: profileInfo.birthday,
      changeConditionIndicator: Number(profileInfo.conditionIndicator),
      changeConditionStatus: "INJURY",
      changeDrinkingCapacity: Number(profileInfo.drinkingCapacity),
      changeLeftRightFoot: profileInfo.leftRightFoot,
      changeMemberOneIntro: profileInfo.memberOneIntro,
      changeName: profileInfo.name,
      changePreferPosition: "ST",
    };

    console.log(changeInfo, "changeInfo");

    editProfileInfo(changeInfo);
    navigate("/profile");
  };

  const handleProfileInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileInfo({ ...profileInfo, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (profileInfoData?.data) {
      console.log(profileInfoData?.data);
      setProfileInfo({
        ...profileInfoData.data,
        conditionStatus: [],
        address: [],
        backNumber: String(profileInfoData.data.backNumber),
        conditionIndicator: String(profileInfoData.data.conditionIndicator),
        drinkingCapacity: String(profileInfoData.data.drinkingCapacity),
        isPhoneOpen: true,
        isBirthOpen: true,
      });
    }
  }, [profileInfoData]);

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
