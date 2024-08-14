# Order Management System API

## Description

This API is designed for managing orders in a system with support for real-time updates using Phoenix Channels. It includes functionalities for creating orders, verifying payments, and calculating order values.

## Features

- **Order Management**: Create and update orders with customer and payment details.
- **Payment Verification**: Verify payment status based on card number.
- **Real-Time Updates**: Use Phoenix Channels to get real-time updates on order values.
- **Error Handling**: Custom error responses for validation and payment failures.

## Technologies Used

- **Elixir**: Functional programming language for concurrent and fault-tolerant applications.
- **Phoenix**: Web framework for building scalable and maintainable applications.
- **Ecto**: Database wrapper and query generator for Elixir.
- **Money**: Library for handling currency and monetary calculations.

## Getting Started

### Prerequisites

- **Elixir**: Ensure Elixir is installed. Follow the instructions at [elixir-lang.org](https://elixir-lang.org/install.html).
- **PostgreSQL**: The default database used by this application. Ensure PostgreSQL is installed and running.

### Installation

```bash
git clone git@github.com:anadubas/checkout.git
cd checkout/api
mix deps.get
mix ecto.create
mix ecto.migrate
```

### Running 

To start the development server, run:

```bash
mix phx.server
```

The application will be available at **http://localhost:4000**


### Testing

To run the test suite, use:

```bash
mix test
```

### Routes

[POST] http://localhost:4000/api/orders

Create a new order. Requires customer details, payment information, and number of bags.

request body:
```json
{
  "order": {
    "customer_name": "John Doe",
    "customer_email": "john.doe@example.com",
    "card_number": "1234567890123456",
    "bags": 5,
    "value": "590"
  }
}
```

### Payment Verification Logic

The payment verification for the card number follows specific rules based on the last digit of the card number:

**Payment Success**: If the card number ends with any of the digits [5, 6, 7, 8, 9], the payment is considered successful.
**Payment Error**: If the card number ends with any of the digits [0, 1, 2, 3, 4], the payment will fail.

### WebSocket Configuration

The application uses a Phoenix Channel for real-time updates:

- Channel: order:lobby 
- Event: updateBags
- Response: Returns the order value based on the number of bags.