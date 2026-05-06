// index.js
require('dotenv').config()
const express = require('express')

const peliculasRouter = require('./src/routes/peliculas')
const authRouter = require('./src/routes/auth')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware global — SIEMPRE antes de los routers
app.use(express.json())

// Rutas
app.use('/api/auth', authRouter)
app.use('/api/peliculas', peliculasRouter)

app.get('/', (req, res) => {
  res.send('API de películas funcionando')
})

// Manejador de errores global
app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({ error: err.message })
})

// 404 global
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` })
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})