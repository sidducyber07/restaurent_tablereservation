/**
 * REST API Client implementation using Axios
 * Supports Full CRUD: GET, POST, PUT, and DELETE
 */
import axios from "axios";

const api = axios.create({ baseURL: "/api", timeout: 10000 });

const wrap = async (fn, endpoint, opt = {}, body = null, method = "GET") => {
  const { params, signal, simulateError, simulateDelay } = opt;
  const token = localStorage.getItem("auth_token");
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(simulateDelay && { "x-simulate-delay": String(simulateDelay) }),
    ...(simulateError && { "x-simulate-error": "true" })
  };

  console.log(`%c[Axios API Request] ${method} ${endpoint}`, "color: #3b82f6; font-weight: bold", {
    tokenAttached: token ? `Bearer ${token.slice(0, 10)}...` : "None",
    headers,
    params,
    body
  });

  try {
    const res = body !== null
      ? await fn(endpoint, body, { headers, signal })
      : await fn(endpoint, { params, headers, signal });

    console.log(`%c[Axios API Response ${res.status}] ${endpoint}`, "color: #10b981; font-weight: bold", res.data);
    return { data: res.data, status: res.status, client: "Axios Client" };
  } catch (err) {
    if (err.response?.status === 401) {
      console.warn("%c[Token Management: 401 Unauthorized / Token Expired]", "color: #ef4444; font-weight: bold", "Removing token from storage & dispatching auth:expired");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event("auth:expired"));
    }
    console.error(`%c[Axios API Error] ${endpoint}`, "color: #ef4444; font-weight: bold", err.response?.data || err.message);
    const e = new Error(err.response?.data?.message || err.message);
    e.status = err.response?.status || 500;
    e.client = "Axios Client";
    throw e;
  }
};

export const axiosClient = {
  get: (u, o) => wrap(api.get, u, o, null, "GET"),
  post: (u, b, o) => wrap(api.post, u, o, b, "POST"),
  put: (u, b, o) => wrap(api.put, u, o, b, "PUT"),
  delete: (u, o) => wrap(api.delete, u, o, null, "DELETE")
};
