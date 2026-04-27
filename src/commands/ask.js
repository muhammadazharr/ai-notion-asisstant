const { askGemini } = require('../services/gemini');
const logger = require('../utils/logger');

/**
 * Handles the /ask command.
 * @param {import('@whiskeysockets/baileys').WASocket} sock - The WhatsApp socket
 * @param {string} remoteJid - The ID of the chat to reply to
 * @param {string} question - The question to ask Gemini
 */
async function handleAsk(sock, remoteJid, question) {
  if (!question) {
    await sock.sendMessage(remoteJid, { text: "❌ Please provide a question.\nExample: */ask What is the capital of France?*" });
    return;
  }

  try {
    await sock.sendMessage(remoteJid, { text: "🤖 Thinking..." });
    
    const response = await askGemini(question);

    await sock.sendMessage(remoteJid, { text: `*Gemini:*\n\n${response}` });
  } catch (error) {
    logger.error("Error in /ask command", error);
    await sock.sendMessage(remoteJid, { text: error.message || "❌ Something went wrong while asking Gemini." });
  }
}

module.exports = handleAsk;
