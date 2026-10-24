/**
 * REST API Client implementation using standard window.fetch()
 * Supports Full CRUD: GET, POST, PUT/PATCH, and DELETE
 */
const BASE = "/api";

export const fetchClient = {
  async request(url, { method = "GET", params, body, signal, simulateError, simulateDelay } = {}) {
    const q = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== "")).toString() : "";
    const token = localStorage.getItem("auth_token");
    const headers = {
      "Accept": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...(body && { "Content-Type": "application/json" }),
      ...(simulateDelay && { "x-simulate-delay": String(simulateDelay) }),
      ...(simulateError && { "x-simulate-error": "true" })
    };

    console.log(`%c[Fetch API Request] ${method} ${url}${q}`, "color: #0284c7; font-weight: bold", {
      tokenAttached: token ? `Bearer ${token.slice(0, 10)}...` : "None",
      headers,
      body
    });

    const res = await fetch(`${BASE}${url}${q}`, {
      method,
      headers,
      signal,
      body: body ? JSON.stringify(body) : null
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.warn("%c[Token Management: 401 Unauthorized / Token Expired]", "color: #ef4444; font-weight: bold", "Removing token from storage & dispatching auth:expired");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.dispatchEvent(new Event("auth:expired"));
      }
      const err = new Error((await res.json().catch(() => ({}))).message || `HTTP Error ${res.status}`);
      err.status = res.status;
      err.client = "Fetch API";
      console.error(`%c[Fetch API Error] ${url}`, "color: #ef4444; font-weight: bold", err.message);
      throw err;
    }

    const json = await res.json();
    console.log(`%c[Fetch API Response ${res.status}] ${url}`, "color: #10b981; font-weight: bold", json);
    return { data: json, status: res.status, client: "Fetch API" };
  },

  get(url, opt) { return this.request(url, { ...opt, method: "GET" }); },
  post(url, body, opt) { return this.request(url, { ...opt, method: "POST", body }); },
  put(url, body, opt) { return this.request(url, { ...opt, method: "PUT", body }); },
  delete(url, opt) { return this.request(url, { ...opt, method: "DELETE" }); }
};
