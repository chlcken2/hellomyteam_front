import { useEffect, useRef, useState } from "react";
import CommentTextarea from "./CommentTextarea";

interface PropsType {
  handleRegistReply: (replyText: string) => void;
  setReplyCommentId: React.Dispatch<React.SetStateAction<number>>;
}

const ReplyInput = ({ handleRegistReply, setReplyCommentId }: PropsType) => {
  const [replyText, setReplyText] = useState("");

  return (
    <div className="reply-regist-form">
      <div className="reply-regist-textarea-wrapper">
        <span />
        <CommentTextarea value={replyText} setValue={setReplyText} isFocus />
      </div>
      <div className="comment-button-box">
        <button
          type="button"
          onClick={() => {
            setReplyText("");
            setReplyCommentId(null);
          }}
          className="cancel-button"
        >
          취소
        </button>
        <button
          onClick={() => handleRegistReply(replyText)}
          type="submit"
          className="regist-button"
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default ReplyInput;
