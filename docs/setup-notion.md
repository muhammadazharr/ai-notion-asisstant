# 📝 How to Set Up Notion

This guide will walk you through getting your `NOTION_API_KEY` and `NOTION_DATABASE_ID`.

### Step 1: Create a Notion Integration

1. Go to [Notion Developers](https://www.notion.so/my-integrations).
2. Click the **"New integration"** button.
3. Give it a name (e.g., "AI WhatsApp Bot").
4. Select the workspace where you want the bot to operate.
5. Click **"Submit"**.
6. You will see an **Internal Integration Secret**. Click **"Show"** and copy this token. 
   👉 **This is your `NOTION_API_KEY`. Paste it into your `.env` file.**

### Step 2: Prepare your Database

1. Open Notion and create a new page as a **Table** or **Board** (Database).
2. Make sure you have at least these columns:
   - **Name** (Type: Title) - *This is the default first column.*
   - **Status** (Type: Status or Select)
   - **Date** (Type: Date)

### Step 3: Share the Database with your Integration

*This is the most common step people miss!*

1. Open your new Database in Notion.
2. Look at the top right corner for the **"..."** (three dots) menu and click it.
3. Scroll down to **"Connections"** and click **"Add connection"**.
4. Search for the integration you created in Step 1 (e.g., "AI WhatsApp Bot") and click it to give it access.

### Step 4: Get your Database ID

1. Look at the URL in your browser while viewing your database. It will look something like this:
   `https://www.notion.so/myworkspace/a8bec43388be435b914841dcc63972c3?v=...`
2. The long string of letters and numbers before the `?` is your Database ID.
   In the example above, the ID is `a8bec43388be435b914841dcc63972c3`.
3. Copy this ID.
   👉 **This is your `NOTION_DATABASE_ID`. Paste it into your `.env` file.**

You're all set! 🎉
