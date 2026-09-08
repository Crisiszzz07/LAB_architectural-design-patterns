import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { DoubleBezelCard } from '../layout/DoubleBezelCard';
import { ButtonInButton } from '../layout/ButtonInButton';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Sparkles,
  BookOpen,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const QuizModule: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[question.id];
  const isAnswered = selectedOptionId !== undefined;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score++;
      }
    });
    return score;
  };

  const totalScore = calculateScore();
  const percentage = Math.round((totalScore / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="space-y-6">
      
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-[#FFFFF6] p-5 rounded-3xl border border-[#E8E2D4] shadow-sm"
        style={{ backgroundColor: '#FFFFF6' }}
      >
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#B57DDA] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Evaluación Formativa Universitaria
          </span>
          <h2 className="text-lg font-bold text-[#41478B]">
            Quiz de Autoevaluación de Conceptos GoF
          </h2>
          <p className="text-xs text-[#41478B]/70 mt-0.5">
            Pon a prueba tu comprensión del receptor implícito, la estructura de la cadena, sus consecuencias y su aplicación en el ERP.
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-3 border-t border-[#E8E2D4] pt-4 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-mono text-[#41478B]/60">Progreso:</span>
            <div className="font-mono text-xs font-bold text-[#B57DDA]">
              {Object.keys(selectedAnswers).length} / {QUIZ_QUESTIONS.length} respondidas
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="w-8 h-8 rounded-full bg-[#E8E2D4]/40 hover:bg-[#E8E2D4] border border-[#E8E2D4] flex items-center justify-center text-[#41478B]/70 hover:text-[#41478B] transition-all cursor-pointer shadow-sm"
            title="Reiniciar cuestionario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!showResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 flex flex-col gap-4">
            <DoubleBezelCard innerClassName="p-6">
              
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E8E2D4]">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B57DDA]/15 text-[#41478B] border border-[#B57DDA]/30">
                  {question.topic}
                </span>
                <span className="text-xs font-mono text-[#41478B]/60 font-semibold">
                  Pregunta {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#41478B] mb-6 leading-snug">
                {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.id === question.correctOptionId;

                  let cardStyle = 'bg-[#FAF8FD] hover:bg-[#E8E2D4]/50 border-[#E8E2D4] text-[#41478B]';
                  let icon = <span className="w-5 h-5 rounded-full border border-[#E8E2D4] bg-[#FFFFF6] flex items-center justify-center text-[10px] font-mono text-[#41478B] font-bold">{opt.id.slice(-1).toUpperCase()}</span>;

                  if (isAnswered) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm';
                      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                    } else if (isSelected) {
                      cardStyle = 'bg-rose-50 border-rose-400 text-rose-950 shadow-sm';
                      icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                    } else {
                      cardStyle = 'bg-[#FAF8FD]/50 border-[#E8E2D4]/50 text-[#41478B]/40 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ease-spring flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${cardStyle}`}
                    >
                      <div className="mt-0.5 shrink-0">{icon}</div>
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm font-semibold leading-relaxed block">
                          {opt.text}
                        </span>

                        {isAnswered && (isCorrect || isSelected) && (
                          <p
                            className={`mt-2.5 pt-2.5 border-t text-xs leading-relaxed font-normal ${
                              isCorrect
                                ? 'border-emerald-200 text-emerald-900'
                                : 'border-rose-200 text-rose-900'
                            }`}
                          >
                            <strong>{isCorrect ? '✓ Justificación:' : '✗ Por qué no es correcta:'}</strong> {opt.explanation}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div 
                  className="mt-6 p-4 rounded-2xl bg-[#B57DDA]/15 border border-[#B57DDA]/35 text-xs text-[#41478B] animate-fade-in"
                  style={{ backgroundColor: 'rgba(181, 125, 218, 0.15)' }}
                >
                  <div className="flex items-center gap-2 text-[#41478B] font-bold mb-1">
                    <BookOpen className="w-4 h-4 text-[#B57DDA]" />
                    <span>Conclusión Arquitectónica GoF:</span>
                  </div>
                  <p className="leading-relaxed text-[#41478B]/85 font-medium">
                    {question.architecturalInsight}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E8E2D4]">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-full bg-[#E8E2D4]/40 hover:bg-[#E8E2D4] border border-[#E8E2D4] text-xs font-semibold text-[#41478B] flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <ButtonInButton
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  disabled={!isAnswered}
                  icon={<ChevronRight className="w-4 h-4 text-[#FFFFF6]" />}
                >
                  {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                </ButtonInButton>
              </div>

            </DoubleBezelCard>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            <DoubleBezelCard innerClassName="p-5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#41478B] font-mono mb-3">
                Mapa del Cuestionario
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const ans = selectedAnswers[q.id];
                  const isCurrent = idx === currentQuestionIndex;
                  const isCorrect = ans === q.correctOptionId;

                  let color = 'bg-[#FAF8FD] border-[#E8E2D4] text-[#41478B]/70';
                  if (ans !== undefined) {
                    color = isCorrect
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-rose-100 border-rose-300 text-rose-900 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-xl border flex flex-col items-center justify-center text-xs font-mono transition-all cursor-pointer ${color} ${
                        isCurrent ? 'ring-2 ring-[#B57DDA] scale-105 shadow-sm' : ''
                      }`}
                    >
                      <span>Q{idx + 1}</span>
                      <span className="text-[9px] font-bold">
                        {ans !== undefined ? (isCorrect ? '✓' : '✗') : '•'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E2D4] space-y-2 text-[11px] text-[#41478B]/70 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Respuesta correcta con justificación</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Respuesta con error conceptual explicado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E8E2D4]" />
                  <span>Pendiente de responder</span>
                </div>
              </div>
            </DoubleBezelCard>
          </div>

        </div>
      ) : (
        /* Pantalla de Resultados Finales */
        <DoubleBezelCard innerClassName="p-8 text-center max-w-2xl mx-auto">
          <div 
            className="w-16 h-16 rounded-full bg-[#B57DDA]/20 border border-[#B57DDA]/40 mx-auto flex items-center justify-center text-[#41478B] mb-4 shadow-sm"
            style={{ backgroundColor: 'rgba(181, 125, 218, 0.2)' }}
          >
            <Award className="w-8 h-8 text-[#B57DDA]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#41478B] mb-2">
            {percentage >= 80 ? '¡Excelente Dominio de Arquitectura!' : percentage >= 50 ? 'Buen Intento, Repasa los Gotchas' : 'Necesitas Profundizar en los Fundamentos'}
          </h3>

          <p className="text-xs sm:text-sm text-[#41478B]/80 max-w-md mx-auto mb-6 leading-relaxed">
            Has obtenido <span className="font-bold text-[#41478B]">{totalScore}</span> de <span className="font-bold text-[#41478B]">{QUIZ_QUESTIONS.length}</span> puntos ({percentage}%).
          </p>

          <div 
            className="inline-block p-4 rounded-2xl bg-[#FAF8FD] border border-[#E8E2D4] mb-6 text-xs text-left w-full max-w-md space-y-2 font-mono"
            style={{ backgroundColor: '#FAF8FD' }}
          >
            <div className="flex justify-between">
              <span className="text-[#41478B]/70">Receptor Implícito & Desacoplamiento:</span>
              <span className="text-[#41478B] font-bold">✓ Evaluado</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#41478B]/70">Principios SOLID (SRP & OCP):</span>
              <span className="text-[#41478B] font-bold">✓ Evaluado</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#41478B]/70">Estructura, uso y caso ERP:</span>
              <span className="text-[#41478B] font-bold">✓ Evaluado</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ButtonInButton
              variant="primary"
              size="md"
              onClick={handleRestart}
              icon={<RotateCcw className="w-4 h-4 text-[#FFFFF6]" />}
            >
              Reintentar Cuestionario
            </ButtonInButton>
          </div>
        </DoubleBezelCard>
      )}

    </div>
  );
};
