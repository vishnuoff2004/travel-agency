const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  scan: jest.fn(),
  incr: jest.fn(),
  expire: jest.fn(),
  on: jest.fn(),
  status: 'ready',
};

jest.mock('ioredis', () => jest.fn(() => mockRedis));

jest.mock('bullmq', () => {
  const mockQueue = {
    add: jest.fn(),
    close: jest.fn(),
  };
  const mockWorker = {
    close: jest.fn(),
  };
  return {
    Queue: jest.fn(() => mockQueue),
    Worker: jest.fn(() => mockWorker),
  };
});

const mockBooking = {
  id: 1,
  status: 'Pending',
  save: jest.fn(),
};

jest.mock('../../src/models', () => ({
  Booking: {
    findByPk: jest.fn(),
  },
  BookingStatusHistory: {
    create: jest.fn(),
  },
}));

const { scheduleAutoReject, processAutoReject, QUEUE_NAME, PENDING_TIMEOUT_MS } = require('../../src/workers/autoRejectWorker');

describe('Phase 3 — Auto-Reject Worker (REQ-049)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBooking.save.mockClear();
    mockBooking.status = 'Pending';
  });

  test('scheduleAutoReject adds job with delay', async () => {
    const { autoRejectQueue } = require('../../src/workers/autoRejectWorker');
    await scheduleAutoReject(42);
    expect(autoRejectQueue.add).toHaveBeenCalledWith('reject', { bookingId: 42 }, { delay: 30 * 60 * 1000 });
  });

  test('scheduleAutoReject accepts custom delay', async () => {
    const { autoRejectQueue } = require('../../src/workers/autoRejectWorker');
    await scheduleAutoReject(7, 5000);
    expect(autoRejectQueue.add).toHaveBeenCalledWith('reject', { bookingId: 7 }, { delay: 5000 });
  });

  test('processAutoReject cancels pending booking', async () => {
    const { Booking, BookingStatusHistory } = require('../../src/models');
    Booking.findByPk.mockResolvedValue(mockBooking);

    const result = await processAutoReject({ data: { bookingId: 1 } });

    expect(mockBooking.save).toHaveBeenCalled();
    expect(mockBooking.status).toBe('Cancelled');
    expect(mockBooking.cancelReason).toBe('Auto-rejected: pending timeout');
    expect(BookingStatusHistory.create).toHaveBeenCalledWith({
      bookingId: 1,
      fromStatus: 'Pending',
      toStatus: 'Cancelled',
      changedBy: null,
      reason: 'Auto-rejected: pending timeout',
    });
    expect(result).toEqual({ rejected: true, bookingId: 1 });
  });

  test('processAutoReject skips non-pending booking', async () => {
    const { Booking } = require('../../src/models');
    mockBooking.status = 'Confirmed';
    Booking.findByPk.mockResolvedValue(mockBooking);

    const result = await processAutoReject({ data: { bookingId: 1 } });

    expect(mockBooking.save).not.toHaveBeenCalled();
    expect(result).toEqual({ skipped: true, reason: 'status=Confirmed' });
  });

  test('processAutoReject skips missing booking', async () => {
    const { Booking } = require('../../src/models');
    Booking.findByPk.mockResolvedValue(null);

    const result = await processAutoReject({ data: { bookingId: 999 } });

    expect(mockBooking.save).not.toHaveBeenCalled();
    expect(result).toEqual({ skipped: true, reason: 'not found' });
  });

  test('QUEUE_NAME is booking:auto-reject', () => {
    expect(QUEUE_NAME).toBe('booking:auto-reject');
  });

  test('PENDING_TIMEOUT_MS is 30 minutes', () => {
    expect(PENDING_TIMEOUT_MS).toBe(30 * 60 * 1000);
  });
});