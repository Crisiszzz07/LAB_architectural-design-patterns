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
        explanation: 'Incorrecto. Eso describe un modelo de difusión Publish/Subscribe; CoR no requiere difusión concurrente; en los ejemplos del laboratorio, la propagación es secuencial.',
      },
      {
        id: 'opt-c',
        text: 'A que el emisor delega en la cadena la selección del receptor definitivo, aunque pueda conocer sus manejadores y su cantidad.',
        explanation: '¡Exacto! El cliente entrega la petición al inicio de la cadena mediante el contrato Handler delegando la selección del receptor definitivo. Puede conocer los nodos y configurar la cadena.',
      },
      {
        id: 'opt-d',
        text: 'A que los eslabones interceptan llamadas mediante proxies dinámicos sin declarar métodos públicos formales en la interfaz del manejador.',
        explanation: 'Incorrecto. CoR puede usar interfaces, clases o funciones con un contrato común; no requiere proxies dinámicos.',
      },
    ],
    architecturalInsight: 'El desacoplamiento entre el emisor y los posibles receptores es la esencia del patrón. El cliente puede conocer la configuración; la emisión no selecciona el receptor definitivo.',
  },
  {
    id: 2,
    topic: 'Principios SOLID',
    question: '¿De qué manera específica el patrón Chain of Responsibility impulsa el Principio Abierto/Cerrado (OCP)?',
    correctOptionId: 'opt-a',
    options: [
      {
        id: 'opt-a',
        text: 'Permite incorporar nuevos eslabones o reorganizar la secuencia de resolución sin alterar los manejadores existentes, aunque cambie el ensamblado de la cadena.',
        explanation: '¡Correcto! Favorece OCP al extender manejadores. La configuración o el código que ensambla la cadena puede cambiar; SOLID no queda garantizado por usar el patrón.',
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
    architecturalInsight: 'OCP: Abierto a extensión (nuevos eslabones), cerrado a modificación (los manejadores existentes pueden permanecer intactos, aunque cambie el ensamblado).',
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
        explanation: 'Incorrecto. CoR no exige duplicar el contexto en cada eslabón; cómo se transmite depende del lenguaje y de la implementación.',
      },
      {
        id: 'opt-b',
        text: 'Provoca condiciones de carrera forzadas (race conditions) entre hilos al compartir obligatoriamente el mismo puntero al sucesor.',
        explanation: 'Incorrecto. CoR no introduce concurrencia intrínseca; comúnmente opera de manera síncrona en el hilo llamante.',
      },
      {
        id: 'opt-c',
        text: 'Rompe el principio de sustitución de Liskov al obligar a que los manejadores derivados modifiquen la firma del método de atención.',
        explanation: 'Incorrecto. El patrón propone un contrato común; respetar LSP depende de su implementación y no exige cambiar la firma.',
      },
      {
        id: 'opt-d',
        text: 'La recepción de la petición carece de garantía ("Receipt is not guaranteed"), pudiendo alcanzar el final de la cadena sin ser atendida.',
        explanation: '¡Totalmente cierto! Si ningún eslabón satisface la condición y no existe un manejador terminal por defecto, la solicitud puede quedar sin atender. La implementación puede informar el fallo, registrarlo o escalarlo; no implica pérdida silenciosa.',
      },
    ],
    architecturalInsight: 'Diseño Defensivo: Se recomienda definir una política terminal o manejar el caso `successor == null` lanzando una excepción controlada o registrando una alerta.',
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
        explanation: 'Incorrecto. Los ejemplos de CoR del laboratorio recorren eslabones secuencialmente. El patrón no garantiza ejecución simultánea ni combinación de resultados.',
      },
      {
        id: 'opt-c',
        text: 'Cuando agregar una nueva regla obliga necesariamente a modificar el código del emisor.',
        explanation: 'Incorrecto. El patrón busca evitar esa modificación: los nuevos manejadores pueden incorporarse, aunque deba cambiar la configuración o el ensamblado.',
      },
      {
        id: 'opt-d',
        text: 'Cuando existen varios candidatos para manejar una solicitud y el receptor idóneo debe determinarse dinámicamente.',
        explanation: '¡Muy bien! El cliente emite la petición al inicio de la cadena y los candidatos se evalúan en tiempo de ejecución.',
      },
    ],
    architecturalInsight: 'CoR desacopla la emisión de la selección del receptor. Extender manejadores puede exigir modificar el ensamblado.',
  },
  {
    id: 6,
    topic: 'Propuesta didáctica para RF03',
    question: 'En la propuesta didáctica de validación estructural, horaria y presupuestaria para RF03, ¿qué ocurre cuando un validador detecta una regla incumplida?',
    correctOptionId: 'opt-a',
    options: [
      {
        id: 'opt-a',
        text: 'Detiene la transacción y entrega un mensaje controlado; solo delega al siguiente filtro cuando la regla se cumple.',
        explanation: '¡Correcto! En esta propuesta (distinta del prototipo Java de seguridad), los filtros estructural, de carga horaria y presupuestal son independientes: ante una violación abortan el proceso; si pasa, delegan.',
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
    architecturalInsight: 'La propuesta para RF03 separa las validaciones estructural, de carga horaria y presupuestal, evitando una función gigante llena de condicionales.',
  },
  {
    id: 7,
    topic: 'Refactorización y Deuda Técnica',
    question: '¿Qué síntoma en código legacy invita a evaluar una refactorización hacia Chain of Responsibility, según las responsabilidades y el flujo del dominio?',
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
        explanation: 'Es una señal para evaluar el diseño, no una violación automática de SOLID ni prueba suficiente para elegir CoR. Puede ayudar si las reglas tienen responsabilidades independientes y un flujo de delegación.',
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
    architecturalInsight: 'Refactoring to Patterns: Si cada vez que agregas una regla de negocio debes tocar un `if` de 500 líneas en un controlador central, evalúa separar responsabilidades; CoR es una opción si el flujo requiere manejo y delegación.',
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
        explanation: 'Incorrecto. Las referencias entre eslabones no impiden por sí mismas la recolección. El ciclo de vida y la retención de datos dependen de la implementación.',
      },
      {
        id: 'opt-b',
        text: 'Los depuradores modernos impiden inspeccionar variables locales dentro de un manejador si el método pertenece a una jerarquía abstracta profunda.',
        explanation: 'Incorrecto. Los depuradores en Java, C# o TypeScript manejan la inspección de variables locales en polimorfismo con total normalidad.',
      },
      {
        id: 'opt-c',
        text: 'Dificultad para rastrear el flujo en logs y stack traces, especialmente con cadenas largas, sean fijas o ensambladas dinámicamente.',
        explanation: '¡Exacto! Rastrear decisiones y delegaciones puede ser difícil también en cadenas fijas. El ensamblado dinámico añade dificultad.',
      },
      {
        id: 'opt-d',
        text: 'Incompatibilidad con balanceadores de carga al requerir que cada salto de la cadena mantenga afinidad de sesión persistente con el cliente.',
        explanation: 'Incorrecto. CoR no exige afinidad de sesión con balanceadores. La ubicación y distribución de sus manejadores dependen de la implementación.',
      },
    ],
    architecturalInsight: 'Observabilidad: En arquitecturas con cadenas largas, considera un identificador de correlación y logs estructurados al inicio y salida de cada eslabón.',
  },
];
