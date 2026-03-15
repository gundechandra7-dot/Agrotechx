import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../context/LanguageContext";

export default function PlantDisease() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, tr } = useLanguage();

  const detectDisease = async () => {
    if (!file) {
      setError(t("disease.selectFirst"));
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://127.0.0.1:8000/detect-disease", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(t("disease.errorFetch"));
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

        <h2 className="title">{t("disease.title")}</h2>
        <p className="subtitle">{t("disease.subtitle")}</p>

        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{ display: "none" }}
          />
          <label
            htmlFor="file-input"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 24px",
              borderRadius: "999px",
              background: "linear-gradient(135deg,#2f7d44,#43e97b)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(47,125,68,0.4)",
            }}
          >
            {t("disease.uploadPhoto")}
          </label>
          {file && (
            <p style={{ marginTop: 12, fontSize: "0.9rem", color: "#333" }}>
              ✅ {file.name}
            </p>
          )}
        </div>

        <button className="detect-btn" onClick={detectDisease} disabled={loading}>
          {loading ? t("disease.analyzing") : t("disease.detect")}
        </button>

        {error && (
          <div className="result-box error" style={{ background: "#fee2e2", color: "#b91c1c" }}>
            ⚠️ {error}
          </div>
        )}
        {result && (
          <div className={`result-box ${result.disease === "Healthy" ? "success" : ""}`}>
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>
              {result.disease === "Healthy" ? "🌿" : "🍂"}
            </div>
            <strong style={{ fontSize: "1.1rem" }}>{tr("diseaseName", result.disease)}</strong>
            {result.severity && result.severity !== "None" && (
              <p style={{ margin: "8px 0 0", color: "#555" }}>📊 {t("disease.severity")}: {tr("severity", result.severity)}</p>
            )}
            {result.advice && (
              <p style={{ margin: "8px 0 0", fontSize: "0.95rem", lineHeight: 1.4 }}>💡 {tr("diseaseAdvice", result.advice)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}