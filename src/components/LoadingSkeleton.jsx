import React from "react";
export function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="restaurant-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="restaurant-card skeleton-card">
          <div className="skeleton skeleton-img" /><div className="card-content"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-desc" /><div className="skeleton-footer"><div className="skeleton skeleton-badge" /><div className="skeleton skeleton-btn" /></div></div>
        </div>
      ))}
    </div>
  );
}
