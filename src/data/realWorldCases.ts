import { RealWorldCase } from '../types';

export const REAL_WORLD_CASES: RealWorldCase[] = [
  {
    id: 'express-middleware',
    title: 'Pipeline de Middlewares en Express / Node.js',
    tech: 'Node.js / Express.js / Django',
    tag: 'Web & API Gateways',
    problem: 'En una aplicación web, cada petición HTTP entrante requiere múltiples validaciones ortogonales: parsear cookies, verificar tokens JWT, registrar métricas en logs, limitar tasa de peticiones y validar cuerpo JSON antes de llegar al controlador.',
    patternApplication: 'Express implementa una variante cooperativa de Chain of Responsibility: cada middleware es una función `(req, res, next) => void`. El middleware puede atender la petición cerrándola con `res.json(...)`, o delegar en el sucesor invocando `next()`. Si ocurre un error, salta a la cadena especializada de error `(err, req, res, next)`.',
    rolesMapping: [
      { patternRole: 'Handler', realComponent: 'Middleware Function Signature', description: 'Función `(req, res, next)` que estandariza la interfaz de procesamiento.' },
      { patternRole: 'ConcreteHandler', realComponent: 'cors(), authenticateJwt, rateLimiter', description: 'Cada middleware específico implementa una única responsabilidad.' },
      { patternRole: 'Client', realComponent: 'Express HTTP Router', description: 'El router web que recibe la petición del socket TCP y la inyecta al primer middleware.' },
      { patternRole: 'Request', realComponent: 'IncomingMessage (req)', description: 'Objeto de contexto que viaja y se enriquece a lo largo de la cadena.' },
      { patternRole: 'Successor', realComponent: 'Parámetro callback `next`', description: 'Puntero funcional hacia la siguiente función registrada en la pila.' },
    ],
    codeSnippet: `// 1. Eslabón de Autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Token no provisto' }); // Corta la cadena
  }
  req.user = verifyToken(token);
  next(); // Pasa al siguiente eslabón
};

// 2. Eslabón de Roles (RBAC)
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' }); // Corta
  }
  next(); // Pasa al controlador
};

// 3. Ensamblado de la cadena en la ruta
app.post('/admin/billing', authMiddleware, requireAdmin, billingController);`,
    language: 'javascript',
    keyTakeaway: 'A diferencia del GoF estricto donde un solo objeto consume la petición, los middlewares permiten a los eslabones inspeccionar y enriquecer el objeto `req` antes de delegar.',
  },
  {
    id: 'spring-security',
    title: 'Filtros de Seguridad en Spring Security',
    tech: 'Java / Spring Framework',
    tag: 'Enterprise Java',
    problem: 'En aplicaciones empresariales, la seguridad no puede acoplarse al código de negocio. Se requiere certificar el protocolo TLS, prevenir ataques CSRF, negociar cabeceras CORS, verificar sesiones y evaluar permisos de roles de forma desacoplada.',
    patternApplication: 'Spring Security utiliza el componente `FilterChainProxy` y la interfaz `SecurityFilterChain`. La petición HTTP debe atravesar una lista ordenada de objetos que implementan `jakarta.servlet.Filter`. Cada filtro invoca `filterChain.doFilter(request, response)` para continuar o lanza una excepción para interrumpir el ciclo.',
    rolesMapping: [
      { patternRole: 'Handler', realComponent: 'jakarta.servlet.Filter / GenericFilterBean', description: 'Interfaz que define el contrato `doFilter(request, response, chain)`.' },
      { patternRole: 'ConcreteHandler', realComponent: 'CsrfFilter, JwtAuthFilter, AuthorizationFilter', description: 'Filtros dedicados a una amenaza o validación específica.' },
      { patternRole: 'Client', realComponent: 'Servlet Container (Tomcat / Jetty)', description: 'Despacha el `HttpServletRequest` al inicio del pipeline.' },
      { patternRole: 'Request', realComponent: 'HttpServletRequest & SecurityContext', description: 'Datos HTTP y estado de autenticación del hilo de ejecución actual.' },
      { patternRole: 'Successor', realComponent: 'FilterChain.doFilter()', description: 'Mecanismo que delega al siguiente filtro en la lista configurada.' },
    ],
    codeSnippet: `@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .cors(Customizer.withDefaults())
            // Eslabón 1: Protección CSRF
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
            // Eslabón 2: Filtro personalizado antes de la autenticación estándar
            .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            // Eslabón 3: Control de acceso por ruta
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .build();
    }
}`,
    language: 'java',
    keyTakeaway: 'Spring Security demuestra la versatilidad de CoR para inyectar filtros dinámicos en tiempo de configuración sin modificar ningún controlador REST.',
  },
  {
    id: 'dom-bubbling',
    title: 'Propagación de Eventos en el DOM (Event Bubbling)',
    tech: 'Navegador Web / W3C DOM Events',
    tag: 'Frontend Runtime',
    problem: 'En un árbol de documentos HTML con componentes profundamente anidados, ¿cómo se determina qué elemento debe responder a un clic del usuario cuando el usuario interactúa con un elemento hijo?',
    patternApplication: 'El navegador crea una cadena de responsabilidad implícita dictada por la jerarquía del DOM. Cuando ocurre un evento sobre un `<button>`, el evento se propaga hacia arriba (Bubbling) visitando cada nodo ancestro: `<button>` -> `<div class="card">` -> `<main>` -> `<body>` -> `document` -> `window`. Cualquier nodo con un listener puede procesarlo o detener la cadena con `event.stopPropagation()`.',
    rolesMapping: [
      { patternRole: 'Handler', realComponent: 'EventTarget (Cualquier Element del DOM)', description: 'Cualquier nodo HTML que admita `addEventListener`.' },
      { patternRole: 'ConcreteHandler', realComponent: 'Elemento que posee el handler registrado', description: 'Nodo con lógica asociada para responder al tipo de evento.' },
      { patternRole: 'Client', realComponent: 'Motor del Navegador (Blink, Gecko, WebKit)', description: 'Detecta la interacción física del hardware (mouse/touch) y genera el evento.' },
      { patternRole: 'Request', realComponent: 'Objeto Event (MouseEvent / KeyboardEvent)', description: 'Encapsula coordenadas, timestamp, target original y flags de cancelación.' },
      { patternRole: 'Successor', realComponent: '`node.parentElement`', description: 'La relación padre-hijo en el árbol sintáctico determina el siguiente eslabón.' },
    ],
    codeSnippet: `// 1. Manejador en el botón específico
const btn = document.querySelector('#delete-btn');
btn.addEventListener('click', (e) => {
  console.log('Botón presionado: confirmar borrado');
  // Si llamamos a stopPropagation(), la cadena se interrumpe aquí:
  e.stopPropagation(); 
});

// 2. Manejador genérico en la tarjeta contenedora
const card = document.querySelector('.card');
card.addEventListener('click', () => {
  console.log('Clic en la tarjeta: abrir modal de vista previa');
});`,
    language: 'javascript',
    keyTakeaway: 'En el DOM, la cadena no se ensambla manualmente en código: la topología del árbol HTML genera la cadena de sucesores de manera natural.',
  },
  {
    id: 'exception-handling',
    title: 'Propagación de Excepciones en el Call Stack',
    tech: 'Runtimes de Java, C#, Python, C++',
    tag: 'Virtual Machines & Compilers',
    problem: 'Cuando una función o método detecta una situación anómala irrecuperable en su contexto local, ¿cómo busca un manejador capaz de subsanar el error sin obligar a cada función intermedia a verificar códigos de error manualmente?',
    patternApplication: 'El Call Stack actúa como una cadena de responsabilidad inversa. La instrucción `throw` inicia la búsqueda en el marco de pila actual. Si no existe un bloque `catch` coincidente para ese tipo de excepción, el runtime desenrolla la pila (Stack Unwinding) y delega la excepción al método llamador (sucesor). Si ningún marco la atrapa, alcanza el `UncaughtExceptionHandler` por defecto.',
    rolesMapping: [
      { patternRole: 'Handler', realComponent: 'Stack Frame con bloque try/catch', description: 'Marco de función en la pila de ejecución capaz de capturar errores.' },
      { patternRole: 'ConcreteHandler', realComponent: 'Cláusula `catch (SQLException e)` específica', description: 'Manejador filtrado por tipo polimórfico de la excepción.' },
      { patternRole: 'Client', realComponent: 'Instrucción `throw new DatabaseException(...)`', description: 'El punto de código que origina la solicitud de resolución de fallo.' },
      { patternRole: 'Request', realComponent: 'Instancia de `Throwable` / `Exception`', description: 'Contiene el mensaje de error, causa raíz y la traza de la pila.' },
      { patternRole: 'Successor', realComponent: 'Puntero al Marco de Función Llamador (Caller Frame)', description: 'El stack pointer de la máquina virtual.' },
    ],
    codeSnippet: `public void controllerLayer() {
    try {
        serviceLayer(); // Delega hacia abajo
    } catch (ServiceException e) {
        // Atiende la excepción en la capa superior
        logger.error("Error atendido en Controller: " + e.getMessage());
    }
}

private void serviceLayer() {
    repositoryLayer(); // No tiene catch, delega implícitamente a controllerLayer
}

private void repositoryLayer() {
    // Si la BD falla, emite la excepción hacia arriba por la cadena de llamadas
    throw new ServiceException("Conexión con réplica de lectura rechazada");
}`,
    language: 'java',
    keyTakeaway: 'El manejo de excepciones es el ejemplo más puro y universal de Chain of Responsibility integrado a nivel de lenguaje en los compiladores modernos.',
  },
  {
    id: 'it-escalation',
    title: 'Escalamiento en Sistemas de Ticketing (ITSM)',
    tech: 'Jira Service Management / ServiceNow / Zendesk',
    tag: 'Sistemas Empresariales',
    problem: 'Un centro de soporte técnico atiende miles de solicitudes al día. Es inviable que un ingeniero senior responda dudas sobre contraseñas, y es inútil que un operador nivel 1 intente mitigar una brecha de seguridad en la nube.',
    patternApplication: 'Los motores de reglas de ITSM implementan CoR para clasificar y transferir tickets. El ticket entra en Nivel 1. Si no se resuelve en un tiempo SLA o supera el umbral de complejidad técnica, un trigger del sistema lo escala automáticamente a la cola de Nivel 2, y subsecuentemente a Nivel 3 o al Equipo de Crisis.',
    rolesMapping: [
      { patternRole: 'Handler', realComponent: 'Cola de Atención / Regla de Asignación', description: 'Unidad de trabajo con capacidades y permisos definidos.' },
      { patternRole: 'ConcreteHandler', realComponent: 'Tier 1 Helpdesk, Tier 2 NOC, Tier 3 DevOps', description: 'Equipos humanos o agentes automatizados especializados.' },
      { patternRole: 'Client', realComponent: 'Usuario final que reporta la incidencia', description: 'Solo llena el formulario del portal de soporte.' },
      { patternRole: 'Request', realComponent: 'Objeto Ticket / Incidencia', description: 'Payload con severidad, categoría, adjuntos y tiempo transcurrido.' },
      { patternRole: 'Successor', realComponent: 'Política de Escalamiento (Escalation Rule)', description: 'Define a qué grupo o nivel reasignar cuando no se cumple la resolución.' },
    ],
    codeSnippet: `// Representación algorítmica de la regla de escalamiento
class SupportEscalationEngine {
  processTicket(ticket) {
    let currentHandler = this.tier1Helpdesk;
    
    while (currentHandler !== null) {
      if (currentHandler.canResolve(ticket)) {
        return currentHandler.resolve(ticket);
      }
      // Escalamiento automático al sucesor
      console.log(\`Escalando ticket #\${ticket.id} a \${currentHandler.successorName}\`);
      currentHandler = currentHandler.getNextTier();
    }
    
    // Alerta de SLA: Ningún nivel pudo resolver
    this.triggerExecutiveCrisisAlert(ticket);
  }
}`,
    language: 'javascript',
    keyTakeaway: 'En los procesos de negocio, CoR optimiza el costo operativo dirigiendo cada problema al recurso de menor costo capaz de resolverlo.',
  },
];
