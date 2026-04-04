FROM node:20-alpine

RUN apk add --no-cache python3 make g++

# Workdir espelha a estrutura do repositório para que os imports relativos
# (../../frontend/src/mocks/...) e o path alias @condovida/shared funcionem
WORKDIR /app/api

COPY api/package*.json ./
RUN npm install

COPY api/ ./
COPY frontend/src/mocks/ /app/frontend/src/mocks/
COPY frontend/src/shared/ /app/frontend/src/shared/

EXPOSE 3001

CMD ["node", "--import", "tsx/esm", "src/index.ts"]
