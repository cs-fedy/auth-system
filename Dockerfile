FROM node:16-alpine
WORKDIR /home/app/
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY seed.mongo.js .
# TODO: seed mongodb -- TO FIX LATER
# RUN yarn run seed
COPY . .
ENV PORT 3000
EXPOSE ${PORT}
CMD yarn run dev