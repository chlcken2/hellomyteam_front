import { useEffect, useState } from "react";

interface PropsType {
  message?: string;
  type: "default" | "error";
}

const Toast = ({ message, type }: PropsType) => {
  const [visible, setVisible] = useState(true);

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setVisible(false);
  //     }, 1000);

  //     return () => clearTimeout(timer);
  //   }, []);

  return (
    <div className={`toast ${type} ${visible ? "fade-in" : "fade-out"}`}>
      {type === "default" && (
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
      {type === "error" && (
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
      <p>가입 신청이 완료되었습니다!</p>
    </div>
  );
};

export default Toast;
