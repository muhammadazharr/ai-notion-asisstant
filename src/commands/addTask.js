const { addTask } = require('../services/notion');
const logger = require('../utils/logger');

/**
 * Handles the /add command.
 * @param {import('@whiskeysockets/baileys').WASocket} sock - The WhatsApp socket
 * @param {string} remoteJid - The ID of the chat to reply to
 * @param {string} taskText - The text of the task to add
 */
async function handleAddTask(sock, remoteJid, taskText) {
  if (!taskText) {
    await sock.sendMessage(remoteJid, { text: "❌ Please provide a task description.\nExample: */add Buy groceries*" });
    return;
  }

  try {
    await sock.sendMessage(remoteJid, { text: `⏳ Adding "${taskText}" to Notion...` });
    
    await addTask(taskText);

    await sock.sendMessage(remoteJid, { text: `✅ Task "${taskText}" has been added to your Notion database!` });
  } catch (error) {
    logger.error("Error in /add command", error);
    await sock.sendMessage(remoteJid, { text: error.message || "❌ Something went wrong while adding the task." });
  }
}

module.exports = handleAddTask;
