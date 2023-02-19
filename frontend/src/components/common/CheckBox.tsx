import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "styles/commonComponents.scss";

interface CheckBoxType {
  errorMessage?: string;
  id: string;
  checkBoxText?: string;
}

const CheckBox = ({ errorMessage, id, checkBoxText }: CheckBoxType) => {
  const [isError, setIsError] = useState(false);
  const inputContainerClassName = isError ? "check-input error" : "check-input";

  const [isCheck, setIsCheck] = useState(false);

  const changeCheck = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }
  };
  useEffect(() => {
    setIsError(errorMessage?.length > 0);
  }, [errorMessage]);

  return (
    <div className={inputContainerClassName}>
      <input
        id={id}
        type="checkbox"
        onClick={(e) => changeCheck(e)}
        checked={isCheck}
        readOnly
      />
      {checkBoxText ? (
        <label htmlFor={id}>{checkBoxText}</label>
      ) : (
        <label htmlFor={id}>
          <Link target="_blank" to="/shortcut">
            서비스 이용약관
          </Link>{" "}
          및{" "}
          <Link target="_blank" to="/shortcut">
            개인정보 처리방침
          </Link>
          에 동의합니다.
        </label>
      )}
      {isError && <p className="error-msg">{errorMessage}</p>}
    </div>
  );
};

export default memo(CheckBox);
