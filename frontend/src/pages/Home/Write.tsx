import React, { FC, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import getTeamInfo from "quires/team/getTeamInfo";
import Button from "components/common/Button";
import Select from "components/common/Select";
import Input from "components/common/Input";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, AtomicBlockUtils, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftjsToHtml from "draftjs-to-html";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";
import teamMemberId from "quires/team/getTeamMemberId";
import { setBoardWriteMutation, useEditBoardMutation } from "quires/board/setBoardQuery";

const Write: FC = () => {
  // 글수정시에만 작동함
  const a = useLocation();
  const queryString = a?.search;
  const searchParams = new URLSearchParams(queryString);
  const titleParam = searchParams?.get("param1"); // 'hello'
  const contentsParam = searchParams?.get("param2"); // 'hi'
  const text = contentsParam?.replace(/<[^>]+>/g, "");

  const path = a.pathname;
  const numbers = path.match(/\d+/g);
  const {
    mutate: editMutate,
    isLoading: editLoad,
    data: editData,
  } = useEditBoardMutation(Number(numbers));

  // --글수정시에만 작동함
  const { teamId } = useParams();

  const initialContentState = ContentState.createFromText(text || "");
  const initialEditorState = EditorState.createWithContent(initialContentState);

  const [editorState, setEditorState] = useState(initialEditorState);

  const navi = useNavigate();
  const {
    mutate,
    isLoading: load,
    isError: error,
    data: writeData,
  } = setBoardWriteMutation();

  const user = useRecoilValue(UserState);
  const [title, setTitle] = useState(titleParam || "");
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

    // 작업예정-이미지API있어야 작업가능
    // axios
    //   .post(`/api/teams/${setTeamId}/board/${setBoardId}/image`)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
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

  const updateTextDescription = async (state: any) => {
    setEditorState(state);
    const html = draftjsToHtml(convertToRaw(editorState.getCurrentContent()));

    setHtmlString(html);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (queryString) {
      editMutate({
        teamId: JSON.parse(localStorage.getItem("selectedTeamId")),
        boardId: Number(numbers),
        category: boardName.value,
        content: htmlString,
        title,
      });
      alert("글 수정에 성공했습니다");
      navi("/board");
      return;
    }
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
      mutate({
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
      console.log(writeData);
      // const { id } = writeData.data;
      alert("글 저장에 성공했습니다");
      navi(`/board`);
    }
  }, [writeData]);

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
          // toolbar={{
          //   image: {
          //     uploadCallback: handleImageUpload,
          //     alt: { present: true, mandatory: true },
          //   },
          // }}
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
