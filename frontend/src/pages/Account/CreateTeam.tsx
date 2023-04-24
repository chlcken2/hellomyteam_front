import React, { FC, useEffect, useState } from "react";
import FormWrap from "components/Form/FormWrap";
import Input from "components/common/Input";
import Select from "components/common/Select";
import Button from "components/common/Button";
import { useRecoilValue } from "recoil";
import { instance } from "../../config/api";
import UserState from "../../recoil/userAtom";

const CreateTeam: FC = () => {
  const [create, setCreate] = useState(false);
  const img = process.env.PUBLIC_URL;
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [tactic, setTactic] = useState(null);
  const user = useRecoilValue(UserState);
  const test = (e: any) => console.log(e);
  const handler = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const save = await instance.post("/api/team", {
        detailIntro: text,
        memberId: user.id,
        oneIntro: text,
        tacticalStyleStatus: "POSSESSION",
        teamName: name,
      });

      console.log(save);
    } catch (err) {
      console.log(err);
    }
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
                    onChange={(e) => setFile(e.target.files[0].name)}
                  />
                </div>
                <Select
                  label="선호전술*"
                  placeholder="선호전술"
                  options={[
                    { label: "선호전술", value: "선호전술" },
                    { label: "공격수", value: "공격수" },
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
