FROM node:18-alpine3.16 as builder
# install build dependencies
RUN npm install -g pnpm@8
# install app dependencies
WORKDIR /app
COPY ./package.json           ./
COPY ./pnpm-lock.yaml         ./
RUN pnpm install --frozen-lockfile
# build the app
COPY . .
RUN NODE_ENV=production pnpm build \
    && pnpm prune --prod

FROM node:18-alpine3.16
ENV NODE_ENV=production \
    ORIGIN=http://localhost:3000 
WORKDIR /app
COPY --from=builder /app/node_modules/      ./node_modules/
COPY --from=builder /app/build/             ./build/
COPY --from=builder /app/package.json       ./
VOLUME [ "/data" ]
CMD [ "node", "/app/build/index.js" ]

