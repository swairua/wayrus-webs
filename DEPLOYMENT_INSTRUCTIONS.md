# Deployment Instructions for wayrus.co.ke

## Quick Start (5-10 minutes)

### Step 1: Local Build

```bash
# Clone/update the repository
git pull origin main

# Install dependencies
pnpm install

# Build for production
pnpm build:client  # For SPA only (recommended)
# OR
pnpm build  # For full server build
```

### Step 2: Upload to Server

**Via SFTP**:

```bash
sftp user@wayrus.co.ke

# Navigate to web root
cd public_html

# Backup current version (optional but recommended)
mkdir backup_$(date +%Y%m%d_%H%M%S)
cp -r * backup_$(date +%Y%m%d_%H%M%S)/

# Remove old files
rm -rf *

# Upload new files
cd /path/to/local/repo
put -r dist/* public_html/
put .htaccess public_html/

bye
```

**Via File Manager** (if SFTP unavailable):

1. Log into cPanel/File Manager on wayrus.co.ke hosting
2. Navigate to `public_html/`
3. Download/backup current files
4. Upload contents of local `dist/` folder
5. Upload `.htaccess` file
6. Set file permissions: 644 for files, 755 for directories

### Step 3: Verify Deployment

1. Open https://wayrus.co.ke in browser
2. Press F12 to open Developer Tools
3. Check Console tab - should be empty (no errors)
4. Check Network tab - verify API calls to api.php succeed
5. Try navigating to /admin/login
6. Clear browser cache (Ctrl+Shift+Del) if issues persist

### Step 4: Configure Environment Variables

**Minimum Required** (must be set):

```
API_CONNECTION_URL=https://wayrus.co.ke/api.php
NODE_ENV=production
PORT=3000
```

**Optional** (only if overriding connection.php defaults):

```
DB_HOST=localhost
DB_USER=wayrusc1_user
DB_PASS=<your_password>
DB_NAME=wayrusc1_wayrus
ADMIN_EMAIL=gichukiwairua124@gmail.com
ADMIN_PASSWORD=<your_password>
```

**On Hosting Control Panel**:

1. Go to cPanel > Environment Variables (or similar)
2. Add at minimum: `API_CONNECTION_URL` and `NODE_ENV`
3. Add optional DB variables only if changing from connection.php defaults

**On Server (via SSH)**:

```bash
ssh user@wayrus.co.ke

# Create .env file (optional, for overrides)
nano /home/wayrusc1/public_html/.env

# Add only the variables you want to override
# Most values already in connection.php
# Save: Ctrl+O, Enter, Ctrl+X
```

---

## Detailed Deployment Guide

### Phase 1: Prepare Code

```bash
# 1. Update repository
git checkout main
git pull origin main

# 2. Verify code quality
pnpm typecheck  # Check TypeScript
pnpm test       # Run tests
pnpm format.fix # Fix code formatting

# 3. Build application
pnpm build:client

# 4. Test build output
# Verify dist/ folder contains:
# - index.html
# - assets/
# - favicon.svg, logo.svg, etc.
ls -la dist/
```

### Phase 2: Update Remote PHP API

Before uploading the frontend, ensure the remote `connection.php` is updated:

1. **SSH into wayrus.co.ke**:

   ```bash
   ssh user@wayrus.co.ke
   ```

2. **Backup current connection.php**:

   ```bash
   cp /home/wayrusc1/public_html/api/connection.php /home/wayrusc1/public_html/api/connection.php.backup
   ```

3. **Update connection.php** with the following:
   - Add `$order_by` parameter support (see API_CONNECTION_UPDATES.md) - **REQUIRED**
   - Database credentials already configured in connection.php
   - Optional: Accept environment variable overrides (DB_HOST, DB_USER, DB_PASS, DB_NAME)
   - Test connection: `curl https://wayrus.co.ke/api.php`

4. **Verify it works**:
   ```bash
   # Test a simple read request
   curl -X POST https://wayrus.co.ke/api/connection.php \
     -d "action=read&table=users" \
     -H "Content-Type: application/x-www-form-urlencoded"
   ```

### Phase 3: Upload Frontend

**Option A: SFTP (Most Common)**

```bash
sftp user@wayrus.co.ke

# Show remote structure
ls -la /

# Navigate to public_html
cd public_html

# Create timestamped backup
mkdir backups/backup_$(date +%Y%m%d_%H%M%S)
cp -r *.html backups/backup_$(date +%Y%m%d_%H%M%S)/

# Remove old files (except api/ and uploads/)
rm -f *.html
rm -f *.json
rm -f *.xml
rm -rf assets/

# Upload new files
lcd /path/to/local/dist
put -r * ./

# Upload configuration
lcd /path/to/local
put .htaccess ./

# Verify upload
ls -la

# Exit
bye
```

**Option B: Git Deployment** (if set up)

```bash
ssh user@wayrus.co.ke

cd /home/wayrusc1/public_html
git fetch origin
git checkout main
pnpm install
pnpm build:client
```

### Phase 4: Verify Installation

1. **Check file structure**:

   ```bash
   ssh user@wayrus.co.ke
   cd /home/wayrusc1/public_html

   # Should see:
   ls -la
   # index.html
   # assets/
   # favicon.svg
   # .htaccess
   # api/ (existing, don't delete)
   # uploads/ (existing, don't delete)
   ```

2. **Set correct permissions**:

   ```bash
   chmod 644 index.html
   chmod 644 .htaccess
   chmod 755 assets/
   chmod 755 uploads/
   chmod 755 api/
   ```

3. **Test in browser**:
   - Navigate to https://wayrus.co.ke
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

### Phase 5: Test Functionality

1. **Frontend tests**:
   - [ ] Home page loads
   - [ ] Navigation works
   - [ ] Images load correctly
   - [ ] No console errors

2. **API tests**:
   - [ ] Admin login works
   - [ ] Users can be listed (GET /api/users)
   - [ ] New records can be created (POST /api/leads)
   - [ ] Data persists

3. **Admin panel tests**:
   - [ ] /admin/login loads
   - [ ] Login succeeds with correct credentials
   - [ ] Admin can view users, leads, contacts
   - [ ] Admin can create/edit records

### Phase 6: Post-Deployment Cleanup

```bash
ssh user@wayrusc1/public_html

# Remove old backups if disk space is low
rm -rf backups/backup_YYYYMMDD_HHMMSS/

# Check disk usage
du -sh *

# View recent logs
tail -100 /var/log/apache2/error.log
tail -100 /var/log/apache2/access.log
```

---

## Rollback Procedure

If something goes wrong:

```bash
sftp user@wayrus.co.ke

cd public_html

# Remove broken files
rm -rf assets/
rm -f *.html
rm -f *.json

# Restore from backup
cp -r backups/backup_YYYYMMDD_HHMMSS/* ./

# Verify
ls -la

bye
```

---

## Common Issues & Solutions

### Issue: Blank Page / 404 Errors

**Cause**: .htaccess not uploaded or incorrect RewriteBase

**Solution**:

```bash
# Ensure .htaccess exists and has correct content
sftp user@wayrus.co.ke
cd public_html
put .htaccess ./

# Or manually create on server:
ssh user@wayrus.co.ke
cd /home/wayrusc1/public_html
# Copy content from .htaccess file and paste into editor
nano .htaccess
```

### Issue: API Calls Fail / 500 Error

**Cause**: connection.php not updated or database credentials wrong

**Solution**:

```bash
# Test connection.php
curl -X POST https://wayrus.co.ke/api/connection.php \
  -d "action=read&table=users"

# If error, SSH and check:
ssh user@wayrusc1@wayrus.co.ke
tail -50 /var/log/php-errors.log
nano /home/wayrusc1/public_html/api/connection.php
# Verify DB credentials in connection.php are correct
# These are hard-coded in PHP (not from environment)
```

### Issue: Slow Loading / 403 Forbidden

**Cause**: Missing gzip, wrong permissions, or hotlinking protection

**Solution**:

```bash
ssh user@wayrus.co.ke
cd /home/wayrusc1/public_html

# Set correct permissions
chmod 644 .htaccess
chmod 755 assets/
chmod 755 api/

# Restart Apache
sudo systemctl restart apache2
```

### Issue: CSS/JS Not Loading

**Cause**: Wrong file paths in HTML or MIME type issues

**Solution**:

- Check .htaccess has correct MIME types (already configured)
- Verify assets/ folder is uploaded with all files
- Clear browser cache: Ctrl+Shift+Del

---

## Performance Monitoring

After deployment, monitor:

1. **Load Times**: Check PageSpeed Insights
2. **Error Rates**: Check server logs
3. **Database Performance**: Monitor slow queries
4. **Disk Usage**: Keep under 80% capacity
5. **Backups**: Ensure daily backups are running

---

## Version Control

After each deployment, tag the release:

```bash
git tag -a v1.0.0 -m "Deploy to production"
git push origin v1.0.0
```

Record deployment details:

- Date/time deployed
- Version deployed
- Changes included
- Who deployed it
- Any issues encountered

---

## Security After Deployment

- [ ] HTTPS is enforced (check in browser)
- [ ] Security headers are present (check with curl -I https://wayrus.co.ke)
- [ ] Database credentials are secure (not in frontend code)
- [ ] API keys are not exposed (check Network tab in DevTools)
- [ ] Admin users have strong passwords
- [ ] Regular backups are configured
- [ ] Logs are being monitored

## Support & Documentation

- For API issues: See `server/API_CONNECTION_UPDATES.md`
- For deployment issues: See `DEPLOYMENT.md`
- For lead discovery: See `LEAD_DISCOVERY_SETUP.md`
- For image optimization: See `IMAGE_OPTIMIZATION_GUIDE.md`
