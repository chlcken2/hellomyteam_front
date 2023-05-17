// 알림 페이지 팀 가입 신청을 수락 및 거절하는 Mutation
import { instance } from "config";
import { useMutation, useQueryClient } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { RegistCommentResponseType } from "types/commentType";
import {
  GET_TEAM_BANNER_IMAGE_QUERY_KEY,
  GET_TEAM_PROFILE_IMAGE_QUERY_KEY,
} from "./useTeamProfileQuery";

interface RegistProfileImageFetcherPropsType {
  teamMemberInfoId: number;
  imgFile: FormData;
}

// fetcher part
const registBannerImageFetcher = ({
  teamMemberInfoId,
  imgFile,
}: RegistProfileImageFetcherPropsType) =>
  instance.post<ApiResponseType<RegistCommentResponseType>>(
    `/api/teams/{teamid}/team-member/${teamMemberInfoId}/background`,
    imgFile,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

const registProfileImageFetcher = ({
  teamMemberInfoId,
  imgFile,
}: RegistProfileImageFetcherPropsType) =>
  instance.post<ApiResponseType<RegistCommentResponseType>>(
    `/api/teams/{teamid}/team-member/${teamMemberInfoId}/profile`,
    imgFile,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

// mutation part
export const useRegistTeamBannerImageMutation = (teamMemberInfoId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    (imgFile: FormData) => registBannerImageFetcher({ imgFile, teamMemberInfoId }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          GET_TEAM_BANNER_IMAGE_QUERY_KEY,
          teamMemberInfoId,
        ]),
    },
  );
};

export const useRegistTeamProfileImageMutation = (teamMemberInfoId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    (imgFile: FormData) => registProfileImageFetcher({ imgFile, teamMemberInfoId }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          GET_TEAM_PROFILE_IMAGE_QUERY_KEY,
          teamMemberInfoId,
        ]),
    },
  );
};
