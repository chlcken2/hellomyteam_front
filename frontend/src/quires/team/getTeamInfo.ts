import { instance } from "config";
import { useQuery } from "react-query";
import { joinTeamTypes } from "types/UserTypes";
import ApiResponseType from "types/ApiResponseType";

export const USER_INFO_QUERY_KEY = "/teams/memberId";

export const useTeamInfoFetcher = (memberId: number) =>
  instance
    .get<ApiResponseType<joinTeamTypes[]>>(`/api/user/teams/${memberId}`)
    .then(({ data }) => data);

/**
 * 로그인 후 가입한 팀 id와 팀 이름 가져오기
 * @returns
 */
const getTeamInfo = (enabled: boolean) => {
  const memberId = Number(localStorage.getItem("userId"));
  return useQuery([USER_INFO_QUERY_KEY, memberId], () => useTeamInfoFetcher(memberId), {
    enabled,
  });
};

export default getTeamInfo;
