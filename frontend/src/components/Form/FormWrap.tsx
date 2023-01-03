import React from "react";
import styled from "styled-components";

const Joinbg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    width: 400px;
    padding: 24px;
    border-radius: 16px;
  }
`;

const FormWrap = ({ children }: React.PropsWithChildren) => {
  return (
    <Joinbg>
      <div>{children}</div>
    </Joinbg>
  );
};

export default FormWrap;
