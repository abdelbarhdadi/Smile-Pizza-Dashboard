import React from 'react';
import { usePizzeria } from '../context/PizzeriaContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { formatCurrency } from '../utils/helpers';
import { Currency } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const KPI_CARD_STYLES = "bg-gray-800 p-6 rounded-lg shadow-lg";
const KPI_TITLE_STYLES = "text-sm font-medium text-gray-400";
const KPI_VALUE_STYLES = "mt-1 text-3xl font-semibold text-white";

export const Dashboard: React.FC = () => {
  const { metrics, lowStockThreshold, currency, setCurrency, dateRange, setDateRange } = usePizzeria();

  const topProductsData = metrics.topSellingProducts.map(p => ({
    name: p.product?.name,
    quantité: p.quantity,
  }));
  
  const ingredientConsumptionData = metrics.ingredientConsumption
  .filter(ic => ic.ingredient)
  .map(ic => ({
    name: ic.ingredient!.name,
    consommation: ic.quantity,
  }));

  const lowStockAlerts = metrics.remainingStock.filter(
    ing => ing.remaining < lowStockThreshold
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-gray-800 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                  <label htmlFor="startDate" className="text-sm text-gray-400">Du</label>
                  <input type="date" id="startDate" value={dateRange.startDate || ''} onChange={e => setDateRange({...dateRange, startDate: e.target.value})} className="bg-gray-700 border-gray-600 rounded-md text-white p-1 text-sm"/>
              </div>
              <div className="flex items-center gap-2">
                  <label htmlFor="endDate" className="text-sm text-gray-400">Au</label>
                  <input type="date" id="endDate" value={dateRange.endDate || ''} min={dateRange.startDate || ''} onChange={e => setDateRange({...dateRange, endDate: e.target.value})} className="bg-gray-700 border-gray-600 rounded-md text-white p-1 text-sm"/>
              </div>
               <button onClick={() => setDateRange({ startDate: null, endDate: null })} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors">
                  Reset
               </button>
              <div className="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                  <label htmlFor="currency" className="text-sm text-gray-400">Devise</label>
                  <select id="currency" value={currency} onChange={e => setCurrency(e.target.value as Currency)} className="bg-gray-700 border-gray-600 rounded-md text-white p-1 text-sm focus:ring-green-500 focus:border-green-500">
                      <option value="MAD">MAD</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                  </select>
              </div>
          </div>
      </div>


      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={KPI_CARD_STYLES}>
          <p className={KPI_TITLE_STYLES}>Chiffre d'Affaires</p>
          <p className={KPI_VALUE_STYLES}>{formatCurrency(metrics.totalRevenue, currency)}</p>
        </div>
        <div className={KPI_CARD_STYLES}>
          <p className={KPI_TITLE_STYLES}>Coût Matière</p>
          <p className={KPI_VALUE_STYLES}>{formatCurrency(metrics.totalMaterialCost, currency)}</p>
        </div>
        <div className={KPI_CARD_STYLES}>
          <p className={KPI_TITLE_STYLES}>Marge Brute</p>
          <p className={KPI_VALUE_STYLES}>{formatCurrency(metrics.grossMargin, currency)}</p>
        </div>
        <div className={`${KPI_CARD_STYLES} ${metrics.foodCostPercentage > 30 ? 'text-red-400' : 'text-green-400'}`}>
          <p className={KPI_TITLE_STYLES}>Food Cost %</p>
          <p className="mt-1 text-3xl font-semibold">{metrics.foodCostPercentage.toFixed(2)}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Historique des Ventes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.salesHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="date" tick={{ fill: '#A0AEC0' }} />
              <YAxis tickFormatter={(value) => formatCurrency(Number(value), currency)} tick={{ fill: '#A0AEC0' }}/>
              <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="CA" stroke="#38B2AC" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Produits les plus vendus</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis type="number" tick={{ fill: '#A0AEC0' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#A0AEC0' }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} formatter={(value) => `${value} unités`}/>
              <Legend />
              <Bar dataKey="quantité" fill="#4299E1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-white">Consommation des ingrédients</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ingredientConsumptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="consommation"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {ingredientConsumptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} formatter={(value, name, props) => [`${value} ${props.payload.payload.ingredient?.unit}`, name]}/>
               <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      {lowStockAlerts.length > 0 && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 rounded-lg shadow-lg" role="alert">
            <p className="font-bold text-xl mb-2">Alertes de stock bas !</p>
            <ul className="list-disc pl-5">
              {lowStockAlerts.map(ing => (
                <li key={ing.id}>
                  <strong>{ing.name}:</strong> {ing.remaining.toFixed(2)} {ing.unit} restants.
                </li>
              ))}
            </ul>
          </div>
      )}
    </div>
  );
};