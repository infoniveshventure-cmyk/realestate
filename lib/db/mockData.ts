export interface MockProject {
  _id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  propertyType: 'Residential' | 'Commercial' | 'Plot/Land' | 'Apartment' | 'Villa';
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  price?: number;
  priceRange?: { min: number; max: number };
  size?: number;
  units?: number;
  amenities: string[];
  images: Array<{ cloudinaryId: string; url: string; alt: string }>;
  brochureUrl?: string;
  location_lat?: number;
  location_lng?: number;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    _id: 'mock-proj-1',
    name: 'Aura Heights Luxury Residences',
    slug: 'aura-heights-luxury-residences',
    location: 'Bandra West, Mumbai',
    description: 'Ultra-luxurious 3 & 4 BHK apartments with sea views, private elevators, and world-class infinity pool.',
    propertyType: 'Residential',
    status: 'Ongoing',
    price: 65000000,
    priceRange: { min: 45000000, max: 85000000 },
    size: 2800,
    units: 48,
    amenities: ['Infinity Pool', 'Clubhouse', 'Private Elevators', 'Gymnasium', '24/7 Concierge', 'Landscaped Gardens'],
    images: [
      {
        cloudinaryId: 'mock-1',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        alt: 'Aura Heights Exterior',
      },
      {
        cloudinaryId: 'mock-2',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Aura Heights Interior',
      },
    ],
    brochureUrl: '/brochures/aura-heights.pdf',
    location_lat: 19.0596,
    location_lng: 72.8295,
    seoTitle: 'Aura Heights - Luxury Residences in Bandra West',
    seoDescription: 'Exclusive 3 & 4 BHK homes in Bandra West by Nivesh Ventures.',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-proj-2',
    name: 'Verdant Greens Villas',
    slug: 'verdant-greens-villas',
    location: 'North Goa, Goa',
    description: 'Serene contemporary Portuguese-inspired private villas with private plunge pools and lush forest canopy.',
    propertyType: 'Villa',
    status: 'Ongoing',
    price: 32000000,
    priceRange: { min: 28000000, max: 42000000 },
    size: 3500,
    units: 16,
    amenities: ['Private Pool', 'Organic Orchard', 'Solar Power', 'Gated Security', 'EV Charging'],
    images: [
      {
        cloudinaryId: 'mock-3',
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        alt: 'Verdant Greens Villa',
      },
    ],
    brochureUrl: '/brochures/verdant-greens.pdf',
    location_lat: 15.5937,
    location_lng: 73.7431,
    seoTitle: 'Verdant Greens - Luxury Portuguese Villas in Goa',
    seoDescription: 'Private boutique villas tucked in the hills of North Goa.',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-proj-3',
    name: 'Apex Horizon Tech Park',
    slug: 'apex-horizon-tech-park',
    location: 'Cyber City, Gurugram',
    description: 'Next-generation Grade-A commercial office suites with LEED Platinum certification and smart automation.',
    propertyType: 'Commercial',
    status: 'Ongoing',
    price: 18000000,
    priceRange: { min: 15000000, max: 55000000 },
    size: 5000,
    units: 120,
    amenities: ['LEED Platinum', 'High-Speed Elevators', 'Cafeteria & Food Court', 'Auditorium', 'Smart Access Control'],
    images: [
      {
        cloudinaryId: 'mock-4',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        alt: 'Apex Horizon Tech Park',
      },
    ],
    brochureUrl: '/brochures/apex-horizon.pdf',
    location_lat: 28.4907,
    location_lng: 77.0898,
    seoTitle: 'Apex Horizon - Grade A Commercial Tech Park',
    seoDescription: 'World-class corporate infrastructure in Cyber City Gurugram.',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-proj-4',
    name: 'The Grand Elysium',
    slug: 'the-grand-elysium',
    location: 'Whitefield, Bengaluru',
    description: 'Modern high-rise residential towers surrounded by 80% open landscaped spaces and wellness decks.',
    propertyType: 'Apartment',
    status: 'Upcoming',
    price: 14500000,
    priceRange: { min: 12000000, max: 22000000 },
    size: 1950,
    units: 210,
    amenities: ['Olympic Lap Pool', 'Tennis Court', 'Co-Working Lounge', 'Children Play Zone', 'Spa & Sauna'],
    images: [
      {
        cloudinaryId: 'mock-5',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        alt: 'The Grand Elysium',
      },
    ],
    brochureUrl: '/brochures/grand-elysium.pdf',
    location_lat: 12.9698,
    location_lng: 77.75,
    seoTitle: 'The Grand Elysium - High-Rise Living in Whitefield',
    seoDescription: 'Thoughtfully designed premium apartments in Bengaluru.',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-proj-5',
    name: 'Skyline Opus Sky-Villas',
    slug: 'skyline-opus-sky-villas',
    location: 'Golf Course Road, Gurugram',
    description: 'Ultra-exclusive duplex penthouses with 360-degree skyline views, personal jacuzzi, and private concierge lobby.',
    propertyType: 'Villa',
    status: 'Ongoing',
    price: 89000000,
    priceRange: { min: 75000000, max: 120000000 },
    size: 5200,
    units: 24,
    amenities: ['Sky Lounge', 'Helipad Access', 'Personal Jacuzzi', 'Cigar Room', 'Private Wine Cellar'],
    images: [
      {
        cloudinaryId: 'mock-6',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        alt: 'Skyline Opus Sky-Villas',
      },
    ],
    brochureUrl: '/brochures/skyline-opus.pdf',
    location_lat: 28.4595,
    location_lng: 77.0266,
    seoTitle: 'Skyline Opus - Penthouse Sky-Villas Gurugram',
    seoDescription: 'Super luxury penthouses on Golf Course Road.',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export interface MockNews {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: 'Market News' | 'Company Updates' | 'Investment Tips';
  imageUrl?: string;
  published: boolean;
  createdAt: string;
}

export const MOCK_NEWS: MockNews[] = [
  {
    _id: 'news-1',
    title: 'Indian Luxury Real Estate Market Surges by 35% in 2026',
    slug: 'luxury-real-estate-market-surges-2026',
    summary: 'High net-worth investors are driving unprecedented demand for prime residential assets across metro hubs.',
    content: 'The demand for ultra-luxury housing has hit record highs this quarter with buyers prioritizing amenities, sustainability, and prime connectivity.',
    category: 'Market News',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'news-2',
    title: 'Nivesh Ventures Announces Expansion into Premium Coastal Living',
    slug: 'nivesh-ventures-expansion-coastal-living',
    summary: 'New luxury developments scheduled across Goa and Alibaug featuring signature architecture.',
    content: 'We are thrilled to unveil our upcoming pipeline of eco-conscious seaside villas designed by award-winning architects.',
    category: 'Company Updates',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    published: true,
    createdAt: new Date().toISOString(),
  },
];
