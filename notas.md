¿Por qué es mejor tener el controlador separado de las rutas?
Porque el código queda más ordenado y es más fácil de entender y mantener.

Si mañana quisieras cambiar los datos en memoria por una base de datos PostgreSQL, ¿en qué archivo harías el cambio principalmente?
En data/peliculas.js, porque ahí se manejan los datos.

¿Qué pasaría si en el router tuvieras /:id antes que /:id/resenas? Pruébalo y describe el resultado.
Que Express coge /:id primero y la ruta de reseñas no funciona bien.