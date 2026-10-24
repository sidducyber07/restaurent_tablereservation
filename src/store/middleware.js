/**
 * Custom Redux Middleware:
 * 1. reservationActionMonitorMiddleware: Monitors & audits reservation actions in real-time
 * 2. storageSyncMiddleware: Synchronizes reservations state with localStorage
 */

export const STORAGE_KEY = "gourmet_reservations";

export const reservationActionMonitorMiddleware = (store) => (next) => (action) => {
  if (typeof action?.type === "string" && action.type.startsWith("reservation/")) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(
      `%c[Redux Middleware @ ${timestamp}] %c${action.type}`,
      "color: #ea580c; font-weight: bold;",
      "color: #2563eb; font-weight: 600;",
      action.payload !== undefined ? action.payload : ""
    );

    // Prevent recursive loop if action is the logger action itself
    if (action.type !== "reservation/addLogEntry") {
      setTimeout(() => {
        store.dispatch({
          type: "reservation/addLogEntry",
          payload: {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            type: action.type,
            time: timestamp,
            payloadSummary: action.payload ? JSON.stringify(action.payload).slice(0, 100) : "none"
          }
        });
      }, 0);
    }
  }

  const result = next(action);
  return result;
};

export const storageSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const syncActions = [
    "reservation/setConfirmedReservations",
    "reservation/confirmReservation",
    "reservation/updateReservationInState",
    "reservation/cancelReservation",
    "reservation/clearAllReservations"
  ];

  if (syncActions.includes(action.type)) {
    try {
      const state = store.getState();
      const reservations = state.reservation?.confirmedReservations || [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
      console.log(`%c[Storage Sync Middleware] Synchronized ${reservations.length} bookings to localStorage`, "color: #16a34a; font-weight: bold;");
    } catch (err) {
      console.error("[Storage Sync Middleware] Failed to write to localStorage:", err);
    }
  }

  return result;
};
