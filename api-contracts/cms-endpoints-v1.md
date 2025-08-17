# CMS API Specification v1.0

## Overview

Content Management System endpoints for L36 MVPS internal operations. These endpoints handle checkout, order management, customer accounts, wholesale operations, and newsletter management.

**Base URL**: `http://localhost:5050/api/cms`  
**Version**: 1.0  
**Last Updated**: 2025-08-17

## Authentication

### Methods

1. **API Key** (public endpoints)
   ```http
   X-API-Key: l36-cms-dev-2025
   ```

2. **JWT Token** (wholesale customers)
   ```http
   Authorization: Bearer <jwt_token>
   ```

3. **Admin Auth** (admin endpoints)
   ```http
   X-Admin-Token: <admin_token>
   ```

## Modules

### 1. Commerce Module (`/api/cms/commerce`)

#### Checkout Endpoints

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/checkout/session` | Create payment session (Stripe/PayPal) | API Key | `app/cms/commerce/checkout.py:24` |
| POST | `/checkout/calculate` | Calculate totals with tax/shipping | API Key | `app/cms/commerce/checkout.py:123` |

#### Order Management

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/orders/lookup` | Find order by email & order number | API Key | `app/cms/commerce/orders.py:62` |
| GET | `/orders/<int:id>` | Get full order details | API Key | `app/cms/commerce/orders.py:110` |

#### Webhook Handlers

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/webhooks/stripe` | Stripe payment webhook | Stripe Sig | `app/cms/commerce/webhooks.py:35` |
| POST | `/webhooks/paypal` | PayPal payment webhook | PayPal Verify | `app/cms/commerce/webhooks.py:157` |

### 2. Customers Module (`/api/cms/customers`)

#### Account Management

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/create-or-get` | Find or create customer | API Key | `app/cms/customers/accounts.py:34` |
| GET | `/<int:customer_id>` | Get customer details | API Key | `app/cms/customers/accounts.py:145` |

#### Wholesale Operations

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/wholesale/login` | Wholesale account login | None | `app/cms/customers/wholesale.py:141` |
| GET | `/wholesale/pricing` | Get wholesale prices from MYOB | JWT | `app/cms/customers/wholesale.py:219` |
| GET | `/wholesale/orders` | Wholesale order history | JWT | `app/cms/customers/wholesale.py:262` |
| GET | `/wholesale/account` | Get wholesale account details | JWT | `app/cms/customers/wholesale.py:331` |

#### Newsletter

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/newsletter/subscribe` | Subscribe to newsletter | API Key | `app/cms/customers/accounts.py:190` |
| GET | `/newsletter/unsubscribe/<token>` | Unsubscribe via token | None | `app/cms/customers/accounts.py:252` |

### 3. Marketing Module (`/api/cms/marketing`)

#### Newsletter Management

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/newsletter/export` | Export subscribers as CSV | Admin | `app/cms/marketing/newsletter.py:29` |
| GET | `/newsletter/stats` | Get subscription statistics | Admin | `app/cms/marketing/newsletter.py:131` |
| POST | `/newsletter/manual-subscribe` | Admin manual add | Admin | `app/cms/marketing/newsletter.py:195` |
| GET | `/newsletter/search` | Search subscribers | Admin | `app/cms/marketing/newsletter.py:270` |

### 4. Admin Module (`/api/cms/admin`)

#### Order Administration

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/orders` | List all orders with filtering | Admin | `app/cms/admin/orders.py:36` |
| PATCH | `/orders/<int:id>/status` | Update order status | Admin | `app/cms/admin/orders.py:99` |
| PATCH | `/orders/<int:id>/tracking` | Add/update tracking number | Admin | `app/cms/admin/orders.py:164` |

## Request/Response Examples

### Create Payment Session

**Request:**
```http
POST /api/cms/commerce/checkout/session
Content-Type: application/json
X-API-Key: l36-cms-dev-2025

{
  "items": [
    {
      "name": "Honey Product",
      "price": 25.50,
      "quantity": 2
    }
  ],
  "email": "customer@example.com",
  "payment_method": "stripe",
  "success_url": "https://dev.latitude36.com.au/success",
  "cancel_url": "https://dev.latitude36.com.au/cancel"
}
```

**Response:**
```json
{
  "session_id": "cs_test_xxx",
  "session_url": "https://checkout.stripe.com/pay/cs_test_xxx",
  "payment_method": "stripe"
}
```

### Wholesale Login

**Request:**
```http
POST /api/cms/customers/wholesale/login
Content-Type: application/json

{
  "username": "cliffords",
  "password": "cliffords2025"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "customer": {
    "id": 123,
    "company": "Cliffords Honey Farm",
    "contact": "John Clifford",
    "email": "john@cliffordshoney.com.au",
    "payment_terms": "net30",
    "gets_wholesale_pricing": true
  },
  "message": "Welcome back, John Clifford"
}
```

### Order Lookup

**Request:**
```http
POST /api/cms/commerce/orders/lookup
Content-Type: application/json
X-API-Key: l36-cms-dev-2025

{
  "email": "customer@example.com",
  "order_number": "L36-2025-0001"
}
```

**Response:**
```json
{
  "order_number": "L36-2025-0001",
  "status": "shipped",
  "payment_status": "paid",
  "tracking_number": "AP123456789AU",
  "tracking_url": "https://auspost.com.au/track/details/AP123456789AU",
  "total_amount": 75.50,
  "created_at": "2025-08-15T10:30:00Z",
  "shipped_at": "2025-08-16T14:00:00Z",
  "items": [
    {
      "product_name": "Honey Product",
      "quantity": 2,
      "unit_price": 25.50,
      "total_price": 51.00
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Wholesale Accounts

Five hardcoded wholesale accounts with MYOB integration:

1. **Cliffords Honey Farm**
   - Username: `cliffords`
   - Password: `cliffords2025`
   - MYOB UID: `18d3925f-1838-4142-a8dd-213df6c0eef3`

2. **KI Tourism Alliance**
   - Username: `kitourism`
   - Password: `tourism2025`
   - MYOB UID: `e5560315-e4a4-42fa-b5e6-cd26f1af97ff`

3. **KI Living Honey**
   - Username: `kiliving`
   - Password: `living2025`
   - MYOB UID: `a4a8e3dc-d3db-432b-8e4e-296fae3048a6`

4. **Island Beekeepers Co-op**
   - Username: `beekeepers`
   - Password: `beekeepers2025`
   - MYOB UID: `[CREATE_IN_MYOB]`

5. **Adelaide Central Market**
   - Username: `adelaide`
   - Password: `adelaide2025`
   - MYOB UID: `[CREATE_IN_MYOB]`

## Integration Notes

### MYOB Integration
- Order creation triggers MYOB invoice generation
- Wholesale prices sync from MYOB base prices
- Stock levels update after each sale
- Payment references stored in MYOB invoices

### Payment Processing
- Stripe: Sessions expire after 24 hours
- PayPal: Orders valid for 72 hours
- Both create MYOB invoices on success

### Newsletter
- Collection only - actual sending via Mailchimp
- CSV export is Mailchimp-compatible
- Automatic tagging (customer, wholesale, source)

## Testing

### Test Endpoints
```bash
# Test order lookup
curl -X POST http://localhost:5050/api/cms/commerce/orders/lookup \
  -H "Content-Type: application/json" \
  -H "X-API-Key: l36-cms-dev-2025" \
  -d '{"email": "test@example.com", "order_number": "L36-2025-0001"}'

# Test wholesale login
curl -X POST http://localhost:5050/api/cms/customers/wholesale/login \
  -H "Content-Type: application/json" \
  -d '{"username": "cliffords", "password": "cliffords2025"}'

# Test newsletter subscription
curl -X POST http://localhost:5050/api/cms/customers/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -H "X-API-Key: l36-cms-dev-2025" \
  -d '{"email": "test@example.com", "source": "test"}'
```

## Changelog

### v1.0 (2025-08-17)
- Initial CMS API specification
- Commerce module with checkout and orders
- Customer management with wholesale support
- Newsletter system for Mailchimp integration
- Admin order management endpoints

---

*Generated from implementation in `/home/admin/l36/backend/app/cms/`*