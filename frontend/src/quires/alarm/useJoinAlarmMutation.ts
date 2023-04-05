// 알림 페이지 팀 가입 신청을 수락 및 거절하는 Mutation
import { instance } from "config";
import { useMutation, useQueryClient } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { QUERY_KEY as joinAlarmQueryKey } from "./useJoinAlarmQuery";

interface fetcherPropsType {
  teamId: number;
  memberId: number;
}

// fetcher part
const JoinAlarmAcceptfetcher = ({ teamId, memberId }: fetcherPropsType) =>
  instance.post<ApiResponseType<string>>(`/api/teams/${teamId}/members/${memberId}/accept`);

const JoinAlarmRejectfetcher = ({ teamId, memberId }: fetcherPropsType) =>
  instance.post<ApiResponseType<string>>(`/api/teams/${teamId}/members/${memberId}/reject`);

// mutation part
export const useJoinAlarmAcceptMutation = (teamId: number) => {
  // mutation 성공 후 `useJoinAlarmQuery`로 관리되는 서버 상태를 다시 불러오기 위한
  // Cache 초기화를 위해 사용될 queryClient 객체
  const queryClient = useQueryClient();

  return useMutation((memberId: number) => JoinAlarmAcceptfetcher({ memberId, teamId }), {
    // mutate 요청이 성공한 후 queryClient.invalidateQueries 함수를 통해
    // useJoinAlarmQuery에서 불러온 API Response의 Cache를 초기화
    onSuccess: () => queryClient.invalidateQueries([joinAlarmQueryKey, teamId]),
  });
};

export const useJoinAlarmRejectMutation = (teamId: number) => {
  const queryClient = useQueryClient();

  return useMutation((memberId: number) => JoinAlarmRejectfetcher({ memberId, teamId }), {
    onSuccess: () => queryClient.invalidateQueries([joinAlarmQueryKey, teamId]),
  });
};
