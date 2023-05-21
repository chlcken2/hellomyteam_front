// 알림 페이지 팀 가입 신청자 데이터를 가져오는 query
import { instance } from "config";
import { useQuery } from "react-query";
import { JoinAlarmItemType } from "types/alarmType";
import ApiResponseType from "types/ApiResponseType";

interface fetcherPropsType {
  teamId: number;
  teamMemberInfoId: number;
}

export const QUERY_KEY = "/joinAlarm";

const fetcher = ({ teamId, teamMemberInfoId }: fetcherPropsType) =>
  instance
    .get<ApiResponseType<JoinAlarmItemType[]>>(
      `/api/teams/${teamId}/team-member/${teamMemberInfoId}/notifications`,
    )
    .then(({ data }) => data);

const useJoinAlarmQuery = ({ teamId, teamMemberInfoId }: fetcherPropsType) => {
  return useQuery([QUERY_KEY, teamId], () => fetcher({ teamId, teamMemberInfoId }));
};

export default useJoinAlarmQuery;
