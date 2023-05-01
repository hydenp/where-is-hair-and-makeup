FROM node:latest as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /usr/src/app/build /usr/share/nginx/html
RUN chmod +x ./usr/share/nginx/html/set-env.sh
EXPOSE 80
CMD ["sh", "-c", "cd /usr/share/nginx/html/ && ./set-env.sh && nginx -g 'daemon off;'"]