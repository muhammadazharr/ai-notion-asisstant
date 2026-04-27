/**
 * A beginner-friendly logger utility.
 * We use simple console.log to keep things easy to understand.
 */

const logger = {
  info: (message) => console.log(`[INFO] ℹ️ ${message}`),
  success: (message) => console.log(`[SUCCESS] ✅ ${message}`),
  warn: (message) => console.warn(`[WARN] ⚠️ ${message}`),
  error: (message, err = null) => {
    console.error(`[ERROR] ❌ ${message}`);
    if (err) {
      console.error(err.message || err);
    }
  },
  chat: (sender, message) => console.log(`[CHAT] 💬 ${sender}: ${message}`),
};

module.exports = logger;
