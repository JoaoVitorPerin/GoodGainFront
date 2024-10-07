### STAGE 1: Build ###
FROM node:20.11-alpine AS build
WORKDIR /usr/src/app
#COPY package.json package-lock.json ./
COPY . /usr/src/app/
ARG env=prod
RUN npm install -g npm@10.4.0
RUN npm install -g @angular/cli@17.1.0
RUN npm install
#RUN npm run build --prod --configuration=production
RUN npm run prod

### STAGE 2: Run ###
FROM nginx:stable
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
RUN set -ex mkdir -p /usr/share/nginx/html/media 
COPY nginx.conf /etc/nginx/
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]