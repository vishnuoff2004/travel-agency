File: /project-prompts/TESTS/REQUIREMENT_TEST_MAP.md

# Requirement Test Map — Travel Agency Services Platform

---

## REQ-001 — User Registration

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-001  | Register with valid data           | Unit          |
| TEST-002  | Register with duplicate email      | Unit          |
| TEST-003  | Register with weak password        | Unit          |
| TEST-004  | Register with missing required fields | Unit       |
| TEST-130  | Full traveler registration & login    | E2E        |
| TEST-149  | Password strength enforcement         | E2E        |
| TEST-159  | Complete E2E: Register → Book → Trip  | E2E        |

## REQ-002 — User Login

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-005  | Login with valid credentials       | Integration   |
| TEST-006  | Login with incorrect password      | Integration   |
| TEST-007  | Login with non-existent email      | Integration   |
| TEST-008  | Account lockout after 5 failures   | Integration   |
| TEST-130  | Full traveler registration & login | E2E           |
| TEST-159  | Complete E2E: Register → Book → Trip | E2E         |

## REQ-003 — JWT Authentication

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-009  | Access with valid JWT              | Integration   |
| TEST-010  | Access with expired JWT            | Integration   |
| TEST-011  | Access with malformed JWT          | Integration   |
| TEST-012  | Access without JWT                 | Integration   |
| TEST-130  | Full traveler registration & login | E2E           |

## REQ-004 — Role-Based Access Control

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-013  | Traveler accesses own endpoints    | Integration   |
| TEST-014  | Traveler accesses admin endpoint   | Integration   |
| TEST-015  | Driver accesses driver endpoint    | Integration   |
| TEST-016  | Admin accesses all endpoints       | Integration   |

## REQ-005 — Profile Management

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-017  | Update profile with valid data     | Integration   |
| TEST-018  | Update profile with invalid phone  | Integration   |
| TEST-019  | Update email without re-auth       | Integration   |

## REQ-006 — Destination Search

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-020  | Search existing route              | Integration   |
| TEST-021  | Search with partial text           | Integration   |
| TEST-022  | Search non-existent route          | Integration   |
| TEST-023  | Search response time under 2s      | E2E           |
| TEST-131  | Full traveler search and book flow | E2E           |
| TEST-143  | Search with special characters     | E2E           |
| TEST-158  | Unauthenticated route search       | E2E           |
| TEST-159  | Complete E2E: Register → Book → Trip | E2E         |

## REQ-007 — View Agencies and Drivers from Search

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-024  | Search returns agencies and drivers| Integration   |
| TEST-025  | Search result contains all fields  | Integration   |
| TEST-026  | Fare displayed in correct format   | E2E           |
| TEST-131  | Full traveler search and book flow | E2E           |
| TEST-132  | Traveler booking life cycle        | E2E           |
| TEST-155  | Invalid fare format                | E2E           |
| TEST-159  | Complete E2E: Register → Book → Trip | E2E         |

## REQ-008 — Create Booking

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-027  | Create booking with valid data     | Integration   |
| TEST-028  | Create booking with excess seats   | Unit          |
| TEST-029  | Create duplicate booking           | Integration   |
| TEST-030  | Create booking with past date      | Unit          |
| TEST-031  | Create booking as unauthenticated  | Integration   |
| TEST-131  | Full traveler search and book flow | E2E           |
| TEST-132  | Traveler booking life cycle        | E2E           |
| TEST-159  | Complete E2E: Register → Book → Trip | E2E         |

## REQ-009 — Booking History

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-032  | View booking history               | Integration   |
| TEST-033  | Booking history pagination         | Integration   |
| TEST-034  | Booking history empty state        | Integration   |
| TEST-132  | Traveler booking life cycle        | E2E           |
| TEST-133  | Traveler with no bookings          | E2E           |
| TEST-156  | Booking history order              | E2E           |

## REQ-010 — Booking Tracking

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-035  | Track valid status transition      | Unit          |
| TEST-036  | Track invalid status transition    | Unit          |
| TEST-037  | Track status with timestamp        | Integration   |
| TEST-038  | Track non-existent booking         | Integration   |
| TEST-162  | Full valid status transition chain | Unit          |
| TEST-132  | Traveler booking life cycle        | E2E           |
| TEST-159  | Complete E2E: Register → Book → Trip | E2E         |

## REQ-011 — Booking Cancellation

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-039  | Cancel pending booking             | Integration   |
| TEST-040  | Cancel confirmed booking           | Integration   |
| TEST-041  | Cancel completed booking           | Integration   |
| TEST-042  | Cancel already cancelled booking   | Integration   |
| TEST-163  | Cancel after status Cancelled      | Unit          |
| TEST-132  | Traveler booking life cycle        | E2E           |

## REQ-012 — Driver Profile Management

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-043  | Create driver profile              | Integration   |
| TEST-044  | Update driver profile              | Integration   |
| TEST-045  | Create duplicate vehicle reg       | Unit          |
| TEST-046  | Create profile with missing fields | Unit          |
| TEST-134  | Full driver registration & route   | E2E           |
| TEST-159  | Complete E2E: Register → Book → Trip | E2E         |

## REQ-013 — Route Creation by Driver

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-047  | Create route with valid data       | Integration   |
| TEST-048  | Create route same source/dest      | Unit          |
| TEST-049  | Create route with past departure   | Unit          |
| TEST-050  | Create route arrival before departure | Unit       |
| TEST-134  | Full driver registration & route      | E2E        |
| TEST-159  | Complete E2E: Register → Book → Trip  | E2E        |

## REQ-014 — Availability Management

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-051  | Mark route unavailable             | Integration   |
| TEST-052  | Mark route available               | Integration   |
| TEST-053  | Booking on unavailable route       | Integration   |
| TEST-135  | Driver availability & booking mgmt | E2E           |

## REQ-015 — Accept or Reject Bookings

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-054  | Accept pending booking             | Integration   |
| TEST-055  | Reject pending booking             | Integration   |
| TEST-056  | Accept already confirmed booking   | Integration   |
| TEST-057  | Auto-reject after 30 minutes       | Unit          |
| TEST-058  | Accept booking from another driver | Integration   |
| TEST-135  | Driver availability & booking mgmt | E2E           |
| TEST-136  | Driver rejects booking             | E2E           |
| TEST-157  | Status update by non-owner driver  | E2E           |
| TEST-159  | Complete E2E: Register → Book → Trip | E2E         |

## REQ-016 — Trip Status Update

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-059  | Update to On Trip from Confirmed   | Integration   |
| TEST-060  | Update to Completed from On Trip   | Integration   |
| TEST-061  | Update to On Trip from Pending     | Unit          |
| TEST-062  | Update to Completed from Confirmed | Unit          |
| TEST-135  | Driver availability & booking mgmt | E2E           |
| TEST-159  | Complete E2E: Register → Book → Trip | E2E         |

## REQ-017 — Agency Driver Management

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-063  | Add driver to agency               | Integration   |
| TEST-064  | Remove driver from agency          | Integration   |
| TEST-065  | Add driver already in another agency | Unit        |
| TEST-066  | Remove driver with active bookings | Integration   |
| TEST-138  | Full agency management flow        | E2E           |
| TEST-139  | Remove driver with no bookings     | E2E           |
| TEST-140  | Remove driver with active bookings | E2E           |
| TEST-153  | Maximum driver per agency listing  | E2E           |
| TEST-161  | Agency manages drivers & bookings  | E2E           |

## REQ-018 — Agency Booking Monitoring

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-067  | View agency bookings               | Integration   |
| TEST-068  | Filter bookings by status          | Integration   |
| TEST-069  | Filter bookings by date range      | Integration   |
| TEST-138  | Full agency management flow        | E2E           |
| TEST-161  | Agency manages drivers & bookings  | E2E           |

## REQ-019 — Admin User Management

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-070  | Admin views all users              | Integration   |
| TEST-071  | Admin deactivates user             | Integration   |
| TEST-072  | Deactivated user login attempt     | Integration   |
| TEST-073  | Non-admin attempts user management | Integration   |
| TEST-141  | Full admin management flow         | E2E           |
| TEST-150  | Deactivated user cannot login      | E2E           |
| TEST-160  | Admin manages agencies & bookings  | E2E           |

## REQ-020 — Admin Agency Management

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-074  | Admin creates agency               | Integration   |
| TEST-075  | Admin deactivates agency           | Integration   |
| TEST-076  | Search after agency deactivation   | Integration   |
| TEST-077  | Non-admin creates agency           | Integration   |
| TEST-141  | Full admin management flow         | E2E           |
| TEST-160  | Admin manages agencies & bookings  | E2E           |

## REQ-021 — Admin Booking Oversight

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-078  | Admin cancels any booking          | Integration   |
| TEST-079  | Admin views all bookings           | Integration   |
| TEST-080  | Admin cancel logs admin ID         | Integration   |
| TEST-141  | Full admin management flow         | E2E           |
| TEST-154  | Admin cancellation audit log       | E2E           |
| TEST-160  | Admin manages agencies & bookings  | E2E           |

## REQ-022 — User Dashboard

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-081  | Dashboard shows active bookings    | Integration   |
| TEST-082  | Dashboard shows upcoming trips     | Integration   |

## REQ-023 — Driver Dashboard

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-083  | Dashboard shows pending requests   | Integration   |
| TEST-084  | Dashboard availability toggle      | Integration   |
| TEST-137  | Driver views dashboard             | E2E           |

## REQ-024 — Admin Dashboard

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-085  | Dashboard shows counts             | Integration   |
| TEST-086  | Dashboard shows status breakdown   | Integration   |
| TEST-142  | Admin dashboard                    | E2E           |
| TEST-160  | Admin manages agencies & bookings  | E2E           |

## REQ-025 — Form Validation

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-087  | Required field validation          | Unit          |
| TEST-088  | Email format validation            | Unit          |
| TEST-089  | Password rule validation           | Unit          |
| TEST-090  | Phone number format validation     | Unit          |

## REQ-026 — Loading States

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-091  | Loading indicator on API call      | E2E           |
| TEST-092  | Skeleton loader on slow API        | E2E           |
| TEST-093  | Error notification on failed API   | E2E           |

## REQ-027 — Success and Error Notifications

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-094  | Success notification on create     | E2E           |
| TEST-095  | Error notification on failure      | E2E           |
| TEST-096  | Notification auto-dismissal        | E2E           |

## REQ-028 — Session Protection

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-097  | Session expires after inactivity   | E2E           |
| TEST-098  | Redirect to login on expiry        | E2E           |
| TEST-099  | Form data preserved on timeout     | E2E           |

## REQ-029 — API Response Time

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-100  | All APIs respond within 2 seconds  | E2E           |
| TEST-101  | Search API responds within 1 sec   | E2E           |

## REQ-030 — Concurrent User Support

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-102  | 1000 concurrent search requests    | E2E           |
| TEST-103  | 1000 concurrent booking requests   | E2E           |

## REQ-031 — Database Query Performance

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-104  | Query execution under 500ms        | Unit          |

## REQ-032 — Password Security

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-105  | Password hashed with bcrypt        | Unit          |
| TEST-106  | Password not in API response       | Integration   |
| TEST-149  | Password strength enforcement      | E2E           |

## REQ-033 — Data Consistency

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-107  | Atomic status transition           | Unit          |
| TEST-108  | Concurrent status update conflict  | Unit          |

## REQ-034 — Modular Architecture

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-109  | Backend deployable independently   | E2E           |

## REQ-035 — Technology Stack

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-110  | Tech stack verification            | E2E           |

## REQ-036 — Browser Support

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-111  | Cross-browser rendering            | E2E           |

## REQ-037 — API Format

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-112  | API response format compliance     | Integration   |

## REQ-038 — Empty Search Results

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-113  | Empty results returns 200          | Integration   |
| TEST-114  | Empty results contains message     | Integration   |
| TEST-143  | Search with special characters     | E2E           |

## REQ-039 — Maximum Booking Capacity

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-115  | Booking exceeds vehicle capacity   | Unit          |
| TEST-116  | Booking with zero seats            | Unit          |
| TEST-117  | Booking with negative seats        | Unit          |
| TEST-144  | Booking with maximum seats         | E2E           |

## REQ-040 — Simultaneous Booking Conflicts

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-118  | Last seat concurrent booking       | Unit          |
| TEST-119  | Second booking gets 409            | Integration   |
| TEST-145  | Simultaneous last seat booking     | E2E           |

## REQ-041 — Past Date Booking

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-120  | Booking with past date             | Unit          |
| TEST-121  | Booking beyond 6 months            | Unit          |
| TEST-122  | Booking on today's date            | Unit          |
| TEST-146  | Booking on date 6 months from now  | E2E           |

## REQ-042 — Driver Auto-Unavailability

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-123  | Driver auto-unavailable on trip    | Unit          |
| TEST-124  | Driver available after trip ends   | Integration   |
| TEST-147  | Driver auto-unavailability during trip | E2E       |

## REQ-043 — Orphaned Bookings

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-125  | Pending booking cancelled on removal | Unit        |
| TEST-126  | Confirmed booking preserved on removal | Integration |
| TEST-152  | Orphan booking handling on driver removal | E2E     |

## REQ-044 — Account Deactivation Impact

| Test ID   | Test Name                          | Type          |
|-----------|------------------------------------|---------------|
| TEST-127  | Agency deactivation cancels pending | Integration |
| TEST-128  | Agency deactivation preserves active | Integration |
| TEST-129  | Search excludes deactivated agency | Integration   |
| TEST-148  | Deactivated agency removal from search | E2E      |
| TEST-151  | Agency deactivation cascades to drivers | E2E     |
