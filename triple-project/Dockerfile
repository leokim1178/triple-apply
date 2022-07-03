FROM node:16
WORKDIR /triple-project
COPY ./package.json /triple-project/
COPY ./yarn.lock /triple-project/
RUN yarn install
COPY . /triple-project/
CMD yarn run start:dev