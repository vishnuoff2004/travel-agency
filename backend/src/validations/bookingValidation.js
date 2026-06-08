function validateCreateBooking(data) {
  const errors = [];

  if (!data.routeId) errors.push('Field routeId is required');
  if (!data.driverId) errors.push('Field driverId is required');

  if (data.seatCount === undefined || data.seatCount === null) {
    errors.push('Field seatCount is required');
  } else if (!Number.isInteger(data.seatCount) || data.seatCount < 1) {
    errors.push('Seat count must be at least 1');
  }

  if (!data.travelDate) {
    errors.push('Field travelDate is required');
  } else {
    const date = new Date(data.travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(date.getTime())) {
      errors.push('Invalid travelDate format');
    } else if (date < today) {
      errors.push('Travel date cannot be in the past');
    } else {
      const sixMonthsFromNow = new Date(today);
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      if (date > sixMonthsFromNow) {
        errors.push('Travel date cannot be more than 6 months in the future');
      }
    }
  }

  return errors.length > 0 ? { error: { details: errors.map(e => ({ message: e })) } } : { error: undefined };
}

module.exports = { validateCreateBooking };
