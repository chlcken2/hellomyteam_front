import { useEffect, useState } from "react";
import "styles/components/select.scss";

interface Props {
  label: string;
  isRequierd?: boolean;
  id?: string;
  errorMessage?: string;
  children: React.ReactNode;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

const Select = ({ label, isRequierd, id, errorMessage, children, onChange }: Props) => {
  const [isError, setIsError] = useState(false);
  const selectContainerClassName = isError
    ? "select-container error"
    : "select-container";

  useEffect(() => {
    setIsError(errorMessage?.length > 0);
  }, [errorMessage]);

  return (
    <div className={selectContainerClassName}>
      <div>
        {label}
        {isRequierd && "*"}
      </div>
      <select id={id} onChange={onChange}>
        {children}
      </select>
      {isError && <p>{errorMessage}</p>}
    </div>
  );
};

export default Select;
