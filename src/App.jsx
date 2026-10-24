import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRestaurant as setStoreSelectedRestaurant } from "./store/reservationSlice.js";
import { logout } from "./store/authSlice.js";
import { Navbar } from "./components/Navbar.jsx";
import { SearchFilterBar } from "./components/SearchFilterBar.jsx";
import { RestaurantCard } from "./components/RestaurantCard.jsx";
import { LoadingSkeleton } from "./components/LoadingSkeleton.jsx";
import { ErrorMessage } from "./components/ErrorMessage.jsx";
import { ReservationModal } from "./components/ReservationModal.jsx";
import { MyBookingsModal } from "./components/MyBookingsModal.jsx";
import { EditReservationModal } from "./components/EditReservationModal.jsx";
import { LoginModal } from "./components/LoginModal.jsx";
import { MiddlewareMonitor } from "./components/MiddlewareMonitor.jsx";
import { getRestaurants } from "./services/api.js";
import { RESTAURANTS_DATA } from "./data/mockRestaurants.js";
import { Sparkles, Frown } from "lucide-react";

export function App() {
  const dispatch = useDispatch();

  // REST API Client selection ('axios' | 'fetch')
  const [clientType, setClientType] = useState("axios");

  // Simulation toggles for testing loading & error handling
  const [simulateDelay, setSimulateDelay] = useState(false);
  const [simulateError, setSimulateError] = useState(false);

  // Request counter & tracking
  const [requestStats, setRequestStats] = useState({
    count: 0,
    lastClient: "Axios Client"
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    cuisine: "All Cuisines",
    location: "All Locations",
    minRating: 0,
    priceLevel: "all"
  });

  // Restaurant data state
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth state from Redux (Req b, d)
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Modal dialog states
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Handle unauthorized / expired tokens (Req f)
  useEffect(() => {
    const handleExpired = () => {
      dispatch(logout());
      setIsLoginOpen(true);
    };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [dispatch]);

  // AbortController reference to cancel in-flight requests on rapid filter changes
  const abortControllerRef = useRef(null);

  // Fetch restaurants from REST API (GET /api/restaurants)
  const fetchRestaurantsData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await getRestaurants(
        {
          search: filters.search,
          cuisine: filters.cuisine,
          location: filters.location,
          minRating: filters.minRating > 0 ? filters.minRating : undefined,
          priceLevel: filters.priceLevel !== "all" ? filters.priceLevel : undefined
        },
        {
          signal: abortControllerRef.current.signal,
          simulateDelay: simulateDelay ? 2000 : null,
          simulateError,
          clientType
        }
      );

      const data = response.data.data || [];
      console.log("%c[CRUD: READ (GET Restaurants)]", "color: #2563eb; font-weight: bold", data);
      setRestaurants(data);
      setRequestStats((prev) => ({
        count: prev.count + 1,
        lastClient: response.client
      }));
    } catch (err) {
      if (err.isAborted || err.name === "AbortError") {
        return;
      }
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, simulateDelay, simulateError, clientType]);

  useEffect(() => {
    fetchRestaurantsData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRestaurantsData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      cuisine: "All Cuisines",
      location: "All Locations",
      minRating: 0,
      priceLevel: "all"
    });
  };

  // Open booking modal - Protected: prompts login if unauthenticated (Req d)
  const handleOpenBooking = (restaurant) => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }
    dispatch(setStoreSelectedRestaurant(restaurant));
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  const handleRequestCompleted = (client) => {
    setRequestStats((prev) => ({
      count: prev.count + 1,
      lastClient: client
    }));
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        clientType={clientType}
        onClientTypeChange={(type) => setClientType(type)}
        simulateDelay={simulateDelay}
        onToggleSimulateDelay={() => setSimulateDelay((prev) => !prev)}
        simulateError={simulateError}
        onToggleSimulateError={() => setSimulateError((prev) => !prev)}
        requestStats={requestStats}
        onOpenBookings={() => {
          if (!isAuthenticated) {
            setIsLoginOpen(true);
          } else {
            setIsBookingsOpen(true);
          }
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Scenario 5 &bull; Exp 4: Authentication &amp; Protected APIs</span>
          </div>
          <h1 className="hero-title">
            Secure Restaurant Reservation
          </h1>
          <p className="hero-subtitle">
            Token-based authentication with <strong>JWT Bearer tokens</strong>, auto-attach to requests, protected endpoints, and expired session handling.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <SearchFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={restaurants.length}
          totalAvailable={RESTAURANTS_DATA.length}
          isSearching={isLoading}
        />

        {/* Results Section */}
        <section className="results-section">
          {error && (
            <ErrorMessage
              error={error}
              onRetry={fetchRestaurantsData}
              title="Error Loading Restaurants"
            />
          )}

          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : !error && restaurants.length === 0 ? (
            <div className="empty-state">
              <Frown size={48} className="empty-icon" />
              <h3 className="empty-title">No Matching Restaurants Found</h3>
              <p className="empty-text">
                We couldn't find any restaurants matching your current search or filter combination.
              </p>
              <button className="btn-primary" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="restaurant-grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelectForBooking={handleOpenBooking}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Reservation Booking Modal (POST) */}
      <ReservationModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={handleCloseBooking}
        clientType={clientType}
        simulateDelay={simulateDelay}
        simulateError={simulateError}
        onRequestCompleted={handleRequestCompleted}
      />

      {/* My Bookings History Modal (GET & DELETE) */}
      <MyBookingsModal
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        onOpenEdit={(res) => setEditingReservation(res)}
        clientType={clientType}
      />

      {/* Modify Reservation Modal (PUT) */}
      <EditReservationModal
        reservation={editingReservation}
        isOpen={!!editingReservation}
        onClose={() => setEditingReservation(null)}
        clientType={clientType}
      />

      {/* Login Authentication Modal (Req a, b) */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        clientType={clientType}
      />

      {/* Real-time Redux Action Monitoring Middleware Panel */}
      <MiddlewareMonitor />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>Scenario 5 &bull; Experiment 4:</strong> Secure Restaurant Reservation (Authentication)
          </p>
          <p className="footer-sub">
            Demonstrates token storage, Bearer headers, protected CRUD operations, and 401 unauthorized/expired token handling.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
