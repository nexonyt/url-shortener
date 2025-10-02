import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

// --- Styled components (analogiczne do CheckLink) ---
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

// --- CheckLinkCustom Component ---
const LinkStats = () => {
  const [shortLink, setShortLink] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/get-link-custom/${shortLink}`
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
      <FormContainer onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="shortLink">Skrócony link:</Label>
          <Input
            id="shortLink"
            type="text"
            value={shortLink}
            onChange={(e) => setShortLink(e.target.value)}
            placeholder="np. polibuda"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">Adres email:</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="np. przyklad@wp.pl"
            required
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Sprawdzanie..." : "Sprawdź link"}
        </SubmitButton>
      </FormContainer>

      {result && !result.error && (
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

          <ResultItem>
            <ResultLabel>Alias:</ResultLabel>
            <ResultValue>{result.data.short_link}</ResultValue>
          </ResultItem>

          <ResultItem>
            <ResultLabel>Status:</ResultLabel>
            <ResultValue>{result.data.status}</ResultValue>
          </ResultItem>

          {result.data.stats && (
            <>
              <ResultItem>
                <ResultLabel>Kliknięcia całkowite:</ResultLabel>
                <ResultValue>{result.data.stats.clicks}</ResultValue>
              </ResultItem>

              <ResultItem>
                <ResultLabel>Unikalne kliknięcia:</ResultLabel>
                <ResultValue>{result.data.stats.unique_clicks}</ResultValue>
              </ResultItem>

              <ResultItem>
                <ResultLabel>Pierwsze kliknięcie:</ResultLabel>
                <ResultValue>{result.data.stats.first_click}</ResultValue>
              </ResultItem>

              <ResultItem>
                <ResultLabel>Ostatnie kliknięcie:</ResultLabel>
                <ResultValue>{result.data.stats.last_click}</ResultValue>
              </ResultItem>
            </>
          )}
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
