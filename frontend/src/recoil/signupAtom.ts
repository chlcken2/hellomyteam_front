import { atom } from "recoil";

interface SignupAtomType {
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
  privacyYn: null | "YES";
  termsOfServiceYn: null | "YES";
  joinPurpose: "TEAM_MANAGEMENT" | "TEAM_CREATE";
  birthday: string;
}

const SignupAtom = atom<SignupAtomType>({
  key: "SignupState",
  default: {
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
    privacyYn: null,
    termsOfServiceYn: null,
    joinPurpose: "TEAM_MANAGEMENT",
    birthday: "",
  },
});

export default SignupAtom;
