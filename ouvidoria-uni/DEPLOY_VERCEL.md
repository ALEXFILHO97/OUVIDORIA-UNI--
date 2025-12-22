# 🚀 Guia de Deploy no Vercel

Este guia vai te ajudar a fazer o deploy do projeto Ouvidoria-UNI no Vercel.

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Banco de dados PostgreSQL configurado (pode ser no [Vercel Postgres](https://vercel.com/storage/postgres), [Railway](https://railway.app), [Supabase](https://supabase.com), ou outro provedor)
3. Projeto no GitHub/GitLab/Bitbucket (opcional, mas recomendado)

## 🔧 Passo a Passo

### 1. Preparar o Projeto

O projeto já está configurado com:
- ✅ Script `postinstall` para gerar o Prisma Client
- ✅ Script `build` que inclui a geração do Prisma Client
- ✅ Arquivo `vercel.json` com configurações básicas

### 2. Fazer Push para o Repositório (se ainda não fez)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

### 3. Configurar no Vercel

#### Opção A: Via Dashboard da Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Importe seu repositório do GitHub/GitLab/Bitbucket
4. Configure o projeto:
   - **Framework Preset**: Next.js (deve detectar automaticamente)
   - **Root Directory**: Se o projeto está em `ouvidoria-uni/ouvidoria-uni/`, defina como `ouvidoria-uni/ouvidoria-uni`
   - **Build Command**: `npm run build` (ou deixe em branco para usar o padrão)
   - **Output Directory**: `.next` (padrão do Next.js)
   - **Install Command**: `npm install`

#### Opção B: Via CLI da Vercel

1. Instale a CLI da Vercel:
   ```bash
   npm i -g vercel
   ```

2. No diretório do projeto (`ouvidoria-uni/ouvidoria-uni/`), execute:
   ```bash
   vercel
   ```

3. Siga as instruções no terminal

### 4. Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings** → **Environment Variables** e adicione:

#### Variáveis Obrigatórias:

- **`DATABASE_URL`**: URL de conexão do PostgreSQL
  - Exemplo: `postgresql://user:password@host:5432/database?sslmode=require`
  
- **`NEXTAUTH_URL`**: URL da sua aplicação no Vercel
  - Exemplo: `https://seu-projeto.vercel.app`
  
- **`NEXTAUTH_SECRET`**: Chave secreta para NextAuth (gere uma nova)
  - Você pode gerar com: `openssl rand -base64 32`
  - Ou online em: https://generate-secret.vercel.app/32

#### Variáveis Opcionais (se usar email):

- **`EMAIL_HOST`**: Servidor SMTP
- **`EMAIL_PORT`**: Porta SMTP
- **`EMAIL_USER`**: Usuário do email
- **`EMAIL_PASS`**: Senha do email
- **`EMAIL_FROM`**: Email remetente

### 5. Executar Migrações do Prisma

Após o primeiro deploy, você precisa rodar as migrações do banco de dados. Você pode fazer isso de duas formas:

#### Opção A: Via Vercel CLI (Recomendado)

1. Instale a Vercel CLI (se ainda não tem)
2. Execute:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

#### Opção B: Via Script no Vercel

Adicione um script no `package.json`:
```json
"migrate": "prisma migrate deploy"
```

E execute no Vercel CLI:
```bash
vercel exec npm run migrate
```

#### Opção C: Manualmente no seu banco

Execute as migrações diretamente no seu banco de dados PostgreSQL usando um cliente como pgAdmin ou DBeaver.

### 6. Verificar o Deploy

1. Após o deploy, acesse a URL fornecida pela Vercel
2. Verifique se a aplicação está funcionando corretamente
3. Teste as funcionalidades principais

## 🔍 Troubleshooting

### Erro: "Prisma Client not generated"

Se você encontrar erros relacionados ao Prisma Client, certifique-se de que:
- O script `postinstall` está no `package.json`
- A variável `DATABASE_URL` está configurada corretamente
- As dependências estão instaladas corretamente

### Erro: "Module not found"

Verifique se todas as dependências estão no `package.json` e não no `package-lock.json` apenas.

### Erro de conexão com banco de dados

- Verifique se a `DATABASE_URL` está correta
- Verifique se o banco permite conexões externas
- Para PostgreSQL na Vercel, certifique-se de usar SSL: `?sslmode=require`

### Build falha

- Verifique os logs de build no dashboard da Vercel
- Certifique-se de que o Node.js version está compatível (Next.js 13 requer Node 18+)

## 📝 Notas Importantes

1. **Uploads de Arquivos**: O Vercel tem limites para uploads. Para produção, considere usar serviços como AWS S3, Cloudinary, ou similar.

2. **Banco de Dados**: O Vercel Postgres é uma ótima opção que já integra bem com o Vercel.

3. **Variáveis de Ambiente**: Sempre use variáveis de ambiente para informações sensíveis. Nunca commite `.env` no repositório.

4. **Região**: O `vercel.json` está configurado para usar `gru1` (São Paulo). Você pode alterar se necessário.

## 🎉 Pronto!

Seu projeto deve estar funcionando no Vercel agora!

Para mais informações, consulte a [documentação oficial da Vercel](https://vercel.com/docs).

