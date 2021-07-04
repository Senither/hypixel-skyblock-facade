# Hypixel SkyBlock Facade

A simple to use, stateless API facade for communicating with the Hypixel API, built to make it easier to get the information that matters.

This API acts as a facade to the real Hypixel API, its purpose is to make it easier to get skills, slayers, and dungeon information about profiles without the need to calculate each level yourself, and to make it easier to select a players profile based on different strategies.

> If you're not looking for a web API but still want a weight calculator you can checkout [LappySheep/hypixel-skyblock-weight](https://github.com/LappySheep/hypixel-skyblock-weight) for a different take on the weight calculation.

## Table of Content

* [Installation using NodeJS](#installation-using-nodejs)
  + [Prerequisites](#prerequisites)
  + [Setup Guide](#setup-guide)
* [Installation using Docker](#installation-using-docker)
  + [Prerequisites](#prerequisites-1)
  + [Setup Guide](#setup-guide-1)
* [Deploy directly to DigitalOcean](#deploy-directly-to-digitalocean)
  + [Prerequisites](#prerequisites-2)
  + [Setup Guide](#setup-guide-2)
* [Deploy directly to Replit](#deploy-directly-to-replit)
  + [Prerequisites](#prerequisites-3)
  + [Setup Guide](#setup-guide-3)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [Changelog](#changelog)
* [Contributing](#contributing)
* [License](#License)

## Installation using NodeJS

### Prerequisites

* NodeJS >= 14

### Setup Guide

To get started, clone down the repository using:

    git clone https://github.com/Senither/hypixel-skyblock-facade.git

Next go into the `hypixel-skyblock-facade` folder and install all the dependencies using Yarn or NPM.

    yarn install

    npm install

When all the dependencies have been installed you're can now ready to launch the site, to do this use Yarn or NPM

    yarn start

    npm start

You can also launch the site in watch mode using `yarn watch` or `npm run-script watch` , which makes development a lot easier since the entire app is reloaded anytime code changes are made.

## Installation using Docker

### Prerequisites

* Docker >= 20

_Older versions may also work, but have not been tested._

### Setup Guide

Running the API via Docker is made easy using [Docker Hub](https://hub.docker.com/r/senither/hypixel-skyblock-facade), to get started right away you can use:

    docker run -d -p 9281:9281 --rm senither/hypixel-skyblock-facade

And you're done! The command will start a detached instance of the API listening on port `9281` , and ensure that the container is deleted after you're done using it.

> The command will launch the API with the `latest` tag, if you want to run a different version of the API you'll have to specify it at the end of the image name, checkout the [Docker Hub Repository](https://hub.docker.com/r/senither/hypixel-skyblock-facade) to see the versions available.
>
> https://hub.docker.com/r/senither/hypixel-skyblock-facade/tags

If you want to modify the API in any way you'll have to build the Docker image yourself, this is also easy to do using [Docker Compose](https://docs.docker.com/compose/), before we start you'll need to clone down the code using git, you can do this using:

    git clone https://github.com/Senither/hypixel-skyblock-facade.git

From here you can make any number of changes to the API that you want, and when you're ready to start the API you can use [Docker Compose](https://docs.docker.com/compose/) to start the API.

    docker-compose up -d

The command will build the image if it doesn't already exists, and start a detached instance of the API, you can also specify `--build` if you want to enforce that a new image is built.

## Deploy directly to DigitalOcean

### Prerequisites

You'll need a [DigitalOcean Account](https://m.do.co/c/9f589c4101c3) to deploy directly to DO, if you don't already have an account you can use the referral link below to get some free credits so you can try hosting the API for free.

Referral link: https://m.do.co/c/9f589c4101c3

### Setup Guide

Click the button below to deploy the app to the DigitalOcean App Platform, from there just follow the setup instructions, and once the application have been built and deployed to the DigitalOcean App Platform you'll get a URL where you can access the API.

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/Senither/hypixel-skyblock-facade/tree/master)

## Deploy directly to Replit

### Prerequisites

You'll need a GitHub account to deploy directly to Replit, as well as a [Replit](https://replit.com/) account that is linked with your GitHub account, if you don't already have a [Replit](https://replit.com/) account you can simply sign in with your GitHub account directly.

### Setup Guide

1. First [fork this project](https://github.com/Senither/hypixel-skyblock-facade/fork) onto your own GitHub account, once you have a copy of the project on your own account, sign in to Replit and import the project into Replit.
2. Now that the project is imported you should be able to click on the project in the Replit dashboard to create a new project from it, when the project has been created you should be able to select some settings about the project, make sure the selected language is set to `TypeScript`, you can leave the _"configure the run button"_ settings as the default.
3. The project is now configured to run the project, however Replit by default installs NodeJS 10, and the project requires 14+, however, we can easily change the project target Node version to support Node v10 by opening the `tsconfig.json` file inside the Replit editor, then changing the _"target"_ and _"lib"_ values from `es2020` to say `es2018` instead.
4. Lastly you'll need to install all the dependencies for the project, this can be done by selecting the _"Shell"_ tab which should open the shell command prompt, then in that write `yarn install` to install all the dependencies.
5. Now that the dependencies are installed that TypeScript has been setup to target NodeJS v10 you're now ready to start the project, just click on the big _"Run"_ button at the top of the screen, and wait for the project to be built and booted up, after the project is up and running you should see a vanity URL that you can use to access your own version of the API.

## Environment Variables

### Port

**Defaults to `9281` **

The `PORT` environment variable determines what port the API is running on, you can change this to any open port on your system you want the API to run on instead.

### Environment

**Defaults to `dev` **

The `ENVIRONMENT` environment variable determines what environment the application is running in, if it is not `prod` or `production` it will assume the environment is a dev environment, when the application runs in a dev environment it will produce stack traces to errors that happens in the API.

## Usage

All requests sent to the API must be authenticated using a valid [Hypixel API](https://api.hypixel.net/) token, you can get your own API token by logging into `mc.hypixel.net` using Minecraft, and then running the `/api new` command to get a new API token.

The API supports authenticating using a `?key=token` query parameter, or by passing the API token using the `Authorization` header.

**Example**

    curl --location --request GET 'https://hypixel-api.senither.com/v1/profiles/18e174ef-078f-4275-8dcd-51d495d1096b' \
         --header 'Authorization: your-hypixel-api-token-goes-here'

The example above would send a request to the API to get all the profiles for the player with an UUID of `18e174ef-078f-4275-8dcd-51d495d1096b` .

A request could also be made to get a single profile for a user using some strategy, like selecting a profile by profile weight, highest skills, slayers, catacombs, or just selecting the profile that was last used.

**Example**

    curl --location --request GET 'https://hypixel-api.senither.com/v1/profiles/18e174ef-078f-4275-8dcd-51d495d1096b/weight' \
         --header 'Authorization: your-hypixel-api-token-goes-here'

The example above, like the previous example, will load profiles for the player with an UUID of `18e174ef-078f-4275-8dcd-51d495d1096b` , but we have selected the `weight` strategy, which means the API will only return the profile with the highest weight out of all of the players profiles.

> For more information about the strategies available, and how to use them, check out the documentation for the APIs homepage.
>
> Documentation: https://hypixel-api.senither.com/

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

Hypixel Skyblock Facade is open-sourced software licensed under the [MIT](https://opensource.org/licenses/MIT).
