import { atom } from "recoil";

interface termsAndCondType {
  id: number;
  termsOfServiceYn: string;
  privacyYn: string;
}

interface UserType {
  createdDate: string;
  modifiedDate: string;
  id: number;
  email: string;
  name: string;
  birthday: string;
  memberStatus: string;
  joinPurpose: string;
  termsAndCond: termsAndCondType[];
}

const UserState = atom<UserType | null>({
  key: "UserState",
  default: null,
});

export default UserState;

