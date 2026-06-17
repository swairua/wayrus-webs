# Development Setup

## Local Development (No Node.js Server Needed!)

This project uses a React frontend with a PHP backend. Here's how to run it locally:

### Prerequisites

- Node.js and npm (for the React app)
- PHP 7.4+ with built-in server support

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start PHP Development Server (Terminal 1)

```bash
php -S localhost:8000
```

This starts a local PHP server on port 8000 that will serve the `api.php` file.

### Step 3: Start Vite Development Server (Terminal 2)

```bash
npm run dev
```

This starts the Vite dev server on port 8080 with a proxy configured to forward `/api/*` requests to the PHP server.

### How It Works

- **Frontend**: React app served by Vite on `http://localhost:8080`
- **Backend**: PHP API served by PHP's built-in server on `http://localhost:8000`
- **Proxy**: Vite automatically forwards all `/api/*` requests to the PHP server

### Accessing the App

Open your browser to: `http://localhost:8080`

## Database Setup

Before logging in, make sure your database credentials are set in `.env`:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
```

The `api.php` will automatically create all necessary tables on first run.

### Default Admin Account

If no users exist, you can use:

- Email: `gichukisimon@gmail.com`
- Password: `Sirgeorge.12`

## Production Deployment

For Apache deployment:

1. Upload all files to your web server
2. Upload `api.php` to the root directory
3. Ensure `.htaccess` is in the same directory (includes rewrite rules)
4. Set database credentials in `.env`
5. Build the frontend:
   ```bash
   npm run build
   ```
6. Upload the `dist/` folder contents to your web root

The `.htaccess` file includes rewrite rules that:

- Route all `/api/*` requests to `api.php`
- Serve the React SPA for all non-API routes
- Enable gzip compression
- Set proper caching headers

## Troubleshooting

### 404 on `/api/*` endpoints during development

Make sure both servers are running:

1. PHP server on port 8000
2. Vite dev server on port 8080

### CORS errors

The `api.php` file includes CORS headers that allow requests from any origin. During development, this should work fine locally.

### Database connection errors

Check your `.env` file has correct database credentials and the database server is running.
