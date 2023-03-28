import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "components/common/button";
import Comment from "components/common/comment";
import getBoardDetail from "quires/board/getBoardDetail";
import Input from "components/Input/Input";
import useGetCommentsQuery from "quires/comment/useCommentQuery";
import {
  useDeleteCommentMutation,
  useRegistCommentMutation,
} from "quires/comment/useCommentMutation";

const Detail: FC = () => {
  const param = useParams();
  const commentRegistFormRef = useRef<HTMLFormElement>(null);
  const img = process.env.PUBLIC_URL;
  const { data: detail } = getBoardDetail(Number(param.id));
  const [info, setInfo] = useState({
    name: "test",
    title: "test",
    contents: "test",
  });
  const [commentText, setCommentText] = useState("");
  const [replyCommentId, setReplyCommentId] = useState<null | number>(null);
  const [replyText, setReplyText] = useState("");

  // comment 가져오는 query 작성
  const { data: commentData } = useGetCommentsQuery(Number(param.id));
  const commentCount = useMemo(() => {
    let count = 0;
    if (commentData?.data) {
      for (let i = 0; i < commentData?.data.length; i++) {
        count++;
        for (let j = 0; j < commentData?.data[i].children.length; j++) {
          count++;
        }
      }
    }
    return count;
  }, [commentData]);

  const {
    data: registCommentData,
    mutate: registComment,
    isLoading: isRegistCommentLoading,
    error: registCommentError,
  } = useRegistCommentMutation(Number(param.id));

  const {
    data: registReplyData,
    mutate: registReply,
    isLoading: isRegistReplyLoading,
    error: registReplyError,
  } = useRegistCommentMutation(Number(param.id));

  const {
    mutate: deleteCommentData,
    isLoading: isDeleteCommentLoading,
    error: deleteCommentError,
  } = useDeleteCommentMutation(Number(param.id));

  const handleRegistComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegistCommentLoading) return alert("댓글 등록 중입니다.");
    registComment({ content: commentText, teamMemberInfoId: 148 });
  };

  const handleRegistReply = () => {
    if (isRegistReplyLoading) return alert("답글 등록 중입니다.");
    registReply({
      content: replyText,
      teamMemberInfoId: 148,
      parentId: replyCommentId,
    });
  };
  const handleDeleteComment = (commentId: number) => {
    if (isDeleteCommentLoading) return alert("댓글 삭제 중입니다.");
    deleteCommentData(commentId);
  };

  // 디테일
  useEffect(() => {
    if (detail) {
      console.log(detail.data);
      setInfo({
        name: detail.data.writer,
        title: detail.data.title,
        contents: detail.data.contents,
      });
    }
  }, [detail]);

  useEffect(() => {
    if (registCommentData && registCommentData.data?.status === "success") {
      setCommentText("");
      commentRegistFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [registCommentData]);

  useEffect(() => {
    if (registReplyData && registReplyData.data?.status === "success") {
      setReplyCommentId(null);
      setReplyText("");
    }
  }, [registReplyData]);

  console.log(commentData?.data);

  return (
    <>
      <div className="board">
        <Link to="/board" className="back-button">
          <img src={`${img}/common/ChevronLeftOutline.png`} alt="" />
        </Link>
        <div className="board-content">
          <h2>{info.title}</h2>
          <div className="user">
            <span>
              <img src={`${img}/common/join-1.png`} alt="" />
            </span>
            <div>
              <h3>{info.name}</h3>
              <p>1시간 전</p>
            </div>
          </div>
          <div className="board-detail">
            <p dangerouslySetInnerHTML={{ __html: info.contents }} />
            <Button text="좋아요" handler={() => console.log("test")} />
          </div>
        </div>
      </div>
      <div className="comment-container">
        <div className="title">
          댓글 <span>{commentCount}개</span>
        </div>
        <ul>
          {commentData?.data?.map((comment) => (
            <li key={comment.commentId}>
              <Comment
                onClickWriteReplyButton={() => {
                  setReplyText("");
                  setReplyCommentId(comment.commentId);
                }}
                boardId={Number(param.id)}
                myComment={comment.teamMemberInfoId === 148}
                comment={comment}
                deleteHandler={() => handleDeleteComment(comment.commentId)}
              />
              {replyCommentId && replyCommentId === comment.commentId && (
                <div className="reply-regist-form">
                  <div className="reply-regist-input-wrapper">
                    <span />
                    <Input value={replyText} setValue={setReplyText} />
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
                      onClick={handleRegistReply}
                      type="submit"
                      className="regist-button"
                    >
                      등록
                    </button>
                  </div>
                </div>
              )}
              {comment.children.length > 0 && (
                <ul className="reply-list">
                  {comment.children.map((reply) => (
                    <li key={reply.commentId}>
                      <Comment
                        boardId={Number(param.id)}
                        myComment={comment.teamMemberInfoId === 148}
                        isReply
                        comment={reply}
                        deleteHandler={() => handleDeleteComment(comment.commentId)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <form
          ref={commentRegistFormRef}
          className="comment-regist-form"
          onSubmit={(e) => handleRegistComment(e)}
        >
          <span>
            <img src="/common/join-1.png" alt="유저 프로필 이미지" />
          </span>
          <Input value={commentText} setValue={setCommentText} />
        </form>
      </div>
    </>
  );
};

export default Detail;
