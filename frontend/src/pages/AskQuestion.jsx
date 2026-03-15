import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../context/LanguageContext";

const API = "http://127.0.0.1:8000";

export default function AskQuestion() {
  const [result, setResult] = useState("");
  const [listening, setListening] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const askBackend = async (text) => {
    const q = (text || "").trim();
    if (!q) return;
    setError("");
    setResult("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, lang: language }),
      });
      if (!res.ok) throw new Error(t("ask.errorFetch"));
      const data = await res.json();
      setResult(data.answer ?? "");
    } catch (err) {
      setError(err.message || t("common.errorBackend"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setQuestion(text);
      askBackend(text);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    return () => { try { rec.abort(); } catch (_) {} };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError(t("ask.noSpeech"));
      return;
    }
    setError("");
    setListening(true);
    try { recognitionRef.current.start(); } catch (_) { setListening(false); }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    askBackend(question);
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

        <h2 className="title">{t("ask.title")}</h2>
        <p className="subtitle">{t("ask.subtitle")}</p>

        <form onSubmit={handleSubmit} style={{ marginBottom: 20, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
          <input
            type="text"
            placeholder={t("ask.placeholder")}
            value={question}
            onChange={(e) => { setQuestion(e.target.value); setError(""); }}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button type="submit" className="detect-btn" disabled={loading}>
              {loading ? `⏳ ${t("common.loading")}` : t("ask.submit")}
            </button>
            <button type="button" className="mic-btn" onClick={startListening} disabled={listening}>
              🎤 {listening ? t("ask.listening") : t("ask.tapToTalk")}
            </button>
          </div>
        </form>

        {error && (
          <div className="result-box error" style={{ background: "#fee2e2", color: "#b91c1c" }}>
            ⚠️ {error}
          </div>
        )}
        {result && (
          <div className="result-box success">
            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>💬</div>
            <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}