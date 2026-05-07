¿Qué ventaja tiene escribir los tests ANTES de la implementación? Describe una situación donde haberlos escrito después habría escondido un bug.

Defines qué debe hacer el código antes de escribirlo, no al revés. Si los escribes después, adaptas los tests a lo que ya tienes y es fácil pasar bugs por alto. Por ejemplo, si listarFavoritos devolviera los favoritos de todos los usuarios, escribiendo el test después probablemente nunca lo detectarías.

¿Por qué usamos una base de datos de test separada en lugar de mockear el módulo db? ¿Cuándo sí tendría sentido mockear?

Para verificar que el SQL es correcto y que las restricciones funcionan de verdad. Un mock no detectaría errores en las queries. Tendría sentido mockear cuando solo quieres probar la lógica del controlador de forma aislada.

¿Qué es el error de PostgreSQL con código 23505 y por qué lo capturamos específicamente?

Es el código que lanza PostgreSQL cuando se viola una restricción UNIQUE. Lo capturamos para devolver un 409 con un mensaje claro en lugar de un 500 genérico.