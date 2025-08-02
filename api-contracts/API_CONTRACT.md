# L36 Platform API Contract - DEPRECATED
## ⚠️ THIS DOCUMENT IS DEPRECATED - See cvps-processor-endpoints.md

**IMPORTANT:** This document contains legacy endpoint patterns that are being phased out. 

For the current API specification, please refer to:
- **[cvps-processor-endpoints.md](./cvps-processor-endpoints.md)** - Current CVPS Processor API v2.0

---

## Migration Status

As of 2025-08-02, the platform has migrated to the CVPS Processor pattern:

### ✅ Active System (CVPS Processor)
- 8 consolidated endpoints at `/api/cvps/*`
- GET-only operations
- Optimized for single API calls per page
- See [cvps-processor-endpoints.md](./cvps-processor-endpoints.md)

### ❌ Legacy System (Being Deprecated)
- Multiple granular endpoints (`/api/content/*`, `/api/data/*`, `/api/products/*`)
- Mixed GET/POST operations
- Required multiple API calls per page
- Still partially functional but not recommended

---

## Authentication Changes

### Current (CVPS Processor):
```http
X-API-Key: cvps-dev-key-2025
X-Site-ID: dev.latitude36.com.au
```

### Legacy (Deprecated):
```http
X-API-Key: {old-api-key}
X-Site-ID: latitude36
```

---

## Endpoint Migration Guide

| Legacy Endpoint | CVPS Processor Replacement | Notes |
|----------------|---------------------------|-------|
| `/api/content/homepage` | `/api/cvps/homepage` | Consolidated response |
| `/api/data/products` | `/api/cvps/products` | Includes pagination |
| `/api/data/categories` | `/api/cvps/categories` | Hierarchical structure |
| `/api/data/blog/posts` | `/api/cvps/blog` | Includes media |
| `/api/content/product/{id}` | **NOT IMPLEMENTED** | Use `/api/cvps/products?search=` |
| `/api/content/category/{id}` | **NOT IMPLEMENTED** | Use `/api/cvps/products?category=` |
| `/api/content/blog/{id}` | **NOT IMPLEMENTED** | Use `/api/cvps/blog` and filter |

---

## Important Notes

1. **Frontend teams** should migrate to CVPS Processor endpoints immediately
2. **Legacy endpoints** may be removed without notice
3. **Individual item endpoints** (`/product/{id}`, `/category/{slug}`, `/blog/{slug}`) do not exist in CVPS Processor
4. All new development must use CVPS Processor pattern

For the complete, current API specification, see [cvps-processor-endpoints.md](./cvps-processor-endpoints.md)