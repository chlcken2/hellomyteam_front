import { atom } from "recoil";

const UserState = atom({
  key: "UserState", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
});

export default UserState;
