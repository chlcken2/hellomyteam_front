import {
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "quires/comment/useCommentMutation";
import { memo, useState, useRef, useEffect } from "react";
import { CommentType } from "types/commentType";
import { formatDate } from "utils/common";
import "../../styles/components/common.scss";
import CommentTextarea from "./CommentTextarea";

interface PropsTyeps {
  isPostWriter: boolean;
  boardId: number;
  comment: CommentType;
  myComment: boolean;
  isReply?: boolean;
  imgUrl: string | null;
  onClickWriteReplyButton?: () => void;
}

const Comment = ({
  isPostWriter,
  boardId,
  myComment,
  isReply,
  comment,
  imgUrl,
  onClickWriteReplyButton,
}: PropsTyeps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const isDeleted = comment.commentStatus === "DELETE_USER";

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editText, setEditText] = useState("");

  const {
    data: editCommentData,
    mutate: editComment,
    isLoading: isEditCommentLoading,
    error: editCommentError,
  } = useEditCommentMutation(Number(boardId));

  const {
    mutate: deleteCommentData,
    isLoading: isDeleteCommentLoading,
    error: deleteCommentError,
  } = useDeleteCommentMutation(Number(boardId));

  const handleEditComment = () => {
    if (isEditCommentLoading) return alert("댓글 수정 중입니다.");
    editComment({
      commentId: comment.commentId,
      content: editText,
      teamMemberInfoId: comment.teamMemberInfoId,
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (isDeleteCommentLoading) return alert("댓글 삭제 중입니다.");

    const message = `${isReply ? "답글" : "댓글"}을 삭제하시겠습니까?`;
    const result = window.confirm(message);

    if (result) deleteCommentData(commentId);

    setIsOpenMenu(false);
  };

  const kebabMenu = () => {
    return (
      <button
        className="comment-kebab-menu"
        onClick={() => setIsOpenMenu((prev) => !prev)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.8337 9.99984L15.8253 9.99984M10.0003 9.99984L9.99199 9.99984M4.16699 9.99984L4.15866 9.99984M15.0003 9.99984C15.0003 9.77882 15.0881 9.56686 15.2444 9.41058C15.4007 9.2543 15.6126 9.1665 15.8337 9.1665C16.0547 9.1665 16.2666 9.2543 16.4229 9.41058C16.5792 9.56686 16.667 9.77882 16.667 9.99984C16.667 10.2209 16.5792 10.4328 16.4229 10.5891C16.2666 10.7454 16.0547 10.8332 15.8337 10.8332C15.6126 10.8332 15.4007 10.7454 15.2444 10.5891C15.0881 10.4328 15.0003 10.2209 15.0003 9.99984ZM9.16699 9.99984C9.16699 9.77882 9.25479 9.56686 9.41107 9.41058C9.56735 9.2543 9.77931 9.1665 10.0003 9.1665C10.2213 9.1665 10.4333 9.2543 10.5896 9.41058C10.7459 9.56686 10.8337 9.77882 10.8337 9.99984C10.8337 10.2209 10.7459 10.4328 10.5896 10.5891C10.4333 10.7454 10.2213 10.8332 10.0003 10.8332C9.77931 10.8332 9.56735 10.7454 9.41107 10.5891C9.25479 10.4328 9.16699 10.2209 9.16699 9.99984ZM3.33366 9.99984C3.33366 9.77882 3.42146 9.56686 3.57774 9.41058C3.73402 9.2543 3.94598 9.1665 4.16699 9.1665C4.38801 9.1665 4.59997 9.2543 4.75625 9.41058C4.91253 9.56686 5.00033 9.77882 5.00033 9.99984C5.00033 10.2209 4.91253 10.4328 4.75625 10.5891C4.59997 10.7454 4.38801 10.8332 4.16699 10.8332C3.94598 10.8332 3.73402 10.7454 3.57774 10.5891C3.42146 10.4328 3.33366 10.2209 3.33366 9.99984Z"
            stroke="#7A7A7A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  const menuModal = () => {
    if (!isOpenMenu) return null;
    return (
      <div className="comment-edit-box">
        <button
          className="comment-edit"
          onClick={() => {
            setIsEdit(true);
            setIsOpenMenu(false);
            setEditText(comment.content);
          }}
        >
          수정
        </button>
        <div className="comment-edit-line" />
        <button
          className="comment-edit"
          onClick={() => {
            handleDeleteComment(comment.commentId);
          }}
        >
          삭제
        </button>
      </div>
    );
  };

  const handleMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpenMenu(false);
    }
  };

  useEffect(() => {
    if (editCommentData?.data.status === "success") {
      setIsEdit(false);
    }
  }, [editCommentData]);

  useEffect(() => {
    document.addEventListener("mousedown", handleMenu);
    return () => {
      document.removeEventListener("mousedown", handleMenu);
    };
  });

  return (
    <div className={`comment-wrap ${isReply && "isReply"}`}>
      <div className="comment-avatar">
        <img src={imgUrl || "/common/logo.png"} alt="logo" />
      </div>
      <div className="comment-main-box">
        <div className="comment-header">
          <div className="comment-writer">{comment.writer}</div>
          {myComment && <div className="comment-post-writer-mark">내댓글</div>}
          {isPostWriter && <div className="comment-post-writer-mark">작성자</div>}
          <div className="comment-date">{formatDate(comment.createdDate)}</div>
        </div>
        <div className="comment-box">
          {isEdit ? (
            <CommentTextarea value={editText} setValue={setEditText} />
          ) : (
            <p className={`${isDeleted && "isDelete"}`}>{comment.content}</p>
          )}
        </div>
        <div className="comment-footer">
          <div className="comment-button-box">
            <button className="comment-like">좋아요 {comment.likeCount}</button>
            {!isReply && !isDeleted && onClickWriteReplyButton && (
              <button onClick={onClickWriteReplyButton} className="comment-to-comment">
                답글쓰기
              </button>
            )}
          </div>

          {myComment &&
            !isDeleted &&
            (isEdit ? (
              <div className="comment-button-box">
                <button onClick={() => setIsEdit(false)} className="cancel-button">
                  취소
                </button>
                <button onClick={handleEditComment} className="regist-button">
                  수정
                </button>
              </div>
            ) : (
              <div ref={menuRef}>
                {kebabMenu()}
                {menuModal()}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Comment);
