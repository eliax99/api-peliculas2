// src/controllers/peliculasController.js
const pool = require('../config/db')
const AppError = require('../utils/AppError')

// GET /api/peliculas
const listarPeliculas = async (req, res, next) => {
  try {
    const { genero } = req.query

    let query = `
      SELECT p.id, p.titulo, p.anio, p.nota, p.created_at,
             d.nombre AS director,
             g.nombre AS genero, g.slug AS genero_slug
      FROM peliculas p
      LEFT JOIN directores d ON d.id = p.director_id
      LEFT JOIN generos g ON g.id = p.genero_id
    `
    const params = []

    if (genero) {
      query += ` WHERE g.slug = $1`
      params.push(genero)
    }

    query += ` ORDER BY p.id ASC`

    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// GET /api/peliculas/:id
const obtenerPelicula = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.titulo, p.anio, p.nota, p.created_at,
              d.nombre AS director,
              g.nombre AS genero, g.slug AS genero_slug
       FROM peliculas p
       LEFT JOIN directores d ON d.id = p.director_id
       LEFT JOIN generos g ON g.id = p.genero_id
       WHERE p.id = $1`,
      [req.params.id]
    )

    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// POST /api/peliculas
const crearPelicula = async (req, res, next) => {
  try {
    const { titulo, anio, nota, director, genero } = req.body

    if (!titulo || !anio) {
      throw new AppError('titulo y anio son obligatorios', 400)
    }

    // Buscar director_id
    let director_id = null
    if (director) {
      const d = await pool.query('SELECT id FROM directores WHERE nombre = $1', [director])
      if (d.rows.length > 0) director_id = d.rows[0].id
    }

    // Buscar genero_id
    let genero_id = null
    if (genero) {
      const g = await pool.query('SELECT id FROM generos WHERE slug = $1', [genero])
      if (g.rows.length > 0) genero_id = g.rows[0].id
    }

    const { rows } = await pool.query(
      `INSERT INTO peliculas (titulo, anio, nota, director_id, genero_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, anio, nota || null, director_id, genero_id]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
}

// PUT /api/peliculas/:id
const actualizarPelicula = async (req, res, next) => {
  try {
    const { titulo, anio, nota, director, genero } = req.body

    if (!titulo || !anio) {
      throw new AppError('titulo y anio son obligatorios', 400)
    }

    // Buscar director_id
    let director_id = null
    if (director) {
      const d = await pool.query('SELECT id FROM directores WHERE nombre = $1', [director])
      if (d.rows.length > 0) director_id = d.rows[0].id
    }

    // Buscar genero_id
    let genero_id = null
    if (genero) {
      const g = await pool.query('SELECT id FROM generos WHERE slug = $1', [genero])
      if (g.rows.length > 0) genero_id = g.rows[0].id
    }

    const { rows } = await pool.query(
      `UPDATE peliculas
       SET titulo = $1, anio = $2, nota = $3, director_id = $4, genero_id = $5
       WHERE id = $6
       RETURNING *`,
      [titulo, anio, nota || null, director_id, genero_id, req.params.id]
    )

    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// DELETE /api/peliculas/:id
const eliminarPelicula = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM peliculas WHERE id = $1 RETURNING *',
      [req.params.id]
    )

    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }

    res.json({ mensaje: 'Película eliminada', pelicula: rows[0] })
  } catch (err) {
    next(err)
  }
}

// GET /api/peliculas/:id/resenas
const listarResenas = async (req, res, next) => {
  try {
    const pelicula = await pool.query('SELECT titulo FROM peliculas WHERE id = $1', [req.params.id])

    if (pelicula.rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }

    const { rows } = await pool.query(
      'SELECT * FROM resenas WHERE pelicula_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    )

    res.json({ pelicula: pelicula.rows[0].titulo, resenas: rows })
  } catch (err) {
    next(err)
  }
}

// POST /api/peliculas/:id/resenas
const crearResena = async (req, res, next) => {
  try {
    const pelicula = await pool.query('SELECT id FROM peliculas WHERE id = $1', [req.params.id])

    if (pelicula.rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }

    const { autor, texto, puntuacion } = req.body

    if (!autor || !texto || puntuacion === undefined) {
      throw new AppError('autor, texto y puntuacion son obligatorios', 400)
    }

    const { rows } = await pool.query(
      `INSERT INTO resenas (pelicula_id, autor, texto, puntuacion)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.params.id, autor, texto, puntuacion]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/directores
const estadisticasDirectores = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        d.nombre AS director,
        COUNT(p.id) AS num_peliculas,
        ROUND(AVG(p.nota), 2) AS nota_media,
        MAX(p.nota) AS nota_maxima,
        MIN(p.nota) AS nota_minima
      FROM directores d
      JOIN peliculas p ON p.director_id = d.id
      GROUP BY d.id, d.nombre
      ORDER BY nota_media DESC
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/generos
const estadisticasGeneros = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      WITH stats AS (
        SELECT
          g.nombre AS genero,
          COUNT(p.id) AS num_peliculas,
          ROUND(AVG(p.nota), 2) AS nota_media,
          COUNT(r.id) AS total_resenas
        FROM generos g
        LEFT JOIN peliculas p ON p.genero_id = g.id
        LEFT JOIN resenas r ON r.pelicula_id = p.id
        GROUP BY g.id, g.nombre
      )
      SELECT *, RANK() OVER (ORDER BY nota_media DESC NULLS LAST) AS ranking
      FROM stats
      ORDER BY ranking
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  listarResenas,
  crearResena,
  estadisticasDirectores,
  estadisticasGeneros
}