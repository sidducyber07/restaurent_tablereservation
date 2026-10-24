import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateReservationInState } from "../store/reservationSlice.js";
import { updateReservation } from "../services/api.js";
import { X, Calendar, Clock, Users, MessageSquare, Phone, Save, AlertCircle } from "lucide-react";

export function EditReservationModal({ reservation, isOpen, onClose, clientType }) {
  const dispatch = useDispatch();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (reservation) {
      setDate(reservation.date || "");
      setTimeSlot(reservation.timeSlot || "7:00 PM");
      setPartySize(reservation.partySize || 2);
      setCustomerPhone(reservation.customerPhone || "");
      setSpecialRequests(reservation.specialRequests || "");
      setUpdateError(null);
    }
  }, [reservation]);

  if (!isOpen || !reservation) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);

    const payload = {
      date,
      timeSlot,
      partySize: parseInt(partySize, 10),
      customerPhone,
      specialRequests
    };

    try {
      // HTTP PUT /api/reservations/:id (Requirement c)
      const res = await updateReservation(reservation.id, payload, { clientType });
      const updated = res.data.data;
      console.log("%c[CRUD: UPDATE (PUT)]", "color: #f59e0b; font-weight: bold", updated);
      dispatch(updateReservationInState(updated));
      onClose();
    } catch (err) {
      setUpdateError(err.message || "Failed to update reservation via PUT request.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Modify Reservation</h3>
            <div className="modal-subtitle">
              <span>{reservation.restaurantName}</span> &bull; <span>Code: {reservation.confirmationCode}</span> &bull; <strong style={{ color: "var(--primary)" }}>PUT 200 OK</strong>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {updateError && (
              <div className="modal-alert modal-error">
                <AlertCircle size={16} />
                <span>{updateError}</span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-field">
                <label><Calendar size={13} /> Reservation Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label><Clock size={13} /> Time Slot</label>
                <select
                  className="modal-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  {["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label><Users size={13} /> Party Size</label>
                <select
                  className="modal-select"
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                    <option key={n} value={n}>{n} Guests</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label><Phone size={13} /> Contact Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                />
              </div>

              <div className="form-field full-width">
                <label><MessageSquare size={13} /> Special Requests / Dietary</label>
                <textarea
                  className="form-textarea"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={2}
                  placeholder="e.g. Anniversary table, quiet area..."
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isUpdating}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Updating (PUT)...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
