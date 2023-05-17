import { useState, useEffect } from "react";
import Button from "components/common/Button";
import "styles/pages/profile.scss";
import { ProfileInfoType } from "types/profileType";

interface PropsType {
  profileInfo: ProfileInfoType;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfoType>>;
}

const CONDITIONS = ["휴식중", "부상", "피로", "활력", "회복중"];
const FEELS = ["열정", "신남", "슬픔", "즐거움", "설렘"];
const ACTIVITYS = ["파견", "출장", "개인연습", "여행", "야근"];

const StateSelector = ({ profileInfo, setProfileInfo }: PropsType) => {
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [isViewModal, setIsViewModal] = useState(false);

  const activeButtonClassName = (word: string) =>
    selectedState.includes(word) ? "active" : "";

  const handleIsViewModal = () => setIsViewModal((prev) => !prev);

  const handleSelectedState = (word: string) => {
    const isIncludedWord = selectedState.includes(word);

    if (isIncludedWord) {
      const filteredState = selectedState.filter((state) => state !== word);
      setSelectedState(filteredState);
    } else {
      if (selectedState.length === 5) return;

      const addedState = [...selectedState, word];
      setSelectedState(addedState);
    }
  };

  const saveState = () => {
    setProfileInfo((prev) => ({ ...prev, conditionStatus: selectedState }));
    setIsViewModal(false);
  };

  useEffect(() => {
    if (isViewModal && profileInfo) {
      setSelectedState([...profileInfo.conditionStatus]);
    } else {
      setSelectedState([]);
    }
  }, [isViewModal, profileInfo]);

  return (
    <>
      <div className="selector-wrapper">
        <p>
          {profileInfo.conditionStatus.length > 0
            ? profileInfo.conditionStatus.join(", ")
            : "상태를 설정해주세요"}
        </p>
        <button onClick={handleIsViewModal}>
          <svg
            width="9"
            height="14"
            viewBox="0 0 9 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.66699 12.8327L7.50033 6.99935L1.66699 1.16602"
              stroke="#7A7A7A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {isViewModal && (
        <div className="modal-container">
          <div className="backdrop" />
          <div className="modal">
            <div className="modal-header">
              <button onClick={handleIsViewModal}>
                <span className="arrow">
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
                </span>
                <span className="close">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12.8794L12.8794 1.00005M1 1L12.8794 12.8793"
                      stroke="#1D1D1D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <div className="modal-content">
              <div className="title-wrapper">
                <h3>상태</h3>
                <p>나의 상태를 표현해보세요. (최대 5개)</p>
              </div>
              <div className="state-select-container">
                <div className="state-select-wrapper">
                  <div>컨디션</div>
                  <ul className="state-select-list">
                    {CONDITIONS.map((condition, idx) => (
                      <li key={idx}>
                        <button
                          className={activeButtonClassName(condition)}
                          onClick={() => handleSelectedState(condition)}
                        >
                          {condition}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="state-select-wrapper">
                  <div>기분</div>
                  <ul className="state-select-list">
                    {FEELS.map((feel, idx) => (
                      <li key={idx}>
                        <button
                          className={activeButtonClassName(feel)}
                          onClick={() => handleSelectedState(feel)}
                        >
                          {feel}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="state-select-wrapper">
                  <div>활동</div>
                  <ul className="state-select-list">
                    {ACTIVITYS.map((activity, idx) => (
                      <li key={idx}>
                        <button
                          className={activeButtonClassName(activity)}
                          onClick={() => handleSelectedState(activity)}
                        >
                          {activity}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button width="fullWidth" text="저장" color="blue" handler={saveState} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StateSelector;
