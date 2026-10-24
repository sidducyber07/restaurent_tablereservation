import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Activity, ChevronDown, ChevronUp, Terminal } from "lucide-react";

export function MiddlewareMonitor() {
  const [isOpen, setIsOpen] = useState(false);
  const actionLogs = useSelector((state) => state.reservation.actionLogs);

  return (
    <aside
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1.5rem",
        zIndex: 45,
        width: isOpen ? "380px" : "auto",
        maxWidth: "calc(100vw - 2rem)",
        background: "var(--bg-card)",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-xl)",
        overflow: "hidden",
        transition: "all 0.25s ease"
      }}
    >
      {/* Header bar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          padding: "0.65rem 1rem",
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          gap: "0.75rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity size={16} color="#f97316" />
          <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Redux Middleware Monitor</span>
          <span
            style={{
              fontSize: "0.7rem",
              background: "#ea580c",
              color: "white",
              padding: "0.1rem 0.45rem",
              borderRadius: "9999px",
              fontWeight: 800
            }}
          >
            {actionLogs.length}
          </span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {/* Expanded Logs Panel */}
      {isOpen && (
        <div style={{ padding: "0.75rem", maxHeight: "260px", overflowY: "auto", background: "#0f172a", color: "#f8fafc" }}>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Terminal size={12} />
            <span>Intercepted via <code>reservationActionMonitorMiddleware</code>:</span>
          </div>

          {actionLogs.length === 0 ? (
            <div style={{ fontSize: "0.78rem", color: "#64748b", padding: "1rem 0", textAlign: "center" }}>
              No actions dispatched yet. Try selecting a restaurant or table!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {actionLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: "#1e293b",
                    padding: "0.45rem 0.65rem",
                    borderRadius: "4px",
                    borderLeft: "3px solid #ea580c",
                    fontSize: "0.75rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                    <strong style={{ color: "#38bdf8" }}>{log.type}</strong>
                    <span style={{ color: "#94a3b8", fontSize: "0.68rem" }}>{log.time}</span>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "0.7rem", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    payload: {log.payloadSummary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
