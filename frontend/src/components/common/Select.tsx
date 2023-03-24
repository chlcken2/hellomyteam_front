import { useEffect, useState, useRef, useMemo } from "react";
import Label from "./Label";

/* options props 예시
  const OPTIONS = [
    { label: "라벨1", value: 1 },
    { label: "라벨2", value: 2 },
    { label: "라벨3", value: 3 },
    { label: "라벨4", value: 4 },
    { label: "라벨5", value: 5 },
    { label: "라벨5", value: 6 },
    { label: "라벨5", value: 7 },
  ];
*/

export type OptionType = {
  label: string;
  value: any;
};

interface PropsTypes {
  label?: string;
  isRequierd?: boolean;
  errorMessage?: string;
  id?: string;
  placeholder: string;
  options: OptionType[];
  onChange: (selectedOption: OptionType) => void;
  width?: number;
  defaultValue?: any;
}

const Select = ({
  label,
  isRequierd,
  errorMessage,
  placeholder,
  id,
  options,
  onChange,
  width,
  defaultValue,
}: PropsTypes) => {
  const selectRef = useRef<HTMLDivElement>(null);

  const [currentValue, setCurrentValue] = useState<OptionType>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const defaultLabel = useMemo(() => {
    if (!defaultValue) return null;
    return options.find((option) => option.value === defaultValue).label || null;
  }, [defaultValue]);

  const selectContainerClassName = isError
    ? "select-container error"
    : "select-container";

  const selectControlClassName = isModalOpen ? "select-control active" : "select-control";

  const onClickSelectControl = () => setIsModalOpen((prev) => !prev);
  const onClickSelectOutSide = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (isModalOpen && (!selectRef.current || !selectRef.current.contains(target))) {
      setIsModalOpen(false);
    }
  };
  const onClickSelectItem = (index: number) => {
    setCurrentValue(options[index]);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsError(errorMessage?.length > 0);
  }, [errorMessage]);

  useEffect(() => {
    window.addEventListener("click", onClickSelectOutSide);
    return () => {
      window.removeEventListener("click", onClickSelectOutSide);
    };
  }, []);

  useEffect(() => {
    onChange(currentValue);
  }, [currentValue]);

  return (
    <div className={selectContainerClassName} style={{ width: width || "100%" }}>
      <Label id={id} isError={isError} isRequierd={isRequierd} label={label} />
      <div ref={selectRef} className="select" role="presentation">
        <div
          className={selectControlClassName}
          onClick={onClickSelectControl}
          role="presentation"
        >
          <div className="select-value">
            {currentValue?.label || defaultLabel || placeholder}
          </div>
          <div className="select-indicator">
            <img src="/select/arrow.svg" alt="arrow" />
          </div>
        </div>
        {isModalOpen && (
          <div className="select-menu-wrapper">
            <ul className="select-menu">
              {options.map((option, idx) => (
                <li
                  key={idx}
                  className="select-menu-item"
                  onClick={() => onClickSelectItem(idx)}
                  role="presentation"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {isError && <p>{errorMessage}</p>}
    </div>
  );
};

export default Select;
