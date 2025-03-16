## 📌 Prerequisites

Ensure you have the following installed:

- **[Node.js](https://nodejs.org/)**
- **[MySQL](https://dev.mysql.com/downloads/mysql/)** (Running locally or via Docker)
- **[npm](https://www.npmjs.com/get-npm)**

---

## ⚙️ Installation

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.sample` to `.env`
   - Update values as needed.

3. **Ensure MySQL is running**
   ```sh
   mysql -u root -p
   ```
   or using Docker:
   ```sh
   docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=yourpassword -p 3306:3306 mysql:latest
   ```
4. **Create database schema**
  - Inside MySQL prompt: CREATE DATABASE access_members;

---

## 🚀 Running the Project

Start the development server:
```sh
npm run start:dev
```

## 📡 Server URL:
- **Server:** `http://localhost:3000/graphql`

## Notes to Reviewer:
- Implemented authentication, token generation and session-caching
- Implemented Role-based access control through role and role tags i.e a person can have role User and role tag(s) Attendee and/or Organizer
- Implemented mutations to create an event, assumed event can be recurring, so an event template is created when mutating via createEvent and an event can be created from an existing template via createEventFromTemplate
- Implemented mutation to add tickets to an event, assumed tickets can have different types with different availability
- Added an entity to track history of ticket prices, to support changing ticket prices any time while keeping an audit trail for their history
- Added an entity called ticket ledger to track event tickets inventory and have a clear immutable audit trail of changes, if a person creates an order, tickets are held and therefore decreased from inventory, and an entry is added to represent that. In case an order was cancelled or not paid, tickets are returned back and another entry is added to represent that.
- Order-creation flow
  - Initiate an empty cart, which will be associated with an event and will be the only active cart, your active cart can be retrieved or abandoned.
  - Add purchase item, update a purchase item, delete a purchase item. These do not hold any tickets for now, client is free to update. Reasoning behind having 3 different mutations instead of 1 that updates them all, I don't want to replace all items with each mutation especially if it's a small change like an item's quantity, by replace I mean soft-delete all and create them again, the other solution would be to get current items and map them to the new ones and look for changes which is too complicated. 3 mutations are cleaner and each has a single responsibility. Also the reason why I'm calling it purchase item not a cart item, because it will be later associated with an order as well, not cart only. A purchase item has no specific type, it's flexible, it can be a Ticket or something else associated with an event in the future
  - Create an order by mutating via createOrder, this mutation does 2 things: it seals the cart denying any more changes to it, and creates an order. At this step we can hold tickets to the person who created the order until he makes the payment.
  - Execute payment by mutating via executePayment, this is decoupled from order module, the reason why payment has its own module, to scale efficiently to support different future payments other than orders, and it takes a reference entity i.e type and id, and the completed transaction is associated with the referenced entity
- Implemented virtual accounts or VIBANs. A virtual account can be associated with a User or with an Event
- Implemented Escrow model by transferring paid amount from user's vaccount to the event's vaccount not the event's owner/organizer. To ensure reliability for event attendees, to be able to easily cancel or refund payments, and when an event is sold out or perhaps complete, money will be transferred from the event's vaccount to the organizer's vaccount.
- Added an entity called vaccount ledger to track changes in each account and have a clear immutable audit trail of changes
- Implemented a mutation to deposit money into a user's vaccount for illustration and testing purposes only

## Shortcuts:
- In a real API, it would be better to explore a distributed system
- No email verification on registration, and no 2nd factor authentication on login (Can be implemented via Assets module which is a decoupled assets-verifying module, I can share an example I've done before if requested)
- Most database operations should be inside transactions, especially order-creation and payment, currently they are not
- No logging for now
- No unit testing
- VIBAN is not really generated now, I simply generate a random ID
- No operation-rate-limiting, e.g. limiting login to 3 failed attempts then blocking the account for some time (I can again share an example of an operation rate-limiter I made with Nest)
- No mutation to auto-cancel an order if not paid within a short timeframe (scheduled job)
- Assumed payment via vaccount only right now with a simple payment module design
- Did not depend on database migrations, depended on auto-sync to speed up
