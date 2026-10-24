import { fetchClient } from "./fetchClient.js";
import { axiosClient } from "./axiosClient.js";

let client = "axios";
export const setClientType = (t) => { client = t; };
export const getClientType = () => client;

const getClient = (opt) => (opt?.clientType || client) === "fetch" ? fetchClient : axiosClient;

// READ Operations (GET)
export const getRestaurants = (params = {}, opt = {}) => getClient(opt).get("/restaurants", { params, ...opt });
export const getRestaurantById = (id, opt = {}) => getClient(opt).get(`/restaurants/${id}`, opt);
export const getRestaurantAvailability = (id, params = {}, opt = {}) => getClient(opt).get(`/restaurants/${id}/availability`, { params, ...opt });
export const getReservations = (params = {}, opt = {}) => getClient(opt).get("/reservations", { params, ...opt });

// CREATE Operation (POST)
export const createReservation = (data, opt = {}) => getClient(opt).post("/reservations", data, opt);

// UPDATE Operation (PUT)
export const updateReservation = (id, updates, opt = {}) => getClient(opt).put(`/reservations/${id}`, updates, opt);

// DELETE Operation (DELETE)
export const deleteReservation = (id, opt = {}) => getClient(opt).delete(`/reservations/${id}`, opt);

// AUTHENTICATION (POST /api/auth/login, POST /api/auth/register)
export const loginUser = (data, opt = {}) => getClient(opt).post("/auth/login", data, opt);
export const registerUser = (data, opt = {}) => getClient(opt).post("/auth/register", data, opt);

export default {
  getRestaurants,
  getRestaurantById,
  getRestaurantAvailability,
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  loginUser,
  registerUser
};
