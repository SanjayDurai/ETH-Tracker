
# Hello Sir/Mam I was not able to upload the compelete project due to size issues and im trying to push but its completed so i have uploaded it in GDrive and attached link 
https://drive.google.com/drive/folders/1yUVx0haEdt4voXQ7MWwpyeM-DcZgSfnx?usp=sharing



# Ethereum Deposit Tracker
The Ethereum Deposit Tracker is a Node.js-based project that tracks Ethereum 2.0 deposits made to the Ethereum Beacon Chain. It listens for new deposit events, sends Telegram notifications when a deposit is detected, and logs deposit details such as block number, transaction hash, fee, and public key to a JSON file.

Features
Real-time Ethereum Deposit Tracking: Monitors the Ethereum Beacon Chain for new deposits.
Telegram Notifications: Sends a notification with block details to a configured Telegram chat.
JSON Logging: Stores deposit details in a deposits.json file with the transaction hash, fee, and block number.
Auto Retry on Rate Limits: Automatically retries sending Telegram messages when rate-limited.
Gas Fee Calculation: Calculates and logs the transaction fee for each deposit.
Prerequisites
Before running this project, make sure you have the following installed:

Node.js (v12+)
npm
Alchemy API Key for Ethereum Mainnet access
Telegram Bot API Token to send notifications

Getting Started
1. Clone the Repository
   git clone https://github.com/SanjayDurai/ETH-Tracker.git
   cd ETH-Tracker
2. Install Dependencies
npm install
3. Set up Environment Variables
Create a .env file in the project root directory and add the following environment variables:
//Alchemy API URL
ALCHEMY_API_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY

//Telegram Bot Token
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_API_TOKEN

//Telegram Chat ID (Your chat or group where the bot will send messages)
TELEGRAM_CHAT_ID=YOUR_TELEGRAM_CHAT_ID

4. Run the Application
   node index.js
The application will start monitoring Ethereum deposits and send a Telegram alert for each new deposit.

## Dockerization
You can also run this project in a Docker container. To do so, follow these steps:

1. Build the Docker Image
docker build -t eth-deposit-tracker .
2. Run the Docker Container
   docker run -d --name eth-deposit-tracker -p 9000:9000 eth-deposit-tracker
3. Stopping the Container
To stop the container, use the following command:
docker stop eth-deposit-tracker

# How It Works
The script uses Web3.js to connect to the Ethereum network via Alchemy.
It continuously monitors new blocks for deposit events made to the Ethereum 2.0 deposit contract.
When a deposit is detected, it sends a notification to a specified Telegram chat with the block number, transaction hash, and deposit details.
The deposit details are also logged in a deposits.json file with additional information such as the gas fee, block timestamp, and public key.
It retries sending Telegram alerts if rate-limited and handles errors by logging them to error.log.
Configuration
Environment Variables: The .env file contains all configuration options, including the Alchemy API key and Telegram Bot details.
Block Range: The application processes a range of up to 1000 blocks in the past for deposit logs. This can be adjusted in the code.
Known Issues
Rate Limiting: If Telegram's API rate limits the bot, the message may be delayed but the script will retry.
Gas Fees: Make sure the Ethereum node (Alchemy in this case) provides accurate gas fee data for correct fee calculations.
Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an Issue on GitHub.
