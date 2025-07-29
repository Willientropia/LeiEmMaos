import { db } from "./db";
import { states, municipalities, news, users } from "@shared/schema";

// Brazilian states data
const BRAZILIAN_STATES = [
  { id: "AC", name: "Acre" },
  { id: "AL", name: "Alagoas" },
  { id: "AP", name: "Amapá" },
  { id: "AM", name: "Amazonas" },
  { id: "BA", name: "Bahia" },
  { id: "CE", name: "Ceará" },
  { id: "DF", name: "Distrito Federal" },
  { id: "ES", name: "Espírito Santo" },
  { id: "GO", name: "Goiás" },
  { id: "MA", name: "Maranhão" },
  { id: "MT", name: "Mato Grosso" },
  { id: "MS", name: "Mato Grosso do Sul" },
  { id: "MG", name: "Minas Gerais" },
  { id: "PA", name: "Pará" },
  { id: "PB", name: "Paraíba" },
  { id: "PR", name: "Paraná" },
  { id: "PE", name: "Pernambuco" },
  { id: "PI", name: "Piauí" },
  { id: "RJ", name: "Rio de Janeiro" },
  { id: "RN", name: "Rio Grande do Norte" },
  { id: "RS", name: "Rio Grande do Sul" },
  { id: "RO", name: "Rondônia" },
  { id: "RR", name: "Roraima" },
  { id: "SC", name: "Santa Catarina" },
  { id: "SP", name: "São Paulo" },
  { id: "SE", name: "Sergipe" },
  { id: "TO", name: "Tocantins" },
];

// Sample municipalities for major states
const SAMPLE_MUNICIPALITIES = [
  // São Paulo
  { name: "São Paulo", stateId: "SP" },
  { name: "Campinas", stateId: "SP" },
  { name: "Santos", stateId: "SP" },
  { name: "Ribeirão Preto", stateId: "SP" },
  { name: "Sorocaba", stateId: "SP" },
  
  // Rio de Janeiro
  { name: "Rio de Janeiro", stateId: "RJ" },
  { name: "Niterói", stateId: "RJ" },
  { name: "Petrópolis", stateId: "RJ" },
  { name: "Nova Iguaçu", stateId: "RJ" },
  { name: "Duque de Caxias", stateId: "RJ" },
  
  // Minas Gerais
  { name: "Belo Horizonte", stateId: "MG" },
  { name: "Uberlândia", stateId: "MG" },
  { name: "Contagem", stateId: "MG" },
  { name: "Juiz de Fora", stateId: "MG" },
  { name: "Betim", stateId: "MG" },
  
  // Rio Grande do Sul
  { name: "Porto Alegre", stateId: "RS" },
  { name: "Canoas", stateId: "RS" },
  { name: "Pelotas", stateId: "RS" },
  { name: "Santa Maria", stateId: "RS" },
  { name: "Gravataí", stateId: "RS" },
  
  // Bahia
  { name: "Salvador", stateId: "BA" },
  { name: "Feira de Santana", stateId: "BA" },
  { name: "Vitória da Conquista", stateId: "BA" },
  { name: "Camaçari", stateId: "BA" },
  { name: "Ilhéus", stateId: "BA" },
  
  // Paraná
  { name: "Curitiba", stateId: "PR" },
  { name: "Londrina", stateId: "PR" },
  { name: "Maringá", stateId: "PR" },
  { name: "Ponta Grossa", stateId: "PR" },
  { name: "Cascavel", stateId: "PR" },
];

// Sample news articles
const SAMPLE_NEWS = [
  {
    title: "Nova proposta de reforma tributária aprovada em primeira votação no Congresso",
    content: "A proposta que altera a estrutura de impostos federais foi aprovada por 312 votos favoráveis e 189 contrários. O texto segue agora para análise do Senado Federal, onde deve passar por nova discussão antes da votação final.\n\nA reforma prevê mudanças significativas na tributação de empresas e pessoas físicas, com o objetivo de simplificar o sistema tributário brasileiro e reduzir a carga de impostos sobre a produção.\n\nSegundo o relator da proposta, a reforma pode gerar uma economia de até R$ 50 bilhões anuais para o setor produtivo, beneficiando especialmente pequenas e médias empresas.\n\nA votação foi marcada por intenso debate entre governo e oposição, com discussões que se estenderam por mais de 12 horas no plenário da Câmara dos Deputados.",
    summary: "A proposta que altera a estrutura de impostos federais foi aprovada por 312 votos favoráveis e 189 contrários. O texto segue agora para análise do Senado...",
    imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    category: "URGENTE",
    state: "DF",
    municipality: "Brasília",
    featured: true,
    authorId: "admin",
  },
  {
    title: "TSE divulga calendário oficial das próximas eleições municipais",
    content: "O Tribunal Superior Eleitoral (TSE) divulgou o calendário oficial para as próximas eleições municipais, que acontecerão em outubro de 2024.\n\nO cronograma inclui prazos importantes para registro de candidaturas, início da campanha eleitoral e definição das regras para debates e propaganda política.\n\nSegundo o calendário, o prazo para registro de candidaturas vai até 15 de agosto, enquanto a campanha eleitoral oficial poderá começar em 16 de agosto.\n\nO primeiro turno está marcado para o primeiro domingo de outubro, e o segundo turno, quando necessário, será realizado no último domingo do mesmo mês.",
    summary: "O cronograma inclui prazos para registro de candidaturas e início da campanha eleitoral...",
    imageUrl: "https://pixabay.com/get/gddf07702ba45ba33d937f4e263b2c811843427f03919a8729a1ac171b7088da96182a422c753eafafbfb49cf05561b908d04eeca502e38fe7494cdd0af522ccc_1280.jpg",
    category: "ELEIÇÕES",
    featured: true,
    authorId: "admin",
  },
  {
    title: "Prefeitura de São Paulo anuncia novo programa de transparência",
    content: "A Prefeitura de São Paulo anunciou o lançamento de um novo programa de transparência que permitirá aos cidadãos acompanhar em tempo real os gastos públicos municipais.\n\nA iniciativa, denominada 'SP Transparente', disponibilizará informações detalhadas sobre contratos, licitações, folha de pagamento e execução orçamentária através de uma plataforma digital.\n\nO programa também incluirá um sistema de alertas que notificará os cidadãos sobre novos gastos acima de determinado valor, permitindo maior fiscalização da aplicação dos recursos públicos.\n\nA plataforma deve ser lançada oficialmente no próximo mês e estará disponível tanto via web quanto através de aplicativo móvel.",
    summary: "Iniciativa permitirá acompanhamento em tempo real dos gastos públicos municipais...",
    imageUrl: "https://images.unsplash.com/photo-1494888427482-242d32babc0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
    category: "MUNICIPAL",
    state: "SP",
    municipality: "São Paulo",
    featured: true,
    authorId: "admin",
  },
  {
    title: "Governadores se reúnem para discutir pacto federativo",
    content: "Governadores de diversos estados brasileiros se reuniram em Brasília para discutir mudanças no pacto federativo e a distribuição de recursos entre União, estados e municípios.\n\nO encontro, que durou dois dias, teve como objetivo alinhar políticas públicas e buscar maior autonomia fiscal para os estados.\n\nEntre os principais pontos discutidos estão a repartição das receitas tributárias, o financiamento da educação e saúde, e a responsabilidade pela execução de programas sociais.\n\nOs governadores também debateram a criação de um fundo comum para investimentos em infraestrutura e a possibilidade de maior participação dos estados na arrecadação federal.",
    summary: "Encontro busca alinhar políticas públicas e distribuição de recursos entre estados...",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
    category: "ESTADUAL",
    state: "DF",
    municipality: "Brasília",
    featured: true,
    authorId: "admin",
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Seed states
    console.log("📍 Seeding states...");
    await db.insert(states).values(BRAZILIAN_STATES).onConflictDoNothing();

    // Seed municipalities
    console.log("🏘️ Seeding municipalities...");
    await db.insert(municipalities).values(SAMPLE_MUNICIPALITIES).onConflictDoNothing();

    // Create admin user
    console.log("👤 Creating admin user...");
    await db.insert(users).values({
      name: "Administrator",
      email: "admin@leiemmaos.com.br",
      password: "admin123", // In production, this should be hashed
      type: "admin",
    }).onConflictDoNothing();

    // Create sample politician
    console.log("🏛️ Creating sample politician...");
    await db.insert(users).values({
      name: "João Silva",
      email: "joao.silva@politico.com.br",
      password: "politico123", // In production, this should be hashed
      type: "politician",
      state: "SP",
      municipality: "São Paulo",
    }).onConflictDoNothing();

    // Seed news
    console.log("📰 Seeding news articles...");
    await db.insert(news).values(SAMPLE_NEWS).onConflictDoNothing();

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    console.log("🎉 Seed completed!");
    process.exit(0);
  });
}

export { seedDatabase };
