# Verificación de las correcciones académicas

Fecha: 2026-10-06. Rama: `deploy/podman`. Base: `829bc4c`. La inspección inicial encontró el árbol limpio y ningún `AGENTS.md`; se leyó `README.md`. No se cambió de rama.

## Alcance y relaciones

Las plantillas alimentan ambos visores; el simulador publica `SimulationStep`. El helper resuelve las cinco claves a partir de las plantillas, conservando la forma de `SimulationStep`. El UML y su inspector comparten los datos de referencia. La galería consume los casos y sus nuevas atribuciones. Las misiones y el servidor siguen utilizando las mismas reglas compartidas: no se duplicaron ni modificaron `evaluateRepair` ni `runHttp`.

| Archivo | Motivo |
| --- | --- |
| `README.md` | Descripción didáctica, distinción de mecanismos y etiqueta de validación. |
| `src/components/about/AboutPage.tsx` | Correspondencia didáctica, alcance de simulación individual y salas, teoría y descripción fiel del quiz. |
| `src/data/quickReference.ts` | Matices de CoR, SRP/OCP, requisitos frente a recomendaciones y datos del inspector. |
| `src/components/reference/QuickReference.tsx` | Variante clásica/middleware, atribución de paráfrasis, bibliografía y fuentes oficiales. |
| `src/components/reference/InteractiveUml.tsx` | Abstracción, sucesor opcional, dependencia abierta, autoasociación navegable `successor` con `0..1`, conservando la distribución anterior de atributos y métodos y aclarando que el atributo y la asociación representan la misma propiedad, firmas abreviadas coherentes con el inspector y selección por teclado. |
| `src/data/realWorldCases.ts` | Clasificaciones, fuentes, límites y dependencias de los fragmentos; CSRF sin exclusión general en el ejemplo. |
| `src/components/cases/RealWorldGallery.tsx` | Presentación discreta de clasificación, fuentes y autoría didáctica. |
| `src/data/quizQuestions.ts` | Correcciones de opciones y distractores, manteniendo IDs y respuestas correctas. |
| `src/data/codeTemplates.ts` | Operación válida al quedar sin receptor en Java, dependencias omitidas, entradas definidas, contrato Python y helper de líneas. |
| `src/components/code/SynchronizedCodeViewer.tsx` | Etiqueta honesta, nota visible, líneas por clave, conceptos neutrales y ajuste de controles largos. |
| `src/components/workbench/InlineCodeViewer.tsx` | La misma correspondencia y advertencia didáctica en el visor integrado. |
| `src/components/workbench/ChainSimulator.tsx` | Elimina números manuales y adapta la guía a cada dominio, conservando el algoritmo numérico. |
| `src/data/presets.ts` | Gastos accesibles hasta 100.000 para probar 95.000 sin cambiar umbrales; soporte hipotético y encuadre numérico del riesgo. IDs, operadores y capacidades conservados. |
| `src/components/workbench/OperationGame.tsx` | Criterios separados de casos de prueba; elimina el resaltado numérico al entrar en la misión HTTP, también si cambia la misión de una sala. |
| `src/components/workbench/HttpChallengePipeline.tsx` | Nota del dominio de compras/admin frente al prototipo Java RF03 y diferencia de ensamblado. |
| `src/components/workbench/UnhandledAlert.tsx` | Solicitud sin atender informada explícitamente y terminal que puede rechazar, registrar o escalar. |
| `src/types/index.ts` | Metadatos de clasificación, fuente y dependencias del caso; `SimulationStep` conserva su contrato. |
| `tests/lab.test.mjs` | Cinco pruebas con Node y TypeScript ya instalados, sin nuevos paquetes. |
| `tests/ACADEMIC-VERIFICATION.md` | Evidencia, alcance y limitaciones de la revisión. |

## Línea base y comprobaciones finales

- `pnpm build`: pasó antes de editar y después de la última edición productiva; TypeScript y Vite 6.4.3. Node utilizado: 24.21.0. No se cambió el mínimo de Node 22.
- `pnpm test:rooms`: falló inicialmente dentro del sandbox, que impide abrir puertos locales. Al ejecutarlo fuera del sandbox pasó en la línea base y al terminar: **8/8**. No se identificó un fallo preexistente del servidor en estas pruebas.
- `node --test --test-isolation=none tests/lab.test.mjs`: **5/5**. El comando sin `--test-isolation=none` también se ejecutó correctamente; el flag permite mostrar cada caso en este entorno.
- `git diff --check`: pasó.

Las pruebas añadidas comprueban responsables para 350, 2.200, 8.500 y 32.000; acaparamiento fallido; 95.000 accesible y sin receptor estándar; ausencia de fallback; terminal completo y las tres políticas existentes; rechazo de terminal que sólo cubre 95.000; 401/403/200 seguros y auditados al regresar; ERP prematuro inseguro; auditoría posterior al rechazo no ejecutada. Verifican también continuidad de números, unicidad y pertinencia de las cinco claves en los cuatro lenguajes, los ocho IDs y las respuestas correctas originales del quiz.

Las ocho pruebas existentes cubren creación protegida, permisos docentes y de equipos, aislamiento, entrega, revisión, puntuación, cierre, concurrencia y recuperación tras reiniciar un servidor **de prueba**, así como CSP, origen, traversal, límites de frecuencia y disco. Usan `mkdtemp` y puertos locales temporales; no salas existentes.

## Navegador y presentación

Se usaron Playwright y Chromium ya disponibles en `/tmp/cor-ui-check` y la caché local, sin instalar herramientas. Vite preview sirvió únicamente el build local en `127.0.0.1:4187`; los perfiles de navegador fueron temporales y aislados. No se conectó esta revisión a salas reales.

Las comprobaciones de navegador se ejecutaron en dos recorridos, más una comprobación específica del resaltado móvil:

- Emisión, pausa, reproducción, siguiente paso y reinicio.
- Añadir, editar, eliminar y reordenar nodos; restaurar configuración; cambiar los tres dominios.
- Cambiar los cuatro lenguajes en ambos visores; comparar el portapapeles con cada fragmento visible: coinciden.
- Resolver el quiz conservando el resultado **8/8**.
- Navegar mediante pestañas, atajos y hash de exploración/desafíos.
- Reparar las tres misiones en la interfaz: cuatro montos y tres criterios; un caso fuera de rango y tres criterios; tres casos HTTP y tres criterios.
- Guardar explicaciones, navegar y recargar: mismo equipo, configuración, criterios, evidencia, borradores y solución; comparación exacta del espacio `cor-operation-v2` antes/después de recargar.
- Simular 401, 403 y 200 en la misión HTTP, pausar y avanzar hasta la auditoría de la respuesta.
- Al entrar en Seguridad ERP, el visor no presenta un paso del ejemplo numérico como si correspondiera a HTTP.
- Seleccionar las cuatro clases UML mediante teclado y comprobar el inspector.
- Propósito, código, casos, referencia y misiones a **1280 px y 390 px**: sin desbordamiento horizontal de página. Código, tablas y UML conservan sus contenedores con desplazamiento. Revisión visual de capturas y fuentes legibles.
- Resaltado `no_successor_sink` a 390 px en ambos visores: ancho de página 390 px, sin errores de JavaScript.

Los recorridos completos no registraron errores de JavaScript. Las capturas temporales incluyen `/tmp/cor-uml-390.png`, `/tmp/cor-code-390.png`, `/tmp/cor-cases-390.png` y `/tmp/cor-mission-390.png`. Los scripts temporales de revisión están en `/tmp/cor-academic-full-ui.mjs`, `/tmp/cor-academic-mission-ui.mjs` y `/tmp/cor-academic-ui.mjs` (comprobación de resaltado móvil). Las capturas no forman parte del despliegue.

## Limitaciones y exclusiones

- **Limitación preexistente verificada:** el quiz reinicia sus respuestas al salir de su pestaña y tampoco las persiste al recargar. `App.tsx` monta condicionalmente `QuizModule`, cuyo estado sólo reside en React. Ambos archivos permanecen sin cambios; no se añadió un sistema de persistencia nuevo. La persistencia de las misiones sí se verificó.
- No se verificó la interfaz completa de salas en múltiples dispositivos físicos, ni producción, ni Podman/Nginx/systemd; la evidencia de salas corresponde a las pruebas locales de integración existentes. No se necesitaron credenciales reales.
- No se compilaron programas completos Java, Python o Go: se entregan fragmentos ilustrativos con dependencias omitidas explícitas. La prueba de build verifica la aplicación TypeScript, y la de líneas verifica la correspondencia didáctica.
- No se hizo push, PR ni despliegue; no se reiniciaron servicios de producción, no se crearon/modificaron salas reales ni se tocaron `.room-data`, volúmenes o almacenamiento del navegador del usuario. No se modificaron backend, evaluación, puntuación, autenticación, secretos, políticas de seguridad, `Containerfile`, `deploy/`, dependencias o lockfile.

## Fuentes consultadas

Se verificaron las referencias oficiales y se enlazan en la aplicación:

- [Express: Using middleware](https://expressjs.com/en/guide/using-middleware/).
- [Spring Security: Servlet architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html).
- [WHATWG: DOM Standard](https://dom.spec.whatwg.org/).
- [Java Language Specification: Exceptions](https://docs.oracle.com/javase/specs/jls/se22/html/jls-11.html).
- [Atlassian: Escalation policies](https://www.atlassian.com/incident-management/on-call/escalation-policies), como política de negocio, sin inferir implementación interna de CoR.
- [O'Reilly: Fundamentals of Software Architecture, edición 2020](https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/): índice del capítulo 3, “Modularity”, con cohesión y acoplamiento.

Se retiraron las páginas GoF no verificadas, conservando la referencia bibliográfica. Los textos de definición se identifican como paráfrasis en español y los ejemplos como código didáctico propio.
