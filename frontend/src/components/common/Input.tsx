import Label from "components/common/Label";
import { LegacyRef, memo, useEffect, useState } from "react";
import "styles/components/common.scss";

interface PropsType {
  label?: string;
  isRequierd?: boolean;
  value: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  errorMessage?: string;
  type?: React.HTMLInputTypeAttribute;
  id?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  keyDownHandler?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  inputRef?: LegacyRef<HTMLInputElement>;
  readOnly?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  name?: string;
  bottomLine?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = ({
  label,
  isRequierd,
  value,
  setValue,
  errorMessage,
  type,
  id,
  onChange,
  placeholder,
  keyDownHandler,
  inputRef,
  readOnly,
  maxLength,
  min,
  max,
  children,
  name,
  bottomLine,
  leftIcon,
  rightIcon,
}: PropsType) => {
  const [isViewPassword, setIsViewPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const inputContainerClassName = isError ? "input-container error" : "input-container";
  const inputWrapperClassName = readOnly ? "input-wrapper read-only" : "input-wrapper";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      let value = "";
      if (max !== undefined && min !== undefined) {
        value =
          e.target.value === ""
            ? ""
            : Math.max(min, Math.min(max, Number(e.target.value))).toString();
      } else if (maxLength !== undefined) {
        value = e.target.value.slice(0, maxLength);
      }

      if (onChange) onChange({ ...e, target: { ...e.target, id: e.target.id, value } });
      else setValue(value);
    } else {
      if (onChange) onChange(e);
      else setValue(e.target.value);
    }
  };
  const handleIsViewPassword = () => setIsViewPassword((prev) => !prev);

  useEffect(() => {
    setIsError(errorMessage?.length > 0);
  }, [errorMessage]);

  return (
    <>
      <div className={inputContainerClassName}>
        <Label id={id} isError={isError} isRequierd={isRequierd} label={label} />
        <div className={inputWrapperClassName}>
          {leftIcon && <div className="input-left-icon">{leftIcon}</div>}
          <input
            id={id}
            readOnly={readOnly}
            type={isViewPassword ? "text" : type}
            value={value}
            maxLength={maxLength}
            ref={inputRef}
            onChange={handleChange}
            onKeyDown={keyDownHandler}
            placeholder={placeholder}
            min={min}
            max={max}
            name={name}
          />
          {rightIcon && rightIcon}
          {type === "password" && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleIsViewPassword}
            >
              <path
                d="M12.5 9.99996C12.5 10.663 12.2366 11.2989 11.7678 11.7677C11.2989 12.2366 10.663 12.5 10 12.5C9.33697 12.5 8.70108 12.2366 8.23224 11.7677C7.7634 11.2989 7.50001 10.663 7.50001 9.99996C7.50001 9.33692 7.7634 8.70103 8.23224 8.23219C8.70108 7.76335 9.33697 7.49996 10 7.49996C10.663 7.49996 11.2989 7.76335 11.7678 8.23219C12.2366 8.70103 12.5 9.33692 12.5 9.99996Z"
                stroke="#DBDBDB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.04834 9.99996C3.11001 6.61913 6.26917 4.16663 10 4.16663C13.7317 4.16663 16.89 6.61913 17.9517 9.99996C16.89 13.3808 13.7317 15.8333 10 15.8333C6.26917 15.8333 3.11001 13.3808 2.04834 9.99996Z"
                stroke="#DBDBDB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {!bottomLine && children && <div className="children-wrapper">{children}</div>}
        </div>

        {isError && <p>{errorMessage}</p>}
      </div>
      <div>{bottomLine && children && <div className="word-limit">{children}</div>}</div>
    </>
  );
};

export default memo(Input);
