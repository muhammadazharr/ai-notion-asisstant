const { getDeadlines } = require('../services/notion');
const logger = require('../utils/logger');

/**
 * Handles the /deadline command.
 * @param {import('@whiskeysockets/baileys').WASocket} sock - The WhatsApp socket
 * @param {string} remoteJid - The ID of the chat to reply to
 */
async function handleDeadline(sock, remoteJid) {
  try {
    await sock.sendMessage(remoteJid, { text: "⏳ Fetching your tasks from Notion..." });
    
    const tasks = await getDeadlines();

    if (tasks.length === 0) {
      await sock.sendMessage(remoteJid, { text: "✅ No tasks found! You're all caught up." });
      return;
    }

    let message = "📝 *Your Notion Tasks:*\n\n";
    tasks.forEach((task, index) => {
      message += `${index + 1}. *${task.name}*\n`;
      message += `   Status: ${task.status}\n`;
      message += `   Date: ${task.date}\n\n`;
    });

    await sock.sendMessage(remoteJid, { text: message.trim() });
  } catch (error) {
    logger.error("Error in /deadline command", error);
    await sock.sendMessage(remoteJid, { text: error.message || "❌ Something went wrong while fetching tasks." });
  }
}

module.exports = handleDeadline;
