import { useCallback, useEffect, useRef } from "react";

interface PropsType {
  onClickOutside: () => void;
}

const useOutsideClick = ({ onClickOutside }: PropsType) => {
  const ref = useRef(null);

  const handleClick: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      if (ref.current) {
        const inside = ref.current.contains(e.target);
        if (inside) return;

        onClickOutside();
      }
    },
    [onClickOutside, ref],
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  return ref;
};

export default useOutsideClick;
