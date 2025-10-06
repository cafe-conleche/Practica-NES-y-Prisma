import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService){}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({data: createUserDto});
  }

  findAll() {
    return this.prisma.user.findMany(); //Jala todos los usuarios
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({where: { id },});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
  try {
    console.log('=== DEBUG UPDATE START ===');
    console.log('📝 ID recibido:', id, 'Tipo:', typeof id);
    console.log('📝 Datos recibidos:', JSON.stringify(updateUserDto, null, 2));
    
    // 1. Verificar usuario
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tenat: true } // Incluir el tenant actual
    });
    console.log('👤 Usuario encontrado:', user);
    
    if (!user) {
      throw new Error(`Usuario con ID ${id} no existe`);
    }

    // 2. Si viene tenantId, verificar formato y existencia
    if (updateUserDto.tenatId !== undefined) {
      console.log('🔍 Verificando tenantId:', updateUserDto.tenatId, 'Tipo:', typeof updateUserDto.tenatId);
      
      // Convertir a número si es string
      const tenantId = Number(updateUserDto.tenatId);
      
      const tenant = await this.prisma.tenat.findUnique({
        where: { id: tenantId }
      });
      console.log('🏢 Tenant encontrado:', tenant);
      
      if (!tenant) {
        throw new Error(`Tenant con ID ${tenantId} no existe`);
      }
      
      // Actualizar el tenantId al formato correcto
      updateUserDto.tenatId = tenantId;
    }

    // 3. Hacer el update
    console.log('🔄 Ejecutando UPDATE...');
    const result = await this.prisma.user.update({
      where: { id },
      data: updateUserDto
    });
    
    console.log('✅ UPDATE EXITOSO:', result);
    console.log('=== DEBUG UPDATE END ===');
    return result;

  } catch (error) {
    console.log('❌ ERROR COMPLETO:', error);
    throw error;
  }
}

  remove(id: number) {
    return this.prisma.user.delete({where:{id}});
  }
}
