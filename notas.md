Pregunta: ¿Qué películas tienen usuarios más entusiastas que la crítica? ¿Y al revés?
La que más Roma y la que menos Barbie.

1. ¿Cuándo es contraproducente crear un índice?
Cuando la tabla tiene muchas escrituras (INSERT, UPDATE, DELETE). Cada vez que escribes, PostgreSQL tiene que actualizar también el índice, lo que lo hace más lento. En una tabla donde casi solo lees merece la pena, pero si escribes constantemente el índice cuesta más de lo que ayuda.
2. RANK() vs DENSE_RANK()
Con RANK() si dos películas empatan en el puesto 1, la siguiente es la 3 (se salta el 2). Con DENSE_RANK() la siguiente sería la 2, sin saltos.
Ejemplo con nuestros datos: si Inception y Interstellar empatan con nota 8.8 y 8.6... bueno, no empatan, pero si empatasen:

RANK() → 1, 1, 3
DENSE_RANK() → 1, 1, 2

3. ¿Por qué AFTER en lugar de BEFORE?
Porque queremos guardar en la auditoría lo que realmente pasó. Con BEFORE el cambio todavía no se aplicó y podría cancelarse. Con AFTER ya está confirmado en la base de datos, así que el registro de auditoría refleja algo que de verdad ocurrió.