
import React, { useState } from 'react';
import type { Page } from '../types';
import { LOGO_URL } from '../constants';

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const CubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.102-.816l4.418-8.49a.875.875 0 00-.527-1.215H4.233c-.445 0-.845.28-.986.702L2.25 3v.004M4.5 21a2.25 2.25 0 004.5 0M12 21a2.25 2.25 0 004.5 0" />
    </svg>
);

const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const Cog6ToothIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28c.09-.543.56-.941 1.11-.941z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const Bars3Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);


interface SidebarProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, navigateTo }) => {
  const [isOpen, setIsOpen] = useState(false);
    
  const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'Dashboard', label: 'Dashboard', icon: <ChartBarIcon className="w-6 h-6" /> },
    { page: 'Products', label: 'Fiches produits', icon: <BookOpenIcon className="w-6 h-6" /> },
    { page: 'Ingredients', label: 'Ingrédients & Stock', icon: <CubeIcon className="w-6 h-6" /> },
    { page: 'Sales', label: 'Saisie des ventes', icon: <ShoppingCartIcon className="w-6 h-6" /> },
    { page: 'Export', label: 'Export', icon: <ArrowDownTrayIcon className="w-6 h-6" /> },
    { page: 'Settings', label: 'Paramètres', icon: <Cog6ToothIcon className="w-6 h-6" /> },
  ];

  const NavLink: React.FC<{ page: Page; label: string; icon: React.ReactNode }> = ({ page, label, icon }) => {
    const isActive = currentPage === page;
    return (
      <li>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); navigateTo(page); setIsOpen(false); }}
          className={`flex items-center p-3 rounded-lg transition-colors ${
            isActive ? 'bg-green-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {icon}
          <span className="ml-3 font-medium">{label}</span>
        </a>
      </li>
    );
  };
  
  const sidebarContent = (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center p-4 border-b border-gray-700">
            <img src={LOGO_URL} alt="Logo" className="h-16 w-auto" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <ul>
                {navItems.map(item => <NavLink key={item.page} {...item} />)}
            </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-500">
            Pizzeria Manager &copy; 2024
        </div>
      </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-gray-800 border-b border-gray-700 h-16 flex items-center px-4 shadow-md">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none p-1">
            <Bars3Icon className="w-8 h-8" />
        </button>
        <div className="ml-4 font-bold text-xl text-white flex items-center">
            <img src={LOGO_URL} alt="Logo" className="h-8 w-auto mr-2" />
            <span>Pizzeria Manager</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
         <div className="relative w-64 bg-gray-800 h-full shadow-2xl flex flex-col">
             {/* Close button inside sidebar */}
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {sidebarContent}
         </div>
         <div className="fixed inset-0 bg-black opacity-50 -z-10" onClick={() => setIsOpen(false)}></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-800 flex-shrink-0 shadow-2xl border-r border-gray-700">
        {sidebarContent}
      </aside>
    </>
  );
};