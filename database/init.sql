CREATE DATABASE IF NOT EXISTS travel_agency;
USE travel_agency;

ALTER TABLE routes ADD INDEX idx_routes_source_destination (source, destination);
ALTER TABLE routes ADD INDEX idx_routes_driver_id (driverId);
ALTER TABLE bookings ADD INDEX idx_bookings_user_status_date (userId, status, travelDate);
ALTER TABLE bookings ADD INDEX idx_bookings_driver_status_date (driverId, status, travelDate);
ALTER TABLE booking_status_histories ADD INDEX idx_booking_status_history_booking (bookingId);
ALTER TABLE users ADD UNIQUE INDEX idx_users_email (email);
ALTER TABLE drivers ADD UNIQUE INDEX idx_drivers_vehicle_reg (vehicleReg);
ALTER TABLE drivers ADD UNIQUE INDEX idx_drivers_user_id (userId);

-- Phase 2: notifications table is created via Sequelize model
-- Indexes are defined in the model definition
