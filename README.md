# Api-RestFull-NodeJs
Projeto básico de criação de API's com o modelo RestFull usando Node-js.

O projeto está divido em duas aplicações uma atuando com o servidor Node Js e outra como uma aplicação requisitante dos serviços.

No caso o papel do cliente fica a cargo da "cliente_web_instagram_clone" onde se econtra a parte front-end do projeto, utilizando html, css e javascript. O projeto é um clone simples do instagram que faz requisções utilizando de Apis Restfull disponiveis pelo servidor, as requisiçoes são simples apenas para inserir, deletar e altera imagens e comentário das imagens.

No projeto "API" encontra o Server.js onde são encontradas as API's do projeto, as APIs forma construidas de maneira simples apenas para demonstrar o acesso a elas. No caso as rotas ja dão acesso direto ao banco de dados MongoDB, o banco realiza as operações seguindo o padrão dos verbos Http (GET, DELETE, PUT, POST), ele realiza as operações através dos dados enviados do cliente que podem ser paramedros enviados pela url ou tabém atavés do corpo (body) da requisição. A respostas as requisições acontecem através dos status http e também encaminha json ou string para o frot-end realizar suas ativiades; 

