import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { RESTAURANTS_DATA } from "./src/data/mockRestaurants.js";

// In-memory reservations database for CRUD operations
let reservationsDB = [
  {
    id: "res_init_1",
    confirmationCode: "RES-742918",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    restaurantId: 1,
    restaurantName: "Bella Italia Trattoria",
    restaurantAddress: "142 Elm Street, Downtown Financial District",
    date: "2026-10-25",
    timeSlot: "7:00 PM",
    partySize: 2,
    tableNumber: 1,
    tableType: "Window View",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    customerPhone: "(555) 234-5678",
    specialRequests: "Anniversary dinner, window table preferred."
  },
  {
    id: "res_init_2",
    confirmationCode: "RES-918234",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    restaurantId: 2,
    restaurantName: "Sakura Japanese Kaiseki & Sushi",
    restaurantAddress: "580 Madison Ave, Midtown Center",
    date: "2026-10-26",
    timeSlot: "6:30 PM",
    partySize: 4,
    tableNumber: 3,
    tableType: "Tatami Room",
    customerName: "Sarah Chen",
    customerEmail: "sarah.c@example.com",
    customerPhone: "(555) 876-5432",
    specialRequests: "Celebrating a business milestone."
  }
];

function restApiPlugin() {
  return {
    name: "mock-rest-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
        const pathname = parsedUrl.pathname;

        if (!pathname.startsWith("/api/")) {
          return next();
        }

        const simulateDelay = req.headers["x-simulate-delay"] || parsedUrl.searchParams.get("delay");
        const simulateError = req.headers["x-simulate-error"] === "true" || parsedUrl.searchParams.get("error") === "true";
        const delayMs = simulateDelay ? parseInt(simulateDelay, 10) : 300;

        setTimeout(() => {
          res.setHeader("Content-Type", "application/json");

          if (simulateError) {
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              status: 500,
              message: "Simulated Server Error: Failed to process REST CRUD operation."
            }));
            return;
          }

          // 1. GET /api/restaurants (Retrieve restaurants)
          if (pathname === "/api/restaurants" && req.method === "GET") {
            const search = (parsedUrl.searchParams.get("search") || "").trim().toLowerCase();
            const cuisine = parsedUrl.searchParams.get("cuisine") || "All Cuisines";
            const location = parsedUrl.searchParams.get("location") || "All Locations";
            const minRating = parseFloat(parsedUrl.searchParams.get("minRating") || "0");
            const priceLevel = parsedUrl.searchParams.get("priceLevel");

            let filtered = [...RESTAURANTS_DATA];
            if (search) {
              filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(search) ||
                r.cuisine.toLowerCase().includes(search) ||
                r.location.toLowerCase().includes(search) ||
                r.description.toLowerCase().includes(search) ||
                r.tags.some(t => t.toLowerCase().includes(search))
              );
            }
            if (cuisine && cuisine !== "All Cuisines") {
              filtered = filtered.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
            }
            if (location && location !== "All Locations") {
              filtered = filtered.filter(r => r.location.toLowerCase() === location.toLowerCase());
            }
            if (minRating > 0) {
              filtered = filtered.filter(r => r.rating >= minRating);
            }
            if (priceLevel && priceLevel !== "all") {
              filtered = filtered.filter(r => r.priceLevel === parseInt(priceLevel, 10));
            }

            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              count: filtered.length,
              timestamp: new Date().toISOString(),
              data: filtered
            }));
            return;
          }

          // 2. GET /api/restaurants/:id/availability (Retrieve tables and time slots)
          const availabilityMatch = pathname.match(/^\/api\/restaurants\/(\d+)\/availability$/);
          if (availabilityMatch && req.method === "GET") {
            const restaurantId = parseInt(availabilityMatch[1], 10);
            const restaurant = RESTAURANTS_DATA.find(r => r.id === restaurantId);

            if (!restaurant) {
              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, status: 404, message: `Restaurant ID ${restaurantId} not found.` }));
              return;
            }

            const date = parsedUrl.searchParams.get("date") || new Date().toISOString().split("T")[0];
            const partySize = parseInt(parsedUrl.searchParams.get("partySize") || "2", 10);
            const dateSeed = date.split("-").reduce((acc, part) => acc + parseInt(part, 10), 0);

            const tablesWithDynamicStatus = restaurant.tables.map(table => {
              const tableNumeric = parseInt(table.number, 10) || 1;
              const isAvailable = (tableNumeric + dateSeed + partySize) % 5 !== 0 && table.capacity >= partySize;
              return {
                ...table,
                isAvailable,
                capacitySufficient: table.capacity >= partySize
              };
            });

            const availableSlots = restaurant.timeSlots.filter((_, idx) => (idx + dateSeed) % 4 !== 0);

            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              restaurantId,
              restaurantName: restaurant.name,
              date,
              partySize,
              tables: tablesWithDynamicStatus,
              availableSlots: availableSlots.length > 0 ? availableSlots : restaurant.timeSlots.slice(0, 3)
            }));
            return;
          }

          // POST /api/auth/login or /api/auth/register
          if ((pathname === "/api/auth/login" || pathname === "/api/auth/register") && req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", () => {
              const creds = body ? JSON.parse(body) : {};
              const token = "auth_jwt_" + Date.now();
              const user = {
                email: creds.email || "guest@example.com",
                name: creds.name || (creds.email || "User").split("@")[0]
              };
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, token, user }));
            });
            return;
          }

          // Protect /api/reservations endpoints (Require Bearer token - Req d & f)
          if (pathname.startsWith("/api/reservations")) {
            const auth = req.headers["authorization"] || "";
            if (!auth.startsWith("Bearer ") || auth.includes("expired")) {
              res.statusCode = 401;
              res.end(JSON.stringify({ success: false, status: 401, message: "Unauthorized: Invalid or expired token" }));
              return;
            }
          }

          // 3. GET /api/reservations (Retrieve reservation history)
          if (pathname === "/api/reservations" && req.method === "GET") {
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              count: reservationsDB.length,
              timestamp: new Date().toISOString(),
              data: reservationsDB
            }));
            return;
          }

          // 4. POST /api/reservations (Create a reservation)
          if (pathname === "/api/reservations" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", () => {
              try {
                const parsedBody = body ? JSON.parse(body) : {};
                const confirmationCode = "RES-" + Math.floor(100000 + Math.random() * 900000);
                const reservation = {
                  id: "res_" + Date.now(),
                  confirmationCode,
                  createdAt: new Date().toISOString(),
                  ...parsedBody
                };

                reservationsDB.unshift(reservation);

                res.statusCode = 201;
                res.end(JSON.stringify({
                  success: true,
                  message: "Reservation created successfully (POST 201 Created)",
                  data: reservation
                }));
              } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, status: 400, message: "Invalid JSON payload: " + err.message }));
              }
            });
            return;
          }

          // 5. PUT or PATCH /api/reservations/:id (Modify reservation details)
          const reservationItemMatch = pathname.match(/^\/api\/reservations\/([^/]+)$/);
          if (reservationItemMatch && (req.method === "PUT" || req.method === "PATCH")) {
            const reservationId = reservationItemMatch[1];
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", () => {
              try {
                const updates = body ? JSON.parse(body) : {};
                const index = reservationsDB.findIndex(r => r.id === reservationId);

                if (index === -1) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ success: false, status: 404, message: `Reservation ${reservationId} not found.` }));
                  return;
                }

                reservationsDB[index] = {
                  ...reservationsDB[index],
                  ...updates,
                  updatedAt: new Date().toISOString()
                };

                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  message: `Reservation ${reservationId} updated successfully (PUT 200 OK)`,
                  data: reservationsDB[index]
                }));
              } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, status: 400, message: "Invalid update payload: " + err.message }));
              }
            });
            return;
          }

          // 6. DELETE /api/reservations/:id (Cancel a reservation)
          if (reservationItemMatch && req.method === "DELETE") {
            const reservationId = reservationItemMatch[1];
            const index = reservationsDB.findIndex(r => r.id === reservationId);

            if (index === -1) {
              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, status: 404, message: `Reservation ${reservationId} not found.` }));
              return;
            }

            const removed = reservationsDB.splice(index, 1)[0];
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: `Reservation ${reservationId} cancelled successfully (DELETE 200 OK)`,
              data: removed
            }));
            return;
          }

          // Fallback 404
          res.statusCode = 404;
          res.end(JSON.stringify({ success: false, status: 404, message: `Endpoint ${pathname} not found.` }));
        }, delayMs);
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), restApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
