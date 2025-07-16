import React, { useState } from "react";
import styled from "styled-components";
import { PageContainer, PageTitle, PageContent } from "../styles/globalStyles";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { encryptMetaData } from "../authorization/metaDataEncrypt";

// Styled components dla formularza
const FormContainer = styled.form`
  max-width: 600px;
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

const InputAlias = styled.input`
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

const InputAliasText = styled.p`
  font-size: 16px;
  width: 25%;
  color: #000000;
  margin: 8px 0;
  font-weight: 500;
  display: inline-block;
`;

const HelpText = styled.small`
  display: block;
  margin-top: 6px;
  color: #6c757d;
  font-size: 12px;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 16px;
`;

const CheckboxLabel = styled.label`
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

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: #007bff;
`;

// Styled components dla pola email
const EmailInputContainer = styled.div`
  max-height: ${(props) => (props.isVisible ? "100px" : "0")};
  overflow: hidden;
  transition: all 0.4s ease;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transform: translateY(${(props) => (props.isVisible ? "0" : "-10px")});
  margin-top: ${(props) => (props.isVisible ? "12px" : "0")};
  margin-left: 30px;
`;

const EmailInput = styled(Input)`
  border-color: #17a2b8;
  background: #f0f9ff;

  &:focus {
    border-color: #17a2b8;
    box-shadow: 0 0 0 3px rgba(23, 162, 184, 0.1);
  }
`;

const EmailLabel = styled(Label)`
  color: #17a2b8;
  font-size: 13px;
  margin-bottom: 6px;
`;

const EmailHelpText = styled(HelpText)`
  color: #17a2b8;
  font-size: 11px;
`;

// Styled components dla pola hasła
const PasswordInputContainer = styled.div`
  max-height: ${(props) => (props.isVisible ? "100px" : "0")};
  overflow: hidden;
  transition: all 0.4s ease;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transform: translateY(${(props) => (props.isVisible ? "0" : "-10px")});
  margin-top: ${(props) => (props.isVisible ? "12px" : "0")};
  margin-left: 30px;
`;

const PasswordInput = styled(Input)`
  border-color: #17a2b8;
  background: #f0f9ff;

  &:focus {
    border-color: #17a2b8;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
  }
`;

const PasswordLabel = styled(Label)`
  color: #17a2b8;
  font-size: 13px;
  margin-bottom: 6px;
`;

const PasswordHelpText = styled(HelpText)`
  color: #17a2b8;
  font-size: 11px;
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

// Styled components dla wyników
const ResultContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
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

const ShortLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  padding: 4px 8px;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 123, 255, 0.2);
    text-decoration: underline;
  }
`;

const PasswordAlert = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  color: #856404;
  font-size: 14px;
`;

const StatsInfo = styled.div`
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  color: #0c5460;
  font-size: 14px;
`;

const IntroText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #d1d1d1ff;
  margin-bottom: 10px;
  line-height: 1.6;
`;

const SubtitleText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #adb5bd;
  margin-bottom: 0;
`;

//Tłumaczenia

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    onSubmit({
      url: url.trim(),
      alias: alias.trim(),
      needsPassword,
      password: needsPassword ? password.trim() : "",
      collectStats,
      email: collectStats ? email.trim() : "",
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
        <Label htmlFor="url">{t("url_form_long_link")}</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t("url_form_input_link_placeholder")}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="alias">Alias (opcjonalnie):</Label>
        <InputAliasText>urlpretty.pl/</InputAliasText>
        <InputAlias
          id="alias"
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="moj-wlasny-alias"
        />
        <HelpText>
          Jeśli nie podasz aliasu, zostanie wygenerowany automatycznie
        </HelpText>
      </InputGroup>

      <CheckboxContainer>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={needsPassword}
            onChange={(e) => setNeedsPassword(e.target.checked)}
          />
          Czy chcesz zabezpieczyć link hasłem?
        </CheckboxLabel>

        <PasswordInputContainer isVisible={needsPassword}>
          <PasswordLabel htmlFor="password">Hasło do linku:</PasswordLabel>
          <PasswordInput
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            required={needsPassword}
          />
          <PasswordHelpText>
            To hasło będzie wymagane do otwarcia skróconego linku podczas
            przekierowania
          </PasswordHelpText>
        </PasswordInputContainer>
      </CheckboxContainer>

      <CheckboxContainer>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={collectStats}
            onChange={(e) => setCollectStats(e.target.checked)}
          />
          Czy chcesz zbierać statystyki odwiedzin?
        </CheckboxLabel>

        <EmailInputContainer isVisible={collectStats}>
          <EmailLabel htmlFor="email">Adres email do raportów:</EmailLabel>
          <EmailInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj.email@example.com"
            required={collectStats}
          />
          <EmailHelpText>
            Na ten adres będziesz otrzymywać raporty ze statystykami
          </EmailHelpText>
        </EmailInputContainer>
      </CheckboxContainer>

      <SubmitButton type="submit">🔗 Skróć link</SubmitButton>
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
        <ResultLabel>Skrócony link:</ResultLabel>
        <ShortLink
          href={result.short_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {result.short_link}
        </ShortLink>
      </ResultItem>

      <ResultItem>
        <ResultLabel>Oryginalny link:</ResultLabel>
        <ResultValue>{result.originalUrl}</ResultValue>
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

    try {

      const body = { extended_link: data.url, browser: 1};
      if (data.alias) body.alias = data.alias;
      if (data.needsPassword) body.password = data.password;
      if (data.collectStats) body.email = data.email;

      const signature = `${import.meta.env.VITE_SIG_KEY}${data.url}${data.alias}${data.needsPassword}${data.collectStats}${data.email}`;

      const metaData = `{
        needsPassword: data.needsPassword,
        collectStats: data.collectStats,
        email: data.email,
      }`
      body.metaData = encryptMetaData(metaData);
      body.signature = signature;

      const response = await axios.post("/api/create-link", body);
      setResult(response.data);
    } catch (err) {
      console.error("Błąd przy wysyłaniu danych:", err);
      setError("Wystąpił błąd podczas skracania URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>URL Shortener</PageTitle>
      <PageContent>
        <IntroText>{t("home_page_subtitiles_first_line")}</IntroText>
        <SubtitleText>
          Szybko, bezpiecznie i z możliwością śledzenia statystyk
        </SubtitleText>

        <UrlShortenerForm onSubmit={handleUrlSubmit} />

        <UrlResult result={result} />
      </PageContent>
    </PageContainer>
  );
};

export default HomePage;
