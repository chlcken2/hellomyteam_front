import Checkbox from "components/common/Checkbox";
import Input from "components/common/Input";
import Select, { OptionType } from "components/common/Select";
import { verify } from "constants/verify";
import useSignupMutation from "quires/certification/useSignupMutation";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import SignupAtom from "recoil/signupAtom";

const img = process.env.PUBLIC_URL;

interface PrivacyType {
  name: string;
  birthday: string;
}

const EMAIL_DUPLICATION_ERROR = "Email address already in use.";

const SELECT_LIST = [
  { label: "팀 관리", value: "TEAM_MANAGEMENT" },
  { label: "팀 생성", value: "TEAM_CREATE" },
];

const SignupSecondPage = () => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState<PrivacyType>({
    name: "",
    birthday: "",
  });
  const [memberPurpose, setMemberPurpose] = useState<OptionType>({
    label: "팀 관리",
    value: "TEAM_MANAGEMENT",
  });
  const signupState = useRecoilValue(SignupAtom);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { data: signupResponse, mutate: signupMutate } = useSignupMutation({
    birthday: privacy.birthday,
    email: signupState.email,
    joinPurpose: memberPurpose.value,
    name: privacy.name,
    password: signupState.password,
    privacyYn: isChecked && "YES",
    termsOfServiceYn: isChecked && "YES",
  });
  const handlePrivacy = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 6) {
      return;
    }
    setPrivacy((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (signupResponse && signupResponse.data.status === "success") {
      navigate("/onboarding/success");
    }
    if (signupResponse && signupResponse.data.message === EMAIL_DUPLICATION_ERROR) {
      alert("중복된 이메일 입니다. \n확인 후 다시 입력해주세요.");
    }
  }, [signupResponse]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      return;
    }
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleMemberPurposChange = (e: null | OptionType) => {
    if (!e) {
      return;
    }

    setMemberPurpose(e);
  };

  const submitDisabled = () => {
    if (
      isChecked &&
      verify.name.test(privacy.name) &&
      verify.birthday.test(privacy.birthday)
    ) {
      return false;
    }
    return true;
  };

  return (
    <div className="join-wrap">
      <button onClick={() => navigate("/onboarding/signup")}>
        <img src={`${img}/common/ChevronLeftOutline.png`} alt="go-back" />
      </button>
      <div className="guide-text">
        <h1>반가워요 👋</h1>
        <p>
          이제 몇가지 정보만 입력해주시면
          <span>손쉽게 여러분만의 팀을 관리할 수 있어요</span>
        </p>
      </div>
      <div className="join-form">
        <Input
          value={privacy.name}
          onChange={(e) => handlePrivacy(e)}
          name="name"
          label="이름*"
          maxLength={6}
          errorMessage={`${
            !verify.name.test(privacy.name) && privacy.name.length > 0
              ? "한글, 영문 5글자까지 입력 가능"
              : ""
          }`}
        />
        <Input
          value={privacy.birthday}
          onChange={(e) => handlePrivacy(e)}
          name="birthday"
          maxLength={6}
          label="생년월일(YYMMDD)*"
          keyDownHandler={handleKeyDown}
          errorMessage={`${
            !verify.birthday.test(privacy.birthday) && privacy.birthday.length > 0
              ? "생년월일 형식 불일치"
              : ""
          }`}
        />
        <Select
          placeholder=""
          label="가입 목적*"
          options={SELECT_LIST}
          onChange={handleMemberPurposChange}
          defaultValue={memberPurpose.value}
        />
      </div>
      <div className="checkbox-wrap">
        <Checkbox
          id="agreement-checkbox"
          isChecked={isChecked}
          setIsChecked={setIsChecked}
        />
      </div>
      <button
        className="next-button"
        disabled={submitDisabled()}
        onClick={() => signupMutate()}
      >
        가입완료
      </button>
    </div>
  );
};
export default SignupSecondPage;
