# Lead Discovery & Tracking Module

A complete business lead discovery, capture, and tracking system for identifying businesses that need website services, have broken/unreachable websites, or are actively requesting hosting services.

## 🚀 Quick Start

### 1. Environment Setup

Add these environment variables to your `.env` file:

```bash
# Database Configuration (for wayrus.co.ke/api/)
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=wayrus

# Frontend API URL (optional, defaults to https://wayrus.co.ke/api)
VITE_API_URL=https://wayrus.co.ke/api
```

### 2. Create Database Table

Run the migration to create the leads table:

```bash
# Using ts-node (if available)
npx ts-node server/migrations/001_create_leads_table.ts

# Or manually via PHP API (curl example):
curl -X POST https://wayrus.co.ke/api/connect.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_table",
    "table": "leads",
    "schema": "id INT AUTO_INCREMENT PRIMARY KEY, business_name VARCHAR(255) NOT NULL, contact_person VARCHAR(255), phone VARCHAR(20), email VARCHAR(255), business_category VARCHAR(100), location VARCHAR(255), website_url VARCHAR(500), website_status ENUM(\"none\", \"broken\", \"active\", \"expired\") DEFAULT \"none\", lead_source ENUM(\"google_maps\", \"facebook\", \"manual\", \"referral\", \"social_media\") DEFAULT \"manual\", expressed_need SET(\"website\", \"hosting\", \"seo\", \"repair\", \"maintenance\", \"other\"), notes LONGTEXT, status ENUM(\"new\", \"contacted\", \"interested\", \"converted\", \"lost\") DEFAULT \"new\", created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, KEY idx_business_name (business_name), KEY idx_status (status), KEY idx_website_status (website_status), KEY idx_created_at (created_at)"
  }'
```

## 📋 Features

### Lead Capture Form

- **Business Information**: Name, category, location
- **Contact Details**: Person name, email, phone
- **Website Check**: Automatic website status detection
- **Lead Source**: Track where the lead came from (Google Maps, Facebook, Referral, Manual, Social Media)
- **Expressed Needs**: Multi-select checkboxes for services needed (Website, Hosting, SEO, Repair, Maintenance, Other)
- **Notes**: Additional information field

### Admin Dashboard (Leads Table)

- **Search**: By business name
- **Filtering**:
  - By lead status (New, Contacted, Interested, Converted, Lost)
  - By website status (No Website, Active, Broken, Expired)
- **Pagination**: 10 items per page
- **Actions**:
  - View/Edit lead details
  - Delete lead
  - Change lead status
  - Update notes

### Website Status Checker

- Automatically checks if website is accessible
- Handles DNS resolution and timeout scenarios
- Visual status indicators:
  - 🟢 Active (Green)
  - 🔴 Broken/Unreachable (Red)
  - ⚪ No Website (Gray)
  - 🟠 Expired (Orange)

## 🔧 Components

### React Components

#### `LeadCaptureForm`

Form for capturing new leads with validation and website checking.

**Location**: `client/components/leads/LeadCaptureForm.tsx`

**Props**:

- `onSuccess?: (lead: Lead) => void` - Callback when lead is created
- `onCancel?: () => void` - Callback when form is cancelled

**Usage**:

```tsx
import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";

<LeadCaptureForm
  onSuccess={(lead) => console.log("Lead created:", lead)}
  onCancel={() => setDialogOpen(false)}
/>;
```

#### `AdminLeadsTable`

Comprehensive leads management table with search, filtering, and pagination.

**Location**: `client/components/leads/AdminLeadsTable.tsx`

**Props**:

- `onLeadUpdated?: () => void` - Callback when lead is updated

**Usage**:

```tsx
import { AdminLeadsTable } from "@/components/leads/AdminLeadsTable";

<AdminLeadsTable onLeadUpdated={() => refetchData()} />;
```

#### `LeadDetailsView`

View/edit individual lead details with timeline and status updates.

**Location**: `client/components/leads/LeadDetailsView.tsx`

**Props**:

- `lead: Lead` - Lead data to display
- `onUpdated?: () => void` - Callback when lead is updated
- `onCancel?: () => void` - Callback to close view

## 📡 API Service

### `leadsAPI` Service

**Location**: `client/lib/api/leads.ts`

**Methods**:

#### `create(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead>`

Create a new lead.

```typescript
const newLead = await leadsAPI.create({
  business_name: "Acme Corp",
  email: "contact@acme.com",
  phone: "+254712345678",
  website_url: "acme.com",
  website_status: "none",
  lead_source: "google_maps",
  expressed_need: "website, hosting",
  status: "new",
});
```

#### `list(filters?: LeadFilter): Promise<Lead[]>`

Fetch all leads with optional filters.

```typescript
const leads = await leadsAPI.list({
  business_name: "Acme",
  status: "new",
  website_status: "broken",
});
```

#### `getById(id: number): Promise<Lead>`

Fetch a single lead by ID.

```typescript
const lead = await leadsAPI.getById(123);
```

#### `update(id: number, updates: Partial<Lead>): Promise<void>`

Update a lead.

```typescript
await leadsAPI.update(123, {
  status: "contacted",
  notes: "Called on 2024-01-15",
});
```

#### `delete(id: number): Promise<void>`

Delete a lead.

```typescript
await leadsAPI.delete(123);
```

#### `search(filters: LeadFilter): Promise<Lead[]>`

Search leads with advanced filters.

```typescript
const results = await leadsAPI.search({
  business_name: "Tech",
  website_status: "broken",
  lead_source: "facebook",
});
```

## 🌐 Website Status Checker

**Location**: `client/lib/utils/website-checker.ts`

### Functions

#### `checkWebsiteStatus(url: string): Promise<WebsiteStatus>`

Check the status of a website.

```typescript
import { checkWebsiteStatus } from "@/lib/utils/website-checker";

const status = await checkWebsiteStatus("example.com");
// Returns: 'none' | 'broken' | 'active' | 'expired'
```

#### `checkWebsiteStatusBatch(urls: string[]): Promise<Map<string, WebsiteStatus>>`

Check multiple websites in batch (processes 3 at a time).

```typescript
const results = await checkWebsiteStatusBatch([
  "example1.com",
  "example2.com",
  "example3.com",
]);

results.forEach((status, url) => {
  console.log(`${url}: ${status}`);
});
```

#### `formatWebsiteStatus(status: WebsiteStatus): string`

Format status for display.

```typescript
formatWebsiteStatus("broken"); // "Broken/Unreachable"
formatWebsiteStatus("none"); // "No Website"
```

#### `getStatusColor(status: WebsiteStatus): BadgeVariant`

Get badge color for status.

```typescript
const color = getStatusColor("broken"); // 'destructive'
```

## 📊 Data Model

### Lead Interface

```typescript
interface Lead {
  id?: number;
  business_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  business_category?: string;
  location?: string;
  website_url?: string;
  website_status?: "none" | "broken" | "active" | "expired";
  lead_source?:
    | "google_maps"
    | "facebook"
    | "manual"
    | "referral"
    | "social_media";
  expressed_need?: string; // Comma-separated values
  notes?: string;
  status?: "new" | "contacted" | "interested" | "converted" | "lost";
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}
```

## 🔐 Security

- ✅ Input sanitization via `leadsAPI.sanitizeData()`
- ✅ SQL injection prevention via prepared statements (handled by PHP API)
- ✅ CORS headers configured in `connection.php`
- ✅ No sensitive data in request/response logs
- ✅ Environment variables for API configuration

## 📱 Mobile Responsive

- ✅ Mobile-friendly forms
- ✅ Responsive table layout
- ✅ Touch-friendly buttons and inputs
- ✅ Optimized dialogs for mobile screens

## 🎨 Styling

Uses the existing design system:

- **UI Components**: Radix UI
- **Styles**: TailwindCSS 3
- **Icons**: Lucide React
- **Color Scheme**: Matches Wayrus theme (Purple/Blue)

## 🚦 Status Indicators

- **New** (Blue) - Newly discovered lead
- **Contacted** (Gray) - Reached out to lead
- **Interested** (Gray) - Lead showed interest
- **Converted** (Gray) - Successfully converted
- **Lost** (Red) - Lead did not convert

## 🌐 Website Status Indicators

- **Active** (Green) - Website is accessible
- **Broken** (Red) - Website is not accessible
- **No Website** (Gray) - Business has no website
- **Expired** (Orange) - Domain expired or inactive

## 📍 Accessing the Module

Navigate to: `/admin/discovery-leads`

## 🔄 Database Schema

```sql
CREATE TABLE `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `business_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255),
  `phone` VARCHAR(20),
  `email` VARCHAR(255),
  `business_category` VARCHAR(100),
  `location` VARCHAR(255),
  `website_url` VARCHAR(500),
  `website_status` ENUM('none', 'broken', 'active', 'expired') DEFAULT 'none',
  `lead_source` ENUM('google_maps', 'facebook', 'manual', 'referral', 'social_media') DEFAULT 'manual',
  `expressed_need` SET('website', 'hosting', 'seo', 'repair', 'maintenance', 'other'),
  `notes` LONGTEXT,
  `status` ENUM('new', 'contacted', 'interested', 'converted', 'lost') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  KEY `idx_business_name` (`business_name`),
  KEY `idx_status` (`status`),
  KEY `idx_website_status` (`website_status`),
  KEY `idx_created_at` (`created_at`)
);
```

## 🐛 Troubleshooting

### Issue: "Connection failed" error

- Verify database credentials in environment variables
- Ensure MySQL server is running
- Check database name exists

### Issue: Website checker always returns "broken"

- This is normal due to CORS restrictions
- The checker uses multiple fallback methods
- Manual status selection is available

### Issue: Leads not appearing in table

- Check database migration was successful
- Verify API base URL is correct
- Check browser console for errors

## 📝 Notes

- All API calls use the centralized `wayrus.co.ke/api/connect.php` endpoint
- Data is stored in MySQL using PDO with prepared statements
- Website checker uses non-CORS fetch requests with timeouts
- All dates are stored as ISO 8601 timestamps
- Batch operations process in groups of 3 to avoid overwhelming the server

## 🎯 Future Enhancements

- [ ] Bulk import from CSV/Excel
- [ ] Email/SMS campaign integration
- [ ] Advanced analytics dashboard
- [ ] Lead scoring based on needs/status
- [ ] Automated follow-up reminders
- [ ] Integration with CRM systems
