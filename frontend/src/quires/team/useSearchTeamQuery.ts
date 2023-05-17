import { instance } from "config";
import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { TeamCardContentsType } from "types/teamCardType";

export const QUERY_KEY = "/teams/";

const SearchTeamFetcher = (teamIdentifier: string) => {
  if (!teamIdentifier) return null;
  return instance
    .get<ApiResponseType<TeamCardContentsType[]>>(
      `/api/teams/{team-identifier}?team-identifier=${teamIdentifier}`,
    )
    .then((data) => data.data);
};
const useSearchTeamQuery = (teamIdentifier: string) => {
  return useQuery(QUERY_KEY, () => SearchTeamFetcher(teamIdentifier));
};

export default useSearchTeamQuery;
