import { instance } from "config";
import { useMutation, useQueryClient } from "react-query";
import ApiResponseType from "types/ApiResponseType";

interface APIDataType {
  createdDate: string;
  modifiedDate: string;
  id: number;
  authority: string;
  preferPosition: null;
  preferStyle: null;
  specialTitleStatus: null;
  withdrawalDate: null;
  conditionStatus: string;
  backNumber: number;
  memberOneIntro: string | null;
  address: string | null;
  leftRightFoot: string;
  conditionIndicator: number;
  drinkingCapacity: number;
  joinDate: null;
  applyDate: string;
  member: {
    createdDate: string;
    modifiedDate: string;
    id: number;
    email: string;
    name: string;
    birthday: string;
    memberStatus: string;
    joinPurpose: string;
    termsAndCond: [
      {
        id: number;
        termsOfServiceYn: string;
        privacyYn: string;
      },
    ];
  };
  team: {
    createdDate: string;
    modifiedDate: string;
    id: 17;
    teamName: string;
    oneIntro: string;
    detailIntro: string;
    tacticalStyleStatus: string;
    memberCount: number;
    mercenaryCount: number;
    teamSerialNo: number;
  };
  image: string | null;
  boards: string | null;
  comments: string | null;
  likes: string | null;
}

const TEAM_JOIN_QUERY_KEY = "/team/join";

const TeamJoinFetcher = (teamId: number, memberId: number) =>
  instance.post<ApiResponseType<APIDataType>>(
    `/api/teams/${teamId}/join?memberId=${memberId}`,
  );

const TeamJoinCancelFetch = (teamId: number, memberId: number) => {
  if (!teamId) return null;
  return instance.delete<ApiResponseType<string>>(
    `/api/teams/${teamId}/cancel/${memberId}`,
  );
};

export const useTeamJoin = (memberId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation(
    TEAM_JOIN_QUERY_KEY,
    (teamId: number) => TeamJoinFetcher(teamId, memberId),
    {
      onSuccess: () => queryClient.invalidateQueries(TEAM_JOIN_QUERY_KEY),
    },
  );
};

export const useJoinTeamCancel = (teamId: number, memberId: number) =>
  TeamJoinCancelFetch(teamId, memberId);
