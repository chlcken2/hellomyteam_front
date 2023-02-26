import { useEffect, useState } from "react";
import Label from "./Label";

interface PropsTypes {
  label?: string;
  isRequierd?: boolean;
  errorMessage?: string;
  id?: string;
  placeholder?: string;
}

const OPTIONS = [
  { label: "라벨1", value: 1 },
  { label: "라벨2", value: 2 },
  { label: "라벨3", value: 3 },
  { label: "라벨4", value: 4 },
  { label: "라벨5", value: 5 },
];

const Select = ({ label, isRequierd, errorMessage, placeholder, id }: PropsTypes) => {
  const [isError, setIsError] = useState(false);
  const selectContainerClassName = isError
    ? "select-container error"
    : "select-container";

  useEffect(() => {
    setIsError(errorMessage?.length > 0);
  }, [errorMessage]);

  return (
    <div className={selectContainerClassName}>
      <Label id={id} isError={isError} isRequierd={isRequierd} label={label} />
      <div>zz</div>
      {isError && <p>{errorMessage}</p>}
    </div>
  );
};

export default Select;
