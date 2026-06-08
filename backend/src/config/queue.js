const { Queue, Worker } = require('bullmq');
const redis = require('./redis');

const defaultOptions = {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
};

function createQueue(name) {
  return new Queue(name, defaultOptions);
}

function createWorker(name, handler) {
  return new Worker(name, handler, {
    connection: redis,
    concurrency: 5,
    limiter: { max: 50, duration: 1000 },
  });
}

module.exports = { createQueue, createWorker };
