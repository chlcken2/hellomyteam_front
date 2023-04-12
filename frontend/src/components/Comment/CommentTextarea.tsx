import { useEffect, useRef, useState } from "react";
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
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
    // window.scrollTo({
    //   top: textareaRef.current.offsetTop - 160,
    //   behavior: "smooth",
    // });
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
      rows={1}
    />
  );
};

export default CommentTextarea;
