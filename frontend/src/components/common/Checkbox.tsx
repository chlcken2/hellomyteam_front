import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "styles/components/common.scss";

interface CheckBoxType {
  error?: boolean;
  id: string;
  checkBoxText?: string;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckBox = ({ error, id, checkBoxText, isChecked, setIsChecked }: CheckBoxType) => {
  const [isError, setIsError] = useState(false);
  const inputContainerClassName = isError ? "check-input error" : "check-input";

  const changeCheck = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const target = e.target as HTMLInputElement;
    setIsChecked(target.checked);
  };
  useEffect(() => {
    setIsError(error);
  }, [error]);

  return (
    <div className={inputContainerClassName}>
      <input
        id={id}
        type="checkbox"
        onClick={(e) => changeCheck(e)}
        checked={isChecked}
        readOnly
      />
      {checkBoxText ? (
        <label htmlFor={id}>{checkBoxText}</label>
      ) : (
        <label htmlFor={id}>
          <Link target="_blank" to="/shortcut">
            서비스 이용약관
          </Link>
          <span className="padding">및</span>
          <Link target="_blank" to="/shortcut">
            개인정보 처리방침
          </Link>
          에 동의합니다.
        </label>
      )}
    </div>
  );
};

export default memo(CheckBox);
