import { memo, useState } from "react";
import "../../styles/components/common.scss";

type ButtonEventTypes = React.MouseEvent<HTMLButtonElement>;

interface TrrigerTypes {
  menu: 0 | 1 | 2;
  className: "my" | "edit";
  readOnlyAttr: boolean;
}

interface PropsTyeps {
  myComment: boolean;
  text: string;
  writer: string;
  date: string;
  editHandler?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editCompleteHanler?: (e?: ButtonEventTypes) => void;
  deleteHandler?: (e?: ButtonEventTypes) => void;
}

const Comment = ({
  myComment,
  text,
  writer,
  date,
  editHandler,
  editCompleteHanler,
  deleteHandler,
}: PropsTyeps) => {
  // 0: kebab menu, 1: edit menu, 2: complete menu
  const [editTrriger, setEditTrriger] = useState<TrrigerTypes>({
    menu: 0,
    className: "my",
    readOnlyAttr: true,
  });

  const kebabMenu = () => {
    return (
      <button
        className="comment-kebab-menu"
        onClick={() => setEditTrriger({ menu: 1, className: "my", readOnlyAttr: true })}
      >
        <ul>
          <li />
          <li />
          <li />
        </ul>
      </button>
    );
  };

  const editButton = () => {
    return (
      <div className="comment-edit-box">
        <button
          className="comment-edit"
          onClick={() => {
            setEditTrriger({ menu: 2, className: "edit", readOnlyAttr: false });
          }}
        >
          수정
        </button>
        <div className="comment-edit-line" />
        <button
          className="comment-edit"
          onClick={() => {
            deleteHandler();
          }}
        >
          삭제
        </button>
      </div>
    );
  };

  const completeButton = () => {
    const onClickEvent = () => {
      setEditTrriger({ menu: 0, className: "my", readOnlyAttr: true });
      editCompleteHanler();
    };
    return (
      <div className="comment-edit-box">
        <button
          className="comment-edit"
          onClick={() => {
            deleteHandler();
          }}
        >
          취소
        </button>
        <div className="comment-edit-line" />
        <button
          className="comment-edit"
          onClick={() => {
            onClickEvent();
          }}
        >
          완료
        </button>
      </div>
    );
  };

  const commentButtonHandler = () => {
    if (editTrriger.menu === 0) {
      return kebabMenu();
    }

    return editTrriger.menu === 1 ? editButton() : completeButton();
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      setEditTrriger({ menu: 0, className: "my", readOnlyAttr: true });
    }
  };

  return (
    <div className={`${editTrriger.className}-comment-wrap`}>
      <div className="comment-avatar" />
      <div className="comment-main-box">
        <div className="comment-header">
          <div className="comment-writer">{writer}</div>
          <div className="comment-date">{date}</div>
        </div>
        <div className="comment-box">
          <textarea onKeyDown={onEnterPress} value={text} onChange={editHandler} />
          {myComment && commentButtonHandler()}
        </div>
        <div className="comment-footer">
          <div className="comment-like">좋아요</div>
          <div className="comment-to-comment">댓글</div>
        </div>
      </div>
    </div>
  );
};

export default memo(Comment);
