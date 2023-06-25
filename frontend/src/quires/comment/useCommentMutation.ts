// 알림 페이지 팀 가입 신청을 수락 및 거절하는 Mutation
import { instance } from "config";
import { useMutation, useQueryClient } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { RegistCommentResponseType } from "types/commentType";
import { GET_COMMENTS_QUERY_KEY } from "./useCommentQuery";

interface RegistCommentFetcherPropsType {
  boardId: number;
  content: string;
  teamMemberInfoId: number;
  parentId: number;
}

interface LikeCommentFetcherPropsType {
  commentId: number;
  teamMemberInfoId: number;
}

interface EditCommentFetcherPropsType {
  commentId: number;
  content: string;
  teamMemberInfoId: number;
}

interface RegistCommentMutationPropsType {
  parentId?: number;
  content: string;
  teamMemberInfoId: number;
}

interface EditCommentMutationPropsType {
  commentId: number;
  content: string;
  teamMemberInfoId: number;
}

// fetcher part
const registCommentFetcher = ({
  boardId,
  content,
  teamMemberInfoId,
  parentId,
}: RegistCommentFetcherPropsType) =>
  instance.post<ApiResponseType<RegistCommentResponseType>>(
    `/api/boards/${boardId}/comment`,
    {
      teamMemberInfoId,
      content,
      parentId,
    },
  );

const editCommentFetcher = ({
  commentId,
  content,
  teamMemberInfoId,
}: EditCommentFetcherPropsType) =>
  instance.put<ApiResponseType<RegistCommentResponseType>>(`/api/comments/${commentId}`, {
    teamMemberInfoId,
    content,
  });

const deleteCommentFetcher = (commentId: number) =>
  instance.delete<ApiResponseType<string>>(`/api/comments/${commentId}`);

const likeCommentFetcher = ({
  commentId,
  teamMemberInfoId,
}: LikeCommentFetcherPropsType) =>
  instance.post<ApiResponseType<RegistCommentResponseType>>(
    `/api/comments/${commentId}/like`,
    { teamMemberInfoId },
  );

// mutation part
export const useRegistCommentMutation = (boardId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ content, teamMemberInfoId, parentId }: RegistCommentMutationPropsType) =>
      registCommentFetcher({ boardId, content, teamMemberInfoId, parentId }),
    {
      onSuccess: () => queryClient.invalidateQueries([GET_COMMENTS_QUERY_KEY, boardId]),
    },
  );
};

export const useEditCommentMutation = (boardId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ content, teamMemberInfoId, commentId }: EditCommentMutationPropsType) =>
      editCommentFetcher({ commentId, content, teamMemberInfoId }),
    {
      onSuccess: () => queryClient.invalidateQueries([GET_COMMENTS_QUERY_KEY, boardId]),
    },
  );
};

export const useDeleteCommentMutation = (boardId: number) => {
  const queryClient = useQueryClient();

  return useMutation((commentId: number) => deleteCommentFetcher(commentId), {
    onSuccess: () => queryClient.invalidateQueries([GET_COMMENTS_QUERY_KEY, boardId]),
  });
};

export const useLikeCommentMutation = (boardId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ commentId, teamMemberInfoId }: LikeCommentFetcherPropsType) =>
      likeCommentFetcher({ commentId, teamMemberInfoId }),
    {
      onSuccess: () => queryClient.invalidateQueries([GET_COMMENTS_QUERY_KEY, boardId]),
    },
  );
};
