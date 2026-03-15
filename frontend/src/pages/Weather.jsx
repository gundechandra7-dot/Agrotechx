import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../context/LanguageContext";

const API = "http://127.0.0.1:8000";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, tr } = useLanguage();

  const fetchWeather = async () => {
    setError("");
    setLoading(true);
    try {
      const url = `${API}/weather${location.trim() ? `?city=${encodeURIComponent(location.trim())}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(t("weather.errorFetch"));
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || t("common.errorBackend"));
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-page">
      <div className="header">
        <h1>{t("common.appName")}</h1>
        <p>{t("common.tagline")}</p>
        <LanguageSwitcher style={{ marginTop: 8 }} />
      </div>

      <div className="content">
        <button className="back-btn" onClick={() => navigate("/")}>
          {t("common.backToMenu")}
        </button>

        <h2 className="weather-title">{t("weather.title")}</h2>
        <p className="subtitle">{t("weather.subtitle")}</p>

        <div className="search-box">
          <input
            type="text"
            placeholder={t("weather.placeholder")}
            value={location}
            onChange={(e) => { setLocation(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button className="detect-btn" onClick={fetchWeather} disabled={loading}>
            {loading ? `⏳ ${t("common.loading")}` : t("weather.getWeather")}
          </button>
        </div>

        {error && (
          <div className="result-box error" style={{ background: "#fee2e2", color: "#b91c1c" }}>
            ⚠️ {error}
          </div>
        )}
        {weather && !error && (
          <div className="result-box success">
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🌤️</div>
            <h3 style={{ margin: "0 0 4px", fontSize: "1.75rem" }}>{weather.temperature ?? weather.temp}°C</h3>
            <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{tr("weatherCondition", weather.condition)}</p>
            {weather.city && <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>📍 {weather.city}</p>}
            {weather.humidity != null && <p style={{ fontSize: "0.85rem", color: "#666", margin: "8px 0 0" }}>💧 {t("weather.humidity")}: {weather.humidity}%</p>}
          </div>
        )}

        <div className="advice-box">{t("weather.advice")}</div>
      </div>
    </div>
  );
}