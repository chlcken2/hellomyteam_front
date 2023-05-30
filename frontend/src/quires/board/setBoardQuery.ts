import { instance } from "config";
import { useMutation, useQueryClient } from "react-query";

import { joinTeamTypes, boardDetailTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/api/board";

const BOARD_LIST_QUERY = "/board/boardId";

type boardWriteType = {
  boardCategory: string;
  boardStatus: string;
  contents: string;
  teamMemberInfoId: number;
  title: string;
  teamId: number;
};

type boardDeleteType = {
  teamId: number;
  boardId: number;
};

const deleteBoardFetcher = ({ teamId, boardId }: boardDeleteType) =>
  instance.delete<ApiResponseType<string>>(`/api/teams/${teamId}/boards/${boardId}`);

const fetcher = ({
  boardCategory,
  boardStatus,
  contents,
  teamMemberInfoId,
  title,
  teamId,
}: boardWriteType) =>
  instance
    .post<ApiResponseType<boardDetailTypes>>(`/api/teams/${teamId}/board`, {
      boardCategory,
      boardStatus,
      contents,
      teamMemberInfoId,
      title,
    })
    .then(({ data }) => data);

/**
 * 게시판 글 생성하기
 * @param onSuccess: API Rsponse의 Cache를 초기화
 */
export const setBoardWriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    // mutate 요청이 성공한 후 queryClient.invalidateQueries 함수를 통해
    // boardReadQuery에서 불러온 API Response의 Cache를 초기화
    onSuccess: () => queryClient.invalidateQueries(BOARD_LIST_QUERY),
  });
};

/**
 * 게시글 삭제
 */
export const boardDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteBoardFetcher, {
    onSuccess: () => queryClient.invalidateQueries(BOARD_LIST_QUERY),
  });
};

const editBoardFetcher = ({ teamId, boardId, category, content, title }: any) =>
  instance.put<ApiResponseType<any>>(`/api/teams/${teamId}/boards/${boardId}`, {
    changeBoardCategory: category,
    changeContents: content,
    changeTitle: title,
  });

/**
 * 게시글 수정
 */
export const useEditBoardMutation = (boardId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ teamId, category, content, title }: any) =>
      editBoardFetcher({ teamId, boardId, category, content, title }),
    {
      onSuccess: () => queryClient.invalidateQueries([BOARD_LIST_QUERY, boardId]),
    },
  );
};
