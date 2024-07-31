/* eslint-disable react/react-in-jsx-scope */
import { Link } from "react-router-dom";
import logo from "../../../../../src/assets/images/logos/bt-logo.png";
import { styled } from "@mui/material";
import { useLoginProvider } from "../../../../views/authentication/provider/LoginProvider";

const LinkStyled = styled(Link)(() => ({
  height: "110px",
  width: "180px",
  overflow: "hidden",
  display: "block",
  textAlign: "center",
}));

const Logo = () => {
  const { menuList } = useLoginProvider();
  const firstSubmenu = menuList[0]?.submenus[0]?.submenu_path;

  return (
    <LinkStyled to={firstSubmenu}>
      <img src={logo} alt="Logo" height="90" />
    </LinkStyled>
  );
};

export default Logo;
