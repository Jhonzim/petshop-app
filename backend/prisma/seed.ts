import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Ração Premium Cães Adultos 10kg',
    sku: 'RACAO-CAES-AD-10',
    category: 'Rações',
    price: 189.9,
    stock: 35,
    description: 'Ração premium para cães adultos com 26% de proteína e prebióticos.',
    imageUrl: 'https://images.unsplash.com/photo-1558944351-cd0a139c05aa?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ração Premium Gatos Castrados 5kg',
    sku: 'RACAO-GATOS-CT-05',
    category: 'Rações',
    price: 139.5,
    stock: 28,
    description: 'Ração com controle de peso e pH balanceado para gatos castrados.',
    imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Petisco Natural Biscoito de Carne 200g',
    sku: 'PETISCO-CARNE-200',
    category: 'Rações',
    price: 22.9,
    stock: 60,
    description: 'Biscoitos naturais assados com carne selecionada para cães.',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1af?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Areia Higiênica Sílica Cristais 4kg',
    sku: 'AREIA-SILICA-4',
    category: 'Higiene',
    price: 49.9,
    stock: 42,
    description: 'Areia higiênica de sílica com alto poder de absorção e controle de odores.',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Shampoo Neutro Pelos Claros 500ml',
    sku: 'SHAMPOO-NEUTRO-500',
    category: 'Higiene',
    price: 34.5,
    stock: 50,
    description: 'Shampoo neutro com camomila indicado para pelagem clara.',
    imageUrl: 'https://images.unsplash.com/photo-1619983081658-02f691c36f74?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Escova Dental Dupla Soft',
    sku: 'ESCOVA-DENTAL-001',
    category: 'Higiene',
    price: 19.9,
    stock: 70,
    description: 'Escova dental dupla com cerdas macias para cães e gatos.',
    imageUrl: 'https://images.unsplash.com/photo-1619983081821-1c7f395f9c24?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Coleira Ajustável Nylon Vermelha',
    sku: 'COLEIRA-NYLON-VM',
    category: 'Acessórios',
    price: 29.9,
    stock: 55,
    description: 'Coleira resistente em nylon ajustável para cães de médio porte.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Peitoral Easy Walk Azul M',
    sku: 'PEITORAL-AZUL-M',
    category: 'Acessórios',
    price: 69.0,
    stock: 25,
    description: 'Peitoral que reduz a tração durante os passeios para cães de médio porte.',
    imageUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Comedouro Inox Antiderrapante 800ml',
    sku: 'COMEDOURO-INOX-800',
    category: 'Acessórios',
    price: 39.9,
    stock: 48,
    description: 'Comedouro em inox com base antiderrapante e fácil higienização.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Bebedouro Fonte Automática 2L',
    sku: 'BEBEDOURO-FONTE-2L',
    category: 'Acessórios',
    price: 159.9,
    stock: 18,
    description: 'Fonte automática com filtro de carvão ativado para gatos e cães de pequeno porte.',
    imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Brinquedo Corda Trançada 3 Nós',
    sku: 'BRINQUEDO-CORDA-3N',
    category: 'Brinquedos',
    price: 24.9,
    stock: 65,
    description: 'Brinquedo de corda com três nós para estimular mordida saudável.',
    imageUrl: 'https://images.unsplash.com/photo-1619983268089-2d2a502de815?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Brinquedo Bolinha com Apito',
    sku: 'BRINQUEDO-BOLA-APT',
    category: 'Brinquedos',
    price: 18.9,
    stock: 90,
    description: 'Bolinha com apito resistente para diversão garantida em casa ou no parque.',
    imageUrl: 'https://images.unsplash.com/photo-1619983270648-3b8d0d9db608?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Brinquedo Interativo Recheável',
    sku: 'BRINQUEDO-RECHEAVEL',
    category: 'Brinquedos',
    price: 44.0,
    stock: 40,
    description: 'Brinquedo emborrachado que pode ser recheado com petiscos para enriquecer o ambiente.',
    imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Areia Sanitária Biodegradável 3kg',
    sku: 'AREIA-BIO-3KG',
    category: 'Higiene',
    price: 34.9,
    stock: 45,
    description: 'Areia sanitária de fibras vegetais 100% biodegradável e aglomerante.',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Tapete Higiênico Carvão Ativado 60x90',
    sku: 'TAPETE-CARVAO-6090',
    category: 'Higiene',
    price: 74.5,
    stock: 32,
    description: 'Pacote com 30 tapetes higiênicos com gel de rápida absorção e carvão.',
    imageUrl: 'https://images.unsplash.com/photo-1601758064226-0c3ce7b36d09?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Suplemento Ômega 3 para Pelagem 120ml',
    sku: 'SUPLEMENTO-OMEGA3',
    category: 'Medicamentos (OTC)',
    price: 79.0,
    stock: 20,
    description: 'Suplemento vitamínico rico em ômega 3 para brilho e saúde da pelagem.',
    imageUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Antipulgas Spot-On Cães 10-20kg',
    sku: 'ANTIPULGAS-SPOT-10',
    category: 'Medicamentos (OTC)',
    price: 92.0,
    stock: 22,
    description: 'Antipulgas tópico de aplicação mensal para cães médios.',
    imageUrl: 'https://images.unsplash.com/photo-1619983270114-0f87ce0edfab?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Vermífugo Palatável Gatos 4 doses',
    sku: 'VERMIFUGO-GATOS-4',
    category: 'Medicamentos (OTC)',
    price: 49.5,
    stock: 30,
    description: 'Vermífugo palatável de amplo espectro com quatro doses individuais.',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Casa Iglu Tecido Plush P',
    sku: 'CASA-IGLU-P',
    category: 'Acessórios',
    price: 119.9,
    stock: 15,
    description: 'Caminha tipo iglu com almofada removível em tecido plush macio.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fonte Bebedouro Inox 2,5L',
    sku: 'FONTE-INOX-25',
    category: 'Acessórios',
    price: 199.9,
    stock: 12,
    description: 'Fonte de água em inox com fluxo contínuo silencioso para gatos exigentes.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ração Super Premium Filhotes Raças Pequenas 3kg',
    sku: 'RACAO-FILHOTE-3',
    category: 'Rações',
    price: 119.0,
    stock: 40,
    description: 'Ração com DHA e prebióticos para filhotes de raças pequenas.',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Hidratante Spray para Pelos 250ml',
    sku: 'HIDRATANTE-PELOS-250',
    category: 'Higiene',
    price: 37.9,
    stock: 38,
    description: 'Spray hidratante com óleo de argan para revitalizar a pelagem.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
  }
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
