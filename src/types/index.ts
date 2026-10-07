export type OperatorType = 'lte' | 'gte' | 'eq' | 'contains';

export interface HandlerNode {
  id: string;
  name: string;
  role: string;
  description: string;
  operator: OperatorType;
  threshold: number;
  unit?: string;
  canHandleConditionText: string;
  actionSummary: string;
  stopOnHandle: boolean;
  avatarIcon: string;
}

export interface RequestPayload {
  id: string;
  title: string;
  value: number;
  unit?: string;
  category: string;
  details: string;
}

export interface SimulationStep {
  stepIndex: number;
  nodeId: string | 'client' | 'sink';
  status: 'transiting' | 'evaluating' | 'handled' | 'delegating' | 'unhandled';
  message: string;
  codeLineKey: 'client_send' | 'eval_condition' | 'do_handle' | 'call_successor' | 'no_successor_sink';
  codeLineNumber: {
    java: number;
    typescript: number;
    python: number;
    go: number;
  };
  passedCondition: boolean | null;
}

export interface PresetChain {
  id: string;
  title: string;
  badge: string;
  domain: string;
  description: string;
  unit: string;
  inputLabel: string;
  inputMin: number;
  inputMax: number;
  inputStep: number;
  sampleRequests: RequestPayload[];
  handlers: HandlerNode[];
}

export interface QuizOption {
  id: string;
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  architecturalInsight: string;
}

export interface RealWorldCase {
  classification: 'Middleware documentado' | 'Mecanismo relacionado' | 'Analogía de negocio';
  source: { title: string; url: string };
  snippetNote: string;
  id: string;
  title: string;
  tech: string;
  tag: string;
  problem: string;
  patternApplication: string;
  rolesMapping: {
    patternRole: 'Handler' | 'ConcreteHandler' | 'Client' | 'Request' | 'Successor';
    realComponent: string;
    description: string;
  }[];
  codeSnippet: string;
  language: string;
  keyTakeaway: string;
}

export type SupportedLanguage = 'java' | 'typescript' | 'python' | 'go';
