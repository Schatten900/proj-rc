# WorkStream
---
## O que é? 🤔
O WorkStream é um aplicativo web de organização e gestão de equipes com o diferencial de possuir um sistema interativo e descontraído de progressão de níveis, podendo ser utilizado tanto para trabalho, estudo ou qualquer outra atividade que demande contribuições em grupo.

---
## Funcionalidades 🚀
A aplicação web conta com 5 principais funcionalides, sendo elas:
- 👥 Criação de grupos;
- 🔒 Criação de perfis pessoais e seguros;
- ✅ Registro de tarefas;
- 💬 Chat em tempo real;
- 📈 Progressão em níveis;

As tarefas serão registradas pelo criador do grupo, cada tarefa possui uma recompensa fixa, e no momento em que os participantes daquele grupo concluírem a tarefa, a recompensa (pontos de experiência) é adquirida pelo usuário. Caso o usuário acumule 100 pontos de experiência, ele sobe de nível podendo ficar melhor classificado no ranking de usuários! 
A respeito do chat em tempo real, no mesmo é possível trocar informações, dicas ou até mesmo sanar dúvidas sobre determinada tarefa.

---
## Como executar a aplicação? ⚙️
O WorkStream utiliza tecnologia de Dockers, se tornando assim extremamente portável. Apenas é necessário instalar o software Docker Desktop na versão do seu sistema operacional. [Download do docker](https://www.docker.com/products/docker-desktop/)

Para colocar o servidor em execução, basta clonar o repositório, navegar até o diretório raiz do projeto (o que possui o arquivo docker-compose.yml) e executar o seguinte comando:

```docker-compose up --build```

Com o comando executado, dentro de alguns minutos todas as imagens serão construídas e os containeres entrarão em execução. Após esses passos, basta acessar o navegador de sua preferência utilizando o IP da máquina em que o servidor está sendo executado na porta 3000.

#### Observação❗
A aplicação estará disponível para qualquer usuário da mesma rede local em que o servidor está sendo executado. Caso seja necessário acessar a aplicação através de outras redes, é necessário utilizar algum serviço de VPN.

---
## Autores
- Carlos Cauã Rocha - Desenvolvedor FullStack, [GitHub](https://github.com/Schatten900)
- José Neto Souza, Desenvolvedor FullStack, [GitHub](https://github.com/jose-Nt)
- Luca Megiorin, Desenvolvedor Backend e idealizador do projeto, [GitHub](https://github.com/Luke0133)