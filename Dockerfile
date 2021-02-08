FROM node:14-alpine

# Setup the working directory
WORKDIR /srv

# Installs our dependencies
COPY package.json /srv/
COPY yarn.lock /srv/
RUN yarn install

# Copy over TS configuration and source code files
COPY tsconfig.json /srv/
COPY src /srv/src/

# Start the application
CMD [ "yarn", "start" ]
