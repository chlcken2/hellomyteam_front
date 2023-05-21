import { atom } from "recoil";

const LoginState = atom({
  key: "LoginState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export default LoginState;
