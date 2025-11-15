
import React from 'react';
import { usePizzeria } from '../context/PizzeriaContext';
import { exportToCSV, calculateMaterialCost, formatCurrency } from '../utils/helpers';

const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const Export: React.FC = () => {
    const { products, ingredients, salesByPeriod, metrics } = usePizzeria();

    const handleExportProducts = () => {
        const data = products.map(p => ({
            id: p.id,
            nom: p.name,
            categorie: p.category,
            prix_vente: p.salePrice,
            cout_matiere: calculateMaterialCost(p.ingredients, ingredients).toFixed(2),
            marge: (p.salePrice - calculateMaterialCost(p.ingredients, ingredients)).toFixed(2)
        }));
        exportToCSV(data, 'produits');
    };

    const handleExportIngredients = () => {
        const data = metrics.remainingStock.map(i => ({
            id: i.id,
            nom: i.name,
            unite: i.unit,
            stock_initial: i.stock,
            stock_consomme: (i as any).consumed.toFixed(2),
            stock_restant: i.remaining.toFixed(2),
            prix_achat: i.purchasePrice,
            date_approvisionnement: i.supplyDate
        }));
        exportToCSV(data, 'ingredients');
    };
    
    const handleExportSales = () => {
        const data = Object.entries(salesByPeriod).flatMap(([date, dailySales]) => 
            Object.entries(dailySales).map(([productId, quantity]) => {
                const product = products.find(p => p.id === productId);
                return {
                    date,
                    produit_id: productId,
                    produit_nom: product?.name || 'N/A',
                    quantite: quantity,
                    prix_unitaire: product?.salePrice || 0,
                    total_vente: (product?.salePrice || 0) * quantity
                }
            })
        );
        exportToCSV(data, 'ventes');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">Export de Données</h1>
            <p className="text-gray-400">Téléchargez vos données au format CSV pour une analyse externe ou une sauvegarde.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ExportCard title="Exporter les Produits" description="Liste de tous vos produits avec prix, coût matière et marge." onExport={handleExportProducts} />
                <ExportCard title="Exporter les Ingrédients" description="État actuel de votre stock d'ingrédients, incluant le stock restant." onExport={handleExportIngredients} />
                <ExportCard title="Exporter les Ventes" description="Historique complet de toutes les ventes enregistrées." onExport={handleExportSales} />
            </div>
        </div>
    );
};

const ExportCard: React.FC<{title: string, description: string, onExport: () => void}> = ({title, description, onExport}) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-start">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-gray-400 mt-2 flex-grow">{description}</p>
        <button onClick={onExport} className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Télécharger
        </button>
    </div>
);
