# Etap 1: Build aplikacji Vite
FROM node:18-bullseye AS build
WORKDIR /app

# Kopiujemy zależności
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Kopiujemy resztę projektu
COPY . .

# Budujemy aplikację Vite
RUN npm run build

# Etap 2: Serwowanie przez NGINX
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
