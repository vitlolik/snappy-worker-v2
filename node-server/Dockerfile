FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN rm -rf src/
CMD [ "npm", "run", "start:prod" ]