require('dotenv').config()
const {S3Client, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); 

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
    region: process.env.AWS_REGION,
});

const getPresignedURL = async (userId, fileName) => {
    const filePath = userId + '/' + fileName
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: filePath,
        ContentType: "image/jpeg",
        ACL: 'public-read',
    })
    return await getSignedUrl(s3, command, {expiresIn: 3600})
}

const getFileUrl = async (filePath) => {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: filePath
    })
    return await getSignedUrl(s3, command)
}

module.exports = {getPresignedURL, getFileUrl}