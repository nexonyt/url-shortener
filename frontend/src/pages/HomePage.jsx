import styled, { keyframes } from "styled-components";

import { Copy, History } from "lucide-react";
import { ChevronDown, Mail, Lock } from "lucide-react";
import { copyToClipboard } from "../hooks/useClipboard.js";
import React, { useState, useEffect } from "react";

import { PageContainer, PageTitle, PageContent } from "../styles/globalStyles";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { sha512 } from "js-sha512";
import { Link2, Link } from "lucide-react";

import { generateFingerprint } from "../components/fingerprint.js";
import { toast } from "react-toastify";
import { simpleEncrypt } from "../utils/simpleCrypto";


export const HeroHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

export const HeroIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #2563eb; 
  color: white;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
`;

export const HeroTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #0f172a; /* text-slate-900 */
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

export const HeroText = styled.p`
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
// Styled components dla formularza
export const FormContainer = styled.form`
  max-width: 600px;
  margin: 30px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const LinkHistorySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
`;

export const LinkHistoryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b; /* slate-800 */
  margin-bottom: 1rem;
`;

export const EmptyHistoryCard = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  /* width: 600px; */
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0; /* slate-200 */
`;

export const HistoryIcon = styled(History)`
  width: 2.5rem;
  height: 2.5rem;
  color: #cbd5e1; /* slate-300 */
  margin: 0 auto 0.5rem;
`;

export const EmptyText = styled.p`
  color: #64748b; /* slate-500 */
`;

export const HistoryItem = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  width: 100%; /* Zmiana */
  max-width: 600px; /* Zmiana */
  margin: 8px auto;
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem; 
  }
`;

export const HistoryInfo = styled.div`
  text-align: left;
  min-width: 0; 
  flex: 1;     
  margin-bottom: 1rem; 

  @media (min-width: 640px) {
    margin-bottom: 0;
  }
`;

export const ShortLinkHistory = styled.p`
  font-weight: 600;
  color: #2563eb; 
`;

export const OriginalLink = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
`;

export const CopyButton = styled.button`
  width: 100%;
  height: 2.5rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #f1f5f9; 
  color: #334155;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

export const Input = styled.input`
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

export const InputAlias = styled.input`
  width: 75%;
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

export const InputAliasText = styled.p`
  font-size: 16px;
  width: 25%;
  color: #000000;
  margin: 8px 0;
  font-weight: 500;
  display: inline-block;
`;

export const HelpText = styled.small`
  display: block;
  margin-top: 6px;
  color: #6c757d;
  font-size: 12px;
`;

export const CheckboxContainer = styled.div`
  margin-bottom: 16px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  font-size: 14px;
  color: #495057;
  transition: color 0.2s ease;

  &:hover {
    color: #007bff;
  }
`;

// export const Checkbox = styled.input`
//   width: 18px;
//   height: 18px;
//   margin-right: 12px;
//   cursor: pointer;
//   accent-color: #007bff;
// `;

// Styled components dla pola email
export const EmailInputContainer = styled.div`
  max-height: ${(props) => (props.isVisible ? "100px" : "0")};
  overflow: hidden;
  transition: all 0.4s ease;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transform: translateY(${(props) => (props.isVisible ? "0" : "-10px")});
  margin-top: ${(props) => (props.isVisible ? "12px" : "0")};
  margin-left: 30px;
`;

export const EmailInput = styled(Input)`
  border-color: #17a2b8;
  background: #f0f9ff;

  &:focus {
    border-color: #17a2b8;
    box-shadow: 0 0 0 3px rgba(23, 162, 184, 0.1);
  }
`;

export const EmailLabel = styled(Label)`
  color: #17a2b8;
  font-size: 13px;
  margin-bottom: 6px;
`;

export const EmailHelpText = styled(HelpText)`
  color: #17a2b8;
  font-size: 11px;
`;

// Styled components dla pola hasła
export const PasswordInputContainer = styled.div`
  max-height: ${(props) => (props.isVisible ? "100px" : "0")};
  overflow: hidden;
  transition: all 0.4s ease;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transform: translateY(${(props) => (props.isVisible ? "0" : "-10px")});
  margin-top: ${(props) => (props.isVisible ? "12px" : "0")};
  margin-left: 30px;
`;

export const PasswordInput = styled(Input)`
  border-color: #17a2b8;
  background: #f0f9ff;

  &:focus {
    border-color: #17a2b8;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
  }
`;

export const PasswordLabel = styled(Label)`
  color: #17a2b8;
  font-size: 13px;
  margin-bottom: 6px;
`;

export const PasswordHelpText = styled(HelpText)`
  color: #17a2b8;
  font-size: 11px;
`;

export const UrlWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

export const UrlIcon = styled(Link)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

export const UrlInput = styled.input`
  width: 100%;
  height: 3.5rem;
  padding-left: 3rem;
  padding-right: 1rem;
  font-size: 1rem;
  background-color: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
`;

export const Row = styled.div`
display: flex; 
gap: 10px;
`
export const FormRow = styled.div`
  display: flex; 
  flex-direction: row;
  gap: 10px;

 @media (max-width: 500px) {
    flex-direction: column;
  }
`

export const AdvancedOptions = styled.div`
  width: 100%;
  margin-top: 10px;
`;

export const SubmitButton = styled.button`
  height: 3.5rem; 
  width: 10%;
  min-width: 100px;

  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;

  border: none;
  border-radius: 0.75rem;
  cursor: pointer;

  font-size: 1rem;
  font-weight: 600;

  transition: all 0.3s ease;

 @media (max-width: 500px) {
    height: 3rem;
    width: 100%;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Styled components dla wyników
export const ResultContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 25px;
  background-color: #F0FDF4;
  border: 1px solid #28a745;
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

export const ResultTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #28a745;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;

`;

export const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
`;

export const ResultText = styled.span`
  padding: 12px;
  background: white;
  border: 1px solid;
  border-radius: 8px;
  border-color: #b4b4b4;
  color: black;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
   font-size: 1rem;      
  line-height: 1.5rem;   
  width: 75%;
`;

export const ResultValue = styled.span`
  /* color: #6c757d; */
  word-break: break-all;
`;

export const ShortLinkCopy = styled.a`
  width: 25%;
  height: 3rem;                 /* h-12 = 48px */
  padding-left: 1.25rem;        /* px-5 */
  padding-right: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;                  /* gap-2 */

  background-color: #1e293b;    /* slate-800 */
  color: #ffffff;

  font-weight: 500;             /* font-medium */
  border-radius: 0.5rem;        /* rounded-lg */

  border: none;
  cursor: pointer;

  transition: background-color 150ms ease,
              box-shadow 150ms ease;
              &:hover {
                  background-color: #0f172a;

              }
              &:focus {
                outline:none;
              }
              &:focus-visible {
                  box-shadow:
    0 0 0 2px #1e293b,           /* ring-2 ring-slate-800 */
    0 0 0 4px #ffffff;   
              }
`;

export const PasswordAlert = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  color: #856404;
  font-size: 14px;
`;

export const StatsInfo = styled.div`
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  color: #0c5460;
  font-size: 14px;
`;

// export const IntroText = styled.p`
//   text-align: center;
//   font-size: 18px;
//   color: #d1d1d1ff;
//   margin-bottom: 10px;
//   line-height: 1.6;
// `;

// export const SubtitleText = styled.p`
//   text-align: center;
//   font-size: 14px;
//   color: #adb5bd;
//   margin-bottom: 0;
// `;

export const InputRow = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  gap: 10px;
  flex-direction: row;
`;
//Tłumaczenia

//ADVANCED 
export const AdvancedWrapper = styled.div`
  margin-top: 1rem;
`;

export const AdvancedToggle = styled.button`
  background: none;
  border: none;
  padding: 0;

  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;

  cursor: pointer;

  &:hover {
    color: #1e40af;
  }
`;

export const ChevronIcon = styled(ChevronDown)`
  transition: transform 0.3s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
`;

export const AdvancedDescription = styled.p`
  margin-top: 4px;
  font-size: 0.75rem;
  color: #64748b;        
  text-align: left;     
  width: 100%;           
  max-width: 600px;      
  line-height: 1.5;     
`;

export const AdvancedContent = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  animation: ${fadeIn} 0.3s ease-out;
`;

export const OptionBlock = styled.div`
display: flex;
justify-content: left;
flex-direction: column;
align-items: left;
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 0.875rem;
  color: #334155;

  cursor: pointer;
  user-select: none;
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;

  border-radius: 4px;
  border: 1px solid #cbd5f5;
  accent-color: #2563eb;
`;

export const OptionHint = styled.p`
margin-top: 2px;       
  margin-left: 28px;  
  font-size: 0.75rem;
  color: #64748b;
  text-align: left;       
  line-height: 1.4;       
  display: block;         
`;

export const InputWrapper = styled.div`
  margin-top: 0.7rem;
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

// Komponent formularza do skracania linków
const UrlShortenerForm = ({ onSubmit }) => {
  
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [collectStats, setCollectStats] = useState(false);
  const [email, setEmail] = useState("");
  const [isAdvancedVisible, setAdvancedVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    onSubmit({
      url: url.trim(),
      alias: alias.trim(),
      needsPassword,
      password: needsPassword ? password.trim() : "",
      collectStats,
      email: collectStats ? email.trim() : "MarcinKaczmarekTest",
    });
  };

  return (
    // <FormContainer onSubmit={handleSubmit}>
    //   <InputGroup>
    //     <Label htmlFor="url">{t("url_form_long_link")}</Label>
    //     <Input
    //       id="url"
    //       type="url"
    //       value={url}
    //       onChange={(e) => setUrl(e.target.value)}
    //       placeholder={t("url_form_input_link_placeholder")}
    //       required
    //     />
    //   </InputGroup>

    //   <InputGroup>
    //     <Label htmlFor="alias">Alias (opcjonalnie):</Label>
    //     <InputAliasText>urlpretty.pl/</InputAliasText>
    //     <InputAlias
    //       id="alias"
    //       type="text"
    //       value={alias}
    //       onChange={(e) => setAlias(e.target.value)}
    //       placeholder="moj-wlasny-alias"
    //     />
    //     <HelpText>
    //       Jeśli nie podasz aliasu, zostanie wygenerowany automatycznie
    //     </HelpText>
    //   </InputGroup>

    //   <CheckboxContainer>
    //     <CheckboxLabel>
    //       <Checkbox
    //         type="checkbox"
    //         checked={needsPassword}
    //         onChange={(e) => setNeedsPassword(e.target.checked)}
    //       />
    //       Czy chcesz zabezpieczyć link hasłem?
    //     </CheckboxLabel>

    //     <PasswordInputContainer isVisible={needsPassword}>
    //       <PasswordLabel htmlFor="password">Hasło do linku:</PasswordLabel>
    //       <PasswordInput
    //         id="password"
    //         type="text"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         placeholder="Wprowadź hasło"
    //         required={needsPassword}
    //       />
    //       <PasswordHelpText>
    //         To hasło będzie wymagane do otwarcia skróconego linku podczas
    //         przekierowania
    //       </PasswordHelpText>
    //     </PasswordInputContainer>
    //   </CheckboxContainer>

    //   <CheckboxContainer>
    //     <CheckboxLabel>
    //       <Checkbox
    //         type="checkbox"
    //         checked={collectStats}
    //         onChange={(e) => setCollectStats(e.target.checked)}
    //       />
    //       Czy chcesz zbierać statystyki odwiedzin?
    //     </CheckboxLabel>

    //     <EmailInputContainer isVisible={collectStats}>
    //       <EmailLabel htmlFor="email">Adres email do raportów:</EmailLabel>
    //       <EmailInput
    //         id="email"
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         placeholder="twoj.email@example.com"
    //         required={collectStats}
    //       />
    //       <EmailHelpText>
    //         Na ten adres będziesz otrzymywać raporty ze statystykami
    //       </EmailHelpText>
    //     </EmailInputContainer>
    //   </CheckboxContainer>

    //   <SubmitButton type="submit">🔗 Skróć link</SubmitButton>
    // </FormContainer>
    <FormContainer onSubmit={handleSubmit}>
      <Row>

        <UrlWrapper>
          <UrlIcon size={20} />
          <UrlInput
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://twoj-dlugi-link.com/do-skrocenia"
            required
          />
        </UrlWrapper>

        <SubmitButton type="submit">Skróć</SubmitButton>

      </Row>

      <Row>
        <AdvancedOptions>
          <AdvancedWrapper>
            <AdvancedToggle
              type="button"
              onClick={() => setAdvancedVisible(!isAdvancedVisible)}
            >
              Ustawienia zaawansowane
              <ChevronIcon size={16} $open={isAdvancedVisible} />
            </AdvancedToggle>

            <AdvancedDescription>
              Możesz ustawić hasło czy dodać email do raportowania.
            </AdvancedDescription>

            {isAdvancedVisible && (
              <AdvancedContent>
                {/* Opcja E-mail */}
                <OptionBlock>
                  <OptionLabel>
                    <Checkbox
                      checked={collectStats}
                      onChange={(e) => setCollectStats(e.target.checked)}
                    />
                    <span>Dodaj e-mail do wysyłania raportów</span>
                  </OptionLabel>

                  <OptionHint>
                    Otrzymuj statystyki kliknięć i powiadomienia.
                  </OptionHint>

                  {collectStats && (
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
                  )}
                </OptionBlock>

                {/* Opcja Hasło */}
                <OptionBlock>
                  <OptionLabel>
                    <Checkbox
                      checked={needsPassword}
                      onChange={(e) => setNeedsPassword(e.target.checked)}
                    />
                    <span>Ustaw hasło do linku</span>
                  </OptionLabel>

                  <OptionHint>
                    Tylko osoby z hasłem będą mogły otworzyć link.
                  </OptionHint>

                  {needsPassword && (
                    <InputWrapper>
                      <InputIcon>
                        <Lock size={20} />
                      </InputIcon>
                      <AdvancedInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Wpisz hasło"
                        required
                      />
                    </InputWrapper>
                  )}
                </OptionBlock>
              </AdvancedContent>
            )}
          </AdvancedWrapper>

        </AdvancedOptions>
      </Row>
    </FormContainer>
  );
};

// Komponent do wyświetlania wyników
const UrlResult = ({ result }) => {
  if (!result) return null;

  return (
    <ResultContainer>
      <ResultTitle>Link został pomyślnie skrócony!</ResultTitle>
      <ResultItem>

        <ResultText>{result.short_link}</ResultText>
        <ShortLinkCopy
          as="button"
          onClick={() => copyToClipboard(result.short_link)}
        >
          Kopiuj
        </ShortLinkCopy>
      </ResultItem>


      {result.alias && (
        <ResultItem>
          <ResultLabel>Twój alias:</ResultLabel>
          <ResultValue>{result.alias}</ResultValue>
        </ResultItem>
      )}

      {result.needsPassword && (
        <PasswordAlert>
          <strong>🔒 Link zabezpieczony hasłem</strong>
          <br />
          <small>Hasło jest wymagane do otwarcia tego linku</small>
        </PasswordAlert>
      )}

      {result.collectStats && (
        <StatsInfo>
          <strong>📊 Statystyki włączone</strong>
          <br />
          <small>Raporty będą wysyłane na adres: {result.email}</small>
          <br />
          <small>
            Będziesz mógł śledzić liczbę kliknięć i inne dane analityczne
          </small>
        </StatsInfo>
      )}
    </ResultContainer>
  );
};
// Główny komponent HomePage

const HomePage = () => {
  const [linkHistory, setLinkHistory] = useState(() => {
    // Wczytaj z localStorage przy pierwszym renderze
    const saved = localStorage.getItem("linkHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Zapisuj historię do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem("linkHistory", JSON.stringify(linkHistory));
  }, [linkHistory]);

  // Dodaj do historii po wygenerowaniu nowego linku
  const addToHistory = (original, short) => {
    const newItem = {
      id: Date.now(),
      original,
      short,
    };

    // Maksymalnie 10 ostatnich linków
    setLinkHistory((prev) => [newItem, ...prev.slice(0, 9)]);
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUrlSubmit = async (data) => {
    setLoading(true);
    setError(null);

    const uniqueNumber = Math.floor(Math.random() * 9) + 1;

    function customUUIDv4() {
      let uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
      let arr = uuid.split("");
      const oddDigits = ["1", "3", "5", "7", "9"];
      arr[3] = oddDigits[Math.floor(Math.random() * oddDigits.length)];
      arr[6] = "9";
      return arr.join("");
    }

    function controlSum(requestId, sign, uniqueNumber) {
      const first4 = requestId.slice(0, 4);
      const last4 = sign.slice(-4);
      return `${first4}${uniqueNumber}${last4}`;
    }

    const requestId = customUUIDv4();

    try {
      const time = new Date().getTime();
      const body = { extended_link: data.url, browser: true };
      if (data.alias) body.alias = data.alias;
      if (data.needsPassword) body.password = data.password;
      if (data.collectStats) body.email = data.email;

      const fingerprint = await generateFingerprint();
      const sign = `{"time":"${time}","key":"${import.meta.env.VITE_SIG_KEY
        }","fingerprintHash":"${fingerprint.canvasHash}"}`;

      const metaDataObj = {
        fingerprint: fingerprint,
        uniqueNumber: uniqueNumber,
        "x-request-id": requestId,
      };
      body.signature = simpleEncrypt(JSON.stringify(metaDataObj));
      body.sign = sha512(sign);

      const response = await axios.post("/api/create-link", body, {
        headers: {
          "X-Time": time,
          "X-Request-Id": requestId,
          "X-Control-Sum": controlSum(
            requestId,
            body.sign,
            metaDataObj.uniqueNumber
          ),
        },
      });
      // addToHistory(data.url, response.data.short_link);
      setResult(response.data);
      const shortUrl =
        response.data.short_link ||
        response.data.shortUrl ||
        response.data.short ||
        null;
      if (shortUrl) {
        addToHistory(data.url, shortUrl);
      } else {
        console.warn("Nie znaleziono short linka w odpowiedzi:", response.data);
      }
    } catch (error) {
      console.error("Błąd podczas tworzenia linku:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageContent>
        {/* 🔹 NAGŁÓWEK */}
        <HeroHeader>
          {/* <HeroIcon>
            <Link2 size={32} />
        
        </HeroIcon> */}
          <HeroTitle>Skróć swój link</HeroTitle>
          <SubtitleText>
            Szybko, bezpiecznie i z możliwością śledzenia statystyk
          </SubtitleText>
          <HeroText>
            <IntroText>{t("home_page_subtitiles_first_line")}</IntroText>
          </HeroText>
        </HeroHeader>

        {/* 🔹 TEKST INTRO */}

        {/* 🔹 FORMULARZ */}
        <UrlShortenerForm onSubmit={handleUrlSubmit} />

        {/* 🔹 WYNIK */}
        <UrlResult result={result} />

        <LinkHistorySection>
          <LinkHistoryTitle>Historia linków</LinkHistoryTitle>
          {linkHistory.length === 0 ? (
            <EmptyHistoryCard>
              <HistoryIcon />
              <EmptyText>
                Twoje ostatnio skrócone linki pojawią się tutaj.
              </EmptyText>
            </EmptyHistoryCard>
          ) : (
            linkHistory.map((item) => (
              <HistoryItem key={item.id}>
                <HistoryInfo>
                  <ShortLinkHistory>{item.short}</ShortLinkHistory>
                  <OriginalLink title={item.original}>
                    {item.original}
                  </OriginalLink>
                </HistoryInfo>
                <CopyButton onClick={() => copyToClipboard(item.short)}>
                  <Copy size={16} />
                  <span>Kopiuj</span>
                </CopyButton>
              </HistoryItem>
            ))
          )}
        </LinkHistorySection>
      </PageContent>
    </PageContainer>
  );
};

export default HomePage;
