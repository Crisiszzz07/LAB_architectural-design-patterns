import React, { useState } from 'react';
import { CODE_TEMPLATES } from '../../data/codeTemplates';
import { SupportedLanguage, SimulationStep } from '../../types';
import { DoubleBezelCard } from '../layout/DoubleBezelCard';
import { 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

interface SynchronizedCodeViewerProps {
  currentStep: SimulationStep | null;
}

export const SynchronizedCodeViewer: React.FC<SynchronizedCodeViewerProps> = ({
  currentStep,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('java');
  const [copied, setCopied] = useState(false);

  const activeTemplate = CODE_TEMPLATES[selectedLanguage];
  const activeLineNumber = currentStep ? currentStep.codeLineNumber[selectedLanguage] : null;

  const handleCopyCode = () => {
    const fullText = activeTemplate.lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFF6] p-4 sm:p-5 rounded-3xl border border-[#E8E2D4] shadow-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#B57DDA] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Sincronización en Tiempo Real
          </span>
          <h2 className="text-lg font-bold text-[#41478B]">
            Visor de Código de Referencia Ejecutable
          </h2>
          <p className="text-xs text-[#5A5478] mt-0.5">
            Las líneas de código se iluminan en vivo conforme la simulación del laboratorio avanza paso a paso.
          </p>
        </div>

        {/* Selector de lenguaje y botón de copiar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#FAF8FD] p-1 rounded-full border border-[#E8E2D4]">
            {(['java', 'typescript', 'python', 'go'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 ease-spring cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-[#B57DDA] text-white border border-[#B57DDA] shadow-sm font-bold'
                    : 'text-[#41478B] hover:text-[#2D2A4A] hover:bg-[#E8E2D4]/40'
                }`}
              >
                {lang === 'java' ? 'Java' : lang === 'typescript' ? 'TypeScript' : lang === 'python' ? 'Python' : 'Go'}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFF6] hover:bg-[#E8E2D4]/60 border border-[#E8E2D4] text-xs font-semibold text-[#41478B] transition-all cursor-pointer shadow-sm"
            title="Copiar código fuente"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#B57DDA]" />}
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      <DoubleBezelCard innerClassName="p-0">
        
        {/* Estado del paso actual */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#FAF8FD] border-b border-[#E8E2D4] text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-mono text-[#5A5478]">
              <span className="w-2 h-2 rounded-full bg-[#B57DDA] animate-pulse" />
              <span className="text-[#41478B] font-bold">{activeTemplate.languageLabel}</span>
              <span className="text-[#AAA0BB]">({activeTemplate.fileExtension})</span>
            </div>
          </div>

          {currentStep ? (
            <div className="flex items-center gap-2 bg-[#B57DDA]/20 border border-[#B57DDA]/40 px-3 py-1 rounded-full text-[11px] font-mono text-[#41478B] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B57DDA]" />
              <span>Ejecutando línea activa: {activeLineNumber}</span>
              <span className="text-[#6E688B]">({currentStep.codeLineKey})</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-[#AAA0BB] italic">
              (Inicia la simulación en el Laboratorio para ver el resaltado activo)
            </span>
          )}
        </div>

        {/* Bloque de código con la línea activa iluminada */}
        <div className="p-4 sm:p-6 overflow-x-auto bg-[#FFFFF6] font-mono text-xs leading-relaxed max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {activeTemplate.lines.map((line) => {
                const isLineActive = currentStep !== null && line.lineNumber === activeLineNumber;

                return (
                  <tr
                    key={line.lineNumber}
                    className={`transition-colors duration-200 ${
                      isLineActive
                        ? 'bg-[#B57DDA]/20 border-l-4 border-l-[#B57DDA] font-semibold text-[#41478B]'
                        : 'hover:bg-[#E8E2D4]/25 text-[#5A5478]'
                    }`}
                  >
                    <td className="w-10 py-1 pl-3 pr-4 text-right select-none opacity-40 font-mono text-[11px]">
                      {line.lineNumber}
                    </td>

                    <td className="w-5 py-1 text-center select-none text-[#B57DDA]">
                      {isLineActive && <ArrowRight className="w-3.5 h-3.5 inline animate-pulse" />}
                    </td>

                    <td
                      className={`py-1 pr-4 whitespace-pre font-mono ${
                        isLineActive
                          ? 'text-[#2D2A4A] font-bold'
                          : line.text.startsWith('//') || line.text.startsWith('#')
                          ? 'text-[#AAA0BB] italic'
                          : line.text.includes('class ') || line.text.includes('extends ') || line.text.includes('abstract ')
                          ? 'text-[#8E44AD] font-bold'
                          : line.text.includes('if ') || line.text.includes('else') || line.text.includes('return')
                          ? 'text-[#B57DDA] font-bold'
                          : 'text-[#41478B]'
                      }`}
                    >
                      {line.text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Explicación de lo que hace la línea activa */}
        {currentStep && (
          <div className="p-4 bg-[#B57DDA]/10 border-t border-[#B57DDA]/25 flex items-start gap-3 text-xs text-[#2D2A4A]">
            <Sparkles className="w-4 h-4 text-[#B57DDA] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#41478B] block mb-0.5">
                Explicación de la línea {activeLineNumber}:
              </span>
              <p className="leading-relaxed text-[#5A5478]">
                {currentStep.message}
              </p>
            </div>
          </div>
        )}

      </DoubleBezelCard>

      {/* Conceptos clave de implementación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <DoubleBezelCard innerClassName="p-5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#41478B] font-mono mb-1">
            1. Puntero al Sucesor
          </h4>
          <p className="text-xs text-[#5A5478] leading-relaxed">
            La clase abstracta <code className="text-[#41478B] bg-[#E8E2D4]/50 px-1 py-0.5 rounded font-mono font-bold">Handler</code> encapsula la referencia al siguiente objeto (<code className="text-[#2D2A4A] font-mono">nextApprover</code>) y el método <code className="text-[#2D2A4A] font-mono">setNext()</code>.
          </p>
        </DoubleBezelCard>

        <DoubleBezelCard innerClassName="p-5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#41478B] font-mono mb-1">
            2. Método Plantilla (Template Method)
          </h4>
          <p className="text-xs text-[#5A5478] leading-relaxed">
            La propagación <code className="text-[#41478B] bg-[#E8E2D4]/50 px-1 py-0.5 rounded font-mono font-bold">canHandle()</code> y la delegación al sucesor suelen ubicarse en la clase base para no duplicar código en los manejadores concretos.
          </p>
        </DoubleBezelCard>

        <DoubleBezelCard innerClassName="p-5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#41478B] font-mono mb-1">
            3. Encadenamiento Fluido (Fluent Interface)
          </h4>
          <p className="text-xs text-[#5A5478] leading-relaxed">
            Al hacer que <code className="text-[#41478B] bg-[#E8E2D4]/50 px-1 py-0.5 rounded font-mono font-bold">setNext()</code> devuelva el sucesor, el cliente puede escribir <code className="text-[#2D2A4A] font-mono">h1.setNext(h2).setNext(h3)</code> de forma concisa.
          </p>
        </DoubleBezelCard>

      </div>

    </div>
  );
};
