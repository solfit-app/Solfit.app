# SOLFIT · Plan por etapas (con seguridad)

Borrador 2 · 16 nov 2026 · Alineado con la Carta Gantt de Inmersia (15 nov 2026).
**Publicación:** beta web en GitHub Pages (repo abierto, datos inventados) → piloto y entrega v1 como app web en Cloudflare Pages (repo privado) → tiendas después de la aprobación de Sol. Detalle en `docs/VISION.md` sección 2.1.
Regla: **una etapa a la vez**. Ninguna etapa empieza hasta que la anterior cumple su criterio de salida.
La landing la hace Cleme (Gantt sección 1) y no está en este plan, salvo el contrato `suscripciones`.

---

## Herramientas de seguridad (base para todas las etapas)

| Capa | Herramienta | Quién la corre | Bloquea si… |
|---|---|---|---|
| Secretos en el código | **gitleaks** (pre-commit + Verificador) y **GitHub secret scanning + push protection** | Verificador / Publicador / GitHub | aparece cualquier clave |
| Dependencias | **npm audit** + **Dependabot** (u osv-scanner) | Verificador / GitHub | hay vulnerabilidad alta o crítica |
| Código | **Semgrep** (reglas OWASP/JS/React) + **CodeQL** (gratis en repo público) | Seguridad / GitHub | hallazgo alto o crítico |
| Base de datos | **Supabase Security Advisor** + `supabase db lint` | Seguridad | tabla sin RLS o función insegura |
| Permisos (RLS) | **tests pgTAP / test:rls** contra el proyecto `solfit-pruebas` | Verificador | un alumno lee datos de otro |
| App publicada | **OWASP ZAP baseline** + revisión de cabeceras (securityheaders / Mozilla Observatory) | Seguridad en vivo | hallazgo alto |
| Funcionamiento | **Playwright** (celular 390×844 y PC 1440×900) | QA en vivo | error funcional |
| App móvil | **MobSF** sobre el APK/IPA | Seguridad (etapa 6) | permisos o datos expuestos |
| Normas | **OWASP Top 10**, **OWASP ASVS nivel 2**, **OWASP MASVS** (móvil), **Ley 21.719** | Seguridad | — |

Reglas fijas: `service_role` y claves de Mercado Pago/Google solo en *Supabase secrets*; solo datos inventados mientras el repo sea público; ningún agente imprime secretos.

---

## Etapa 0 · Preparación (16–20 nov) · *humanos*
- Cuentas: **Apple Developer como organización** (Solfit Salud Integral SpA, con D-U-N-S) ✅ inscripción enviada el 16-nov, **verificada sin pagar**; se paga cuando la app esté aprobada para tiendas. **Google Play no se abre ahora:** se crea **un día antes del lanzamiento de la beta en tiendas** (ver Etapa 7). Mercado Pago empresa.
- Repo `solfit-app` **público**, 2 proyectos Supabase en São Paulo (`solfit` y `solfit-pruebas`), **GitHub Pages** con GitHub Action para publicar (incluye el ajuste de rutas para que no dé 404 al recargar), `.env.local`.
- Activar en GitHub: secret scanning, push protection, Dependabot, CodeQL. Instalar gitleaks.
- Cuentas de prueba (alumno A, alumno B, Sol, técnico) en ambos proyectos.
- **Salida:** el Orquestador del flujo arranca sin "falta preparación".

## Etapa 1 · Base de datos, usuarios y almacenamiento (17–20 nov)
- Tablas núcleo: `perfiles`, `roles`, `planes`, `suscripciones` (contrato con la landing), `consentimientos`, `auditoria_accesos`.
- Login (email), 4 roles, buckets privados, registro de quién vio datos de salud.
- **Seguridad:** RLS en todas las tablas, test "A no ve a B", Security Advisor sin errores, perfil técnico sin acceso a fichas.
- **Salida:** tests RLS pasan en `solfit-pruebas`; migraciones aplicadas en principal.

## Etapa 2 · Esqueleto de la app + registro, login y perfil (19–26 nov)
- Diseño sobre el prototipo, navegación, identidad (logo/colores), listo para Capacitor.
- Registro, inicio de sesión, perfil con plan, ajustes, **borrar cuenta** (lo exigen las tiendas), consentimiento de datos de salud.
- **Seguridad:** ASVS V2/V3 (contraseñas, sesiones, límite de intentos), MFA obligatorio para Sol, Semgrep, ZAP baseline.
- **Salida:** QA "SIN ERRORES" en celular y PC.

## Etapa 3 · Panel de Sol (23 nov – 1 dic)
- Dashboard (usuarios totales y activos del mes), fichas de evaluación editables con historial.
- Ficha: nombre, fecha de nacimiento, edad, correo, estatura, lesiones, antropometría, % grasa y músculo, edad biológica, grasa visceral, gasto calórico.
- Biblioteca de ejercicios con buscador y videos (4–10 s), constructor de rutinas por cliente, calendario mínimo.
- **Seguridad:** permisos por rol en la base (no solo en pantalla), validación de archivos subidos (tipo y tamaño), URLs firmadas para videos, registro de accesos a fichas.
- **Salida:** demo del 30 nov.

## Etapa 4 · App del alumno (27 nov – 4 dic)
- 4a: ficha de evaluación, historial y gráfico (27–30 nov).
- 4b: plan de entrenamiento, calendario semanal, videos y registro de series/repeticiones/peso (1–3 dic).
- 4c: temporizador con sonido y notificaciones de entrenamiento, hidratación y respiración (3–4 dic).
- **Seguridad:** ningún dato de salud en notificaciones ni en logs; datos guardados en el celular, mínimos; validación de entradas.
- **Salida:** QA "SIN ERRORES" + Seguridad en vivo "SEGURO EN VIVO".

## Etapa 5 · Pagos y cursos online (23 nov – 4 dic)
- Webhook de Mercado Pago en una Edge Function → activa el plan en `suscripciones` (mismo webhook para la landing de Cleme).
- Cursos por módulos desbloqueables según compra; historial de pagos en el perfil.
- **Seguridad:** verificar la firma del webhook, no repetir pagos (idempotencia), nunca confiar en lo que diga el celular sobre un pago, RLS por compra.
- **Tiendas:** dentro de la app no hay botones ni enlaces para comprar cursos (reglas de Apple/Google).

## Etapa 5b · Paso de beta a producción web (~30 nov – 1 dic)
- Repo a **privado** y **todas las claves rotadas**.
- Web a **Cloudflare Pages** en `app.solfitonline.com`, con cabeceras de seguridad (CSP, anti-iframe, HSTS) y staging.
- Supabase principal a **Pro** (respaldos). Borrar todos los datos inventados del proyecto principal.
- **Salida:** ZAP + revisión de cabeceras sin hallazgos altos; gitleaks sobre todo el historial limpio.

## Etapa 6 · QA, piloto y entrega web (4–11 dic)
- **Antes del piloto (8 dic), obligatorio:** etapa 5b completa, política de privacidad y textos de consentimiento con **revisión legal humana** (Ley 21.719 vigente desde el 1 dic).
- Pruebas completas (Playwright + ZAP) de la app web, en iPhone (agregada a la pantalla de inicio) y Android.
- Piloto con Sol y 3–5 clientes usando la app web; capacitación a Sol; **acta de recepción de la app web**, con la fecha de tiendas acordada por escrito.

## Etapa 7 · Tiendas (después de la aprobación de Sol)
- Pagar Apple Developer; Sol invita a Inmersia como Admin.
- **Google Play: crear la cuenta de organización (25 USD, mismo D-U-N-S) un día antes del lanzamiento de la beta en tiendas** (prueba interna de Google). Decisión de José, 16-nov. Riesgo: Google verifica la empresa y puede tardar días; si la verificación no termina a tiempo, la beta de Android se corre esos días. Tiene que ser **organización**, nunca personal (la personal exige 12 testers durante 14 días).
- Empaquetar con Capacitor; notificaciones nativas (Firebase Cloud Messaging); build de iPhone en la nube (GitHub Actions macOS o Codemagic).
- **Seguridad:** MobSF sobre APK/IPA, normas MASVS.
- Fichas de privacidad de las tiendas (datos de salud), cuenta demo para revisores, primero TestFlight y prueba interna de Google.

## Después del 11 dic (versión 1.1)
Elección de días con 12 h de anticipación, "no fui" y reagendar, constancia mensual, bloques de entrenamiento, reunión semanal por Meet, dashboard financiero completo, convenios, Webpay, cerradura Vöhk.
