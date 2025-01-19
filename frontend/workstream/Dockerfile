# Use uma imagem base do Node.js
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install react-router-dom
RUN npm install lucide-react
COPY . .

EXPOSE 3000

# Inicie o servidor de produção Vite
CMD ["npm", "run", "dev", "--", "--host"]
