/**
 * Projeto: Ouvidoria-UNI
 * Arquivo: next.config.js
 * Última atualização: 06/10/2025
 * Autor: Bruno Azevedo e Alex Carlos
 */

/**
 * @type {import('next').NextConfig}
 * Esse é o arquivo de configuração principal do Next.js para o projeto Ouvidoria-UNI. 
 * Aqui são definidos ajustes globais que afetam o comportamento da aplicação,
 * incluindo domínios permitidos para imagens e recursos experimentais.
 */

const nextConfig = {
  /**
   * Configurações relacionadas ao componente <Image /> do Next.js.
   * A propriedade domains define de quais domínios é permitido carregar imagens externas, o que é importante por motivos de segurança e otimização — o Next.js só otimiza imagens de fontes explicitamente confiáveis.
   */
  images: {
    domains: [
      "tailwindui.com", // Recursos visuais de exemplo/documentação do Tailwind UI
      "ouvidoria.faculdadeunievangelica.edu.br", // Domínio principal do sistema de Ouvidoria (produção)
      "localhost", // Ambiente local de desenvolvimento
      "vestibular.faculdadeunievangelica.edu.br", // Domínio institucional (para integração de banners e imagens)
    ],
  },

  /**
   * Configurações experimentais do Next.js.
   * serverActions habilita o uso de "Server Actions",
   * um recurso experimental que permite executar funções do servidor diretamente
   * a partir de componentes React, sem necessidade de criar rotas de API separadas.
   * Observação: Como é um recurso experimental, pode mudar em futuras versões do next.js.
   */
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
