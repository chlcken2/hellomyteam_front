import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Input from "components/common/Input";
import Select from "components/common/Select";
import Button from "components/common/Button";
import { useRecoilValue } from "recoil";
import { teamCreateQuery } from "quires/team/teamCreate";
import LocalSelector from "components/Home/pforile/LocalSelector";
import { ProfileInfoType } from "types/profileType";
import { instance } from "../../config/api";
import UserState from "../../recoil/userAtom";

const CreateTeam: FC = () => {
  const navi = useNavigate();
  const { mutate, data: createTeam, isLoading: isGetTeamLoading } = teamCreateQuery();
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
  const [profileInfo, setProfileInfo] = useState<ProfileInfoType>(DEFAULT_PROFILE_INFO);
  const [create, setCreate] = useState(false);
  const img = process.env.PUBLIC_URL;
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [flag, setFlag] = useState(true);
  const [tactic, setTactic] = useState({
    label: "점유율",
    value: "POSSESSION",
  });
  const [detail, setDetail] = useState("");
  const [file, setFile] = useState<File>();
  const [err, setErr] = useState({
    name: "",
    text: "",
    detail: "",
    address: "",
    tactic: "",
  });

  const user = useRecoilValue(UserState);

  const handler = async (e: React.MouseEvent) => {
    e.preventDefault();

    const regex = /^\d+$/;
    if (regex.test(name)) return alert("숫자만 섞인 팀이름은 사용할 수 없습니다");
    if (name.length < 2 || name.length > 12)
      return alert("팀 이름은 2글자 이상 12글자 이하로 해주세요.");
    const formData = new FormData();
    formData.append("detailIntro", text);

    formData.append("memberId", user.id.toString());
    formData.append("oneIntro", text);
    formData.append("teamName", name);
    formData.append("tacticalStyleStatus", tactic.value);

    if (file) {
      formData.append("image", file, `${file.name}`); // Blob 객체를 FormData에 추가
      formData.append("name", name);
    }

    try {
      if (isGetTeamLoading) return alert("팀 생성 중입니다");
      mutate(formData);
      alert("팀 생성이 완료되었습니다");
      // navi("/");
    } catch (err) {
      console.log(err);
    }
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/png") {
      alert("이미지는 png 파일만 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        const img = new Image();
        img.onload = () => {
          // 이미지 용량 체크를 여기서 수행합니다.
          if (file.size <= 1024 * 1024) {
            console.log("이미지 용량이 올바릅니다.");
            setFile(file);
          } else {
            alert("이미지 용량이 너무 큽니다.");
          }
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteImage = () => {
    setFile(null);
  };

  useEffect(() => {
    let newErr = { ...err };

    if (!name.length) newErr = { ...newErr, name: "이름 입력" };
    else newErr = { ...newErr, name: "" };

    if (!text.length) newErr = { ...newErr, text: "한줄 소개 입력" };
    else newErr = { ...newErr, text: "" };

    if (!detail.length) newErr = { ...newErr, detail: "상세 소개 입력" };
    else newErr = { ...newErr, detail: "" };

    if (profileInfo.address.length === 0) newErr = { ...newErr, address: "주소 입력" };
    else newErr = { ...newErr, address: "" };

    if (!tactic.value) newErr = { ...newErr, tactic: "전략 입력" };
    else newErr = { ...newErr, tactic: "" };

    setErr(newErr);
  }, [name, text, detail, profileInfo, tactic]);

  useEffect(() => {
    if (err.name === "" && err.text === "" && err.detail === "" && err.address === "") {
      setFlag(false);
    } else {
      setFlag(true);
    }
  }, [err]);

  console.log(profileInfo.address.length, err, flag);
  return (
    <div className="main-wrap">
      {flag}
      <div className="join-wrapper">
        <div className="join">
          <div className="go-back">
            <button onClick={() => navi(-1)}>
              <img src={`${img}/common/ChevronLeftOutline.png`} alt="뒤로가기" />
            </button>
          </div>

          <form action="" className="join-form create-team">
            <h3>팀 생성</h3>
            <p>여러분만의 멋진 팀을 만들어 보세요</p>
            <Input
              label="팀 이름*"
              maxLength={20}
              bottomLine
              value={name}
              setValue={setName}
            >
              {name.length <= 20 ? name.length : 20}/20자까지 입력 가능
            </Input>
            <Input
              label="한줄 소개*"
              maxLength={30}
              bottomLine
              value={text}
              setValue={setText}
            >
              {name.length <= 30 ? name.length : 30}/20자까지 입력 가능
            </Input>
            <div className="textarea-container">
              <div className="wrapper">
                <div className="label-container">상세 소개*</div>
                <div className="input-wrapper">
                  <textarea
                    maxLength={500}
                    rows={5}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                </div>
              </div>
              <div className="word-limit">
                {detail.length <= 500 ? detail.length : 500}/500자까지 입력 가능
              </div>
            </div>
            <div className="edit-content-wrapper">
              <div className="label">활동 지역*</div>
              <div className="content">
                <LocalSelector
                  isCreateTeam
                  profileInfo={profileInfo}
                  setProfileInfo={setProfileInfo}
                />
              </div>
            </div>
            <Select
              label="선호전술*"
              placeholder="선호전술"
              defaultValue="POSSESSION"
              options={[
                { label: "점유율", value: "POSSESSION" },
                { label: "게겐프레싱", value: "GEGENPRESSING" },
                { label: "티키타카", value: "TIKI_TAKA" },
                { label: "선수비 후 역습", value: "COUNTER_ATTACK" },
              ]}
              onChange={(e) => setTactic(e)}
            />

            <div className="file-button">
              <label htmlFor="input-file">
                <div className="btnStart">로고</div>
                <p>
                  {file?.name ? file.name : "10MB 이내 png 이미지"}{" "}
                  {file?.name ? (
                    <button onClick={deleteImage}>삭제</button>
                  ) : (
                    <span>파일 찾기</span>
                  )}
                </p>
              </label>
              <input
                type="file"
                id="input-file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="button-wrap">
              <Button text="완료" color="blue" handler={handler} disabled={flag} />
            </div>
          </form>
        </div>
      </div>
      {/* <h1>계정</h1>
      <div className="btns">
        <Button text="로그아웃" color="white" handler={test} />
        <Button text="팀 생성" color="blue" handler={() => setCreate(true)} />
      </div> */}
    </div>
  );
};
export default CreateTeam;
