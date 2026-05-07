require('dotenv').config()
process.env.NODE_ENV = 'test'

const pool = require('../config/db')

beforeEach(async () => {
  await pool.query('DELETE FROM favoritos')
  await pool.query('DELETE FROM resenas')
  await pool.query('DELETE FROM peliculas')
  await pool.query('DELETE FROM usuarios')
})

afterAll(async () => {
  await pool.end()
})