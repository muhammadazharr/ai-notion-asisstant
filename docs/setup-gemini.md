# 🤖 How to Set Up Gemini CLI

This bot connects to Google's Gemini AI using a simple, one-time secure login. **No API keys are required!**

Follow these 3 simple steps to get it running:

### Step 1: Install the Gemini CLI

You need to install the CLI on your computer to perform the initial login.

```bash
npm install -g @google/gemini-cli
```

### Step 2: Login to Gemini

Run the following command in your terminal to authenticate with your Google account. This will securely open a browser window for you to log in.

```bash
gemini login
```

### Step 3: Run the Bot

That's it! You can now start the bot using Docker.

```bash
docker compose up -d --build
```

---

### 💡 How Docker Uses Your Login (No Extra Steps!)

You might be wondering why you don't need to configure API keys or log in again inside Docker. 

Our Docker setup is configured to seamlessly mount your computer's `~/.config` folder directly into the container. This means the Docker container automatically detects and reuses the login session you created in Step 2. 

The container has the Gemini CLI pre-installed, so once it starts, it can securely talk to Gemini out-of-the-box without asking you to authenticate again!
