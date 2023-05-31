import { Suspense } from "react";
import { Outlet } from "react-router";

const FormWrap = () => {
  return (
    <div className="join-bg">
      <div className="join-wrap">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default FormWrap;
