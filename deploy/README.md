# Despliegue de producción con Podman

Configura un nombre DNS que llegue al servidor y verifica su certificado al instalar. No publiques el puerto interno de la aplicación en internet.

## 1. Llevar la versión actual a GitHub y clonar

En el computador de desarrollo, revisa los cambios y sube los archivos de la aplicación y de `deploy/`. No incluyas `.room-data`, `.env`, claves o copias de bases de datos. Clonar una versión anterior no incluye las salas ni los puntos nuevos.

En el servidor, como administrador:

```bash
podman --version
command -v podman
command -v certbot
ss -ltnp | grep ':3001 '
```

El puerto 3001 debe estar libre. El servicio suministrado usa `/usr/bin/podman`; si `command -v podman` devuelve otra ruta, cambia las dos rutas en `deploy/cor-lab.service` antes de instalarlo. Antes de copiar las plantillas, sustituye `chain-of-respon.duckdns.org` por tu dominio si corresponde.

Si ya existe un servicio o contenedor `cor-lab`, usa la sección de actualización; no lo reemplaces como una instalación nueva.

```bash
mkdir -p /opt/cor-lab
cd /opt/cor-lab
git clone --branch deploy/podman https://github.com/Crisiszzz07/LAB_architectural-design-patterns.git app
cd app
podman build --pull=missing -t localhost/cor-lab:latest -f Containerfile .
podman volume create --ignore cor-lab-data
```

Esta guía utiliza Podman administrado por systemd, pero el proceso de la aplicación dentro del contenedor corre como `node`, sin capacidades adicionales. El código y sus dependencias se compilan dentro de la imagen; no hace falta instalar pnpm en la VM.

## 2. Clave docente y servicio

En producción la aplicación no arranca sin una clave de creación. Genera una clave de 256 bits solo en la VM y guárdala fuera del repositorio:

```bash
install -d -m 700 /etc/cor-lab
(umask 077; openssl rand -hex 32 > /etc/cor-lab/creation-key)
podman secret create cor-lab-creation-key /etc/cor-lab/creation-key
```

Si ese archivo o secreto ya existe, **no lo regeneres** durante una actualización. La clave se escribe en el campo «Clave docente para crear salas»; los estudiantes no la necesitan. Consúltala únicamente en tu terminal privada con `cat /etc/cor-lab/creation-key`. No la compartas por chat ni la pongas en Git. Se monta como secreto de solo lectura para el usuario `node`; no está en la imagen, en el HTML ni en los argumentos de Node.


```bash
install -m 644 deploy/cor-lab.service /etc/systemd/system/cor-lab.service
systemctl daemon-reload
systemctl enable --now cor-lab.service
systemctl status cor-lab.service --no-pager
curl --fail http://127.0.0.1:3001/api/health
```

La última consulta debe devolver un JSON con `"ok":true` y `"roomCreationProtected":true`. Si falla:

```bash
journalctl -u cor-lab.service -n 60 --no-pager
podman logs cor-lab
```

Las salas se guardan en `cor-lab-data`, no en el contenedor ni en Git. Mantén una sola instancia porque el almacenamiento actual es un archivo JSON y usa serialización en un único proceso.

## 3. Añadir el sitio de Nginx

Comprueba que `/etc/nginx/conf.d/*.conf` esté incluido en la configuración y que el dominio no tenga ya una configuración propia:

```bash
nginx -T 2>/dev/null | grep -E 'include.*conf.d|server_name.*chain-of-respon'
```

Si el archivo destino existe, revísalo y respáldalo antes de reemplazarlo. Si no existe:

```bash
install -m 644 deploy/cor-lab-security.nginx.conf /etc/nginx/conf.d/cor-lab-security.conf
install -m 644 deploy/cor-lab.nginx.conf /etc/nginx/conf.d/cor-lab.conf
nginx -t
```

Solo si `nginx -t` termina correctamente:

```bash
systemctl reload nginx
curl --fail http://TU_DOMINIO/api/health
```

Comprueba también esa dirección desde datos móviles. El JSON debe proceder de este proyecto. Si hay `502` y el servicio responde localmente, comprueba los registros de Nginx y SELinux:

```bash
tail -n 30 /var/log/nginx/cor-lab.error.log
getsebool httpd_can_network_connect
getenforce
```

Si SELinux bloquea las conexiones del proxy y el booleano está desactivado, el administrador puede habilitarlo:

```bash
setsebool -P httpd_can_network_connect 1
```

Esta opción afecta a los servidores web de la VM. No desactives SELinux ni cambies las configuraciones de las aplicaciones existentes.

## 4. HTTPS

Si Certbot y el plugin de Nginx ya están instalados:

```bash
certbot --nginx --redirect -d TU_DOMINIO
nginx -t
certbot renew --dry-run
curl --fail https://TU_DOMINIO/api/health
```

Elige un correo para avisos y acepta las condiciones de Let's Encrypt al solicitar el certificado. Comprueba el mecanismo de renovación automática de la instalación de Certbot. Si Certbot falta, usa las instrucciones oficiales correspondientes a Rocky/RHEL 8 y comprueba el plugin con `certbot plugins`: https://certbot.eff.org/instructions?ws=nginx&os=centosrhel8

No uses `curl -k` para la prueba final: debe validar el certificado. El sitio HTTP inicial sirve para verificar el proxy y obtener el certificado; crea las salas de clase solo cuando HTTPS esté funcionando, porque la configuración del contenedor exige el origen HTTPS.

## 5. Prueba real

Abre `https://TU_DOMINIO/#salas` desde datos móviles. Crea una sala usando la clave docente, entra con otro perfil y completa una misión. Comprueba puntos, entrega y cierre general. Reinicia el servicio y recarga los perfiles: los datos deben permanecer.

Las salas que existan únicamente en el navegador o servidor local del computador no se transfieren automáticamente a la VM. No pongas enlaces docentes ni claves de equipos en registros públicos o commits.

## Actualizar sin perder salas

Construye antes de detener el contenedor y conserva la imagen anterior para poder volver atrás:

```bash
cd /opt/cor-lab/app
podman tag localhost/cor-lab:latest localhost/cor-lab:previous
git pull --ff-only
podman build -t localhost/cor-lab:latest -f Containerfile .
```

Solo si la construcción termina correctamente:

```bash
systemctl restart cor-lab.service
curl --fail http://127.0.0.1:3001/api/health
```

No elimines `cor-lab-data`. Un push no actualiza automáticamente la VM.

## Respaldo

El archivo de datos se reemplaza mediante escritura temporal y renombrado. Puedes copiar la versión confirmada desde el contenedor:

```bash
install -d -m 700 /var/backups/cor-lab
podman cp cor-lab:/data/rooms.json /var/backups/cor-lab/rooms.json
chmod 600 /var/backups/cor-lab/rooms.json
```

El archivo existe después de la primera escritura de una sala. Cada copia reemplaza la anterior: conserva versiones fechadas si necesitas histórico y una copia fuera de la VM para protegerte de pérdida del disco. El respaldo contiene las respuestas y hashes de acceso, por lo que debe permanecer privado.

## Actualizar una instalación previa a la auditoría de seguridad

Conserva el volumen y respalda las salas. Crea el secreto **una sola vez** como se indica en el paso 2. Después actualiza y construye:

```bash
cd /opt/cor-lab/app
git pull --ff-only
podman build --pull=always -t localhost/cor-lab:latest -f Containerfile .
install -m 644 deploy/cor-lab.service /etc/systemd/system/cor-lab.service
install -m 644 deploy/cor-lab-security.nginx.conf /etc/nginx/conf.d/cor-lab-security.conf
systemctl daemon-reload
systemctl restart cor-lab.service
curl --fail http://127.0.0.1:3001/api/health
```

**No copies la plantilla HTTP sobre un sitio que Certbot ya convirtió a HTTPS**: perderías las directivas TLS. En su lugar instala el fragmento:

```bash
install -d -m 755 /etc/nginx/snippets
install -m 644 deploy/cor-lab-security-server.conf /etc/nginx/snippets/cor-lab-security-server.conf
```

En el bloque `server` **HTTPS** de este dominio, conserva los certificados, la redirección HTTP y el proxy, y añade:

```nginx
include /etc/nginx/snippets/cor-lab-security-server.conf;
```

El archivo de zonas `cor-lab-security.conf` se carga a nivel `http` mediante `conf.d`; el fragmento se incluye dentro de este `server`, nunca directamente en `conf.d`. Si alguna directiva de límites ya está escrita dentro del mismo bloque, intégrala en lugar de duplicarla. No añadas la inclusión a los sitios de otras aplicaciones. Guarda antes una copia de tu archivo de sitio fuera de `conf.d`, por ejemplo en `/var/backups/cor-lab/`.

```bash
nginx -t && systemctl reload nginx
curl --fail https://TU_DOMINIO/api/health
curl -I https://TU_DOMINIO/
```

La salud debe indicar `roomCreationProtected:true` y la página debe devolver CSP, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` y `X-Content-Type-Options: nosniff`. La clave de creación de salas no invalida los enlaces docentes ni las claves de equipos existentes.

El contenedor queda limitado a 1 CPU, 512 MiB de memoria, 128 procesos, sin capacidades adicionales, sin socket de Podman, con código de solo lectura y un único volumen de datos. El backend limita escrituras y lectura por credencial, entradas por IP/sala, cuerpos a 128.000 bytes, la cola a 32 escrituras y el archivo de salas a 16 MiB. Si alcanza el límite de datos, respalda y archiva salas fuera del servicio; no aumentes límites sin comprobar recursos.
