FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./build/ /app/build
CMD node build/index.js
EXPOSE 5555
