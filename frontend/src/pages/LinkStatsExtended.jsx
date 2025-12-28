import {
  Activity,
  BarChart3,
  Clock,
  ShieldCheck,
  ShieldOff,
  MapPin,
  Users,
} from "lucide-react";
import { useState } from "react";
import * as S from "../styles/LinkStatsExtented.styles"; // Importujemy wszystkie style jako S

const formatDate = (date) => {
  if (date == "null" || date == undefined) return null;
  else return new Date(date).toISOString().slice(0, 19).replace("T", " ");
};

const LinkStatsExtended = () => {
  const [linkStats, setLinkStats] = useState({
    short_link: "https://short.ly/abc123",
    extended_link: "https://www.example.com/some/very/long/url",
    status: "active",
    total_clicks: 1500,
    unique_clicks: 1200,
    last_click: "2024-06-15T12:34:56Z",
    remaining_clicks: 50000,
    redirects: [
      {
        date: "2024-06-15T12:34:56Z",
        ip: "0.0.0.0",
        country: "Polska",
        browser: "Chrome",
        os: "Windows",
      },
      {
        date: "2024-06-14T11:22:33Z",
        ip: "1.1.1.1",
        country: "Niemcy",
        browser: "Firefox",
        os: "Linux",
      },
    ],
  });

  return (
    <>
      <S.PageWrapper>
        <S.ContentContainer>
          <S.LinkHeaderCard>
            <div>
              <S.StatLabel>Statystyki dla:</S.StatLabel>
              <a
                href={linkStats.short_link}
                style={{
                  fontWeight: "600",
                  color: "#2563eb",
                  textDecoration: "none",
                }}
              >
                {linkStats.short_link}
              </a>
              <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>
                {linkStats.extended_link}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <S.StatusBadge $active={linkStats.status === "active"}>
                {linkStats.status === "active" ? (
                  <>
                    <ShieldCheck size={16} /> Aktywny
                  </>
                ) : (
                  <>
                    <ShieldOff size={16} /> Nieaktywny
                  </>
                )}
              </S.StatusBadge>
            </div>
          </S.LinkHeaderCard>
          <S.StatsGrid>
            <S.StatCard>
              <S.IconBox $variant="blue">
                <BarChart3 size={24} />
              </S.IconBox>
              <S.StatInfo>
                <S.StatLabel>Wszystkie kliknięcia</S.StatLabel>
                <S.StatValue>{linkStats.total_clicks}</S.StatValue>
              </S.StatInfo>
            </S.StatCard>

            <S.StatCard>
              <S.IconBox $variant="green">
                <Users size={24} />
              </S.IconBox>
              <S.StatInfo>
                <S.StatLabel>Unikalne kliknięcia</S.StatLabel>
                <S.StatValue>{linkStats.unique_clicks}</S.StatValue>
              </S.StatInfo>
            </S.StatCard>

            <S.StatCard>
              <S.IconBox $variant="amber">
                <Clock size={24} />
              </S.IconBox>
              <S.StatInfo>
                <S.StatLabel>Ostatnie kliknięcie</S.StatLabel>
                <S.StatValue>{formatDate(linkStats.last_click)}</S.StatValue>
              </S.StatInfo>
            </S.StatCard>

            <S.StatCard>
              <S.IconBox $variant="indigo">
                <Activity size={24} />
              </S.IconBox>
              <S.StatInfo>
                <S.StatLabel>Pozostało kliknięć</S.StatLabel>
                <S.StatValue>{linkStats.remaining_clicks || "∞"}</S.StatValue>
              </S.StatInfo>
            </S.StatCard>
          </S.StatsGrid>

          <S.SectionCard>
            <h3 style={{ fontWeight: "700", marginBottom: "1rem" }}>
              Aktywność
            </h3>
            {/* Tu Twój komponent BarChart */}
          </S.SectionCard>
          <S.LastRedirectsCard>
            <h3 style={{ fontWeight: "700", marginBottom: "1rem" }}>
              Ostatnie przekierowania
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <S.TableHeader>
                <S.TableRow>
                  <S.Th>Czas</S.Th>
                  <S.Th>Lokalizacja</S.Th>
                  <S.Th>Urządzenie</S.Th>
                  <S.Th>Źródło</S.Th>
                </S.TableRow>
              </S.TableHeader>
              <S.TableBody>
                {linkStats.redirects.map((r, i) => (
                  <S.TableRow key={i}>
                    <S.TableCell $primary $nowrap>
                      {formatDate(r.date)}
                    </S.TableCell>

                    <S.TableCell>
                      <S.FlexContainer>
                        <MapPin size={14} style={{ color: "#94a3b8" }} />
                        <span style={{ color: "#1e293b", fontWeight: 500 }}>
                          {r.country}{" "}
                          {/* r.city nie ma w Twoim nowym mocku, więc użyj r.country */}
                        </span>
                      </S.FlexContainer>
                    </S.TableCell>

                    <S.TableCell>
                      <div style={{ color: "#1e293b" }}>{r.browser}</div>
                      <S.SubInfo>
                        {r.os} ({r.browser})
                      </S.SubInfo>
                    </S.TableCell>

                    <S.TableCell>
                      {r.referer ? (
                        <S.RefererLink
                          href={`https://${r.referer}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {r.referer} <ExternalLink size={12} />
                        </S.RefererLink>
                      ) : (
                        <S.DirectText>Bezpośrednie</S.DirectText>
                      )}
                    </S.TableCell>
                  </S.TableRow>
                ))}
              </S.TableBody>
            </table>
          </S.LastRedirectsCard>
        </S.ContentContainer>
      </S.PageWrapper>
    </>
  );
};

export default LinkStatsExtended;
