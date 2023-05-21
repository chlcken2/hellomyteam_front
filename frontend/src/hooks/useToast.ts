import { useRecoilState } from "recoil";
import ToastState from "recoil/toastAtom";

export const useToast = () => {
  const [_, setToasts] = useRecoilState(ToastState);

  const showToast = (message: string) => {
    setToasts({ message, visible: true, type: "default" });
  };

  const showErrorTost = (message: string) => {
    setToasts({ message, visible: true, type: "error" });
  };

  return { showToast, showErrorTost };
};

export default useToast;
