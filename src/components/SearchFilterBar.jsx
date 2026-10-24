import React from "react";
import { Search, X } from "lucide-react";
import { CUISINES_LIST, LOCATIONS_LIST } from "../data/mockRestaurants.js";
export function SearchFilterBar({ filters, onFilterChange, onResetFilters, totalResults }) {
  return (
    <section className="search-filter-section"><div className="search-filter-card">
      <div className="search-input-wrapper"><Search size={18} className="search-icon" /><input className="search-input" placeholder="Search restaurants by name, cuisine, area..." value={filters.search} onChange={e => onFilterChange("search", e.target.value)} />{filters.search && <button className="search-clear-btn" onClick={() => onFilterChange("search", "")}><X size={14} /></button>}</div>
      <div className="filters-grid"><select className="filter-select" value={filters.cuisine} onChange={e => onFilterChange("cuisine", e.target.value)}>{CUISINES_LIST.map(c => <option key={c}>{c}</option>)}</select><select className="filter-select" value={filters.location} onChange={e => onFilterChange("location", e.target.value)}>{LOCATIONS_LIST.map(l => <option key={l}>{l}</option>)}</select></div>
      <div className="filter-footer"><span>Found <strong>{totalResults}</strong> restaurants</span><button className="btn-reset-filters" onClick={onResetFilters}><X size={12} /> Reset</button></div>
    </div></section>
  );
}
