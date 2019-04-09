FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./build/ /app
CMD node index.js
EXPOSE 3000
