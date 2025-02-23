# Usa una imagen ligera de Node.js basada en Alpine
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json primero para optimizar el cacheo
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install --omit=dev

# Instalar NestJS CLI globalmente para evitar el error "nest: not found"
RUN npm install -g @nestjs/cli

# Copiar el código fuente
COPY . .

# Compilar la aplicación con NestJS
RUN npx nest build

# Exponer el puerto 3000 para la API
EXPOSE 3000

# Comando para ejecutar la API en producción
CMD ["node", "dist/main.js"]
