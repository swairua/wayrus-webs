# Deployment Ready - wayrus.co.ke

Your application is now prepared for production deployment to `https://wayrus.co.ke`.

## Configuration Summary

### Development (`.env`)

```
API_CONNECTION_URL=https://wayrus.co.ke/api.php
NODE_ENV=development
```

- Uses remote API for development testing
- Allows testing against production database

### Production (`.env.production`)

```
API_CONNECTION_URL=https://wayrus.co.ke/api.php
NODE_ENV=production
```

- Production-ready environment variables
- Used during build and deployment

## Build Process

The build is configured to automatically copy `api.php` to the `dist/` folder:

```bash
pnpm build
# OR
npm run build
```

This will:

1. Build React frontend to `dist/`
2. Copy `api.php` to `dist/api.php` for root access

## Deployment Steps

### 1. Build Locally

```bash
pnpm install
pnpm build
```

### 2. Upload to wayrus.co.ke

**Via SFTP:**

```bash
sftp user@wayrus.co.ke

# Navigate to web root
cd public_html

# Backup current version (recommended)
mkdir backup_$(date +%Y%m%d)
cp -r * backup_$(date +%Y%m%d)/

# Clear old files
rm -rf *

# Upload new files
cd /path/to/local/repo
put -r dist/* ./
put .htaccess ./

bye
```

**Via cPanel File Manager:**

1. Log into cPanel → File Manager
2. Navigate to `public_html/`
3. Delete all old files
4. Upload contents of `dist/` folder
5. Upload `.htaccess` file
6. Set permissions: 644 for files, 755 for directories

### 3. Server Configuration

Ensure these files exist on wayrus.co.ke:

- `/home/wayrusc1/public_html/index.html` - React SPA entry point
- `/home/wayrusc1/public_html/api.php` - Local API handler
- `/home/wayrusc1/public_html/.htaccess` - Apache configuration
- `/home/wayrusc1/public_html/assets/` - JavaScript, CSS files

### 4. Verify Deployment

**1. Check if app loads:**

```
https://wayrus.co.ke/
```

**2. Check admin login:**

```
https://wayrus.co.ke/admin/login
```

**3. Check API connectivity:**

- Go to Admin → Users
- If users load, API is working

**4. Check browser console:**

- Press F12 to open Developer Tools
- Check Console tab - should show no errors
- Check Network tab - API calls should go to `/api.php` or `https://wayrus.co.ke/api.php`

## Architecture

### Development

```
React App (localhost:8080)
    ↓ API calls to /api.php
Express Server (localhost:8080)
    ↓ Remote calls
https://wayrus.co.ke/api.php
    ↓
Database
```

### Production

```
React App (wayrus.co.ke)
    ↓ API calls to /api.php
api.php (local PHP handler)
    ↓
Database (wayrus.co.ke)
```

## Environment Files

- **`.env`** - Development environment (committed to repo, uses remote API)
- **`.env.production`** - Production environment (used during build)
- **`.htaccess`** - Apache web server configuration (handles SPA routing, HTTPS, caching)
- **`api.php`** - Root-level API handler (copied to dist during build)
- **`vite.config.ts`** - Build configuration (includes api.php copy plugin)

## Post-Deployment Checklist

- [ ] Visit https://wayrus.co.ke - site should load without errors
- [ ] Check browser console (F12) - no errors should appear
- [ ] Navigate to /admin/login - admin interface accessible
- [ ] Check Network tab - API calls to /api.php succeed
- [ ] Test admin features (login, manage users, leads, etc.)
- [ ] Clear browser cache if any styling issues
- [ ] Test on mobile devices
- [ ] Verify HTTPS is enforced

## Troubleshooting

### Blank Page Displays

- Check browser console (F12) for JavaScript errors
- Verify all files uploaded from dist/
- Clear browser cache (Ctrl+Shift+Del)
- Ensure .htaccess is in root directory

### API Calls Fail

- Check Network tab in DevTools
- Verify api.php was copied to dist and uploaded
- Check api.php file permissions (644)
- Test manually: `curl https://wayrus.co.ke/api.php`

### 404 on Routes

- Ensure mod_rewrite is enabled: `a2enmod rewrite`
- Verify .htaccess has correct RewriteBase (/)
- Check file permissions (644 for files, 755 for directories)
- Restart Apache: `sudo systemctl restart apache2`

### Admin Login Fails

- Check database connectivity in api.php
- Verify users table exists in database
- Check admin credentials in .env.production
- Review logs: `/var/log/apache2/error.log`

## Notes

- The app is configured as a Single Page Application (SPA)
- All routes are handled by React Router on the client side
- .htaccess redirects non-existent files/directories to index.html
- api.php in root handles all database operations
- Environment variables are set via build-time configuration
