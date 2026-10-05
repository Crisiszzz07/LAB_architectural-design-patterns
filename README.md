# Laboratorio Interactivo: Chain of Responsibility (GoF)

Proyecto desarrollado para la clase de Arquitectura de Software en la Universidad de Cartagena.

---

## De qué trata este proyecto

Aprender patrones de diseño leyendo diapositivas o memorizando diagramas estáticos suele ser a veces tedioso y poco práctico para personas que están más acostumbradas a un estilo de aprendizaje más visual e interactivo. Por eso el objetivo de este lab: un laboratorio web donde en vez de solo leer sobre el patrón Chain of Responsibility (Cadena de Responsabilidad), puedes interactuar directamente con él.

La idea es que puedas armar tu propia cadena de manejadores, cambiarles el orden, modificar las condiciones, enviar peticiones y ver en tiempo real cómo viaja la información entre los eslabones o qué pasa cuando nadie la atiende.

---

## Qué encuentras en la aplicación

La página está dividida en seis secciones pensadas para llevar un orden lógico de estudio:

1. **Propósito**: Es la pantalla de inicio. Aquí explico qué es la herramienta, cuál es el objetivo pedagógico del proyecto y los conceptos clave que deberías tener claros (como el receptor implícito, los principios SOLID aplicados y los riesgos comunes del patrón).
2. **Laboratorio**: Dos modos internos: **Exploración libre**, con el simulador original, y **Desafíos**, con Operación: Cadena Rota. En exploración, Puedes probar ejemplos preconfigurados (como aprobación de gastos empresariales, soporte técnico por niveles o filtros de seguridad HTTP) o crear tu propia cadena desde cero. Puedes pausar la simulación, avanzar paso a paso y ajustar la velocidad.
3. **Código Vivo**: Muestra la implementación limpia del patrón en Java, TypeScript, Go y Python. Lo chévere es que mientras corre la simulación, se va resaltando la línea exacta de código que se está ejecutando.
4. **Autoevaluación**: Un quiz con preguntas estilo parcial universitario para ponerte a prueba. Cada opción viene con una explicación detallada de por qué es correcta o no, ideal para repasar antes de un examen.
5. **Casos Reales**: Para aterrizar la teoría a la industria. Explico cómo este patrón de 1994 es la base de cosas que usamos a diario, como los middlewares de Express.js o Django, la seguridad en Spring y la propagación de eventos en el DOM.
6. **Referencia & UML**: El diagrama de clases formal del libro de GoF interactivo junto con un resumen de ventajas, desventajas y cuándo conviene (y cuándo no) usar este patrón. Además de encontrar el material que usé para el estudio de este patrón.


---

## Cómo correrlo en tu computador

Para probarlo en local solo necesitas tener instalado Node.js y pnpm (o npm si prefieres, yo siempre recomiendo pnpm).

1. Clona este repositorio o descarga los archivos.
2. Abre la terminal en la carpeta del proyecto e instala las dependencias:
```bash
pnpm install
```
*(Si usas npm, ejecuta `npm install`)*.

3. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

4. Abre en tu navegador el enlace que te salga en la consola (por lo general es `http://localhost:8080` o `http://localhost:5173` como fue en mi caso si está ya ocupado).

---

## Atajos de teclado

Para moverte rápido entre pestañas sin usar el mouse, puedes usar los números del teclado:

- Tecla 1: Propósito
- Tecla 2: Laboratorio
- Tecla 3: Código Vivo
- Tecla 4: Autoevaluación
- Tecla 5: Casos Reales
- Tecla 6: Referencia & UML

---

## Tecnologías utilizadas

- React 18 con TypeScript
- Vite
- Tailwind CSS
- Lucide React (iconografía)
- Canvas Confetti (para celebrar cuando sacas buen puntaje en el quiz)

---

## Autoría

Este es un proyecto que fue creado con fines educativos para la materia de Arquitectura de Software de la UdeC, ya que me tocó exponer acerca del patrón de Chain of responsability, por lo que decidí hacer algo diferente para que sea un poco más interactivo. Sería genial que en un futuro este respositorio crezca un poco más e incluya todos los patrones dados en el curso para contar con un material muy interactivo.

### Operación: Cadena Rota

El modo Desafíos del Laboratorio incluye un reto por equipos de 15–20 minutos, sin escribir código:

1. **El eslabón acaparador:** ejecutar la cadena con la Junta Directiva al inicio y reparar el orden manteniendo los límites originales. La comprobación envía cuatro montos.
2. **Solicitud perdida:** observar una compra de $95.000 sin receptor, añadir un fallback terminal y elegir una política. Editar su acción para describir el rechazo, la revisión o el escalamiento; la coherencia de esa decisión se evalúa en la defensa oral.
3. **Seguridad del ERP:** reordenar auditoría, autenticación, autorización y ERP; probar token inválido (401), rol insuficiente (403) y acceso válido (200). Auditoría envuelve la llamada al sucesor para registrar también los rechazos.

La actividad presenta una mesa de reparación: misión y tres criterios de progreso junto a una cadena conectada. «Simular petición» explora un caso; «Validar las 3 pruebas» comprueba las condiciones de la reparación y muestra los resultados en una tabla. Tras superar los criterios se habilita un cierre plegable con tres explicaciones. La rúbrica conserva 10 puntos por configuración y hasta 15 por explicación, sujetos a revisión docente; el juego muestra el progreso de la misión. Equipo, configuraciones, criterios, resultados y borradores se guardan localmente en este navegador y sobreviven a una recarga. No se comparten entre dispositivos ni se envían al docente. Si el almacenamiento está bloqueado, la interfaz lo indica. La animación se pausa al cambiar de ronda; restaurar la falla conserva los borradores.

El Laboratorio abre en Exploración libre. Ambos modos conservan estados independientes al cambiar de modo o de sección. Exploración libre mantiene su estado durante la sesión; Desafíos guarda el avance localmente. En Desafíos, el dominio está fijado por la misión. El enlace `#laboratorio/desafios` abre directamente la actividad; `#laboratorio/explorar` abre la exploración libre. Estos enlaces seleccionan el modo; las salas sincronizadas todavía no están implementadas.
