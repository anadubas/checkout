# Checkout

## Description

The Checkout consists of a frontend React application and a backend Elixir/Phoenix API. The system allows users to create and manage orders, verify payments, and get real-time updates on order values.

### Frontend (React)

The React application provides a user interface for creating orders, displaying real-time updates, and handling user interactions.

### Backend (Elixir/Phoenix)

The Elixir/Phoenix backend provides API endpoints for managing orders, verifying payments, and calculates order values. It also uses Phoenix Channels for real-time updates.

## Features

- **Frontend**:
  - Form for creating and managing orders.
  - Real-time updates for order value based on the number of bags.
  - Error handling and user notifications.

- **Backend**:
  - REST API for order creation and management.
  - Payment verification and order value calculation.
  - Real-time updates via Phoenix Channels.
  - Custom error handling for API responses.

## Technologies Used

- **Frontend**:
  - React
  - Axios (for API requests)
  - Material-UI (for UI components)

- **Backend**:
  - Elixir
  - Phoenix Framework
  - Ecto (for database interactions)
  - Phoenix Channels (for real-time updates)
  - Money (for monetary calculations)

## Getting Started

### Prerequisites

- **Elixir**: Ensure Elixir is installed. Follow the instructions at [elixir-lang.org](https://elixir-lang.org/install.html).
- **Phoenix**: Follow the instructions at [phoenixframework.org](https://www.phoenixframework.org).
- **Node.js**: Ensure Node.js is installed for the React frontend. Follow the instructions at [nodejs.org](https://nodejs.org/en/download/).
- **PostgreSQL**: The default database used by the backend. Ensure PostgreSQL is installed and running.

There is a .tool-versions file to ensure the install of the corrects versions.

### Installation


```bash
git clone git@github.com:anadubas/checkout.git
cd checkout
asdf install
```

## Notes

Each project have its own README file.