import Input from "components/common/Input";
import Select, { OptionType } from "components/common/Select";
import { ProfileInfoType } from "types/profileType";

interface PropsType {
  profileInfo: ProfileInfoType;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfoType>>;
  handleProfileInfo: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const POSITION_OPTIONS = [
  { label: "선택해주세요", value: "선택해주세요" },
  { label: "최전방 공격수", value: "최전방 공격수" },
  { label: "우측 공격수", value: "우측 공격수" },
  { label: "좌측 공격수", value: "좌측 공격수" },
  { label: "공격형 미드필더", value: "공격형 미드필더" },
  { label: "수비형 미드필더", value: "수비형 미드필더" },
  { label: "우측 수비수", value: "우측 수비수" },
  { label: "우측 센터백", value: "우측 센터백" },
  { label: "좌측 센터백", value: "좌측 센터백" },
  { label: "좌측 수비수", value: "좌측 수비수" },
  { label: "골키퍼", value: "골키퍼" },
];

const WEAK_OPTIONS = [
  { label: "선택해주세요", value: "선택해주세요" },
  { label: "왼발", value: "왼발" },
  { label: "오른발", value: "오른발" },
];

const EditProfileTeamInfoCard = ({
  profileInfo,
  setProfileInfo,
  handleProfileInfo,
}: PropsType) => {
  const handlePositionSelect = (e: OptionType) => {
    setProfileInfo((prev) => ({ ...prev, preferPosition: e.value }));
  };

  const handleWeakSelect = (e: OptionType) => {
    setProfileInfo((prev) => ({ ...prev, leftRightFoot: e.value }));
  };

  return (
    <div className="card">
      <h3 className="title">팀</h3>
      <div className="card-content">
        <div className="edit-content-wrapper">
          <div className="label">등번호</div>
          <div className="content">
            <div className="input">
              <Input
                type="number"
                id="backNumber"
                value={profileInfo.backNumber}
                onChange={handleProfileInfo}
                max={99}
                min={0}
                placeholder="0~99 사이 숫자"
              />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">선호 포지션</div>
          <div className="content">
            <div className="select">
              <Select
                modalTitle="선호 포지션"
                options={POSITION_OPTIONS}
                onChange={handlePositionSelect}
                defaultValue="최전방 공격수"
                placeholder="선택해주세요"
              />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">약발정보</div>
          <div className="content">
            <div className="select">
              <Select
                modalTitle="약발정보"
                options={WEAK_OPTIONS}
                onChange={handleWeakSelect}
                defaultValue="왼발"
                placeholder="선택해주세요"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileTeamInfoCard;
