import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "components/common/button";
import Comment from "components/Comment/Comment";
import getBoardDetail from "quires/board/getBoardDetail";
import Input from "components/Input/Input";
import useGetCommentsQuery from "quires/comment/useCommentQuery";
import { useRegistCommentMutation } from "quires/comment/useCommentMutation";
import { useRecoilState } from "recoil";
import UserState from "recoil/userAtom";
import ReplyInput from "components/Comment/ReplyInput";
import CommentTextarea from "components/Comment/CommentTextarea";

const Detail: FC = () => {
  const param = useParams();
  const img = process.env.PUBLIC_URL;

  /* Board Part Start */

  const { data: detail } = getBoardDetail(Number(param.id));
  const [info, setInfo] = useState({
    name: "test",
    title: "test",
    contents: "test",
  });

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

  /* Board Part End */

  /* Comment part Start */

  const commentRegistFormRef = useRef<HTMLDivElement>(null);

  const [user] = useRecoilState(UserState);
  const [commentText, setCommentText] = useState("");
  const [replyCommentId, setReplyCommentId] = useState<null | number>(null);

  const { data: commentData } = useGetCommentsQuery(Number(param.id), 0, 30);

  const commentCount = useMemo(() => {
    let count = 0;
    if (commentData?.data) {
      for (let i = 0; i < commentData.data.length; i++) {
        if (commentData.data[i].commentStatus === "NORMAL") count++;
        for (let j = 0; j < commentData.data[i].children.length; j++) {
          if (commentData.data[i].children[j].commentStatus === "NORMAL") count++;
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

  const handleRegistComment = () => {
    if (isRegistCommentLoading) return alert("댓글 등록 중입니다.");
    if (!user.teamMemberInfoId) return alert("팀을 선택해주세요.");
    if (commentText.length === 0) return alert("내용을 입력해주세요.");
    registComment({ content: commentText, teamMemberInfoId: user.teamMemberInfoId });
  };

  const handleRegistReply = (replyText: string) => {
    if (isRegistReplyLoading) return alert("답글 등록 중입니다.");
    if (!user.teamMemberInfoId) return alert("팀을 선택해주세요.");
    if (replyText.length === 0) return alert("내용을 입력해주세요.");

    registReply({
      content: replyText,
      teamMemberInfoId: user.teamMemberInfoId,
      parentId: replyCommentId,
    });
  };

  useEffect(() => {
    if (registCommentData && registCommentData.data?.status === "success") {
      setCommentText("");
      commentRegistFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [registCommentData]);

  useEffect(() => {
    if (registReplyData && registReplyData.data?.status === "success") {
      setReplyCommentId(null);
    }
  }, [registReplyData]);

  /* Comment Part End */

  return (
    <>
      {/* Boad Part Start */}
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
      {/* Boad Part End */}

      {/* Comment Part Start */}
      <div className="comment-container">
        <div className="title">
          댓글 <span>{commentCount}개</span>
        </div>
        <ul>
          {commentData?.data?.map((comment) => (
            <li key={comment.commentId}>
              <Comment
                isPostWriter={detail?.data.writer === comment.writer}
                onClickWriteReplyButton={() => {
                  setReplyCommentId(comment.commentId);
                }}
                boardId={Number(param.id)}
                myComment={
                  user?.teamMemberInfoId &&
                  comment.teamMemberInfoId === user.teamMemberInfoId
                }
                comment={comment}
              />
              {replyCommentId && replyCommentId === comment.commentId && (
                <ReplyInput
                  handleRegistReply={handleRegistReply}
                  setReplyCommentId={setReplyCommentId}
                />
              )}
              {comment.children.length > 0 && (
                <ul className="reply-list">
                  {comment.children.map((reply) => (
                    <li key={reply.commentId}>
                      <Comment
                        isPostWriter={detail?.data.writer === reply.writer}
                        boardId={Number(param.id)}
                        myComment={
                          user?.teamMemberInfoId &&
                          reply.teamMemberInfoId === user.teamMemberInfoId
                        }
                        isReply
                        comment={reply}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div ref={commentRegistFormRef} className="comment-regist-form">
          <span>
            <img src="/common/logo.png" alt="logo" />
          </span>
          <div className="comment-content">
            <CommentTextarea value={commentText} setValue={setCommentText} isComment />
            <div className="comment-button-box">
              <button onClick={() => setCommentText("")} className="cancel-button">
                취소
              </button>
              <button onClick={handleRegistComment} className="regist-button">
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Comment Part End */}
    </>
  );
};

export default Detail;
