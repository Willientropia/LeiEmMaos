import 'dotenv/config';
import { connectToDatabase } from "./db";

async function seedDatabase() {
  try {
    const db = await connectToDatabase();
    
    // Seed states
  const states = [
    { _id: "AC", name: "Acre" },
    { _id: "AL", name: "Alagoas" },
    { _id: "AP", name: "Amapá" },
    { _id: "AM", name: "Amazonas" },
    { _id: "BA", name: "Bahia" },
    { _id: "CE", name: "Ceará" },
    { _id: "DF", name: "Distrito Federal" },
    { _id: "ES", name: "Espírito Santo" },
    { _id: "GO", name: "Goiás" },
    { _id: "MA", name: "Maranhão" },
    { _id: "MT", name: "Mato Grosso" },
    { _id: "MS", name: "Mato Grosso do Sul" },
    { _id: "MG", name: "Minas Gerais" },
    { _id: "PA", name: "Pará" },
    { _id: "PB", name: "Paraíba" },
    { _id: "PR", name: "Paraná" },
    { _id: "PE", name: "Pernambuco" },
    { _id: "PI", name: "Piauí" },
    { _id: "RJ", name: "Rio de Janeiro" },
    { _id: "RN", name: "Rio Grande do Norte" },
    { _id: "RS", name: "Rio Grande do Sul" },
    { _id: "RO", name: "Rondônia" },
    { _id: "RR", name: "Roraima" },
    { _id: "SC", name: "Santa Catarina" },
    { _id: "SP", name: "São Paulo" },
    { _id: "SE", name: "Sergipe" },
    { _id: "TO", name: "Tocantins" }
  ];

  await db.collection('states').insertMany(states as any[]);
    console.log('States seeded successfully');

    // Seed some municipalities for SP
    const municipalities = [
      { name: "São Paulo", stateId: "SP", createdAt: new Date(), updatedAt: new Date() },
      { name: "Campinas", stateId: "SP", createdAt: new Date(), updatedAt: new Date() },
      { name: "Santos", stateId: "SP", createdAt: new Date(), updatedAt: new Date() },
      { name: "Ribeirão Preto", stateId: "SP", createdAt: new Date(), updatedAt: new Date() },
      { name: "Sorocaba", stateId: "SP", createdAt: new Date(), updatedAt: new Date() }
    ];

    await db.collection('municipalities').deleteMany({});
    await db.collection('municipalities').insertMany(municipalities);
    console.log('Municipalities seeded successfully');

    // Create admin user
    const adminUser = {
      email: "admin@leiemmaos.com",
      password: "admin123", // In production, this should be hashed
      name: "Administrador",
      type: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('users').deleteMany({ email: adminUser.email });
    await db.collection('users').insertOne(adminUser);
    console.log('Admin user created successfully');

    // Create sample politician
    const politician = {
      email: "politico@sp.gov.br",
      password: "politico123", // In production, this should be hashed
      name: "João Silva",
      type: "politician",
      state: "SP",
      municipality: "São Paulo",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('users').deleteMany({ email: politician.email });
    const politicianResult = await db.collection('users').insertOne(politician);
    console.log('Politician user created successfully');

    // Create sample news
    const sampleNews = [
      {
        title: "Nova Lei de Transparência Aprovada",
        content: "A Assembleia Legislativa aprovou uma nova lei que aumenta a transparência nos gastos públicos...",
        summary: "Lei de transparência aprovada para melhorar controle de gastos públicos",
        featured: true,
        state: "SP",
        municipality: "São Paulo",
        category: "Política",
        authorId: politicianResult.insertedId.toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Investimento em Educação Pública",
        content: "O governo estadual anunciou um investimento de R$ 500 milhões em educação pública...",
        summary: "R$ 500 milhões serão investidos em educação pública",
        featured: false,
        state: "SP",
        municipality: "Campinas",
        category: "Educação",
        authorId: politicianResult.insertedId.toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('news').deleteMany({});
    await db.collection('news').insertMany(sampleNews);
    console.log('Sample news created successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
