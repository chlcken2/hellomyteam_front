import React, { FC, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "components/common/Button";
import getBoardDetail from "quires/board/getBoardDetail";
import Input from "components/common/Input";
import useGetCommentsQuery from "quires/comment/useCommentQuery";
import { useRegistCommentMutation } from "quires/comment/useCommentMutation";
import UserState from "recoil/userAtom";
import { useRecoilValue } from "recoil";
import teamMemberId from "quires/team/getTeamMemberId";
import { setBoardLikeMutation } from "quires/board/setBoardLikes";
import { boardDeleteMutation, useEditBoardMutation } from "quires/board/setBoardQuery";
import CommentTextarea from "components/Comment/CommentTextarea";
import ReplyInput from "components/Comment/ReplyInput";
import Comment from "components/Comment/Comment";
import { CommentType } from "types/commentType";

interface infoType {
  name: string;
  title: string;
  contents: string;
}

const Detail: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const likeCount = searchParams.get("likeCount");
  const [likeCounts, setLikeCounts] = useState(Number(likeCount));
  const navi = useNavigate();
  const param = useParams();
  const img = process.env.PUBLIC_URL;
  const user = useRecoilValue(UserState);
  const [infoId, setInfoId] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);

  /* Board Part Start */
  const { data: teamId, isLoading: teamIdLoading } = teamMemberId(
    Number(JSON.parse(localStorage.getItem("selectedTeamId"))),
    Number(JSON.parse(localStorage.getItem("userId"))),
  );

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

  const { mutate: deleteMutate, isLoading: deleteLoad } = boardDeleteMutation();

  const [info, setInfo] = useState<infoType>({
    name: "test",
    title: "test",
    contents: "test",
  });

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setOpenEdit(!openEdit);
    },
    [openEdit],
  );

  const handleModify = () => {
    navi(`/board/${Number(param.id)}/write?param1=${info.title}&param2=${info.contents}`);
  };
  const handleDelete = () => {
    if (deleteLoad) return alert("게시글 삭제 중입니다.");

    const message = `게시글을 삭제하시겠습니까?`;
    const result = window.confirm(message);

    if (result)
      deleteMutate({
        teamId: JSON.parse(localStorage.getItem("selectedTeamId")),
        boardId: Number(param.id),
      });
    alert("게시글이 삭제되었습니다");
    navi("/board");
  };

  const handleLikes = useCallback(() => {
    if (teamId.data) {
      likeMutate({
        boardId: Number(param.id),
        teamMemberInfoId: teamId.data,
        teamId: JSON.parse(localStorage.getItem("selectedTeamId")) || user.selectedTeamId,
      });
      // setLikeCounts(LikeData.data)
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId?.data) {
      setInfoId(teamId.data);
    }
  }, [teamId]);

  useEffect(() => {
    if (detail) {
      setInfo({
        name: detail.data.writer,
        title: detail.data.title,
        contents: detail.data.contents,
      });
    }
  }, [detail]);

  useEffect(() => {
    if (LikeData && LikeData.data === true) {
      setLikeCounts(likeCounts + 1);
    } else if (LikeData && LikeData.data === false) {
      setLikeCounts(likeCounts - 1);
    }
  }, [LikeData]);
  /* Board Part End */

  /* Comment part Start */

  const commentRegistFormRef = useRef<HTMLDivElement>(null);

  const [commentText, setCommentText] = useState("");
  const [replyCommentId, setReplyCommentId] = useState<null | number>(null);

  const { data: commentData } = useGetCommentsQuery(Number(param.id), 0, 30);

  const comments = useMemo(() => {
    let comments: CommentType[] = [];
    if (commentData && commentData.data?.content?.length > 0)
      comments = [...commentData.data.content];

    return comments;
  }, [commentData]);

  const commentCount = useMemo(() => {
    return commentData?.data?.totalElements || 0;
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

  console.log(comments, "comments");

  return (
    <>
      {/* Boad Part Start */}
      {detail && (
        <div className="board">
          <button onClick={() => navi(-1)} className="back-button">
            <img src={`${img}/common/ChevronLeftOutline.png`} alt="" />
          </button>
          <div className="board-content">
            <h2>{info.title}</h2>
            <div className="user-wrap">
              <div className="user">
                <span>
                  <img src={`${img}/common/join-1.png`} alt="" />
                </span>
                <div>
                  <h3>{info.name}</h3>
                  <p>1시간 전</p>
                </div>
              </div>
              <div className="sort-box">
                {user && info.name === user.name ? (
                  <button className="sort-type" onClick={handleEdit}>
                    <img src={`${img}/common/edit-button.png`} alt="편집하기" />
                  </button>
                ) : null}
                {openEdit && (
                  <div className="main-teams__wrap board-list">
                    <div className="main-teams">
                      <ul>
                        <li>
                          <button onClick={handleModify}>수정</button>
                        </li>
                        <li>
                          <button onClick={handleDelete}>삭제</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="board-detail">
              <p dangerouslySetInnerHTML={{ __html: info.contents }} />
              <Button
                text={`좋아요 ${likeCounts}개`}
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
          {comments?.map((comment) => (
            <li key={comment.commentId}>
              <Comment
                imgUrl={comment.imgUrl}
                isPostWriter={comment.author}
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
                        imgUrl={comment.imgUrl}
                        isPostWriter={reply.author}
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
