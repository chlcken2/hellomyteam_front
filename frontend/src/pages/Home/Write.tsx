import React, { FC, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import getTeamInfo from "quires/team/getTeamInfo";
import Button from "components/common/Button";
import Select from "components/common/Select";
import Input from "components/common/Input";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, AtomicBlockUtils } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftjsToHtml from "draftjs-to-html";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";
import teamMemberId from "quires/team/getTeamMemberId";
import { setBoardWriteMutation } from "quires/board/setBoardQuery";

import axios from "axios";

const Write: FC = () => {
  const { teamId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [setTeamId] = useState(() => localStorage.getItem("selectedTeamId"));
  const [setBoardId] = useState(teamId);
  const { data: getTeamId, isLoading: teamIdLoading } = teamMemberId(
    Number(JSON.parse(localStorage.getItem("selectedTeamId"))),
    Number(JSON.parse(localStorage.getItem("userId"))),
  );

  const handleImageUpload = async (file: File) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", {
      src: file.name,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));

    const formData = new FormData();
    formData.append("image", file);

    axios
      .post(`/api/teams/${setTeamId}/board/${setBoardId}/image`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    // fetch("https://your-image-upload-api-url", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const { imageUrl } = data;

    //   })
    //   .catch((error) => {
    //     console.error("Error uploading image: ", error);
    //   });
  };
  console.log(editorState);

  const navi = useNavigate();
  const {
    mutate,
    isLoading: load,
    isError: error,
    data: writeData,
  } = setBoardWriteMutation();

  const user = useRecoilValue(UserState);
  const [title, setTitle] = useState("");
  const [boardName, setBoardName] = useState({
    label: "자유게시판",
    value: "FREE_BOARD",
  });
  const img = process.env.PUBLIC_URL;
  const option = [
    { label: "자유게시판", value: "FREE_BOARD" },
    { label: "공지게시판", value: "NOTICE_BOARD" },
  ];
  const [boardNum, setBoardNum] = useState(0);
  const [htmlString, setHtmlString] = useState("");
  const { data: teamInfoId, isLoading: isGetTeamInfoLoading } = teamMemberId(
    Number(JSON.parse(localStorage.getItem("selectedTeamId"))),
    Number(JSON.parse(localStorage.getItem("userId"))),
  );

  const updateTextDescription = async (state: any) => {
    setEditorState(state);
    const html = draftjsToHtml(convertToRaw(editorState.getCurrentContent()));

    setHtmlString(html);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const memberId = user.id;

    user.teamInfo.forEach((el) => {
      // teamId
      if (el.teamId === Number(teamId) && teamInfoId.data) {
        setBoardNum(teamInfoId.data);
        return false;
      }
    });
  };

  useEffect(() => {
    if (boardNum !== 0) {
      console.log(error);

      mutate({
        // TODO: 옵셔널 체이닝 이유 찾기
        boardCategory: boardName ? boardName.value : "FREE_BOARD",
        boardStatus: "NORMAL",
        contents: htmlString,
        teamMemberInfoId: boardNum,
        title,
        teamId: user.selectedTeamId,
      });
    }
  }, [boardNum]);

  useEffect(() => {
    if (writeData) {
      // const { id } = writeData.data;
      alert("글 저장에 성공했습니다");
      navi(`/board`);
    }
  }, [writeData, htmlString]);

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
            defaultValue="FREE_BOARD"
            onChange={(e) => setBoardName(e)}
          />
          <Input value={title} setValue={setTitle} />
        </div>
        <Editor
          placeholder="게시글을 작성해주세요"
          editorState={editorState}
          onEditorStateChange={updateTextDescription}
          toolbar={{
            image: {
              uploadCallback: handleImageUpload,
              alt: { present: true, mandatory: true },
            },
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
        <div className="visual-area" dangerouslySetInnerHTML={{ __html: htmlString }} />
        <hr />
        <div className="button-area">
          <Button color="blue" text="제출" handler={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Write;
