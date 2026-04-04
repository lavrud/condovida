FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
# tsx is a devDependency but needed at runtime for TypeScript execution
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "--import", "tsx/esm", "src/index.ts"]
