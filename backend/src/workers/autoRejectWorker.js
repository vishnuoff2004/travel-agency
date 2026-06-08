const { createQueue, createWorker } = require('../config/queue');
const { Booking, BookingStatusHistory } = require('../models');

const QUEUE_NAME = 'booking:auto-reject';
const PENDING_TIMEOUT_MS = 30 * 60 * 1000;

const autoRejectQueue = createQueue(QUEUE_NAME);

async function scheduleAutoReject(bookingId, delay = PENDING_TIMEOUT_MS) {
  await autoRejectQueue.add(
    'reject',
    { bookingId },
    { delay },
  );
}

async function processAutoReject(job) {
  const { bookingId } = job.data;
  const booking = await Booking.findByPk(bookingId);
  if (!booking || booking.status !== 'Pending') {
    return { skipped: true, reason: booking ? `status=${booking.status}` : 'not found' };
  }

  booking.status = 'Cancelled';
  booking.cancelReason = 'Auto-rejected: pending timeout';
  await booking.save();

  await BookingStatusHistory.create({
    bookingId,
    fromStatus: 'Pending',
    toStatus: 'Cancelled',
    changedBy: null,
    reason: 'Auto-rejected: pending timeout',
  });

  return { rejected: true, bookingId };
}

const worker = createWorker(QUEUE_NAME, processAutoReject);

module.exports = { scheduleAutoReject, processAutoReject, worker, autoRejectQueue, QUEUE_NAME, PENDING_TIMEOUT_MS };