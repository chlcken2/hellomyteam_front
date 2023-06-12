import { instance } from "config";
import { useQuery } from "react-query";
/**
 * teamMemberInfo_id 가져오기
 */
interface teamMemberIdType {
  status: string;
  data: number;
  message: string;
}
const QUERY_KEY = "/teams/teamInfoId";

export const useTeamInfoFetcher = (teamId: number, memberId: number) =>
  instance
    .get<teamMemberIdType>(`/api/teams/${teamId}/members/${memberId}`)
    .then(({ data }) => data);

/**
 * 로그인 후 가입한 팀 id와 팀 이름 가져오기
 * @returns
 */
const teamMemberId = (teamId: number, memberId: number, enabled = true) => {
  return useQuery([QUERY_KEY], () => useTeamInfoFetcher(teamId, memberId), {
    enabled,
  });
};

export default teamMemberId;
