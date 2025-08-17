# L36 Commerce & CMS API Integration Guide

## Overview

This guide explains how the L36 Commerce and CMS API systems are organized and how CVPS developers can use them. The system now includes comprehensive CMS functionality for managing orders, customers, wholesale operations, and newsletters.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CVPS Frontend                         │
│                   (dev.latitude36.com.au)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │ Uses TypeScript Types
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Shared Contracts                          │
│   ┌──────────────────────────┬──────────────────────────┐   │
│   │   API Specifications     │    TypeScript Types      │   │
│   │  commerce-endpoints-v1   │   commerce-v1.types.ts   │   │
│   │  cms-endpoints-v1        │   cms-v1.types.ts        │   │
│   └──────────────────────────┴──────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ Defines
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Manifest System                         │
│         commerce-endpoints-v1.json, cms-system-lean.json     │
│         (Maps endpoints to implementations)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ Points to
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Implementation                    │
│                        (MVPS - L36)                         │
│     Commerce: payment_routes.py, order_routes.py, etc.       │
│     CMS: backend/app/cms/* (modular blueprint system)        │
└─────────────────────────────────────────────────────────────┘
```

## For CVPS Developers

### 1. TypeScript Types
Use the pre-generated types for all API calls:

```typescript
// Commerce types
import { 
  Order, 
  PaymentSession, 
  Review 
} from '@l36/shared-contracts/commerce-v1.types';

// CMS types
import {
  CheckoutSessionRequest,
  WholesaleLoginRequest,
  WholesaleProduct,
  NewsletterSubscribeRequest,
  OrderResponse
} from '@l36/shared-contracts/cms-v1.types';

// Types are fully typed with all fields
const order: OrderResponse = await fetchOrder(orderId);
```

### 2. API Endpoints
All endpoints are documented in:
- **Commerce spec**: `/shared-contracts/api-contracts/commerce-endpoints-v1.md`
- **CMS spec**: `/shared-contracts/api-contracts/cms-endpoints-v1.md`
- **Domain specs**: `/shared-contracts/api-contracts/commerce/*.md`

### 3. Authentication
Three authentication methods:

```typescript
// API Key (most endpoints - both Commerce and CMS)
headers: {
  'X-API-Key': 'l36-cms-dev-2025'  // CMS endpoints
  // or
  'X-API-Key': 'l36-commerce-dev-2025'  // Commerce endpoints
}

// JWT (wholesale customers only)
headers: {
  'Authorization': `Bearer ${token}`
}

// Admin (admin endpoints)
headers: {
  'X-Admin-Token': adminToken
}
```

### 4. Quick Endpoint Reference

#### Commerce System
| Domain | Endpoints | Auth | Documentation |
|--------|-----------|------|---------------|
| Payment | 8 | API Key | [payment-endpoints.md](./api-contracts/commerce/payment-endpoints.md) |
| Orders | 5 | API Key | [order-endpoints.md](./api-contracts/commerce/order-endpoints.md) |
| Customers | 5 | API Key | [customer-endpoints.md](./api-contracts/commerce/customer-endpoints.md) |
| Wholesale | 4 | JWT | [wholesale-endpoints.md](./api-contracts/commerce/wholesale-endpoints.md) |
| Reviews | 5 | API Key | [review-endpoints.md](./api-contracts/commerce/review-endpoints.md) |
| Email | 16 | Mixed | [email-endpoints.md](./api-contracts/commerce/email-endpoints.md) |
| MYOB | 8 | Admin | [myob-endpoints.md](./api-contracts/commerce/myob-endpoints.md) |

#### CMS System (New!)
| Module | Endpoints | Auth | Base Path |
|--------|-----------|------|-----------|
| Commerce | 7 | API Key | `/api/cms/commerce/*` |
| Customers | 5 | API Key | `/api/cms/customers/*` |
| Wholesale | 5 | JWT | `/api/cms/customers/wholesale/*` |
| Marketing | 4 | Admin | `/api/cms/marketing/*` |
| Admin | 3 | Admin | `/api/cms/admin/*` |

### 5. Example API Calls

#### Create Payment Session
```typescript
const response = await fetch('/api/payment/create-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'l36-commerce-dev-2025'
  },
  body: JSON.stringify({
    cart_items: [...],
    customer_email: 'customer@example.com',
    payment_method: 'stripe'
  })
});

const session: PaymentSession = await response.json();
```

#### Submit Review
```typescript
const response = await fetch(`/api/products/${productId}/reviews`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'l36-commerce-dev-2025'
  },
  body: JSON.stringify({
    rating: 5,
    title: 'Great product!',
    comment: 'Really enjoyed this honey',
    email: 'customer@example.com',
    order_number: 'L36-2025-001' // Optional, for verification
  })
});
```

#### CMS: Wholesale Login
```typescript
// Login to get JWT token
const loginResponse = await fetch('/api/cms/customers/wholesale/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'cliffords',
    password: 'cliffords2025'
  })
});

const { token } = await loginResponse.json();

// Use token for wholesale pricing
const pricingResponse = await fetch('/api/cms/customers/wholesale/pricing', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const wholesalePricing: WholesalePricingResponse = await pricingResponse.json();
```

#### CMS: Order Lookup
```typescript
const response = await fetch('/api/cms/commerce/orders/lookup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'l36-cms-dev-2025'
  },
  body: JSON.stringify({
    email: 'customer@example.com',
    order_number: 'L36-2025-0001'
  })
});

const order: OrderResponse = await response.json();
```

## For Backend Developers

### 1. Implementation Structure

#### Commerce Endpoints
```
backend/app/
├── payment_routes.py      # Payment processing
├── order_routes.py        # Order management
├── customer_routes.py     # Customer management
├── wholesale_routes.py    # Wholesale features
├── review_routes.py       # Review system
├── email_routes.py        # Email automation
├── newsletter_routes.py   # Newsletter management
├── myob_routes.py        # MYOB integration
├── admin_routes.py       # Admin endpoints
└── gdpr_routes.py        # GDPR compliance
```

#### CMS Endpoints (Modular Blueprint System)
```
backend/app/cms/
├── __init__.py           # Blueprint registration
├── admin/               # Admin management
│   └── orders.py        # Order admin endpoints
├── commerce/            # Commerce operations
│   ├── checkout.py      # Checkout calculations
│   ├── orders.py        # Order lookup/details
│   └── webhooks.py      # Stripe/PayPal webhooks
├── customers/           # Customer management
│   ├── customers.py     # Customer CRUD
│   ├── newsletter.py    # Newsletter subscribe/unsubscribe
│   └── wholesale.py     # Wholesale login/pricing
└── marketing/           # Marketing tools
    └── newsletter.py    # Newsletter export/stats
```

### 2. Keeping in Sync
After making changes:

```bash
# For Commerce endpoints:
# 1. Update the contract if API changes
vim /shared-contracts/api-contracts/commerce/[domain]-endpoints.md

# 2. Run sync script
python /manifests/tools/sync-commerce-endpoints.py

# 3. Update TypeScript types if needed
vim /shared-contracts/data-schemas/commerce-v1.types.ts

# For CMS endpoints:
# 1. Update the CMS contract
vim /shared-contracts/api-contracts/cms-endpoints-v1.md

# 2. Run CMS sync script
python /manifests/tools/sync-cms-endpoints.py

# 3. Update CMS TypeScript types
vim /shared-contracts/data-schemas/cms-v1.types.ts

# 4. Regenerate manifests
python /manifest-system/generators/subsystems/cms/generate-cms-manifest.py

# 5. Commit changes
git add -A && git commit -m "feat: update CMS/commerce API"
```

### 3. Testing

#### Test Endpoints
- `/api/test/reset-db` - Reset test data
- `/api/test/create-order` - Create test order
- `/api/test/health` - Health check

#### Test Scripts
```bash
# Test Commerce endpoints
bash /shared-contracts/integration-specs/test-commerce-endpoints.sh [local|dev|prod]

# Test CMS endpoints
bash /shared-contracts/integration-specs/test-cms-endpoints.sh [local|dev|prod]
```

## Versioning

Current versions:
- **Commerce API**: v1.0
- **CMS API**: v1.0

Version in URL is optional:
- `/api/payment/...` (defaults to v1)
- `/api/v1/payment/...` (explicit v1)
- `/api/v2/payment/...` (future v2)
- `/api/cms/...` (CMS endpoints always v1)

## Common Issues

### 1. Authentication Errors
- Check API key is correct for environment and system (CMS vs Commerce)
- Ensure JWT token hasn't expired (24 hour expiry for wholesale)
- Verify admin token for admin endpoints
- Wholesale accounts are hardcoded (see cms-v1.types.ts)

### 2. CORS Issues
Allowed origins:
- `http://localhost:3000` (development)
- `https://dev.latitude36.com.au` (staging)
- `https://latitude36.com.au` (production)

### 3. Rate Limiting
- Public: 100 req/min
- Authenticated: 300 req/min
- Payment: 10 req/min

## Support

- **Issues**: GitHub Issues
- **Docs**: This guide + contract files
- **Contact**: dev@latitude36.com.au

## CMS System Features

### Order Management (Phase 4)
- Order lookup by email and order number
- Detailed order information with MYOB sync status
- Admin order management (status updates, tracking)
- Webhook processing for Stripe and PayPal

### Customer Management (Phase 5)
- Customer create-or-get for checkout
- Wholesale customer login with JWT
- Wholesale pricing (direct from MYOB)
- Order history for wholesale accounts

### Newsletter System (Phase 7)
- Newsletter subscription/unsubscription
- Mailchimp export (CSV format)
- Newsletter statistics and segments
- Manual subscription by admin

### MYOB Integration
- Product sync (40+ products)
- Wholesale and retail pricing
- Stock level synchronization
- Invoice creation for orders
- Customer UID mapping

---

*Last Updated: 2025-08-17*