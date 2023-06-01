import { Ring } from "@uiball/loaders";
import color from "constants/color";

import "../../styles/components/common.scss";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <Ring size={40} lineWeight={5} speed={2} color={color["--main-blue-100"]} />
  </div>
);

export default LoadingSpinner;
