const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config({ override: true });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notionApi = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  }
});

/**
 * Validates Notion Environment Variables.
 */
function validateNotionEnv() {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    throw new Error("❌ NOTION_API_KEY or NOTION_DATABASE_ID is missing in .env");
  }
}

/**
 * Fetches upcoming deadlines/tasks from the Notion database.
 * @returns {Promise<Array<{name: string, status: string, date: string}>>}
 */
async function getDeadlines() {
  validateNotionEnv();
  
  try {
    const response = await notionApi.post(`/databases/${NOTION_DATABASE_ID}/query`, {
      page_size: 10
    });

    const tasks = response.data.results.map(page => {
      // Mapping based on actual Socratez Studio structure
      const nameProp = page.properties['Product Name'];
      const statusProp = page.properties['Status Product'];
      const dateProp = page.properties['Deadline'];

      const name = nameProp?.title?.[0]?.plain_text || 'Untitled Product';
      
      // Status Product is a formula in this database
      const status = statusProp?.formula?.string || 'Unknown Status';
      
      const date = dateProp?.date?.start || 'No Deadline';

      return { name, status, date };
    });

    return tasks;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('❌ Notion API Key is invalid. Please check your .env file.');
      }
      if (error.response.status === 404) {
        throw new Error('❌ Notion Database not found. Make sure the Database ID is correct and it is shared with your integration.');
      }
    }
    logger.error('Failed to fetch from Notion:', error);
    throw new Error('Failed to fetch tasks from Notion. Check your API key and Database ID.');
  }
}

/**
 * Adds a new task to the Notion database.
 * @param {string} taskName - The name of the task to add.
 */
async function addTask(taskName) {
  validateNotionEnv();
  
  try {
    await notionApi.post('/pages', {
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        'Product Name': { // Match Socratez Studio structure
          title: [
            { text: { content: taskName } }
          ]
        }
      }
    });
    return true;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('❌ Notion API Key is invalid.');
      }
      if (error.response.status === 404) {
        throw new Error('❌ Notion Database not found or not shared with integration.');
      }
    }
    logger.error('Failed to add task to Notion:', error);
    throw new Error('Failed to add task to Notion.');
  }
}

module.exports = {
  getDeadlines,
  addTask
};
