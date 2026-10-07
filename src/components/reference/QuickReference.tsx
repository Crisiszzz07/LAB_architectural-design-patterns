import React from 'react';
import { REAL_WORLD_CASES } from '../../data/realWorldCases';
import { QUICK_REFERENCE_DATA } from '../../data/quickReference';
import { InteractiveUml } from './InteractiveUml';
import { DoubleBezelCard } from '../layout/DoubleBezelCard';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  Terminal,
  BookmarkCheck
} from 'lucide-react';

export const QuickReference: React.FC = () => {
  return (
    <div className="space-y-8">
      
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-porcelain p-4 sm:p-5 rounded-3xl border border-bone shadow-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-lavender font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Compendio Teórico Rápido
          </span>
          <h2 className="text-lg font-bold text-french">
            Referencia del patrón & Diagrama UML
          </h2>
          <p className="text-xs text-french/70 mt-0.5">
            Paráfrasis de la definición, estructura de clases e indicadores de decisión para exámenes y proyectos de arquitectura.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-lavender/20 border border-lavender/40 text-french">
            Design Patterns (GoF)
          </span>
        </div>
      </div>

      {/* Definición Formal e Intención */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <DoubleBezelCard innerClassName="p-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-lavender" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-french font-mono">
              Paráfrasis en español (Gamma, Helm, Johnson, Vlissides)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-french italic leading-relaxed bg-bone/25 p-4 rounded-2xl border border-bone">
            "{QUICK_REFERENCE_DATA.gofDefinition}"
          </p>
        </DoubleBezelCard>

        <DoubleBezelCard innerClassName="p-6">
          <div className="flex items-center gap-2 mb-2">
            <BookmarkCheck className="w-4 h-4 text-lavender" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-french font-mono">
              Intención Arquitectónica Primaria
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-french leading-relaxed bg-bone/25 p-4 rounded-2xl border border-bone font-medium">
            {QUICK_REFERENCE_DATA.intent}
          </p>
          <p className="mt-3 text-xs text-french/80">En CoR clásico, un manejador atiende o delega. En la variante middleware, varios pueden participar, continuar o rechazar; algunos actúan al regresar la respuesta. La cadena no exige jerarquía organizativa ni sucesores mutables. Un terminal puede rechazar, registrar o escalar.</p>
        </DoubleBezelCard>

      </div>

      {/* Diagrama UML Interactivo */}
      <div>
        <div className="mb-3">
          <h3 className="text-base font-bold text-french flex items-center gap-2">
            <Terminal className="w-4 h-4 text-lavender" />
            <span>Topología y Diagrama de Clases UML</span>
          </h3>
        </div>
        <InteractiveUml />
      </div>

      {/* Matriz de Pros y Contras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ventajas (Pros) */}
        <DoubleBezelCard innerClassName="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-french font-mono uppercase tracking-wide">
              Ventajas Arquitectónicas (Pros)
            </h3>
          </div>

          <div className="space-y-3">
            {QUICK_REFERENCE_DATA.pros.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-bone/20 border border-bone">
                <h4 className="font-bold text-xs text-french mb-1">
                  ✓ {p.title}
                </h4>
                <p className="text-xs text-french/80 leading-relaxed font-medium">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </DoubleBezelCard>

        {/* Desventajas / Riesgos (Cons) */}
        <DoubleBezelCard innerClassName="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-sm text-french font-mono uppercase tracking-wide">
              Riesgos y Desventajas (Gotchas)
            </h3>
          </div>

          <div className="space-y-3">
            {QUICK_REFERENCE_DATA.cons.map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200">
                <h4 className="font-bold text-xs text-rose-900 mb-1">
                  ⚠ {c.title}
                </h4>
                <p className="text-xs text-french/80 leading-relaxed font-medium">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </DoubleBezelCard>

      </div>

      {/* Cuándo Usar vs Cuándo Evitar */}
      <DoubleBezelCard innerClassName="p-6">
        <h3 className="font-bold text-sm text-french font-mono uppercase tracking-wide mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-lavender" />
          <span>Criterio de Decisión en Evaluaciones de Arquitectura</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="p-4 rounded-2xl bg-lavender/15 border border-lavender/35">
            <span className="font-bold text-french block mb-2 font-mono uppercase tracking-wider text-[11px]">
              ¿Cuándo es el Patrón Adecuado?
            </span>
            <ul className="space-y-2 text-french font-medium">
              {QUICK_REFERENCE_DATA.whenToUse.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-lavender font-bold shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
            <span className="font-bold text-rose-900 block mb-2 font-mono uppercase tracking-wider text-[11px]">
              ¿Cuándo Debes Evitarlo?
            </span>
            <ul className="space-y-2 text-french font-medium">
              {QUICK_REFERENCE_DATA.whenToAvoid.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </DoubleBezelCard>

      {/* Bibliografía utilizada en la exposición */}
      <DoubleBezelCard innerClassName="p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-lavender/15 border border-lavender/35 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-lavender" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-lavender font-bold">
              Fuentes de la exposición
            </span>
            <h3 className="font-bold text-sm text-french font-mono uppercase tracking-wide">
              Bibliografía completa
            </h3>
            <p className="text-xs text-french/70 mt-1">
              Referencias empleadas para el análisis del patrón Chain of Responsibility y sus implicaciones arquitectónicas.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-bone">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead className="bg-bone/45 text-french">
              <tr>
                <th scope="col" className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider font-bold">Autores</th>
                <th scope="col" className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider font-bold">Título y edición</th>
                <th scope="col" className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider font-bold">Capítulos / enfoque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bone bg-porcelain text-french/85">
              <tr className="align-top">
                <td className="px-4 py-4 font-semibold text-french">Gamma, Helm, Johnson, Vlissides (Gang of Four)</td>
                <td className="px-4 py-4 leading-relaxed"><cite className="font-medium">Design Patterns: Elements of Reusable Object-Oriented Software</cite>. Addison-Wesley (1994).</td>
                <td className="px-4 py-4 leading-relaxed">Object Behavioral Patterns: Chain of Responsibility.</td>
              </tr>
              <tr className="align-top bg-surface/40">
                <td className="px-4 py-4 font-semibold text-french">Robert C. Martin ("Uncle Bob")</td>
                <td className="px-4 py-4 leading-relaxed"><cite className="font-medium">Clean Architecture: A Craftsman's Guide to Software Structure and Design</cite>. Prentice Hall (2017).</td>
                <td className="px-4 py-4 leading-relaxed">Capítulo 7 (Single Responsibility) y Capítulo 8 (Open/Closed Principle).</td>
              </tr>
              <tr className="align-top">
                <td className="px-4 py-4 font-semibold text-french">Mark Richards &amp; Neal Ford</td>
                <td className="px-4 py-4 leading-relaxed"><cite className="font-medium">Fundamentals of Software Architecture: An Engineering Approach</cite>. O'Reilly Media (2020).</td>
                <td className="px-4 py-4 leading-relaxed">Capítulo 3, “Modularity”: cohesión y acoplamiento.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-french/80 leading-relaxed">
          Fuentes oficiales de los casos y mecanismos: {REAL_WORLD_CASES.map((item, index) => <React.Fragment key={item.id}>{index > 0 && ' · '}<a href={item.source.url} target="_blank" rel="noreferrer" className="underline break-words">{item.source.title}</a></React.Fragment>)}. Los fragmentos del laboratorio son código didáctico propio; las correspondencias con CoR son análisis pedagógicos.
        </p>

        <p className="mt-3 text-[11px] text-french/60 italic">
          En pantallas pequeñas, desplaza la tabla horizontalmente para consultar todas las columnas.
        </p>
      </DoubleBezelCard>

    </div>
  );
};
