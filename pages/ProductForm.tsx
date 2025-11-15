import React, { useState, useEffect, useCallback } from 'react';
import { usePizzeria } from '../context/PizzeriaContext';
import { calculateMaterialCost, formatCurrency } from '../utils/helpers';
import { CATEGORIES } from '../constants';
import type { ProductIngredient } from '../types';
import { Category, Unit } from '../types';

interface ProductFormProps {
    productId: string | null;
    onFormSubmit: () => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const ProductForm: React.FC<ProductFormProps> = ({ productId, onFormSubmit }) => {
    const { ingredients, addProduct, updateProduct, getProductById, getIngredientById } = usePizzeria();
    
    const [name, setName] = useState('');
    const [salePrice, setSalePrice] = useState(0);
    const [category, setCategory] = useState<Category>(Category.PIZZA);
    const [productIngredients, setProductIngredients] = useState<ProductIngredient[]>([]);
    
    useEffect(() => {
        if (productId) {
            const product = getProductById(productId);
            if (product) {
                setName(product.name);
                setSalePrice(product.salePrice);
                setCategory(product.category);
                setProductIngredients(product.ingredients);
            }
        }
    }, [productId, getProductById]);

    const handleIngredientChange = (index: number, field: keyof ProductIngredient, value: string | number) => {
        const newIngredients = [...productIngredients];
        (newIngredients[index] as any)[field] = value;
        setProductIngredients(newIngredients);
    };

    const addIngredientField = () => {
        if(ingredients.length > 0) {
            setProductIngredients([...productIngredients, { ingredientId: ingredients[0].id, quantity: 0 }]);
        }
    };

    const removeIngredientField = (index: number) => {
        const newIngredients = productIngredients.filter((_, i) => i !== index);
        setProductIngredients(newIngredients);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = { name, salePrice, category, ingredients: productIngredients.filter(pi => pi.quantity > 0) };
        if (productId) {
            updateProduct({ id: productId, ...productData });
        } else {
            addProduct(productData);
        }
        onFormSubmit();
    };

    const materialCost = calculateMaterialCost(productIngredients, ingredients);
    
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">{productId ? 'Modifier le Produit' : 'Créer un Produit'}</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nom du produit</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500"/>
                    </div>
                    <div>
                        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-300">Prix de vente (DH)</label>
                        <input type="number" step="0.01" id="salePrice" value={salePrice} onChange={e => setSalePrice(parseFloat(e.target.value))} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Catégorie</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500">
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Ingrédients de la Recette</h2>
                    {productIngredients.map((pi, index) => {
                        const ingredient = getIngredientById(pi.ingredientId);
                        let quantityUnit = ingredient?.unit;
                        if (ingredient?.unit === Unit.KG) quantityUnit = Unit.G;
                        if (ingredient?.unit === Unit.L) quantityUnit = Unit.ML;

                        return (
                            <div key={index} className="flex items-center space-x-4 mb-4">
                                <select value={pi.ingredientId} onChange={e => handleIngredientChange(index, 'ingredientId', e.target.value)} className="flex-1 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500">
                                    {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                                </select>
                                <input type="number" placeholder="Quantité" value={pi.quantity} onChange={e => handleIngredientChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-32 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500"/>
                                <span className="text-gray-400 w-16 text-sm">{quantityUnit}</span>
                                <button type="button" onClick={() => removeIngredientField(index)} className="p-2 text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        );
                    })}
                    <button type="button" onClick={addIngredientField} className="mt-2 text-green-400 hover:text-green-300 font-semibold">
                        + Ajouter un ingrédient
                    </button>
                </div>
                
                <div className="bg-gray-900 p-4 rounded-lg text-right">
                    <p className="text-lg text-gray-300">Coût matière calculé : <span className="font-bold text-yellow-400">{formatCurrency(materialCost)}</span></p>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-700">
                    <button type="button" onClick={onFormSubmit} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mr-4 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                        {productId ? 'Mettre à jour' : 'Enregistrer le produit'}
                    </button>
                </div>
            </form>
        </div>
    );
};