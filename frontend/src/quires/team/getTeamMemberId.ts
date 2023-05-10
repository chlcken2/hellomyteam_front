import { instance } from "config";
/**
 * teamMemberInfo_id 가져오기
 */
interface teamMemberIdType {
  status: string;
  data: number;
  message: string;
}
export const teamMemberId = (teamId: number, memberId: number) => {
  return instance.get<teamMemberIdType>(`/api/teams/${teamId}/members/${memberId}`);
};
