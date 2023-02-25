import { memo, useEffect, useState } from "react";
import "styles/components/common.scss";

interface Props {
  label?: string;
  isRequierd?: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMessage?: string;
  type?: React.HTMLInputTypeAttribute;
  id?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
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
}: Props) => {
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
      {label && (
        <div>
          {label}
          {isRequierd && "*"}
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange || handleChange}
        placeholder={placeholder}
      />
      {isError && <p>{errorMessage}</p>}
    </div>
  );
};

export default memo(Input);
