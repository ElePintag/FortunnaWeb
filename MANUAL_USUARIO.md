# Manual de Usuario - Fortunna Inmobiliaria
## Panel de Administración

---

## Índice

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Panel Principal](#panel-principal)
4. [Gestión de Slides](#gestión-de-slides)
5. [Gestión de Propiedades](#gestión-de-propiedades)
6. [Solicitudes de Compra/Venta](#solicitudes-de-compraventa)
7. [Solicitudes de Empleo](#solicitudes-de-empleo)
8. [Configuración del Sitio](#configuración-del-sitio)
9. [Página Nosotros](#página-nosotros)
10. [Gestión de Usuarios](#gestión-de-usuarios)
11. [Registro de Actividad (Logs)](#registro-de-actividad-logs)
12. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

Bienvenido al panel de administración de Fortunna Inmobiliaria. Este manual le guiará paso a paso en el uso de todas las funcionalidades disponibles para gestionar el contenido del sitio web.

### ¿Qué puedo hacer con el panel?

- Administrar las imágenes del carrusel principal
- Publicar, editar y eliminar propiedades (casas y terrenos)
- Gestionar solicitudes de clientes interesados en comprar o vender
- Revisar aplicaciones de trabajo
- Actualizar información de contacto y redes sociales
- Modificar el contenido de la página "Nosotros"
- Administrar usuarios del sistema
- Ver el historial de cambios realizados

---

## Acceso al Sistema

### Ingresar al Panel

1. Abra su navegador web (Chrome, Firefox, Safari, Edge)
2. Visite la URL: `https://su-dominio.com/admin`
3. Verá la pantalla de inicio de sesión

### Iniciar Sesión

**Campos requeridos**:
- **Email**: Su correo electrónico registrado
- **Contraseña**: Su contraseña de administrador

**Pasos**:
1. Escriba su email en el primer campo
2. Escriba su contraseña en el segundo campo
3. Haga clic en el botón "Iniciar Sesión"
4. Si los datos son correctos, será redirigido al panel principal

**Nota**: Si olvidó su contraseña, contacte al administrador del sistema.

### Cerrar Sesión

Para cerrar sesión de forma segura:
1. Haga clic en el botón "Cerrar Sesión" en la parte superior derecha
2. Será redirigido a la página de inicio de sesión

**Importante**: Siempre cierre sesión cuando termine, especialmente si usa una computadora compartida.

---

## Panel Principal

Al iniciar sesión, verá el panel principal dividido en pestañas:

```
┌─────────────────────────────────────────────────────────┐
│ Fortunna Inmobiliaria - Panel de Administración        │
│                                    [Cerrar Sesión]      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Slides] [Terrenos] [Compra/Venta] [Trabaje] [Config]  │
│ [Nosotros] [Usuarios] [Logs]                           │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │         Contenido de la pestaña activa         │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Navegación

- Haga clic en cada pestaña para acceder a su sección correspondiente
- El contenido cambia automáticamente sin recargar la página
- La pestaña activa se resalta visualmente

---

## Gestión de Slides

Los slides son las imágenes grandes que aparecen en el carrusel de la página principal.

### Ver Slides Existentes

En la pestaña "Slides" verá una tabla con:
- **Imagen**: Vista previa pequeña
- **Título**: Título del slide
- **Subtítulo**: Texto secundario
- **Orden**: Posición en el carrusel (1, 2, 3...)
- **Estado**: Activo o Inactivo
- **Acciones**: Botones para editar o eliminar

### Agregar un Nuevo Slide

1. Haga clic en el botón **"Agregar Slide"**
2. Complete el formulario:

**Campos del formulario**:

| Campo | Descripción | Requerido |
|-------|-------------|-----------|
| **Título** | Texto principal del slide | Opcional |
| **Subtítulo** | Texto secundario | Opcional |
| **Orden** | Número de posición (1=primero) | Sí |
| **Activo** | Marque para que se muestre | Sí |
| **Imagen** | Archivo de imagen | Sí |

3. **Para subir la imagen**:
   - Haga clic en "Seleccionar Imagen"
   - Navegue a su carpeta de imágenes
   - Seleccione el archivo (JPG, PNG, WebP)
   - Verá una vista previa

4. Haga clic en **"Guardar"**

**Especificaciones de la imagen**:
- **Tamaño recomendado**: 1920x1080 píxeles (Full HD)
- **Proporción**: 16:9 (horizontal)
- **Peso máximo**: 500KB
- **Formatos**: JPG, PNG, WebP
- **Optimización**: Comprima la imagen antes de subir

**Consejos**:
- Use imágenes de alta calidad y buena iluminación
- Evite texto pequeño que pueda ser ilegible en móviles
- Mantenga un estilo visual coherente entre slides
- Use herramientas como TinyPNG.com para optimizar

### Editar un Slide

1. Localice el slide en la tabla
2. Haga clic en el botón **"Editar"** (icono de lápiz)
3. Modifique los campos necesarios
4. **Para cambiar la imagen**:
   - Haga clic en "Seleccionar Imagen"
   - Elija la nueva imagen
   - La anterior será reemplazada
5. Haga clic en **"Guardar"**

### Eliminar un Slide

**Advertencia**: Esta acción no se puede deshacer.

1. Localice el slide en la tabla
2. Haga clic en el botón **"Eliminar"** (icono de basura)
3. Confirme la eliminación en el diálogo
4. El slide desaparecerá del sitio inmediatamente

### Ordenar Slides

El orden determina la secuencia en el carrusel:
- **Orden 1**: Primera imagen que se muestra
- **Orden 2**: Segunda imagen
- Y así sucesivamente...

**Para cambiar el orden**:
1. Edite cada slide
2. Cambie el número en el campo "Orden"
3. Guarde los cambios

**Ejemplo**:
```
Slide A: Orden 1 → Se muestra primero
Slide B: Orden 2 → Se muestra segundo
Slide C: Orden 3 → Se muestra tercero
```

### Activar/Desactivar Slides

- **Activo**: El slide aparece en el carrusel
- **Inactivo**: El slide está oculto pero no eliminado

**Para desactivar temporalmente**:
1. Edite el slide
2. Desmarque la casilla "Activo"
3. Guarde

**Caso de uso**: Slides estacionales que desea reutilizar más tarde.

---

## Gestión de Propiedades

La sección de terrenos incluye tanto casas como terrenos en venta.

### Ver Propiedades

En la pestaña "Terrenos" verá una tabla con:
- **Imagen**: Vista previa de la imagen principal
- **Título**: Nombre de la propiedad
- **Tipo**: Casa o Terreno
- **Ubicación**: Dirección o zona
- **Precio**: Precio en pesos mexicanos
- **Estado**: Disponible, Apartado o Vendido
- **Destacado**: Si aparece en la página principal
- **Acciones**: Editar, Eliminar, Ver en sitio

### Agregar una Nueva Propiedad

1. Haga clic en **"Agregar Terreno/Casa"**
2. Complete el formulario extenso:

#### Información Básica

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Título** | Nombre de la propiedad | "Casa en Residencial Las Palmas" |
| **Tipo** | Casa o Terreno | "Casa" |
| **Descripción** | Texto detallado | "Hermosa casa de 3 recámaras..." |
| **Ubicación** | Dirección o zona | "Col. Centro, Guadalajara" |
| **Precio** | Precio en pesos | 2500000 |
| **Área** | Metros cuadrados | 150 |
| **Estado** | Disponible/Apartado/Vendido | "Disponible" |

#### Opciones de Visualización

| Campo | Descripción |
|-------|-------------|
| **Destacado** | Marque para mostrar en página principal |
| **Visible** | Marque para que aparezca en el catálogo |

#### Slug (URL Amigable)

- **Campo**: Slug
- **Formato**: palabras-separadas-por-guiones
- **Ejemplo**: `casa-residencial-las-palmas`
- **Uso**: Define la URL de la propiedad
  - `https://sitio.com/terreno/casa-residencial-las-palmas`

**Reglas**:
- Solo letras minúsculas, números y guiones
- Sin espacios, acentos ni caracteres especiales
- Debe ser único
- No puede cambiar después de publicar (afecta SEO)

#### Características Adicionales (JSON)

Campo avanzado para información extra:

**Formato**:
```json
{
  "recamaras": 3,
  "banos": 2,
  "estacionamiento": 2,
  "amenidades": ["Alberca", "Jardín", "Seguridad 24/7"]
}
```

**Campos comunes**:
```json
{
  "recamaras": 3,
  "banos": 2,
  "medios_banos": 1,
  "estacionamiento": 2,
  "niveles": 2,
  "antiguedad": "5 años",
  "amenidades": ["Alberca", "Gimnasio", "Salón de eventos"],
  "servicios": ["Agua", "Luz", "Gas", "Internet"],
  "seguridad": "Caseta con guardia 24/7"
}
```

**Nota**: Debe ser JSON válido. Use comillas dobles y comas correctamente.

#### Imágenes

**Imagen Principal**:
1. Haga clic en "Seleccionar Imagen Principal"
2. Elija la mejor foto de la propiedad
3. **Especificaciones**:
   - Tamaño: 1200x800 píxeles
   - Proporción: 3:2
   - Peso: Máx 300KB
   - Formato: JPG o WebP

**Imágenes Adicionales** (Galería):
1. Haga clic en "Seleccionar Imágenes Adicionales"
2. Puede seleccionar múltiples archivos
3. **Especificaciones**:
   - Tamaño: 1200x800 píxeles
   - Peso: Máx 250KB cada una
   - Cantidad: 3-10 imágenes
   - Formato: JPG o WebP

4. **Reordenar**: Arrastre las imágenes para cambiar el orden
5. **Eliminar**: Haga clic en la X de cada imagen

**Consejos para fotos**:
- Tome fotos con buena iluminación (preferiblemente natural)
- Muestre diferentes ángulos y espacios
- Incluya exteriores e interiores
- Limpie y ordene antes de fotografiar
- Use cámara horizontal (landscape)
- Evite filtros excesivos

3. Haga clic en **"Guardar"**
4. La propiedad aparecerá inmediatamente en el catálogo

### Editar una Propiedad

1. Localice la propiedad en la tabla
2. Haga clic en **"Editar"**
3. Modifique los campos necesarios
4. **Para cambiar imágenes**:
   - Imagen principal: Seleccione nueva imagen
   - Galería: Agregue, elimine o reordene
5. Haga clic en **"Guardar"**

### Cambiar Estado de una Propiedad

**Estados disponibles**:

| Estado | Cuándo usar |
|--------|-------------|
| **Disponible** | La propiedad está en venta |
| **Apartado** | Cliente pagó enganche, no está disponible |
| **Vendido** | Propiedad vendida, se oculta del catálogo |

**Para cambiar**:
1. Edite la propiedad
2. Seleccione el nuevo estado
3. Guarde

**Nota**: Las propiedades vendidas automáticamente dejan de mostrarse en el sitio público.

### Propiedades Destacadas

Las propiedades destacadas aparecen en la sección "Casas y Terrenos Destacados" de la página principal.

**Para destacar**:
1. Edite la propiedad
2. Marque la casilla "Destacado"
3. Guarde

**Recomendaciones**:
- Destacar 3-6 propiedades máximo
- Elegir las más atractivas o mejor precio
- Actualizar regularmente (cada semana o mes)
- Combinar casas y terrenos

### Eliminar una Propiedad

**Advertencia**: Se eliminará permanentemente junto con sus imágenes.

1. Localice la propiedad
2. Haga clic en **"Eliminar"**
3. Confirme la acción
4. La propiedad desaparecerá del sitio

**Alternativa**: Si no está seguro, mejor cambie el estado a "Vendido" en lugar de eliminar.

### Ver en el Sitio

Para verificar cómo se ve:
1. Haga clic en **"Ver"** (icono de ojo)
2. Se abrirá una nueva pestaña con la página de detalle
3. Verifique que todo se vea correcto

---

## Solicitudes de Compra/Venta

Clientes interesados en comprar o vender propiedades envían formularios desde el sitio. Aquí los gestiona.

### Ver Solicitudes

En la pestaña "Compra/Venta" verá una tabla con:
- **Tipo**: Compra o Venta
- **Nombre**: Nombre del cliente
- **Email**: Correo electrónico
- **Teléfono**: Número telefónico
- **Tipo de Propiedad**: Casa, Terreno, etc.
- **Estado**: Pendiente, En Proceso, Completado, Cancelado
- **Fecha**: Cuándo se recibió
- **Acciones**: Ver detalles, Actualizar estado

### Ver Detalles de una Solicitud

1. Haga clic en **"Ver Detalles"**
2. Verá un diálogo con toda la información:
   - Datos de contacto del cliente
   - Ubicación de interés
   - Precio aproximado
   - Descripción detallada
   - Notas administrativas (solo visible para usted)

### Actualizar Estado

**Estados disponibles**:

| Estado | Significado | Acción recomendada |
|--------|-------------|-------------------|
| **Pendiente** | Recién recibido | Contactar al cliente |
| **En Proceso** | Ya contactado | Dar seguimiento |
| **Completado** | Cerrado exitosamente | Archivar |
| **Cancelado** | No prosperó | Archivar |

**Para actualizar**:
1. Vea los detalles de la solicitud
2. Seleccione el nuevo estado
3. (Opcional) Agregue notas administrativas
4. Guarde los cambios

### Agregar Notas Administrativas

Use este campo para:
- Registrar llamadas realizadas
- Anotar información adicional del cliente
- Recordatorios para seguimiento
- Motivo de cancelación

**Ejemplo**:
```
05/03/2026 - Llamé al cliente, interesado en terreno en zona norte.
Presupuesto: 1-1.5M. Agendar visita para el viernes.

08/03/2026 - Visitamos 3 terrenos. Le gustó el de Av. Patria.
Envié cotización formal por email.

10/03/2026 - Cliente aceptó. Preparar contrato.
```

### Contactar al Cliente

**Por Email**:
- Copie el email de la solicitud
- Use su cliente de correo habitual
- Responda profesionalmente

**Por Teléfono**:
- Copie el número de teléfono
- Llame directamente
- Registre la llamada en las notas

**Por WhatsApp**:
- Si el teléfono es celular, puede usar WhatsApp
- Mensaje inicial profesional

### Eliminar Solicitud

Para mantener limpia la lista:
1. Localice solicitudes antiguas completadas/canceladas
2. Haga clic en **"Eliminar"**
3. Confirme

**Recomendación**: Elimine solo después de 6-12 meses de completadas.

---

## Solicitudes de Empleo

Personas interesadas en trabajar con Fortunna envían su información aquí.

### Ver Solicitudes

En la pestaña "Trabaje Con Nosotros" verá:
- **Nombre**: Nombre del candidato
- **Email**: Correo electrónico
- **Teléfono**: Número telefónico
- **Puesto de Interés**: Puesto solicitado
- **Estado**: Pendiente, Revisado, Contactado, Rechazado
- **Fecha**: Cuándo aplicó
- **Acciones**: Ver detalles, Descargar CV

### Ver Detalles

1. Haga clic en **"Ver Detalles"**
2. Verá:
   - Información de contacto
   - Puesto de interés
   - Años de experiencia
   - Mensaje del candidato
   - Enlace al CV (si lo subió)
   - Notas administrativas

### Descargar CV

Si el candidato subió un CV:
1. Haga clic en **"Descargar CV"**
2. El archivo se descargará automáticamente
3. Ábralo con un lector de PDF

### Actualizar Estado

**Estados disponibles**:

| Estado | Significado |
|--------|-------------|
| **Pendiente** | No revisado aún |
| **Revisado** | CV revisado, evaluar si contactar |
| **Contactado** | Ya se contactó para entrevista |
| **Rechazado** | No cumple requisitos |

**Proceso sugerido**:
1. Nueva solicitud → **Pendiente**
2. Revisar CV → Cambiar a **Revisado**
3. Si es buen candidato → **Contactado** + agendar entrevista
4. Si no cumple perfil → **Rechazado**

### Agregar Notas

Use las notas para:
- Evaluación inicial del CV
- Fecha de entrevista
- Resultados de entrevista
- Decisión final

**Ejemplo**:
```
CV revisado: 5 años de experiencia en ventas inmobiliarias.
Perfil interesante para agente junior.
Agendar entrevista: 12/03/2026 - 10:00 AM

Entrevista realizada: Candidato muy profesional y motivado.
Decisión: Contratar. Inicio: 20/03/2026
```

---

## Configuración del Sitio

Gestione información de contacto y redes sociales.

### Ver Configuración Actual

En la pestaña "Configuración" verá una tabla con:
- **Clave**: Identificador técnico
- **Valor**: Contenido actual
- **Descripción**: Para qué sirve
- **Tipo**: text, number, etc.
- **Acciones**: Editar

### Configuraciones Comunes

| Clave | Descripción | Ejemplo |
|-------|-------------|---------|
| `whatsapp_numero` | Número de WhatsApp | +521234567890 |
| `email_contacto` | Email principal | contacto@fortunna.com |
| `telefono` | Teléfono de oficina | (33) 1234-5678 |
| `direccion` | Dirección física | Av. Principal 123, Guadalajara |
| `facebook_url` | Perfil de Facebook | https://facebook.com/fortunna |
| `instagram_url` | Perfil de Instagram | https://instagram.com/fortunna |

### Editar Configuración

1. Localice la configuración en la tabla
2. Haga clic en **"Editar"**
3. Modifique el valor
4. Haga clic en **"Guardar"**
5. Los cambios aparecen inmediatamente en el sitio

### Agregar Nueva Configuración

Solo si necesita una nueva clave:
1. Haga clic en **"Agregar Configuración"**
2. Complete:
   - **Clave**: nombre-sin-espacios (minúsculas)
   - **Valor**: El contenido
   - **Descripción**: Qué representa
   - **Tipo**: text (generalmente)
3. Guarde

**Nota**: Esta función es avanzada. Consulte con soporte técnico si no está seguro.

### Número de WhatsApp

**Formato correcto**:
- Incluir código de país: `+52`
- Sin espacios ni guiones: `+521234567890`
- No usar: `(33) 1234-5678`

**Ejemplos**:
- ✅ Correcto: `+5213312345678`
- ❌ Incorrecto: `33 1234 5678`
- ❌ Incorrecto: `(33) 1234-5678`

---

## Página Nosotros

Gestione el contenido de la sección "Nosotros" del sitio.

### Ver Secciones

En la pestaña "Nosotros" verá bloques de contenido con:
- **Imagen**: Vista previa
- **Título**: Título de la sección
- **Contenido**: Extracto del texto
- **Orden**: Posición en la página
- **Acciones**: Editar, Eliminar

### Agregar Sección

1. Haga clic en **"Agregar Sección"**
2. Complete el formulario:

| Campo | Descripción |
|-------|-------------|
| **Título** | Encabezado de la sección |
| **Contenido** | Texto completo (puede ser largo) |
| **Orden** | Posición (1=primero) |
| **Imagen** | Foto ilustrativa (opcional) |

3. **Imagen** (opcional):
   - Tamaño recomendado: 800x600px
   - Peso: Máx 200KB
   - Formato: JPG o WebP

4. Haga clic en **"Guardar"**

### Editar Sección

1. Localice la sección
2. Haga clic en **"Editar"**
3. Modifique título, contenido o imagen
4. Guarde

### Ordenar Secciones

El orden determina la secuencia en la página:
1. Edite cada sección
2. Asigne números: 1, 2, 3...
3. Guarde

**Ejemplo**:
```
Sección "Nuestra Historia": Orden 1
Sección "Misión y Visión": Orden 2
Sección "Nuestro Equipo": Orden 3
```

### Contenido Sugerido

Ideas para secciones:

1. **Nuestra Historia**
   - Cuándo se fundó Fortunna
   - Logros principales
   - Evolución de la empresa

2. **Misión y Visión**
   - Propósito de la empresa
   - Valores corporativos
   - Compromiso con clientes

3. **Nuestro Equipo**
   - Presentación del equipo
   - Experiencia colectiva
   - Especialidades

4. **Por Qué Elegirnos**
   - Ventajas competitivas
   - Servicios únicos
   - Testimonios de clientes

---

## Gestión de Usuarios

Administre quién tiene acceso al panel de administración.

### Ver Usuarios

En la pestaña "Usuarios" verá:
- **Nombre**: Nombre del usuario
- **Email**: Correo electrónico
- **Rol**: admin o user
- **Estado**: Activo o Inactivo
- **Fecha de Creación**: Cuándo se creó
- **Acciones**: Editar, Eliminar

### Roles Disponibles

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso completo a todo el panel |
| **user** | Acceso limitado (solo lectura) |

**Nota**: Actualmente solo "admin" tiene acceso funcional completo.

### Agregar Usuario

**Importante**: Esta función debe usarse con precaución. Solo cree usuarios para personal de confianza.

1. Haga clic en **"Agregar Usuario"**
2. Complete:
   - **Email**: Correo del nuevo usuario
   - **Nombre**: Nombre completo
   - **Rol**: admin (generalmente)
   - **Activo**: Marcar para activar inmediatamente

3. **Contraseña**:
   - El sistema genera una contraseña temporal
   - Anótela y compártala de forma segura
   - El usuario debería cambiarla después del primer login

4. Guarde

### Editar Usuario

1. Localice el usuario
2. Haga clic en **"Editar"**
3. Puede modificar:
   - Nombre
   - Rol
   - Estado (Activo/Inactivo)
4. Guarde

**Nota**: No puede editar el email después de crear el usuario.

### Desactivar Usuario

Si un empleado ya no trabaja:
1. Edite el usuario
2. Desmarque "Activo"
3. Guarde

**Efecto**: El usuario no podrá iniciar sesión, pero su cuenta se conserva para el historial.

### Eliminar Usuario

**Advertencia**: Acción permanente.

1. Localice el usuario
2. Haga clic en **"Eliminar"**
3. Confirme

**Nota**: Los logs de ese usuario se mantienen, pero mostrarán "Usuario eliminado".

---

## Registro de Actividad (Logs)

Sistema de auditoría que registra todas las acciones administrativas.

### Ver Logs

En la pestaña "Logs" verá una tabla cronológica con:
- **Usuario**: Quién realizó la acción
- **Acción**: Qué hizo (crear, actualizar, eliminar)
- **Tabla**: En qué sección
- **Fecha**: Cuándo ocurrió
- **Detalles**: Información adicional

### Filtrar Logs

**Por Usuario**:
- Seleccione un usuario del menú desplegable
- Solo se mostrarán las acciones de ese usuario

**Por Tabla**:
- Seleccione una tabla (terrenos, slides, etc.)
- Solo se mostrarán acciones en esa sección

**Por Fecha**:
- Use el selector de fechas
- Elija un rango de fechas

### Interpretar los Logs

**Tipos de acciones**:

| Acción | Significado | Ejemplo |
|--------|-------------|---------|
| `CREATE` | Creó un registro | "Creó terreno: Casa en Centro" |
| `UPDATE` | Modificó un registro | "Actualizó terreno: Cambió precio" |
| `DELETE` | Eliminó un registro | "Eliminó slide: Promoción Navidad" |
| `LOGIN` | Inició sesión | "Accedió al panel" |
| `LOGOUT` | Cerró sesión | "Salió del panel" |

**Ver Detalles**:
1. Haga clic en una fila
2. Verá el JSON completo con:
   - Datos anteriores (para UPDATE)
   - Datos nuevos
   - IP del usuario
   - User Agent (navegador)

### Uso de Logs

**Seguridad**:
- Detectar accesos no autorizados
- Verificar horarios de login inusuales
- Identificar cambios no esperados

**Auditoría**:
- Revisar quién hizo qué cambio
- Rastrear eliminaciones accidentales
- Historial de modificaciones

**Resolución de Problemas**:
- "¿Quién eliminó esa propiedad?"
- "¿Cuándo se cambió ese precio?"
- "¿Quién desactivó ese slide?"

### Retención de Logs

Los logs se conservan indefinidamente para auditoría.

**Limpieza**: Si la tabla crece mucho, contacte soporte técnico para archivar logs antiguos (más de 1 año).

---

## Preguntas Frecuentes

### Acceso y Seguridad

**P: Olvidé mi contraseña. ¿Qué hago?**
R: Contacte al administrador del sistema para que le restablezca la contraseña.

**P: ¿Puedo cambiar mi contraseña?**
R: Actualmente no hay interfaz para esto. Contacte al administrador.

**P: ¿Puedo acceder desde mi celular?**
R: Sí, el panel es responsive. Funciona en tablets y celulares, aunque es más cómodo en computadora.

**P: ¿Es seguro el sistema?**
R: Sí. Todas las comunicaciones están cifradas (HTTPS) y las contraseñas están protegidas con hash.

---

### Imágenes

**P: ¿Por qué mis imágenes se ven borrosas?**
R: Probablemente el tamaño es muy pequeño. Use las dimensiones recomendadas en cada sección.

**P: La imagen pesa más de lo permitido. ¿Qué hago?**
R: Comprima la imagen usando TinyPNG.com o Squoosh.app antes de subir.

**P: ¿Puedo subir GIF animados?**
R: Técnicamente sí, pero no es recomendable. Use JPG o WebP estático.

**P: ¿Las imágenes se eliminan automáticamente?**
R: No. Si elimina una propiedad o slide, la imagen permanece en el storage. Contacte soporte para limpieza masiva.

**P: ¿Qué significa "optimizar" una imagen?**
R: Reducir su peso (KB/MB) sin perder calidad visual notable. Use herramientas online gratuitas.

---

### Propiedades

**P: ¿Puedo duplicar una propiedad para crear una similar?**
R: No hay función de duplicado. Debe crear una nueva manualmente.

**P: Cambié el slug de una propiedad y ahora da error.**
R: El slug no debe cambiar después de publicar. Restaure el slug original o contacte soporte.

**P: ¿Cuántas propiedades puedo tener?**
R: No hay límite técnico. Sin embargo, para mejor rendimiento, archive las vendidas después de 6 meses.

**P: ¿Las propiedades vendidas se eliminan automáticamente?**
R: No. Se ocultan del catálogo público pero permanecen en el panel. Puede eliminarlas manualmente.

**P: ¿Cómo agrego un video a una propiedad?**
R: No hay soporte para videos actualmente. Puede agregar enlaces en la descripción.

---

### Configuración

**P: Cambié el número de WhatsApp pero el botón no funciona.**
R: Verifique que el formato sea correcto: +5213312345678 (sin espacios ni guiones).

**P: ¿Puedo cambiar el logo del sitio?**
R: Esa función requiere acceso al código. Contacte al desarrollador.

**P: ¿Puedo cambiar los colores del sitio?**
R: Los colores corporativos (rojo y dorado) están definidos en el código. Contacte al desarrollador para cambios.

---

### Solicitudes

**P: ¿Los clientes reciben confirmación por email?**
R: No automáticamente. Debe responder manualmente a cada solicitud.

**P: ¿Puedo exportar las solicitudes a Excel?**
R: No hay función de exportación. Puede copiar manualmente o contactar soporte para un export.

**P: ¿Se notifica cuando hay nueva solicitud?**
R: No hay notificaciones automáticas. Debe revisar el panel regularmente.

---

### Rendimiento

**P: El panel está lento. ¿Qué hago?**
R:
1. Verifique su conexión a internet
2. Cierre otras pestañas del navegador
3. Intente en otro navegador
4. Si persiste, contacte soporte

**P: La página del sitio público está lenta.**
R:
1. Verifique que las imágenes estén optimizadas
2. No tenga demasiados slides activos (máx 5)
3. Contacte soporte para revisar

---

### Errores Comunes

**P: "Error al guardar". ¿Qué significa?**
R: Puede ser:
1. Campos requeridos vacíos → Complete todos los campos marcados
2. Slug duplicado → Use otro slug único
3. Imagen muy grande → Comprima la imagen
4. Problemas de conexión → Reintente en unos segundos

**P: "No autorizado". ¿Qué hago?**
R: Su sesión expiró. Cierre sesión y vuelva a iniciar sesión.

**P: "Formato JSON inválido" en características.**
R: Hay un error de sintaxis en el JSON. Verifique:
- Comillas dobles, no simples
- Comas entre elementos
- Llaves y corchetes balanceados
- Use un validador JSON online si no está seguro

---

## Mejores Prácticas

### Rutina Diaria

1. **Iniciar el día**:
   - Iniciar sesión en el panel
   - Revisar nuevas solicitudes de compra/venta
   - Revisar solicitudes de empleo

2. **Durante el día**:
   - Actualizar estados de solicitudes según avance
   - Agregar notas de seguimiento
   - Responder consultas de clientes

3. **Al terminar**:
   - Cerrar sesión
   - Verificar que todo esté guardado

### Rutina Semanal

1. **Gestión de propiedades**:
   - Publicar nuevas propiedades
   - Actualizar precios si cambiaron
   - Cambiar estado de vendidas/apartadas
   - Revisar propiedades destacadas

2. **Contenido**:
   - Actualizar slides si hay promociones
   - Verificar que fotos se vean bien
   - Revisar textos por errores

### Rutina Mensual

1. **Limpieza**:
   - Archivar/eliminar solicitudes completadas antiguas
   - Eliminar propiedades vendidas hace más de 6 meses
   - Revisar configuración de contacto

2. **Análisis**:
   - Revisar qué propiedades tienen más vistas (si tiene analytics)
   - Evaluar qué slides funcionan mejor
   - Actualizar contenido según temporada

### Consejos de Contenido

**Títulos de Propiedades**:
- ✅ "Casa de 3 Recámaras en Residencial Las Palmas"
- ❌ "CASA SUPER BONITA!!!"
- Sea descriptivo pero conciso
- Use mayúsculas correctamente

**Descripciones**:
- Primero: Características principales
- Segundo: Detalles adicionales
- Tercero: Ubicación y servicios cercanos
- Use párrafos cortos
- Sin errores ortográficos

**Precios**:
- Sea honesto y realista
- Actualice si cambian
- Mencione si es negociable (en descripción)

**Fotos**:
- Luz natural siempre que sea posible
- Limpiar y ordenar antes de fotografiar
- Tomar mínimo 5 fotos (diferentes ángulos)
- Primera foto: La más atractiva

---

## Contacto para Soporte

Si tiene problemas técnicos o preguntas que este manual no responde:

**Soporte Técnico**:
- Email: soporte@desarrollador.com
- Teléfono: (33) XXXX-XXXX
- Horario: Lunes a Viernes 9:00-18:00

**Para reportar**:
1. Descripción del problema
2. Qué estaba haciendo cuando ocurrió
3. Capturas de pantalla si es posible
4. Navegador que usa (Chrome, Firefox, etc.)

---

## Glosario de Términos

- **Admin**: Administrador con acceso completo
- **Backend**: Parte del sistema no visible (base de datos, servidor)
- **Frontend**: Parte visible del sitio web
- **Panel**: Sistema de administración
- **RLS**: Row Level Security (seguridad de datos)
- **Slug**: URL amigable (ej: casa-en-centro)
- **Storage**: Almacenamiento de archivos (imágenes)
- **Supabase**: Plataforma de base de datos en la nube

---

**Versión del Manual**: 1.0
**Última Actualización**: Marzo 2026
**Elaborado para**: Fortunna Inmobiliaria
