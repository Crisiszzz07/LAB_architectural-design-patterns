import React from 'react';
import { DoubleBezelCard } from '../layout/DoubleBezelCard';
import { ActiveTab } from '../layout/Navbar';
import {
  Compass,
  Target,
  Sparkles,
  GitFork,
  Code2,
  HelpCircle,
  Layers,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  Workflow,
  GraduationCap,
  Boxes,
  Zap,
  Network
} from 'lucide-react';

interface AboutPageProps {
  onNavigate?: (tab: ActiveTab) => void;
  onOpenLab?: (mode: 'explore' | 'challenges') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenLab }) => {
  const learningGoals = [
    {
      icon: <Network className="w-5 h-5 text-[#B57DDA]" />,
      title: "Desacoplamiento y Receptor Implícito",
      code: "Emisor Desacoplado",
      description:
        "Comprender cómo el cliente emite una petición sin necesidad de conocer cuál objeto concreto la procesará, delegando en la cadena la selección del receptor definitivo. El cliente puede conocer su configuración.",
      benefit: "Reduce el acoplamiento y promueve la reutilización de código.",
    },
    {
      icon: <Workflow className="w-5 h-5 text-[#41478B]" />,
      title: "Sensibilidad al Orden y Topología",
      code: "Secuencia Dinámica",
      description:
        "Experimentar visualmente cómo la posición relativa de cada eslabón determina qué regla se evalúa primero y cómo una solicitud puede detenerse prematuramente o continuar.",
      benefit: "Permite reconfigurar reglas de negocio en tiempo de ejecución.",
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
      title: "Riesgo GoF: 'Receipt is not guaranteed'",
      code: "Peticiones Huérfanas",
      description:
        "Evidenciar el riesgo canónico documentado por el Gang of Four cuando una solicitud no coincide con ningún manejador y queda sin atender, y cómo responder mediante un terminal que rechace, registre o escale.",
      benefit: "Enseña patrones defensivos esenciales para producción.",
    },
    {
      icon: <Code2 className="w-5 h-5 text-[#B57DDA]" />,
      title: "Correspondencia didáctica ↔ Código",
      code: "Sincronización en Vivo",
      description:
        "Relacionar los eventos del simulador con operaciones equivalentes en fragmentos didácticos de Java, TypeScript, Python y Go. El navegador no ejecuta esos ejemplos.",
      benefit: "Cierra la brecha entre la teoría académica y el código real.",
    },
    {
      icon: <Boxes className="w-5 h-5 text-[#41478B]" />,
      title: "Principios favorecidos (SRP & OCP)",
      code: "Principios de Diseño",
      description:
        "Estudiar cómo CoR favorece SRP y OCP sin garantizar SOLID. Añadir un manejador puede requerir cambiar el ensamblado, aunque se conserven los existentes.",
      benefit: "Arquitectura escalable, modular y fácilmente testeable.",
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      title: "Conexión con la Industria Contemporánea",
      code: "Middlewares Modernos",
      description:
        "Comparar middleware documentado en Express y Spring Security con mecanismos relacionados, como propagación DOM y excepciones, y analogías de escalamiento ITSM.",
      benefit: "Aplicabilidad inmediata en frameworks web de producción.",
    },
  ];

  const modules = [
    {
      tab: 'workbench' as ActiveTab,
      label: 'Laboratorio · Desafíos',
      labMode: 'challenges' as const,
      icon: <GitFork className="w-4 h-4 text-[#B57DDA]" />,
      badge: 'Reto por equipos',
      summary: 'Resuelve tres misiones con cadenas rotas, decisiones y consecuencias visibles. Prueba tu reparación y defiende el orden con evidencia.',
      actionText: 'Entrar al Laboratorio',
    },
    {
      tab: 'workbench' as ActiveTab,
      label: 'Laboratorio · Exploración libre',
      labMode: 'explore' as const,
      icon: <GitFork className="w-4 h-4 text-[#B57DDA]" />,
      badge: 'Simulador en Vivo',
      summary:
        'Construye, reordena y manipula cadenas de manejadores. Elige dominios didácticos (Gastos, Soporte TI, Escalamiento de riesgo), controla la velocidad de ejecución y observa la telemetría paso a paso.',
      actionText: 'Explorar Simulador',
    },
    {
      tab: 'code' as ActiveTab,
      label: '2. Visor de Código Sincronizado',
      icon: <Code2 className="w-4 h-4 text-[#41478B]" />,
      badge: 'Java • TS • Python • Go',
      summary:
        'Inspecciona fragmentos ilustrativos. El resaltado relaciona los eventos de la simulación con operaciones equivalentes del lenguaje elegido; el código estático muestra una configuración de referencia.',
      actionText: 'Ver Código',
    },
    {
      tab: 'quiz' as ActiveTab,
      label: '3. Autoevaluación Conceptual',
      icon: <HelpCircle className="w-4 h-4 text-emerald-600" />,
      badge: '8 Preguntas Universitarias',
      summary:
        'Pon a prueba tu dominio sobre receptores implícitos, SRP y OCP, recepción no garantizada, estructura, aplicabilidad, una propuesta para RF03 y observabilidad con retroalimentación explicada de cada opción.',
      actionText: 'Iniciar Quiz',
    },
    {
      tab: 'cases' as ActiveTab,
      label: '4. Casos y mecanismos relacionados',
      icon: <Layers className="w-4 h-4 text-purple-600" />,
      badge: 'Casos Reales',
      summary:
        'Explora middleware documentado (Express y Spring Security), mecanismos relacionados (DOM y excepciones) y una analogía de negocio (ITSM), con fuentes y código didáctico propio.',
      actionText: 'Ver Casos Reales',
    },
    {
      tab: 'reference' as ActiveTab,
      label: '5. Referencia & Diagrama UML',
      icon: <BookOpen className="w-4 h-4 text-[#41478B]" />,
      badge: 'Diagrama Interactivo',
      summary:
        'Consulta una paráfrasis en español de la definición del GoF, inspecciona el diagrama de clases interactivo en SVG con tarjetas detalladas de cada clase, y analiza la matriz de ventajas, desventajas y aplicabilidad.',
      actionText: 'Consultar UML',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">

      <DoubleBezelCard innerClassName="p-6 sm:p-10 bg-gradient-to-br from-[#FFFFF6] via-[#FAF8FD] to-[#E8E2D4]/30">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#B57DDA]/20 border border-[#B57DDA]/40 text-[#41478B]">
              <Compass className="w-3.5 h-3.5 text-[#B57DDA]" />
              Propósito & Visión General
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#5A5478] bg-[#E8E2D4]/60 border border-[#E8E2D4]">
              <GraduationCap className="w-3 h-3 text-[#41478B]" />
              Universidad de Cartagena • Arquitectura de Software
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#41478B] tracking-tight">
            ¿Qué es esta plataforma y cuál es su objetivo?
          </h1>

          <p className="text-sm sm:text-base text-[#41478B]/80 leading-relaxed font-normal">
            Este sitio es un <strong className="text-[#41478B] font-semibold">Laboratorio Web Interactivo (Interactive Workbench)</strong> concebido
            como un recurso educativo avanzado para la enseñanza y el aprendizaje activo del patrón de diseño de comportamiento
            <span className="text-[#B57DDA] font-semibold"> Chain of Responsibility (Cadena de Responsabilidad)</span>, formulado originalmente
            por el <strong className="text-[#41478B] font-semibold">Gang of Four (GoF)</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onNavigate && (
              <>
                <button
                  onClick={() => onOpenLab ? onOpenLab('explore') : onNavigate('workbench')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#41478B] to-[#B57DDA] shadow-md shadow-[#B57DDA]/30 hover:opacity-95 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Ir al Simulador de Cadena</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('quiz')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#41478B] bg-[#FFFFF6] border border-[#E8E2D4] hover:bg-[#E8E2D4]/50 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Probar Autoevaluación</span>
                </button>

                <button
                  onClick={() => onNavigate('reference')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#41478B] bg-[#FFFFF6] border border-[#E8E2D4] hover:bg-[#E8E2D4]/50 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#B57DDA]" />
                  <span>Ver Diagrama UML GoF</span>
                </button>
              </>
            )}
          </div>
        </div>
      </DoubleBezelCard>

      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#41478B] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            1
          </div>
          <h2 className="text-lg font-bold text-[#41478B]">
            ¿Qué es exactamente esta aplicación?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <DoubleBezelCard innerClassName="p-5 flex flex-col justify-between h-full bg-[#FFFFF6]">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#B57DDA]/15 border border-[#B57DDA]/30 flex items-center justify-center text-[#41478B]">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#41478B]">
                Un Workbench Experimental Vivo
              </h3>
              <p className="text-xs text-[#5A5478] leading-relaxed">
                Supera el esquema tradicional de diapositivas estáticas. Ofrece un entorno reactivo donde puedes
                añadir, eliminar, editar y reordenar eslabones de una cadena, ajustar umbrales numéricos y lanzar solicitudes en tiempo real.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E8E2D4]/60 mt-3">
              <span className="text-[10px] font-mono font-semibold text-[#B57DDA] uppercase tracking-wider">
                Experimentación Dinámica
              </span>
            </div>
          </DoubleBezelCard>

          <DoubleBezelCard innerClassName="p-5 flex flex-col justify-between h-full bg-[#FFFFF6]">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#41478B]/10 border border-[#41478B]/20 flex items-center justify-center text-[#41478B]">
                <Sparkles className="w-4 h-4 text-[#B57DDA]" />
              </div>
              <h3 className="font-bold text-sm text-[#41478B]">
                Sincronización de Código Multilenguaje
              </h3>
              <p className="text-xs text-[#5A5478] leading-relaxed">
                El laboratorio simula el recorrido de las solicitudes en el navegador y relaciona sus eventos con fragmentos de referencia en <strong>Java</strong>,
                <strong>TypeScript</strong>, <strong>Python</strong> y <strong>Go</strong>. La animación no ejecuta estos ejemplos.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E8E2D4]/60 mt-3">
              <span className="text-[10px] font-mono font-semibold text-[#41478B] uppercase tracking-wider">
                Correspondencia didáctica
              </span>
            </div>
          </DoubleBezelCard>

          <DoubleBezelCard innerClassName="p-5 flex flex-col justify-between h-full bg-[#FFFFF6]">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#41478B]">
                Simulación individual en el navegador
              </h3>
              <p className="text-xs text-[#5A5478] leading-relaxed">
                La simulación individual se realiza en el navegador. Las salas permiten compartir avances y resultados mediante el backend y la persistencia del servidor. La práctica individual guarda avances locales según el modo.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E8E2D4]/60 mt-3">
              <span className="text-[10px] font-mono font-semibold text-emerald-600 uppercase tracking-wider">
                Cero Configuración
              </span>
            </div>
          </DoubleBezelCard>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#B57DDA] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            2
          </div>
          <h2 className="text-lg font-bold text-[#41478B]">
            ¿Cuál es el objetivo principal y pedagógico?
          </h2>
        </div>

        <DoubleBezelCard innerClassName="p-6 bg-[#FFFFF6] border-l-4 border-l-[#B57DDA]">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#B57DDA]/15 text-[#41478B] shrink-0 mt-0.5">
              <Target className="w-5 h-5 text-[#B57DDA]" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B57DDA] font-bold">
                Objetivo Fundamental del Proyecto
              </span>
              <p className="text-sm font-semibold text-[#41478B] leading-relaxed">
                Dotar a estudiantes y desarrolladores de un modelo mental intuitivo, verificable y riguroso
                sobre el funcionamiento del patrón <span className="text-[#B57DDA]">Chain of Responsibility</span>, permitiéndoles
                experimentar cómo se desacopla el emisor de una petición de sus potenciales receptores mediante la delegación
                secuencial y la figura del <span className="underline decoration-[#B57DDA] decoration-2">Receptor Implícito</span>.
              </p>
            </div>
          </div>
        </DoubleBezelCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {learningGoals.map((goal, idx) => (
            <DoubleBezelCard key={idx} innerClassName="p-5 flex flex-col justify-between h-full bg-[#FFFFF6]">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2 rounded-xl bg-[#FAF8FD] border border-[#E8E2D4]">
                    {goal.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B57DDA]/15 text-[#41478B] font-bold border border-[#B57DDA]/30">
                    {goal.code}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#41478B]">
                  {goal.title}
                </h3>

                <p className="text-xs text-[#5A5478] leading-relaxed">
                  {goal.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E2D4]/70">
                <span className="text-[11px] text-[#41478B] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{goal.benefit}</span>
                </span>
              </div>
            </DoubleBezelCard>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#41478B] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            3
          </div>
          <h2 className="text-lg font-bold text-[#41478B]">
            Guía de Módulos: ¿Qué encontrarás en cada pestaña?
          </h2>
        </div>

        <div className="space-y-3">
          {modules.map((m) => (
            <DoubleBezelCard key={m.tab} innerClassName="p-4 sm:p-5 bg-[#FFFFF6]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="p-1.5 rounded-xl bg-[#FAF8FD] border border-[#E8E2D4]">
                      {m.icon}
                    </span>
                    <h3 className="font-bold text-sm text-[#41478B]">
                      {m.label}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8E2D4]/50 text-[#5A5478] border border-[#E8E2D4]">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5478] leading-relaxed pl-0 sm:pl-9">
                    {m.summary}
                  </p>
                </div>

                {onNavigate && (
                  <button
                    onClick={() => m.labMode && onOpenLab ? onOpenLab(m.labMode) : onNavigate(m.tab)}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-[#41478B] bg-[#FAF8FD] border border-[#E8E2D4] hover:bg-[#B57DDA]/15 hover:border-[#B57DDA]/50 transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
                  >
                    <span>{m.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B57DDA]" />
                  </button>
                )}
              </div>
            </DoubleBezelCard>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DoubleBezelCard innerClassName="p-5 bg-[#FFFFF6]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <GraduationCap className="w-4 h-4 text-[#B57DDA]" />
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-[#41478B]">
              Para Estudiantes
            </h3>
          </div>
          <p className="text-xs text-[#5A5478] leading-relaxed">
            Comprender el patrón mediante ensayo y error visual, responder el quiz de autoevaluación
            y preparar exámenes teóricos y prácticos de Arquitectura de Software con solidez.
          </p>
        </DoubleBezelCard>

        <DoubleBezelCard innerClassName="p-5 bg-[#FFFFF6]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <Compass className="w-4 h-4 text-[#41478B]" />
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-[#41478B]">
              Para Docentes y Expositores
            </h3>
          </div>
          <p className="text-xs text-[#5A5478] leading-relaxed">
            Utilizarlo como herramienta de apoyo didáctico interactivo en clase o exposiciones,
            demostrando en vivo cómo una petición recorre los nodos y qué sucede si falta un manejador.
          </p>
        </DoubleBezelCard>

        <DoubleBezelCard innerClassName="p-5 bg-[#FFFFF6]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <Code2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-[#41478B]">
              Para Desarrolladores
            </h3>
          </div>
          <p className="text-xs text-[#5A5478] leading-relaxed">
            Consolidar la base conceptual detrás de los middlewares de frameworks web modernos y
            diseñar pipelines desacoplados respetando los principios SOLID en código de producción.
          </p>
        </DoubleBezelCard>
      </div>

      <DoubleBezelCard innerClassName="p-6 bg-gradient-to-r from-[#FAF8FD] to-[#FFFFF6] border border-[#E8E2D4]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B57DDA] font-bold">
              Síntesis Rápida
            </span>
            <p className="text-xs sm:text-sm text-[#41478B] font-medium">
              Evita acoplar el emisor a la selección del receptor, dando a varios objetos la oportunidad de atender la petición. — Paráfrasis en español de GoF
            </p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onOpenLab ? onOpenLab('explore') : onNavigate('workbench')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#41478B] to-[#B57DDA] shadow-md shadow-[#B57DDA]/30 hover:opacity-95 transition-all duration-300 active:scale-95 shrink-0 cursor-pointer"
            >
              <GitFork className="w-4 h-4" />
              <span>Empezar en el Simulador</span>
            </button>
          )}
        </div>
      </DoubleBezelCard>

    </div>
  );
};
