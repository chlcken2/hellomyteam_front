import React, { FC, useEffect, useState } from "react";
import FormWrap from "components/Form/FormWrap";
import Input from "components/common/Input";
import Select from "components/common/Select";
import Button from "components/common/button";
import { useRecoilValue } from "recoil";
import { instance } from "../../config/api";
import UserState from "../../recoil/userAtom";

const CreateTeam: FC = () => {
  const [create, setCreate] = useState(false);
  const img = process.env.PUBLIC_URL;
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [tactic, setTactic] = useState(null);
  const [file, setFile] = useState<any>(null);
  const user = useRecoilValue(UserState);
  const test = (e: any) => console.log(e);
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
      const fileData = new Blob([file], { type: "image/png" }); // Blob 객체 생성
      formData.append("image", fileData, "file.png"); // Blob 객체를 FormData에 추가
      formData.append("name", name);
    }

    try {
      const save = await instance.post("/api/team", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
            setFile(file.name);
          } else {
            alert("이미지 용량이 너무 큽니다.");
          }
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="main-wrap">
      {create && (
        <FormWrap>
          <div className="join-wrap2">
            <div className="go-back">
              <button onClick={() => setCreate(false)}>
                <img src={`${img}/common/ChevronLeftOutline.png`} alt="뒤로가기" />
              </button>
              <h3>팀 생성</h3>
              <p>여러분만의 멋진 팀을 만들어 보세요</p>
              <form action="" className="join-form">
                <Input label="팀 이름*" value={name} setValue={setName} />
                <Input label="한줄 소개*" value={text} setValue={setText} />
                <div className="file-button">
                  <label htmlFor="input-file">
                    <div className="btnStart">로고*</div>
                    <p>{file}</p>
                  </label>
                  <input
                    type="file"
                    id="input-file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <Select
                  label="선호전술*"
                  placeholder="선호전술"
                  options={[
                    { label: "점유율", value: "POSSESSION" },
                    { label: "게겐프레싱", value: "GEGENPRESSING" },
                    { label: "티키타카", value: "TIKI_TAKA" },
                    { label: "선수비 후 역습", value: "COUNTER_ATTACK" },
                  ]}
                  onChange={(e) => setTactic(e)}
                />

                <Button text="완료" handler={handler} disabled={disabled} />
              </form>
            </div>
          </div>
        </FormWrap>
      )}
      <h1>계정</h1>
      <div className="btns">
        <Button text="로그아웃" color="white" handler={test} />
        <Button text="팀 생성" color="blue" handler={() => setCreate(true)} />
      </div>
    </div>
  );
};
export default CreateTeam;
