import { Suspense } from "react";
import "../../styles/pages/signupSuccess.scss";
import { useNavigate } from "react-router-dom";

const img = process.env.PUBLIC_URL;

const buttonElements = [
  {
    mainText: "팀 생성하기",
    subText: "나만의 팀을 만들고 관리하기",
    icon: `${img}/icons/person-gray.svg`,
    navi: "/account/create",
  },
  {
    mainText: "팀 가입하기",
    subText: "팀 이름 또는 고유 코드로 찾기",
    icon: `${img}/icons/create-team.svg`,
    navi: "/search",
  },
];

const SignupSuccess = () => {
  const navigate = useNavigate();
  const getButton = (
    mainText: string,
    subText: string,
    icon: string,
    key: number,
    route: string,
  ) => {
    return (
      <button onClick={() => navigate(route)} key={key}>
        <img className="icon" width={21} height={17} src={icon} alt="person-logo" />
        <div>
          <h1>{mainText}</h1>
          <p>{subText}</p>
        </div>
        <img src={`${img}/icons/arrow-right-gray.svg`} alt="arrow-right" />
      </button>
    );
  };

  return (
    <Suspense fallback={<div>asdf</div>}>
      <div className="signup-success-container">
        <div className="signup-success-guide-text">
          <h1>헬로마이팀 시작하기</h1>
          <p>
            회원가입 완료! <br />
            나만의 팀을 만들거나 원하는 팀에 가입해보세요
          </p>
        </div>
        <div className="signup-success-button">
          {buttonElements.map((el, idx) =>
            getButton(el.mainText, el.subText, el.icon, idx, el.navi),
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default SignupSuccess;
