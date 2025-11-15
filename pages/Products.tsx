
import React from 'react';
import { usePizzeria } from '../context/PizzeriaContext';
import { calculateMaterialCost, formatCurrency } from '../utils/helpers';
import { Category } from '../types';

interface ProductsProps {
    onEditProduct: (productId: string) => void;
    onNewProduct: () => void;
}

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

const DocumentDuplicateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375V9.375m0-3.375c.375.21.727.443 1.07.707m-1.07-.707V6.375c0-.621-.504-1.125-1.125-1.125H9.375" />
    </svg>
);


export const Products: React.FC<ProductsProps> = ({ onEditProduct, onNewProduct }) => {
    const { products, ingredients, deleteProduct, duplicateProduct } = usePizzeria();
    
    const categories = Object.values(Category);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Fiches Techniques Produits</h1>
                <button onClick={onNewProduct} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                    Nouveau Produit
                </button>
            </div>
            
            {categories.map(category => {
                const productsInCategory = products.filter(p => p.category === category);
                if (productsInCategory.length === 0) return null;
                
                return (
                    <div key={category}>
                        <h2 className="text-2xl font-semibold text-gray-300 mb-4 border-b-2 border-gray-700 pb-2">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productsInCategory.map(product => {
                                const materialCost = calculateMaterialCost(product.ingredients, ingredients);
                                const margin = product.salePrice - materialCost;
                                
                                return (
                                    <div key={product.id} className="bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col justify-between transition-transform hover:scale-105">
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                            <div className="mt-4 space-y-2 text-sm text-gray-300">
                                                <p><span className="font-semibold">Prix de vente:</span> {formatCurrency(product.salePrice)}</p>
                                                <p><span className="font-semibold">Coût matière:</span> {formatCurrency(materialCost)}</p>
                                                <p className={margin < 0 ? 'text-red-400' : 'text-green-400'}><span className="font-semibold">Marge brute:</span> {formatCurrency(margin)}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-700 p-3 flex justify-end space-x-2">
                                            <button onClick={() => duplicateProduct(product.id)} className="p-2 text-gray-300 hover:text-blue-400" title="Dupliquer"><DocumentDuplicateIcon className="w-5 h-5"/></button>
                                            <button onClick={() => onEditProduct(product.id)} className="p-2 text-gray-300 hover:text-yellow-400" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?') && deleteProduct(product.id)} className="p-2 text-gray-300 hover:text-red-500" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
