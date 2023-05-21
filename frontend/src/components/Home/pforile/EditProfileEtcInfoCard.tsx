import Input from "components/common/Input";
import Select, { OptionType } from "components/common/Select";
import { ProfileInfoType } from "types/profileType";

interface PropsType {
  profileInfo: ProfileInfoType;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfoType>>;
  handleProfileInfo: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ALCOHOL_OPTIONS = [
  { label: "선택해주세요", value: "선택해주세요" },
  { label: "0", value: 0 },
  { label: "0.3", value: 0.3 },
  { label: "0.5", value: 0.5 },
  { label: "1", value: 1 },
  { label: "1.5", value: 1.5 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "측정불가", value: "측정불가" },
];

const EditProfileEtcInfoCard = ({
  profileInfo,
  setProfileInfo,
  handleProfileInfo,
}: PropsType) => {
  const handleAlcoholSelect = (e: OptionType) => {
    setProfileInfo((prev) => ({ ...prev, drinkingCapacity: e.value }));
  };

  return (
    <div className="card">
      <h3 className="title">기타</h3>
      <div className="card-content">
        <div className="edit-content-wrapper">
          <div className="label">컨디션</div>
          <div className="content">
            <div className="input">
              <Input
                type="number"
                id="conditionIndicator"
                value={profileInfo.conditionIndicator}
                onChange={handleProfileInfo}
                max={100}
                min={0}
                placeholder="0~100 사이 숫자"
              />
            </div>
          </div>
        </div>
        <div className="edit-content-wrapper">
          <div className="label">주량</div>
          <div className="content">
            <div className="select">
              <Select
                modalTitle="주량"
                options={ALCOHOL_OPTIONS}
                onChange={handleAlcoholSelect}
                defaultValue={1}
                placeholder="선택해주세요"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileEtcInfoCard;
