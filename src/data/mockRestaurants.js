export const RESTAURANTS_DATA = [
  {
    id: 1,
    name: "Bella Italia Trattoria",
    cuisine: "Italian",
    location: "Downtown",
    address: "142 Elm Street, Downtown Financial District",
    phone: "(555) 234-5678",
    rating: 4.8,
    reviewsCount: 420,
    priceRange: "$$$",
    priceLevel: 3,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    description: "Authentic wood-fired Neapolitan pizzas, handcrafted pasta, and a curated Italian wine list in a warm rustic setting.",
    tags: ["Wood-fired Pizza", "Wine Bar", "Romantic", "Outdoor Patio"],
    openingHours: "12:00 PM - 10:30 PM",
    tables: [
      { id: "T1", number: 1, capacity: 2, type: "Window View", isAvailable: true },
      { id: "T2", number: 2, capacity: 2, type: "Indoor Main Dining", isAvailable: true },
      { id: "T3", number: 3, capacity: 4, type: "Cozy Booth", isAvailable: true },
      { id: "T4", number: 4, capacity: 4, type: "Indoor Main Dining", isAvailable: false },
      { id: "T5", number: 5, capacity: 6, type: "Outdoor Patio", isAvailable: true },
      { id: "T6", number: 6, capacity: 8, type: "Private Family Table", isAvailable: true }
    ],
    timeSlots: [
      "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
      "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM",
      "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
    ]
  },
  {
    id: 2,
    name: "Sakura Japanese Kaiseki & Sushi",
    cuisine: "Japanese",
    location: "Midtown",
    address: "580 Madison Ave, Midtown Center",
    phone: "(555) 345-6789",
    rating: 4.9,
    reviewsCount: 610,
    priceRange: "$$$$",
    priceLevel: 4,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    description: "Master-crafted omakase sushi and seasonal multi-course kaiseki dining flown in directly from Toyosu Market Tokyo.",
    tags: ["Omakase", "Sushi Bar", "Quiet", "Chef's Table"],
    openingHours: "5:00 PM - 11:00 PM",
    tables: [
      { id: "T1", number: 1, capacity: 2, type: "Sushi Bar Counter", isAvailable: true },
      { id: "T2", number: 2, capacity: 2, type: "Sushi Bar Counter", isAvailable: true },
      { id: "T3", number: 3, capacity: 4, type: "Tatami Room", isAvailable: true },
      { id: "T4", number: 4, capacity: 4, type: "Indoor Main Dining", isAvailable: true },
      { id: "T5", number: 5, capacity: 6, type: "Private Dining Suite", isAvailable: false }
    ],
    timeSlots: [
      "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
      "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"
    ]
  },
  {
    id: 3,
    name: "Spice Symphony Royale",
    cuisine: "Indian",
    location: "Downtown",
    address: "210 Liberty Ave, Downtown Plaza",
    phone: "(555) 456-7890",
    rating: 4.7,
    reviewsCount: 385,
    priceRange: "$$",
    priceLevel: 2,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    description: "Rich regional Indian cuisine, aromatic biryanis, clay-oven tandoor delicacies, and modern craft cocktails.",
    tags: ["Tandoor Specialties", "Vegetarian Options", "Buffet Lunch", "Family Friendly"],
    openingHours: "11:30 AM - 10:00 PM",
    tables: [
      { id: "T1", number: 101, capacity: 2, type: "Window View", isAvailable: true },
      { id: "T2", number: 102, capacity: 4, type: "Indoor Main Dining", isAvailable: true },
      { id: "T3", number: 103, capacity: 4, type: "Cozy Booth", isAvailable: true },
      { id: "T4", number: 104, capacity: 6, type: "Indoor Main Dining", isAvailable: true },
      { id: "T5", number: 105, capacity: 8, type: "Grand Banquet Table", isAvailable: true }
    ],
    timeSlots: [
      "12:00 PM", "12:45 PM", "1:30 PM", "2:15 PM",
      "6:00 PM", "6:45 PM", "7:30 PM", "8:15 PM", "9:00 PM"
    ]
  },
  {
    id: 4,
    name: "La Petite Boucherie",
    cuisine: "French",
    location: "West End",
    address: "75 Rue de Paris, West End Promenade",
    phone: "(555) 567-8901",
    rating: 4.6,
    reviewsCount: 290,
    priceRange: "$$$",
    priceLevel: 3,
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    description: "Classic Parisian bistro with steak frites, duck confit, fresh baguettes, and an exquisite French cellar selection.",
    tags: ["Bistro", "Brunch", "Romantic", "Sidewalk Cafe"],
    openingHours: "11:00 AM - 11:00 PM",
    tables: [
      { id: "T1", number: 11, capacity: 2, type: "Sidewalk Cafe", isAvailable: true },
      { id: "T2", number: 12, capacity: 2, type: "Window View", isAvailable: false },
      { id: "T3", number: 13, capacity: 4, type: "Cozy Booth", isAvailable: true },
      { id: "T4", number: 14, capacity: 4, type: "Indoor Main Dining", isAvailable: true },
      { id: "T5", number: 15, capacity: 6, type: "Wine Cellar Alcove", isAvailable: true }
    ],
    timeSlots: [
      "11:30 AM", "12:30 PM", "1:30 PM",
      "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"
    ]
  },
  {
    id: 5,
    name: "Santorini Aegean Mezze & Grill",
    cuisine: "Mediterranean",
    location: "Waterfront",
    address: "88 Harbor Way, Pier Waterfront",
    phone: "(555) 678-9012",
    rating: 4.8,
    reviewsCount: 540,
    priceRange: "$$$",
    priceLevel: 3,
    image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80",
    description: "Fresh Mediterranean seafood, grilled octopus, lemon-herb lamb chops, and coastal views overlooking the bay.",
    tags: ["Waterfront View", "Seafood", "Sunset Terrace", "Cocktail Lounge"],
    openingHours: "12:00 PM - 11:00 PM",
    tables: [
      { id: "T1", number: 21, capacity: 2, type: "Harbor Terrace", isAvailable: true },
      { id: "T2", number: 22, capacity: 2, type: "Harbor Terrace", isAvailable: true },
      { id: "T3", number: 23, capacity: 4, type: "Rooftop Deck", isAvailable: true },
      { id: "T4", number: 24, capacity: 4, type: "Indoor Ocean View", isAvailable: true },
      { id: "T5", number: 25, capacity: 6, type: "Rooftop Deck", isAvailable: false },
      { id: "T6", number: 26, capacity: 8, type: "VIP Pier Table", isAvailable: true }
    ],
    timeSlots: [
      "12:30 PM", "1:30 PM", "2:30 PM",
      "5:30 PM", "6:30 PM", "7:30 PM", "8:30 PM", "9:30 PM"
    ]
  },
  {
    id: 6,
    name: "El Sol Mexican Cantina",
    cuisine: "Mexican",
    location: "Midtown",
    address: "320 Market Street, Midtown Arts District",
    phone: "(555) 789-0123",
    rating: 4.5,
    reviewsCount: 310,
    priceRange: "$$",
    priceLevel: 2,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    description: "Authentic Oaxacan mole, handmade corn tortillas, artisanal mezcal cocktails, and vibrant live acoustic music.",
    tags: ["Live Music", "Tacos & Mezcal", "Vibrant Patio", "Late Night"],
    openingHours: "1:00 PM - 12:00 AM",
    tables: [
      { id: "T1", number: 31, capacity: 2, type: "Cantina Bar Table", isAvailable: true },
      { id: "T2", number: 32, capacity: 4, type: "Outdoor Courtyard", isAvailable: true },
      { id: "T3", number: 33, capacity: 4, type: "Indoor Fiesta Hall", isAvailable: true },
      { id: "T4", number: 34, capacity: 6, type: "Outdoor Courtyard", isAvailable: true },
      { id: "T5", number: 35, capacity: 8, type: "Fiesta Lounge Table", isAvailable: true }
    ],
    timeSlots: [
      "1:00 PM", "2:00 PM", "3:00 PM",
      "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
    ]
  },
  {
    id: 7,
    name: "The Prime Cut Steakhouse",
    cuisine: "American",
    location: "Uptown",
    address: "910 Park Avenue, Uptown Heights",
    phone: "(555) 890-1234",
    rating: 4.9,
    reviewsCount: 780,
    priceRange: "$$$$",
    priceLevel: 4,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description: "USDA Prime dry-aged steaks, Maine lobster tails, craft bourbons, and leather club booth seating.",
    tags: ["Dry-aged Steak", "Bourbon Bar", "Executive Dining", "Private Rooms"],
    openingHours: "5:00 PM - 11:00 PM",
    tables: [
      { id: "T1", number: 41, capacity: 2, type: "Executive Leather Booth", isAvailable: true },
      { id: "T2", number: 42, capacity: 2, type: "Indoor Main Dining", isAvailable: false },
      { id: "T3", number: 43, capacity: 4, type: "Executive Leather Booth", isAvailable: true },
      { id: "T4", number: 44, capacity: 6, type: "Wine Room Table", isAvailable: true },
      { id: "T5", number: 45, capacity: 8, type: "Presidential Dining Room", isAvailable: true }
    ],
    timeSlots: [
      "5:00 PM", "5:45 PM", "6:30 PM", "7:15 PM", "8:00 PM", "8:45 PM", "9:30 PM"
    ]
  },
  {
    id: 8,
    name: "Golden Dragon Cantonese Dim Sum",
    cuisine: "Chinese",
    location: "Downtown",
    address: "45 Chinatown Walk, Downtown Chinatown",
    phone: "(555) 901-2345",
    rating: 4.7,
    reviewsCount: 520,
    priceRange: "$$",
    priceLevel: 2,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    description: "Traditional pushcart dim sum, Peking duck carved tableside, and fresh seafood specialties.",
    tags: ["Dim Sum", "Peking Duck", "Large Groups", "Family Style"],
    openingHours: "10:30 AM - 10:00 PM",
    tables: [
      { id: "T1", number: 51, capacity: 2, type: "Indoor Main Dining", isAvailable: true },
      { id: "T2", number: 52, capacity: 4, type: "Indoor Main Dining", isAvailable: true },
      { id: "T3", number: 53, capacity: 6, type: "Round Lazy Susan Table", isAvailable: true },
      { id: "T4", number: 54, capacity: 8, type: "Round Lazy Susan Table", isAvailable: true },
      { id: "T5", number: 55, capacity: 10, type: "VIP Dragon Room", isAvailable: false }
    ],
    timeSlots: [
      "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
      "5:30 PM", "6:30 PM", "7:30 PM", "8:30 PM"
    ]
  }
];

export const CUISINES_LIST = [
  "All Cuisines",
  "Italian",
  "Japanese",
  "Indian",
  "French",
  "Mediterranean",
  "Mexican",
  "American",
  "Chinese"
];

export const LOCATIONS_LIST = [
  "All Locations",
  "Downtown",
  "Midtown",
  "Uptown",
  "Waterfront",
  "West End"
];
