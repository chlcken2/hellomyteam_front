import MobileNavbar from "components/Navbar/MobileNavbar";
import { childrenPropType } from "types";
import MaxWidthLayout from "./maxWidth.layout";

const MobileLayout = ({ children }: childrenPropType) => {
  return (
    <>
      <MobileNavbar />
      <MaxWidthLayout>{children}</MaxWidthLayout>
    </>
  );
};

export default MobileLayout;
