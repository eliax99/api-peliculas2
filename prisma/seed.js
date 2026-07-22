// prisma/seed.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Crear géneros
  const cienciaFiccion = await prisma.genero.upsert({
    where: { slug: 'ciencia-ficcion' },
    update: {},
    create: { nombre: 'Ciencia Ficción', slug: 'ciencia-ficcion' }
  })

  const crimen = await prisma.genero.upsert({
    where: { slug: 'crimen' },
    update: {},
    create: { nombre: 'Crimen', slug: 'crimen' }
  })

  const fantasia = await prisma.genero.upsert({
    where: { slug: 'fantasia' },
    update: {},
    create: { nombre: 'Fantasía', slug: 'fantasia' }
  })

  const drama = await prisma.genero.upsert({
    where: { slug: 'drama' },
    update: {},
    create: { nombre: 'Drama', slug: 'drama' }
  })

  // Crear directores
  const nolan = await prisma.director.upsert({
    where: { nombre: 'Christopher Nolan' },
    update: {},
    create: { nombre: 'Christopher Nolan' }
  })

  const tarantino = await prisma.director.upsert({
    where: { nombre: 'Quentin Tarantino' },
    update: {},
    create: { nombre: 'Quentin Tarantino' }
  })

  const jackson = await prisma.director.upsert({
    where: { nombre: 'Peter Jackson' },
    update: {},
    create: { nombre: 'Peter Jackson' }
  })

  // Crear películas
  const inception = await prisma.pelicula.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titulo: 'Inception',
      anio: 2010,
      nota: 8.8,
      directorId: nolan.id,
      generoId: cienciaFiccion.id,
      destacada: true
    }
  })

  const pulpFiction = await prisma.pelicula.upsert({
    where: { id: 2 },
    update: {},
    create: {
      titulo: 'Pulp Fiction',
      anio: 1994,
      nota: 8.9,
      directorId: tarantino.id,
      generoId: crimen.id
    }
  })

  const lotr = await prisma.pelicula.upsert({
    where: { id: 3 },
    update: {},
    create: {
      titulo: 'El Señor de los Anillos',
      anio: 2001,
      nota: 8.8,
      directorId: jackson.id,
      generoId: fantasia.id
    }
  })

  // Crear reseñas
  await prisma.resena.createMany({
    data: [
      { peliculaId: inception.id, autor: 'María', texto: 'Obra maestra', puntuacion: 9 },
      { peliculaId: inception.id, autor: 'Carlos', texto: 'Confusa pero brillante', puntuacion: 8 },
      { peliculaId: pulpFiction.id, autor: 'Ana', texto: 'Clásico imprescindible', puntuacion: 10 }
    ]
  })

  // Crear usuario admin de prueba
  const bcrypt = require('bcrypt')
  const passwordHash = await bcrypt.hash('admin123', 10)

  await prisma.usuario.upsert({
    where: { email: 'admin@peliculas.com' },
    update: {},
    create: {
      nombre: 'Admin',
      email: 'admin@peliculas.com',
      passwordHash,
      rol: 'admin'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`   - ${4} géneros creados`)
  console.log(`   - ${3} directores creados`)
  console.log(`   - ${3} películas creadas`)
  console.log(`   - ${3} reseñas creadas`)
  console.log(`   - 1 usuario admin creado (admin@peliculas.com / admin123)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })