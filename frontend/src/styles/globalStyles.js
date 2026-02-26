import styled from 'styled-components';

export const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 70px);
`;

export const PageContainer = styled.div`
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
`;

export const PageTitle = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const PageContent = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  
`;