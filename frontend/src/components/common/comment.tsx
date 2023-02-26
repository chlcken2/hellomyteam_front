import { memo, useState } from "react";
import "../../styles/components/common.scss";

type ButtonEventTypes = React.MouseEvent<HTMLButtonElement>;

interface PropsTyeps {
  myComment: boolean;
  text: string;
  writer: string;
  editHandler?: (e?: ButtonEventTypes) => void;
  editCompleteHanler?: (e?: ButtonEventTypes) => void;
  deleteHandler?: (e?: ButtonEventTypes) => void;
}

const Comment = ({
  myComment,
  text,
  writer,
  editHandler,
  editCompleteHanler,
  deleteHandler,
}: PropsTyeps) => {
  const background = myComment ? "my" : "other";
  // 0: kebab menu, 1: edit menu, 2: complete menu
  const [editTrriger, setEditTrriger] = useState<0 | 1 | 2>(2);

  const editBox = () => {
    return (
      <div className="comment-edit-box">
        <button
          className="comment-edit"
          onClick={() => {
            setEditTrriger(2);
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

  const kebabMenu = () => {
    return (
      <button className="comment-kebab-menu" onClick={() => setEditTrriger(1)}>
        <ul>
          <li />
          <li />
          <li />
        </ul>
      </button>
    );
  };

  const completeBox = () => {
    return (
      <button className="comment-complete-box" onClick={() => setEditTrriger(0)}>
        완료
      </button>
    );
  };

  const CommentEditBox = () => {
    if (editTrriger === 0) {
      return kebabMenu();
    }

    return editTrriger === 1 ? editBox() : completeBox();
  };

  return (
    <div className="edit-comment-wrap">
      <div className="comment-avatar" />
      <div className="comment-main-box">
        <div className="comment-writer">{writer}</div>
        <div className="comment-box">
          <div className="comment">{text}</div>
          {myComment && CommentEditBox()}
        </div>
      </div>
    </div>
  );
};

export default memo(Comment);
