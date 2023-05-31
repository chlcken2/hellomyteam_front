import React, { FC, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "components/common/Button";
import getBoardDetail from "quires/board/getBoardDetail";
import Input from "components/common/Input";
import useGetCommentsQuery from "quires/comment/useCommentQuery";
import { useRegistCommentMutation } from "quires/comment/useCommentMutation";
import Comment from "components/common/Comment";
import UserState from "recoil/userAtom";
import { useRecoilValue } from "recoil";
import teamMemberId from "quires/team/getTeamMemberId";
import { setBoardLikeMutation } from "quires/board/setBoardLikes";
import { boardDeleteMutation, useEditBoardMutation } from "quires/board/setBoardQuery";

interface infoType {
  name: string;
  title: string;
  contents: string;
}
// 댓글 테스트를 위한 teamMemberInfoId, 로그인한 계정의 teamMemberrInfoId입력
const TEMP_TEAM_MEMBER_INFO_ID = 148;

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
