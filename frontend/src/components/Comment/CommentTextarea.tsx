import { useEffect, useRef, useState } from "react";
import "styles/pages/board.scss";

interface PropsType {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isFocus?: boolean;
  isComment?: boolean; // 답글이 아닌 댓글의 경우 UX처리를 하기위해 구분합니다.
}

const CommentTextarea = ({ setValue, value, isFocus, isComment }: PropsType) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    adjustHeight();

    // 답글이 아닌 댓글의 경우 화면 최하단으로 스크롤을 이동시켜 줄바꿈 시에도 어색함이 없도록 합니다.
    if (isComment) scrollToBottom();
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: textareaRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (textareaRef?.current) {
      const textarea = textareaRef.current;
      if (isFocus) textarea.focus();
      adjustHeight();
    }
  }, [textareaRef]);

  useEffect(() => {
    if (isComment && value === "") {
      const textarea = textareaRef.current;
      textarea.style.height = null;
    }
  }, [value]);

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
