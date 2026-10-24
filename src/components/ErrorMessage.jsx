import React from "react";
import { ServerCrash, RefreshCw } from "lucide-react";
export function ErrorMessage({ error, onRetry, title = "API Request Failed" }) {
  if (!error) return null;
  return (
    <div className="error-banner">
      <div className="error-icon-wrapper"><ServerCrash size={28} /></div>
      <div className="error-content"><h4 className="error-title">{title}</h4><p className="error-text">{error.message || "Failed to communicate with REST API."}</p>{error.status && <span className="error-badge">Status: {error.status} ({error.client})</span>}</div>
      {onRetry && <button className="btn-retry" onClick={onRetry}><RefreshCw size={14} /> Retry</button>}
    </div>
  );
}
