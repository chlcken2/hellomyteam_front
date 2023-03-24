import { instance } from "config";
import { useMutation, useQueryClient, useQuery } from "react-query";

import { joinTeamTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/api/board";

type boardWriteType = {
  boardCategory: string;
  boardStatus: string;
  contents: string;
  teamMemberInfoId: number;
  title: string;
};

const fetcher = ({
  boardCategory,
  boardStatus,
  contents,
  teamMemberInfoId,
  title,
}: boardWriteType) =>
  instance
    .post<ApiResponseType<joinTeamTypes[]>>("/api/board", {
      boardCategory,
      boardStatus,
      contents,
      teamMemberInfoId,
      title,
    })
    .then(({ data }) => console.log(data));

/**
 * 게시판 글 생성하기
 * @param
 */
export const setBoardWriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    // mutate 요청이 성공한 후 queryClient.invalidateQueries 함수를 통해
    // boardReadQuery에서 불러온 API Response의 Cache를 초기화
    onSuccess: () => alert("hi"),
  });
};
