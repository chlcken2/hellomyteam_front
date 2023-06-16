import React, { useState, useEffect, useRef, KeyboardEvent, useCallback } from "react";
import Input from "components/common/Input";
import useEmailCertificationQuery from "quires/certification/useEmailCertifictionQuery";
import useEmailMatchQuery from "quires/certification/useEmailMatchQuery";

import "styles/components/common.scss";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import SignupAtom from "recoil/signupAtom";
import { verify } from "constants/verify";

interface EmailType {
  verify: boolean;
  certification: boolean;
}

interface CertificationType {
  auth: string;
  show: boolean;
  number: string;
  timer: number;
  timeout: boolean;
}

const img = process.env.PUBLIC_URL;
const TIMER_UNIT = 300;

const SignupFirstPage = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const certificationRef = useRef<HTMLInputElement>(null);
  const [signupState, setSignupState] = useRecoilState(SignupAtom);

  const [email, setEmail] = useState<EmailType>({
    verify: false,
    certification: false,
  });
  const [emailMatch, setEmailMatch] = useState<CertificationType>({
    auth: "",
    show: false,
    number: "",
    timer: TIMER_UNIT,
    timeout: false,
  });

  const { data: EmailCertificationResponse, refetch: CertificationRefetch } =
    useEmailCertificationQuery(signupState.email);

  const { data: EmailMatchResponse, refetch: EmailMatchRefetch } = useEmailMatchQuery(
    emailMatch.auth,
    Number(emailMatch.number),
  );

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

  useEffect(() => {
    if (EmailCertificationResponse) {
      setEmailMatch((prev) => ({ ...prev, auth: EmailCertificationResponse.data }));
    }
  }, [EmailCertificationResponse]);
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
    if (!verify.email.test(signupState.email)) {
      setEmail((prev) => ({ ...prev, verify: true }));
    } else {
      setEmail((prev) => ({ ...prev, verify: false }));
    }
    setSignupState((prev) => ({ ...prev, email: e.target.value }));
  };

  // handler
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      return;
    }
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
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

  const requestMatchingNumber = () => {
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
        <span className={`${verify.eng.test(signupState.password) && "highlight"}`}>
          영문포함
        </span>
        <span className={`${verify.number.test(signupState.password) && "highlight"}`}>
          숫자포함
        </span>
        <span className={`${signupState.password.length >= 8 && "highlight"}`}>
          8자 이상
        </span>
      </div>
    );
  };

  // button disabled
  const nextButtonDisabled = () => {
    if (
      EmailMatchResponse &&
      EmailMatchResponse.data.status === "success" &&
      signupState.password === signupState.passwordCheck &&
      signupState.passwordCheck.length > 0
    ) {
      return false;
    }
    return true;
  };

  const handleNext = () => {
    navigate("/onboarding/signup/2");
  };

  return (
    <>
      <button onClick={() => navigate("/onboarding")}>
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
          value={signupState.email}
          onChange={handleEmailChagne}
          inputRef={emailRef}
          label="이메일*"
          errorMessage={email.verify && "이메일 형식 불일치"}
          readOnly={email.certification && true}
        >
          {signupState.email && !email.verify && emailCertificationButton()}
        </Input>
        {emailMatch.show && (
          <Input
            value={emailMatch.number}
            onChange={(e) =>
              setEmailMatch((prev) => ({ ...prev, number: e.target.value }))
            }
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
            value={signupState.password}
            onChange={(e) =>
              setSignupState((prev) => ({ ...prev, password: e.target.value }))
            }
            label="비밀번호*"
            type="password"
          />
          {signupState.password && passwordVerify()}
        </div>
        <div>
          <Input
            value={signupState.passwordCheck}
            onChange={(e) =>
              setSignupState((prev) => ({ ...prev, passwordCheck: e.target.value }))
            }
            label="비밀번호 확인*"
            type="password"
            errorMessage={`${
              signupState.password !== signupState.passwordCheck &&
              signupState.passwordCheck.length > 0
                ? "비밀번호 불일치"
                : ""
            }`}
          />
          <div className="verify-password">
            {signupState.password === signupState.passwordCheck &&
              signupState.passwordCheck.length > 0 && (
                <span className="highlight">비밀번호 일치</span>
              )}
          </div>
        </div>
      </div>
      <button
        className="next-button"
        onClick={() => handleNext()}
        disabled={nextButtonDisabled()}
      >
        다음으로
      </button>
    </>
  );
};

export default SignupFirstPage;
