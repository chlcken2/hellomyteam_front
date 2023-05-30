import getMemberInfo from "quires/member/getMemberInfo";
import { atom } from "recoil";

interface termsAndCondType {
  id: number;
  termsOfServiceYn: string;
  privacyYn: string;
}

export interface UserType {
  createdDate: string;
  modifiedDate: string;
  id: number;
  email: string;
  name: string;
  birthday: string;
  memberStatus: string;
  joinPurpose: string;
  termsAndCond: termsAndCondType[];
  teamInfo?: teamInfoType[];
  teamMemberInfoId?: number;
  selectedTeamId?: number;
  changedTeamState?: string;
}

interface teamInfoType {
  teamName: string;
  teamId: number;
}
// 사용자 정보 + 사용자가 가입한 팀 정보
const UserState = atom<UserType | null>({
  key: "UserInfo",
  default: null,
});

export default UserState;
