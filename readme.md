Catálogo de Filmes Infantil

Descrição
Um catálogo de filmes desenvolvido especialmente para pais e responsáveis, permitindo filtrar filmes por classificação etária adequada para crianças. A aplicação oferece uma interface colorida e amigável, com funcionalidades de busca, favoritos e sistema de votação comunitária.

Funcionalidades
Busca de Filmes: Pesquisa por nome do filme

Filtro por Classificação Etária: Filtragem por idade (Livre, 10, 12, 14, 16, 18 anos)

Sistema de Favoritos: Adicionar e remover filmes dos favoritos

Detalhes Completos: Página dedicada com informações detalhadas dos filmes

Votação Comunitária: Sistema para votar na classificação adequada com base na opinião do usuário


Informações Técnicas:

A infraestrutura deste projeto foi hospedada na plataforma Render. O site estático, o web-service e o banco de dados estão todos neste mesmo provedor. Os serviços foram integrados ao github.

O backend foi desenvolvido em python com Flask, o sistema de banco de dados utilizado foi o PostgreSQL e o frontend foi feito com html, css e javascript. As imagens foram hospedadas no Cloudinary, e seus links estão no banco. 


Armazenamento Local: Favoritos salvos no localStorage do navegador (não há login ainda)

Armazenamento em nuvem: votos da comunidade e informações dos filmes

Tecnologias Utilizadas

Python

Flask

PostgreSQL

HTML5

CSS3 (Grid, Flexbox, Variáveis CSS)

JavaScript ES6+

Local Storage API

Render

Cloudinary

Font Awesome para ícones

Google Fonts (Comic Neue)

Para testar a implementação, acessar: https://filmes-frontend-ifw0.onrender.com
OBS: indisponível a partir do dia 04/12/2025

Instalação e Uso
Requisitos: Navegador web moderno com suporte a JavaScript

- Criar uma database PostgreSQL em uma nuvem

- restaurar database utilizando o arquivo backup_v18.sql

- Configurar serviço python

- A variável de ambiente DATABASE_URL deverá ser configurada com a string de conexão do banco de dados

- As dependências em requirements.txt devem ser instaladas

- Comando de inicialização: gunicorn app:app

- Os arquivos script.js e detalhes.js deverão ter a variável da url atualizada

Favoritos e votos são salvos localmente

API Utilizada
A aplicação consome dados da API:
https://filmes-api-dev.onrender.com/api/filmes

Parâmetros da API:
nome: Filtro por nome do filme

classificacao: Filtro por classificação específica

classificacao_max: Filtro por classificação máxima



Observações
Sinopses genéricas são geradas automaticamente quando a API não as fornece

Imagens com erro de carregamento exibem placeholders coloridos

A aplicação inclui tratamento de erros para falhas na API

Interface otimizada para uso em dispositivos touch

Licença
Projeto desenvolvido para fins educacionais. Livre para uso e modificação.
