export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  seller: string;
  location: string;
  datePosted: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

