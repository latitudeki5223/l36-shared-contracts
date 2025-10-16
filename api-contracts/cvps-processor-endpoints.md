# CVPS Processor API Endpoints Specification

Version: 4.1 - Public Access Architecture
Last Updated: 2025-10-06

## Overview

The CVPS Processor provides **24 optimized endpoints** (20 public content + 4 wholesale) that consolidate data from multiple sources into single, efficient API calls. These endpoints are designed specifically for the Customer-facing VPS (CVPS) frontend, deployed across staging and production environments.

### Version 4.1 Breaking Changes
- **AUTHENTICATION REMOVED**: Most endpoints are now PUBLIC (no API key required)
- **New Endpoints**: Added shipping, business-info, address validation, bestsellers, and site-config
- **Wholesale Module**: Separate authenticated endpoints for B2B customers
- **Total Endpoints**: Increased from 15 to 24

## Authentication

### Public Endpoints (No Authentication Required)
The following 20 endpoints are completely public and require NO authentication headers:
- All content endpoints (homepage, products, blog, etc.)
- Shipping information
- Business information
- Site configuration
- Best-selling products
- Address validation
- Health check

### Wholesale Endpoints (JWT Authentication)
The 4 wholesale endpoints require JWT Bearer token authentication:
```http
Authorization: Bearer {jwt_token}
```

Wholesale endpoints are available at: `/api/cvps/wholesale/*`

## Base URL

The CVPS processor endpoints are available at:
```
{BASE_URL}/api/cvps
```

Where `{BASE_URL}` is the environment-specific MVPS domain:
- Staging environments use their staging domain
- Production environments use their production domain
- Local development uses localhost with appropriate port

## Multi-Tenant Support 🆕

**Status**: ✅ **COMPLETE for Public Routes** (20/20), ⚠️ **IN PROGRESS for Wholesale Routes** (0/4)

All CVPS public endpoints fully support multi-tenant isolation via the `context_id` parameter:

```http
GET /api/cvps/products?context_id=1
GET /api/cvps/homepage?context_id=2
GET /api/cvps/categories?context_id=3
```

### Context ID Parameter

**Parameter**: `context_id` (optional query parameter)
- **Type**: Integer
- **Default**: 1 (Latitude36)
- **Range**: 1 to N (where N = number of active contexts)
- **Purpose**: Isolates data to specific website/brand

### Usage

**Frontend Detection** (Recommended):
```javascript
// Domain-based context detection
const getContextId = () => {
  const hostname = window.location.hostname;
  const SITE_CONFIG = {
    'staging.latitude36.com.au': 1,
    'dropship.example.com': 2,
    'directory.example.com': 3
  };
  return SITE_CONFIG[hostname] || 1;
};

// Add to all API calls
const contextId = getContextId();
fetch(`${API_URL}/api/cvps/products?context_id=${contextId}`);
```

**Manual Override** (Testing/Admin):
```http
GET /api/cvps/products?context_id=2
```

### Context Isolation

Each context has **completely isolated** data:
- Products, categories, galleries
- Customers, orders, reviews
- Content, blog posts, media
- Marketing campaigns, newsletters
- All site-specific information

**Example**:
```http
GET /api/cvps/products?context_id=1  → Returns 50 Latitude36 products
GET /api/cvps/products?context_id=2  → Returns 0 products (different site)
```

### Database Architecture

**Migration v102 + v103** (Completed 2025-10-12):
- **114 tables** with context_id isolation
- **117 indexes** for performance (idx_{table}_context)
- **112 FK constraints** to business_contexts table
- **2,694 rows** backfilled to context_id=1 (Latitude36)
- **Database version**: 103

### Implementation Status

**✅ Complete**:
- Database schema with context_id columns (114 tables)
- Performance indexes on all context_id columns (117 indexes)
- FK constraints for referential integrity (112 constraints)
- All existing data backfilled to context_id=1 (2,694 rows)
- **Public CVPS routes** - All 20 public endpoints support context_id
- **Backend aggregators** - All public aggregators context-aware

**🟡 In Progress**:
- **Wholesale CVPS routes** - Context_id extraction from JWT pending
- MVPS management routes (Phase 3)

**⏳ Pending**:
- Frontend domain detection (Phase 4)
- Traefik multi-domain routing (Phase 5)

### Business Contexts Registry

All contexts are registered in the `business_contexts` table:

| ID | Business Name | Domain | Status |
|----|---------------|--------|--------|
| 1 | Latitude 36 | staging.latitude36.com.au | Active |
| 2 | Dropship Site | dropship.example.com | Future |
| 3 | Directory | directory.example.com | Future |

### Migration Information

- **Migration v102**: Added context_id to products, categories, galleries + AI-SEO fields
- **Migration v103**: Added context_id to 106 additional tables (customers, orders, reviews, etc.)
- **Documentation**: `/docs/MULTI_TENANT_ARCHITECTURE.md`
- **ZEN Project**: `/multi-tenant/zen/project-plan.md`

## Response Format

All endpoints return consistent JSON responses:

```json
{
  "success": true,
  "cached_at": "2025-10-06T08:59:00.000Z",
  "data": {/* endpoint-specific data */}
}
```

### Error Response Format:
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "code": 400,
  "service": "cvps_processor"
}
```

## Caching Strategy

All endpoints implement intelligent caching with appropriate TTLs:
- **Homepage**: 5 minutes
- **Products**: 10 minutes
- **Enhanced Search**: 10 minutes
- **Blog Posts**: 3 minutes
- **Categories**: 30 minutes
- **Newsletter**: 15 minutes
- **Galleries**: 5 minutes
- **Individual Items**: 15-30 minutes
- **Shipping**: 24 hours
- **Business Info**: 24 hours

## Public Content Endpoints (20)

### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "cvps_processor",
  "database": "connected",
  "cache": {
    "enabled": true,
    "memory_used": "1.11M",
    "hits": 1,
    "misses": 1
  },
  "version": "2.0",
  "endpoints_available": 24,
  "features": [
    "product_tagging",
    "enhanced_search",
    "price_filtering",
    "multi_category_support",
    "tag_categories",
    "wholesale_module",
    "address_validation"
  ],
  "timestamp": "2025-10-06T08:59:00.000Z"
}
```

### 2. Shipping Information ⭐ NEW
```http
GET /shipping
```

**Response:**
```json
{
  "success": true,
  "shipping": {
    "cost": 15.00,
    "currency": "AUD",
    "method": "Standard Shipping",
    "estimated_days": "3-7 business days",
    "free_shipping_threshold": 100.00,
    "notes": "Free shipping on orders over $100"
  },
  "cached_at": "2025-10-06T08:59:00.000Z"
}
```

### 3. Homepage Content
```http
GET /homepage
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Welcome to Latitude 36",
      "subtitle": "Pure honey from Kangaroo Island",
      "backgroundImage": {"url": "/media/homepage/hero.jpg", "alt": "Hero background"},
      "primaryCTA": {"text": "Shop Now", "link": "/shop"},
      "secondaryCTA": {"text": "Learn More", "link": "/about"}
    },
    "textSlider": {"text": "Pure • Natural • Sustainable • Local"},
    "welcomeBanner": {/* welcome section */},
    "features": {/* features section */},
    "testimonials": {/* testimonials */},
    "categoryGrid": {/* category preview */},
    "featuredProducts": {/* featured products config */},
    "blogSection": {/* blog preview config */},
    "pressSection": {/* media mentions */},
    "seo": {/* SEO metadata */}
  },
  "cached_at": "2025-10-06T08:59:00.000Z",
  "version": "1.0"
}
```

### 4. Product Catalog
```http
GET /products
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (1-100, default: 20)
- `category`: Filter by category slug
- `search`: Text search in name/description

**Response Structure:**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Pure Kangaroo Island Honey",
      "slug": "pure-kangaroo-island-honey",
      "shortDescription": "Raw honey from pristine Kangaroo Island",
      "longDescription": "Detailed product description...",
      "price": {"website": 15.50, "wholesale": 12.00},
      "category": {"name": "Raw Honey", "slug": "raw-honey"},
      "images": {
        "main": {"url": "/media/products/honey-main.jpg", "alt": "Main product image"},
        "thumbnails": [
          {"url": "/media/products/honey-thumb1.jpg", "alt": "Thumbnail 1"}
        ]
      },
      "videos": [/*video data if available*/],
      "isActive": true,
      "tags": ["raw", "kangaroo-island", "pure"],
      "searchTerms": ["honey", "raw honey", "pure honey"],
      "tagCategories": {
        "type": ["raw", "pure"],
        "origin": ["kangaroo-island"],
        "benefits": ["natural", "healthy"]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 46,
    "total_pages": 3
  },
  "filters": {
    "tags": ["raw", "pure", "organic", "wildflower"],
    "tag_categories": [
      {
        "name": "Type",
        "description": "Honey varieties and processing types",
        "color": "#FFB800",
        "tags": ["raw", "pure", "creamed", "liquid"]
      }
    ],
    "price_range": {"min": 7.5, "max": 33.5, "average": 15.55}
  },
  "cached_at": "2025-10-06T08:59:00.000Z"
}
```

### 5. Enhanced Product Search
```http
GET /products/search
```

**Query Parameters:**
- `q`: Search query (alternative to search)
- `search`: Text search in name/description/search_terms
- `tags[]`: Multiple tag filters (e.g., `?tags=honey&tags=lavender`)
- `categories[]`: Multiple category filters
- `price_min`: Minimum price filter (float)
- `price_max`: Maximum price filter (float)
- `page`: Page number (default: 1)
- `per_page`: Items per page (1-100, default: 20)
- `sort_by`: Sort field (`name`, `price`, `created`, `popularity`)
- `sort_order`: Sort direction (`asc`, `desc`)

### 6. Blog Posts
```http
GET /blog
```

**Query Parameters:**
- `limit`: Number of posts (default: 3, max: 50)

### 7. Categories
```http
GET /categories
```

### 8. Newsletter Configuration
```http
GET /newsletter
```

### 9. Galleries
```http
GET /galleries
```

**Query Parameters:**
- `limit`: Number of galleries (default: 10, max: 50)

### 10. Gallery by Slug
```http
GET /galleries/{slug}
```

### 11. Product by ID
```http
GET /products/{id}
```

### 12. Product by Slug
```http
GET /products/slug/{slug}
```

### 13. Blog Post by ID
```http
GET /blog/{id}
```

### 14. Blog Post by Slug
```http
GET /blog/slug/{slug}
```

### 15. Category by ID
```http
GET /categories/{id}
```

### 16. Category by Slug
```http
GET /categories/slug/{slug}
```

### 17. Business Information ⭐ NEW
```http
GET /business-info
```

**Response:**
```json
{
  "success": true,
  "business": {
    "name": "Latitude 36",
    "tagline": "Pure honey from Kangaroo Island",
    "abn": "123456789",
    "email": "info@latitude36.com.au",
    "phone": "+61 8 8553 1234",
    "address": {
      "street": "1113 Moores Road",
      "city": "Haines",
      "state": "SA",
      "postcode": "5223",
      "country": "Australia"
    },
    "social": {
      "facebook": "https://facebook.com/latitude36",
      "instagram": "https://instagram.com/latitude36honey"
    },
    "hours": {
      "monday": "9:00 AM - 5:00 PM",
      "tuesday": "9:00 AM - 5:00 PM",
      "wednesday": "9:00 AM - 5:00 PM",
      "thursday": "9:00 AM - 5:00 PM",
      "friday": "9:00 AM - 5:00 PM",
      "saturday": "10:00 AM - 2:00 PM",
      "sunday": "Closed"
    }
  },
  "cached_at": "2025-10-06T08:59:00.000Z"
}
```

### 18. Best-Selling Products ⭐ NEW
```http
GET /bestsellers
```

**Query Parameters:**
- `context_id`: Business context ID (default: 1)
- `period`: Time period (default: "30d")
  - `1d`: Last 24 hours
  - `7d`: Last 7 days
  - `30d`: Last 30 days
  - `90d`: Last 90 days
  - `all`: All time
- `limit`: Number of products (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Pure Kangaroo Island Honey",
      "slug": "pure-kangaroo-island-honey",
      "price": {"website": 15.50},
      "images": {
        "main": {"url": "/media/products/honey-main.jpg", "alt": "Main product image"}
      },
      "salesCount": 156,
      "revenue": 2418.00
    }
  ],
  "period": "30d",
  "cached_at": "2025-10-17T08:00:00.000Z"
}
```

**Cache TTL**: 30 minutes

### 19. Site Configuration ⭐ NEW
```http
GET /site-config
```

**Query Parameters:**
- `context_id`: Business context ID (default: 1)

**Response:**
```json
{
  "success": true,
  "config": {
    "branding": {
      "logoUrl": "/media/branding/logo.svg",
      "primaryColor": "#FFB800",
      "secondaryColor": "#2C3E50",
      "fontFamily": "Inter, sans-serif"
    },
    "theme": {
      "mode": "light",
      "layout": "standard"
    },
    "navigation": {
      "menuItems": [
        {"label": "Home", "url": "/", "order": 1},
        {"label": "Shop", "url": "/shop", "order": 2}
      ]
    },
    "features": {
      "enableWholesale": true,
      "enableBlog": true,
      "enableGalleries": true
    },
    "seo": {
      "siteName": "Latitude 36",
      "defaultTitle": "Pure Honey from Kangaroo Island",
      "defaultDescription": "Sustainable beekeeping..."
    }
  },
  "cached_at": "2025-10-17T08:00:00.000Z"
}
```

**Cache TTL**: 30 minutes

### 20. Address Validation ⭐ NEW
```http
POST /address/validate
```

**Request Body:**
```json
{
  "street": "1113 Moores Road",
  "suburb": "Haines",
  "state": "SA",
  "postcode": "5223"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "normalized": {
    "street": "1113 MOORES RD",
    "suburb": "HAINES",
    "state": "SA",
    "postcode": "5223",
    "country": "AUSTRALIA"
  },
  "suggestions": [],
  "delivery_point_id": "12345678"
}
```

## Wholesale Endpoints (4) - JWT Required

All wholesale endpoints require JWT authentication and are prefixed with `/api/cvps/wholesale/`

⚠️ **MULTI-TENANT SECURITY UPDATE (2025-10-17)**:
Wholesale endpoints now support `context_id` parameter for multi-tenant isolation. However, automatic context extraction from JWT is pending implementation.

**Current Behavior**:
- `context_id` can be passed as query parameter (defaults to 1)
- Full JWT-based context isolation coming soon

**Recommendation**: Only create wholesale customers in Context 1 until JWT extraction is complete.

### W1. Wholesale Product Catalog
```http
GET /api/cvps/wholesale/products
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `context_id`: Business context ID (optional, default: 1)

Returns products with wholesale pricing, minimum order quantities, and bulk discounts.

### W2. Wholesale Product Search
```http
GET /api/cvps/wholesale/products/search
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `q`: Search query
- `category`: Category filter
- `min_price`, `max_price`: Price range filters
- `context_id`: Business context ID (optional, default: 1)

Enhanced search with wholesale-specific filters and pricing tiers.

### W3. Wholesale Product Detail
```http
GET /api/cvps/wholesale/products/{id}
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `context_id`: Business context ID (optional, default: 1)

Detailed product information including volume pricing breaks.

### W4. Wholesale Categories
```http
GET /api/cvps/wholesale/categories
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `context_id`: Business context ID (optional, default: 1)

Categories with wholesale product counts and B2B-specific information.

## Media URL Strategy

All media URLs are returned as **relative paths** starting with `/media/`:

```json
{
  "url": "/media/products/honey-main.jpg",
  "alt": "Pure Kangaroo Island Honey"
}
```

The CVPS frontend constructs full URLs by prepending the API base URL:
- Example: `{BASE_URL}/media/products/honey-main.jpg`

Where `{BASE_URL}` is the environment-specific MVPS domain (loaded from environment configuration)

## Product Tagging System

### Tag Structure
Products include comprehensive tagging data:

```json
{
  "tags": ["raw", "wildflower", "kangaroo-island"],
  "searchTerms": ["honey", "raw honey", "ki honey", "pure honey"],
  "tagCategories": {
    "type": ["raw", "pure"],
    "origin": ["kangaroo-island", "aussie"],
    "flavor": ["wildflower", "complex"],
    "benefits": ["natural", "healthy"]
  }
}
```

### Tag Categories
- **Type**: Processing and variety (raw, creamed, liquid, pure)
- **Origin**: Geographic source (kangaroo-island, local, aussie)
- **Flavor**: Taste profiles (wildflower, eucalyptus, complex, mild)
- **Benefits**: Health and wellness (natural, healthy, antioxidant, antibacterial)
- **Occasion**: Usage scenarios (breakfast, cooking, gift, medicinal)
- **Season**: Harvest timing (spring, summer, autumn, winter)

## Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (JWT required for wholesale endpoints only)
- `404`: Not Found (resource doesn't exist)
- `429`: Rate Limited (too many requests)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": "Validation Error",
  "message": "Invalid search parameters",
  "code": 400,
  "details": {
    "price_min": ["Must be a positive number"],
    "sort_by": ["Must be one of: name, price, created, popularity"]
  },
  "service": "cvps_processor"
}
```

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP (public endpoints)
- **Burst Limit**: 10 requests per second
- **Headers**: Rate limit status included in response headers

## Performance Considerations

### Caching
- All endpoints implement Redis-based caching
- Cache TTLs optimized per endpoint type
- Cache headers included in responses
- ETags for client-side caching

### Query Optimization
- Single optimized queries per endpoint
- Proper JOIN usage to minimize database hits
- Indexed columns for filter operations
- Pagination to limit response sizes

### Response Sizes
- Product listings: ~20 items per page (configurable 1-100)
- Blog posts: ~3 posts per request (configurable 1-50)
- Galleries: ~10 galleries per request (configurable 1-50)
- Individual items: Complete data in single request

## Version History

### Version 4.1 (2025-10-06, Updated 2025-10-17)
- 🔴 **BREAKING**: Removed API key requirement for public endpoints
- ✅ Added shipping endpoint (`/shipping`)
- ✅ Added business information endpoint (`/business-info`)
- ✅ Added bestsellers endpoint (`/bestsellers`) - NEW
- ✅ Added site configuration endpoint (`/site-config`) - NEW
- ✅ Added address validation endpoint (`/address/validate`)
- ✅ Added wholesale module with 4 B2B endpoints
- ✅ Total endpoints increased to 24 (20 public + 4 wholesale)
- ✅ Implemented JWT authentication for wholesale endpoints only
- ✅ Full multi-tenant support for all public endpoints
- ⚠️ Multi-tenant support for wholesale endpoints (query param, JWT pending)

### Version 3.1 (2025-08-05)
- ✅ Added enhanced product search endpoint (`/products/search`)
- ✅ Implemented product tagging system
- ✅ Added filter options in search responses
- ✅ Price range and advanced sorting capabilities

### Version 3.0 (2025-08-03)
- Added individual item endpoints
- Enhanced gallery system
- Improved media URL handling
- Optimized caching strategies

### Version 2.0 (2025-07-15)
- Complete CVPS processor implementation
- All core endpoints operational
- Authentication and caching systems

### Version 1.0 (2025-06-01)
- Initial CVPS processor specification
- Basic endpoint structure defined

---

**Generated by**: MVPS-CVPS Management Agent
**Documentation Status**: ✅ CURRENT - Version 4.1 fully operational
**Last Updated**: 2025-10-17 (Multi-tenant updates)
**Last Validation**: 2025-10-17 08:00:00 UTC
**Total Endpoints**: 24 (20 public + 4 wholesale)