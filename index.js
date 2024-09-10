require('dotenv').config(); //Modules
const Web3 = require('web3');
const fs = require('fs');
const axios = require('axios');
const express = require('express');
const app = express();

//web3 with Alchemy
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ALCHEMY_API_URL, {
    keepAlive: true,
    timeout: 20000,
    headers: [{ name: 'Retry-After', value: '5000' }]
}));

//given Ethereum Deposit Contract Address
const beaconDepositContractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';


//Telegram Notification 
const sendTelegramMessage = async (message, retryCount = 0) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = {
        chat_id: chatId,
        text: message
    };

    try {
        await axios.get(url, { params });
        console.log('Alert sent to Telegram!');
    } catch (error) {
        if (error.response && error.response.status === 429 && retryCount < 5) {
            const retryAfter = error.response.data.parameters.retry_after || 5;
            console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return sendTelegramMessage(message, retryCount + 1);
        } else {
            console.error('Error sending Telegram message:', error);
        }
    }
};


//Error logging 
const logError = (error) => {
    const errorMessage = `[${new Date().toISOString()}] ERROR: ${error.message}\n`;
    fs.appendFileSync('error.log', errorMessage);
};


//saving deposit logs in JSON
const saveDeposits = async (logs) => {
    const data = await Promise.all(logs.map(async log => {
        const block = await web3.eth.getBlock(log.blockNumber);
        const transaction = await web3.eth.getTransaction(log.transactionHash);
        const receipt = await web3.eth.getTransactionReceipt(log.transactionHash);

        const fee = web3.utils.fromWei(
            (transaction.gasPrice * receipt.gasUsed).toString(),
            'ether'
        );

        const pubkey = transaction.to;

        return {
            blockNumber: log.blockNumber,
            blockTimestamp: new Date(block.timestamp * 1000).toISOString(),
            fee: fee,
            hash: log.transactionHash,
            pubkey: pubkey
        };
    }));

    let deposits = [];
    if (fs.existsSync('deposits.json')) {
        const fileData = fs.readFileSync('deposits.json', 'utf-8');
        deposits = JSON.parse(fileData);
    }

    deposits.push(...data);
    fs.writeFileSync('deposits.json', JSON.stringify(deposits, null, 2), 'utf-8');
};


//tracking deposits
let lastProcessedBlock = null;

const trackDeposits = async () => {
    try {
        const latestBlock = await web3.eth.getBlockNumber();
        const fromBlock = lastProcessedBlock ? lastProcessedBlock + 1 : latestBlock - 1000;

        const logs = await web3.eth.getPastLogs({
            address: beaconDepositContractAddress,
            fromBlock: fromBlock,
            toBlock: 'latest'
        });

        if (logs.length > 0) {
            for (const log of logs) {
                const message = `New Deposit: Block ${log.blockNumber}, Tx: ${log.transactionHash}`;
                sendTelegramMessage(message);
                await saveDeposits([log]);
            }

            lastProcessedBlock = logs[logs.length - 1].blockNumber;
        } else {
            console.log("No new deposit events found.");
        }
    } catch (error) {
        console.error('Error tracking deposits:', error);
        logError(error);
    }
};

//interval time 5mins to keep looking into ethereum Blockchain
setInterval(trackDeposits, 300000); 
