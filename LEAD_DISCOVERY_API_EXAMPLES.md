# Lead Discovery & Tracking - API Examples

Complete examples of API requests and responses for the Lead Discovery & Tracking module.

## API Endpoint

All requests go to: `https://wayrus.co.ke/api/connect.php`

## Database Operations

### 1. Create Lead

**Request**:

```bash
curl -X POST https://wayrus.co.ke/api/connect.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "table": "leads",
    "data": {
      "business_name": "Tech Solutions Kenya",
      "contact_person": "John Doe",
      "phone": "+254712345678",
      "email": "john@techsolutions.ke",
      "business_category": "Technology",
      "location": "Nairobi, Kenya",
      "website_url": "techsolutions.ke",
      "website_status": "broken",
      "lead_source": "google_maps",
      "expressed_need": "website,hosting,seo",
      "notes": "Interested in full website redesign",
      "status": "new"
    }
  }'
```

**Response**:

```json
{
  "status": "success",
  "message": "Record created",
  "id": 42,
  "data": {
    "business_name": "Tech Solutions Kenya",
    "contact_person": "John Doe",
    "phone": "+254712345678",
    "email": "john@techsolutions.ke",
    "business_category": "Technology",
    "location": "Nairobi, Kenya",
    "website_url": "techsolutions.ke",
    "website_status": "broken",
    "lead_source": "google_maps",
    "expressed_need": "website,hosting,seo",
    "notes": "Interested in full website redesign",
    "status": "new",
    "id": 42
  }
}
```

### 2. Read/List Leads

**Basic Request** (All leads):

```bash
curl "https://wayrus.co.ke/api/connect.php?action=read&table=leads&order_by=ORDER%20BY%20created_at%20DESC"
```

**Filtered Request** (Broken websites):

```bash
curl "https://wayrus.co.ke/api/connect.php?action=read&table=leads&where=website_status%3D%27broken%27&order_by=ORDER%20BY%20created_at%20DESC"
```

**Filtered Request** (Multiple conditions):

```bash
curl "https://wayrus.co.ke/api/connect.php?action=read&table=leads&where=website_status%3D%27broken%27%20AND%20status%3D%27new%27&order_by=ORDER%20BY%20created_at%20DESC"
```

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": 42,
      "business_name": "Tech Solutions Kenya",
      "contact_person": "John Doe",
      "phone": "+254712345678",
      "email": "john@techsolutions.ke",
      "business_category": "Technology",
      "location": "Nairobi, Kenya",
      "website_url": "techsolutions.ke",
      "website_status": "broken",
      "lead_source": "google_maps",
      "expressed_need": "website,hosting,seo",
      "notes": "Interested in full website redesign",
      "status": "new",
      "created_at": "2024-01-15 10:30:45",
      "updated_at": "2024-01-15 10:30:45"
    },
    {
      "id": 43,
      "business_name": "Local Restaurant",
      "contact_person": "Jane Smith",
      "phone": "+254723456789",
      "email": "jane@restaurant.ke",
      "business_category": "Hospitality",
      "location": "Mombasa, Kenya",
      "website_url": null,
      "website_status": "none",
      "lead_source": "facebook",
      "expressed_need": "website",
      "notes": null,
      "status": "new",
      "created_at": "2024-01-15 11:45:00",
      "updated_at": "2024-01-15 11:45:00"
    }
  ],
  "count": 2
}
```

### 3. Update Lead

**Request**:

```bash
curl -X POST https://wayrus.co.ke/api/connect.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "table": "leads",
    "data": {
      "status": "contacted",
      "notes": "Called on 2024-01-15 at 2:30 PM. John interested in meeting."
    },
    "where": {
      "id": 42
    }
  }'
```

**Response**:

```json
{
  "status": "success",
  "message": "Record updated",
  "affected_rows": 1
}
```

### 4. Delete Lead

**Request**:

```bash
curl -X POST https://wayrus.co.ke/api/connect.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "delete",
    "table": "leads",
    "where": {
      "id": 42
    }
  }'
```

**Response**:

```json
{
  "status": "success",
  "message": "Record deleted",
  "affected_rows": 1
}
```

## React Component Examples

### Using LeadCaptureForm

```tsx
import { useState } from "react";
import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";
import { Lead } from "@/lib/api/leads";

export function NewLeadDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (lead: Lead) => {
    console.log("New lead created:", lead);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <LeadCaptureForm
          onSuccess={handleSuccess}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
```

### Using AdminLeadsTable

```tsx
import { AdminLeadsTable } from "@/components/leads/AdminLeadsTable";

export function LeadsPage() {
  const handleLeadUpdated = () => {
    console.log("Lead was updated");
    // Refresh other components if needed
  };

  return (
    <div className="container py-8">
      <h1>Manage Leads</h1>
      <AdminLeadsTable onLeadUpdated={handleLeadUpdated} />
    </div>
  );
}
```

### Using Website Checker

```tsx
import { useState } from "react";
import {
  checkWebsiteStatus,
  formatWebsiteStatus,
} from "@/lib/utils/website-checker";
import { Button } from "@/components/ui/button";

export function WebsiteChecker() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const result = await checkWebsiteStatus(url);
      setStatus(formatWebsiteStatus(result));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
      />
      <Button onClick={handleCheck} disabled={loading}>
        {loading ? "Checking..." : "Check Status"}
      </Button>
      {status && <p>Status: {status}</p>}
    </div>
  );
}
```

## JavaScript/TypeScript Examples

### Using leadsAPI Service

```typescript
import { leadsAPI } from "@/lib/api/leads";

// Create a new lead
async function createNewLead() {
  const lead = await leadsAPI.create({
    business_name: "New Business",
    email: "contact@newbusiness.com",
    phone: "+254712345678",
    website_status: "active",
    lead_source: "manual",
    expressed_need: "website,hosting",
    status: "new",
  });
  console.log("Created lead:", lead);
}

// Get all leads
async function getAllLeads() {
  const leads = await leadsAPI.list();
  console.log("All leads:", leads);
}

// Search leads
async function searchBrokenWebsites() {
  const leads = await leadsAPI.search({
    website_status: "broken",
    status: "new",
  });
  console.log("Broken websites:", leads);
}

// Get single lead
async function getLeadDetails(leadId: number) {
  const lead = await leadsAPI.getById(leadId);
  console.log("Lead details:", lead);
}

// Update a lead
async function updateLeadStatus(leadId: number) {
  await leadsAPI.update(leadId, {
    status: "contacted",
    notes: "Called - interested in proposal",
  });
}

// Delete a lead
async function deleteLead(leadId: number) {
  await leadsAPI.delete(leadId);
}
```

## Filter Examples

### By Website Status

```typescript
// Get all businesses with no website
const noWebsite = await leadsAPI.search({
  website_status: "none",
});

// Get broken websites
const broken = await leadsAPI.search({
  website_status: "broken",
});

// Get active websites
const active = await leadsAPI.search({
  website_status: "active",
});
```

### By Lead Status

```typescript
// Get new leads
const newLeads = await leadsAPI.list({
  status: "new",
});

// Get converted leads
const converted = await leadsAPI.list({
  status: "converted",
});
```

### By Lead Source

```typescript
// Get leads from Google Maps
const googleMapLeads = await leadsAPI.list({
  lead_source: "google_maps",
});

// Get Facebook leads
const facebookLeads = await leadsAPI.list({
  lead_source: "facebook",
});
```

### Combined Filters

```typescript
// Get new broken websites from Google Maps
const prospects = await leadsAPI.search({
  website_status: "broken",
  status: "new",
  lead_source: "google_maps",
});

// Get high-priority leads needing websites
const highPriority = await leadsAPI.search({
  expressed_need: "website",
  website_status: "none",
  status: "interested",
});
```

## Error Handling Examples

```typescript
import { leadsAPI } from "@/lib/api/leads";
import { toast } from "sonner";

async function createLeadSafely() {
  try {
    const lead = await leadsAPI.create({
      business_name: "Test Business",
      email: "test@example.com",
    });
    toast.success("Lead created successfully");
    return lead;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    toast.error(`Failed to create lead: ${errorMessage}`);
    console.error("Create lead error:", error);
  }
}

async function updateLeadSafely(leadId: number) {
  try {
    await leadsAPI.update(leadId, {
      status: "contacted",
    });
    toast.success("Lead updated");
  } catch (error) {
    toast.error("Failed to update lead");
  }
}

async function deleteLeadSafely(leadId: number) {
  if (!confirm("Are you sure you want to delete this lead?")) {
    return;
  }

  try {
    await leadsAPI.delete(leadId);
    toast.success("Lead deleted");
  } catch (error) {
    toast.error("Failed to delete lead");
  }
}
```

## Batch Operations

```typescript
import { checkWebsiteStatusBatch } from "@/lib/utils/website-checker";

async function checkMultipleWebsites() {
  const urls = [
    "example1.com",
    "example2.com",
    "example3.com",
    "example4.com",
    "example5.com",
  ];

  const results = await checkWebsiteStatusBatch(urls);

  results.forEach((status, url) => {
    console.log(`${url}: ${status}`);
  });

  // Process results
  const broken = Array.from(results.entries())
    .filter(([_, status]) => status === "broken")
    .map(([url]) => url);

  console.log("Broken websites:", broken);
}
```

## Common Use Cases

### 1. Daily Lead Report

```typescript
async function getDailyReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const newLeads = await leadsAPI.list({
    status: "new",
  });

  const converted = await leadsAPI.list({
    status: "converted",
  });

  const broken = await leadsAPI.list({
    website_status: "broken",
  });

  console.log(`
    Daily Report:
    - New Leads: ${newLeads.length}
    - Converted Today: ${converted.length}
    - Broken Websites: ${broken.length}
  `);
}
```

### 2. Lead Assignment

```typescript
async function assignLeadsToTeam() {
  const newLeads = await leadsAPI.list({ status: "new" });

  // Assign first 5 to team A, next 5 to team B
  for (let i = 0; i < newLeads.length; i++) {
    const teamA = i < 5;
    await leadsAPI.update(newLeads[i].id!, {
      notes: `Assigned to Team ${teamA ? "A" : "B"}`,
    });
  }
}
```

### 3. Priority Targeting

```typescript
async function getHighValueTargets() {
  // Businesses with no website + interested in website + from referral
  const highValue = await leadsAPI.search({
    website_status: "none",
    expressed_need: "website",
    lead_source: "referral",
  });

  return highValue;
}
```

## Database Query Examples (for direct SQL)

```sql
-- Get all new broken websites
SELECT * FROM leads
WHERE status = 'new' AND website_status = 'broken'
ORDER BY created_at DESC;

-- Get leads by category
SELECT business_category, COUNT(*) as count
FROM leads
GROUP BY business_category
ORDER BY count DESC;

-- Get conversion rate by source
SELECT
  lead_source,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
  ROUND(SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as conversion_rate
FROM leads
GROUP BY lead_source;

-- Get recently updated leads
SELECT * FROM leads
WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY updated_at DESC;

-- Get leads requiring follow-up
SELECT * FROM leads
WHERE status IN ('new', 'interested')
AND created_at <= DATE_SUB(NOW(), INTERVAL 3 DAY)
ORDER BY created_at ASC;
```
