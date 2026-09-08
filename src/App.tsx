import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { ChainSimulator } from './components/workbench/ChainSimulator';
import { SynchronizedCodeViewer } from './components/code/SynchronizedCodeViewer';
import { QuizModule } from './components/quiz/QuizModule';
import { RealWorldGallery } from './components/cases/RealWorldGallery';
import { QuickReference } from './components/reference/QuickReference';
import { AboutPage } from './components/about/AboutPage';
import { SimulationStep } from './types';
import { GitFork } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');
  const [currentStep, setCurrentStep] = useState<SimulationStep | null>(null);

  // Atajos de teclado para cambiar de pestaña con los números 1 al 6
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === '1') setActiveTab('about');
      if (e.key === '2') setActiveTab('workbench');
      if (e.key === '3') setActiveTab('code');
      if (e.key === '4') setActiveTab('quiz');
      if (e.key === '5') setActiveTab('cases');
      if (e.key === '6') setActiveTab('reference');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between selection:bg-[#B57DDA]/30 selection:text-[#41478B]">

      <div>
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Contenido de la pestaña actual */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-mono font-bold bg-[#B57DDA]/15 text-[#41478B] border border-[#B57DDA]/30 shadow-sm">
                Arquitectura de Software • Laboratorio GoF
              </span>
              <span className="hidden sm:inline text-xs text-[#AAA0BB] font-mono">
                Atajos: [1] Propósito [2] Lab [3] Código [4] Quiz [5] Casos [6] UML
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5A5478]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Laboratorio Interactivo</span>
            </div>
          </div>

          {activeTab === 'workbench' && (
            <div className="animate-fade-in">
              <ChainSimulator onStepChange={setCurrentStep} />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="animate-fade-in">
              <SynchronizedCodeViewer currentStep={currentStep} />
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="animate-fade-in">
              <QuizModule />
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="animate-fade-in">
              <RealWorldGallery />
            </div>
          )}

          {activeTab === 'reference' && (
            <div className="animate-fade-in">
              <QuickReference />
            </div>
          )}

          {activeTab === 'about' && (
            <div className="animate-fade-in">
              <AboutPage onNavigate={setActiveTab} />
            </div>
          )}

        </main>
      </div>

      <footer className="border-t border-[#E8E2D4] bg-[#FFFFF6]/80 py-7 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4 text-xs text-[#5A5478] font-mono">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#41478B] to-[#B57DDA] flex items-center justify-center text-white shadow-sm">
              <GitFork className="w-3.5 h-3.5" />
            </div>
            <span className="text-[#41478B] font-semibold">
              Chain of Responsibility Interactive Studio • Universidad de Cartagena
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:justify-self-center">
            <span>Patrones de Diseño GoF</span>
          </div>

          <a
            href="https://github.com/Crisiszzz07"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[#41478B] transition-all duration-500 ease-spring hover:bg-[#B57DDA]/15 hover:text-[#2D2A4A] sm:justify-self-end focus-visible:outline-none"
            aria-label="Abrir el perfil de GitHub de Crisiszzz07"
          >
            <GitFork className="h-4 w-4 transition-transform duration-500 ease-spring group-hover:-translate-y-0.5" />
            <span className="font-semibold">github.com/Crisiszzz07</span>
          </a>
        </div>
      </footer>

    </div>
  );
};
export default App;
