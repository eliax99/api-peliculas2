// index.js
require('dotenv').config()
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware global
app.use(express.json())

// Routers
const authRouter = require('./src/routes/auth')
const peliculasRouter = require('./src/routes/peliculas')
const favoritosRouter = require('./src/routes/favoritos')

app.use('/api/auth', authRouter)
app.use('/api/peliculas', peliculasRouter)
app.use('/api/favoritos', favoritosRouter)

app.get('/', (req, res) => {
  res.send('API de películas funcionando')
})

// Manejador de errores global
app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({ error: err.message })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
  })
}

module.exports = app