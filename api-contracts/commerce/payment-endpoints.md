# Payment API Endpoints

Part of: L36 Commerce API v1.0

## Overview
Payment processing endpoints for Stripe and PayPal integration.

## Endpoints

### 1. Create Payment Session
```http
POST /api/payment/create-session
```

**Purpose**: Initialize a payment session with Stripe or PayPal

**Request Body**:
```json
{
  "cart_items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 2999
    }
  ],
  "customer_email": "customer@example.com",
  "payment_method": "stripe" | "paypal"
}
```

**Response**:
```json
{
  "session_id": "cs_test_...",
  "client_secret": "pi_..._secret_...",
  "payment_method": "stripe"
}
```

---

### 2. Create Checkout Session (Stripe Alternative)
```http
POST /api/create-checkout-session
```

**Purpose**: Stripe-specific checkout session creation

**Request Body**:
```json
{
  "items": [...],
  "success_url": "https://latitude36.com.au/success",
  "cancel_url": "https://latitude36.com.au/cart"
}
```

**Response**:
```json
{
  "sessionId": "cs_test_..."
}
```

---

### 3. Validate Cart
```http
POST /api/payment/validate-cart
```

**Purpose**: Pre-checkout validation of cart items

**Request Body**:
```json
{
  "cart_items": [...]
}
```

**Response**:
```json
{
  "valid": true,
  "errors": [],
  "total": 5998,
  "tax": 545,
  "shipping": 1000
}
```

---

### 4. Check Payment Status
```http
GET /api/payment/session/{session_id}
```

**Purpose**: Check the status of a payment session

**Response**:
```json
{
  "status": "completed" | "pending" | "failed",
  "order_id": "L36-2025-001",
  "payment_intent": "pi_..."
}
```

---

### 5. Stripe Webhook
```http
POST /api/payment/webhook
```

**Purpose**: Handle Stripe webhook events

**Headers**:
```http
Stripe-Signature: t=...,v1=...
```

**Request Body**: Stripe Event object

**Response**:
```json
{
  "received": true
}
```

---

### 6. Get Stripe Config
```http
GET /api/stripe/config
```

**Purpose**: Get Stripe publishable key for frontend

**Response**:
```json
{
  "publishable_key": "pk_test_..."
}
```

---

### 7. Get PayPal Config
```http
GET /api/paypal/config
```

**Purpose**: Get PayPal client ID for frontend

**Response**:
```json
{
  "client_id": "AZD..."
}
```

---

### 8. PayPal Webhook
```http
POST /api/paypal/webhook
```

**Purpose**: Handle PayPal webhook events

**Request Body**: PayPal Event object

**Response**:
```json
{
  "status": "ok"
}
```

## Checkout and refund refusals (live routes, epic checkout-money-correctness #5850)

The storefront checkout routes are `POST /api/cms/commerce/create-checkout-session` (Stripe) and
`POST /api/cms/commerce/create-paypal-order` (PayPal). A refusal creates **no order and no payment
session**, and the discount code's `times_used` is not raised.

| Status | Body | When |
|--------|------|------|
| 400 | `{"error": "Sorry, we currently only ship within Australia."}` | Shipping country is not Australia (a blank country counts as Australia) |
| 400 | `{"success": false, "error": "<code message>"}` | Discount code not found, expired, used up or under its minimum spend |
| 400 | `{"success": false, "error": "Order total is below the card minimum of $0.50."}` | Stripe only: card total $0.01–$0.49 |
| 500 | `{"success": false, "error": "Card total did not match the order — no payment was taken"}` | Stripe only: the cents built for Stripe (line items − coupon) differ from the order total. Kitchen-slip label `amount_mismatch` |
| 503 | `{"success": false, "error": "Shipping is not available for this store yet."}` | The store has no flat shipping rate in context config. Kitchen-slip label `shipping_not_configured` |

- The shipping price is always the store's `site_branding.shipping_flat_rate_price`. A `shipping_cost`
  in the request is ignored.
- `GET /api/shipping/quote` answers 503 `{"success": false, "error": "shipping_not_configured"}` for a store
  with no rate.

**Refunds** — `POST /api/cms/commerce/orders/<id>/refund` (admin): a Stripe refund larger than what the
PaymentIntent received, less what is already refunded, is refused **before** Stripe is called:
400 `{"error": "refund_exceeds_amount_received"}`. An unreadable PaymentIntent is refused the same way.

**After payment** — the Stripe webhook compares `amount_total` with the order. A difference is recorded
on the order (`system_flags.stripe_amount_check`, `needs_attention`) and alerts the owner once. The order
still fulfils, and the webhook still answers 200.

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CART` | Cart validation failed |
| `PAYMENT_FAILED` | Payment processing failed |
| `SESSION_EXPIRED` | Payment session expired |
| `INVALID_WEBHOOK` | Webhook signature validation failed |

## Security Notes

1. Webhook endpoints validate signatures
2. Session IDs expire after 24 hours
3. Client secrets are single-use
4. All amounts in cents (e.g., $10.00 = 1000)