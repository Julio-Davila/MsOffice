SISE · EXCEL 365 — PLATAFORMA EDUCATIVA INTERACTIVA
======================================================

CONTENIDO
- index.html: aplicación principal.
- styles.css: diseño responsive y estilo corporativo Excel/SISE.
- app.js: autenticación, progreso, juegos, cuestionario y diploma PDF.
- assets/: logo SISE y 10 imágenes educativas optimizadas.
- docs/SESION_REFERENCIA_SEMANA_04.pdf: sesión de aprendizaje usada como referencia.

EJECUCIÓN RÁPIDA
1. Descomprima la carpeta completa.
2. Abra index.html en Chrome, Edge o Firefox actualizado.
3. Ingrese nombre, correo y la clave de aula indicada por el docente.
4. Complete los cinco módulos teóricos, revise los tips, complete los tres juegos y responda las 10 preguntas.
5. Con el 100% del progreso se habilita el Diploma; el botón "Descargar diploma en PDF" genera un PDF localmente en el navegador.

PARA PUBLICAR
Puede subir toda la carpeta a un hosting estático (GitHub Pages, Netlify, Vercel, hosting institucional, etc.). No requiere compilación ni dependencias externas para la lógica principal. Los videos incrustados de YouTube sí requieren conexión a Internet.

SEGURIDAD DE LA CLAVE
La aplicación no contiene la clave en texto plano: compara una huella SHA-256. Como se trata de una aplicación estática, esta protección es adecuada para control de acceso de aula, pero NO equivale a una autenticación de alta seguridad con servidor. Para cuentas reales o información sensible se recomienda autenticación backend.

PROGRESO
El avance se almacena localmente en el navegador por correo del estudiante usando localStorage. Si se cambia de navegador/dispositivo o se borran los datos del sitio, el progreso local no se conserva.

CONTENIDO PEDAGÓGICO
La ruta sigue la sesión de Excel 365: organización/depuración de datos, filtros, filtros avanzados, formato condicional, funciones estadísticas, tablas dinámicas, lectura e interpretación para la toma de decisiones y contraste de conclusiones con IA.
