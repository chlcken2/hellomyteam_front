// 팀 프로필 정보를 가져오는 query
import { instance } from "config";
import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { GetProfileImageResponseType, ProfileInfoType } from "types/profileType";

interface GetProfileInfoPropsType {
  teamMemberInfoId: number;
  teamId: number;
}

interface GetImageFetcherPropsType {
  teamMemberInfoId: number;
}

export const GET_TEAM_PROFILE_INFO_QUERY_KEY = "getTeamProfileInfo";
export const GET_TEAM_PROFILE_IMAGE_QUERY_KEY = "getTeamProfileImage";
export const GET_TEAM_BANNER_IMAGE_QUERY_KEY = "getTeamBannerImage";

// fetcher part
const getTeamBannerImagefetcher = ({ teamMemberInfoId }: GetImageFetcherPropsType) =>
  instance
    .get<ApiResponseType<GetProfileImageResponseType>>(
      `/api/teams/{teamid}/team-member/${teamMemberInfoId}/background`,
    )
    .then(({ data }) => data);

const getTeamProfileImagefetcher = ({ teamMemberInfoId }: GetImageFetcherPropsType) =>
  instance
    .get<ApiResponseType<GetProfileImageResponseType>>(
      `/api/teams/{teamid}/team-member/${teamMemberInfoId}/profile`,
    )
    .then(({ data }) => data);

const getTeamProfileInfo = ({ teamMemberInfoId, teamId }: GetProfileInfoPropsType) =>
  instance
    .get<ApiResponseType<ProfileInfoType>>(
      `/api/teams/${teamId}/team-member/${teamMemberInfoId}`,
    )
    .then(({ data }) => data);

// query part
export const useGetTeamBannerImageQuery = ({
  teamMemberInfoId,
}: GetImageFetcherPropsType) => {
  return useQuery([GET_TEAM_BANNER_IMAGE_QUERY_KEY, teamMemberInfoId], () =>
    getTeamBannerImagefetcher({ teamMemberInfoId }),
  );
};

export const useGetTeamProfileImageQuery = ({
  teamMemberInfoId,
}: GetImageFetcherPropsType) => {
  return useQuery([GET_TEAM_PROFILE_IMAGE_QUERY_KEY, teamMemberInfoId], () =>
    getTeamProfileImagefetcher({ teamMemberInfoId }),
  );
};

export const useGetTeamProfileInfoQuery = ({
  teamMemberInfoId,
  teamId,
}: GetProfileInfoPropsType) => {
  return useQuery([GET_TEAM_PROFILE_INFO_QUERY_KEY, teamMemberInfoId], () =>
    getTeamProfileInfo({ teamMemberInfoId, teamId }),
  );
};
