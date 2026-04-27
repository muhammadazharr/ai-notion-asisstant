# Use Node.js 20 as required
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install system dependencies needed for Baileys, native modules, and bash
RUN apk add --no-cache bash git ffmpeg python3 make g++ 

# Install Gemini CLI globally
RUN npm install -g @google/gemini-cli

# Copy package files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the start script
CMD ["npm", "start"]
