import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Começando a semeadura...');

  // Limpar banco
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.userAudit.deleteMany();
  await prisma.user.deleteMany();

  // 1. Criar Usuários
  const password = await bcrypt.hash('123456', 8);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@camisaderua.com',
      password,
      name: 'Admin Chefe',
      role: 'admin'
    }
  });

  const cliente1 = await prisma.user.create({
    data: { email: 'joao@cliente.com', password, name: 'João Silva', role: 'CUSTOMER' }
  });

  const cliente2 = await prisma.user.create({
    data: { email: 'maria@cliente.com', password, name: 'Maria Souza', role: 'CUSTOMER' }
  });

  console.log('✅ Usuários criados');

  // 2. Criar Produtos
  const p1 = await prisma.product.create({
    data: {
      nome: "CAMISA BLOCO DA LATINHA",
      preco: 49.90,
      categoria: "camisas",
      imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
      ownerId: admin.id
    }
  });

  const p2 = await prisma.product.create({
    data: {
      nome: "BONÉ ESTILO RUA",
      preco: 35.00,
      categoria: "acessorios",
      imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      ownerId: admin.id
    }
  });

  console.log('✅ Produtos criados');

  // 3. Criar Pedidos (Fakes para o Admin)
  await prisma.order.create({
    data: {
      userId: cliente1.id,
      status: "completed",
      total: 84.90,
      payment_method: "pix",
      items: {
        create: [
          { productId: p1.id, product_name: p1.nome, unit_price: p1.preco, quantity: 1, subtotal: p1.preco },
          { productId: p2.id, product_name: p2.nome, unit_price: p2.preco, quantity: 1, subtotal: p2.preco }
        ]
      }
    }
  });

  await prisma.order.create({
    data: {
      userId: cliente2.id,
      status: "pending",
      total: 49.90,
      payment_method: "credit_card",
      items: {
        create: [
          { productId: p1.id, product_name: p1.nome, unit_price: p1.preco, quantity: 1, subtotal: p1.preco }
        ]
      }
    }
  });

  console.log('✅ Pedidos criados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });