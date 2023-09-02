# FROM node:alpine
# WORKDIR /app
# COPY package.json ./
# COPY package-lock.json ./
# COPY ./ ./
# RUN npm install
# RUN npm run build
# CMD ["npm", "run", "start:prod"]
FROM node:14
RUN npm install -g serve
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
