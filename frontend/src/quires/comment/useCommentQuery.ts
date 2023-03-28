import { instance } from "config";
import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { CommentType } from "types/commentType";

export const GET_COMMENTS_QUERY_KEY = "/board/:boardId/comment";

// fetcher part
const fetcher = (boardId: number) =>
  instance
    .get<ApiResponseType<CommentType[]>>(
      `/api/board/${boardId}/comment
    `,
    )
    .then(({ data }) => data);

// mutation part
const useGetCommentsQuery = (boardId: number) => {
  return useQuery([GET_COMMENTS_QUERY_KEY, boardId], () => fetcher(boardId));
};

export default useGetCommentsQuery;
