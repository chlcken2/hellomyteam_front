import { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div<IMaxWidthLayout>`
  max-width: ${(props) => props.maxWidth || "1300px"};
  padding: ${(props) => props.padding || "0"};
  min-height: 80vh;
  width: 100%;
  /* display: flex; */
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

interface IMaxWidthLayout {
  children?: ReactNode;
  maxWidth?: number;
  padding?: number;
}

const MaxWidthLayout = ({ children, maxWidth, padding }: IMaxWidthLayout) => {
  return (
    <Container maxWidth={maxWidth} padding={padding}>
      {children}
    </Container>
  );
};

export default MaxWidthLayout;
