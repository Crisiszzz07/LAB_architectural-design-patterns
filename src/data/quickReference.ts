export interface UmlNode {
  id: string;
  name: string;
  stereotype?: string;
  attributes: string[];
  methods: string[];
  roleDescription: string;
  solidPrinciples: string[];
}

export const UML_NODES: UmlNode[] = [
  {
    id: 'client',
    name: 'Client',
    stereotype: 'Caller',
    attributes: ['- initialHandler: Handler'],
    methods: ['+ sendRequest(request: Request): void'],
    roleDescription: 'Inicia la petición pasándola a la cabeza de la cadena. Desconoce por completo qué manejador concreto la resolverá, protegiéndose del acoplamiento a clases concretas.',
    solidPrinciples: ['DIP (Inversión de Dependencias)', 'Loose Coupling (Bajo Acoplamiento)'],
  },
  {
    id: 'handler',
    name: 'Handler',
    stereotype: '<<abstract / interface>>',
    attributes: ['# successor: Handler'],
    methods: ['+ setSuccessor(s: Handler): void', '+ handleRequest(req: Request): void'],
    roleDescription: 'Define la interfaz contractual para procesar solicitudes y mantiene una referencia opcional al siguiente eslabón (`successor`). Opcionalmente implementa el algoritmo de propagación por defecto.',
    solidPrinciples: ['OCP (Permite nuevos eslabones polimórficos)', 'LSP (Sustitución de Liskov)'],
  },
  {
    id: 'concrete_a',
    name: 'ConcreteHandlerA',
    stereotype: 'Concrete Class',
    attributes: ['- thresholdA: int'],
    methods: ['+ handleRequest(req: Request): void', '- canHandle(req: Request): boolean'],
    roleDescription: 'Atiende las solicitudes para las que tiene capacidad o autorización. Si no cumple la condición o criterio, delega de manera transparente en su sucesor invocando `successor.handleRequest(req)`.',
    solidPrinciples: ['SRP (Responsabilidad Única para su propia regla de negocio)'],
  },
  {
    id: 'concrete_b',
    name: 'ConcreteHandlerB',
    stereotype: 'Concrete Class',
    attributes: ['- thresholdB: int'],
    methods: ['+ handleRequest(req: Request): void', '- canHandle(req: Request): boolean'],
    roleDescription: 'Eslabón adicional con reglas de negocio distintas o de mayor jerarquía. Demuestra cómo se pueden encadenar tantos manejadores como la lógica del dominio exija.',
    solidPrinciples: ['SRP (Aislado de ConcreteHandlerA)'],
  },
];

export const QUICK_REFERENCE_DATA = {
  gofDefinition: 'Evita acoplar el emisor de una petición a su receptor dando a más de un objeto la posibilidad de responder a la solicitud. Encadena los objetos receptores y pasa la solicitud a lo largo de la cadena hasta que un objeto la atienda.',
  intent: 'Desacoplar al emisor de una petición de los objetos que potencialmente pueden procesarla, otorgando a múltiples candidatos la oportunidad de atenderla de forma secuencial y configurable dinámicamente.',
  pros: [
    {
      title: 'Desacoplamiento radical',
      description: 'El cliente no conoce qué objeto procesará la petición, ni qué otros eslabones existen en el sistema.',
    },
    {
      title: 'Flexibilidad dinámica (OCP)',
      description: 'Puedes añadir, eliminar o reordenar eslabones en tiempo de ejecución o mediante inyección de dependencias sin tocar código existente.',
    },
    {
      title: 'Responsabilidad Única (SRP)',
      description: 'Desglosa ramas complejas de condicionales y lógica monolítica en componentes pequeños, testeables y focalizados.',
    },
  ],
  cons: [
    {
      title: 'Recepción no garantizada (Receipt is not guaranteed)',
      description: 'Si ningún eslabón atiende la solicitud y no hay un manejador por defecto o fallback, la petición se pierde silenciosamente.',
    },
    {
      title: 'Dificultad de depuración y observabilidad',
      description: 'Seguir el flujo de ejecución en tiempo de desarrollo puede ser arduo si la cadena es larga o configurada en tiempo de ejecución.',
    },
    {
      title: 'Sobrecarga de latencia (Overhead)',
      description: 'En cadenas muy extensas con peticiones frecuentes, la invocación de múltiples métodos intermedios puede introducir micro-latencias acumuladas.',
    },
  ],
  whenToUse: [
    'Hay más de un objeto susceptible de atender una solicitud y el manejador real no se conoce a priori.',
    'Deseas emitir una petición a un grupo de objetos sin especificar el receptor explícitamente.',
    'El conjunto de objetos capaces de procesar la solicitud debe ser especificado dinámicamente.',
    'Quieres reemplazar un bloque gigante de `if/else if/else` que valida reglas de negocio secuenciales.',
  ],
  whenToAvoid: [
    'Cada solicitud debe ser procesada por exactamente un objeto ya conocido en tiempo de compilación (usa Polimorfismo directo o Strategy).',
    'El orden de evaluación es irrelevante y todas las reglas deben ejecutarse simultáneamente (usa Observer o Composite).',
    'El rendimiento crítico de microsegundos no tolera la sobrecarga de múltiples saltos de pila y verificaciones intermedias.',
  ],
};
