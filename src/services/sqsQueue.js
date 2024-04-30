require("dotenv").config();
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const { getFileUrl } = require('./s3.js');
const User = require('./../models/User.js')

const sqsClient = new SQSClient({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

// console.log(data)

const processMessages = async () => {
  const receiveParams = {
    QueueUrl: process.env.SQS_URL,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 1,
    MessageAttributes: ["All"],
  };
  try {
    const receiveCommand = new ReceiveMessageCommand(receiveParams);
    const {Messages} = await sqsClient.send(receiveCommand);
    if (!Messages) {
      return
    }
    Messages.forEach(async (msg) => {
      const {ReceiptHandle} = msg
      const data = JSON.parse(msg.Body)
      const filePath = data.Records[0].s3.object.key
      const userID = filePath.split("/")[0];
      await User.findByIdAndUpdate(userID, {
        avatarURL: await getFileUrl(filePath)
      })
      await sqsClient.send(new DeleteMessageCommand({
        QueueUrl: process.env.SQS_URL,
        ReceiptHandle: ReceiptHandle
      }))
    })
  } catch (error) {
    console.error(error);
  }
};



module.exports = processMessages;

