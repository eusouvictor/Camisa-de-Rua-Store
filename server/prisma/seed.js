import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Começando a semeadura do banco...');

  // 1. LIMPEZA: Apaga os produtos antigos para não duplicar
  // Isso é importante para corrigir o produto bugado
  await prisma.product.deleteMany(); 

  const produtos = [
    {
      nome: "CAMISA BLOCO DA LATINHA",
      preco: 49.90,
      categoria: "camisas",
      imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
      description: "Perfeita para curtir o bloco com estilo e conforto."
    },
    {
      nome: "CAMISA SAMBA TRADICIONAL",
      preco: 59.90,
      categoria: "camisas",
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      description: "Homenagem às raízes do samba."
    },
    {
      nome: "BONÉ ESTILO RUA",
      preco: 35.00,
      categoria: "acessorios",
      imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      description: "Proteção e estilo para o dia a dia."
    },
    {
      nome: "CAMISA NOITE CARIOCA",
      preco: 65.00,
      categoria: "camisas",
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      description: "Inspirada na Lapa e na vida noturna."
    },
    {
      nome: "COPO CONFORTO",
      preco: 89.90,
      categoria: "acessorios",
      imageUrl: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80",
      description: "Mantém sua bebida gelada o rolê todo."
    },
    {
      nome: "CAMISA URBANA",
      preco: 120.00,
      categoria: "camisas",
      imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
      description: "Design moderno para quem vive a cidade."
    },
    {
      nome: "CAMISETA BÁSICA",
      preco: 29.90,
      categoria: "camisetas",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      description: "O essencial que não pode faltar."
    },
    {
      nome: "JAQUETA COURO",
      preco: 199.90,
      categoria: "jaquetas",
      imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80", // Link novo!
      description: "Estilo e atitude em uma peça única."
    },
  ];

  for (const p of produtos) {
    await prisma.product.create({
      data: p,
    });
  }

  console.log(`✅ Semeadura concluída! ${produtos.length} produtos criados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });