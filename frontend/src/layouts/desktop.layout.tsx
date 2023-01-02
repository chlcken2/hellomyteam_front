import DesktopNavbar from "components/Navbar/DesktopNavbar";
import styled from "styled-components";
import { childrenPropType } from "../types";
import MaxWidthLayout from "./maxWidth.layout";

const ChildrenContainer = styled.div`
  /* display: flex; */
  justify-content: center;
  width: 100%;
  padding-left: 110px;
`;

const DesktopLayout = ({ children }: childrenPropType) => {
  return (
    <>
      <DesktopNavbar />
      <ChildrenContainer>
        <MaxWidthLayout>{children}</MaxWidthLayout>
      </ChildrenContainer>
    </>
  );
};

export default DesktopLayout;
