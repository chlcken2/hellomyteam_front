import { instance } from "config";
import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/team/exit";

export const useTeamExitFetcher = (teamId: number, teamMemberInfoId: number) =>
  instance
    .delete<ApiResponseType<string>>(
      `/api/teams/${teamId}/team-member/${teamMemberInfoId}`,
    )
    .then(({ data }) => data);

const useTeamExitQuery = (teamId: number, teamMemberInfoId: number) => {
  const memberId = Number(localStorage.getItem("userId"));
  return useQuery(
    [QUERY_KEY, memberId],
    () => useTeamExitFetcher(teamId, teamMemberInfoId),
    {
      enabled: false,
    },
  );
};

export default useTeamExitQuery;
