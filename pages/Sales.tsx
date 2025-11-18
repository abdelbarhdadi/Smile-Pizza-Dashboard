
import React, { useState } from 'react';
import { usePizzeria } from '../context/PizzeriaContext';

export const Sales: React.FC = () => {
    const { products, recordSales } = usePizzeria();
    const [sales, setSales] = useState<{[productId: string]: number}>({});
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
    const [message, setMessage] = useState('');

    const handleQuantityChange = (productId: string, quantity: number) => {
        setSales(prev => ({...prev, [productId]: quantity}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const salesData = Object.entries(sales).map(([productId, quantity]) => ({ productId, quantity: Number(quantity) }));
        recordSales(salesData, saleDate);
        setSales({});
        setMessage(`Ventes du ${new Date(saleDate).toLocaleDateString('fr-FR')} enregistrées !`);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Saisie des Ventes</h1>
            
            {message && <div className="bg-green-500 text-white p-3 rounded-lg text-center">{message}</div>}

            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 md:p-8 rounded-lg shadow-xl space-y-6">
                <div>
                    <label htmlFor="saleDate" className="block text-sm font-medium text-gray-300 mb-2">Date des ventes</label>
                    <input 
                        type="date" 
                        id="saleDate" 
                        value={saleDate} 
                        onChange={e => setSaleDate(e.target.value)} 
                        className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 p-2 text-base"
                    />
                </div>
                
                <div className="space-y-4">
                    {products.map(product => (
                        <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 bg-gray-700 rounded-md shadow-sm">
                            <span className="text-white font-medium text-lg sm:text-base flex-1">{product.name}</span>
                            <div className="w-full sm:w-32">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Quantité"
                                    value={sales[product.id] || ''}
                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10) || 0)}
                                    className="w-full bg-gray-900 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 text-right p-2 text-base"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-end pt-6 border-t border-gray-700">
                    <button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors text-base">
                        Enregistrer les Ventes
                    </button>
                </div>
            </form>
        </div>
    );
};