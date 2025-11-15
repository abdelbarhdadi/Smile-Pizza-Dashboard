
import React, { useState } from 'react';
import { usePizzeria } from '../context/PizzeriaContext';

export const Settings: React.FC = () => {
    const { lowStockThreshold, setLowStockThreshold } = usePizzeria();
    const [threshold, setThreshold] = useState(lowStockThreshold);
    const [message, setMessage] = useState('');

    const handleSave = () => {
        setLowStockThreshold(threshold);
        setMessage('Paramètres enregistrés avec succès !');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white">Paramètres</h1>
            
            {message && <div className="bg-green-500 text-white p-3 rounded-lg text-center">{message}</div>}

            <div className="bg-gray-800 p-8 rounded-lg shadow-xl space-y-6">
                <div>
                    <label htmlFor="lowStockThreshold" className="block text-lg font-medium text-gray-300">
                        Seuil d'alerte de stock bas
                    </label>
                    <p className="text-sm text-gray-400 mt-1 mb-3">
                        Recevez une alerte lorsque le stock d'un ingrédient passe en dessous de cette valeur.
                        L'unité de référence est le gramme pour les poids, le millilitre pour les liquides, ou la pièce.
                    </p>
                    <input 
                        type="number" 
                        id="lowStockThreshold" 
                        value={threshold}
                        onChange={e => setThreshold(Number(e.target.value))}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                
                <div className="flex justify-end pt-6 border-t border-gray-700">
                    <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors">
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};
