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
  modalTitle?: string;
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
  modalTitle,
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
  const defaultOption = useMemo(() => {
    if (!defaultValue) return null;
    return options.find((option) => option.value === defaultValue) || null;
  }, [defaultValue]);

  const selectContainerClassName = isError
    ? "select-container error"
    : "select-container";

  const selectControlClassName = isModalOpen ? "select-control active" : "select-control";

  const menuItemClassName = (optionValue: string) => {
    let isActive = false;

    if (currentValue) {
      if (currentValue.value === optionValue) isActive = true;
    } else if (defaultOption) {
      if (defaultOption.value === optionValue) isActive = true;
    }

    return `select-menu-item ${isActive ? "active" : ""}`;
  };

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
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (currentValue) onChange(currentValue);
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
            {currentValue?.label || defaultOption.label || placeholder}
          </div>
          <div className="select-indicator">
            <img src="/select/arrow.svg" alt="arrow" />
          </div>
        </div>
        {isModalOpen && (
          <div
            role="presentation"
            className="select-menu-container"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <div
              role="presentation"
              className="select-menu-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="select-menu-title">
                <span>{modalTitle || "옵션을 선택하세요."}</span>
                <button onClick={() => setIsModalOpen(false)}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 17.8794L17.8794 6M6 5.99995L17.8794 17.8793"
                      stroke="#1D1D1D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <ul className="select-menu">
                {options.map((option, idx) => (
                  <li
                    key={idx}
                    className={menuItemClassName(option.value)}
                    onClick={() => onClickSelectItem(idx)}
                    role="presentation"
                  >
                    <span>{option.label}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33301 8.66667L5.99967 11.3333L12.6663 4.66667"
                        stroke="#5E81FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {isError && <p>{errorMessage}</p>}
    </div>
  );
};

export default Select;
