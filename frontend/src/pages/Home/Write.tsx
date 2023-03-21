import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import Button from "components/common/button";
import Select from "components/common/Select";
import Input from "components/Input/Input";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftjsToHtml from "draftjs-to-html";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";
import { instance } from "config/api";

const Write: FC = () => {
  interface teamType {
    teamName: string;
    teamId: number;
  }

  const useUser = useRecoilValue(UserState);
  const [title, setTitle] = useState("");
  const img = process.env.PUBLIC_URL;
  const option = [
    { label: "공지게시판", value: "공지게시판" },
    { label: "자유게시판", value: "자유게시판" },
  ];

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlString, setHtmlString] = useState("");

  const updateTextDescription = async (state: any) => {
    await setEditorState(state);
    const html = draftjsToHtml(convertToRaw(editorState.getCurrentContent()));
    setHtmlString(html);
  };

  const uploadCallback = () => {
    console.log("이미지 업로드");
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    const memberId = useUser.id;
    const teamId: teamType[] = [];

    // 로그인 후 가입한 팀 id와 팀 이름 가져오기
    await instance
      .get(`/api/user/teams/${memberId}`)
      .then((res) => {
        res.data.data.forEach((el: teamType) => {
          teamId.push(el);
        });
      })
      .catch((err) => console.log(err));

    console.log(teamId);
  };

  return (
    <div className="board write">
      <Link to="/board" className="button">
        <img src={`${img}/common/ChevronLeftOutline.png`} alt="" />
      </Link>
      <div className="content">
        <h2>게시글 작성</h2>
        <div className="input-wrap">
          <Select
            placeholder="공지게시판"
            options={option}
            onChange={() => console.log("hi")}
          />
          <Input value={title} setValue={setTitle} />
        </div>
        <Editor
          placeholder="게시글을 작성해주세요"
          editorState={editorState}
          onEditorStateChange={updateTextDescription}
          toolbar={{
            image: { uploadCallback },
          }}
          localization={{ locale: "ko" }}
          editorStyle={{
            height: "400px",
            width: "100%",
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "20px",
          }}
        />
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        <hr />
        <Button color="blue" text="제출" handler={handleSubmit} />
      </div>
    </div>
  );
};

export default Write;
