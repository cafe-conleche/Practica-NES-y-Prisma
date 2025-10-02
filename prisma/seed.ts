const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seeder simple...')

  // Crear un tenant de prueba
  const tenat = await prisma.tenat.create({
    data: { name: 'Empresa Test' }
  })

  // Crear un usuario de prueba
  await prisma.user.create({
    data: {
      email: 'test@test.com',
      name: 'Usuario Test',
      password: 'test123',
      telephone: '3000000000',
      role: 'USER',       // puede ser 'USER' o 'ADMIN'
      tenatId: tenat.id   // usar 'tenatId', no 'tenantId'
    }
  })

  console.log('Datos de prueba creados!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
