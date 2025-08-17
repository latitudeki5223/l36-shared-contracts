# L36 Commerce API Endpoints Specification

Version: 1.0  
Last Updated: 2025-01-16  
Status: Development

## Overview

The L36 Commerce API provides a comprehensive e-commerce system for the Latitude36 platform, handling payments, orders, customers, reviews, and integrations with external services (Stripe, PayPal, MYOB).

This specification covers **85 endpoints** organized into 11 functional domains.

## Base Configuration

### Base URLs
- **Development**: `http://localhost:5050/api`
- **Production**: `https://l36.com.au/api`

### Authentication

The Commerce API uses multiple authentication strategies:

#### 1. API Key Authentication (Default)
```http
X-API-Key: {api_key}
```
- Used for: Public endpoints, CVPS integration
- Keys:
  - Development: `l36-commerce-dev-2025`
  - Production: `l36-commerce-prod-2025`

#### 2. JWT Bearer Token (Wholesale)
```http
Authorization: Bearer {jwt_token}
```
- Used for: Wholesale customer endpoints
- Obtained from: `/api/wholesale/login`
- Expiry: 24 hours

#### 3. Admin Authentication
```http
X-Admin-Token: {admin_token}
```
- Used for: Admin-only endpoints
- Requires: Admin user session

## Response Standards

### Success Response
```json
{
  "status": "success",
  "data": {/* endpoint-specific data */},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "status": "error",
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {/* optional error details */}
}
```

### Pagination Response
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "pages": 10,
  "per_page": 10
}
```

## API Domains

### 1. [Payment APIs](./commerce/payment-endpoints.md)
- 8 endpoints
- Stripe and PayPal integration
- Checkout session management
- Webhook processing

### 2. [Order APIs](./commerce/order-endpoints.md)
- 5 endpoints
- Order creation and lookup
- Status tracking
- Order history

### 3. [Customer APIs](./commerce/customer-endpoints.md)
- 5 endpoints
- Customer management
- Address management
- Customer profiles

### 4. [Wholesale APIs](./commerce/wholesale-endpoints.md)
- 4 endpoints
- Wholesale authentication
- Special pricing
- Bulk orders

### 5. [Review APIs](./commerce/review-endpoints.md)
- 5 endpoints
- Product reviews
- Verified purchase tracking
- Helpful voting

### 6. [Newsletter APIs](./commerce/newsletter-endpoints.md)
- 7 endpoints
- Subscription management
- Preferences
- Admin exports

### 7. [Email Automation APIs](./commerce/email-endpoints.md)
- 16 endpoints
- Template management
- Queue monitoring
- Analytics

### 8. [Product APIs](./commerce/product-endpoints.md)
- 5 endpoints
- Stock management
- Product search
- Stock alerts

### 9. [Admin APIs](./commerce/admin-endpoints.md)
- 10 endpoints
- Order management
- Review moderation
- Reports and analytics

### 10. [MYOB Integration APIs](./commerce/myob-endpoints.md)
- 8 endpoints
- OAuth flow
- Inventory sync
- Sales recording

### 11. [GDPR/Privacy APIs](./commerce/gdpr-endpoints.md)
- 2 endpoints
- Data export
- Data deletion

## Rate Limiting

| Endpoint Category | Rate Limit | Window |
|------------------|------------|---------|
| Public endpoints | 100 requests | 1 minute |
| Authenticated | 300 requests | 1 minute |
| Payment endpoints | 10 requests | 1 minute |
| Admin endpoints | No limit | - |
| Webhooks | No limit | - |

## Versioning Strategy

All endpoints include version in the URL path:
- Current: `/api/v1/...` (optional, defaults to v1)
- Future: `/api/v2/...`

Version changes follow semantic versioning:
- **Major** (v1 → v2): Breaking changes
- **Minor** (1.0 → 1.1): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes

## Security Considerations

1. **HTTPS Required**: All production endpoints require HTTPS
2. **CORS**: Configured for `dev.latitude36.com.au` and `latitude36.com.au`
3. **Input Validation**: All inputs sanitized and validated
4. **SQL Injection**: Parameterized queries only
5. **XSS Protection**: Output encoding on all responses
6. **Rate Limiting**: Per-IP and per-key limits
7. **Audit Logging**: All state changes logged

## Webhook Security

Webhooks from external services are validated using:
- **Stripe**: Signature verification with webhook secret
- **PayPal**: Certificate validation
- **MYOB**: OAuth token validation
- **Email Providers**: IP whitelist + signature

## Migration from Legacy

For systems migrating from legacy endpoints:
1. Both old and new endpoints active during transition
2. Deprecation warnings in headers
3. 6-month deprecation period
4. Migration guide provided

## Testing

### Test Endpoints
Available in development only:
- `GET /api/test/reset-db` - Reset test data
- `GET /api/test/create-order` - Create test order
- `GET /api/test/health` - Health check

### Postman Collection
Available at: `/shared-contracts/testing/l36-commerce.postman_collection.json`

## Support

- **Documentation**: This specification
- **Issues**: GitHub Issues
- **Contact**: dev@latitude36.com.au

## Change Log

### Version 1.0 (2025-01-16)
- Initial release
- 85 endpoints across 11 domains
- Full commerce system implementation

---

*For detailed endpoint specifications, see the individual domain documents linked above.*