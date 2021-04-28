FROM node:14 as builder

WORKDIR /app

# Copy deps config
COPY ./package.json ./
COPY ./yarn.lock ./

# Install deps
RUN yarn

# Copy over rest (everything not in .dockerignore)
COPY . ./

# Create production build (lands in /dist)
RUN yarn build

FROM node:14-alpine

WORKDIR /app

# Install simple webserver
RUN yarn add serve

# Get dist build from last step
COPY --from=builder /app/dist dist

# Open port 5000
EXPOSE 5000

# Set entrypoint command that will run when container starts
ENTRYPOINT ["yarn", "serve", "-s", "dist"]
