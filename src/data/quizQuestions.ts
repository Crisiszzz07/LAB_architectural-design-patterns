import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Concepto Clave GoF',
    question: '¿A qué se refiere el libro del Gang of Four (GoF) con el concepto de "Receptor Implícito" en Chain of Responsibility?',
    correctOptionId: 'opt-c',
    options: [
      {
        id: 'opt-a',
        text: 'A que el manejador final se instancia de forma diferida en memoria únicamente si ningún eslabón previo pudo resolver la petición.',
        explanation: 'Incorrecto. El receptor implícito atañe al desacoplamiento emisor-receptor, no al ciclo de vida ni a la inicialización perezosa.',
      },
      {
        id: 'opt-b',
        text: 'A que la solicitud se transmite de manera concurrente a todos los componentes mediante un bus de eventos en memoria sin acuse de recibo.',
        explanation: 'Incorrecto. Eso describe un modelo de difusión Publish/Subscribe; en CoR la propagación es habitualmente secuencial y punto a punto.',
      },
      {
        id: 'opt-c',
        text: 'A que el emisor de la solicitud no conoce de antemano qué objeto concreto asumirá el procesamiento ni cuántos eslabones integran la cadena.',
        explanation: '¡Exacto! El cliente entrega la petición al primer eslabón abstracto (Handler) sin acoplarse ni conocer a los receptores concretos.',
      },
      {
        id: 'opt-d',
        text: 'A que los eslabones interceptan llamadas mediante proxies dinámicos sin declarar métodos públicos formales en la interfaz del manejador.',
        explanation: 'Incorrecto. CoR utiliza interfaces o clases abstractas explícitas para encadenar las llamadas entre sucesores.',
      },
    ],
    architecturalInsight: 'El desacoplamiento entre el emisor y los posibles receptores es la esencia del patrón. El cliente solo conoce la abstracción `Handler`.',
  },
  {
    id: 2,
    topic: 'Principios SOLID',
    question: '¿De qué manera específica el patrón Chain of Responsibility impulsa el Principio Abierto/Cerrado (OCP)?',
    correctOptionId: 'opt-a',
    options: [
      {
        id: 'opt-a',
        text: 'Permite incorporar nuevos eslabones o reorganizar la secuencia de resolución sin alterar el código del cliente ni de los manejadores existentes.',
        explanation: '¡Correcto! Cumple OCP: abierto a extensión (agregando nuevos ConcreteHandlers) y cerrado a modificación (código existente inalterado).',
      },
      {
        id: 'opt-b',
        text: 'Fuerza a que todos los atributos de estado dentro de los manejadores sean declarados inmutables para impedir efectos secundarios colaterales.',
        explanation: 'Incorrecto. La inmutabilidad promueve la seguridad de hilos y robustez, pero no constituye el mecanismo por el cual CoR satisface OCP.',
      },
      {
        id: 'opt-c',
        text: 'Centraliza las bifurcaciones condicionales complejas dentro de un despachador maestro estático que encapsula la jerarquía de herencia.',
        explanation: 'Incorrecto. Centralizar bifurcaciones en un despachador crea acoplamiento y obliga a modificar dicha clase al añadir nuevas reglas.',
      },
      {
        id: 'opt-d',
        text: 'Exige que cada eslabón implemente métodos polimórficos sellados que previenen sobreescrituras accidentales en módulos dependientes.',
        explanation: 'Incorrecto. Sellar métodos restringe la extensibilidad por herencia y no es la técnica arquitectónica que aporta OCP en este patrón.',
      },
    ],
    architecturalInsight: 'OCP: Abierto a extensión (nuevos eslabones), cerrado a modificación (los eslabones existentes y el cliente permanecen intactos).',
  },
  {
    id: 3,
    topic: 'Riesgos Arquitectónicos',
    question: 'Según la especificación original del GoF, ¿cuál es uno de los principales riesgos ("Gotchas") de Chain of Responsibility?',
    correctOptionId: 'opt-d',
    options: [
      {
        id: 'opt-a',
        text: 'Incurre en sobrecarga crítica de memoria por duplicar el contexto completo de la petición en cada invocación polimórfica sucesiva.',
        explanation: 'Incorrecto. La petición se pasa típicamente por referencia entre eslabones sin duplicar memoria en el heap.',
      },
      {
        id: 'opt-b',
        text: 'Provoca condiciones de carrera forzadas (race conditions) entre hilos al compartir obligatoriamente el mismo puntero al sucesor.',
        explanation: 'Incorrecto. CoR no introduce concurrencia intrínseca; comúnmente opera de manera síncrona en el hilo llamante.',
      },
      {
        id: 'opt-c',
        text: 'Rompe el principio de sustitución de Liskov al obligar a que los manejadores derivados modifiquen la firma del método de atención.',
        explanation: 'Incorrecto. Todos los manejadores concretos respetan el contrato uniforme definido en la clase abstracta Handler.',
      },
      {
        id: 'opt-d',
        text: 'La recepción de la petición carece de garantía ("Receipt is not guaranteed"), pudiendo alcanzar el final de la cadena sin ser atendida.',
        explanation: '¡Totalmente cierto! Si ningún eslabón satisface la condición y no existe un manejador terminal por defecto, la solicitud cae sin respuesta.',
      },
    ],
    architecturalInsight: 'Diseño Defensivo: Siempre diseña un manejador terminal o maneja el caso `successor == null` lanzando una excepción controlada o registrando una alerta.',
  },
  {
    id: 4,
    topic: 'Estructura del Patrón',
    question: 'En la estructura de Chain of Responsibility, ¿qué responsabilidad tiene un ConcreteHandler cuando no puede atender la solicitud?',
    correctOptionId: 'opt-b',
    options: [
      {
        id: 'opt-a',
        text: 'Debe crear una nueva solicitud y devolverla al cliente para que este busque manualmente al siguiente manejador.',
        explanation: 'Incorrecto. El cliente entrega la petición al primer eslabón; no necesita conocer ni coordinar los manejadores siguientes.',
      },
      {
        id: 'opt-b',
        text: 'Debe delegarla de forma transparente a su sucesor, si existe, para que el siguiente eslabón la evalúe.',
        explanation: '¡Correcto! Cada ConcreteHandler procesa la petición si puede; de lo contrario, la reenvía mediante el successor link.',
      },
      {
        id: 'opt-c',
        text: 'Debe cambiar la interfaz Handler para incluir una regla especial que cubra esa solicitud.',
        explanation: 'Incorrecto. Los manejadores concretos comparten una interfaz común; agregar reglas no exige alterar el contrato de Handler.',
      },
      {
        id: 'opt-d',
        text: 'Debe procesarla siempre, aunque no cumpla los criterios, para impedir que la cadena termine.',
        explanation: 'Incorrecto. Un manejador solo resuelve las solicitudes que le corresponden; si no puede, delega al sucesor.',
      },
    ],
    architecturalInsight: 'Handler define el contrato y el enlace con el sucesor. Cada ConcreteHandler decide si resuelve la petición o la propaga al siguiente eslabón.',
  },
  {
    id: 5,
    topic: 'Cuándo Utilizarlo',
    question: '¿En cuál situación es apropiado aplicar Chain of Responsibility?',
    correctOptionId: 'opt-d',
    options: [
      {
        id: 'opt-a',
        text: 'Cuando el cliente conoce de antemano el único receptor y necesita invocarlo directamente.',
        explanation: 'Incorrecto. CoR resulta útil precisamente cuando el emisor no debe conocer de forma explícita qué objeto atenderá la petición.',
      },
      {
        id: 'opt-b',
        text: 'Cuando todas las reglas deben ejecutarse simultáneamente y combinar sus resultados en una única respuesta.',
        explanation: 'Incorrecto. La cadena recorre eslabones de forma secuencial y cada uno evalúa si puede asumir la responsabilidad.',
      },
      {
        id: 'opt-c',
        text: 'Cuando agregar una nueva regla obliga necesariamente a modificar el código del emisor.',
        explanation: 'Incorrecto. El patrón busca evitar esa modificación: los nuevos manejadores se pueden añadir o reordenar dinámicamente.',
      },
      {
        id: 'opt-d',
        text: 'Cuando existen varios candidatos para manejar una solicitud y el receptor idóneo debe determinarse dinámicamente.',
        explanation: '¡Muy bien! El cliente emite la petición al inicio de la cadena y los candidatos se evalúan en tiempo de ejecución.',
      },
    ],
    architecturalInsight: 'CoR desacopla al emisor del receptor y permite modificar, agregar o reordenar los manejadores sin cambiar al cliente.',
  },
  {
    id: 6,
    topic: 'Caso ERP del Curso',
    question: 'En el módulo RF03 del ERP, ¿qué ocurre cuando un validador de propuestas detecta que la solicitud no cumple una regla?',
    correctOptionId: 'opt-a',
    options: [
      {
        id: 'opt-a',
        text: 'Detiene la transacción y entrega un mensaje controlado; solo delega al siguiente filtro cuando la regla se cumple.',
        explanation: '¡Correcto! Los filtros estructural, de carga horaria y presupuestal son independientes: ante una violación abortan el proceso; si pasa, delegan.',
      },
      {
        id: 'opt-b',
        text: 'Ignora la violación y persiste la propuesta para que todos los filtros se ejecuten sin interrupciones.',
        explanation: 'Incorrecto. Una validación fallida debe impedir que la propuesta continúe hacia los filtros siguientes o se persista.',
      },
      {
        id: 'opt-c',
        text: 'Transfiere la decisión al cliente, que debe escoger manualmente entre los filtros restantes.',
        explanation: 'Incorrecto. El cliente inicia la solicitud en el primer eslabón; los filtros gestionan la continuación del flujo.',
      },
      {
        id: 'opt-d',
        text: 'Elimina los validadores ya ejecutados para reconstruir la cadena desde cero antes de guardar la propuesta.',
        explanation: 'Incorrecto. La cadena se configura con validadores aislados; cada uno decide continuar o detener el flujo según su regla.',
      },
    ],
    architecturalInsight: 'En RF03, la cadena separa las validaciones estructural, de carga horaria y presupuestal, evitando una función gigante llena de condicionales.',
  },
  {
    id: 7,
    topic: 'Refactorización y Deuda Técnica',
    question: '¿Qué síntoma o "Code Smell" en el código legacy es el indicador más claro de que conviene refactorizar hacia Chain of Responsibility?',
    correctOptionId: 'opt-b',
    options: [
      {
        id: 'opt-a',
        text: 'Presencia de clases de dominio con una gran cantidad de campos primitivos y métodos de acceso sin comportamiento de negocio asociado.',
        explanation: 'Incorrecto. Eso es un modelo de dominio anémico o Data Class smell, el cual se resuelve enriqueciendo las entidades de dominio.',
      },
      {
        id: 'opt-b',
        text: 'Un método monolítico con estructuras condicionales (if/else if anidados) que evalúa secuencialmente múltiples reglas de procesamiento.',
        explanation: '¡Brillante! El infierno de condicionales anidados viola SRP y OCP. CoR descompone cada rama condicional en su propio ConcreteHandler aislado.',
      },
      {
        id: 'opt-c',
        text: 'Uso recurrente de constructores con listas extensas de parámetros posicionales que dificultan la inicialización segura de los objetos.',
        explanation: 'Incorrecto. Para constructores con exceso de parámetros posicionales se recomienda aplicar el patrón Builder o Parameter Object.',
      },
      {
        id: 'opt-d',
        text: 'Llamadas circulares entre servicios que provocan dependencias bidireccionales estrechamente acopladas en tiempo de compilación.',
        explanation: 'Incorrecto. Las dependencias cíclicas suelen resolverse mediante inyección de dependencias, eventos o el patrón Mediator.',
      },
    ],
    architecturalInsight: 'Refactoring to Patterns: Si cada vez que agregas una regla de negocio debes tocar un `if` de 500 líneas en un controlador central, extrae eslabones CoR.',
  },
  {
    id: 8,
    topic: 'Operabilidad y Depuración',
    question: '¿Cuál es el principal desafío de observabilidad y depuración al operar un sistema con una cadena de eslabones extensa?',
    correctOptionId: 'opt-c',
    options: [
      {
        id: 'opt-a',
        text: 'Los perfiles de memoria generan falsas fugas (memory leaks) debido a que las referencias entre eslabones impiden la acción del recolector de basura.',
        explanation: 'Incorrecto. Los eslabones son componentes de larga vida o singletons stateless que no retienen memoria innecesaria tras atender la petición.',
      },
      {
        id: 'opt-b',
        text: 'Los depuradores modernos impiden inspeccionar variables locales dentro de un manejador si el método pertenece a una jerarquía abstracta profunda.',
        explanation: 'Incorrecto. Los depuradores en Java, C# o TypeScript manejan la inspección de variables locales en polimorfismo con total normalidad.',
      },
      {
        id: 'opt-c',
        text: 'Dificultad para rastrear el flujo en logs y stack traces, pues la secuencia de ejecución se ensambla dinámicamente en tiempo de ejecución.',
        explanation: '¡Exacto! Al ser el orden configurado en runtime, el análisis estático de código no revela fácilmente qué manejadores evaluaron la petición.',
      },
      {
        id: 'opt-d',
        text: 'Incompatibilidad con balanceadores de carga al requerir que cada salto de la cadena mantenga afinidad de sesión persistente con el cliente.',
        explanation: 'Incorrecto. La cadena de responsabilidad se ejecuta íntegramente dentro del proceso que recibió la petición en el backend.',
      },
    ],
    architecturalInsight: 'Observabilidad: En arquitecturas con cadenas largas, siempre inyecta un Correlation ID y logs estructurados al inicio y salida de cada eslabón.',
  },
];
