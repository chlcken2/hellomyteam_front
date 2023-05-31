import { instance } from "config";
import { useQuery, useQueryClient } from "react-query";
import { boardListTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/board/boardId";

const fetcher = (
  num: number,
  teamId: number,
  category: string,
  sortType: string,
  srchKwd: string,
  srchType: string,
  pageSize: number,
) =>
  instance
    .get<ApiResponseType<boardListTypes>>(
      `/api/teams/${teamId}/boards?category=${category}&pageNum=${num}&pageSize=${pageSize}&sortType=${sortType}&srchKwd=${srchKwd}&srchType=${srchType}
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
  srchKwd: string,
  srchType: string,
  pageSize: number,
) => {
  return useQuery([QUERY_KEY, category], () =>
    fetcher(num, teamId, category, sortType, srchKwd, srchType, pageSize),
  );
};

export default getBoardList;
