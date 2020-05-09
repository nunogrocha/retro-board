import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useTheme, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

interface Policy {
  name: string;
  url: string;
}

const policies: Policy[] = [
  { name: 'Privacy', url: '/privacy' },
  { name: 'T&Cs', url: '/terms' },
  { name: 'Disclaimer', url: '/disclaimer' },
  { name: 'Cookies', url: '/cookies' },
  { name: 'Acceptable Use', url: '/acceptable-use' },
];

const Footer = () => {
  const theme = useTheme();
  return (
    <Container background={theme.palette.primary.main}>
      {policies.map((policy) => (
        <Fragment key={policy.name}>
          <Link component={RouterLink} to={policy.url} color="inherit">
            {policy.name}
          </Link>{' '}
          |
        </Fragment>
      ))}
    </Container>
  );
};

const Container = styled.div<{ background: string }>`
  height: 25px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: ${(props) => props.background};
  color: white;
  padding: 5px;
`;

export default Footer;
