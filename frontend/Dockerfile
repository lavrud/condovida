FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ARG VITE_WS_URL=""
ARG VITE_USE_MOCK=false
ARG VITE_DEMO_MODE=false
ARG VITE_DEMO_PASSWORD=""

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_USE_MOCK=$VITE_USE_MOCK
ENV VITE_DEMO_MODE=$VITE_DEMO_MODE
ENV VITE_DEMO_PASSWORD=$VITE_DEMO_PASSWORD

RUN npm run build

# Production image
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
