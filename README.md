<p align="center">
  <a href="https://github.com/FjellOverflow/note-pls">
    <img alt="logo" src="./logo.svg" height="128">
  </a>
</p>

<h1 align="center">
  <a href="https://github.com/FjellOverflow/note-pls">note-pls</a>
</h1>

<p align="center">
  Telegram bot that takes notes
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/FjellOverflow/note-pls?label=Version&color=success"/>
  &ensp;
  <img src="https://img.shields.io/github/license/FjellOverflow/note-pls?label=License&color=success"/>
  &ensp;
  <img src="https://img.shields.io/github/actions/workflow/status/FjellOverflow/note-pls/publish-docker.yaml?branch=main&label=Build"/>
</p>

<p align="center">
  <a href="#what-is-this">What is this?</a> |
  <a href="#usage">Usage</a> |
  <a href="#installation">Installation</a> |
  <a href="#development">Development</a> |
  <a href="#build-from-source">Build from source</a>
</p>

## What is this?

**note-pls** is a small self-hosted Telegram bot that takes notes for you. Whenever you send it a message, it appends the text to the bottom of a file. Configured with a chat ID it will only accept messages from your account.

## Usage

- *Add the bot on Telegram*
- *Configure and run bot on your server*
- *Send a Telegram message to the bot:* the bot will append the text to the end of the configured file
- *Type the `/inbox` command:* the bot will send the current content of the configured file

## Installation

The bot is a *command-line interface (CLI)*. It takes its configuration either as flags (`note-pls -t <ADD ME>`) or as ENV variables (`NP_TELEGRAM_BOT_TOKEN=<ADD ME> note-pls`).

Mandatory options are
- `-t, --token, NP_TELEGRAM_BOT_TOKEN`
- `-c, --chat, NP_TELEGRAM_CHAT_ID`


Use the `-h, --help` flag for help and to see all available configuration options or take a look at the provided [example.env](./example.env) file.

### Token and chat ID

Firstly, create a Telegram bot and obtain a token: [Telegram docs](https://core.telegram.org/bots/tutorial#obtain-your-bot-token).

After messaging the bot for the first time, you will be able to obtain your personal *chat ID* with the bot (method of obtaining it depends on device and preference). This will be used to make sure you and only you are able to message the bot.

### Docker

The easiest way of running the bot is with Docker. Don't forget to map a volume to persist the file written by the bot.

```sh
docker run \
    -e NP_TELEGRAM_CHAT_ID=<ADD ME> \
    -e NP_TELEGRAM_BOT_TOKEN=<ADD ME> \
    -v /home/user/notes/inbox.txt:/inbox.txt
    ghcr.io/fjelloverflow/note-pls:latest
```

There are also an example [docker-compose.yaml](./docker-compose.yaml) and [example.env](./example.env) file provided.

### Executable

You can also run the bot as an executable. Grab the latest executable for your platform on the [releases](https://github.com/FjellOverflow/note-pls/releases) page and simply run the CLI.

```sh
# download binary for Linux
wget -O note-pls https://github.com/FjellOverflow/note-pls/releases/download/v0.0.1/note-pls.v0.0.1.linux-x64

# make executable
chmod +x note-pls

# run binary
note-pls -t <ADD ME> -c <ADD ME>
```

## Development

The project runs with [bun](https://bun.sh/), a NodeJS compatible JavaScript environment.

```sh
git clone https://github.com/FjellOverflow/note-pls.git
cd note-pls
bun install
```

To start the dev-server run `bun run dev`.
For a full list of all commands, check the `scripts` section in `package.json`.

To install the recommended extensions for VSCode, open the _Extensions_ tab and type `@recommended`.

## Build from source

To build the project from source, use the provided `build.sh` script. It takes as argument the target platform, which can be either `docker` or any of [targets supported by bun.sh](https://bun.sh/docs/bundler/executables#supported-targets). 

```sh
# build docker image
./build.sh docker

# build for linux-x64
./build.sh linux-x64

# ...same for other targets
```