import { instance } from "config";
import { useQuery } from "react-query";
import { getCommentListTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/board/:boardId/comment";

const fetcher = (boardId: number) =>
  instance
    .get<ApiResponseType<getCommentListTypes[]>>(
      `/api/board/${boardId}/comment
    `,
    )
    .then(({ data }) => data);

/**
 * 게시글에 대한 계층형 댓글 가져오기, 삭제된 게시글 상태변경, 값 변경 처리 적용
 * @returns
 */
const getComments = (boardId: number) => {
  return useQuery([QUERY_KEY, boardId], () => fetcher(boardId));
};

export default getComments;
