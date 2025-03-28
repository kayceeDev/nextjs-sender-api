# Paycrest Payment App

A Next.js-based payment application that enables SMEs to process USDT payments and convert them to NGN (Nigerian Naira) using the Paycrest Sender API.

## Features

- Real-time bank account validation
- Institution/Bank search functionality
- USDT to NGN conversion
- Secure payment processing
- Transaction status tracking
- Webhook integration for payment updates
- PostgreSQL database integration

## Tech Stack

- **Frontend**: Next.js 15.2, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Type Safety**: TypeScript
- **API Integration**: Paycrest Sender API

## Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database
- Paycrest API credentials
- Yarn/NPM/PNPM/Bun package manager

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
CLIENT_ID="your_paycrest_client_id"
CLIENT_SECRET="your_paycrest_client_secret"
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/paycrest-payment-app.git
cd paycrest-payment-app
```

2. Install dependencies:

``` bash
npm install
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure
```text
├── src/
│ ├── app/ # Next.js app directory
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # Shared utilities
│ └── types/ # TypeScript type definitions
├── prisma/ # Database schema and migrations
└── public/ # Static assets
```


## API Endpoints

- `POST /api/initiate-order` - Create a new payment order
- `POST /api/verify-account` - Validate bank account details
- `GET /api/institutions` - Fetch available banking institutions
- `POST /api/webhook` - Handle payment status updates
- `GET /api/transactions/[id]` - Get transaction status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Paycrest API](https://paycrest.io) for payment processing
- [Next.js](https://nextjs.org) for the application framework
- [Prisma](https://prisma.io) for database ORM