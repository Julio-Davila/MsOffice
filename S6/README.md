# SISE · Microsoft Excel — Semana 6

Aplicación web educativa basada en la sesión **Organización de datos y análisis básico**.

## Ejecutar

1. Descomprime la carpeta.
2. Abre `index.html` en Chrome, Edge o Firefox.
3. Ingresa nombre, correo y la clave proporcionada por el docente.

Para máxima compatibilidad con videos y Web Crypto, también puedes ejecutar un servidor local:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Funciones incluidas

- Autenticación con validación SHA-256 (la clave no aparece en texto plano dentro del código).
- Diseño responsive, mobile-first, sidebar y navegación por módulos.
- 10 imágenes educativas suministradas por el usuario integradas en carrusel, contenidos y galería.
- Teoría de Filtros, Filtros avanzados, Formato condicional y Tablas dinámicas.
- Tips, atajos e indicaciones sobre uso crítico de IA.
- Videos de YouTube y accesos de refuerzo.
- Crucigrama interactivo, juego de memoria y sopa de letras con exactamente 10 palabras.
- Cuestionario de 10 preguntas con feedback inmediato.
- Progreso persistente mediante LocalStorage.
- Diploma bloqueado hasta completar las 9 actividades obligatorias.
- Generación de diploma PDF directamente en el navegador, sin librerías externas.

## Nota de seguridad

Esta es una aplicación estática educativa. La clave se compara mediante una huella SHA-256 y no se guarda como texto plano. Para una publicación institucional con usuarios reales, se recomienda migrar la autenticación a un backend con HTTPS, sesiones y control de intentos.


## Actualización de juegos
- Crucigrama corregido: intersecciones válidas, pistas seleccionables, validación por letra y reinicio.
- Juego mental reemplazado por un juego de memoria con 8 pares de conceptos de Excel.
