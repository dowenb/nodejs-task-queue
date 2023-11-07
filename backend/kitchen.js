const Queue = require('bee-queue');

const graylog2 = require('graylog2');

const LOG_HOST = process.env.LOG_HOST || localhost;

const logger = new graylog2.graylog({
    servers: [{ host: LOG_HOST, port: 12201 }]
});

let options = {
    redis: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
};

if (process.env.DB_PASS) {
    redis.password = process.env.DB_PASS
};

const cookQueue = new Queue('cook', options);

cookQueue.process(3, (job, done) => {
    let qty = job.data.qty;
    let cooked = 0;

    setTimeout(() => console.log("Getting the ingredients ready 🥬 🧄 🧅 🍄"), 1000);
    setTimeout(() => {
        console.log(`🍳 Preparing ${job.data.dish}`);
        logger.info(`🍳 Preparing ${job.data.dish}`);
        job.reportProgress(10);
    }, 1500);

    let timer = setInterval(() => {
        if (cooked < qty) {
            cooked++;
            console.log(`🍳 Progress: ${cooked}/${qty} ${job.data.dish}`);
            logger.info(`🍳 Progress: ${cooked}/${qty} ${job.data.dish}`);
            job.reportProgress(((cooked / qty) * 90) + 10);
        } else {
            clearInterval(timer);
            console.log(`🧾 Order ${job.id}: ${job.data.dish} ready`);
            logger.info(`🧾 Order ${job.id}: ${job.data.dish} ready`);
            job.reportProgress(100);
            done();
        }
    }, 4000);
});