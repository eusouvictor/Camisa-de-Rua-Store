import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Começando a semeadura...');

  // Limpar banco (deletar na ordem certa para não quebrar relações)
  try {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.stock.deleteMany(); // Adicionei Stock se tiver
    await prisma.product.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.userAudit.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log("Banco já estava limpo ou tabela não existia.");
  }

  // 1. Criar Senha
  const password = await bcrypt.hash('123456', 8);
  
  // 2. Criar Usuários
  const admin = await prisma.user.create({
    data: { email: 'admin@camisaderua.com', password, name: 'Admin Chefe', role: 'admin' }
  });

  const cliente1 = await prisma.user.create({
    data: { email: 'joao@cliente.com', password, name: 'João Silva', role: 'CUSTOMER' }
  });

  console.log('✅ Usuários criados');

  // 3. Criar Produtos (Guardando em variáveis para usar depois)
  const p1 = await prisma.product.create({
    data: {
      nome: "CAMISA BLOCO DA LATINHA",
      preco: 49.90,
      categoria: "camisas",
      imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
      description: "Camisa leve para o carnaval.",
      ownerId: admin.id
    }
  });

  const p2 = await prisma.product.create({
    data: {
      nome: "CAMISA RUA 80",
      preco: 59.90,
      categoria: "camisas",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      description: "Estilo retrô anos 80.",
      ownerId: admin.id
    }
  });

  const p3 = await prisma.product.create({
    data: {
      nome: "BONÉ ESTILO RUA",
      preco: 35.00,
      categoria: "acessorios",
      imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      description: "Boné aba reta clássico.",
      ownerId: admin.id
    }
  });

  console.log('✅ Produtos criados');

  // 4. Criar Pedidos (Usando os produtos p1 e p2 que acabamos de criar)
  await prisma.order.create({
    data: {
      userId: cliente1.id,
      status: "COMPLETED",
      total: p1.preco + p3.preco,
      payment_method: "pix",
      items: {
        create: [
          { productId: p1.id, product_name: p1.nome, unit_price: p1.preco, quantity: 1, subtotal: p1.preco },
          { productId: p3.id, product_name: p3.nome, unit_price: p3.preco, quantity: 1, subtotal: p3.preco }
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