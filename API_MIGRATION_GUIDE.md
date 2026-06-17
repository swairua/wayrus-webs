# API Migration Guide

This document outlines the migration from Express-based API to PHP-based API at `https://wayrus.co.ke/api.php`.

## What Has Been Updated

### ✅ Authentication System (PHP API)

The following authentication flows now use the PHP API:

- **Login**: `/api/admin/login` → `POST https://wayrus.co.ke/api.php?action=login`
- **Logout**: `/api/admin/logout` → `POST https://wayrus.co.ke/api.php?action=logout`
- **Auth Check**: `/api/admin/me` → `POST https://wayrus.co.ke/api.php?action=check_auth`

**Updated Files:**

- `client/pages/AdminLogin.tsx`
- `client/components/layout/Header.tsx`
- `client/components/layout/Footer.tsx`
- `client/components/layout/AdminSidebar.tsx`
- `client/hooks/use-admin.ts`

### ✅ Leads Management (PHP API)

The Leads API has been updated to use the new endpoint:

- **Create Lead**: `POST https://wayrus.co.ke/api.php?action=create&table=leads`
- **Read Leads**: `GET https://wayrus.co.ke/api.php?action=read&table=leads`
- **Update Lead**: `POST https://wayrus.co.ke/api.php?action=update&table=leads`
- **Delete Lead**: `POST https://wayrus.co.ke/api.php?action=delete&table=leads`

**Updated File:**

- `client/lib/api/leads.ts`

### ✅ Configuration

New centralized API configuration file:

- `client/lib/config/api.ts` - Contains `API_BASE_URL = "https://wayrus.co.ke/api.php"`

## Deployment Instructions

### 1. Upload PHP API File

1. Download `api.php` from the root of this repository
2. Upload it to your wayrus.co.ke web hosting (cPanel file manager or FTP)
3. Place it in the public root directory (accessible at `https://wayrus.co.ke/api.php`)

### 2. Database Configuration

Ensure the following environment variables are set on your server (or use the defaults in the code):

```
DB_HOST = localhost
DB_USER = wayrusc1_webuser
DB_PASS = Sirgeorge.12
DB_NAME = wayrusc1_webdb
UPLOAD_DIR = /home/wayrusc1/public_html/uploads/screenshots/
```

### 3. Database Tables

The PHP API expects the following tables to exist:

- `users` - Admin users (for authentication)
- `leads` - Lead records
- `contacts` - Contact form submissions
- `portfolios` - Portfolio items
- `quotations` - Quotation requests
- Any other tables your app uses

### 4. Deploy Frontend

Run the standard deployment process:

```bash
npm run build
# Push to Netlify or your hosting provider
```

## What Still Uses Express Backend

The following complex operations still use the Express/Netlify backend:

- **Chat API** (`/api/chat`) - AI chat functionality
- **Scraping** (`/api/scrape`, `/api/opportunities`) - Web scraping
- **Logs** (`/api/logs`) - Application logging
- **Discovery Leads** (`/api/discovery-leads/*`) - Lead discovery features
- **Web Leads** (`/api/web-leads/*`) - Web app lead tracking
- **User Management** (`/api/admin/users`) - Complex user operations

These can be gradually migrated to PHP if needed, or kept in Express for complex business logic.

## PHP API Endpoints Reference

### Authentication Endpoints

```bash
# Login
POST https://wayrus.co.ke/api.php
action=login
email=user@example.com
password=password

# Logout
POST https://wayrus.co.ke/api.php
action=logout

# Check Authentication
POST https://wayrus.co.ke/api.php
action=check_auth
```

### CRUD Endpoints

```bash
# Create
POST https://wayrus.co.ke/api.php
action=create
table=leads
data[business_name]=My Business
data[email]=info@example.com

# Read
GET https://wayrus.co.ke/api.php?action=read&table=leads&order_by=ORDER BY created_at DESC

# Update
POST https://wayrus.co.ke/api.php
action=update
table=leads
where[id]=1
data[status]=contacted

# Delete
POST https://wayrus.co.ke/api.php
action=delete
table=leads
where[id]=1
```

### Database Table Management

```bash
# Create Table
POST https://wayrus.co.ke/api.php
action=create_table
table=my_table
schema=id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), created_at TIMESTAMP

# Drop Table
POST https://wayrus.co.ke/api.php
action=drop_table
table=my_table
```

## CORS Configuration

The PHP API includes CORS headers to allow cross-origin requests:

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
```

## Migration Checklist

- [ ] Upload `api.php` to `https://wayrus.co.ke/`
- [ ] Verify database credentials in `api.php`
- [ ] Test authentication endpoints:
  - [ ] Login works
  - [ ] Logout works
  - [ ] Auth check works
- [ ] Test lead operations (create, read, update, delete)
- [ ] Verify CORS headers are working
- [ ] Test the full application in production
- [ ] Monitor error logs for any issues

## Troubleshooting

### 404 Errors

- Ensure `api.php` is uploaded to the correct location
- Check URL: should be `https://wayrus.co.ke/api.php` (not in subdirectory)

### Database Connection Errors

- Verify database credentials in `api.php`
- Check that the database server is accessible
- Ensure required tables exist

### CORS Errors

- Check browser console for CORS errors
- Verify `api.php` includes proper CORS headers
- The API allows all origins (`*`) by default

### Authentication Issues

- Ensure the `users` table exists with proper schema
- Check that user records exist in the database
- Verify password hashing matches the login logic

## Future Improvements

1. Add proper password hashing (bcrypt instead of md5)
2. Implement JWT tokens for stateless authentication
3. Add request validation and sanitization
4. Implement rate limiting
5. Add audit logging
6. Migrate remaining Express endpoints to PHP API
7. Add API key authentication for admin operations

## Support

For issues with the PHP API deployment, check:

1. Server error logs (usually in `/home/wayrusc1/public_html/error_log`)
2. Browser console for frontend errors
3. Network tab in DevTools to inspect API responses
