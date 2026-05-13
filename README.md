# AI Notion Assistant (WhatsApp + Gemini)

A production-quality, beginner-friendly WhatsApp bot that helps you manage your Notion tasks and answers your questions using Google's Gemini AI!

## Features

The bot strictly responds to these commands:
- **/deadline** - Fetch your upcoming tasks and deadlines directly from Notion.
- **/add <task>** - Add a new task to your Notion database.
- **/ask <question>** - Ask Gemini anything and get instant AI-powered responses.

## Install Docker (Required)

Docker is a tool that allows you to run applications in isolated containers, meaning you don't have to worry about complex setups, installing Node.js, or handling missing dependencies on your computer!

### macOS / Windows
Download and install Docker Desktop:
[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

After installation:
1. Open the Docker Desktop application.
2. Wait until the indicator says "Docker is running".

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
```

### Verify Installation
Open your terminal and run:
```bash
docker --version
```
If you see the version number, you're ready to proceed!

---

## Quick Start

Zero confusion, minimal setup:

1. **Login to Gemini on your host machine:**
   ```bash
   gemini login
   ```

2. **Configure Notion Environment:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your `NOTION_API_KEY` and `NOTION_DATABASE_ID` (Only Notion keys are needed!).

3. **Start the Bot:**
   ```bash
   docker compose up -d --build
   ```

4. **Scan QR Code:**
   - Run `docker compose logs -f` to see the QR code.
   - Open WhatsApp on your phone -> Settings -> Linked Devices -> Link a Device.
   - Scan the QR code.
   - Your bot is ready!

That's it! Send `/deadline` or `/ask Hello` to the bot to test it.
