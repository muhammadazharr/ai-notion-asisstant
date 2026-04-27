const { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  Browsers,
  fetchLatestBaileysVersion 
} = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { execSync } = require('child_process');
const pino = require('pino');

const logger = require('./utils/logger');
const handleDeadline = require('./commands/deadline');
const handleAddTask = require('./commands/addTask');
const handleAsk = require('./commands/ask');

// Env loader logic
const envPath = path.resolve(process.cwd(), '.env');
const envExamplePath = path.resolve(process.cwd(), '.env.example');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  if (fs.existsSync(envExamplePath)) {
    dotenv.config({ path: envExamplePath });
  }
  logger.warn(".env not found, using .env.example");
}

function validateStartup() {
  if (!process.env.NOTION_API_KEY || process.env.NOTION_API_KEY === 'your_notion_api_key_here' || 
      !process.env.NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID === 'your_notion_database_id_here') {
    logger.error("❌ NOTION_API_KEY not set");
    process.exit(1);
  }

  try {
    execSync('gemini --version', { stdio: 'ignore' });
  } catch (error) {
    logger.error("❌ Gemini CLI not found");
    process.exit(1);
  }
}

async function startBot() {
  logger.info("🚀 Starting AI Notion Assistant...");

  try {
    // Ambil versi WhatsApp terbaru agar tidak 405
    const { version, isLatest } = await fetchLatestBaileysVersion();
    logger.info(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'error' }),
      browser: Browsers.macOS('Desktop'),
      syncFullHistory: false,
      // Hapus timeout yang terlalu agresif untuk koneksi awal
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        logger.info("📱 Scan QR to login");
        QRCode.toString(qr, { type: 'terminal', small: true }, function (err, url) {
          if (err) logger.error("Failed to generate QR code", err);
          else console.log(url);
        });
      }

      if (connection === 'close') {
        const error = lastDisconnect?.error;
        const statusCode = error?.output?.statusCode || error?.code;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        logger.warn(`Connection closed. Status: ${statusCode}. Reconnecting: ${shouldReconnect}`);

        if (shouldReconnect) {
          logger.info("Retrying connection in 5 seconds...");
          setTimeout(() => startBot(), 5000);
        }
      } else if (connection === 'open') {
        logger.success("📡 WhatsApp connected and ready!");
        logger.success("🤖 Bot is now listening for messages.");
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      const msg = messages[0];
      if (!msg.message) return;

      const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
      if (!text) return;

      const remoteJid = msg.key.remoteJid;
      const sender = msg.pushName || 'Unknown';

      if (text.startsWith('/deadline')) {
        logger.chat(sender, text);
        await handleDeadline(sock, remoteJid);
      }
      else if (text.startsWith('/add ')) {
        logger.chat(sender, text);
        const taskText = text.slice(5).trim();
        await handleAddTask(sock, remoteJid, taskText);
      }
      else if (text.startsWith('/ask ')) {
        logger.chat(sender, text);
        const questionText = text.slice(5).trim();
        await handleAsk(sock, remoteJid, questionText);
      }
    });
  } catch (err) {
    logger.error("Error initializing socket:", err);
    setTimeout(() => startBot(), 5000);
  }
}

validateStartup();
startBot().catch(err => {
  logger.error("Failed to start the bot:", err);
});
