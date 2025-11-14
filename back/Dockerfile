FROM node:22-slim

# Instalar Chromium y dependencias
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Instalar pnpm
RUN npm install -g pnpm

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Variables de entorno para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
# Exponer el puerto
EXPOSE 10000

# Comando de inicio
CMD ["pnpm", "start"]