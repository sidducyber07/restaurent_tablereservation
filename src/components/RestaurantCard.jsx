import React from "react";
import { Star, MapPin, CalendarDays } from "lucide-react";
export function RestaurantCard({ restaurant: r, onSelectForBooking }) {
  return (
    <article className="restaurant-card">
      <div className="card-image-container"><img src={r.image} alt={r.name} className="card-image" /><div className="card-badge-row"><span className="badge-cuisine">{r.cuisine}</span><span className="badge-price">{r.priceRange}</span></div></div>
      <div className="card-content">
        <div className="card-header-row"><h3 className="restaurant-name">{r.name}</h3><span className="rating-badge"><Star size={13} fill="#f59e0b" color="#f59e0b" /> {r.rating} ({r.reviewsCount})</span></div>
        <div className="meta-item"><MapPin size={13} /> {r.location} &bull; {r.address}</div>
        <p className="restaurant-desc">{r.description}</p>
        <div className="card-footer"><span className="tables-info">{r.tables?.length || 6} Tables</span><button className="btn-reserve" onClick={() => onSelectForBooking(r)}><CalendarDays size={14} /> Reserve Table</button></div>
      </div>
    </article>
  );
}
