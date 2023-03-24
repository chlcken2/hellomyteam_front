import React, { FC, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import getTeamInfo from "quires/team/getTeamInfo";
import Button from "components/common/button";
import Select from "components/common/Select";
import Input from "components/Input/Input";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftjsToHtml from "draftjs-to-html";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";
import { teamMemberId } from "quires/team/getTeamId";
import { instance } from "config";
import { setBoardWriteMutation } from "quires/board/setBoardQuery";

const Write: FC = () => {
  interface teamType {
    teamName: string;
    teamId: number;
  }
  const { mutate, isLoading: load, isError: error } = setBoardWriteMutation();
  const { teamId } = useParams();
  const user = useRecoilValue(UserState);
  const [title, setTitle] = useState("");
  const [boardName, setBoardName] = useState(null);
  const img = process.env.PUBLIC_URL;
  const option = [
    { label: "자유게시판", value: "FREE_BOARD" },
    { label: "공지게시판", value: "NOTICE_BOARD" },
  ];
  const [boardNum, setBoardNum] = useState(0);
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
    const memberId = user.id;

    user.teamInfo.forEach((el) => {
      // teamId
      if (el.teamId === Number(teamId)) {
        teamMemberId(Number(teamId), memberId).then((res) => {
          setBoardNum(res.data.data);
        });
        return false;
      }
    });
  };

  useEffect(() => {
    if (boardNum !== 0) {
      mutate({
        boardCategory: boardName.value,
        boardStatus: "NORMAL",
        contents: htmlString,
        teamMemberInfoId: boardNum,
        title,
      });
    }
  }, [boardNum]);

  return (
    <div className="board write">
      <Link to="/board" className="button">
        <img src={`${img}/common/ChevronLeftOutline.png`} alt="" />
      </Link>
      <div className="content">
        <h2>게시글 작성</h2>
        <div className="input-wrap">
          <Select
            placeholder="자유게시판"
            options={option}
            onChange={(e) => setBoardName(e)}
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
