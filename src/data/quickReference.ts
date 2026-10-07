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
    methods: ['+ sendRequest(req: Request): void'],
    roleDescription: 'Inicia la petición pasándola a la cabeza de la cadena. Desacopla la emisión de la selección del receptor definitivo; puede conocer y configurar los manejadores.',
    solidPrinciples: ['DIP (Inversión de Dependencias)', 'Loose Coupling (Bajo Acoplamiento)'],
  },
  {
    id: 'handler',
    name: 'Handler',
    stereotype: '{abstract}',
    attributes: ['# successor: Handler [0..1]'],
    methods: ['+ setSuccessor(s: Handler): void', '+ handleRequest(req: Request): void'],
    roleDescription: 'Define la interfaz contractual para procesar solicitudes y mantiene una referencia opcional al siguiente eslabón (`successor`). Opcionalmente implementa la propagación. setSuccessor corresponde a la variante mutable; la mutabilidad no es un requisito del patrón.',
    solidPrinciples: ['OCP (Permite nuevos eslabones polimórficos)', 'LSP (requiere respetar el contrato)'],
  },
  {
    id: 'concrete_a',
    name: 'ConcreteHandlerA',
    stereotype: 'Concrete Class',
    attributes: ['- threshold: int'],
    methods: ['+ handleRequest(req: Request): void', '- canHandle(req: Request): boolean'],
    roleDescription: 'Atiende las solicitudes para las que tiene capacidad o autorización. Si no cumple la condición o criterio, delega de manera transparente en su sucesor invocando `successor.handleRequest(req)`.',
    solidPrinciples: ['SRP (Responsabilidad Única para su propia regla de negocio)'],
  },
  {
    id: 'concrete_b',
    name: 'ConcreteHandlerB',
    stereotype: 'Concrete Class',
    attributes: ['- threshold: int'],
    methods: ['+ handleRequest(req: Request): void', '- canHandle(req: Request): boolean'],
    roleDescription: 'Eslabón adicional con reglas de negocio distintas, sin exigir una jerarquía organizativa. Demuestra cómo se pueden encadenar tantos manejadores como la lógica del dominio exija.',
    solidPrinciples: ['SRP (Aislado de ConcreteHandlerA)'],
  },
];

export const QUICK_REFERENCE_DATA = {
  gofDefinition: 'Evita acoplar el emisor de una petición a su receptor dando a más de un objeto la posibilidad de responder a la solicitud. Encadena los objetos receptores y pasa la solicitud a lo largo de la cadena hasta que un objeto la atienda.',
  intent: 'Desacoplar al emisor de una petición de los objetos que potencialmente pueden procesarla, otorgando a múltiples candidatos la oportunidad de atenderla de forma secuencial. La cadena puede ser fija o configurable.',
  pros: [
    {
      title: 'Selección desacoplada del receptor',
      description: 'El emisor delega la selección del receptor definitivo en la cadena. El cliente puede conocer su configuración y cantidad de eslabones.',
    },
    {
      title: 'Flexibilidad dinámica (OCP)',
      description: 'Puedes extender los manejadores sin modificar los existentes, aunque debas cambiar la configuración o el ensamblado. Reordenar en ejecución depende de la implementación.',
    },
    {
      title: 'Responsabilidad Única (SRP)',
      description: 'Favorece separar responsabilidades en componentes focalizados. CoR puede favorecer SRP y OCP, pero no garantiza automáticamente SOLID.',
    },
  ],
  cons: [
    {
      title: 'Recepción no garantizada (Receipt is not guaranteed)',
      description: 'Si ningún eslabón atiende la solicitud y no hay un manejador por defecto o fallback, la solicitud puede quedar sin atender. La implementación puede devolver un error, registrar o escalar; el silencio no es obligatorio.',
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
    'El conjunto de candidatos necesita configurarse o extenderse; una cadena fija también puede usar CoR.',
    'Evalúas separar reglas secuenciales con responsabilidades independientes. Tener condicionales no viola automáticamente SOLID ni obliga a usar CoR.',
  ],
  whenToAvoid: [
    'Cada solicitud debe ser procesada por exactamente un objeto ya conocido en tiempo de compilación (usa Polimorfismo directo o Strategy).',
    'Necesitas concurrencia entre todas las reglas: CoR no la proporciona por sí mismo; Observer y Composite tampoco la garantizan.',
    'El rendimiento crítico de microsegundos no tolera la sobrecarga de múltiples saltos de pila y verificaciones intermedias.',
  ],
};
