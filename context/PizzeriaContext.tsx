import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Ingredient, Product, Sale, ProductIngredient, SaleByPeriod, Currency } from '../types';
import { Unit, Category } from '../types';
import { calculateMetrics, getInitialData } from '../utils/helpers';

interface PizzeriaContextType {
  ingredients: Ingredient[];
  products: Product[];
  salesByPeriod: SaleByPeriod;
  lowStockThreshold: number;
  currency: Currency;
  dateRange: { startDate: string | null; endDate: string | null };
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  deleteIngredient: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  recordSales: (salesData: { productId: string; quantity: number }[], date: string) => void;
  getProductById: (id: string | null) => Product | undefined;
  getIngredientById: (id: string) => Ingredient | undefined;
  setLowStockThreshold: (threshold: number) => void;
  setCurrency: (currency: Currency) => void;
  setDateRange: (range: { startDate: string | null; endDate: string | null }) => void;
  metrics: ReturnType<typeof calculateMetrics>;
}

const PizzeriaContext = createContext<PizzeriaContextType | undefined>(undefined);

export const PizzeriaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    initialIngredients,
    initialProducts,
    initialSales,
    initialThreshold,
  } = getInitialData();
  
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [salesByPeriod, setSalesByPeriod] = useState<SaleByPeriod>(initialSales);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(initialThreshold);
  
  const initialCurrency = JSON.parse(localStorage.getItem('pizzeria_currency') || '"MAD"') as Currency;
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [dateRange, setDateRange] = useState<{ startDate: string | null; endDate: string | null }>({ startDate: null, endDate: null });


  useEffect(() => {
    localStorage.setItem('pizzeria_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('pizzeria_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pizzeria_sales', JSON.stringify(salesByPeriod));
  }, [salesByPeriod]);

  useEffect(() => {
    localStorage.setItem('pizzeria_threshold', JSON.stringify(lowStockThreshold));
  }, [lowStockThreshold]);

  useEffect(() => {
    localStorage.setItem('pizzeria_currency', JSON.stringify(currency));
  }, [currency]);


  const addIngredient = (ingredient: Omit<Ingredient, 'id'>) => {
    setIngredients(prev => [...prev, { ...ingredient, id: crypto.randomUUID() }]);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients(prev => prev.map(i => i.id === updatedIngredient.id ? updatedIngredient : i));
  };

  const deleteIngredient = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: crypto.randomUUID() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };
  
  const duplicateProduct = (id: string) => {
    const productToDuplicate = products.find(p => p.id === id);
    if (productToDuplicate) {
      const newProduct = {
        ...productToDuplicate,
        id: crypto.randomUUID(),
        name: `${productToDuplicate.name} (Copie)`,
      };
      setProducts(prev => [...prev, newProduct]);
    }
  };

  const recordSales = (salesData: { productId: string; quantity: number }[], date: string) => {
    setSalesByPeriod(prev => {
        const newSales = {...prev};
        if(!newSales[date]) {
            newSales[date] = {};
        }
        salesData.forEach(({productId, quantity}) => {
            if (quantity > 0) {
                newSales[date][productId] = (newSales[date][productId] || 0) + quantity;
            }
        });
        return newSales;
    });
  };

  const getProductById = useCallback((id: string | null) => {
    return products.find(p => p.id === id);
  }, [products]);
  
  const getIngredientById = useCallback((id: string) => {
    return ingredients.find(i => i.id === id);
  }, [ingredients]);
  
  const metrics = calculateMetrics(products, ingredients, salesByPeriod, dateRange);

  return (
    <PizzeriaContext.Provider value={{ 
      ingredients, 
      products, 
      salesByPeriod, 
      lowStockThreshold,
      currency,
      dateRange,
      addIngredient, 
      updateIngredient, 
      deleteIngredient, 
      addProduct,
      updateProduct,
      deleteProduct,
      duplicateProduct,
      recordSales,
      getProductById,
      getIngredientById,
      setLowStockThreshold,
      setCurrency,
      setDateRange,
      metrics
    }}>
      {children}
    </PizzeriaContext.Provider>
  );
};

export const usePizzeria = (): PizzeriaContextType => {
  const context = useContext(PizzeriaContext);
  if (context === undefined) {
    throw new Error('usePizzeria must be used within a PizzeriaProvider');
  }
  return context;
};