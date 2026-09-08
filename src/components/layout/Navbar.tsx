import React, { useState } from 'react';
import { 
  GitFork, 
  Code2, 
  HelpCircle, 
  Layers, 
  BookOpen, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export type ActiveTab = 'workbench' | 'code' | 'quiz' | 'cases' | 'reference' | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'about' as ActiveTab, label: 'Propósito', icon: <Compass className="w-4 h-4" />, shortcut: '1' },
    { id: 'workbench' as ActiveTab, label: 'Laboratorio', icon: <GitFork className="w-4 h-4" />, shortcut: '2' },
    { id: 'code' as ActiveTab, label: 'Código Vivo', icon: <Code2 className="w-4 h-4" />, shortcut: '3' },
    { id: 'quiz' as ActiveTab, label: 'Autoevaluación', icon: <HelpCircle className="w-4 h-4" />, shortcut: '4' },
    { id: 'cases' as ActiveTab, label: 'Casos Reales', icon: <Layers className="w-4 h-4" />, shortcut: '5' },
    { id: 'reference' as ActiveTab, label: 'Referencia & UML', icon: <BookOpen className="w-4 h-4" />, shortcut: '6' },
  ];

  return (
    <>
      <header className="sticky top-4 z-40 px-4 mb-6">
        <nav className="mx-auto max-w-6xl rounded-full bg-[#FFFFF6]/90 backdrop-blur-xl ring-1 ring-[#E8E2D4] shadow-[0_4px_25px_rgba(65,71,139,0.06)] p-1.5 flex items-center justify-between gap-2 transition-all duration-300">
          
          <div className="flex items-center gap-2.5 pl-3 pr-2 py-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#41478B] to-[#B57DDA] flex items-center justify-center text-white shadow-md shadow-[#B57DDA]/30">
              <GitFork className="w-4 h-4" />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block text-xs font-bold tracking-wider text-[#41478B] uppercase">
                CoR Studio
              </span>
              <span className="block text-[10px] font-mono text-[#B57DDA] font-semibold">
                GoF Architecture Lab
              </span>
            </div>
          </div>

          {/* Pestañas (versión escritorio) */}
          <div className="hidden md:flex items-center gap-1 bg-[#FAF8FD] p-1 rounded-full border border-[#E8E2D4]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-spring cursor-pointer ${
                    isActive
                      ? 'bg-[#B57DDA] text-white shadow-md shadow-[#B57DDA]/30 font-bold'
                      : 'text-[#41478B] hover:text-[#2D2A4A] hover:bg-[#E8E2D4]/50'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#B57DDA]'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span className={`hidden lg:inline text-[9px] font-mono px-1 py-0.2 rounded ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#E8E2D4]/60 text-[#41478B]'
                  }`}>
                    {tab.shortcut}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Botón de menú para celulares */}
          <div className="flex items-center gap-2 pr-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-[#FFFFF6] border border-[#E8E2D4] flex items-center justify-center text-[#41478B] hover:bg-[#E8E2D4]/50"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Menú desplegable para celulares */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#2D2A4A]/50 backdrop-blur-xl flex flex-col p-6 animate-fade-in">
          <div className="bg-[#FFFFF6] rounded-3xl p-6 border border-[#E8E2D4] shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D4]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#41478B] to-[#B57DDA] flex items-center justify-center text-white">
                  <GitFork className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-[#41478B]">CoR Studio • Menú</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-[#FAF8FD] border border-[#E8E2D4] flex items-center justify-center text-[#41478B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#B57DDA] text-white border-[#B57DDA] font-bold shadow-md shadow-[#B57DDA]/30'
                      : 'bg-[#FAF8FD] border-[#E8E2D4] text-[#41478B] hover:bg-[#E8E2D4]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  <span className={`text-xs font-mono ${activeTab === tab.id ? 'opacity-80' : 'opacity-40'}`}>#{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
