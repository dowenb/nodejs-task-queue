const Queue = require('bee-queue');

const graylog2 = require('graylog2');

const LOG_HOST = process.env.LOG_HOST || localhost;

const logger = new graylog2.graylog({
    servers: [{ host: LOG_HOST, port: 12201 }]
});

let options = {
    isWorker: false,
    sendEvents: false,
    redis: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
};

if (process.env.DB_PASS) {
    redis.password = process.env.DB_PASS
};

const cookQueue = new Queue('cook', options);


const placeOrder = (order) => {
    return cookQueue.createJob(order).save();
};

cookQueue.on("succeeded", (job) => {
    // Notify the client via push notification, web socket or email etc.
    console.log(`🧾 ${job.data.qty}x ${job.data.dish} ready to be served 😋`);
    logger.info(`🧾 ${job.data.qty}x ${job.data.dish} ready to be served 😋`);
});

const getOrderStatus = (orderId) => {
    return cookQueue.getJob(orderId).then((job) => {
        return {
            progress: job.progress,
            status: job.status,
            order: job.data
        };
    });
}

module.exports = {
    placeOrder: placeOrder,
    getStatus: getOrderStatus
};