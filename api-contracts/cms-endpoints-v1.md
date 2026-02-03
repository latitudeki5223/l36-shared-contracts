# CMS API Specification v1.0

## Overview

Content Management System endpoints for L36 MVPS internal operations. These endpoints handle checkout, order management, customer accounts, wholesale operations with MYOB invoicing, newsletter management, and product reviews with AI moderation.

**Base URL**: `http://localhost:5050/api/cms`  
**Version**: 1.1  
**Last Updated**: 2025-08-19  
**Total Endpoints**: 74 (50 CMS + 10 Batch + 8 MYOB + 4 CVPS Wholesale + 2 Balance/Credit)

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
| POST | `/commerce/create-checkout-session` | Create payment session (Stripe/PayPal) | API Key | `app/cms/commerce/checkout.py:24` |
| POST | `/commerce/validate-cart` | Calculate totals with tax/shipping | API Key | `app/cms/commerce/checkout.py:123` |

#### Order Management

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/commerce/orders/lookup` | Find order by email & order number | API Key | `app/cms/commerce/orders.py:62` |
| GET | `/commerce/orders/<int:order_id>` | Get full order details | API Key | `app/cms/commerce/orders.py:110` |
| GET | `/commerce/orders/by-session/<session_id>` | Get order by Stripe session ID | API Key | `app/cms/commerce/orders.py:194` |

#### Webhook Handlers

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/commerce/webhook/stripe` | Stripe payment webhook | Stripe Sig | `app/cms/commerce/webhooks.py:35` |
| POST | `/commerce/webhook/paypal` | PayPal payment webhook | PayPal Verify | `app/cms/commerce/webhooks.py:157` |

### 2. Customers Module (`/api/cms/customers`)

#### Account Management

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/customers/create-or-get` | Find or create customer | API Key | `app/cms/customers/accounts.py:34` |
| GET | `/customers/<int:customer_id>` | Get customer details | API Key | `app/cms/customers/accounts.py:145` |

#### Wholesale Operations

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/customers/wholesale/login` | Wholesale account login | None | `app/cms/customers/wholesale.py:82` |
| GET | `/customers/wholesale/pricing` | Get wholesale prices from MYOB | JWT | `app/cms/customers/wholesale.py:172` |
| GET | `/customers/wholesale/orders` | Wholesale order history | JWT | `app/cms/customers/wholesale.py:214` |
| GET | `/customers/wholesale/account` | Get wholesale account details | JWT | `app/cms/customers/wholesale.py:279` |
| POST | `/customers/wholesale/forgot-password` | Request password reset | None | `app/cms/customers/wholesale.py:322` |
| POST | `/customers/wholesale/reset-password` | Reset password with token | None | `app/cms/customers/wholesale.py:372` |
| POST | `/customers/wholesale/change-password` | Change password (authenticated) | JWT | `app/cms/customers/wholesale.py:432` |
| POST | `/customers/wholesale/orders/create` | Create wholesale order with notes | JWT | `app/cms/customers/wholesale_orders.py:33` |
| GET | `/customers/wholesale/orders/<int:order_id>` | Get wholesale order details | JWT | `app/cms/customers/wholesale_orders.py:147` |
| POST | `/customers/wholesale/orders/<int:order_id>/add-note` | Add/update order notes | JWT | `app/cms/customers/wholesale_orders.py:212` |
| GET | `/customers/wholesale/balance` | Get account balance from MYOB | JWT | `app/cms/customers/wholesale.py:487` |
| POST | `/customers/wholesale/check-credit` | Check credit limit before order | JWT | `app/cms/customers/wholesale.py:537` |

#### Newsletter

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/customers/newsletter/subscribe` | Subscribe to newsletter | API Key | `app/cms/customers/accounts.py:190` |
| GET | `/customers/newsletter/unsubscribe/<token>` | Unsubscribe via token | None | `app/cms/customers/accounts.py:252` |

#### Email Preferences

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/customers/email-preferences` | Get customer email preferences | Bearer Token | `app/cms/customers/email_preferences.py:53` |
| PUT | `/customers/email-preferences` | Update customer email preferences | Bearer Token | `app/cms/customers/email_preferences.py:98` |
| GET | `/customers/email-history` | Get customer email history | Bearer Token | `app/cms/customers/email_preferences.py:179` |
| GET | `/customers/unsubscribe/<token>` | Verify unsubscribe token | None | `app/cms/customers/email_preferences.py:287` |
| POST | `/customers/unsubscribe/<token>` | Process unsubscribe request | None | `app/cms/customers/email_preferences.py:287` |
| POST | `/customers/generate-unsubscribe-link` | Generate unsubscribe link | Bearer Token | `app/cms/customers/email_preferences.py:402` |
| GET | `/customers/can-review/<int:product_id>` | Check if customer can review product | Bearer Token | `app/cms/customers/email_preferences.py:256` |

#### Reviews

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/customers/reviews` | Submit product review with AI processing | API Key | `app/cms/customers/reviews.py:170` |
| POST | `/customers/reviews/<int:review_id>/reply` | Manual reply to review | Admin | `app/cms/customers/reviews.py:343` |
| POST | `/customers/reviews/<int:review_id>/quick-reply` | Generate AI reply suggestion | Admin | `app/cms/customers/reviews.py:460` |
| PATCH | `/customers/reviews/<int:review_id>/approve` | Approve pending review | Admin | `app/cms/customers/reviews.py:406` |
| PATCH | `/customers/reviews/<int:review_id>/testimonial` | Toggle testimonial status | Admin | `app/cms/customers/reviews.py:435` |

### 3. Marketing Module (`/api/cms/marketing`)

#### Newsletter Management

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/marketing/newsletter/export` | Export subscribers as CSV | Admin | `app/cms/marketing/newsletter.py:29` |
| GET | `/marketing/newsletter/stats` | Get subscription statistics | Admin | `app/cms/marketing/newsletter.py:131` |
| POST | `/marketing/newsletter/manual-subscribe` | Admin manual add | Admin | `app/cms/marketing/newsletter.py:195` |
| GET | `/marketing/newsletter/search` | Search subscribers | Admin | `app/cms/marketing/newsletter.py:270` |

#### Testimonials

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/marketing/testimonials` | Get featured testimonials for homepage | None | `app/marketing_routes.py:442` |

### 4. Admin Module (`/api/cms/admin`)

#### Order Administration

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/admin/orders` | List all orders with filtering | Admin | `app/cms/admin/orders.py:36` |
| PATCH | `/admin/orders/<int:order_id>/status` | Update order status | Admin | `app/cms/admin/orders.py:99` |
| PATCH | `/admin/orders/<int:order_id>/tracking` | Add/update tracking number | Admin | `app/cms/admin/orders.py:164` |

## Additional Review Endpoints

These endpoints are outside the CMS module but part of the review system:

### Product Reviews Display

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/api/products/<int:id>/reviews` | Get approved reviews for product | None | `app/product_routes.py:3004` |

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
  "success_url": "https://latitude36.com.au/success",
  "cancel_url": "https://latitude36.com.au/cancel"
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

## 7. Batch Production Module (`/api/batches`)

### Recipe Group Management

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/recipe-group/<int:id>/products` | Get products in recipe group with sizes | None | `app/batch_routes.py:489` |

### Batch Operations

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/recipe-group/<int:id>` | Create multi-size batch for recipe group | None | `app/batch_routes.py:397` |
| POST | `/recipe/<int:recipe_id>` | Create single product batch | None | `app/batch_routes.py:65` |
| GET | `/recipe/<int:recipe_id>` | Get batches for a recipe | None | `app/batch_routes.py:18` |
| GET | `/<int:batch_id>` | Get specific batch details | None | `app/batch_routes.py:220` |
| PUT | `/<int:batch_id>` | Update batch (ingredients, notes) | None | `app/batch_routes.py:240` |
| POST | `/<int:batch_id>/complete` | Complete batch (triggers MYOB) | None | `app/batch_routes.py:303` |
| DELETE | `/<int:batch_id>` | Delete batch | None | `app/batch_routes.py:365` |

## 8. MYOB Integration Module (`/api/myob`)

### Authentication & Status

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/auth` | Generate OAuth authorization URL | JWT | `app/myob_routes.py:19` |
| GET | `/callback` | OAuth callback handler | None | `app/myob_routes.py:44` |
| GET | `/status` | Check MYOB integration status | None | `app/myob_routes.py:178` |

### Inventory Operations

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/inventory/sync` | Pull inventory FROM MYOB | JWT | `app/myob_routes.py:94` |
| POST | `/inventory/adjustment` | Create inventory adjustment | **None** | `app/myob_routes.py:281` |
| POST | `/inventory/sync-to-myob` | Push changes TO MYOB | JWT | `app/myob_routes.py:314` |
| POST | `/inventory/bulk-adjust` | Bulk stocktake adjustments | JWT | `app/myob_routes.py:344` |
| POST | `/inventory/match` | Match products with MYOB UIDs | JWT | `app/myob_routes.py:212` |

### Sales Recording

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| POST | `/sales/record` | Record sale invoice in MYOB | JWT | `app/myob_routes.py:146` |

## 9. Product Stock Management (`/api/products`)

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/recipe-groups` | List all recipe groups | None | `app/product_routes.py:1327` |
| PATCH | `/<int:id>/stock` | Update product stock (adjustment) | None | `app/product_routes.py:436` |

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

## CVPS Wholesale Endpoints

### Overview
Protected B2B endpoints for CVPS that require wholesale authentication. These endpoints provide product data with wholesale pricing for authenticated B2B customers.

**Base URL**: `http://localhost:5050/api/cvps/wholesale`  
**Authentication**: JWT Bearer token from wholesale login

### Endpoints

| Method | Endpoint | Description | Auth | Implementation |
|--------|----------|-------------|------|----------------|
| GET | `/products` | Get all products with wholesale pricing | JWT | `app/cvps_processor/wholesale_routes.py:122` |
| GET | `/products/search` | Search products with wholesale pricing | JWT | `app/cvps_processor/wholesale_routes.py:169` |
| GET | `/products/<int:id>` | Get single product with wholesale pricing | JWT | `app/cvps_processor/wholesale_routes.py:235` |
| GET | `/categories` | Get categories with wholesale product counts | JWT | `app/cvps_processor/wholesale_routes.py:277` |

### Response Format

Products include both retail and wholesale pricing:

```json
{
  "success": true,
  "products": [{
    "id": 1,
    "name": "Premium Honey",
    "price": {
      "retail": 10.00,
      "wholesale": 5.00,
      "savings": 5.00,
      "savings_percentage": 50.0
    },
    "minOrderQuantity": 6,
    "images": {
      "main": {"url": "/media/...", "alt": "..."},
      "gallery": [...]
    },
    "tags": ["organic", "local"],
    "stockQuantity": 100
  }],
  "customer": {
    "company": "Cliffords Honey Farm",
    "paymentTerms": "30",
    "creditLimit": 5000.00,
    "outstandingBalance": 1250.00
  }
}
```

### Security Notes
- Public CVPS endpoints (`/api/cvps/products`) no longer include wholesale prices
- Wholesale prices are only accessible via authenticated endpoints
- JWT tokens expire after 24 hours
- Same token used for both CMS and CVPS wholesale endpoints

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