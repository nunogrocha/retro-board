import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    touch-action: manipulation;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #eceff1;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  }

  #content {
    background-color: #eceff1;
  }

  button:focus,
  select:focus {
    outline: none;
  }
`;

export default GlobalStyle;
