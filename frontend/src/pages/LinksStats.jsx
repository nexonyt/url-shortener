import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import { Mail, Link } from "lucide-react";
import { useTranslation } from "react-i18next";
import LinkStatsExtended from "./LinkStatsExtended"; 

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 40vw;
  min-width: 300px;
  margin: 30px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;
export const UrlIcon = styled(Link)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #007bff;
    background: white;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultContainer = styled.div`
  width: 90%;
  margin: 20px auto;
  padding: 25px;
  /* background: linear-gradient(135deg, #f8f9fa, #e9ecef); */
  /* border: 1px solid #28a745; */
  border-radius: 12px;
  animation: slideIn 0.4s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ResultTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #28a745;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;

  &::before {
    content: "✓";
    margin-right: 8px;
    background: #28a745;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
`;

const ResultItem = styled.div`
  margin-bottom: 15px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #007bff;
`;

const ResultLabel = styled.span`
  font-weight: 600;
  color: #495057;
  margin-right: 8px;
`;

const ResultValue = styled.span`
  color: #6c757d;
  word-break: break-all;
`;

const HeroHeader = styled.div`
  text-align: center;
  margin: 2.5rem;
    line-height: 1.6;
`;

const HeroIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #2563eb; /* bg-blue-600 */
  color: white;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
`;

const HeroTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #0f172a; /* text-slate-900 */
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroText = styled.p`
  margin-top: 0.75rem;
  color: #64748b; /* text-slate-500 */
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

export const IntroText = styled.p`
  font-size: 1.125rem;
  color: #475569; /* slate-600 */
  margin-bottom: 0.25rem;
`;

export const SubtitleText = styled.p`
  font-size: 1.25rem;
  color: #334155; /* slate-700 */
  margin-bottom: 2rem;
`;

export const InputWrapper = styled.div`
  margin-top: 8px;
  position: relative;

  animation: ${fadeIn} 0.3s ease-out;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

export const AdvancedInput = styled.input`
  width: 100%;
  height: 3rem;

  padding-left: 3rem;
  padding-right: 1rem;

  font-size: 1rem;
  background-color: #f1f5f9;

  border: 2px solid transparent;
  border-radius: 0.5rem;

  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
`;

// --- CheckLinkCustom Component ---
const LinkStats = () => {
    const { t, i18n } = useTranslation();
  const [shortLink, setShortLink] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get(
        `https://urlpretty.pl/api/get-link-custom/${shortLink}`
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
      toast.error("❌ Nie udało się pobrać danych o linku");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>  
      <HeroHeader>
        <HeroTitle>Statystyki linku</HeroTitle>
        <SubtitleText>
          Sprawdź statystyki swojego skróconego linku
        </SubtitleText>
        <HeroText>
          <IntroText>{t("home_page_subtitiles_first_line")}</IntroText>
        </HeroText>
      </HeroHeader>

      <FormContainer onSubmit={handleSubmit}>
        <InputWrapper>
          <InputIcon>
            <UrlIcon size={20} />
          </InputIcon>
          <AdvancedInput
            type="text"
            onChange={(e) => setShortLink(e.target.value)}
            placeholder="Podaj skrócony link"
            required
          />
        </InputWrapper>

        <InputWrapper>
          <InputIcon>
            <Mail size={20} />
          </InputIcon>
          <AdvancedInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.com"
            required
          />
        </InputWrapper>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Sprawdzanie..." : "Wyświetl statystyki linku"}
        </SubmitButton>
      </FormContainer>

      {result && !result.error && (
        <ResultContainer>
         <LinkStatsExtended/>
        </ResultContainer>
      )}

      {result && result.error && (
        <ResultContainer>
          <ResultTitle>❌ Wystąpił błąd</ResultTitle>
          <ResultItem>
            <ResultValue>{result.message || "Nieznany błąd"}</ResultValue>
          </ResultItem>
        </ResultContainer>
      )}
    </>
  );
};

export default LinkStats;
