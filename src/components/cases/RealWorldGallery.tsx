import React, { useState } from 'react';
import { REAL_WORLD_CASES } from '../../data/realWorldCases';
import { DoubleBezelCard } from '../layout/DoubleBezelCard';
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Code
} from 'lucide-react';

export const RealWorldGallery: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(REAL_WORLD_CASES[0].id);

  const activeCase = REAL_WORLD_CASES.find((c) => c.id === selectedCaseId) || REAL_WORLD_CASES[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-porcelain p-4 sm:p-5 rounded-3xl border border-bone shadow-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-lavender font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Casos de Producción & Frameworks
          </span>
          <h2 className="text-lg font-bold text-french">
            Galería del Patrón en el Mundo Real
          </h2>
          <p className="text-xs text-french/70 mt-0.5">
            Explora cómo los frameworks modernos que usas a diario aplican Chain of Responsibility tras bambalinas.
          </p>
        </div>

        {/* Badge de Total de Casos */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-lavender/20 border border-lavender/40 text-french">
            5 Casos Documentados
          </span>
        </div>
      </div>

      {/* Selector de Casos (Horizontal Chips) */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
        {REAL_WORLD_CASES.map((item) => {
          const isSelected = item.id === activeCase.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedCaseId(item.id)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-spring flex items-center gap-2 cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-lavender/25 text-french border-lavender font-bold'
                  : 'bg-porcelain hover:bg-bone/40 text-french/80 border-bone'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-lavender" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Bento Grid del Caso Seleccionado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Análisis de Arquitectura y Mapeo GoF (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <DoubleBezelCard innerClassName="p-6">
            
            {/* Tag y Título */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-lavender/20 border border-lavender/40 text-french">
                {activeCase.tag}
              </span>
              <span className="text-xs font-mono font-bold text-french">
                {activeCase.tech}
              </span>
            </div>

            <h3 className="text-xl font-bold text-french mb-4">
              {activeCase.title}
            </h3>

            {/* Problema */}
            <div className="mb-4 p-4 rounded-2xl bg-bone/20 border border-bone">
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold block mb-1">
                El Desafío de Diseño:
              </span>
              <p className="text-xs text-french/80 leading-relaxed font-medium">
                {activeCase.problem}
              </p>
            </div>

            {/* Solución con CoR */}
            <div className="mb-6 p-4 rounded-2xl bg-lavender/15 border border-lavender/35">
              <span className="text-[11px] font-mono uppercase tracking-wider text-french font-bold block mb-1">
                Cómo Aplica Chain of Responsibility:
              </span>
              <p className="text-xs text-french leading-relaxed font-medium">
                {activeCase.patternApplication}
              </p>
            </div>

            {/* Tabla de Mapeo a Roles GoF */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-french font-mono mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-french" />
                <span>Mapeo Directo a los Roles del Patrón GoF:</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-bone text-french/60 text-[10px] uppercase font-bold">
                      <th className="py-2 pr-3">Rol GoF</th>
                      <th className="py-2 px-3">En {activeCase.tech}</th>
                      <th className="py-2 pl-3">Responsabilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bone">
                    {activeCase.rolesMapping.map((rm, idx) => (
                      <tr key={idx} className="hover:bg-bone/20">
                        <td className="py-2.5 pr-3 text-french font-bold whitespace-nowrap">
                          {rm.patternRole}
                        </td>
                        <td className="py-2.5 px-3 text-french font-bold whitespace-nowrap">
                          {rm.realComponent}
                        </td>
                        <td className="py-2.5 pl-3 text-french/80 font-sans text-[11px] leading-snug">
                          {rm.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lección de Arquitectura */}
            <div className="mt-6 pt-4 border-t border-bone text-xs text-french flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-lavender shrink-0 mt-0.5" />
              <div>
                <strong className="text-french block mb-0.5 font-bold">Lección de Arquitectura:</strong>
                <p className="italic text-french/80">{activeCase.keyTakeaway}</p>
              </div>
            </div>

          </DoubleBezelCard>
        </div>

        {/* Columna Derecha: Código de Producción Real (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <DoubleBezelCard innerClassName="p-0">
            
            <div className="flex items-center justify-between px-5 py-3 bg-bone/35 border-b border-bone text-xs">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-lavender" />
                <span className="font-mono text-french font-bold">
                  Implementación en {activeCase.tech}
                </span>
              </div>
              <span className="text-[10px] font-mono text-french/60 uppercase font-bold">
                {activeCase.language}
              </span>
            </div>

            <div className="p-4 sm:p-5 font-mono text-[11px] leading-relaxed overflow-x-auto bg-porcelain max-h-[580px] overflow-y-auto border-t border-bone">
              <pre className="text-french">
                <code>{activeCase.codeSnippet}</code>
              </pre>
            </div>

            <div className="p-4 bg-bone/35 border-t border-bone text-[11px] text-french/70 flex items-center justify-between font-medium">
              <span>Arquitectura modular y desacoplada</span>
              <span className="text-french font-mono font-bold">Open/Closed Principle</span>
            </div>

          </DoubleBezelCard>
        </div>

      </div>

    </div>
  );
};
