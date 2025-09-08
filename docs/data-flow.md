# Flujo de datos - Card Service

1. **Generación de tarjeta**
   - Input: `GET /card/{productId}/number`
   - Output: Tarjeta creada en BD con estado `INACTIVE`.

2. **Activación de tarjeta**
   - Input: `POST /card/enroll { "cardId": "..." }`
   - Output: Estado de tarjeta pasa a `ACTIVE`.

3. **Bloqueo de tarjeta**
   - Input: `DELETE /card/{cardId}`
   - Output: Estado de tarjeta pasa a `BLOCKED`.
