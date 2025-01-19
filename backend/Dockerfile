# Use uma imagem base do Node.js
FROM node:18

# Diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Porta que o servidor roda (80 = porta padrão web)
EXPOSE 5000

# Comando para iniciar o app assim que iniciar o docker
CMD ["node", "server.js"]