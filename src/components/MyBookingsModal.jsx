import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setConfirmedReservations, cancelReservation } from "../store/reservationSlice.js";
import { getReservations, deleteReservation } from "../services/api.js";
import {
  X,
  Calendar,
  Clock,
  Users,
  Utensils,
  Trash2,
  Edit3,
  CalendarX,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export function MyBookingsModal({ isOpen, onClose, onOpenEdit, clientType }) {
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.reservation.confirmedReservations || []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Requirement e: Retrieve reservation history using GET
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getReservations({}, { clientType });
      const history = res.data.data || [];
      console.log("%c[CRUD: READ (GET History)]", "color: #2563eb; font-weight: bold", history);
      dispatch(setConfirmedReservations(history));
    } catch (err) {
      setError(err.message || "Failed to load reservation history from REST API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  // Requirement d: Cancel a reservation using DELETE
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteReservation(id, { clientType });
      console.log("%c[CRUD: DELETE]", "color: #dc2626; font-weight: bold", "Cancelled reservation ID:", id);
      dispatch(cancelReservation(id));
    } catch (err) {
      alert("Failed to cancel reservation via DELETE: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">My Table Reservations</h3>
            <div className="modal-subtitle">
              <span>REST CRUD: GET history &bull; PUT edit &bull; DELETE cancel</span> &bull; <strong style={{ color: "var(--primary)" }}>{clientType.toUpperCase()}</strong>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: "65vh" }}>
          {/* Error handling */}
          {error && (
            <div className="modal-alert modal-error" style={{ marginBottom: "1rem" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
              <button className="btn-alert-action" onClick={fetchHistory}>
                <RefreshCw size={13} /> Retry
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="modal-loading-state" style={{ padding: "3rem 1rem" }}>
              <div className="spinner"></div>
              <p>Fetching reservation history via GET /api/reservations ({clientType.toUpperCase()})...</p>
            </div>
          ) : reservations.length === 0 ? (
            /* Requirement f: Display appropriate empty state */
            <div className="empty-state" style={{ margin: "1rem auto", padding: "2.5rem 1rem" }}>
              <CalendarX size={44} className="empty-icon" style={{ color: "#94a3b8" }} />
              <h4 className="empty-title">No Reservations Found</h4>
              <p className="empty-text">
                No active bookings in the REST database. Reserve a table to begin!
              </p>
              <button className="btn-primary" onClick={onClose}>
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Showing <strong>{reservations.length}</strong> booking(s) &bull; GET 200 OK
                </span>
                <button
                  onClick={fetchHistory}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--primary)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontWeight: 700
                  }}
                >
                  <RefreshCw size={13} /> Refresh List
                </button>
              </div>

              {reservations.map((res) => (
                <div
                  key={res.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
                        {res.restaurantName}
                      </h4>
                      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem" }}>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                            background: "var(--primary-light)",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px"
                          }}
                        >
                          Code: {res.confirmationCode}
                        </span>
                        {res.updatedAt && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              color: "#0284c7",
                              background: "#e0f2fe",
                              padding: "0.15rem 0.45rem",
                              borderRadius: "4px"
                            }}
                          >
                            Edited (PUT)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: PUT (Modify) and DELETE (Cancel) */}
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => onOpenEdit(res)}
                        style={{
                          background: "#e0f2fe",
                          border: "none",
                          color: "#0369a1",
                          padding: "0.35rem 0.65rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}
                        title="Modify reservation details (PUT)"
                      >
                        <Edit3 size={13} /> Edit (PUT)
                      </button>

                      <button
                        onClick={() => handleDelete(res.id)}
                        disabled={deletingId === res.id}
                        style={{
                          background: "#fee2e2",
                          border: "none",
                          color: "#b91c1c",
                          padding: "0.35rem 0.65rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          opacity: deletingId === res.id ? 0.6 : 1
                        }}
                        title="Cancel reservation (DELETE)"
                      >
                        <Trash2 size={13} /> {deletingId === res.id ? "Cancelling..." : "Cancel (DELETE)"}
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                      gap: "0.5rem",
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      background: "var(--bg-subtle)",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "6px"
                    }}
                  >
                    <div><Calendar size={13} style={{ verticalAlign: -2 }} /> {res.date}</div>
                    <div><Clock size={13} style={{ verticalAlign: -2 }} /> {res.timeSlot}</div>
                    <div><Users size={13} style={{ verticalAlign: -2 }} /> {res.partySize} Guests</div>
                    <div><Utensils size={13} style={{ verticalAlign: -2 }} /> Table #{res.tableNumber} ({res.tableType || "Standard"})</div>
                  </div>

                  {res.specialRequests && (
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      &ldquo;{res.specialRequests}&rdquo;
                    </div>
                  )}

                  {res.customerName && (
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
                      Guest: <strong>{res.customerName}</strong> ({res.customerPhone || res.customerEmail || "N/A"})
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Full CRUD: <code style={{ background: "#f1f5f9", padding: "2px 4px", borderRadius: 4 }}>GET &bull; POST &bull; PUT &bull; DELETE</code>
          </div>
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
