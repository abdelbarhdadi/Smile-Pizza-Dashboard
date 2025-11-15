
import React, { useState } from 'react';
import { PizzeriaProvider } from './context/PizzeriaContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { ProductForm } from './pages/ProductForm';
import { Ingredients } from './pages/Ingredients';
import { Sales } from './pages/Sales';
import { Export } from './pages/Export';
import { Settings } from './pages/Settings';
import type { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const navigateTo = (page: Page) => {
    setEditingProductId(null);
    setCurrentPage(page);
  };
  
  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
    setCurrentPage('ProductForm');
  };
  
  const handleNewProduct = () => {
    setEditingProductId(null);
    setCurrentPage('ProductForm');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Products':
        return <Products onEditProduct={handleEditProduct} onNewProduct={handleNewProduct} />;
      case 'ProductForm':
        return <ProductForm productId={editingProductId} onFormSubmit={() => navigateTo('Products')} />;
      case 'Ingredients':
        return <Ingredients />;
      case 'Sales':
        return <Sales />;
      case 'Export':
        return <Export />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <PizzeriaProvider>
      <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
        <Sidebar currentPage={currentPage} navigateTo={navigateTo} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </PizzeriaProvider>
  );
};

export default App;
