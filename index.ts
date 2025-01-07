import { Command, Option } from 'commander'
import { Bot, type GrammyError } from 'grammy'
import { description, name, version } from './package.json'

const ENV_PREFIX = 'NP_'

const program = new Command()
	.name(name)
	.description(description)
	.addOption(
		new Option('-t, --token <TOKEN>', 'Telegram bot token')
			.env(`${ENV_PREFIX}TELEGRAM_BOT_TOKEN`)
			.makeOptionMandatory()
	)
	.addOption(
		new Option('-c, --chat <CHAT_ID>', 'Telegram chat ID')
			.env(`${ENV_PREFIX}TELEGRAM_CHAT_ID`)
			.makeOptionMandatory()
	)
	.addOption(
		new Option('-f, --file <FILEPATH>', 'filepath to write to')
			.env(`${ENV_PREFIX}FILEPATH`)
			.default('./inbox.txt')
	)
	.addOption(
		new Option('-p, --prepend <STRING>', 'prepend messages with string')
			.env(`${ENV_PREFIX}PREPEND`)
			.default('')
	)
	.addOption(
		new Option('-d, --debug', 'debug mode')
			.env(`${ENV_PREFIX}DEBUG`)
			.default(false)
	)
	.version(version, '-v, --version', 'output the version number')

program.parse(process.argv)
const {
	token: botToken,
	chat: chatId,
	file: filePath,
	prepend: prependStr,
	debug
} = program.opts()
if (debug) console.debug(program.opts())

const bot = new Bot(botToken)

const checkAuthentication = (incomingChatId?: number) => {
	if (!incomingChatId || String(chatId) !== String(incomingChatId)) {
		console.error(
			`Received message from unknown chatId ${incomingChatId}. Shutting down.`
		)
		bot.stop()
		process.exit(1)
	}
}

bot.command('inbox', async (context) => {
	checkAuthentication(context.from?.id)

	if (debug) console.debug('/inbox command evoked')

	context.deleteMessage()

	const file = Bun.file(filePath)
	const answer = (await file.exists()) ? await file.text() : 'Empty inbox'

	context.reply(answer)
})

bot.on('message', async (context) => {
	const {
		message: { text: textMessage }
	} = context

	checkAuthentication(context.from.id)

	if (debug) console.debug(`Received message "${textMessage}"`)

	if (!textMessage) return

	const file = Bun.file(filePath)
	const currentContent = (await file.exists()) ? await file.text() : ''

	await Bun.write(file, `${currentContent}${prependStr}${textMessage}`)

	context.deleteMessage()
})

bot.start().catch((e: GrammyError) => {
	if (e.error_code === 409) {
		console.error(
			'Another instance of the bot is already running. Terminating.'
		)
		process.exit(1)
	}
	throw e
})
