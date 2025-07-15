import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to right, #da4453, #89216b);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const MainContent = styled.main`
  flex: 1;        
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding: 20px;
  margin-top: auto;  
`;
