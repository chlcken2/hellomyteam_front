import { instance } from "config";
import { useMutation, useQueryClient, useQuery } from "react-query";

import { joinTeamTypes, boardDetailTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/api/board";

type boardLikeType = {
  boardId: number;
  teamMemberInfoId: number;
  teamId: number;
};

const fetcher = ({ boardId, teamMemberInfoId, teamId }: boardLikeType) =>
  instance
    .post<ApiResponseType<boardDetailTypes>>(
      `/api/teams/${teamId}/boards/${boardId}/like`,
      { teamMemberInfoId: `${teamMemberInfoId}` },
    )
    .then(({ data }) => data);

/**
 * 게시판 글 생성하기
 * @param onSuccess: API Rsponse의 Cache를 초기화
 */
export const setBoardLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    // mutate 요청이 성공한 후 queryClient.invalidateQueries 함수를 통해
    // boardReadQuery에서 불러온 API Response의 Cache를 초기화
    onSuccess: () => console.log("글쓴후에 boardRead를 초기화예정"),
  });
};
