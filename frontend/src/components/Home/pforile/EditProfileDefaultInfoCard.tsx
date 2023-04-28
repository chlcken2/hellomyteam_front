import Input from "components/common/Input";
import Select, { OptionType } from "components/common/Select";
import { ProfileInfoType } from "types/profileType";

interface PropsType {
  profileInfo: ProfileInfoType;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfoType>>;
  handleProfileInfo: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LOCAL_OPTIONS = [
  { label: "선택해주세요", value: "선택해주세요" },
  { label: "서울", value: "서울" },
];

const EditProfileDefaultInfoCard = ({
  profileInfo,
  setProfileInfo,
  handleProfileInfo,
}: PropsType) => {
  const handleLocalSelect = (e: OptionType) => {
    setProfileInfo((prev) => ({ ...prev, local: e.value }));
  };

  return (
    <div className="card">
      <h3 className="title">기본</h3>
      <div className="card-content">
        <div className="edit-content-wrapper">
          <div className="label">이름</div>
          <div className="content">
            <div className="input">
              <Input id="name" value={profileInfo.name} onChange={handleProfileInfo} />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">한줄소개</div>
          <div className="content">
            <div className="input">
              <Input
                id="intro"
                value={profileInfo.intro}
                onChange={handleProfileInfo}
                maxLength={30}
                placeholder="띄어쓰기 포함 30자"
              />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">상태</div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">활동 지역</div>
          <div className="content">
            <div className="select">
              <Select
                options={LOCAL_OPTIONS}
                onChange={handleLocalSelect}
                defaultValue="서울"
                placeholder="선택해주세요"
              />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">휴대폰번호</div>
          <div className="content">
            <div className="input">
              <Input id="phone" value={profileInfo.phone} onChange={handleProfileInfo} />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">생년월일</div>
          <div className="content">
            <div className="input">
              <Input id="birth" value={profileInfo.birth} onChange={handleProfileInfo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDefaultInfoCard;
