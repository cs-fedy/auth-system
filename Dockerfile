FROM node:17-alpine
WORKDIR /home/app/
RUN npm i -g yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
ENV PORT 3000
EXPOSE ${PORT}
CMD yarn run dev