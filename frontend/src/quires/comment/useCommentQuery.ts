import { instance } from "config";
import { useQuery } from "react-query";
import { getCommentListTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const GET_COMMENTS_QUERY_KEY = "/board/:boardId/comment";

// fetcher part
const fetcher = (boardId: number) =>
  instance
    .get<ApiResponseType<getCommentListTypes[]>>(
      `/api/board/${boardId}/comment
    `,
    )
    .then(({ data }) => data);

// mutation part
const useGetCommentsQuery = (boardId: number) => {
  return useQuery([GET_COMMENTS_QUERY_KEY, boardId], () => fetcher(boardId));
};

export default useGetCommentsQuery;
