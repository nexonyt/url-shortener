import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #1e293b;
  background: linear-gradient(to bottom right, #f8fafc, #dbeafe);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Footer = styled.footer`
  /* background: rgba(0, 0, 0, 0.1); */
  /* color: rgba(169, 169, 169, 0.8); */
  color: black;
  opacity: 0.5;
  text-align: center;
  padding: 20px;
  margin-top: auto;
`;
