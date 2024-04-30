const cron = require('node-cron');
const processMessages = require('./sqsQueue.js')

cron.schedule('*/5 * * * * *', async () => {
    processMessages()
});