import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Armchair,
  Sparkles,
  Phone,
  Mail,
  User,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check
} from "lucide-react";
import { getRestaurantAvailability, createReservation } from "../services/api.js";
import { useDispatch } from "react-redux";
import { updateDraft, confirmReservation as saveToStore } from "../store/reservationSlice.js";

export function ReservationModal({
  restaurant,
  isOpen,
  onClose,
  clientType,
  simulateDelay,
  simulateError,
  onRequestCompleted
}) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 1: Select Table & Slot, 2: Guest Details, 3: Confirmation
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [partySize, setPartySize] = useState(2);

  // Availability state
  const [tables, setTables] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  // Selection
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");

  // Guest details form
  const [guest, setGuest] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const abortControllerRef = useRef(null);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedTable(null);
      setSelectedSlot("");
      setSubmitError(null);
      setConfirmation(null);
      fetchAvailabilityData();
    } else {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [isOpen, restaurant?.id]);

  // Re-fetch availability when date or partySize changes
  useEffect(() => {
    if (isOpen && restaurant?.id) {
      setSelectedTable(null);
      fetchAvailabilityData();
    }
  }, [date, partySize]);

  async function fetchAvailabilityData() {
    if (!restaurant) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoadingAvailability(true);
    setAvailabilityError(null);

    try {
      const response = await getRestaurantAvailability(
        restaurant.id,
        { date, partySize },
        {
          signal: abortControllerRef.current.signal,
          simulateDelay: simulateDelay ? 2000 : null,
          simulateError,
          clientType
        }
      );

      if (onRequestCompleted) {
        onRequestCompleted(response.client);
      }

      const resData = response.data;
      setTables(resData.tables || []);
      setAvailableSlots(resData.availableSlots || []);

      // Auto-select first available table if appropriate
      const firstAvail = (resData.tables || []).find((t) => t.isAvailable);
      if (firstAvail) {
        setSelectedTable(firstAvail);
      }

      // Auto-select first slot
      if (resData.availableSlots && resData.availableSlots.length > 0) {
        setSelectedSlot(resData.availableSlots[0]);
      }

      dispatch(updateDraft({
        date,
        guests: partySize,
        restaurantName: restaurant.name,
        selectedTable: firstAvail || null,
        timeSlot: resData.availableSlots?.[0] || ""
      }));
    } catch (err) {
      if (err.isAborted || err.name === "AbortError") {
        return; // Normal cancellation
      }
      setAvailabilityError(err);
    } finally {
      setIsLoadingAvailability(false);
    }
  }

  function validateGuestForm() {
    const errors = {};
    if (!guest.name.trim()) errors.name = "Guest name is required.";
    if (!guest.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(guest.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!guest.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (guest.phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Please provide a valid contact number.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmitReservation(e) {
    e.preventDefault();
    if (!validateGuestForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      date,
      timeSlot: selectedSlot,
      tableId: selectedTable?.id || "T1",
      tableNumber: selectedTable?.number || 1,
      tableType: selectedTable?.type || "Standard Table",
      partySize,
      customerName: guest.name,
      customerEmail: guest.email,
      customerPhone: guest.phone,
      specialRequests: guest.specialRequests,
      apiClientUsed: clientType
    };

    try {
      const response = await createReservation(payload, {
        simulateDelay: simulateDelay ? 2000 : null,
        simulateError,
        clientType
      });

      if (onRequestCompleted) {
        onRequestCompleted(response.client);
      }

      console.log("%c[CRUD: CREATE (POST)]", "color: #16a34a; font-weight: bold", response.data.data);
      dispatch(saveToStore(response.data.data));
      setConfirmation(response.data.data);
      setStep(3); // Success step
    } catch (err) {
      setSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen || !restaurant) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Table Reservation &bull; {restaurant.name}</h2>
            <div className="modal-subtitle">
              <span>{restaurant.cuisine} Cuisine</span> &bull; <span>{restaurant.location}</span> &bull;{" "}
              <span className="client-indicator">Active API Client: {clientType.toUpperCase()}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Progress Stepper */}
        {step < 3 && (
          <div className="modal-stepper">
            <div className={`step-item ${step === 1 ? "current" : "completed"}`}>
              <span className="step-number">{step > 1 ? <Check size={14} /> : "1"}</span>
              <span className="step-label">Table &amp; Time Slot</span>
            </div>
            <div className="step-divider"></div>
            <div className={`step-item ${step === 2 ? "current" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-label">Guest Details</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="modal-body">
          {/* STEP 1: Date, Party Size, Table, Time Slot Selection */}
          {step === 1 && (
            <div className="booking-step-1">
              {/* Filter controls row */}
              <div className="booking-criteria-row">
                <div className="criteria-field">
                  <label>
                    <Calendar size={14} /> Select Date:
                  </label>
                  <input
                    type="date"
                    className="modal-input"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="criteria-field">
                  <label>
                    <Users size={14} /> Party Size:
                  </label>
                  <select
                    className="modal-select"
                    value={partySize}
                    onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error banner if fetching availability failed */}
              {availabilityError && (
                <div className="modal-alert modal-error">
                  <AlertCircle size={18} />
                  <div className="alert-text">
                    <strong>Failed to fetch real-time availability:</strong> {availabilityError.message}
                  </div>
                  <button className="btn-alert-action" onClick={fetchAvailabilityData}>
                    <RefreshCw size={14} /> Retry
                  </button>
                </div>
              )}

              {/* Loading indicator */}
              {isLoadingAvailability ? (
                <div className="modal-loading-state">
                  <div className="spinner"></div>
                  <p>Querying REST API for available tables and time slots via {clientType.toUpperCase()}...</p>
                </div>
              ) : (
                <>
                  {/* Tables Layout */}
                  <div className="section-block">
                    <div className="section-header">
                      <h4 className="section-title">
                        <Armchair size={16} /> Available Restaurant Tables
                      </h4>
                      <span className="section-meta">
                        Showing tables for {partySize} guests on {date}
                      </span>
                    </div>

                    <div className="tables-selection-grid">
                      {tables.map((table) => {
                        const isSelected = selectedTable?.id === table.id;
                        const isClickable = table.isAvailable && table.capacitySufficient;

                        return (
                          <div
                            key={table.id}
                            className={`table-card ${isSelected ? "selected" : ""} ${
                              !isClickable ? "disabled" : ""
                            }`}
                            onClick={() => isClickable && setSelectedTable(table)}
                          >
                            <div className="table-top">
                              <span className="table-number">Table #{table.number}</span>
                              <span className={`status-pill ${table.isAvailable ? "avail" : "booked"}`}>
                                {table.isAvailable ? "Available" : "Reserved"}
                              </span>
                            </div>
                            <div className="table-type">{table.type}</div>
                            <div className="table-capacity">
                              <Users size={12} /> Seats up to {table.capacity}
                            </div>
                            {isSelected && (
                              <div className="selected-tag">
                                <CheckCircle size={14} /> Selected
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="section-block">
                    <div className="section-header">
                      <h4 className="section-title">
                        <Clock size={16} /> Select Reservation Time
                      </h4>
                      <span className="section-meta">Available dining slots</span>
                    </div>

                    <div className="time-slots-container">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`slot-chip ${selectedSlot === slot ? "selected" : ""}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <Clock size={13} />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: Guest Details Form */}
          {step === 2 && (
            <form onSubmit={handleSubmitReservation} className="booking-step-2">
              <div className="summary-banner">
                <div className="summary-title">Reservation Summary</div>
                <div className="summary-grid">
                  <div>
                    <strong>Date:</strong> {date}
                  </div>
                  <div>
                    <strong>Time:</strong> {selectedSlot}
                  </div>
                  <div>
                    <strong>Party:</strong> {partySize} {partySize === 1 ? "Guest" : "Guests"}
                  </div>
                  <div>
                    <strong>Table:</strong> Table #{selectedTable?.number} ({selectedTable?.type})
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="modal-alert modal-error">
                  <AlertCircle size={18} />
                  <div className="alert-text">
                    <strong>Reservation Submission Failed:</strong> {submitError.message}
                  </div>
                </div>
              )}

              <div className="form-grid">
                <div className="form-field">
                  <label>
                    <User size={14} /> Full Name *
                  </label>
                  <input
                    type="text"
                    className={`form-input ${formErrors.name ? "has-error" : ""}`}
                    placeholder="e.g. John Doe"
                    value={guest.name}
                    onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                  />
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </div>

                <div className="form-field">
                  <label>
                    <Mail size={14} /> Email Address *
                  </label>
                  <input
                    type="email"
                    className={`form-input ${formErrors.email ? "has-error" : ""}`}
                    placeholder="e.g. john@example.com"
                    value={guest.email}
                    onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>

                <div className="form-field full-width">
                  <label>
                    <Phone size={14} /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    className={`form-input ${formErrors.phone ? "has-error" : ""}`}
                    placeholder="e.g. (555) 123-4567"
                    value={guest.phone}
                    onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                  />
                  {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                </div>

                <div className="form-field full-width">
                  <label>
                    <MessageSquare size={14} /> Dietary or Special Requests (Optional)
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Birthday celebration, vegetarian preferences, window seating request..."
                    value={guest.specialRequests}
                    onChange={(e) => setGuest({ ...guest, specialRequests: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} /> Back to Tables
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      <span>Submitting via {clientType.toUpperCase()}...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Table Booking</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Booking Confirmation Voucher */}
          {step === 3 && confirmation && (
            <div className="booking-step-3">
              <div className="confirmation-card">
                <div className="conf-icon-wrapper">
                  <CheckCircle size={48} className="conf-check-icon" />
                </div>
                <h3 className="conf-title">Reservation Confirmed!</h3>
                <p className="conf-subtitle">
                  Your table reservation has been recorded in the REST backend.
                </p>

                <div className="conf-code-badge">
                  <span>Confirmation Code:</span>
                  <strong>{confirmation.confirmationCode}</strong>
                </div>

                <div className="conf-details-box">
                  <div className="conf-row">
                    <span>Restaurant:</span>
                    <strong>{confirmation.restaurantName}</strong>
                  </div>
                  <div className="conf-row">
                    <span>Date &amp; Time:</span>
                    <strong>
                      {confirmation.date} at {confirmation.timeSlot}
                    </strong>
                  </div>
                  <div className="conf-row">
                    <span>Table Assigned:</span>
                    <strong>
                      Table #{confirmation.tableNumber} ({confirmation.tableType})
                    </strong>
                  </div>
                  <div className="conf-row">
                    <span>Party Size:</span>
                    <strong>{confirmation.partySize} Guests</strong>
                  </div>
                  <div className="conf-row">
                    <span>Guest:</span>
                    <strong>
                      {confirmation.customerName} ({confirmation.customerPhone})
                    </strong>
                  </div>
                  <div className="conf-row">
                    <span>API Transport:</span>
                    <strong className="badge-tech">{confirmation.apiClientUsed?.toUpperCase()} REST POST</strong>
                  </div>
                </div>

                <div className="conf-actions">
                  <button className="btn-primary" onClick={onClose}>
                    Done &amp; Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer for Step 1 */}
        {step === 1 && (
          <div className="modal-footer">
            <div className="selected-summary-preview">
              {selectedTable && selectedSlot ? (
                <span>
                  Table #{selectedTable.number} &bull; {selectedSlot} &bull; {partySize} Guests
                </span>
              ) : (
                <span className="hint-text">Please pick a table and time slot</span>
              )}
            </div>
            <div className="footer-btns">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={!selectedTable || !selectedSlot || isLoadingAvailability}
                onClick={() => setStep(2)}
              >
                <span>Continue to Guest Details</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
