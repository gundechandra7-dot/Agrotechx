import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../context/LanguageContext";

export default function WhatToGrow() {
  const [land, setLand] = useState("");
  const [rain, setRain] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, tr } = useLanguage();

  const rainToNumber = (r) => ({ low: 0.2, moderate: 0.5, medium: 0.6, high: 1.0 }[r] ?? 0.5);

  const getRecommendation = async () => {
    if (!land || !rain) {
      setError(t("grow.selectBoth"));
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        soil: land,
        temperature: "28",
        rainfall: String(rainToNumber(rain)),
      });
      const res = await fetch(`http://127.0.0.1:8000/suggest-crop?${params}`);
      if (!res.ok) throw new Error(t("grow.errorFetch"));
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || t("common.errorBackend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="header">
        <h1>{t("common.appName")}</h1>
        <p>{t("common.tagline")}</p>
        <LanguageSwitcher style={{ marginTop: 8 }} />
      </div>

      <div className="content">
        <button className="back-btn" onClick={() => navigate("/")}>
          {t("common.backToMenu")}
        </button>

        <h2 className="title">{t("grow.title")}</h2>
        <p className="subtitle">{t("grow.subtitle")}</p>

        <div className="form-box">
          <select value={land} onChange={(e) => setLand(e.target.value)}>
            <option value="">{t("grow.soilPlaceholder")}</option>
            <option value="red">{t("grow.redSoil")}</option>
            <option value="dry">{t("grow.drySoil")}</option>
            <option value="wet">{t("grow.wetSoil")}</option>
            <option value="clay">{t("grow.claySoil")}</option>
          </select>

          <select value={rain} onChange={(e) => setRain(e.target.value)}>
            <option value="">{t("grow.rainPlaceholder")}</option>
            <option value="low">{t("grow.low")}</option>
            <option value="moderate">{t("grow.moderate")}</option>
            <option value="medium">{t("grow.medium")}</option>
            <option value="high">{t("grow.high")}</option>
          </select>

          <button
            className="recommend-btn"
            onClick={getRecommendation}
            disabled={loading}
          >
            {loading ? `⏳ ${t("common.loading")}` : t("grow.getRec")}
          </button>
        </div>

        {error && (
          <div className="result-box error" style={{ background: "#fee2e2", color: "#b91c1c" }}>
            ⚠️ {error}
          </div>
        )}
        {result && (
          <div className="result-box success">
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>🌾</div>
            <strong style={{ fontSize: "1.15rem" }}>{tr("cropName", result.crop)}</strong>
            {result.advice && (
              <p style={{ margin: "8px 0 0", fontSize: "0.95rem", lineHeight: 1.4 }}>💡 {tr("cropAdvice", result.advice)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}