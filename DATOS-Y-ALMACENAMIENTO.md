# Datos y almacenamiento

Todo queda en el navegador del dispositivo (mismo origen). Nada se envía a servidores.
Borrar datos del sitio en el navegador restablece los valores por defecto.

| Clave (`localStorage`) | Módulo | Contenido |
|---|---|---|
| `visainTimer` | timer | Ajustes del temporizador (tiempo, nombre, mensaje, fondo, brillo…) |
| `visainWheel2` | timer | Estado de la ruleta (modo, puntajes, preguntas usadas) |
| `visainMine` | timer | Preguntas propias agregadas por el usuario |
| `visainLiq` | seminar | Configuración de la presentación con avatares |
| `visainCat2` | seminar | **Catálogo editable**: productos, precios, puntos, % de membresías |
| `visainCal2` | seminar | Última configuración de la calculadora de bonos |
| `visainSum2` | seminar | Liquidación acumulada (bonos sumados) y nombre del empresario |
| `visainLiqP` | seminar | Última configuración de «Liquidar producto» |
| `visainCalc` | simulator | Parámetros del simulador |
| `visainPlanSlide` | plan-slides | Última diapositiva vista |

| IndexedDB | Módulo | Contenido |
|---|---|---|
| `visainBg` (store `f`, clave `bg`) | timer | Imagen o video de fondo personalizado subido por el usuario (hasta 400 MB) |

## Respaldo / migración
Los datos no viajan entre dispositivos. Si se requiere sincronización, el punto de integración es el catálogo
(`visainCat2`): basta leer/escribir ese JSON desde un backend. Las claves llevan sufijo de versión para
poder migrar estructuras sin romper datos existentes.
