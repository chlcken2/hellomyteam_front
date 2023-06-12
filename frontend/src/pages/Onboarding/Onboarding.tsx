import { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import "../../styles/pages/onboarding.scss";
import Button from "components/common/Button";
import LoadingSpinner from "components/common/LoadingSpinner";

const img = process.env.PUBLIC_URL;
const IMAGE_WIDTH = 300;
const SLIDES_LENGTH = 3;
const TRANSITION_TIME = 300;
const TRANSITION_STYLE = `all ${TRANSITION_TIME}ms ease-in-out`;
const INITIONAL_TRANSLATE_X = 100;

const SLIDES = {
  items: [
    {
      textFirstLine: "전문적인 팀 관리,",
      textSecondLine: "더욱 쉽게",
      img: `${img}/illust/onboarding-page-3.svg`,
    },
    {
      textFirstLine: "더이상 번거로운 팀 관리에",
      textSecondLine: "시달리지 마세요",
      img: `${img}/illust/onboarding-page-1.svg`,
    },
    {
      textFirstLine: "모든 팀원 정보 한눈에,",
      textSecondLine: "언제 어디서나",
      img: `${img}/illust/onboarding-page-2.svg`,
    },
    {
      textFirstLine: "전문적인 팀 관리,",
      textSecondLine: "더욱 쉽게",
      img: `${img}/illust/onboarding-page-3.svg`,
    },
    {
      textFirstLine: "더이상 번거로운 팀 관리에",
      textSecondLine: "시달리지 마세요",
      img: `${img}/illust/onboarding-page-1.svg`,
    },
  ],
  itemNumber: 1,
  translateX: -INITIONAL_TRANSLATE_X,
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay) {
      const interval = setInterval(tick, delay);
      return () => clearInterval(interval);
    }
  }, [delay]);
}

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [slides, setSlides] = useState(SLIDES);
  const [slideTransition, setSlideTransition] = useState(TRANSITION_STYLE);
  const [blockClick, setBlockClick] = useState(false);
  const [isSwiping, setIsSwiping] = useState(true);

  const replaceSlide = (translateX: number, itemNumber: number) => {
    setTimeout(() => {
      setBlockClick(true);
      setSlideTransition("");
      setSlides((prev) => ({ ...prev, translateX, itemNumber }));
    }, TRANSITION_TIME);

    setTimeout(() => {
      setBlockClick(false);
      setSlideTransition(TRANSITION_STYLE);
    }, TRANSITION_TIME + 100);
  };

  if (location.pathname !== "/onboarding/success")
    useInterval(() => handleSlide(slides.itemNumber + 1, 1), isSwiping ? 3000 : null);

  const handleSlide = (index: number, direction: 1 | -1) => {
    const addTranslate = direction * INITIONAL_TRANSLATE_X;
    if (index > SLIDES_LENGTH) {
      replaceSlide(-INITIONAL_TRANSLATE_X, 1);
    }
    if (index <= 0) {
      replaceSlide(-INITIONAL_TRANSLATE_X * SLIDES_LENGTH, SLIDES_LENGTH);
    }

    setSlides((prev) => ({
      ...prev,
      translateX: prev.translateX - addTranslate,
      itemNumber: index,
    }));
  };

  const handleSwipe = (direction: 1 | -1) => {
    handleSlide(slides.itemNumber + direction, direction);
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-logo">
        <img src={`${img}/common/hello-my-team.svg`} alt="hello-my-team-logo" />
      </div>
      {location.pathname !== "/onboarding/signup/3" && (
        <div>
          <div className="onboarding-slider-container">
            <div
              className="onboarding-slider-wrap"
              style={{
                transition: slideTransition,
                transform: `translateX(calc(${slides.translateX}%))`,
              }}
            >
              {SLIDES.items.map((el, idx) => {
                return (
                  <div className="onboarding-slide-item" key={idx}>
                    <div>
                      <h1>
                        {el.textFirstLine}
                        <br /> {el.textSecondLine}
                      </h1>
                    </div>
                    <div>
                      <img src={el.img} alt={`illust-page-${idx}`} width={IMAGE_WIDTH} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="onboarding-slide-button"
            onMouseOver={() => setIsSwiping(false)}
            onMouseOut={() => setIsSwiping(true)}
            onBlur={() => null}
            onFocus={() => null}
          >
            <button className={blockClick ? "block" : ""} onClick={() => handleSwipe(-1)}>
              <img src={`${img}/icons/arrow-left-black.svg`} alt="arrow-left" />
            </button>
            <button className={blockClick ? "block" : ""} onClick={() => handleSwipe(1)}>
              <img src={`${img}/icons/arrow-right-black.svg`} alt="arrow-right" />
            </button>
          </div>
          <ul className="onboarding-bullet">
            <li className={slides.itemNumber === 1 ? "bullet-highlit" : null} />
            <li className={slides.itemNumber === 2 ? "bullet-highlit" : null} />
            <li className={slides.itemNumber === 3 ? "bullet-highlit" : null} />
          </ul>
          <div className="onboarding-auth-button">
            <Button
              text="로그인"
              handler={() => navigate("/onboarding/login")}
              width="fullWidth"
              color="blue"
            />
            <Button
              text="회원가입"
              handler={() => navigate("/onboarding/signup")}
              width="fullWidth"
              color="white"
            />
          </div>
        </div>
      )}
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Onboarding;
