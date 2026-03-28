export type SiteContent = {
  name: string
  tagline: string
  description: string
  hours: string
  uberEatsUrl: string
}

export type Location = {
  id: string
  name: string
  address: string
  city: string
  phone: string
  phoneHref: string
  mapsLink: string
  mapsEmbedSrc: string
}

export type Category = {
  id: string
  name: string
  icon: string
  description: string
}

export type Product = {
  id: string
  categoryId: string
  name: string
  image?: string
  price?: number
  salePrice?: number
}
