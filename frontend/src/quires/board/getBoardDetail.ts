import { instance } from "config";
import { useQuery } from "react-query";
import { boardDetailTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/board/boardId";

const fetcher = (boardId: number) =>
  instance
    .get<ApiResponseType<boardDetailTypes>>(
      `/api/board/${boardId}
    `,
    )
    .then(({ data }) => data);

/**
 * 게시판의 상세정보 가져오기
 * @returns
 */
const getBoardDetail = (boardId: number) => {
  return useQuery([QUERY_KEY, boardId], () => fetcher(boardId));
};

export default getBoardDetail;
