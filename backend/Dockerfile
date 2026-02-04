# Development: Node 18, install deps, jalankan nodemon
FROM node:18-alpine

WORKDIR /app

# Install dependencies dulu (cache layer)
COPY package*.json ./
RUN npm install

# Kode di-mount via volume; ini cuma default
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
