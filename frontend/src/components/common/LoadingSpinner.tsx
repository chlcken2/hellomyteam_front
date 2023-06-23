import { Ring } from "@uiball/loaders";
import color from "constants/color";

import "../../styles/components/common.scss";

interface LoadingType {
  position?: "auto";
}

const LoadingSpinner = ({ position }: LoadingType) => (
  <div className={position !== "auto" ? "loading-spinner" : null}>
    <Ring size={40} lineWeight={5} speed={2} color={color["--main-blue-100"]} />
  </div>
);

export default LoadingSpinner;
