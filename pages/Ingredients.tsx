import React, { useState } from 'react';
import { usePizzeria } from '../context/PizzeriaContext';
import { formatDate } from '../utils/helpers';
import type { Ingredient } from '../types';
import { Unit } from '../types';
import { UNITS } from '../constants';

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IngredientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (ingredient: (Omit<Ingredient, 'id' | 'initialStock'> & { stock: number }) | Ingredient) => void;
  ingredient: Ingredient | null;
}> = ({ isOpen, onClose, onSave, ingredient }) => {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState<Unit>(Unit.G);
    const [stock, setStock] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [supplyDate, setSupplyDate] = useState(new Date().toISOString().split('T')[0]);

    React.useEffect(() => {
        if (ingredient) {
            setName(ingredient.name);
            setUnit(ingredient.unit);
            setStock(ingredient.stock);
            setPurchasePrice(ingredient.purchasePrice);
            setSupplyDate(new Date(ingredient.supplyDate).toISOString().split('T')[0]);
        } else {
            setName('');
            setUnit(Unit.G);
            setStock(0);
            setPurchasePrice(0);
            setSupplyDate(new Date().toISOString().split('T')[0]);
        }
    }, [ingredient]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { name, unit, stock, purchasePrice, supplyDate };
        if (ingredient && 'id' in ingredient) {
            onSave({ ...ingredient, ...data });
        } else {
            onSave(data);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-white">{ingredient ? 'Modifier' : 'Ajouter'} un Ingrédient</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2"/>
                    <select value={unit} onChange={e => setUnit(e.target.value as Unit)} className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2">
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <input type="number" placeholder="Stock Initial" value={stock} onChange={e => setStock(parseFloat(e.target.value))} required className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2"/>
                    <input type="number" step="0.001" placeholder="Prix d'achat (DH)" value={purchasePrice} onChange={e => setPurchasePrice(parseFloat(e.target.value))} required className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2"/>
                    <input type="date" value={supplyDate} onChange={e => setSupplyDate(e.target.value)} required className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2"/>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Annuler</button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RestockModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (ingredient: Ingredient, quantity: number, price: number) => void;
  ingredient: Ingredient | null;
}> = ({ isOpen, onClose, onSave, ingredient }) => {
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);

    React.useEffect(() => {
        if (ingredient) {
            setPrice(ingredient.purchasePrice);
            setQuantity(0); // Reset quantity on open
        }
    }, [ingredient]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ingredient && quantity > 0) {
            onSave(ingredient, quantity, price);
        }
    };

    if (!isOpen || !ingredient) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-white">Réapprovisionner</h2>
                <p className="text-lg text-gray-400 mb-6">{ingredient.name}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="number" min="0" placeholder="Quantité ajoutée" value={quantity} onChange={e => setQuantity(parseFloat(e.target.value))} required className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2"/>
                    <input type="number" step="0.001" min="0" placeholder="Nouveau prix d'achat (DH)" value={price} onChange={e => setPrice(parseFloat(e.target.value))} required className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2"/>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Annuler</button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Ajouter au Stock</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Ingredients: React.FC = () => {
    const { metrics, deleteIngredient, addIngredient, updateIngredient, lowStockThreshold, ingredients } = usePizzeria();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [purchaseInputs, setPurchaseInputs] = useState<Record<string, string>>({});

    const handleOpenModal = (ingredient: Ingredient | null = null) => {
        setEditingIngredient(ingredient);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingIngredient(null);
    };

    const handleSave = (ingredientData: (Omit<Ingredient, 'id' | 'initialStock'> & { stock: number }) | Ingredient) => {
        if ('id' in ingredientData) {
            updateIngredient(ingredientData);
        } else {
            addIngredient({ ...ingredientData, initialStock: ingredientData.stock });
        }
        handleCloseModal();
    };
    
    const handleOpenRestockModal = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        setIsRestockModalOpen(true);
    };
    
    const handleCloseRestockModal = () => {
        setIsRestockModalOpen(false);
        setSelectedIngredient(null);
    };

    const handleRestockSave = (ingredient: Ingredient, quantity: number, price: number) => {
        const updatedIngredient = {
            ...ingredient,
            stock: ingredient.stock + quantity,
            purchasePrice: price,
            supplyDate: new Date().toISOString(),
        };
        updateIngredient(updatedIngredient);
        handleCloseRestockModal();
    };

    const handlePurchaseInputChange = (ingredientId: string, value: string) => {
        setPurchaseInputs(prev => ({ ...prev, [ingredientId]: value }));
    };

    const handlePurchaseInputBlur = (ingredientId: string) => {
        const inputValue = purchaseInputs[ingredientId];
        
        if (inputValue === undefined) return;

        const newPurchases = parseFloat(inputValue);

        const newInputs = { ...purchaseInputs };
        delete newInputs[ingredientId];
        setPurchaseInputs(newInputs);

        if (isNaN(newPurchases)) {
            return;
        }

        const ingredientToUpdate = ingredients.find(i => i.id === ingredientId);
        if (ingredientToUpdate) {
            const newStock = ingredientToUpdate.initialStock + newPurchases;
            if(ingredientToUpdate.stock !== newStock) {
                updateIngredient({ ...ingredientToUpdate, stock: newStock, supplyDate: new Date().toISOString() });
            }
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Ingrédients & Stock</h1>
                <button onClick={() => handleOpenModal()} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                    Ajouter un Ingrédient
                </button>
            </div>
            
            <div className="bg-gray-800 shadow-xl rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Nom</th>
                            <th className="p-4 font-semibold">Unité</th>
                            <th className="p-4 font-semibold">Stock Initial</th>
                            <th className="p-4 font-semibold">Achats</th>
                            <th className="p-4 font-semibold">Consommé</th>
                            <th className="p-4 font-semibold">Stock Actuel</th>
                            <th className="p-4 font-semibold">Prix d'Achat (DH)</th>
                            <th className="p-4 font-semibold">Dernier Approv.</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {metrics.remainingStock.map(ing => (
                            <tr key={ing.id} className={`${ing.remaining < lowStockThreshold ? 'bg-red-900 bg-opacity-30' : ''}`}>
                                <td className="p-4">{ing.name}</td>
                                <td className="p-4">{ing.unit}</td>
                                <td className="p-4 font-mono">{ing.initialStock.toFixed(2)}</td>
                                <td className="p-4 font-mono text-green-400">
                                   <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-24 bg-gray-900 border border-gray-600 rounded-md text-green-400 p-1 text-right focus:outline-none focus:ring-2 focus:ring-green-500 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                        value={purchaseInputs[ing.id] ?? (ing as any).purchases.toFixed(2)}
                                        onChange={(e) => handlePurchaseInputChange(ing.id, e.target.value)}
                                        onBlur={() => handlePurchaseInputBlur(ing.id)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            (e.target as HTMLInputElement).blur();
                                          }
                                        }}
                                    />
                                </td>
                                <td className="p-4 font-mono text-yellow-400">{(ing.consumed as number).toFixed(2)}</td>
                                <td className={`p-4 font-mono font-bold ${ing.remaining < lowStockThreshold ? 'text-red-400' : ''}`}>{ing.remaining.toFixed(2)}</td>
                                <td className="p-4 font-mono">{ing.purchasePrice.toFixed(3)}</td>
                                <td className="p-4">{formatDate(ing.supplyDate)}</td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleOpenRestockModal(ing as Ingredient)} className="p-2 text-gray-300 hover:text-green-400" title="Réapprovisionner"><PlusCircleIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleOpenModal(ing as Ingredient)} className="p-2 text-gray-300 hover:text-yellow-400" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => window.confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?') && deleteIngredient(ing.id)} className="p-2 text-gray-300 hover:text-red-500" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <IngredientModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} ingredient={editingIngredient}/>
            <RestockModal isOpen={isRestockModalOpen} onClose={handleCloseRestockModal} onSave={handleRestockSave} ingredient={selectedIngredient} />
        </div>
    );
};
