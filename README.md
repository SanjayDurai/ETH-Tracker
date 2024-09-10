#Ethereum Deposit Tracker
Overview
The Ethereum Deposit Tracker monitors and records ETH deposits on the Ethereum Beacon Chain deposit contract. The tracker fetches real-time deposit data, logs them into a file, sends notifications via Telegram, and exposes metrics for monitoring via Grafana and Prometheus.

Features
>Track deposits to the Ethereum Beacon Contract.
>Send Telegram alerts when new deposits are detected.
>Expose real-time metrics for monitoring (via Prometheus).
>Dockerized for easy deployment.

Setup and Installation
1. Clone the Repository
git clone https://github.com/your-repo/eth-deposit-tracker.git
cd eth-deposit-tracker

2. Install Dependencies
npm install

3. Create .env File
Create a .env file with the following content:
ALCHEMY_API_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id

4. Run Locally
To run the project locally:
node index.js

5. Run with Docker
To run the project using Docker:

Build the Docker image:
docker build -t eth-deposit-tracker .

Run the Docker container:
docker run -d --name eth-deposit-tracker --env-file .env -p 9000:9000 eth-deposit-tracker

Prometheus Setup
1. Run Prometheus
Ensure Prometheus is running and configured to scrape metrics from the tracker at localhost:9000/metrics.

Metrics Available
eth_deposit_count: Total number of Ethereum deposits.
eth_latest_block: The latest Ethereum block number being tracked.




