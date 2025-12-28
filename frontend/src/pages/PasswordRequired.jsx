import { redirect, useParams,useSearchParams } from "react-router-dom";
import { useState } from "react";
import { PageContainer, PageTitle, PageContent } from "../styles/globalStyles";
import FadeIn from "react-fade-in";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

// --- styled components ---
const FormContainer = styled.form`
  max-width: 400px;
  margin: 30px auto;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
`;

const PasswordFieldWrap = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 56px 12px 16px;
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
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #495057;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #007bff;
    background: rgba(0, 123, 255, 0.06);
  }

  &:focus {
    outline: 2px solid rgba(0, 123, 255, 0.15);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 15px;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

// --- Komponent ---
const PasswordRequiredPage = () => {
  const { uuid } = useParams();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.warning("⚠️ Podaj hasło!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/password/redirect-confirmation",
        {
          alias: uuid,
          password: password.trim(),
          timestamp: searchParams.get("timestamp"),
          token: searchParams.get("token"),
        }
      );

      const data = response.data;

      if (data.error === true) {
        toast.error(`❌ ${data.message || "Nieprawidłowe hasło."}`);
      } else {
        toast.success("✅ Hasło poprawne, przekierowanie...");
        setTimeout(() => {
          let url = data.redirectUrl;
          if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
          }
          window.location.assign(url);
        }, 500);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const message = err.response.data.message || "Wystąpił błąd";
        toast.error(`❌ ${message}`);
      } else {
  
        console.error("Błąd przy sprawdzaniu hasła:", err);
        toast.error("❌ Wystąpił błąd serwera");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeIn>
      <PageContainer>
        <PageTitle>Podaj hasło</PageTitle>
        <PageContent>
          <p>Ten link jest zabezpieczony. Podaj hasło aby przejść dalej.</p>

          <FormContainer onSubmit={handleSubmit}>
            <Label htmlFor="password">Hasło:</Label>

            <PasswordFieldWrap>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wpisz hasło..."
                required
                aria-describedby="password-help"
                aria-invalid={false}
              />

              <ToggleButton
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                title={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? "Ukryj" : "Pokaż"}
              </ToggleButton>
            </PasswordFieldWrap>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Sprawdzanie..." : "🔓 Odblokuj link"}
            </SubmitButton>
          </FormContainer>
        </PageContent>
      </PageContainer>
    </FadeIn>
  );
};

export default PasswordRequiredPage;
