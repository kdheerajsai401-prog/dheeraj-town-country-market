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
    id: "fruits-vegetables",
    name: "Fruits & Vegetables",
    icon: "Leaf",
    description: "Seasonal fruits and vegetables, fresh daily.",
  },
  {
    id: "bakery",
    name: "Bakery",
    icon: "Croissant",
    description: "Fresh-baked goods made in-house every day.",
  },
  {
    id: "dairy-eggs",
    name: "Dairy & Eggs",
    icon: "Milk",
    description: "Milk, butter, cheese, eggs, and more.",
  },
  {
    id: "pantry-groceries",
    name: "Pantry & Groceries",
    icon: "ShoppingBasket",
    description: "Pantry staples and everyday essentials.",
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: "Coffee",
    description: "Water, juice, tea, coffee, and more.",
  },
  {
    id: "snacks",
    name: "Snacks",
    icon: "Candy",
    description: "Chips, cookies, and snack foods.",
  },
  {
    id: "frozen-food",
    name: "Frozen Food",
    icon: "Snowflake",
    description: "Frozen meals and convenience items.",
  },
  {
    id: "sweets-chocolates",
    name: "Sweets & Chocolates",
    icon: "Candy",
    description: "Imported and local chocolate selections.",
  },
  {
    id: "pasta",
    name: "Pasta",
    icon: "Wheat",
    description: "Pasta, sauces, and grains.",
  },
  {
    id: "best-sellers",
    name: "Best sellers",
    icon: "ShoppingBasket",
    description: "Our most popular items.",
  },
  {
    id: "household",
    name: "Household",
    icon: "ShoppingBag",
    description: "Home essentials and cleaning supplies.",
  },
  {
    id: "lottery",
    name: "Lottery",
    icon: "Ticket",
    description: "OLG lottery tickets available in-store.",
  },
]

export const SAMPLE_PRODUCTS: Product[] = [
  // Dairy & Eggs
  { id: "p1", categoryId: "dairy-eggs", name: "Whole Milk 2L", price: 4.99 },
  { id: "p2", categoryId: "dairy-eggs", name: "Free Range Eggs 12pk", price: 6.49, salePrice: 5.49, image: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400&h=280&fit=crop&q=80" },
  { id: "p3", categoryId: "dairy-eggs", name: "Cheddar Cheese 400g", price: 7.99 },
  // Bakery
  { id: "p4", categoryId: "bakery", name: "Fresh Croissants 4pk", price: 5.99 },
  { id: "p5", categoryId: "bakery", name: "Sourdough Loaf", price: 7.49, salePrice: 6.49, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=280&fit=crop&q=80" },
  { id: "p6", categoryId: "bakery", name: "Cinnamon Rolls 6pk", price: 8.99 },
  // Fruits & Vegetables
  { id: "p7", categoryId: "fruits-vegetables", name: "Bananas (bunch)", price: 1.99 },
  { id: "p8", categoryId: "fruits-vegetables", name: "Roma Tomatoes 1kg", price: 3.49, salePrice: 2.99, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=280&fit=crop&q=80" },
  { id: "p9", categoryId: "fruits-vegetables", name: "Baby Spinach 142g", price: 4.49 },
  // Beverages
  { id: "p10", categoryId: "beverages", name: "Heineken 6-Pack 330ml", price: 14.99 },
  { id: "p11", categoryId: "beverages", name: "Yellow Tail Shiraz 750ml", price: 12.99 },
  { id: "p12", categoryId: "beverages", name: "Corona Extra 6-Pack", price: 16.49, salePrice: 14.49, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=280&fit=crop&q=80" },
  // Frozen Food
  {
    id: "p13",
    categoryId: "frozen-food",
    name: "Häagen-Dazs Vanilla 500ml",
    price: 8.99,
    salePrice: 6.99,
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=280&fit=crop&q=80",
  },
  { id: "p14", categoryId: "frozen-food", name: "McCain Superfries 750g", price: 5.49 },
  // Pantry & Groceries
  { id: "p15", categoryId: "pantry-groceries", name: "Basmati Rice 2kg", price: 8.99 },
  { id: "p16", categoryId: "pantry-groceries", name: "Coca-Cola 2L", price: 3.49, salePrice: 2.99, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=280&fit=crop&q=80" },
  // Beverages (tea/coffee)
  { id: "p17", categoryId: "beverages", name: "Tetley Original 100 Tea Bags", price: 6.99 },
  { id: "p18", categoryId: "beverages", name: "Nescafé Gold 100g", price: 8.49 },
  // Sweets & Chocolates
  { id: "p19", categoryId: "sweets-chocolates", name: "Cadbury Dairy Milk 200g", price: 4.99 },
  { id: "p20", categoryId: "sweets-chocolates", name: "Lindt Excellence 70% 100g", price: 5.49, salePrice: 4.49, image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=280&fit=crop&q=80" },
  // Pasta
  { id: "p21", categoryId: "pasta", name: "Italpasta Spaghetti 750g", price: 3.99 },
  { id: "p22", categoryId: "pasta", name: "Classico Alfredo Sauce 410ml", price: 6.99 },
  // Snacks
  { id: "p23", categoryId: "snacks", name: "Lay's Classic Chips 235g", price: 4.99 },
  { id: "p24", categoryId: "snacks", name: "Cheetos Crunchy 310g", price: 6.99, salePrice: 5.49, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=280&fit=crop&q=80" },
  // Household
  { id: "p25", categoryId: "household", name: "Tide Pods 35ct", price: 14.99 },
  { id: "p26", categoryId: "household", name: "Bounty Paper Towels 6pk", price: 9.49 },
]
