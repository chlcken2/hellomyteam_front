import React from "react";

const FormWrap = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="join-bg">
      <div>{children}</div>
    </div>
  );
};

export default FormWrap;
