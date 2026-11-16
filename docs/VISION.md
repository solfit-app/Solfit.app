# SOLFIT — Documento de visión

> Borrador 6 · 16-11-2026 (beta web primero, tiendas después de la aprobación) · Para la reunión de equipo (José, Cleme)
> **Cambio principal:** la **v1** es exactamente lo comprometido en la Carta Gantt (entrega vie 11-dic-2026). Todo lo demás pasa a la **v1.1**. Detalle de etapas y seguridad en `docs/PLAN_ETAPAS.md`.

## 1. Qué es

SOLFIT es la plataforma del gimnasio al aire libre de Sol, cliente: Solfit Salud Integral SpA. Es **una sola app con tres caras**:

1. **Landing de venta:** parte pública. **La hace Cleme.** (Entrega vie 20-nov.)
2. **App del cliente:** se entra con login. Primero como **app web** (se agrega a la pantalla de inicio del celular); después, empaquetada para iOS y Android.
3. **Panel de Sol (administración):** mismo código, login con rol de admin; se usa sobre todo desde el PC por la web.

## 2. Alcance por versión

| | **v1 (Gantt · 11-dic)** | **v1.1 (después de la entrega)** |
|---|---|---|
| Objetivo | Lo vendido a Sol, entregado como **app web** | Lo que diseñamos además en las conversaciones |
| Base | Lo que dice la Gantt, sin agregar nada | Se prioriza con Sol después del piloto |

> Regla: **si algo no está en la Gantt, no entra en la v1.** Si Sol pide algo de la v1.1 antes, se conversa y se mueve otra cosa o se corre la fecha.

## 2.1 Fases de publicación (decidido 16-nov)

Primero **app web**; las tiendas solo cuando la app esté lista y aprobada por Sol. El código es el mismo en las tres fases (React + Vite estática, preparada para Capacitor), así que no se rehace nada.

| Fase | Fechas | Dónde vive | Repo | Datos |
|---|---|---|---|---|
| **Beta** | 17-nov – ~30-nov | **GitHub Pages** | Abierto (público) | **Solo inventados** |
| **Piloto y entrega v1** | ~1-dic – 11-dic | **Cloudflare Pages** (gratis, repo privado, cabeceras de seguridad), en `app.solfitonline.com` con botón «Ingresar» desde la landing | **Privado**, claves rotadas | Reales, con consentimiento y revisión legal |
| **Tiendas** | Después de la aprobación de Sol | App Store y Google Play (Capacitor) | Privado | Reales |

- **Demos (30-nov y 7-dic) y piloto (8-dic):** con la app web, agregada a la pantalla de inicio del celular. Sin cuentas de tiendas pagadas.
- **Cambio a Cloudflare Pages a fines de noviembre:** el piloto ya usa clientes reales con la Ley 21.719 vigente, y GitHub Pages no permite repo privado gratis ni cabeceras de seguridad.
- **Cuentas de tiendas:** se dejan **verificadas sin pagar** (Apple: correo `contacto@solfitonline.com` y formulario hasta la pantalla de pago; Google: cuenta de organización). Se pagan (99 USD/año Apple, 25 USD una vez Google) recién cuando la app esté aprobada para publicar.
- **Ajustes de la web:** en iPhone las notificaciones solo funcionan con la app agregada a la pantalla de inicio (iOS 16.4+); el temporizador mantiene la pantalla encendida mientras corre.
- **⚠️ Acuerdo con Sol (por escrito):** la Gantt dice «app iOS y Android el 11-dic». Hay que acordar que el **11-dic se entrega la app web** y que las tiendas tienen fecha aparte, y dejarlo en el **acta de recepción** para que no figure como incumplimiento. Confirmar también que no choca con lo que exige **Sercotec** para la entrega.

## 3. Usuarios y permisos (v1)

| Perfil | Qué ve en la v1 |
|---|---|
| **Cliente** (Free Gym, Asesoría Personalizada o Clases Online) | Su perfil, plan, pagos, ficha y gráfico, su plan de entrenamiento, registro de series, temporizador, notificaciones y los cursos que compró |
| **Sol (admin)** | Dashboard, todos los clientes, fichas, rutinas, calendario y cursos |
| **Equipo técnico (nosotros)** | Parte técnica y métricas generales, **sin acceso a las fichas de salud** |

Lo que el cliente puede usar depende del plan que compró en la web.

## 4. Productos y precios (afiches de Sol, 16-nov · confirmar que están vigentes)

**Pases (duración fija, pago único):**

| Pase | Precio |
|---|---|
| Diario | $8.000 |
| Semanal | $20.000 |
| 2 semanas | $30.000 |

**Planes mensuales (suscripción):**

| Plan | Precio/mes | Qué incluye |
|---|---|---|
| Open Gym (= Free Gym) | $38.000 | Acceso al gimnasio, registro y temporizador |
| Open Gym con asesoría (= Asesoría Personalizada / "guiado") | $50.000 | + rutina y seguimiento de Sol |
| Personalizado grupal | $72.000 | 8 clases al mes con horario fijo: mar y jue 9:00–10:00 y 10:30–11:30, vie 10:30–11:30 |
| Personalizado 1 a 1 | $200.000 | Entrenamiento individual |
| Personalizado 2x1 | $250.000 | Entrenamiento para 2 personas |

- **Clases Online:** cursos por módulos desbloqueables; se venden solo en la landing (precio pendiente).
- **Planes anuales:** pendientes (la Gantt habla de mensual y anual).
- Ubicación: Valle Las Trancas · Instagram: @solfitgym.

**Lo que esto cambia en la app:**
- La base de datos maneja **dos tipos de producto**: suscripción mensual (cobro recurrente en Mercado Pago) y **pase con fecha de término** (pago único). El acceso vence solo al terminar el pase.
- Los planes personalizados (grupal, 1 a 1, 2x1) cuentan como "guiado": tienen rutina y ficha.
- ✅ **Personalizado grupal (decidido 16-nov): la app lleva la cuenta de las 8 clases del mes.** Sol marca la asistencia desde su panel (lista de alumnos del horario, un toque por alumno). El alumno ve "te quedan N de 8 clases este mes". El contador se reinicia con cada pago mensual. No es reserva de cupos: solo cuenta. Por confirmar: ¿las clases no usadas se pierden al renovar? ¿Hay cupo máximo por horario?
- ✅ **2x1 (decidido 16-nov): dos cuentas ligadas a un solo pago.** Una suscripción con dos titulares; cada persona tiene su login, su ficha y su rutina, y ninguna ve los datos de la otra. Si se cancela el pago, se desactivan las dos.

## 4.1 Identidad visual (propuesta, 16-nov)

Sol solo tiene el **logo**; no hay colores ni tipografía oficiales. Colores sacados del logo (aproximados; si aparece el archivo original del diseñador, se toman de ahí):

| Uso | Color | Código |
|---|---|---|
| Principal (pesas y barra) | Verde bosque | `#25574A` |
| Acento del logo (sol) | Naranjo dorado | `#F8B046` |
| Botones / llamados a la acción | Naranjo intenso (afiches) | `#F39200` |
| Secundario (montañas, texto SOLFIT) | Verde salvia | `#86AD85` |
| Fondo | Crema | `#F7F3EA` |

- El naranjo dorado del logo se lee mal sobre fondo claro: para botones se usa el naranjo intenso, revisando contraste (WCAG AA).

**Tipografía (Google Fonts, gratis):**
- **Títulos:** Montserrat Bold (como "ENTRENAR" y "CLASES GRUPALES" en los afiches).
- **Títulos condensados:** Oswald (como "PASES" y "PLANES").
- **Texto de la app:** Montserrat Regular.
- **Manuscrita de acento** ("Entrena a tu manera"): solo en la landing y en pocas frases, nunca en la app.

**Fotos:** los afiches no sirven como fotos para la landing ni para Meta Ads. Faltan fotos reales del gimnasio, de Sol y de las clases; se pueden sacar el 23 y 24-nov durante la grabación de videos.

---

## 5. v1 — Lo que se entrega el 11 de diciembre

### 5.1 App del cliente (app web en la v1; iOS y Android después, ver 2.1)
- **Registro e inicio de sesión** con el plan comprado en la web.
- **Perfil:** plan contratado, historial de pagos y configuración; **borrar la cuenta** desde la app (lo exigen las tiendas).
- **Ficha de evaluación corporal con historial y gráfico** (detalle en 5.1.1).
- **Plan de entrenamiento con calendario semanal** y un video de 4 a 10 s por ejercicio.
- **Registro rápido** de series, repeticiones y peso.
- **Temporizador de intervalos** con aviso sonoro.
- **Notificaciones** de entrenamiento, hidratación y respiración consciente.
- **Cursos online por módulos desbloqueables.** Si el cliente no tiene el curso, aviso **neutro** ("no disponible en tu plan"), **sin botones ni links de compra** dentro de la app (regla de Apple/Google).

### 5.1.1 Ficha de evaluación (definida por Sol, 16-nov; versión 2)

**Quién la llena (decidido 16-nov):** **Sol, en la evaluación presencial**, mientras hace el pesaje en la Omron. La ficha completa se carga desde el **panel de Sol**, pensado para llenarse rápido en el celular o tablet junto a la balanza (un solo formulario por bloques, con los datos de la evaluación anterior a la vista).
- El alumno **ve** su ficha y su historial en la app, pero no la edita (salvo su teléfono y correo en el perfil).
- **Consentimiento antes de anotar:** como Sol registra datos de salud del alumno, la app exige que el alumno haya aceptado el consentimiento (y el de fotos) **antes** de que Sol pueda guardar antecedentes de salud o fotos. Flujo: el alumno se registra o Sol lo invita → acepta el consentimiento en su celular → Sol completa la ficha. Si el alumno no acepta el de fotos, la ficha se guarda sin fotos.
- Las fotos se suben directo desde la cámara al bucket privado; no quedan guardadas en la galería del dispositivo de Sol.

**Datos personales (se llenan una vez, editables):**
- Nombre completo
- Fecha de nacimiento → **la edad se calcula sola** (no se guarda aparte)
- Género (lista: femenino / masculino / otro / prefiere no decir). La Omron también lo pide para calcular grasa y músculo.
- Teléfono (formato +56 9 XXXX XXXX)
- Estatura (cm)
- Correo electrónico (el mismo del login)
- Objetivo de entrenamiento

**Antecedentes de salud (una vez, editables, con historial de cambios)** ⚠️ datos sensibles:
- Historial de lesiones o molestias
- ¿Padece alguna enfermedad o condición médica? (sí/no + cuál)
- ¿Toma algún medicamento? (sí/no + cuál)

**Hábitos (se registran en cada evaluación, para ver cómo cambian):**
- Frecuencia de entrenamiento (días por semana)
- Consumo diario de agua (litros)
- Sueño promedio (horas por noche)
- Número de comidas al día
- ¿Consume creatina? (sí/no)

**Cada evaluación (se repite y forma el historial y los gráficos):**
- Fecha de la evaluación (la primera = fecha de inicio)
- Hábitos (bloque de arriba)
- Perímetro de cintura (huincha, cm)
- Fotos de frente, lado y espalda ⚠️ dato sensible
- Indicadores de la **balanza Omron HBF-514C** (bioimpedancia mano-pie, sin Bluetooth), ingresados a mano en la v1. Son los 7 que muestra la balanza:
  - Peso (kg; confirmar que la balanza esté configurada en kg y no en libras)
  - Índice de masa corporal (IMC) → se calcula solo con peso y estatura; se puede anotar el de la balanza para comparar
  - **% de grasa corporal** (rango 5–60 %) → es lo que Sol llamó «grasa subcutánea»; este modelo no mide la subcutánea por separado
  - **% de músculo esquelético** (rango 5–50 %) → lo que Sol llamó «masa muscular»
  - Grasa visceral (nivel 1–30; 1–9 normal, 10–14 alto, 15+ muy alto)
  - Metabolismo en reposo (kcal/día) → lo que Sol llamó «gasto calórico»
  - Edad corporal (años, 18–80) → lo que Sol llamó «edad biológica»
- La app valida esos rangos al guardar, para evitar errores de tipeo.

**Reglas de seguridad de la ficha:**
- Antecedentes de salud (lesiones, enfermedades, medicamentos) y fotos = **datos sensibles** (Ley 21.719): consentimiento explícito, y uno separado para las fotos. Los antecedentes van en una tabla aparte con permisos más estrictos que los datos personales.
- Si el alumno declara una condición médica, Sol ve un aviso al armar su rutina. La app no da consejos médicos.
- Fotos en un **bucket privado** de Supabase, solo con links temporales; nunca públicas.
- Solo ven la ficha **el alumno y Sol**. El perfil técnico de Inmersia no la ve.
- Se registra quién abrió cada ficha.
- Al borrar la cuenta se borran también las fotos.
- Ningún dato de la ficha aparece en notificaciones ni en registros de errores.

**Frecuencia de evaluación (decidido 16-nov): depende de la constancia del alumno.** Evaluar o cambiar la rutina no sirve si el alumno entrenó 2 veces en el mes.
- **Alumno constante:** evaluación **mensual**.
- **Alumno no constante:** cada **2 o 3 meses**.
- En la v1 la app no agenda sola: usa los entrenamientos registrados (registro de series) y las asistencias del grupal para mostrarle a Sol, en la ficha de cada alumno, "N entrenamientos en los últimos 30 días" y una **sugerencia de próxima evaluación** (constante → en 1 mes; no constante → en 2–3 meses). Sol decide y puede cambiar la fecha.
- La lista "Evaluaciones que tocan esta semana" va en el dashboard de Sol.
- Por confirmar: cuántos entrenamientos al mes cuentan como "constante" (propuesta: 8 o más, unas 2 por semana).

**Por confirmar con Sol:** ✅ modelo Omron HBF-514C (16-nov). ✅ Ficha versión 2 con género, teléfono, hábitos y antecedentes de salud (16-nov). ✅ La llena Sol en la evaluación presencial (16-nov). ✅ Frecuencia según constancia (16-nov). Falta: umbral de "constante", si el objetivo es texto libre o una lista, y si las fotos se toman en cada evaluación o solo al inicio.

### 5.2 Panel de Sol
- **Dashboard** con usuarios totales y activos del mes.
- **Ficha de evaluación editable por cliente**, con historial.
- **Constructor de rutinas:** día, series, repeticiones, peso y video por cliente.
- **Calendario mínimo de entrenamiento** según el plan.
- **Seguimiento de progreso** por cliente.
- **Gestión de cursos:** subida de videos, módulos y orden de desbloqueo.

### 5.3 Base de datos y pagos
- Una sola base (Supabase) que **sincroniza landing, app y panel**.
- **El plan se activa solo cuando el cliente paga:** la pasarela avisa a una función del servidor (webhook) que activa el plan. Nunca se confía en lo que diga el celular.
- Pasarela: **Mercado Pago** (decidido por nosotros; la Gantt dejaba abierta Flow/Mercado Pago/Webpay → confirmar con Sol hoy).
- Entrega de accesos y credenciales a Sol.

### 5.4 Contenido
- **30 a 100 clips** de 4 a 10 s grabados por Inmersia (23 y 24-nov), editados y cargados (24 al 27-nov).
- Material de cursos online: lo entrega Sol hasta el 27-nov.

### 5.5 Requisitos que la v1 necesita aunque no estén en la Gantt
**Antes del piloto (8-dic, con la Ley 21.719 ya vigente):**
- **Consentimiento explícito** de datos de salud y **política de privacidad pública** (en la landing), con **revisión legal de una persona**.
- **Link público para pedir el borrado de la cuenta** (también lo exige Google Play).
- **Repo privado, claves rotadas y web en Cloudflare Pages** antes de cargar datos reales.
- **Supabase principal en plan Pro** (respaldos diarios).

**Cuando se publique en tiendas (después de la aprobación):**
- Pagar Apple Developer y Google Play; empaquetar con Capacitor y activar notificaciones nativas.
- Formularios de privacidad de las tiendas (Apple "App Privacy", Google "Data safety") declarando datos de salud, y **cuenta demo** para los revisores.
- Primer build a **TestFlight y prueba interna de Google** con margen, porque es común que Apple rechace la primera versión.

---

## 6. v1.1 — Después de la entrega (no entra en el 11-dic)

### App del cliente
- **Planificación por bloques:** Sol divide el plan en etapas (ej.: semanas 1-4 adaptación → 5-8 fuerza → 9-12 potencia); el cliente ve en qué bloque está y cuál viene.
- **Calendario completo:**
  - el cliente elige sus días libremente y los cambia **hasta 12 h antes**;
  - "no fui" + reagendar;
  - en Asesoría Personalizada, Sol define cuántos días al mes debe venir;
  - el Free Gym también arma su calendario.
- **Asistencia automática** al empezar un ejercicio (después, con ubicación o QR para evitar marcarla desde la casa).
- **Constancia mensual:** días que fue ÷ días planificados.
- **Sesiones parciales** en el registro ("fui pero solo hice esto").
- **Intervalos del temporizador configurados desde la rutina** por Sol.
- **Dashboard de progreso** más completo para el cliente.
- **Reunión semanal de 15 min por Meet** (Asesoría Personalizada), agendada desde la app con la cuenta de Google de Sol.

### Panel de Sol
- **Biblioteca de ejercicios** con buscador por nombre (movilidad, fuerza, etc.), como catálogo propio.
- **Creador de bloques** e intervalos del temporizador dentro de la rutina.
- **Dashboard financiero:** ventas, asistencias y clientes por plan (sin gastos ni boletas).
- **Convenios con empresas** (solo Sol).
- **Webpay** como segunda pasarela.

### Infraestructura
- **Cloudflare R2** para videos guía cuando la biblioteca crezca (en la v1, los ~100 clips de 4–10 s, unos 200 MB, caben en Supabase).
- **Bunny Stream** si las clases online necesitan streaming protegido más robusto.
- Staging (versión de prueba aparte) en Cloudflare Pages, si no se alcanza a dejar en la v1.

### Más adelante (sin fecha)
- **Cerradura Vöhk:** depende de si Vöhk tiene API (preguntar modelo y HUB).
- Clases en vivo.
- Reserva de clases: **descartada**.

---

## 7. Tecnología

- **React + TypeScript (Vite)**, app estática. Primero se publica como **app web**; después se empaqueta con **Capacitor** para iOS y Android con el mismo código (panel de Sol en el PC, botón «Ingresar» desde la landing).
- **Hosting web:** GitHub Pages en la beta → **Cloudflare Pages** desde el piloto (ver 2.1).
- **Supabase** (región São Paulo): base de datos, login con roles, RLS, archivos y funciones del servidor.
  - Desarrollo: plan gratis, 2 proyectos (principal + pruebas).
  - Desde el piloto: el principal pasa a **Pro** (~25 USD/mes).
- **Notificaciones push:** Firebase Cloud Messaging (solo para push, no para datos).
- **Mercado Pago** para cobros.
- **Compilación de iPhone:** sin Mac propio → servicio en la nube (GitHub Actions con macOS o Codemagic).
- **Repo:** **abierto durante la beta**, solo con datos inventados (el escaneo de claves es crítico). **Antes del piloto pasa a privado** y se rotan todas las claves.

### Reglas de arquitectura desde el día 1
- Toda la lógica de servidor va en **Supabase Edge Functions** (pagos, notificaciones, cursos), nunca en el hosting ni en la app.
- **Cero secretos en el repo:** `service_role`, claves de la pasarela y de Firebase viven solo en Supabase.
- Funciones del celular (notificaciones, sonido del temporizador, pantalla encendida) detrás de una capa propia, para cambiar a plugins nativos sin reescribir.

## 8. Integración con la landing (Cleme)

- **El mismo proyecto de Supabase** y **un solo login** para landing, web y apps.
- **Los pagos los registra nuestro backend** (webhook). La landing solo manda al cliente a pagar.
- Definir juntos la tabla **`suscripciones`**: cliente, plan, estado, fecha de vencimiento.
- **El webhook se adelanta al 23–25 de noviembre**, junto al checkout de la landing (en la Gantt estaba el 1–4 de diciembre).
- Dominio de Solfit: **`solfitonline.com`** (en Hostinger). La app web va en su propio subdominio (`app.solfitonline.com`), no dentro de la landing. Ojo: no cambiar los nameservers sin revisar el correo del dominio.
- En la landing: **política de privacidad** y **link de borrado de cuenta**.

## 9. Seguridad y ley

- La ficha corporal es **dato de salud = dato sensible** según la **Ley 21.719, vigente desde el 1-dic-2026**. El piloto (8-dic) ya cae con la ley vigente.
- Consentimiento explícito; el cliente puede ver, corregir y borrar sus datos.
- Cada cliente ve solo lo suyo (RLS, con tests). El equipo técnico no ve fichas de salud.
- Normas: OWASP Top 10, ASVS nivel 2, MASVS (app de celular) y Ley 21.719.
- Herramientas por etapa: ver `docs/PLAN_ETAPAS.md`.
- **Revisión legal humana** antes del piloto con clientes reales.

## 10. Pendientes

**Para el kickoff de hoy (16-nov)**
1. Pasarela definitiva (Mercado Pago) y estado de la cuenta de empresa.
2. **Cuentas de Apple y Google Play como empresa.** ✅ D-U-N-S recibido el 16-nov (número en `docs/privado/EMPRESA.md`). ✅ `contacto@solfitonline.com` creado. ✅ Apple (Organization) enviada a verificación sin pagar (Enrollment ID en `docs/privado/EMPRESA.md`). **Google Play se crea un día antes del lanzamiento de la beta en tiendas** (decisión de José; ver `docs/PLAN_ETAPAS.md`, Etapa 7). Inmersia se invita como Admin cuando se paguen.
2b. **Acordar con Sol que el 11-dic se entrega la app web** y las tiendas van con fecha aparte (acta de recepción y Sercotec).
3. ✅ Logo recibido; colores y tipografía propuestos (sección 4.1) → **Sol tiene que aprobarlos**.
4. ✅ Precios mensuales y pases (sección 4). ✅ Grupal con contador de 8 clases y 2x1 como dos cuentas con un pago (16-nov). Faltan: planes anuales, precio de las clases online, si las clases del grupal se acumulan y cupo máximo por horario.
5. Fotos reales para la landing y Meta Ads.

**Durante el proyecto**
5. Lista de ejercicios (18-nov). ✅ Ficha de evaluación recibida el 16-nov (ver 5.1.1); balanza Omron HBF-514C confirmada; ✅ frecuencia según constancia (mensual / 2–3 meses). Falta el umbral de "constante".
6. Material de cursos (27-nov).
7. 3 a 5 clientes para el piloto (8-dic).
8. Quién hace la revisión legal y cuándo (antes del 8-dic).
9. Cerradura Vöhk (v1.1 o después).

## 11. Agenda propuesta para la reunión

1. **v1 = Gantt, v1.1 = el resto** (10 min). Confirmar que Sol no espera bloques, constancia, Meet ni finanzas para el 11-dic.
2. **Fases y riesgos** (15 min): beta web → piloto web → tiendas después (sección 2.1); acuerdo con Sol sobre la entrega web del 11-dic; Ley 21.719 antes del piloto.
3. **Landing ↔ app** con Cleme (10 min): tabla `suscripciones`, webhook adelantado al 23–25-nov, mismo repo o separado.
4. **Etapas y seguridad** (`docs/PLAN_ETAPAS.md`) y **el loop de agentes** (15 min): costo por etapa; ajustes del Publicador para GitHub Pages (espera la GitHub Action en vez de Vercel; staging/PROMOVER apagados en la beta).
5. Preparación técnica y reparto de tareas (10 min).
