# Política de privacidad

## Responsable del tratamiento

**Daniel Kripta** — danielkriptaprofesional@gmail.com

## Datos que recogemos

Al crear una cuenta en Sansofé se recogen los siguientes datos:

- **Nombre de persona usuaria** — identificador único en la plataforma
- **Correo electrónico** — usado para el inicio de sesión
- **Contraseña** — almacenada con hash bcrypt (nunca en texto plano)
- **Clave de API de Gemini** (opcional) — almacenada cifrada con AES-256. Solo la conoce la persona titular de la cuenta; el sistema no puede leerla, únicamente utilizarla para las consultas al servicio de IA

No se recogen datos de navegación, no se usan cookies de seguimiento y no se comparte ningún dato con terceros con fines publicitarios.

## Cookies

Sansofé utiliza una única cookie de sesión (`token`) con las siguientes características:

- **HttpOnly**: no accesible desde JavaScript
- **SameSite=Strict**: protección frente a CSRF
- **Duración**: 30 días desde el último inicio de sesión

## Contenido generado por la persona usuaria

Las colecciones e investigaciones creadas en Sansofé se almacenan en la base de datos asociadas a la cuenta. Pueden eliminarse en cualquier momento desde la propia aplicación.

## Derechos

Cualquier persona tiene derecho a acceder, rectificar y suprimir sus datos. Para ejercerlos, contacta en danielkriptaprofesional@gmail.com. También es posible eliminar la cuenta desde la página de Perfil.

## Almacenamiento

Los datos se almacenan en un servidor propio ubicado en la Unión Europea (Hetzner, Falkenstein, Alemania).
