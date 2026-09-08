import React, { useState, useEffect, useRef } from 'react';
import { CODE_TEMPLATES } from '../../data/codeTemplates';
import { SupportedLanguage, SimulationStep } from '../../types';
import { 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

interface InlineCodeViewerProps {
  currentStep: SimulationStep | null;
}

export const InlineCodeViewer: React.FC<InlineCodeViewerProps> = ({
  currentStep,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('java');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef<HTMLTableRowElement | null>(null);

  const activeTemplate = CODE_TEMPLATES[selectedLanguage];
  const activeLineNumber = currentStep ? currentStep.codeLineNumber[selectedLanguage] : null;

  // Auto-scroll a la línea que se está ejecutando
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineNumber]);

  const handleCopy = () => {
    const fullText = activeTemplate.lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#E8E2D4] bg-[#FFFFF6] overflow-hidden shadow-sm transition-all duration-300">
      
      {/* Barra superior de controles */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#FAF8FD] border-b border-[#E8E2D4]">
        
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#B57DDA]" />
          <span className="text-xs font-bold text-[#41478B] font-mono">
            Código Vivo Sincronizado
          </span>
          {activeLineNumber ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B57DDA]/20 text-[#41478B] border border-[#B57DDA]/40 animate-pulse">
              Línea activa: {activeLineNumber}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-[#AAA0BB] italic hidden sm:inline">
              (En espera de emisión)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          
          {/* Selector de lenguaje */}
          <div className="flex items-center bg-[#FFFFF6] p-0.5 rounded-full border border-[#E8E2D4]">
            {(['java', 'typescript', 'python', 'go'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-[#B57DDA] text-white font-bold shadow-sm'
                    : 'text-[#41478B] hover:text-[#2D2A4A] hover:bg-[#E8E2D4]/40'
                }`}
              >
                {lang === 'java' ? 'Java' : lang === 'typescript' ? 'TS' : lang === 'python' ? 'Py' : 'Go'}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="w-7 h-7 rounded-full bg-[#FFFFF6] hover:bg-[#E8E2D4]/60 border border-[#E8E2D4] flex items-center justify-center text-[#41478B] transition-all cursor-pointer shadow-sm"
            title="Copiar código fuente"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FFFFF6] hover:bg-[#E8E2D4]/60 border border-[#E8E2D4] text-[#41478B] transition-all cursor-pointer shadow-sm"
          >
            <span>{isExpanded ? 'Ocultar' : 'Ver Código'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

        </div>

      </div>

      {isExpanded && (
        <div className="transition-all animate-fade-in">
          <div className="p-3 bg-[#FFFFF6] font-mono text-xs leading-relaxed max-h-56 overflow-y-auto overflow-x-auto border-t border-[#E8E2D4]">
            <table className="w-full border-collapse">
              <tbody>
                {activeTemplate.lines.map((line) => {
                  const isLineActive = currentStep !== null && line.lineNumber === activeLineNumber;

                  return (
                    <tr
                      key={line.lineNumber}
                      ref={isLineActive ? activeLineRef : null}
                      className={`transition-colors duration-200 ${
                        isLineActive
                          ? 'bg-[#B57DDA]/15 ring-1 ring-[#B57DDA]/50 shadow-sm'
                          : 'hover:bg-[#FAF8FD]'
                      }`}
                    >
                      {/* Número de línea para el código */}
                      <td
                        className={`py-0.5 px-2 text-right select-none w-10 border-r border-[#E8E2D4] font-mono text-[10px] ${
                          isLineActive
                            ? 'text-[#41478B] font-bold bg-[#B57DDA]/20'
                            : 'text-[#AAA0BB]'
                        }`}
                      >
                        {line.lineNumber}
                      </td>

                      {/* Indicador flecha */}
                      <td className="w-5 text-center select-none">
                        {isLineActive && (
                          <ArrowRight className="w-3 h-3 text-[#B57DDA] inline-block animate-pulse" />
                        )}
                      </td>

                      {/* Texto de código  */}
                      <td
                        className={`py-0.5 pl-2 whitespace-pre font-mono text-[11px] ${
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

          {/* explicación de la línea activa */}
          {currentStep && (
            <div className="px-3.5 py-2 bg-[#B57DDA]/10 border-t border-[#B57DDA]/25 flex items-start gap-2 text-xs text-[#2D2A4A]">
              <Sparkles className="w-3.5 h-3.5 text-[#B57DDA] shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-relaxed">
                <strong className="text-[#41478B] font-bold mr-1">
                  Paso activo (Línea {activeLineNumber}):
                </strong>
                <span>{currentStep.message}</span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
