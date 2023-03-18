import { atom } from "recoil";

interface userStateType {
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
}

const UserState = atom<userStateType | null>({
  key: "UserState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export default UserState;
