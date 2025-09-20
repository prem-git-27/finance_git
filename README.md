# Finance Management Web Application

A comprehensive finance management application built with React.js frontend and Node.js backend, connected to a PostgreSQL database via Supabase.

## Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Dashboard**: Overview of account balances, recent transactions, and visual charts
- **Transaction Management**: Add, edit, delete, and categorize income and expenses
- **Budgeting Tools**: Set spending limits and track budget progress
- **Financial Reports**: Generate monthly and yearly financial summaries
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Data**: Live updates with database synchronization

## Tech Stack

### Frontend
- **React.js** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Relational database
- **Supabase** - Backend-as-a-Service platform
- **Row Level Security** - Database-level security policies

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and keys
   - Run the SQL schema from `database/schema.sql` in the Supabase SQL editor

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately
   npm run dev          # Frontend only
   npm run dev:server   # Backend only
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **categories** - Predefined income and expense categories
- **accounts** - Bank accounts, credit cards, etc.
- **transactions** - Income and expense records
- **budgets** - Spending limits and budget tracking

See `database/schema.sql` for the complete schema definition.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories

### Budgets
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create new budget

### Accounts
- `GET /api/accounts` - Get user accounts

### Reports
- `POST /api/reports/generate` - Generate financial report

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Row Level Security** - Database-level access control
- **Input Validation** - Server-side data validation
- **CORS Protection** - Controlled cross-origin requests

## Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:
```bash
npm run build
```

### Backend Deployment
Deploy the Node.js backend to services like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

### Database
The PostgreSQL database is hosted on Supabase, which provides:
- Automatic backups
- Real-time subscriptions
- Built-in authentication
- Row Level Security

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@financeapp.com or create an issue in the GitHub repository.