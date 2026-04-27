const { exec } = require('child_process');
const util = require('util');
const logger = require('../utils/logger');

// Promisify exec so we can use async/await
const execPromise = util.promisify(exec);

/**
 * Prompts the Gemini CLI using a child_process.
 * Does not use API keys. Relies on `gemini login` config.
 * 
 * @param {string} prompt - The question or prompt to send to Gemini.
 * @returns {Promise<string>} - The response text.
 */
async function askGemini(prompt) {
  try {
    // Escape single quotes in the prompt so it doesn't break the CLI command
    const safePrompt = prompt.replace(/'/g, "'\\''");
    
    // Command format requested: gemini -p 'prompt' for headless mode
    const command = `gemini -p '${safePrompt}'`;
    
    logger.info(`Running command: ${command}`);
    
    const { stdout, stderr } = await execPromise(command);

    if (stderr && !stdout) {
      logger.warn(`Gemini CLI stderr: ${stderr}`);
      // If there's an error output without standard output, it might be an auth error
      if (stderr.toLowerCase().includes('login') || stderr.toLowerCase().includes('auth')) {
        throw new Error("❌ Gemini not logged in. Run: gemini login");
      }
    }

    return stdout.trim();
  } catch (error) {
    logger.error('Gemini CLI error:', error);
    
    // Provide a human-readable error if the CLI fails or is not logged in
    throw new Error("❌ Gemini not logged in. Run: gemini login");
  }
}

module.exports = {
  askGemini
};
