import type { Product, Ingredient, SaleByPeriod, ProductIngredient, Currency } from '../types';
import { Unit, Category } from '../types';

export const getInitialData = () => {
  let initialIngredients: Ingredient[] = JSON.parse(localStorage.getItem('pizzeria_ingredients') || '[]')
  const initialProducts: Product[] = JSON.parse(localStorage.getItem('pizzeria_products') || '[]')
  const initialSales: SaleByPeriod = JSON.parse(localStorage.getItem('pizzeria_sales') || '{}')
  const initialThreshold: number = JSON.parse(localStorage.getItem('pizzeria_threshold') || '1000') // Default to 1kg or 1L in base units (grams)

  if (initialIngredients.length === 0 && initialProducts.length === 0) {
    const mozzarella: Ingredient = {id: '1', name: 'Mozzarella', unit: Unit.KG, stock: 10, initialStock: 10, purchasePrice: 85, supplyDate: new Date().toISOString()}; // 85 DH/kg
    const sauceTomate: Ingredient = {id: '2', name: 'Sauce Tomate', unit: Unit.KG, stock: 15, initialStock: 15, purchasePrice: 22, supplyDate: new Date().toISOString()}; // 22 DH/kg
    const farine: Ingredient = {id: '3', name: 'Farine T55', unit: Unit.KG, stock: 50, initialStock: 50, purchasePrice: 10, supplyDate: new Date().toISOString()}; // 10 DH/kg
    const jambon: Ingredient = {id: '4', name: 'Jambon Blanc', unit: Unit.KG, stock: 5, initialStock: 5, purchasePrice: 110, supplyDate: new Date().toISOString()}; // 110 DH/kg
    const champignons: Ingredient = {id: '5', name: 'Champignons de Paris', unit: Unit.KG, stock: 3, initialStock: 3, purchasePrice: 55, supplyDate: new Date().toISOString()}; // 55 DH/kg
    const coca: Ingredient = {id: '6', name: 'Coca-Cola 33cl', unit: Unit.PIECE, stock: 100, initialStock: 100, purchasePrice: 7, supplyDate: new Date().toISOString()}; // 7 DH/piece
    const tiramisu: Ingredient = {id: '7', name: 'Tiramisu (portion)', unit: Unit.PIECE, stock: 30, initialStock: 30, purchasePrice: 12, supplyDate: new Date().toISOString()}; // 12 DH/piece
    
    initialIngredients.push(mozzarella, sauceTomate, farine, jambon, champignons, coca, tiramisu);

    const pizzaMargherita: Product = {id: 'p1', name: 'Pizza Margherita', salePrice: 80, category: Category.PIZZA, ingredients: [{ingredientId: '1', quantity: 120}, {ingredientId: '2', quantity: 90}]};
    const pizzaReine: Product = {id: 'p2', name: 'Pizza Reine', salePrice: 95, category: Category.PIZZA, ingredients: [{ingredientId: '1', quantity: 100}, {ingredientId: '2', quantity: 90}, {ingredientId: '4', quantity: 80}, {ingredientId: '5', quantity: 50}]};
    const boissonCoca: Product = {id: 'p3', name: 'Coca-Cola', salePrice: 15, category: Category.BOISSON, ingredients: [{ingredientId: '6', quantity: 1}]};
    const dessertTiramisu: Product = {id: 'p4', name: 'Tiramisu', salePrice: 35, category: Category.DESSERT, ingredients: [{ingredientId: '7', quantity: 1}]};

    initialProducts.push(pizzaMargherita, pizzaReine, boissonCoca, dessertTiramisu);
  } else {
    // Migrate old data if it exists
    initialIngredients = initialIngredients.map(ing => ({
      ...ing,
      initialStock: ing.initialStock ?? ing.stock,
    }));
  }

  return { initialIngredients, initialProducts, initialSales, initialThreshold };
};


export const calculateMaterialCost = (
  productIngredients: ProductIngredient[],
  allIngredients: Ingredient[]
): number => {
  return productIngredients.reduce((total, pi) => {
    const ingredient = allIngredients.find(i => i.id === pi.ingredientId);
    if (!ingredient) return total;

    let pricePerBaseUnit = ingredient.purchasePrice;
    if (ingredient.unit === Unit.KG) {
        pricePerBaseUnit /= 1000; // price per gram
    } else if (ingredient.unit === Unit.L) {
        pricePerBaseUnit /= 1000; // price per ml
    }
    
    // quantity is assumed to be in the base unit (g, ml, piece)
    return total + pi.quantity * pricePerBaseUnit;
  }, 0);
};

export const calculateMetrics = (
    products: Product[],
    ingredients: Ingredient[],
    salesByPeriod: SaleByPeriod,
    dateRange: { startDate: string | null; endDate: string | null }
) => {
    let salesEntries = Object.entries(salesByPeriod);

    if (dateRange.startDate) {
        salesEntries = salesEntries.filter(([date]) => date >= dateRange.startDate!);
    }
    if (dateRange.endDate) {
        salesEntries = salesEntries.filter(([date]) => date <= dateRange.endDate!);
    }

    const totalSales = salesEntries.flatMap(([, dailySales]) => Object.entries(dailySales));

    const revenue = totalSales.reduce((acc, [productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return acc + (product ? product.salePrice * quantity : 0);
    }, 0);

    const ingredientConsumption = new Map<string, number>();
    totalSales.forEach(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        product?.ingredients.forEach(pi => {
            const currentConsumption = ingredientConsumption.get(pi.ingredientId) || 0;
            ingredientConsumption.set(pi.ingredientId, currentConsumption + pi.quantity * quantity);
        });
    });

    // Note: total consumption is based on filtered sales, but remaining stock is based on ALL sales
    const allTimeIngredientConsumption = new Map<string, number>();
     Object.values(salesByPeriod).flatMap(dailySales => Object.entries(dailySales)).forEach(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        product?.ingredients.forEach(pi => {
            const currentConsumption = allTimeIngredientConsumption.get(pi.ingredientId) || 0;
            allTimeIngredientConsumption.set(pi.ingredientId, currentConsumption + pi.quantity * quantity);
        });
    });

    let totalMaterialCost = 0;
    ingredientConsumption.forEach((consumedQuantity, ingredientId) => {
        const ingredient = ingredients.find(i => i.id === ingredientId);
        if (ingredient) {
            let pricePerBaseUnit = ingredient.purchasePrice;
            if (ingredient.unit === Unit.KG) pricePerBaseUnit /= 1000;
            if (ingredient.unit === Unit.L) pricePerBaseUnit /= 1000;
            totalMaterialCost += consumedQuantity * pricePerBaseUnit;
        }
    });

    const remainingStock = ingredients.map(ing => {
        const consumedInBaseUnit = allTimeIngredientConsumption.get(ing.id) || 0;
        let consumedInIngredientUnit = consumedInBaseUnit;

        if (ing.unit === Unit.KG || ing.unit === Unit.L) {
            consumedInIngredientUnit /= 1000;
        }
        
        const remainingInIngredientUnit = ing.stock - consumedInIngredientUnit;
        const purchasesInIngredientUnit = ing.stock - ing.initialStock;

        return { 
            ...ing, 
            remaining: remainingInIngredientUnit,
            consumed: consumedInIngredientUnit,
            purchases: purchasesInIngredientUnit,
        };
    });

    const grossMargin = revenue - totalMaterialCost;
    const foodCostPercentage = revenue > 0 ? (totalMaterialCost / revenue) * 100 : 0;
    
    const totalStockValue = remainingStock.reduce((acc, ing) => {
        return acc + ing.remaining * ing.purchasePrice;
    }, 0);

    const salesByProduct = totalSales.reduce((acc, [productId, quantity]) => {
        acc[productId] = (acc[productId] || 0) + quantity;
        return acc;
    }, {} as {[key: string]: number});
    
    const topSellingProducts = Object.entries(salesByProduct)
        .map(([productId, quantity]) => ({
            product: products.find(p => p.id === productId),
            quantity
        }))
        .filter(item => item.product)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    const salesHistory = salesEntries.map(([date, sales]) => {
        const dailyRevenue = Object.entries(sales).reduce((acc, [productId, quantity]) => {
            const product = products.find(p => p.id === productId);
            return acc + (product ? product.salePrice * quantity : 0);
        }, 0);
        return { date, revenue: dailyRevenue };
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    return {
        totalRevenue: revenue,
        totalMaterialCost,
        grossMargin,
        foodCostPercentage,
        remainingStock,
        ingredientConsumption: Array.from(ingredientConsumption.entries()).map(([id, quantity]) => ({ ingredient: ingredients.find(i => i.id === id), quantity })),
        topSellingProducts,
        totalStockValue,
        salesHistory
    };
};

const CURRENCY_CONFIG: { [key in Currency]: { locale: string; rate: number } } = {
  MAD: { locale: 'ar-MA', rate: 1 },
  EUR: { locale: 'fr-FR', rate: 0.093 },
  USD: { locale: 'en-US', rate: 0.10 },
};

export const formatCurrency = (amount: number, currency: Currency = 'MAD') => {
    const config = CURRENCY_CONFIG[currency];
    const convertedAmount = amount * config.rate;
    return new Intl.NumberFormat(config.locale, { style: 'currency', currency }).format(convertedAmount);
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
};

export const exportToCSV = <T,>(data: T[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0] as any).join(',');
  const rows = data.map(row => Object.values(row as any).join(',')).join('\n');
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};