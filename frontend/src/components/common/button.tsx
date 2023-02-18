import { CSSProperties, memo } from "react";
import "../../styles/components/common.scss";

interface PropsType {
  text: string;
  handler: () => void;
  style?: CSSProperties;
  disabled?: boolean;
}

const Button = ({ text, handler, style, disabled }: PropsType) => {
  return (
    <button
      onClick={() => handler()}
      className="button"
      style={style}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default memo(Button);
