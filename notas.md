1. ¿Por qué el mensaje de error del login es genérico?
Si dijera "email incorrecto" o "contraseña incorrecta" por separado, un atacante sabría qué parte falló y tendría más información para atacar. Con "Credenciales incorrectas" no sabe nada.
2. ¿Qué información NO guardar en el payload del JWT?
La contraseña o el hash de la contraseña. El JWT no está cifrado, cualquiera puede leer su contenido (por ejemplo en jwt.io), así que nunca metas datos sensibles ahí.
3. ¿Por qué usamos bcrypt.compare en lugar de hashear y comparar con ===?
Porque bcrypt añade un salt aleatorio cada vez que hashea, entonces el mismo texto genera hashes distintos. Si hasheamos y comparamos con === nunca van a coincidir aunque la contraseña sea correcta. bcrypt.compare sabe hacer la comparación bien.