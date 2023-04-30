import { instance } from "config";
import { useQuery } from "react-query";
import { boardDetailTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/board/boardId";

const fetcher = (teamId: number, boardId: number) =>
  instance
    .get<ApiResponseType<boardDetailTypes>>(
      `/api/teams/${teamId}/boards/${boardId}
    `,
    )
    .then(({ data }) => data);

/**
 * 게시판의 상세정보 가져오기
 * @returns
 */
const getBoardDetail = (teamId: number, boardId: number) => {
  return useQuery([QUERY_KEY, boardId], () => fetcher(teamId, boardId));
};

export default getBoardDetail;
