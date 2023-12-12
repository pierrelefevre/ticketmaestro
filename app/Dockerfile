FROM node as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV CHOKIDAR_USEPOLLING=true


COPY ./app/package.json /app/
COPY ./app/package-lock.json /app/
COPY ./app /app

RUN npm install
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./app/nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]