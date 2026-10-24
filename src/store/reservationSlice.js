import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEY } from "./middleware.js";

const loadStoredReservations = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load reservations from localStorage:", err);
    return [];
  }
};

const initialState = {
  selectedRestaurant: null,
  draft: {
    date: new Date().toISOString().split("T")[0],
    timeSlot: "",
    guests: 2,
    selectedTable: null,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: ""
  },
  confirmedReservations: loadStoredReservations(),
  actionLogs: [],
  isLoading: false,
  error: null
};

export const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setSelectedRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    },

    updateDraft: (state, action) => {
      state.draft = { ...state.draft, ...action.payload };
    },

    resetDraft: (state) => {
      state.draft = {
        date: new Date().toISOString().split("T")[0],
        timeSlot: "",
        guests: 2,
        selectedTable: null,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        specialRequests: ""
      };
      state.error = null;
    },

    // Set full list from GET /api/reservations
    setConfirmedReservations: (state, action) => {
      state.confirmedReservations = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // POST /api/reservations
    confirmReservation: (state, action) => {
      state.confirmedReservations.unshift(action.payload);
      state.isLoading = false;
      state.error = null;
    },

    // PUT /api/reservations/:id
    updateReservationInState: (state, action) => {
      const index = state.confirmedReservations.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.confirmedReservations[index] = { ...state.confirmedReservations[index], ...action.payload };
      }
      state.isLoading = false;
    },

    // DELETE /api/reservations/:id
    cancelReservation: (state, action) => {
      state.confirmedReservations = state.confirmedReservations.filter(
        (r) => r.id !== action.payload
      );
    },

    clearAllReservations: (state) => {
      state.confirmedReservations = [];
    },

    addLogEntry: (state, action) => {
      state.actionLogs.unshift(action.payload);
      if (state.actionLogs.length > 25) {
        state.actionLogs.pop();
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const {
  setSelectedRestaurant,
  updateDraft,
  resetDraft,
  setConfirmedReservations,
  confirmReservation,
  updateReservationInState,
  cancelReservation,
  clearAllReservations,
  addLogEntry,
  setLoading,
  setError
} = reservationSlice.actions;

export default reservationSlice.reducer;
