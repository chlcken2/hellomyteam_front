import { atom } from "recoil";

interface UserType {
  birthday: string;
  createdDate: string;
  email: string;
  id: number;
  joinPurpose: string;
  memberStatus: string;
  modifiedDate: string;
  name: string;
  termsAndCond: any[];
}
const UserState = atom({
  key: "UserState", // unique ID (with respect to other atoms/selectors)
  default: {} as UserType, // default value (aka initial value)
});

export default UserState;
