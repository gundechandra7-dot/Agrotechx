import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../context/LanguageContext";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="home-container">
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LanguageSwitcher />
      </div>
      <h1 className="title">{t("home.title")}</h1>
      <p style={{ marginBottom: 8, opacity: 0.95 }}>{t("home.subtitle")}</p>

      <div className="card-grid">
        <div className="home-card" onClick={() => navigate("/ask")}>
          <div className="icon-large" aria-hidden>🎤</div>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.2rem" }}>{t("home.askCard")}</h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>{t("home.askDesc")}</p>
          <span style={{ fontSize: "0.75rem", marginTop: 8, display: "block" }}>💬 🎙️</span>
        </div>

        <div className="home-card" onClick={() => navigate("/disease")}>
          <div className="icon-large" aria-hidden>🌿</div>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.2rem" }}>{t("home.plantCard")}</h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>{t("home.plantDesc")}</p>
          <span style={{ fontSize: "0.75rem", marginTop: 8, display: "block" }}>📷 🔬</span>
        </div>

        <div className="home-card" onClick={() => navigate("/weather")}>
          <div className="icon-large" aria-hidden>🌤️</div>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.2rem" }}>{t("home.weatherCard")}</h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>{t("home.weatherDesc")}</p>
          <span style={{ fontSize: "0.75rem", marginTop: 8, display: "block" }}>🌡️ ☀️</span>
        </div>

        <div className="home-card" onClick={() => navigate("/grow")}>
          <div className="icon-large" aria-hidden>🌾</div>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.2rem" }}>{t("home.growCard")}</h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>{t("home.growDesc")}</p>
          <span style={{ fontSize: "0.75rem", marginTop: 8, display: "block" }}>🥬 🌱</span>
        </div>
      </div>

      <div className="bottom">
        <h2>{t("home.tip")}</h2>
      </div>
    </div>
  );
}