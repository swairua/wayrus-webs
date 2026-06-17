# Deployment Checklist for wayrus.co.ke

## Pre-Deployment Tasks

### 1. Remote Server Preparation

- [ ] Ensure `/home/wayrusc1/public_html/` directory exists and is writable
- [ ] Create `/home/wayrusc1/public_html/uploads/screenshots/` directory with proper permissions (755)
- [ ] Update `/home/wayrusc1/public_html/api/connection.php` with latest version (see below)

### 2. Update Remote connection.php

The file at `wayrus.co.ke/api/connection.php` must be updated with the following changes:

**Issue**: Missing `order_by` parameter support causes SQL syntax errors

**Required Changes**:

1. Around line 33-38, add:

   ```php
   $order_by = $_POST['order_by'] ?? ($_GET['order_by'] ?? null);
   ```

2. In the READ action (around line 77-93), after the WHERE clause, add:
   ```php
   if (!empty($order_by)) {
       $sql .= " " . $order_by;
   }
   ```

See `server/API_CONNECTION_UPDATES.md` for detailed instructions.

### 3. Build the Application

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build
```

### 4. Upload to wayrus.co.ke

Option A: SPA Only (Recommended)

```bash
# Build only frontend
pnpm build:client

# Upload contents of dist/ to /home/wayrusc1/public_html/
# Using SFTP:
sftp user@wayrus.co.ke
cd public_html/
rm -rf * (remove old files)
put -r dist/* ./
put .htaccess ./
bye
```

Option B: With Express Server

```bash
# Build everything
pnpm build

# Upload to application server directory
sftp user@wayrus.co.ke
cd /app/wayrus/
put -r dist/* ./
put package.json ./
put pnpm-lock.yaml ./

# On server:
cd /app/wayrus/
pnpm install
npm start
```

### 5. Verify Deployment

- [ ] Visit https://wayrus.co.ke/ - site should load without errors
- [ ] Check browser console (F12) - no errors should appear
- [ ] Navigate to `/admin/login` - admin interface should be accessible
- [ ] Check Network tab - API calls should go to `wayrus.co.ke/api.php`
- [ ] Test admin features (login, manage users, etc.)

## Environment Variables

### REQUIRED

```
API_CONNECTION_URL=https://wayrus.co.ke/api.php
NODE_ENV=production
PORT=3000
```

### OPTIONAL (Override connection.php defaults if needed)

```
DB_HOST=localhost
DB_USER=wayrusc1_user
DB_PASS=<your_db_password>
DB_NAME=wayrusc1_wayrus
ADMIN_EMAIL=gichukiwairua124@gmail.com
ADMIN_PASSWORD=<your_admin_password>
UPLOAD_DIR=/home/wayrusc1/public_html/uploads/screenshots/
```

**Note**: Most of these have defaults in `connection.php`. Only set them if you need to override those defaults.

## Security Checklist

- [ ] HTTPS is enforced via .htaccess
- [ ] Security headers are set (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] Database credentials are not committed to repository
- [ ] Sensitive environment variables are set on server, not in code
- [ ] .htaccess is uploaded to prevent directory listing
- [ ] API endpoint is properly secured (only allow POST from authorized sources if needed)

## Troubleshooting

### Blank Page Displays

- Check browser console for JavaScript errors (F12)
- Verify all files from dist/ were uploaded
- Clear browser cache (Ctrl+Shift+Del)
- Ensure .htaccess is in the root directory

### API Connection Fails

- Verify `API_CONNECTION_URL` environment variable is set
- Check that `/home/wayrusc1/public_html/api/connection.php` exists and is updated
- Test API manually: `curl https://wayrus.co.ke/api.php`
- Check database connection parameters in connection.php

### 404 Errors on Navigation

- Ensure Apache mod_rewrite is enabled
- Verify .htaccess has correct RewriteBase (should be /)
- Check file permissions (644 for files, 755 for directories)
- Restart Apache: `sudo systemctl restart apache2`

### Admin Login Fails

- Check database tables are created (users table should exist)
- Verify `/home/wayrusc1/public_html/api/connection.php` has database connection working
- Admin credentials are managed in the database (users table)
- If new deployment, run initial setup to create admin user (optional ADMIN_EMAIL/PASSWORD env vars)

## Rollback Plan

If deployment fails:

1. Keep backup of previous dist/ folder locally
2. Use SFTP to restore previous version
3. Clear all browser caches (Ctrl+Shift+Del in browser)
4. Check server logs for errors

## Performance Optimization

- [ ] Assets are cached for 1 year (CSS, JS, images, fonts)
- [ ] HTML is cached for 1 hour with validation
- [ ] GZIP compression is enabled
- [ ] Images are optimized (using OptimizedImage component)
- [ ] Bundle is minified and optimized by Vite build

## Post-Deployment Monitoring

- Monitor server logs for errors
- Check API response times
- Monitor database connection stability
- Track user logins and admin actions
- Set up alerts for error spikes

## Next Steps

After successful deployment:

1. Set up CI/CD pipeline for automated deployments
2. Configure monitoring and alerting
3. Set up regular backups
4. Document any custom configurations
5. Create rollback procedures
