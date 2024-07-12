/* eslint-disable react/react-in-jsx-scope */
import { Link } from 'react-router-dom';
import logo from '../../../../../src/assets/images/logos/bt-logo.png';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '110px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
  textAlign: 'center',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <img src={logo} alt="Logo" height="90" />
    </LinkStyled>
  )
};

export default Logo;
