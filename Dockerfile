FROM node:22-bookworm-slim

RUN apt-get update && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        libgtk-3-0 libnss3 libasound2 libxss1 libgbm1 libdrm2 \
        libxcb-* libxrandr2 libxtst6 libxcomposite1 libxcursor1 \
        libxdamage1 libxi6 libpango-1.0-0 libcairo2 libatk1.0-0 \
        libgdk-pixbuf-2.0-0 libdbus-1-3 \
        libxkbcommon0 libwayland-client0 libwayland-egl1 && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1001 mocktopus && \
    useradd --uid 1001 --gid mocktopus --shell /bin/bash --create-home --no-create-home mocktopus

RUN mkdir -p /app && chown mocktopus:mocktopus /app
WORKDIR /app

USER mocktopus

COPY package*.json ./
COPY .npmrc* .npmrc ./

RUN npm ci --include=dev

COPY . .

RUN mkdir -p .next/cache

RUN npx electron --version || true

RUN npm run build

CMD ["npm", "run", "electron-dev"]