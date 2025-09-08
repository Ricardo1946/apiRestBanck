# **ApiNodejs — Card Service (Express + Node.js + MongoDB — MVC)**

 ## API REST para emisión, activación y bloqueo de tarjetas.

    Estructura: arquitectura MVC, MongoDB Atlas, validaciones, manejo centralizado de errores.


 ## Índice
- Requisitos:
 1. Instalación 
 2. Configuración de MongoDB Atlas
 3. Variables de entorno (.env)

 ## Ejecutar la aplicación

 - Endpoints (contrato) 

## Modelo de datos

- Flujo cuenta con emisión/activación/bloqueo
- Troubleshooting (errores comunes y soluciones)
- Git — subir a repo privado

### Buenas prácticas y próximos pasos

 - Requisitos:

   - Node.js >= 18 (recomendado LTS)
   - NPM o Yarn
   - MongoDB Atlas (cuenta y cluster creados)

Editor: Visual Studio Code (recomendadas extensiones: ESLint, Prettier, MongoDB for VS Code, REST Client)

- Instalación y puesta en marcha (rápida)

En la raíz del proyecto (donde está package.json):

# instalar dependencias
npm install

# modo desarrollo (requiere nodemon)
npm run dev

# o arrancar en producción
npm start

3. Configuración de MongoDB Atlas

Asumo que ya tienes cluster y usuario. Si no, sigue estos pasos en Atlas: Projects → Build a Cluster → Network Access → añadir IP → Database Access → crear usuario.

Whitelist de IP: en Atlas → Network Access → agrega tu IP pública o 0.0.0.0/0 (solo pruebas).

Usuario de BD: en Atlas → Database Access → crear usuario (ej.: carduserdb) y contraseña.

Obtener string de conexión: Atlas → Connect → Connect your application → copia la mongodb+srv://... (reemplaza <password>).

Codificar caracteres especiales en la contraseña:

Si tu contraseña tiene %, #, @, &, /, etc., debes codificarla para la URL.

En tu terminal:

node -e "console.log(encodeURIComponent('TU_CONTRASEÑA_AQUI'))"


Sustituye el <password> en la URI por el resultado codificado.

4. Variables de entorno (.env)

Crea un archivo .env en la raíz con este contenido (rellena con tu URI codificada):

PORT=3000
NODE_ENV=development
# Ejemplo (NO incluir contraseñas sin codificar)
MONGO_URI=mongodb+srv://<DB_USER>:<PASSWORD_URL_ENCODED>@<CLUSTER_HOST>/<DB_NAME>?retryWrites=true&w=majority&appName=card


Notas:
- El .env debe estar en la raíz del proyecto.
- No subir .env al repo. Añade .env a .gitignore.

5. Ejecutar la aplicación

Instalar dependencias:
```bash
npm install
```

Ejecutar (desarrollo):
```bash
npm run dev
```

Abrir en el navegador o usar Postman:
```bash
http://localhost:3000/

```
Debes ver el health check: Card Service API running o el mensaje configurado.

6. Endpoints (contrato) — ejemplos
6.1 Generar número de tarjeta

 ## Método: GET
```bash
Recurso: /card/{productId}/number
```

Descripción: genera un número de tarjeta de 16 dígitos — 6 primeros = productId (6 dígitos), 10 restantes aleatorios. Crea el documento en BD en estado INACTIVE.

Ejemplo (Postman / navegador):
```bash
GET http://localhost:3000/card/123456/number
```

Response 201 (ejemplo):
```bash
{
  "_id": "64f1a3d2e17c8b22f34a1234",
  "cardId": "1234569876543210",
  "productId": "123456",
  "status": "INACTIVE",
  "balance": 0,
  "expirationDate": "09/2028",
  "createdAt": "2025-09-07T18:00:00.000Z"
}
```
6.2 Activar tarjeta

## Método: POST
```bash
Recurso: /card/enroll
```
Body (JSON):
```bash
{
  "cardId": "1234569876543210"
}
```

Response 200 (ejemplo):
```bash
{
  "message": "Tarjeta activada con éxito",
  "card": {
    "cardId": "1234569876543210",
    "status": "ACTIVE",
    "balance": 0,
    "expirationDate": "09/2028"
  }
}
```
6.3 Bloquear tarjeta

## Método: DELETE
```bash
Recurso: /card/{cardId}
```
Ejemplo:
```bash
DELETE http://localhost:3000/card/1234569876543210
```

Response 200 (ejemplo):
```bash
{
  "message": "Tarjeta bloqueada con éxito",
  "card": {
    "cardId": "1234569876543210",
    "status": "BLOCKED"
  }
}
```
6.4 cURL (ejemplos)

Generar número:
```bash
curl -X GET "http://localhost:3000/card/123456/number"

```
Activar tarjeta:
```bash
curl -X POST "http://localhost:3000/card/enroll" \
  -H "Content-Type: application/json" \
  -d '{"cardId":"1234569876543210"}'
```

Bloquear:
```bash
curl -X DELETE "http://localhost:3000/card/1234569876543210"
```
7. Modelo de datos (Card)

Campos principales (Mongoose):
```bash
{
  cardId: String,         // 16 dígitos (unique, required)
  productId: String,      // 6 dígitos
  holderName: String|null,
  expirationDate: String, // mm/yyyy (3 años desde creación)
  balance: Number,        // default 0
  currency: String,       // 'USD'
  status: String,         // 'INACTIVE' | 'ACTIVE' | 'BLOCKED'
  createdAt, updatedAt
}
```

Ejemplo de documento en MongoDB:
```bash
{
  "_id": "64f1a3d2e17c8b22f34a1234",
  "cardId": "1234569876543210",
  "productId": "123456",
  "holderName": null,
  "expirationDate": "09/2028",
  "balance": 0,
  "currency": "USD",
  "status": "INACTIVE",
  "createdAt": "...",
  "updatedAt": "..."
}
```
8. Flujo de emisión (resumen)
```bash
Cliente pide GET /card/{productId}/number.
```
Servicio genera cardId = {productId (6)} + random(10) y crea Card con status=INACTIVE y balance=0.

Proceso de seguridad: cliente/usuario solicita activación POST /card/enroll con cardId.

Sistema valida que no esté BLOCKED y cambia status a ACTIVE.

Si hay inconsistencia, administrador ejecuta DELETE /card/{cardId} para BLOCKED.

9. Troubleshooting (errores comunes)

The 'uri' parameter to 'openUri()' must be a string, got "undefined"

Significa que process.env.MONGO_URI es undefined.

Solución: asegúrate de tener require('dotenv').config() al inicio de index.js o db.js, que .env esté en la raíz y que lo ejecutes desde la raíz (node index.js).

bad auth : authentication failed

Credenciales incorrectas o contraseña con caracteres especiales no codificados.

Solución: codifica la contraseña con encodeURIComponent(password) y reemplaza en la URI. Verifica que el usuario exista en Atlas y que el Network Access permita tu IP.

Cannot find module 'mongoose'

Ejecuta npm install mongoose.

Cannot find module './db' o rutas relativas

Verifica ruta de import en index.js (./src/db/db o ./bd/db según tu estructura).

Warnings de useNewUrlParser / useUnifiedTopology

Estas opciones están deprecadas en la versión de driver. Simplemente llama mongoose.connect(uri) sin esas opciones.

Duplicados por unique

Si cardId es unique y ya existe, la inserción fallará. Asegura reintentos o manejo de colisiones (re-generar número).
