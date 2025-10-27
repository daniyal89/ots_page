# Build a production bundle
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# If you don't have a lockfile, use: RUN npm install
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
# SPA fallback to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
