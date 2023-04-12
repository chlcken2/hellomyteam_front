import { useEffect, useRef } from "react";
import "styles/pages/board.scss";

interface PropsType {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isFocus?: boolean;
}

const CommentTextarea = ({ setValue, value, isFocus }: PropsType) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  };

  useEffect(() => {
    if (textareaRef?.current) {
      const textarea = textareaRef.current;
      if (isFocus) textarea.focus();
      adjustHeight();
    }
  }, [textareaRef]);

  return (
    <textarea
      className="reply-regist-textarea"
      ref={textareaRef}
      value={value}
      onChange={handleChange}
    />
  );
};

export default CommentTextarea;
