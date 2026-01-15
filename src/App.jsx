import { useState } from "react";
import { summarizeWebsite } from "./api";
import "./App.css";

export default function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const handleSummarize = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const result = await summarizeWebsite(url);
      setSummary(result);
    } catch (err) {
      setError(err.message || "Failed to summarize website.");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text) => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Code block (```code```)
      if (trimmed.startsWith("```")) {
        return (
          <pre key={index}>
            <code>{trimmed.replace(/```/g, "")}</code>
          </pre>
        );
      }

      // Bullet points (* or -)
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return <li key={index}>{parseInlineMarkdown(trimmed.slice(2))}</li>;
      }

      // Numbered list
      if (/^\d+\./.test(trimmed)) {
        return <li key={index}>{parseInlineMarkdown(trimmed.replace(/^\d+\.\s*/, ""))}</li>;
      }

      // Normal paragraph
      return trimmed ? (
        <p key={index}>{parseInlineMarkdown(trimmed)}</p>
      ) : null;
    });
  };
  const parseInlineMarkdown = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, i) => {
      // Bold **text**
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }

      // Inline code `text`
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i}>{part.slice(1, -1)}</code>;
      }

      return <span key={i}>{part}</span>;
    });
  };


  return (
    <div
      key={darkMode ? "dark" : "light"}
      className={`app ${darkMode ? "dark" : "light"}`}
    >
      <div className="card">
        <div className="top-bar">
          <h1>🌐 AI Website Summarizer</h1>

          <button
            className={`theme-toggle ${darkMode ? "dark" : "light"}`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            <span className="icon">
              {darkMode ? "🌙" : "☀️"}
            </span>
          </button>
        </div>

        <p className="subtitle">
          Paste any website URL and get a clean AI-powered summary.
        </p>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className="main-btn"
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {loading && <div className="loader"></div>}

        {error && <p className="error">{error}</p>}

        {summary && (
          <div className="summary-box">
            <h3>📋 Summary</h3>
            <div className="markdown">
              {renderMarkdown(summary)}
            </div>

          </div>
        )}
      </div>

      <footer>⚡ Powered by Gemini AI</footer>
    </div>
  );
}
