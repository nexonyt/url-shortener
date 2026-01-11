import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { generateFingerprint } from "../components/fingerprint.js";
import { simpleEncrypt } from "../utils/simpleCrypto";
import { sha512 } from "js-sha512";
// --- Styled components (analogiczne do UrlShortener) ---
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

const HeroHeader = styled.div`
  text-align: center;
  margin: 2.5rem;
  line-height: 1.6;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  color: #212529;
  margin-bottom: 0.5rem;
`;

const SubtitleText = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
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

// --- CheckLink Component ---
const CheckLink = () => {
  const { t } = useTranslation();
  const [shortLink, setShortLink] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
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

      const time = new Date().getTime();
      const fingerprint = await generateFingerprint();
      const sign = `{"time":"${time}","key":"${
        import.meta.env.VITE_SIG_KEY
      }","fingerprintHash":"${fingerprint.canvasHash}"}`;

      const metaDataObj = {
        fingerprint: fingerprint,
        uniqueNumber: uniqueNumber,
        "x-request-id": requestId,
      };
      var body = {};
      body.signature = simpleEncrypt(JSON.stringify(metaDataObj));
      body.sign = sha512(sign);

      function shortLinkCut(fullUrl) {
        const marker = "/v/";
        const index = fullUrl.indexOf(marker);
        if (index !== -1) {
          return fullUrl.slice(index + marker.length);
        }
        return "";
      }

      console.log(shortLink);
      const alias = shortLinkCut(shortLink);
      console.log(alias);
      const response = await axios.get(
        `https://urlpretty.pl/api/check-link/${alias}`,
        {
          headers: {
            "X-Time": time,
            "X-Request-Id": requestId,
            "X-Control-Sum": controlSum(
              requestId,
              body.sign,
              metaDataObj.uniqueNumber
            ),
          },
        }
      );
      setResult(response.data);
      console.log(result);
    } catch (error) {
      console.error(error);
      toast.error("❌ Nie udało się sprawdzić linku");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeroHeader>
        <HeroTitle>{t("check_link_page.hero_header_main_text")}</HeroTitle>
        <SubtitleText>{t("check_link_page.hero_header_subtitle_text")}</SubtitleText>
      </HeroHeader>
      <FormContainer onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="shortLink">Wprowadź skrócony link:</Label>
          <Input
            id="shortLinks"
            type="text"
            value={shortLink}
            onChange={(e) => setShortLink(e.target.value)}
            placeholder="np. urlpretty.pl/moj-alias"
            required
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Sprawdzanie..." : "Sprawdź link"}
        </SubmitButton>
      </FormContainer>
      {result && (
        <ResultContainer>
          <ResultTitle>Informacje o linku</ResultTitle>

          <ResultItem>
            <ResultLabel>Oryginalny link:</ResultLabel>
            <ResultValue>
              <a
                href={result.data.extended_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.data.extended_link}
              </a>
            </ResultValue>
          </ResultItem>

          {result.alias && (
            <ResultItem>
              <ResultLabel>Alias:</ResultLabel>
              <ResultValue>{result.alias}</ResultValue>
            </ResultItem>
          )}

          {result.needsPassword && (
            <ResultItem>
              <ResultLabel>🔒 Link zabezpieczony hasłem</ResultLabel>
            </ResultItem>
          )}

          {result.collectStats && result.email && (
            <ResultItem>
              <ResultLabel>📊 Raporty na email:</ResultLabel>
              <ResultValue>{result.email}</ResultValue>
            </ResultItem>
          )}
        </ResultContainer>
      )}
    </>
  );
};

export default CheckLink;
