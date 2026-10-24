import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
import { Utensils, Zap, Clock, AlertTriangle, Layers, CalendarCheck, LogIn, LogOut, User } from "lucide-react";

export function Navbar({
  clientType,
  onClientTypeChange,
  simulateDelay,
  onToggleSimulateDelay,
  simulateError,
  onToggleSimulateError,
  requestStats,
  onOpenBookings,
  onOpenLogin
}) {
  const dispatch = useDispatch();
  const confirmedCount = useSelector((state) => state.reservation.confirmedReservations?.length || 0);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Utensils size={24} />
          </div>
          <div>
            <div className="brand-name">GourmetReserve</div>
            <div className="brand-subtitle">
              Scenario 5 &bull; Exp 4: Authentication &amp; Protected APIs
            </div>
          </div>
        </div>

        <div className="navbar-controls">
          {/* Auth Button (Login / Logout - Req a & e) */}
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <User size={14} color="var(--primary)" /> {user?.name || "User"}
              </span>
              <button
                onClick={() => dispatch(logout())}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.4rem 0.7rem",
                  background: "#fee2e2",
                  border: "1px solid #ef4444",
                  color: "#dc2626",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
                title="Logout & remove token"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.4rem 0.75rem",
                background: "var(--primary)",
                border: "none",
                color: "white",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer"
              }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* My Bookings Button (Redux State + Storage sync) */}
          <button
            onClick={onOpenBookings}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.85rem",
              background: "var(--primary-light)",
              border: "1.5px solid var(--primary)",
              color: "var(--primary)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            <CalendarCheck size={16} />
            <span>My Bookings</span>
            <span
              style={{
                background: "var(--primary)",
                color: "white",
                borderRadius: "9999px",
                padding: "0.1rem 0.45rem",
                fontSize: "0.72rem",
                fontWeight: 800
              }}
            >
              {confirmedCount}
            </span>
          </button>

          {/* API Client Switcher (Axios vs Fetch) */}
          <div className="client-switcher" title="Toggle between Axios and native Fetch API client">
            <span className="control-label">
              <Layers size={14} /> Client:
            </span>
            <div className="segmented-toggle">
              <button
                className={`toggle-btn ${clientType === "axios" ? "active" : ""}`}
                onClick={() => onClientTypeChange("axios")}
              >
                <Zap size={14} />
                Axios
              </button>
              <button
                className={`toggle-btn ${clientType === "fetch" ? "active" : ""}`}
                onClick={() => onClientTypeChange("fetch")}
              >
                <Zap size={14} />
                Fetch
              </button>
            </div>
          </div>

          {/* Simulation Toggles */}
          <div className="simulation-controls">
            <button
              className={`sim-btn ${simulateDelay ? "active-delay" : ""}`}
              onClick={onToggleSimulateDelay}
              title="Adds 2000ms delay to REST responses to test loading state"
            >
              <Clock size={14} />
              <span>{simulateDelay ? "Delay: 2s Active" : "Simulate 2s Delay"}</span>
            </button>

            <button
              className={`sim-btn ${simulateError ? "active-error" : ""}`}
              onClick={onToggleSimulateError}
              title="Forces HTTP 500 responses to test error handling & retry"
            >
              <AlertTriangle size={14} />
              <span>{simulateError ? "Simulated Error ON" : "Simulate Error"}</span>
            </button>
          </div>

          {/* Quick stats badge */}
          {requestStats && (
            <div className="stats-badge" title="Total completed REST calls in this session">
              <span className="stats-dot"></span>
              {requestStats.count} API calls &bull; {requestStats.lastClient || clientType}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
