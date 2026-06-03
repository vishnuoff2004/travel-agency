# End-to-End (E2E) Tests

## Overview
E2E tests simulate real user journeys across the full stack (frontend, backend, realtime). Implemented with **Cypress**.

| TEST‑ID | REQ‑ID | User Flow Description |
|---------|--------|-----------------------|
| **E2E‑001** | REQ‑001, REQ‑003, REQ‑004, REQ‑005, REQ‑009 | Traveler registers, searches a destination, creates a booking, receives realtime status updates, and views booking history. |
| **E2E‑002** | REQ‑006, REQ‑007 | Driver logs in, publishes availability, receives a booking request, accepts it, and updates status to OnTrip. |
| **E2E‑003** | REQ‑007, REQ‑008 | Agency admin logs in, views dashboard metrics, and manages driver assignments. |
| **E2E‑004** | REQ‑014, REQ‑015, REQ‑016 | System undergoes a load test with 500 concurrent searches; UI remains responsive and shows performance indicators. |
| **E2E‑005** | REQ‑017, REQ‑018 | User attempts to submit a form with invalid input; UI displays validation messages and prevents submission. |

### Sample Cypress Test (E2E‑001)
```javascript
describe('Traveler end‑to‑end flow', () => {
  it('registers, searches, books, and receives notifications', () => {
    // Registration
    cy.visit('/register');
    cy.get('[data-cy=email]').type('e2e_user@example.com');
    cy.get('[data-cy=password]').type('StrongPass1!');
    cy.get('[data-cy=role]').select('traveler');
    cy.get('[data-cy=submit]').click();
    cy.url().should('include', '/dashboard');

    // Search
    cy.get('[data-cy=search-destination]').type('Chennai');
    cy.get('[data-cy=search-date]').type('2026-07-01');
    cy.get('[data-cy=search-btn]').click();
    cy.contains('Available Drivers').should('exist');

    // Book
    cy.get('[data-cy=driver-select]').first().click();
    cy.get('[data-cy=book-btn]').click();
    cy.contains('Booking Confirmed').should('exist');

    // Notification
    cy.wait(5000); // allow socket to push update
    cy.contains('Your booking status changed to Confirmed').should('exist');
  });
});
```

---

**All E2E tests are linked to their respective REQ‑IDs and fulfill the TDD‑FIRST requirement.**
