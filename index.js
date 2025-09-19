const fs = require('fs')
const path = require('path')
const qrcode = require('qrcode-terminal')

// persist auth state to a single file (the Baileys helper will be imported dynamically)
const authFile = path.join(__dirname, 'auth_info.json')

// List of numbers to auto-send messages to (add numbers with country code)
const numberList = [
	'94772844996@s.whatsapp.net',  // Replace with actual numbers
	'94776350933@s.whatsapp.net',  // Format: countrycode+number@s.whatsapp.net
	// Add more numbers here...
]

async function main() {
	try {
		const baileys = await import('@whiskeysockets/baileys')
		const { default: makeWaSocket, useMultiFileAuthState, DisconnectReason } = baileys

		const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

		async function start() {
			const sock = makeWaSocket({ auth: state })

			sock.ev.on('creds.update', saveCreds)

			sock.ev.on('connection.update', (update) => {
				const { connection, lastDisconnect, qr } = update
				if (qr) {
					// print QR to terminal for scanning
					console.log('QR RECEIVED — scan with WhatsApp mobile app')
					qrcode.generate(qr, { small: true })
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
					
					// Auto-send images to predefined number list
					setTimeout(async () => {
						console.log('Sending images to predefined number list...')
						await sendToNumberList(sock)
					}, 3000) // Wait 3 seconds after connection opens
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

							// send an image — using a working image URL
							const imageUrl = 'https://i.ibb.co/qYHN0xny/ticket-1750181266230.png'

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
}

// Function to send images to all numbers in the list
async function sendToNumberList(sock) {
	const imageUrl = 'https://i.ibb.co/qYHN0xny/ticket-1750181266230.png'
	
	for (const number of numberList) {
		// Skip empty or invalid numbers
		if (!number || number === '@s.whatsapp.net' || number.length < 10) {
			console.log(`Skipping invalid number: ${number}`)
			continue
		}
		
		try {
			console.log(`Sending image to ${number}`)
			await sock.sendMessage(number, {
				image: { url: imageUrl },
				caption: 'Hello! This is an automated message with an image.'
			})
			// Wait 2 seconds between each message to avoid rate limiting
			await new Promise(resolve => setTimeout(resolve, 2000))
		} catch (error) {
			console.error(`Failed to send message to ${number}:`, error)
		}
	}
	console.log('Finished sending to all numbers in the list')
}

main()