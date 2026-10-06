# Seguridad de la aplicación

Este documento describe controles del proyecto y pruebas reproducibles. No contiene resultados de reconocimiento de un servidor, direcciones de infraestructura, inventarios de otras aplicaciones ni credenciales. Conserva los informes de un entorno concreto fuera del repositorio público.

## Controles

- Creación de salas protegida con una clave docente en producción.
- Acceso por claves aleatorias independientes para docente y equipos; almacenamiento de hashes.
- Permisos comprobados en el servidor y resultados recalculados a partir de las configuraciones.
- Protección del cierre y de versiones de trabajo para evitar sobrescrituras.
- Límites de frecuencia, tamaño de solicitudes, almacenamiento y cola de escrituras.
- CSP, protección contra framing, política de referencia y bloqueo de acceso a archivos fuera del directorio público.
- Ejecución en contenedor sin usuario root, con código de solo lectura, capacidades eliminadas y límites de recursos.
- Los textos del usuario se renderizan escapados; no se ejecutan como código ni comandos.

## Pruebas

```bash
pnpm test:rooms
pnpm build
pnpm audit --prod
pnpm audit
```

Las pruebas del proyecto cubren aislamiento de equipos, permisos docentes, puntuación, cierre, origen, acceso a archivos, límites y persistencia. Un resultado satisfactorio no demuestra ausencia total de vulnerabilidades. La imagen, los parches del sistema operativo, TLS, firewall y la configuración efectivamente instalada requieren comprobaciones separadas en cada entorno.

## Dependencias

Consulta los avisos actuales antes de construir. Algunos avisos pueden afectar herramientas de desarrollo que no forman parte de la imagen de ejecución. No expongas Vite en producción ni construyas código de fuentes no confiables en un servidor que contenga datos sensibles. Mantén el lockfile y las imágenes actualizados.

## Secretos y datos privados

No publiques .env, claves de creación, enlaces docentes, claves de equipos, archivos de salas, respaldos, inspecciones completas de variables o registros con datos de participantes. .private-audit está excluido de Git y del contexto de construcción para conservar informes locales; esta exclusión no elimina información que ya haya sido incluida en commits anteriores.

Las rutas y nombres que aparecen en la guía son convenciones de instalación, no valores de credenciales. El dominio configurado en las plantillas de despliegue es una dirección pública; adapta las plantillas a tu entorno. El control de acceso debe depender de claves y permisos, no de ocultar nombres de archivos o el código.

Referencias: [OWASP Node.js](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html), [OWASP CSP](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html).
