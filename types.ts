export type Page = 'Dashboard' | 'Products' | 'ProductForm' | 'Ingredients' | 'Sales' | 'Export' | 'Settings';

export enum Unit {
  G = 'g',
  KG = 'kg',
  ML = 'ml',
  L = 'L',
  PIECE = 'pièce',
}

export enum Category {
  PIZZA = 'Pizza',
  BOISSON = 'Boisson',
  DESSERT = 'Dessert',
  AUTRE = 'Autre',
}

export type Currency = 'MAD' | 'EUR' | 'USD';

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  stock: number; // Represents total supplied stock (initial + purchases)
  initialStock: number; // Stock at creation
  purchasePrice: number; // Price per unit
  supplyDate: string;
}

export interface ProductIngredient {
  ingredientId: string;
  quantity: number; // in the ingredient's base unit (e.g., grams)
}

export interface Product {
  id: string;
  name: string;
  salePrice: number;
  category: Category;
  ingredients: ProductIngredient[];
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  date: string; // YYYY-MM-DD
}

export interface SaleByPeriod {
    [key: string]: {
        [productId: string]: number;
    }
}