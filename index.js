// index.js
require('dotenv').config()
const express = require('express')

const peliculasRouter = require('./src/routes/peliculas')
const authRouter = require('./src/routes/auth')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware global
app.use(express.json())

// Rutas
app.use('/api/peliculas', peliculasRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.send('API de películas funcionando')
})

// Manejador global de errores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor'
  })
})

// 404 global
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` })
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})