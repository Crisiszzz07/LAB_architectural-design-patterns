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

El modo Desafíos del Laboratorio incluye un reto por equipos, sin escribir código:

1. **El eslabón acaparador:** ejecutar la cadena con la Junta Directiva al inicio y reparar el orden manteniendo los límites originales. La comprobación envía cuatro montos.
2. **Solicitud perdida:** observar una compra de $95.000 sin receptor, añadir un fallback terminal y elegir una política. Editar su acción para describir el rechazo, la revisión o el escalamiento; la coherencia de esa decisión se evalúa en la defensa oral.
3. **Seguridad del ERP:** reordenar auditoría, autenticación, autorización y ERP; probar token inválido (401), rol insuficiente (403) y acceso válido (200). Auditoría envuelve la llamada al sucesor para registrar también los rechazos.

La actividad presenta una mesa de reparación: misión y tres criterios de progreso junto a una cadena conectada. «Simular petición» explora un caso; «Validar las 3 pruebas» comprueba las condiciones de la reparación y muestra los resultados en una tabla. Tras superar los criterios se habilita un cierre plegable con tres explicaciones. La rúbrica conserva 10 puntos por configuración y hasta 15 por explicación, sujetos a revisión docente; el juego muestra el progreso de la misión. Equipo, configuraciones, criterios, resultados y borradores se guardan localmente en este navegador y sobreviven a una recarga. En práctica individual no se comparten entre dispositivos ni se envían al docente. En una sala, el servidor conserva el avance y el docente recibe las entregas. Si el almacenamiento está bloqueado, la interfaz lo indica. La animación se pausa al cambiar de ronda; restaurar la falla conserva los borradores.

El Laboratorio abre en Exploración libre. Ambos modos conservan estados independientes al cambiar de modo o de sección. Exploración libre mantiene su estado durante la sesión; Desafíos guarda el avance localmente. En Desafíos, el dominio está fijado por la misión. El enlace `#laboratorio/desafios` abre directamente la actividad; `#laboratorio/explorar` abre la exploración libre. Estos enlaces seleccionan el modo. «Salas de equipos» permite crear o entrar a una sala sincronizada.

### Salas sincronizadas sin cuentas

Las salas tienen dos accesos: un QR/enlace público para equipos y un enlace privado para el docente. Cada equipo recibe una clave aleatoria guardada en su navegador; ningún equipo puede leer el trabajo de otro ni abrir misiones. El docente ve las configuraciones validadas y las explicaciones recibidas. El servidor recalcula criterios y resultados, y comprueba que la misión esté abierta antes de aceptar cambios. La animación de las peticiones permanece en el dispositivo.

**Prueba local** (Node.js 22 o posterior):

```bash
pnpm install
pnpm dev:rooms
```

Abre `http://localhost:5173/#salas`. Este comando inicia Vite en el puerto 5173 y el servidor de salas en el 3001, con reinicio automático del backend cuando cambia su código; ambos deben estar libres. También puedes iniciarlos por separado con `pnpm server` y `pnpm dev`. Vite dirige `/api` al servidor local mediante su [proxy de desarrollo](https://vite.dev/config/server-options#server-proxy).

1. Crea una sala docente. Despliega «Invitar equipos y guardar enlace docente». Guarda el enlace privado y comparte únicamente el enlace público o QR.
2. Abre el enlace público en otro navegador o ventana privada. Entra como «Delta». Para otro equipo, usa otro perfil o navegador y entra como «Omega». Las pestañas del mismo perfil recuperan el mismo equipo: se recomienda un único dispositivo operador por equipo.
3. Desde el control docente, pulsa «Abrir misión 1». Ambos equipos deben ver la misión en aproximadamente 1–2 segundos.
4. En Delta, mueve Junta Directiva al final y valida. Debe aparecer 3/3. Abre la explicación, completa las tres respuestas y pulsa «Guardar solución». Espera a que el estado de la sala indique «Sincronizado». En el control docente, Delta debe mostrar «Entrega recibida»; Omega mantiene su propio avance.
5. Recarga Delta: deben recuperarse el nombre, la configuración y las respuestas. Recarga el enlace privado: recuperas el control y las entregas.
6. Cierra la misión: los equipos siguen viendo su trabajo, pero los controles de reparación quedan deshabilitados. Abre la misión 3: ambos pasan a ella, conservando la misión 1.
7. Para probar una desconexión, activa Offline en las herramientas del navegador del equipo, modifica la cadena o un borrador y comprueba el aviso «Sin conexión». Vuelve a Online con la misma misión abierta: los cambios pendientes deben sincronizarse. Una misión cerrada no acepta trabajo nuevo; el borrador queda local y solo podrá enviarse al reabrir esa misión.

**Prueba desde teléfonos en la misma red:** abre primero la web docente con la IP local del computador, por ejemplo `http://192.168.1.20:5173/#salas`, y genera el QR desde esa dirección. `localhost` en un teléfono apunta al teléfono. El computador y los teléfonos necesitan poder comunicarse por el puerto 5173.

**Ejecución con la web compilada:**

```bash
pnpm build
pnpm start
```

Abre `http://localhost:3001/#salas`. Un único servidor sirve la web compilada y la API. Para publicarlo necesitas alojamiento que ejecute Node y un disco/volumen persistente; publicar solo `dist` en GitHub Pages conserva la práctica individual, pero no habilita las salas. Usa HTTPS en la dirección pública. Esta implementación está pensada para una sola instancia del servidor; no ejecutes varios procesos sobre el mismo archivo de datos.

Variables de entorno opcionales:

| Variable | Predeterminado | Uso |
| --- | --- | --- |
| `PORT` | `3001` | Puerto del servidor; en desarrollo el proxy espera 3001. |
| `HOST` | `0.0.0.0` | Interfaz donde escucha el servidor. |
| `ROOM_DATA_DIR` | `.room-data` | Directorio privado y persistente de las salas. |
| `ROOM_ALLOWED_ORIGIN` | Origen del servidor | Origen exacto de la web si hay un proxy inverso; por ejemplo `https://lab.ejemplo.com`. |

Los datos se escriben en `rooms.json` antes de confirmar el guardado y sobreviven al reinicio del servidor. `.room-data` está excluido de Git. Conserva ese directorio al desplegar y respáldalo si necesitas mantener las entregas. Las salas no caducan automáticamente. Sin el enlace docente o la clave del navegador del equipo no hay recuperación por nombre ni por correo. La explicación puede calificarse desde el control docente. La exportación de resultados todavía no está implementada.

El estado del equipo se consulta aproximadamente cada segundo y el control docente cada dos segundos. Los cambios pendientes se guardan en un borrador local separado para cada sala/equipo. Una entrega solo cuenta como recibida cuando el servidor la confirma. Si dos pestañas intentan escribir para el mismo equipo, el servidor rechaza la versión desactualizada y la interfaz permite descargar el borrador antes de recargar.

**Pruebas automatizadas del servidor:**

```bash
pnpm test:rooms
pnpm build
```

Comprueban aislamiento de equipos, permisos, resultados calculados en el servidor, rechazo de entregas incorrectas, cierre de misiones, conflictos entre escrituras y recuperación del trabajo tras reiniciar.

### Puntos y finalización de la actividad

Cada misión aporta hasta **25 puntos**: 10 por una reparación con los tres criterios validados y hasta 15 por la explicación recibida. El docente asigna de 0 a 5 puntos a **Receptor**, **Orden** y **Consecuencia** dentro de la entrega del equipo. El total máximo es **75 puntos**. Las validaciones repetidas no acumulan puntos. El servidor calcula la puntuación; los equipos solo pueden consultar sus propios puntos durante el juego.

Los puntos reflejan la reparación actual guardada y la última entrega calificada. Si se cambia la configuración o se guarda otra explicación, la calificación anterior se invalida y el docente debe revisar la nueva entrega. Editar un borrador sin volver a entregar no cambia la calificación de la explicación ya recibida.

El botón docente **Finalizar actividad** abre una confirmación con el número de equipos, los que tienen misiones pendientes y las explicaciones sin calificar. Cancelar o pulsar Escape mantiene la actividad abierta. Confirmar cierra todas las misiones y publica una clasificación definitiva, **aunque existan equipos con misiones en progreso o sin empezar**. Solo cuentan los cambios recibidos por el servidor antes del cierre; las explicaciones no calificadas aportan 0 puntos.

El equipo con más puntos gana. Los empates muestran ganadores compartidos, incluso si todos tienen 0 puntos. Si no hay equipos, el resultado lo indica. La clasificación final muestra nombres y puntuaciones, sin publicar las explicaciones privadas. Después del cierre no se puede reabrir una misión, modificar notas, aceptar entregas ni incorporar equipos. El resultado sobrevive a recargas y reinicios del servidor; para jugar de nuevo se crea otra sala.

**Prueba rápida con dos perfiles:**

1. Abre el control docente y entra como Delta y Omega desde dos perfiles independientes.
2. Abre misión 1. En Delta, repara el orden y valida: debe mostrar **10/75 puntos**, aunque todavía no haya entregado una explicación.
3. Entrega las tres explicaciones. En el control docente, abre la entrega de Delta y califica **5, 4 y 3**. Guarda: Delta debe mostrar **22/75**.
4. Deja Omega sin reparar y las misiones 2 y 3 sin empezar. Pulsa **Finalizar actividad**: el cuadro debe permitir confirmar pese a las misiones pendientes. Primero cancela y comprueba que el juego sigue abierto.
5. Confirma el cierre. Tanto el docente como los equipos deben ver **Equipo ganador: Delta**, con 22 puntos, y la clasificación final. Recarga ambos perfiles: el resultado permanece.
6. Comprueba que abrir misiones, calificar y entregar quedan bloqueados. El enlace público también permite consultar el resultado, pero ya no entrar como un nuevo equipo.

Si ya tenías una versión anterior ejecutándose, detén el proceso con Ctrl+C y vuelve a ejecutar `pnpm dev:rooms`. Desde esta versión, el backend se reinicia automáticamente al cambiar su código. Los procesos iniciados con `pnpm server` o `pnpm start` requieren reinicio manual. Un error «Ruta desconocida» al guardar puntos, junto con puntuaciones en cero pese a una reparación correcta, puede indicar que la página está usando un backend anterior.

### Despliegue con Podman

El despliegue incluye un `Containerfile`, un volumen persistente, un servicio systemd y un sitio independiente de Nginx. Consulta [deploy/README.md](deploy/README.md) para construir la imagen, instalar el servicio, obtener HTTPS y respaldar las salas. Los archivos de despliegue no publican la aplicación automáticamente ni solicitan certificados por sí solos.

### Seguridad antes de publicar

En producción se requiere una clave docente para **crear** salas, configurada mediante `ROOM_CREATION_KEY` o `ROOM_CREATION_KEY_FILE`, y `ROOM_ALLOWED_ORIGIN` con HTTPS. No es una cuenta estudiantil: los equipos continúan usando nombre y clave de sesión automática. En desarrollo local la clave es opcional; con `ROOM_CREATION_KEY` configurada también se exige.

La instalación Podman usa un secreto montado y un volumen separado. Los pasos de actualización y comprobación están en [deploy/README.md](deploy/README.md), y el alcance y los riesgos pendientes de la auditoría en [deploy/SECURITY-AUDIT.md](deploy/SECURITY-AUDIT.md).
