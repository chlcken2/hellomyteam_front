import Button from "components/common/Button";
import { useState, useEffect } from "react";
import "styles/pages/profile.scss";
import { ProfileInfoType, SelectedLocalListType } from "types/profileType";
import locals from "utils/locals";

interface PropsType {
  profileInfo: ProfileInfoType;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfoType>>;
  isCreateTeam?: boolean;
}

const LocalSelector = ({ profileInfo, setProfileInfo, isCreateTeam }: PropsType) => {
  const [selectedLocalList, setSelectedLocalList] = useState<SelectedLocalListType[]>([]);
  const [isViewModal, setIsViewModal] = useState(false);
  const [selectedLocalIndex, setSelectedLocalIndex] = useState(0);
  const selectedLocal = locals.find((_, idx) => idx === selectedLocalIndex);
  const [alert, setAlert] = useState(false);
  const activeLocalItemClassName = (title: string, localName: string) => {
    const isInclude = selectedLocalList.find(
      (item) => item.title === title && item.localName === localName,
    );
    return isInclude ? "active" : "";
  };

  const handleIsViewModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsViewModal((prev) => !prev);
  };

  const handleSelectedLocalList = (title: string, localName: string) => {
    setAlert(false);
    const isInclude = selectedLocalList.find(
      (item) => item.title === title && item.localName === localName,
    );

    if (isInclude) {
      removeSelectedLocal(title, localName);
    } else {
      if (isCreateTeam) {
        if (selectedLocalList.length === 1) {
          setAlert(true);
          return;
        }
      }
      if (selectedLocalList.length === 5) return;

      const addedLocalList = [...selectedLocalList, { title, localName }];
      setSelectedLocalList(addedLocalList);
    }
  };

  const removeSelectedLocal = (title: string, localName: string) => {
    const filteredLocalList = selectedLocalList.filter(
      (item) => item.title !== title || item.localName !== localName,
    );
    setSelectedLocalList(filteredLocalList);
  };

  const saveLocal = () => {
    setProfileInfo((prev) => ({ ...prev, address: selectedLocalList }));
    setIsViewModal(false);
  };

  useEffect(() => {
    if (isViewModal && profileInfo) {
      setSelectedLocalList([...profileInfo.address]);
    } else {
      setSelectedLocalList([]);
    }
  }, [isViewModal, profileInfo]);

  return (
    <>
      <div className="selector-wrapper">
        <p>
          {profileInfo.address.length > 0
            ? profileInfo.address
                .map((item) => `${item.title} - ${item.localName}`)
                .join(", ")
            : "지역을 설정해주세요"}
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
            <div className="local-modal-content">
              <div className="title-wrapper local">
                <h3>활동 지역</h3>
                <p>
                  주요 활동 지역을 선택해주세요. {!isCreateTeam && "(최대 5개)"}
                  {alert && "(1개의 지역만 가능)"}
                </p>
              </div>
              <div className="local-container">
                <div className="local-select-container">
                  <ul className="local-title-list">
                    {locals.map((local, idx) => (
                      <li
                        key={idx}
                        className={selectedLocalIndex === idx ? "active" : ""}
                        onClick={() => setSelectedLocalIndex(idx)}
                        role="presentation"
                      >
                        {local.title}
                      </li>
                    ))}
                  </ul>
                  <ul className="local-list">
                    {selectedLocal.list.map((localItem, idx) => (
                      <li
                        className={activeLocalItemClassName(
                          selectedLocal.title,
                          localItem,
                        )}
                        onClick={() =>
                          handleSelectedLocalList(selectedLocal.title, localItem)
                        }
                        key={idx}
                        role="presentation"
                      >
                        <span>{localItem}</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.16699 10.834L7.50033 14.1673L15.8337 5.83398"
                            stroke="#5E81FF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {selectedLocalList.length > 0 && (
                <div className="selected-local-viewer">
                  {!isCreateTeam && (
                    <div className="content">
                      <div>
                        선택한 지역 <span>{selectedLocalList.length}개</span>
                      </div>
                      <ul>
                        {selectedLocalList.map((local, idx) => (
                          <li key={idx}>
                            <span>{`${local.title} - ${local.localName}`}</span>
                            <button
                              onClick={() =>
                                removeSelectedLocal(local.title, local.localName)
                              }
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 8.91963L8.9196 1.00003M1 1L8.9196 8.9196"
                                  stroke="#7A7A7A"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="button-wrapper">
                    {!isCreateTeam && (
                      <div className="init">
                        <Button
                          text="초기화"
                          width="fullWidth"
                          handler={() => setSelectedLocalList([])}
                        />
                      </div>
                    )}
                    <div className="save">
                      <Button
                        text="저장"
                        width="fullWidth"
                        color="blue"
                        handler={saveLocal}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocalSelector;
