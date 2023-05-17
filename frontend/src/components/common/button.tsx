import { memo, useEffect, useState } from "react";
import "../../styles/components/common.scss";

type ButtonEventTypes = React.MouseEvent<HTMLButtonElement>;

interface PropsTypes {
  text: string;
  handler: (e?: ButtonEventTypes) => void;
  disabled?: boolean;
  width?: "fullWidth" | "normal";
  color?: "white" | "blue";
}

const Button = ({
  text,
  handler,
  disabled = false,
  width = "normal",
  color = "white",
}: PropsTypes) => {
  const [className, setClassName] = useState(`${width}-${color}-button`);

  useEffect(() => {
    setClassName(`${width}-${color}-button`);
  }, [color, width]);
  useEffect(() => {
    if (disabled) {
      setClassName(`disabled-${width}-blue-button`);
    } else {
      setClassName(`${width}-${color}-button`);
    }
  }, [disabled, color]);

  return (
    <button onClick={(e) => handler(e)} className={className} disabled={disabled}>
      {text}
    </button>
  );
};

export default memo(Button);
