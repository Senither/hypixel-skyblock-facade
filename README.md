# Hypixel SkyBlock Facade

A simple to use, stateless API facade for communicating with the Hypixel API, built to make it easier to get the information that matters.

This API acts as a facade to the real Hypixel API, its purpose is to make it easier to get skills, slayers, and dungeon information about profiles without the need to calculate each level yourself, and to make it easier to select a players profile based on different strategies.

> This application is still in the very early stages of development, use it at your own risk, if you have an interest in helping in the development of the project, feel free to checkout the [contribution guidelines](CONTRIBUTING.md).

## Table of Content

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#License)

## Prerequisites

- NodeJS >= 14

## Installation

To get started, clone down the repository using:

    git clone https://github.com/Senither/hypixel-skyblock-facade.git

Next go into the `hypixel-skyblock-facade` folder and install all the dependencies using Yarn or NPM.

    yarn install

    npm install

When all the dependencies have been installed you're can now ready to launch the site, to do this use Yarn or NPM

    yarn start

    npm start

You can also launch the site in watch mode using `yarn watch` or `npm run-script watch`, which makes development a lot easier since the entire app is reloaded anytime code changes are made.

## Environment Variables

### Port

**Defaults to `9281`**

The `PORT` environment variable determines what port the API is running on, you can change this to any open port on your system you want the API to run on instead.

### Environment

**Defaults to `dev`**

The `ENVIRONMENT` environment variable determines what environment the application is running in, if it is not `prod` or `production` it will assume the environment is a dev environment, when the application runs in a dev environment it will produce stack traces to errors that happens in the API.

## Usage

All requests sent to the API must be authenticated using a valid [Hypixel API](https://api.hypixel.net/) token, you can get your own API token by logging into `mc.hypixel.net` using Minecraft, and then running the `/api new` command to get a new API token.

The API supports authenticating using a `?key=token` query parameter, or by passing the API token using the `Authorization` header.

**Example**

    curl --location --request GET 'https://hypixel-api.senither.com/v1/profiles/18e174ef-078f-4275-8dcd-51d495d1096b' \
         --header 'Authorization: your-hypixel-api-token-goes-here'

The example above would send a request to the API to get all the profiles for the player with an UUID of `18e174ef-078f-4275-8dcd-51d495d1096b`.

A request could also be made to get a single profile for a user using some strategy, like selecting a profile by profile weight, highest skills, slayers, catacombs, or just selecting the profile that was last used.

**Example**

    curl --location --request GET 'https://hypixel-api.senither.com/v1/profiles/18e174ef-078f-4275-8dcd-51d495d1096b/weight' \
         --header 'Authorization: your-hypixel-api-token-goes-here'

The example above, like the previous example, will load profiles for the player with an UUID of `18e174ef-078f-4275-8dcd-51d495d1096b`, but we have selected the `weight` strategy, which means the API will only return the profile with the highest weight out of all of the players profiles.

> For more information about the strategies available, and how to use them, check out the documentation for the APIs homepage.
>
> Documentation: https://hypixel-api.senither.com/

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

Hypixel Skyblock Facade is open-sourced software licensed under the [MIT](https://opensource.org/licenses/MIT).
