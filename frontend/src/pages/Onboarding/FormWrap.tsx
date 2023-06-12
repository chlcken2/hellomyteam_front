import LoadingSpinner from "components/common/LoadingSpinner";
import { Suspense } from "react";
import { Outlet } from "react-router";

const FormWrap = () => {
  return (
    <div className="join-bg">
      <div className="join-wrap">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default FormWrap;
