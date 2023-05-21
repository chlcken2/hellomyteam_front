import Input from "components/common/Input";
import Select, { OptionType } from "components/common/Select";
import useEmailCertificationQuery from "quires/certification/useEmailCertifictionQuery";
import useEmailMatchQuery from "quires/certification/useEmailMatchQuery";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  FormEvent,
  KeyboardEvent,
  useCallback,
  ChangeEvent,
} from "react";
import "styles/components/common.scss";
import Checkbox from "components/common/Checkbox";
import useSignupMutation from "quires/certification/useSignupMutation";

interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
}
interface EmailType {
  text: string;
  verify: boolean;
  certification: boolean;
}

interface CertificationType {
  show: boolean;
  number: string;
  timer: number;
  timeout: boolean;
}

interface PrivacyType {
  name: string;
  birthday: string;
}

const img = process.env.PUBLIC_URL;
const TIMER_UNIT = 300;
const verifyEng = /[a-zA-Z]/;
const verifyNum = /[0-9]/;
const verifyName = /^[가-힣]{2,6}$|[a-zA-Z]{2,6}$/;
const verifyBirthday = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/;
const SELECT_LIST = [
  { label: "팀 관리", value: "TEAM_MANAGEMENT" },
  { label: "팀 생성", value: "TEAM_CREATE" },
];

const Join = ({ setHasId }: IHas) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const certificationRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<EmailType>({
    text: "",
    verify: false,
    certification: false,
  });
  const [emailMatch, setEmailMatch] = useState<CertificationType>({
    show: false,
    number: "",
    timer: TIMER_UNIT,
    timeout: false,
  });
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<PrivacyType>({
    name: "",
    birthday: "",
  });
  const [memberPurpose, setMemberPurpose] = useState<OptionType>({
    label: "팀 관리",
    value: "TEAM_MANAGEMENT",
  });

  const {
    data: EmailCertificationResponse,
    refetch: CertificationRefetch,
    error: EmailCertificationError,
  } = useEmailCertificationQuery(email.text);

  const {
    data: EmailMatchResponse,
    refetch: EmailMatchRefetch,
    error: EmailMatchError,
  } = useEmailMatchQuery(Number(emailMatch.number));

  const { data: signupResponse, mutate: signupMutate } = useSignupMutation({
    birthday: privacy.birthday,
    email: email.text,
    joinPurpose: memberPurpose.value,
    name: privacy.name,
    password,
    privacyYn: isChecked && "YES",
    termsOfServiceYn: isChecked && "YES",
  });

  const [isNext, setIsNext] = useState<boolean>(true);

  const onClickNext = (e: any) => {
    e.preventDefault();
    setIsNext(false);
  };

  useEffect(() => {
    if (
      emailMatch.show &&
      (!EmailMatchResponse || EmailMatchResponse.data.status !== "success")
    ) {
      alert("인증번호가 일치하지 않습니다.");
    } else {
      setEmailMatch((prev) => ({ ...prev, show: false }));
    }
  }, [EmailMatchResponse]);

  // timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emailMatch.show) {
      timer = setInterval(() => {
        setEmailMatch((prev) => ({
          ...prev,
          timer: prev.timer - 1,
        }));
      }, 1000);
      if (emailMatch.timer === 0) {
        setEmailMatch((prev) => ({ ...prev, timeout: true }));
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [emailMatch.timer, emailMatch.show]);

  const minutes = () => {
    const unit = String(Math.floor(emailMatch.timer / 60));
    return `0${unit}`;
  };

  const seconds = () => {
    const unit = String(emailMatch.timer % 60);
    return `${unit.length < 2 ? 0 + unit : unit}`;
  };

  // verify
  const handleEmailChagne = (e: React.ChangeEvent<HTMLInputElement>) => {
    const verifyEmail =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (!verifyEmail.test(email.text)) {
      setEmail((prev) => ({ ...prev, text: e.target.value, verify: true }));
    } else {
      setEmail((prev) => ({ ...prev, verify: false, text: e.target.value }));
    }
  };

  // handler
  const handleEmailMatchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailMatch((prev) => ({ ...prev, number: e.target.value }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      return;
    }
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePrivacy = (e: ChangeEvent<HTMLInputElement>, type: "name" | "birthday") => {
    if (e.target.value.length > 6) {
      return;
    }
    setPrivacy((prev) => ({ ...prev, [type]: e.target.value }));
  };

  const handleMemberPurposChange = (e: null | OptionType) => {
    if (!e) {
      return;
    }
    setMemberPurpose(e);
  };

  const handleCompleteSignup = () => {
    signupMutate();
  };

  // API request
  const requestVerification = () => {
    setEmailMatch((prev) => ({
      ...prev,
      number: "",
      timer: TIMER_UNIT,
      timeout: false,
      show: true,
    }));

    setTimeout(() => {
      certificationRef.current.focus();
    }, 100);

    alert("이메일로 인증번호를 전송했습니다. \n인증번호를 입력해주세요.");
    CertificationRefetch();
    setEmail((prev) => ({ ...prev, certification: true }));
  };

  const requestMatchingNumber = (e: FormEvent<HTMLButtonElement>) => {
    if (emailMatch.number.length < 6) {
      alert("인증번호 6자리를 입력해주세요");
    } else {
      EmailMatchRefetch();
    }
  };

  // component
  const emailCertificationButton = useCallback(() => {
    let ButtonLabel = null;
    if (EmailMatchResponse && EmailMatchResponse.data.status === "success") {
      ButtonLabel = <img src="/icons/check-blue.svg" alt="check-blue" />;
    } else {
      ButtonLabel = (
        <button onClick={requestVerification}>
          {email.certification ? "재전송" : "인증번호 전송"}
        </button>
      );
    }

    return <div className="email-certification-wrap">{ButtonLabel}</div>;
  }, [EmailMatchResponse, emailMatch.show]);

  const passwordVerify = () => {
    return (
      <div className="verify-password">
        <span className={`${verifyEng.test(password) && "highlight"}`}>영문포함</span>
        <span className={`${verifyNum.test(password) && "highlight"}`}>숫자포함</span>
        <span className={`${password.length >= 8 && "highlight"}`}>8자 이상</span>
      </div>
    );
  };

  // button disabled
  const nextButtonDisabled = () => {
    if (
      EmailMatchResponse &&
      EmailMatchResponse.data.status === "success" &&
      password === passwordCheck &&
      passwordCheck.length > 0
    ) {
      return false;
    }
    return true;
  };

  const submitDisabled = () => {
    if (
      isChecked &&
      verifyName.test(privacy.name) &&
      verifyBirthday.test(privacy.birthday)
    ) {
      return false;
    }
    return true;
  };

  return (
    <div className="join-wrap">
      {isNext ? (
        <>
          <button onClick={() => setHasId(false)}>
            <img src={`${img}/common/ChevronLeftOutline.png`} alt="go-back" />
          </button>
          <div className="guide-text">
            <h1>안녕하세요!</h1>
            <p>
              회원가입을 위해
              <span>이메일과 비밀번호를 입력해주세요</span>
            </p>
          </div>
          <div className="join-form">
            <Input
              value={email.text}
              onChange={handleEmailChagne}
              inputRef={emailRef}
              label="이메일*"
              errorMessage={email.verify && "이메일 형식 불일치"}
              readOnly={email.certification && true}
            >
              {email.text && !email.verify && emailCertificationButton()}
            </Input>
            {emailMatch.show && (
              <Input
                value={emailMatch.number}
                onChange={handleEmailMatchOnChange}
                inputRef={certificationRef}
                label="인증번호*"
                readOnly={emailMatch.timeout}
                maxLength={6}
                keyDownHandler={handleKeyDown}
              >
                <div
                  className={
                    emailMatch.timer === 0
                      ? "email-certification-wrap-expiration"
                      : "email-certification-wrap"
                  }
                >
                  <span>
                    {minutes()}:{seconds()}
                  </span>
                  <button onClick={requestMatchingNumber}>인증</button>
                </div>
              </Input>
            )}
            <div>
              <Input
                value={password}
                setValue={setPassword}
                label="비밀번호*"
                type="password"
              />
              {password && passwordVerify()}
            </div>
            <div>
              <Input
                value={passwordCheck}
                setValue={setPasswordCheck}
                label="비밀번호 확인*"
                type="password"
                errorMessage={`${
                  password !== passwordCheck && passwordCheck.length > 0
                    ? "비밀번호 불일치"
                    : ""
                }`}
              />
              <div className="verify-password">
                {password === passwordCheck && passwordCheck.length > 0 && (
                  <span className="highlight">비밀번호 일치</span>
                )}
              </div>
            </div>
          </div>
          <button
            className="next-button"
            onClick={(e) => onClickNext(e)}
            disabled={nextButtonDisabled()}
          >
            다음으로
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setIsNext(true);
            }}
          >
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
              onChange={(e) => handlePrivacy(e, "name")}
              label="이름*"
              maxLength={6}
              errorMessage={`${
                !verifyName.test(privacy.name) && privacy.name.length > 0
                  ? "한글, 영문 5글자까지 입력 가능"
                  : ""
              }`}
            />
            <Input
              value={privacy.birthday}
              onChange={(e) => handlePrivacy(e, "birthday")}
              maxLength={6}
              label="생년월일(YYMMDD)*"
              keyDownHandler={handleKeyDown}
              errorMessage={`${
                !verifyBirthday.test(privacy.birthday) && privacy.birthday.length > 0
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
            onClick={() => handleCompleteSignup()}
          >
            가입완료
          </button>
        </>
      )}
    </div>
  );
};

export default Join;
