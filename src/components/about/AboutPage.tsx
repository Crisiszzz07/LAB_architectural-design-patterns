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
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const learningGoals = [
    {
      icon: <Network className="w-5 h-5 text-[#B57DDA]" />,
      title: "Desacoplamiento y Receptor Implícito",
      code: "Emisor Desacoplado",
      description:
        "Comprender cómo el cliente emite una petición sin necesidad de conocer cuál objeto concreto la procesará, erradicando cadenas de 'if-else' monolíticas y acoplamientos rígidos.",
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
        "Evidenciar el riesgo canónico documentado por el Gang of Four cuando una solicitud no coincide con ningún manejador y cae al vacío, y cómo prevenirlo mediante manejadores Catch-All defensivos.",
      benefit: "Enseña patrones defensivos esenciales para producción.",
    },
    {
      icon: <Code2 className="w-5 h-5 text-[#B57DDA]" />,
      title: "Trazabilidad Abstracción ↔ Código Real",
      code: "Sincronización en Vivo",
      description:
        "Vincular la topología conceptual con implementaciones reales y canónicas en Java (GoF clásico), TypeScript, Python y Go, viendo la línea de código exacta que se activa en cada paso.",
      benefit: "Cierra la brecha entre la teoría académica y el código real.",
    },
    {
      icon: <Boxes className="w-5 h-5 text-[#41478B]" />,
      title: "Cumplimiento de Principios SOLID (SRP & OCP)",
      code: "Principios de Diseño",
      description:
        "Verificar cómo cada manejador tiene una única responsabilidad de decisión (SRP) y cómo se pueden incorporar nuevos eslabones a la cadena sin alterar clases existentes (OCP).",
      benefit: "Arquitectura escalable, modular y fácilmente testeable.",
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      title: "Conexión con la Industria Contemporánea",
      code: "Middlewares Modernos",
      description:
        "Identificar cómo este patrón de 1994 es la raíz directa de los middlewares HTTP en Express.js, Django, ASP.NET Core, Spring Security y el Event Bubbling en el DOM de los navegadores.",
      benefit: "Aplicabilidad inmediata en frameworks web de producción.",
    },
  ];

  const modules = [
    {
      tab: 'workbench' as ActiveTab,
      label: '1. Laboratorio Interactivo (Workbench)',
      icon: <GitFork className="w-4 h-4 text-[#B57DDA]" />,
      badge: 'Simulador en Vivo',
      summary:
        'Construye, reordena y manipula cadenas de manejadores. Elige dominios reales (Aprobación de Gastos, Soporte TI, Filtros HTTP), controla la velocidad de ejecución y observa la telemetría paso a paso.',
      actionText: 'Explorar Simulador',
    },
    {
      tab: 'code' as ActiveTab,
      label: '2. Visor de Código Sincronizado',
      icon: <Code2 className="w-4 h-4 text-[#41478B]" />,
      badge: 'Java • TS • Python • Go',
      summary:
        'Inspecciona implementaciones canónicas con explicaciones arquitectónicas línea a línea. Al correr la simulación, el visor ilumina en tiempo real la línea exacta que se está ejecutando en el lenguaje elegido.',
      actionText: 'Ver Código',
    },
    {
      tab: 'quiz' as ActiveTab,
      label: '3. Autoevaluación Conceptual',
      icon: <HelpCircle className="w-4 h-4 text-emerald-600" />,
      badge: '8 Preguntas Universitarias',
      summary:
        'Pon a prueba tu dominio sobre receptores implícitos, SOLID, manejo de excepciones, y diferencias críticas entre Chain of Responsibility, Decorator y Strategy con retroalimentación explicada de cada opción.',
      actionText: 'Iniciar Quiz',
    },
    {
      tab: 'cases' as ActiveTab,
      label: '4. Galería de Casos de Producción',
      icon: <Layers className="w-4 h-4 text-purple-600" />,
      badge: 'Casos Reales',
      summary:
        'Descubre 5 sistemas de producción que emplean el patrón: Express/Django Middlewares, Spring Security, DOM Event Bubbling, Call Stack de Excepciones y Mesas de Ayuda ITSM con mapeo GoF formal.',
      actionText: 'Ver Casos Reales',
    },
    {
      tab: 'reference' as ActiveTab,
      label: '5. Referencia Canónica & Diagrama UML',
      icon: <BookOpen className="w-4 h-4 text-[#41478B]" />,
      badge: 'Diagrama Interactivo',
      summary:
        'Consulta la definición formal del libro del GoF, inspecciona el diagrama de clases interactivo en SVG con tarjetas detalladas de cada clase, y analiza la matriz de ventajas, desventajas y aplicabilidad.',
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
                  onClick={() => onNavigate('workbench')}
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
                Cada evento visual de la simulación tiene correlación directa con código canónico en <strong>Java</strong>,
                <strong>TypeScript</strong>, <strong>Python</strong> y <strong>Go</strong>, resaltando la instrucción exacta que procesa la petición.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E8E2D4]/60 mt-3">
              <span className="text-[10px] font-mono font-semibold text-[#41478B] uppercase tracking-wider">
                Trazabilidad 1 a 1
              </span>
            </div>
          </DoubleBezelCard>

          <DoubleBezelCard innerClassName="p-5 flex flex-col justify-between h-full bg-[#FFFFF6]">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#41478B]">
                100% Client-Side & Sin Fricción
              </h3>
              <p className="text-xs text-[#5A5478] leading-relaxed">
                Diseñada como una Single Page Application (SPA) ultrarrápida. No requiere bases de datos, registros ni dependencias externas;
                cada estudiante corre su propia simulación aislada de forma inmediata y privada en cualquier navegador.
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
                    onClick={() => onNavigate(m.tab)}
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
              "Evita acoplar el emisor de una petición a su receptor dando a más de un objeto la oportunidad de tratarla." — GoF
            </p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('workbench')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#41478B] to-[#B57DDA] shadow-md shadow-[#B57DDA]/30 hover:opacity-95 transition-all duration-300 active:scale-95 shrink-0 cursor-pointer"
            >
              <GitFork className="w-4 h-4" />
              <span>Empezar en el Laboratorio</span>
            </button>
          )}
        </div>
      </DoubleBezelCard>

    </div>
  );
};
