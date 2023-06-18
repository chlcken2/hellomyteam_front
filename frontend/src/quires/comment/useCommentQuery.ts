import { instance } from "config";
import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { CommentListType } from "types/commentType";

export const GET_COMMENTS_QUERY_KEY = "/board/:boardId/comment";

// fetcher part
const fetcher = (boardId: number, page: number, size: number) =>
  instance
    .get<ApiResponseType<CommentListType>>(
      `/api/boards/${boardId}/comment?commentNum=${0}&commentSize=${100}
    `,
    )
    .then(({ data }) => data);

// mutation part
const useGetCommentsQuery = (boardId: number, page: number, size: number) => {
  return useQuery([GET_COMMENTS_QUERY_KEY, boardId], () => fetcher(boardId, page, size));
};

export default useGetCommentsQuery;
