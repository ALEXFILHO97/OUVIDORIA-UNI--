const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Criando dados fictícios para o dashboard...');

  try {
    // Criar categorias
    const categorias = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Reclamação' },
        update: {},
        create: { name: 'Reclamação' }
      }),
      prisma.category.upsert({
        where: { name: 'Sugestão' },
        update: {},
        create: { name: 'Sugestão' }
      }),
      prisma.category.upsert({
        where: { name: 'Elogio' },
        update: {},
        create: { name: 'Elogio' }
      }),
      prisma.category.upsert({
        where: { name: 'Dúvida' },
        update: {},
        create: { name: 'Dúvida' }
      }),
      prisma.category.upsert({
        where: { name: 'Problema Técnico' },
        update: {},
        create: { name: 'Problema Técnico' }
      })
    ]);

    // Criar itens para cada categoria
    const items = await Promise.all([
      prisma.item.upsert({
        where: { name: 'Atendimento' },
        update: {},
        create: { name: 'Atendimento', categoryId: categorias[0].id }
      }),
      prisma.item.upsert({
        where: { name: 'Infraestrutura' },
        update: {},
        create: { name: 'Infraestrutura', categoryId: categorias[1].id }
      }),
      prisma.item.upsert({
        where: { name: 'Professores' },
        update: {},
        create: { name: 'Professores', categoryId: categorias[2].id }
      }),
      prisma.item.upsert({
        where: { name: 'Matrícula' },
        update: {},
        create: { name: 'Matrícula', categoryId: categorias[3].id }
      }),
      prisma.item.upsert({
        where: { name: 'Sistema' },
        update: {},
        create: { name: 'Sistema', categoryId: categorias[4].id }
      })
    ]);

    // Criar tipos
    const tipos = [];
    const tiposData = ['Urgente', 'Normal', 'Baixa Prioridade'];
    
    for (const nomeTipo of tiposData) {
      let tipo = await prisma.type.findFirst({
        where: { name: nomeTipo }
      });
      
      if (!tipo) {
        tipo = await prisma.type.create({
          data: { name: nomeTipo }
        });
      }
      
      tipos.push(tipo);
    }

    // Criar estudantes fictícios
    const estudantes = await Promise.all([
      prisma.student.upsert({
        where: { email: 'joao.silva@email.com' },
        update: {},
        create: {
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '(62) 99999-1111'
        }
      }),
      prisma.student.upsert({
        where: { email: 'maria.santos@email.com' },
        update: {},
        create: {
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          phone: '(62) 99999-2222'
        }
      }),
      prisma.student.upsert({
        where: { email: 'pedro.oliveira@email.com' },
        update: {},
        create: {
          name: 'Pedro Oliveira',
          email: 'pedro.oliveira@email.com',
          phone: '(62) 99999-3333'
        }
      }),
      prisma.student.upsert({
        where: { email: 'ana.costa@email.com' },
        update: {},
        create: {
          name: 'Ana Costa',
          email: 'ana.costa@email.com',
          phone: '(62) 99999-4444'
        }
      }),
      prisma.student.upsert({
        where: { email: 'carlos.ferreira@email.com' },
        update: {},
        create: {
          name: 'Carlos Ferreira',
          email: 'carlos.ferreira@email.com',
          phone: '(62) 99999-5555'
        }
      })
    ]);

    // Criar ocorrências fictícias com diferentes datas e status
    const ocorrencias = [];
    const hoje = new Date();
    
    // Ocorrências dos últimos 30 dias
    for (let i = 0; i < 50; i++) {
      const dataCriacao = new Date(hoje);
      dataCriacao.setDate(hoje.getDate() - Math.floor(Math.random() * 30));
      dataCriacao.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

      const categoria = categorias[Math.floor(Math.random() * categorias.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];
      const estudante = estudantes[Math.floor(Math.random() * estudantes.length)];

      // Determinar status baseado na idade da ocorrência
      let status = 'WAITING';
      let dataFinalizacao = null;
      
      if (Math.random() > 0.3) { // 70% das ocorrências são finalizadas
        status = 'DONE';
        dataFinalizacao = new Date(dataCriacao);
        dataFinalizacao.setDate(dataCriacao.getDate() + Math.floor(Math.random() * 7) + 1);
      } else if (Math.random() > 0.5) {
        status = 'IN_PROGRESS';
      }

      const ocorrencia = await prisma.occurrence.create({
        data: {
          title: `Ocorrência ${i + 1} - ${categoria.name}`,
          description: `Descrição da ocorrência ${i + 1}. Esta é uma descrição detalhada do problema relatado pelo estudante.`,
          categoryId: categoria.id,
          itemId: item.id,
          typeId: tipo.id,
          studentId: estudante.id,
          status: status,
          created_at: dataCriacao,
          finished_in: dataFinalizacao
        }
      });

      ocorrencias.push(ocorrencia);
    }

    console.log(`✅ Criadas ${ocorrencias.length} ocorrências fictícias`);
    console.log(`✅ Criadas ${categorias.length} categorias`);
    console.log(`✅ Criados ${items.length} itens`);
    console.log(`✅ Criados ${tipos.length} tipos`);
    console.log(`✅ Criados ${estudantes.length} estudantes`);
    
    console.log('🎉 Dados fictícios criados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar dados fictícios:', error);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
