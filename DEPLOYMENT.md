# Deployment Guide for wayrus.co.ke

This guide explains how to build and deploy the Wayrus Admin Application to wayrus.co.ke using Apache.

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Apache web server with mod_rewrite enabled
- SSH/FTP access to wayrus.co.ke hosting

## Build Instructions

### 1. Build for Production

```bash
# Install dependencies (if not already done)
pnpm install

# Build the application (creates dist folder)
npm run build
# or
pnpm build
```

This command will:

- Build the React frontend to `dist/client/` folder
- Build the Express server to `dist/server/` folder

### 2. For SPA Static Deployment (Recommended)

If you only need the frontend SPA (without server):

```bash
npm run build:client
# or
pnpm build:client
```

This creates the static files in `dist/` folder only.

## Deployment Steps

### Option A: Copy Built Files to Root (Recommended for SPA)

1. **Build locally:**

   ```bash
   npm run build:client
   ```

2. **Connect to your hosting:**

   ```bash
   sftp user@wayrus.co.ke
   # or use FTP client
   ```

3. **Upload files:**

   ```bash
   # Remove old files from public_html/
   cd public_html/
   rm -rf *

   # Upload files from your local dist folder
   put -r dist/* ./

   # Verify .htaccess is in place
   put .htaccess ./
   ```

4. **Directory structure should look like:**
   ```
   public_html/
   ├── .htaccess
   ├── index.html
   ├── assets/
   │   ├── *.js
   │   ├── *.css
   │   └── *.woff2
   └── other files...
   ```

### Option B: Deploy with Server

If you want to run the Express backend:

1. **Build the entire application:**

   ```bash
   npm run build
   ```

2. **Upload to server:**

   ```bash
   sftp user@wayrus.co.ke
   cd /app/wayrus/
   put -r dist/* ./
   put package.json ./
   put pnpm-lock.yaml ./
   ```

3. **On the server, install and run:**
   ```bash
   cd /app/wayrus/
   pnpm install
   npm start
   ```

## Configuration Files

### .htaccess

The `.htaccess` file in the root handles:

- **SPA Routing**: All requests route to `index.html` for client-side routing
- **HTTPS Redirect**: Forces HTTPS for security
- **WWW Redirect**: Redirects www to non-www (or vice versa)
- **Compression**: Gzip compression for faster loading
- **Caching**: Long-term cache for static assets, no cache for HTML
- **Security Headers**: XSS protection, clickjacking prevention, etc.

### .env.production

The `.env.production` file contains:

- `API_CONNECTION_URL`: Points to wayrus.co.ke/api.php (server-side)
- `VITE_API_URL`: Points to wayrus.co.ke/api (client-side, for API calls)

## Verify Deployment

1. **Check if the app loads:**

   ```
   https://wayrus.co.ke/
   ```

2. **Test API connectivity:**
   - Go to Admin > Users
   - If users load correctly, API is connected

3. **Check console for errors:**
   - Open browser DevTools (F12)
   - Check Console tab for any errors
   - Check Network tab to verify API calls go to wayrus.co.ke/api.php

## Troubleshooting

### App Shows Blank Page

- Check browser console for errors (F12)
- Verify index.html was uploaded
- Clear browser cache (Ctrl+Shift+Del)
- Check .htaccess is in the root directory

### API Calls Failing

- Verify API_CONNECTION_URL is correct in environment
- Check CORS headers in .htaccess
- Test API manually: `curl https://wayrus.co.ke/api.php`

### Route Not Working

- Verify mod_rewrite is enabled on Apache:
  ```bash
  a2enmod rewrite  # On Linux
  ```
- Restart Apache after enabling modules
- Check .htaccess has correct RewriteBase path

### 404 Errors

- Ensure .htaccess is in the root directory
- Verify all files were uploaded successfully
- Check file permissions (should be 644 for files, 755 for directories)

## Performance Tips

1. **Enable Compression**: The .htaccess already handles gzip compression
2. **Leverage Browser Cache**: Static assets are cached for 1 year
3. **Minimize Bundle Size**: The build automatically minifies and optimizes
4. **Use CDN**: Consider putting assets on a CDN for faster delivery

## Security Notes

- HTTPS is enforced via .htaccess
- Security headers protect against common attacks
- API calls use the centralized connection.php endpoint
- Never commit .env files with real credentials

## Rollback

If something goes wrong:

1. Keep a backup of the previous version
2. Use SFTP to reupload the previous dist folder
3. Clear browser cache
4. Check logs on the server for errors

## Support

For API-related issues, refer to:

- `LEAD_DISCOVERY_SETUP.md` - Lead discovery setup
- `LEAD_DISCOVERY_API_EXAMPLES.md` - API examples
- `server/API_CONNECTION_UPDATES.md` - Connection updates

For hosting support, contact your hosting provider.
