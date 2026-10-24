import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setAuthLoading, setAuthError } from "../store/authSlice.js";
import { loginUser, registerUser } from "../services/api.js";
import { X, Lock, Mail, User, AlertCircle, UserPlus } from "lucide-react";

export function LoginModal({ isOpen, onClose, clientType }) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [password, setPassword] = useState("password123");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setAuthLoading(true));
    try {
      const payload = isRegister ? { name, email, password } : { email, password };
      const res = isRegister
        ? await registerUser(payload, { clientType })
        : await loginUser(payload, { clientType });
      // Store token (Req b)
      dispatch(loginSuccess(res.data));
      onClose();
    } catch (err) {
      dispatch(setAuthError(err.message || (isRegister ? "Registration failed" : "Login failed")));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {isRegister ? <UserPlus size={18} color="var(--primary)" /> : <Lock size={18} color="var(--primary)" />}
            <h3 className="modal-title">{isRegister ? "Create New Account" : "Sign In"}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {error && (
            <div style={{ color: "#ef4444", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <User size={12} /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
                style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border)", marginTop: "4px" }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border)", marginTop: "4px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Lock size={12} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border)", marginTop: "4px" }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "0.3rem" }}>
            {isLoading
              ? (isRegister ? "Creating Account..." : "Signing in...")
              : (isRegister ? "Register & Sign In" : "Sign In & Get Token")}
          </button>

          <div style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem" }}>
            <button
              type="button"
              onClick={() => setIsRegister((prev) => !prev)}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
            >
              {isRegister ? "Already have an account? Sign In" : "Don't have an account? Create one"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
