import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import {
  Link,
  useParams,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Button from "components/common/button";
import Comment from "components/common/Comment";
import getBoardDetail from "quires/board/getBoardDetail";
import Input from "components/common/Input";
import useGetCommentsQuery from "quires/comment/useCommentQuery";
import { useRegistCommentMutation } from "quires/comment/useCommentMutation";
import UserState from "recoil/userAtom";
import { useRecoilValue } from "recoil";
import { teamMemberId } from "quires/team/getTeamMemberId";
import { setBoardLikeMutation } from "quires/board/setBoardLikes";

// 댓글 테스트를 위한 teamMemberInfoId, 로그인한 계정의 teamMemberrInfoId입력
const TEMP_TEAM_MEMBER_INFO_ID = 148;

const Detail: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const likeCount = searchParams.get("likeCount");
  const navi = useNavigate();
  const param = useParams();
  const img = process.env.PUBLIC_URL;
  const user = useRecoilValue(UserState);
  const [infoId, setInfoId] = useState(0);
  const [likeBoolean, setLikeBoolean] = useState(false);
  /* Board Part Start */

  const { data: detail } = getBoardDetail(
    JSON.parse(localStorage.getItem("selectedTeamId")) || user.selectedTeamId,
    Number(param.id),
  );
  const {
    mutate: likeMutate,
    isLoading: load,
    isError: error,
    data: LikeData,
  } = setBoardLikeMutation(Number(param.id));

  const [info, setInfo] = useState({
    name: "test",
    title: "test",
    contents: "test",
  });

  const handleLikes = async () => {
    await teamMemberId(
      JSON.parse(localStorage.getItem("selectedTeamId")) || user.selectedTeamId,
      Number(JSON.stringify(localStorage.getItem("userId"))) || user.id,
    ).then((res) => {
      likeMutate({
        boardId: Number(param.id),
        teamMemberInfoId: res.data.data,
        teamId: JSON.parse(localStorage.getItem("selectedTeamId")) || user.selectedTeamId,
      });
    });
  };

  useEffect(() => {
    teamMemberId(
      JSON.parse(localStorage.getItem("selectedTeamId")) || user.selectedTeamId,
      Number(JSON.parse(localStorage.getItem("userId"))) || user.id,
    ).then((res) => {
      setInfoId(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (likeBoolean)
      likeMutate({
        boardId: Number(param.id),
        teamMemberInfoId: infoId,
        teamId: JSON.parse(localStorage.getItem("selectedTeamId")) || user.selectedTeamId,
      });
  }, [infoId, likeBoolean]);

  useEffect(() => {
    if (detail) {
      setInfo({
        name: detail.data.writer,
        title: detail.data.title,
        contents: detail.data.contents,
      });
    }
  }, [detail]);
  /* Board Part End */

  /* Comment part Start */

  const commentRegistFormRef = useRef<HTMLFormElement>(null);

  const [commentText, setCommentText] = useState("");
  const [replyCommentId, setReplyCommentId] = useState<null | number>(null);
  const [replyText, setReplyText] = useState("");

  const { data: commentData } = useGetCommentsQuery(Number(param.id));

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

  const handleRegistComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegistCommentLoading) return alert("댓글 등록 중입니다.");
    registComment({ content: commentText, teamMemberInfoId: TEMP_TEAM_MEMBER_INFO_ID });
  };

  const handleRegistReply = () => {
    if (isRegistReplyLoading) return alert("답글 등록 중입니다.");
    registReply({
      content: replyText,
      teamMemberInfoId: TEMP_TEAM_MEMBER_INFO_ID,
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
      setReplyText("");
    }
  }, [registReplyData]);

  /* Comment Part End */

  return (
    <>
      {/* Boad Part Start */}
      {!load && detail && (
        <div className="board">
          <button onClick={() => navi(-1)} className="back-button">
            <img src={`${img}/common/ChevronLeftOutline.png`} alt="" />
          </button>
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
              <Button
                text={`좋아요 ${likeCount}개`}
                handler={handleLikes}
                color="white"
              />
            </div>
          </div>
        </div>
      )}
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
                  setReplyText("");
                  setReplyCommentId(comment.commentId);
                }}
                boardId={Number(param.id)}
                myComment={comment.teamMemberInfoId === TEMP_TEAM_MEMBER_INFO_ID}
                comment={comment}
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
                        isPostWriter={detail?.data.writer === reply.writer}
                        boardId={Number(param.id)}
                        myComment={reply.teamMemberInfoId === TEMP_TEAM_MEMBER_INFO_ID}
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
      {/* Comment Part End */}
    </>
  );
};

export default Detail;
