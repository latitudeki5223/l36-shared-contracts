# L36 Platform API Contract
## Version 2.0 - CVPS Processor Standard

This document defines the API contract between the L36 Customer Frontend and the L36 Management System Backend.

For complete endpoint specifications, see [cvps-processor-endpoints.md](./cvps-processor-endpoints.md)

---

## Authentication

All API requests require authentication headers:

```http
X-API-Key: cvps-dev-key-2025
X-Site-ID: latitude36.com.au
```

Production:
```http
X-API-Key: cvps-prod-key-2025
X-Site-ID: latitude36.com.au
```

---

## Base URLs

- **Local Development**: `http://localhost:5050/api/cvps`
- **Development**: `https://api.latitude36.com.au/api/cvps`
- **Production**: `https://l36.com.au/api/cvps`

---

## Available Endpoints

All endpoints are GET-only and follow the CVPS Processor pattern:

1. `/api/cvps/homepage` - Homepage content
2. `/api/cvps/products` - Product catalog with search/filter
3. `/api/cvps/blog` - Blog posts
4. `/api/cvps/categories` - Category hierarchy
5. `/api/cvps/newsletter` - Newsletter configuration
6. `/api/cvps/galleries` - Gallery list
7. `/api/cvps/galleries/{slug}` - Single gallery
8. `/api/cvps/health` - Service health check

---

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { /* endpoint specific data */ },
  "cached_at": "2025-08-02T22:38:26.916997",
  "version": "1.0"
}
```

Error responses:
```json
{
  "error": "string",
  "message": "string",
  "code": 401
}
```

---

## Media URLs

All media URLs are relative paths (`/media/...`). Frontend constructs full URLs:
- Development: `https://api.latitude36.com.au/media/...`
- Production: `https://l36.com.au/media/...`

---

## Implementation Guide

For complete specifications including:
- Request/response examples
- Query parameters
- Data structures
- TypeScript types

See [cvps-processor-endpoints.md](./cvps-processor-endpoints.md)