import type { SiteContent, Location, Category, Product } from "@/lib/types"

export const SITE: SiteContent = {
  name: "Town & Country Market",
  tagline: "Your neighbourhood,\nalways open.",
  description:
    "Fresh groceries, everyday essentials, and home-made bakery items — 24 hours a day, 7 days a week in Mississauga.",
  hours: "Open 24 Hours · 7 Days a Week",
  uberEatsUrl: "https://www.ubereats.com/ca/store/town-%26-country-market-%40-duke-of-york/DpaJsjRMUE-UKMfFLNVqjw",
}

export const LOCATIONS: Location[] = [
  {
    id: "duke-of-york",
    name: "Duke of York",
    address: "3885 Duke of York Blvd",
    city: "Mississauga, ON",
    phone: "(905) 275-8696",
    phoneHref: "tel:+19052758696",
    mapsLink: "https://maps.google.com/?q=3885+Duke+of+York+Blvd,+Mississauga,+ON",
    mapsEmbedSrc:
      "https://maps.google.com/maps?q=3885+Duke+of+York+Blvd,+Mississauga,+ON&output=embed",
  },
  {
    id: "hurontario",
    name: "Hurontario",
    address: "4033 Hurontario Rd",
    city: "Mississauga, ON",
    phone: "(905) 275-9699",
    phoneHref: "tel:+19052759699",
    mapsLink: "https://maps.google.com/?q=4033+Hurontario+Rd,+Mississauga,+ON",
    mapsEmbedSrc:
      "https://maps.google.com/maps?q=4033+Hurontario+Rd,+Mississauga,+ON&output=embed",
  },
]

export const CATEGORIES: Category[] = [
  {
    id: "produce",
    name: "Fresh Produce",
    icon: "Leaf",
    description: "Seasonal fruits and vegetables, fresh daily.",
  },
  {
    id: "bakery",
    name: "Home-Made Bakery",
    icon: "Croissant",
    description: "Fresh-baked goods made in-house every day.",
  },
  {
    id: "dairy",
    name: "Dairy",
    icon: "Milk",
    description: "Milk, butter, cheese, eggs, and more.",
  },
  {
    id: "grocery",
    name: "Grocery",
    icon: "ShoppingBasket",
    description: "Pantry staples and everyday essentials.",
  },
  {
    id: "chai",
    name: "Chai & Coffee",
    icon: "Coffee",
    description: "Premium teas, coffees, and hot beverages.",
  },
  {
    id: "bread",
    name: "Bread",
    icon: "Wheat",
    description: "Sliced bread, rolls, and artisan loaves.",
  },
  {
    id: "beer-wine",
    name: "Beer & Wine",
    icon: "Wine",
    description: "A curated selection of beers and wines.",
  },
  {
    id: "frozen",
    name: "Frozen Foods",
    icon: "Snowflake",
    description: "Frozen meals, vegetables, and convenience items.",
  },
  {
    id: "ice-cream",
    name: "Ice Cream",
    icon: "IceCreamCone",
    description: "Scoops, bars, and tubs from top brands.",
  },
  {
    id: "chocolate",
    name: "Chocolates",
    icon: "Candy",
    description: "Imported and local chocolate selections.",
  },
  {
    id: "rice",
    name: "Rice & Grains",
    icon: "Salad",
    description: "Basmati, jasmine, and specialty rice varieties.",
  },
  {
    id: "lottery",
    name: "Lottery",
    icon: "Ticket",
    description: "OLG lottery tickets available in-store.",
  },
]

export const SAMPLE_PRODUCTS: Product[] = [
  // Dairy
  { id: "p1", categoryId: "dairy", name: "Whole Milk 2L", price: 4.99 },
  { id: "p2", categoryId: "dairy", name: "Free Range Eggs 12pk", price: 6.49, salePrice: 5.49, image: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400&h=280&fit=crop&q=80" },
  { id: "p3", categoryId: "dairy", name: "Cheddar Cheese 400g", price: 7.99 },
  // Bakery
  { id: "p4", categoryId: "bakery", name: "Fresh Croissants 4pk", price: 5.99 },
  { id: "p5", categoryId: "bakery", name: "Sourdough Loaf", price: 7.49, salePrice: 6.49, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=280&fit=crop&q=80" },
  { id: "p6", categoryId: "bakery", name: "Cinnamon Rolls 6pk", price: 8.99 },
  // Produce
  { id: "p7", categoryId: "produce", name: "Bananas (bunch)", price: 1.99 },
  { id: "p8", categoryId: "produce", name: "Roma Tomatoes 1kg", price: 3.49, salePrice: 2.99, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=280&fit=crop&q=80" },
  { id: "p9", categoryId: "produce", name: "Baby Spinach 142g", price: 4.49 },
  // Beer & Wine
  { id: "p10", categoryId: "beer-wine", name: "Heineken 6-Pack 330ml", price: 14.99 },
  { id: "p11", categoryId: "beer-wine", name: "Yellow Tail Shiraz 750ml", price: 12.99 },
  { id: "p12", categoryId: "beer-wine", name: "Corona Extra 6-Pack", price: 16.49, salePrice: 14.49, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=280&fit=crop&q=80" },
  // Ice Cream
  {
    id: "p13",
    categoryId: "ice-cream",
    name: "Häagen-Dazs Vanilla 500ml",
    price: 8.99,
    salePrice: 6.99,
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=280&fit=crop&q=80",
  },
  { id: "p14", categoryId: "ice-cream", name: "Ben & Jerry's Choc Fudge", price: 9.49 },
  // Grocery
  { id: "p15", categoryId: "grocery", name: "Lay's Classic Chips 235g", price: 4.99 },
  { id: "p16", categoryId: "grocery", name: "Coca-Cola 2L", price: 3.49, salePrice: 2.99, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=280&fit=crop&q=80" },
  // Chai & Coffee
  { id: "p17", categoryId: "chai", name: "Tetley Original 100 Tea Bags", price: 6.99 },
  { id: "p18", categoryId: "chai", name: "Nescafé Gold 100g", price: 8.49 },
  // Chocolate
  { id: "p19", categoryId: "chocolate", name: "Cadbury Dairy Milk 200g", price: 4.99 },
  { id: "p20", categoryId: "chocolate", name: "Lindt Excellence 70% 100g", price: 5.49, salePrice: 4.49, image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=280&fit=crop&q=80" },
  // Rice
  { id: "p21", categoryId: "rice", name: "Basmati Rice 2kg", price: 8.99 },
  { id: "p22", categoryId: "rice", name: "Jasmine Rice 2kg", price: 7.99 },
  // Frozen
  { id: "p23", categoryId: "frozen", name: "McCain Superfries 750g", price: 5.49 },
  { id: "p24", categoryId: "frozen", name: "Swanson Chicken Pot Pie", price: 4.99, salePrice: 3.99, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=280&fit=crop&q=80" },
  // Bread
  { id: "p25", categoryId: "bread", name: "Wonder Bread White 675g", price: 3.99 },
  { id: "p26", categoryId: "bread", name: "Dempster's 12-Grain 600g", price: 4.49 },
]
