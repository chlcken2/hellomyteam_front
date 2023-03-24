import { instance } from "config";
/**
 * teamMemberInfo_id 가져오기
 */
export const teamMemberId = (teamId: number, memberId: number) => {
  return instance.get(`/api/teams/${teamId}/members/${memberId}`);
};
