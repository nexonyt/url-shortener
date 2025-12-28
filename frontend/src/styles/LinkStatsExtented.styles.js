import styled from "styled-components";

export const PageWrapper = styled.main`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 72rem; 
  margin: 0 auto;
`;


export const LinkHeaderCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => props.$active ? "#dcfce7" : "#fee2e2"};
  color: ${props => props.$active ? "#15803d" : "#b91c1c"};
`;


export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
`;

export const StatCard = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;


const variants = {
  blue: { bg: "#dbeafe", text: "#2563eb" },
  green: { bg: "#dcfce7", text: "#16a34a" },
  amber: { bg: "#fef3c7", text: "#d97706" },
  indigo: { bg: "#e0e7ff", text: "#4f46e5" }
};

export const IconBox = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => variants[props.$variant]?.bg || "#f1f5f9"};
  color: ${props => variants[props.$variant]?.text || "#64748b"};
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatLabel = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

export const StatValue = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;


export const SectionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
`;

export const LastRedirectsCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  font-size: 0.75rem;          
  line-height: 1rem;           
  color: #64748b;             
  text-transform: uppercase;   
  background-color: #f8fafc;   
  font-weight: 600;
`;

export const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9; 
  transition: background-color 0.2s ease-in-out;

  &:last-child {
    border-bottom: none; 
  }

  &:hover {
    background-color: #f8fafc;
  }
`;



export const TableCell = styled.td`
  padding: 0.75rem 1rem; 
  font-size: 0.875rem;
  color: ${props => props.$primary ? "#334155" : "#64748b"}; /* text-slate-700 : 500 */
  white-space: ${props => props.$nowrap ? "nowrap" : "normal"}; /* whitespace-nowrap */
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; 
`;

export const SubInfo = styled.div`
  font-size: 0.75rem;
  color: #64748b; 
`;

export const RefererLink = styled.a`
  color: #2563eb; 
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem; 

  &:hover {
    text-decoration: underline;
  }
`;

export const DirectText = styled.span`
  color: #64748b; 
`;

export const TableBody = styled.tbody``;