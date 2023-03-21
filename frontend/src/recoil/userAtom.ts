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

// interface UserType {
//   birthday: string;
//   createdDate: string;
//   email: string;
//   id: number;
//   joinPurpose: string;
//   memberStatus: string;
//   modifiedDate: string;
//   name: string;
//   termsAndCond: any[];
// }

// const UserState = atom({
//   key: "UserState", // unique ID (with respect to other atoms/selectors)
//   default: {} as UserType, // default value (aka initial value)
// });

export default UserState;
