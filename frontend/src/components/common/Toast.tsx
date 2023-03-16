import { memo, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import ToastState from "recoil/toastAtom";

const Toast = () => {
  const [isDisplay, setIsDisplay] = useState(false);
  const [toast, setToasts] = useRecoilState(ToastState);

  useEffect(() => {
    if (toast.visible) setIsDisplay(true);

    // toast 모달의 정보, 애니메이션을 관리하는 timer
    const toastTimer = setTimeout(() => {
      if (toast.visible) setToasts({ ...toast, visible: false });
    }, 2000);
    // toast 모달을 dom에서 제거하는 timer
    const displayTimer = setTimeout(() => {
      if (isDisplay) setIsDisplay(false);
    }, 2500);

    return () => {
      clearTimeout(toastTimer);
      clearTimeout(displayTimer);
    };
  }, [toast]);

  if (!isDisplay) return null;

  return (
    <div className={`toast ${toast.type} ${toast.visible ? "fade-in" : "fade-out"}`}>
      {toast.type === "default" && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.16675 10.8333L7.50008 14.1667L15.8334 5.83334"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {toast.type === "error" && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 3C10.5523 3 11 3.44772 11 4L11 12C11 12.5523 10.5523 13 10 13C9.44771 13 9 12.5523 9 12L9 4C9 3.44772 9.44772 3 10 3Z"
            fill="white"
          />
          <circle cx="10" cy="16" r="1" fill="white" />
        </svg>
      )}
      <p>{toast.message}</p>
    </div>
  );
};

export default memo(Toast);
