FROM node:17.0.1-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD concurrently "cd server && npx --experimental-modules nodemon index.mjs" "node_modules/.bin/serve -s build"