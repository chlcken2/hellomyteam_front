import { instance } from "config";
import { useQuery } from "react-query";
import { boardListTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/board/boardId";

const fetcher = (num: number, teamId: number, category: string, sortType: string) =>
  instance
    .get<ApiResponseType<boardListTypes>>(
      `/api/teams/${teamId}/boards?category=${category}&pageNum=${num}&pageSize=10&sortType=${sortType}
    `,
    )
    .then(({ data }) => data);

/**
 * 선택됨 팀의 게시판 리스트 가져오기
 * @returns
 */
const getBoardList = (
  num: number,
  teamId: number,
  category: string,
  sortType: string,
) => {
  return useQuery([QUERY_KEY, teamId], () => fetcher(num, teamId, category, sortType));
};

export default getBoardList;
