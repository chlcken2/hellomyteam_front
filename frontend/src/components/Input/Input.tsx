import Label from "components/common/Label";
import { memo, useEffect, useState } from "react";
import "styles/components/common.scss";

interface PropsType {
  label?: string;
  isRequierd?: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMessage?: string;
  type?: React.HTMLInputTypeAttribute;
  id?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  keyDownHandler?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
}: PropsType) => {
  const [isError, setIsError] = useState(false);
  const inputContainerClassName = isError ? "input-container error" : "input-container";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setIsError(errorMessage?.length > 0);
  }, [errorMessage]);

  return (
    <div className={inputContainerClassName}>
      <Label id={id} isError={isError} isRequierd={isRequierd} label={label} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange || handleChange}
        onKeyDown={keyDownHandler}
        placeholder={placeholder}
      />
      {isError && <p>{errorMessage}</p>}
    </div>
  );
};

export default memo(Input);
