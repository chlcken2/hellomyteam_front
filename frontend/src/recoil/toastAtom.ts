import { atom } from "recoil";

interface ModalPropsType {
  message?: string;
  visible: boolean;
  type?: "default" | "error";
}

const ToastState = atom<ModalPropsType>({
  key: "ToastState",
  default: { message: null, visible: false, type: null },
});

export default ToastState;
