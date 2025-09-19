const fs = require('fs')
const path = require('path')

// persist auth state to a single file (the Baileys helper will be imported dynamically)
const authFile = path.join(__dirname, 'auth_info.json')

(async function main() {
	try {
		const baileys = await import('@whiskeysockets/baileys')
		const { default: makeWaSocket, useSingleFileAuthState, DisconnectReason } = baileys

		const { state, saveState } = useSingleFileAuthState(authFile)

		async function start() {
			const sock = makeWaSocket({ auth: state })

			sock.ev.on('creds.update', saveState)

			sock.ev.on('connection.update', (update) => {
				const { connection, lastDisconnect, qr } = update
				if (qr) {
					// print QR to terminal for scanning
					console.log('QR RECEIVED — scan with WhatsApp mobile app')
					console.log(qr)
				}

				if (connection === 'close') {
					const reasonCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode || lastDisconnect?.reason
					console.log('connection closed, reason code:', reasonCode)
					// reconnect on most errors except explicit logged out
					if (lastDisconnect && lastDisconnect.error && reasonCode !== DisconnectReason?.loggedOut) {
						start()
					} else {
						console.log('Logged out, please remove auth file and re-run to re-scan QR.')
					}
				}

				if (connection === 'open') {
					console.log('Connection opened')
				}
			})

			// listen for new messages
			sock.ev.on('messages.upsert', async (m) => {
				try {
					const messages = m.messages || []
					for (const msg of messages) {
						if (!msg.message || (msg.key && msg.key.remoteJid === 'status@broadcast')) continue

						const from = msg.key.remoteJid
						const sender = msg.key.participant || from

						// extract text body
						let text = ''
						const message = msg.message
						if (message.conversation) text = message.conversation
						else if (message.extendedTextMessage && message.extendedTextMessage.text) text = message.extendedTextMessage.text
						else if (message.imageMessage && message.imageMessage.caption) text = message.imageMessage.caption

						if (!text) continue

						if (text.trim().toLowerCase() === 'hi') {
							console.log(`Received 'hi' from ${sender}, replying with image`)

							// send an image — change to any accessible URL or local file
							const imageUrl = 'https://via.placeholder.com/512.png?text=Hello+from+Bot'

							await sock.sendMessage(from, {
								image: { url: imageUrl },
								caption: 'Hello! Here is an image in response to your hi.'
							})
						}
					}
				} catch (err) {
					console.error('messages.upsert handler error', err)
				}
			})

			return sock
		}

		start().catch(err => console.error('start failed', err))
	} catch (err) {
		console.error('failed to import baileys or start bot', err)
	}
})()
