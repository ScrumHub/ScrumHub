FROM node:17.0.1-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD concurrently "set NODE_OPTIONS='--no-warnings --loader ts-node/esm' && nodemon -e ts,tsx --exec node --loader ts-node/esm server/index.ts" "node_modules/.bin/serve -s build"