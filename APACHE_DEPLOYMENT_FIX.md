# Apache Deployment Fix - API 400 Error Resolution

## Problem Summary

When deploying to Apache server at `wayrus.co.ke`, the frontend was returning **400 API errors** because:

1. **.htaccess** was correctly rewriting `/api/*` requests to `api.php?request=$1`
2. **api.php** was NOT parsing the `request` parameter - it expected `action` & `table` parameters
3. **Frontend (api-client.ts)** wasn't detecting Apache deployment and routing correctly

## Solutions Implemented

### 1. Updated `api.php` - REST Request Parser

✅ Added REST-to-PHP API routing conversion:

- Parses `?request=path/to/endpoint` from .htaccess rewrite
- Converts REST methods (GET, POST, PUT, DELETE) to PHP API actions
- Handles JSON request bodies properly (reads once to avoid stream exhaustion)
- Supports all main endpoints:
  - `/api/admin/login` → `action=login`
  - `/api/admin/logout` → `action=logout`
  - `/api/admin/me` → `action=check_auth`
  - `/api/admin/users` → `action=read/create table=users`
  - `/api/leads`, `/api/contacts`, `/api/quotations`, etc. → Standard CRUD operations
  - `/api/chat`, `/api/newsletter` → Create operations

### 2. Updated `client/lib/api-client.ts` - Deployment Detection

✅ Added Apache deployment detection:

- Detects when running on `wayrus.co.ke`
- Routes ALL requests through PHP API on Apache (not just auth endpoints)
- Maintains existing Netlify/development behavior
- Properly reads and parses JSON request bodies

### 3. `.htaccess` Configuration

✅ Already correctly configured:

```apache
RewriteRule ^api/(.*)$ api.php?request=$1 [QSA,L]
```

This rewrites `/api/*` to `api.php?request=*`

## How It Works Now

### Request Flow on Apache

```
Browser sends: POST /api/admin/login
                ↓
.htaccess rewrites to: /api.php?request=admin/login
                ↓
PHP api.php parses:
  - request parameter = "admin/login"
  - method = POST
  - json_body = {"email": "...", "password": "..."}
                ↓
REST parser converts to:
  - action = "login"
  - Sets $_POST['email'] & $_POST['password']
                ↓
Existing login handler executes
                ↓
Returns JWT token in JSON response
                ↓
Frontend stores token and authenticated ✓
```

## Deployment Steps

### Step 1: Build the Frontend

```bash
cd /path/to/project
pnpm install
pnpm build   # Creates dist/ folder
```

### Step 2: Upload to Apache

```bash
# Via SFTP to wayrus.co.ke
sftp user@wayrus.co.ke

cd public_html

# Backup (optional)
mkdir backups/backup_$(date +%Y%m%d)
cp -r *.html backups/backup_$(date +%Y%m%d)/
cp .htaccess backups/backup_$(date +%Y%m%d)/
cp api.php backups/backup_$(date +%Y%m%d)/

# Clear old files (keep api.php and .htaccess)
rm -rf assets/
rm -f *.html *.json

# Upload new files from dist/
lcd /path/to/local/dist
put -r * ./

# Upload .htaccess (in root)
lcd /path/to/local
put .htaccess ./

# Upload updated api.php (in root, NOT in /api/ subdirectory)
put api.php ./

bye
```

**File Structure After Upload:**

```
public_html/
  ├── api.php                    ← PHP API (updated)
  ├── .htaccess                  ← Routing rules (unchanged)
  ├── index.html                 ← SPA entry point
  ├── assets/                    ← JS, CSS, images
  ├── favicon.svg
  ├── logo.svg
  └── uploads/                   ← Keep existing uploads
```

### Step 4: Verify Deployment

Open browser developer tools (F12) and check:

**1. Network Tab:**

- Navigate to https://wayrus.co.ke
- Should see successful requests (status 200, not 400)
- Check API calls to `/api/admin/login`, `/api/leads`, etc.

**2. Console Tab:**

- Should be empty (no errors)
- Look for `[API]` log messages showing token addition

**3. Test Admin Login:**

```
URL: https://wayrus.co.ke/admin/login
Email: gichukisimon@gmail.com
Password: Sirgeorge.12
```

Expected response: Redirect to admin dashboard ✓

## Troubleshooting

### Issue: Still Getting 400 Errors

**Check 1: Is .htaccess working?**

```bash
ssh user@wayrus.co.ke
cd /home/wayrusc1/public_html
cat .htaccess | grep "api.php"
# Should show: RewriteRule ^api/(.*)$ api.php?request=$1
```

**Check 2: Is api.php updated?**

```bash
# Check if it has the parseRestRequest function
grep -n "parseRestRequest" api.php
# Should output a line number
```

**Check 3: Are database credentials correct?**

```bash
# Test connection
curl -X POST https://wayrus.co.ke/api.php \
  -d "action=read&table=users" \
  -H "Content-Type: application/x-www-form-urlencoded"

# Should return JSON (even if empty array)
# If error, check DB credentials in api.php
```

### Issue: Login Works but Other Endpoints Return 400

This means api.php was partially updated. Ensure:

1. REST parser function is present
2. CRUD routing section is complete
3. JSON body parsing is working

### Issue: CORS Errors in Browser

Check api.php CORS headers section:

```php
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization");
```

These should already be set.

## Database Credentials

The api.php uses these defaults (fallback from env):

```
DB_HOST: localhost
DB_USER: wayrusc1_webuser
DB_PASS: Sirgeorge.12
DB_NAME: wayrusc1_webdb
```

If different, either:

1. Create `.env` file in public_html with correct values, OR
2. Update defaults in api.php directly (not recommended)

## Security Notes

✅ **DO NOT:**

- Commit `.env` file with credentials to git
- Expose API credentials in frontend code
- Use hardcoded passwords in production

✅ **DO:**

- Use environment variables for all secrets
- Keep api.php secure (644 permissions)
- Use HTTPS (already configured at wayrus.co.ke)
- Rotate database passwords regularly

## Next Steps

1. ✅ Backup current production files
2. ✅ Build new frontend (`pnpm build`)
3. ✅ Upload dist/ files to public_html
4. ✅ Upload updated api.php to public_html
5. ✅ Verify .htaccess is in place
6. ✅ Test in browser - login should work
7. ✅ Check admin dashboard functionality
8. ✅ Monitor error logs for any issues

## Support

If issues persist:

1. Check `/var/log/apache2/error.log` on server
2. Check browser console (F12) for specific error messages
3. Use Network tab to inspect API responses
4. Verify database connectivity from command line

---

**Updated:** December 2024
**Files Changed:** api.php, client/lib/api-client.ts
**Testing:** Manual verification required on deployment
