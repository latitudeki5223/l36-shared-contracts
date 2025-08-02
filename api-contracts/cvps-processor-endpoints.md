# CVPS Processor API Endpoints Specification

Version: 2.0  
Last Updated: 2025-08-02


## Overview

The CVPS Processor provides 8 optimized endpoints that consolidate data from multiple sources into single, efficient API calls. These endpoints are designed specifically for the Customer-facing VPS (CVPS) frontend at dev.latitude36.com.au.

## Authentication

All endpoints require authentication via headers:

```http
X-API-Key: {api_key}
X-Site-ID: {site_id}
```

### Valid Credentials:
- **Development**: 
  - X-Site-ID: `dev.latitude36.com.au`
  - X-API-Key: `cvps-dev-key-2025`
- **Production**: 
  - X-Site-ID: `latitude36.com.au`
  - X-API-Key: `cvps-prod-key-2025`

## Base URLs

- **Local Development**: `http://localhost:5050/api/cvps`
- **Development (via API Gateway)**: `https://api.dev.latitude36.com.au/api/cvps`
- **Production**: `https://l36.com.au/api/cvps`

## HTTP Methods

⚠️ **ALL endpoints are GET-only**. POST requests will return 405 Method Not Allowed.

## Endpoints

### 1. Homepage Content ✅

**GET** `/api/cvps/homepage`

Retrieves all homepage content in a single request.

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "string",
      "subtitle": "string",
      "backgroundImage": {
        "url": "/media/...",  // Relative path
        "alt": "string"
      },
      "backgroundVideo": null,
      "primaryCTA": {
        "text": "string",
        "link": "string"
      },
      "secondaryCTA": {}
    },
    "textSlider": {
      "text": "string"
    },
    "welcomeBanner": {
      "title": "string",
      "subtitle": "string",
      "tagline": "string",
      "description": "string",
      "primaryCTA": {
        "text": "string",
        "link": "string"
      },
      "secondaryCTA": {
        "text": "string",
        "link": "string"
      }
    },
    "features": {
      "title": "string",
      "subtitle": "string",
      "items": []
    },
    "categoryGrid": {
      "title": "string",
      "subtitle": "string"
    },
    "featuredProducts": {
      "title": "string",
      "subtitle": "string"
    },
    "testimonials": {
      "title": "string",
      "subtitle": "string",
      "items": []
    },
    "blogSection": {
      "title": "string",
      "subtitle": "string"
    },
    "pressSection": {
      "title": "string"
    },
    "seo": {
      "title": "string",
      "description": "string",
      "ogTitle": "string",
      "ogDescription": "string"
    }
  },
  "cached_at": "2025-08-02T22:38:26.916997",
  "version": "1.0"
}
```

### 2. Products Catalog ✅

**GET** `/api/cvps/products`

Retrieves product catalog with filtering and pagination.

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `per_page` (integer, default: 20, max: 100): Items per page
- `category` (string): Filter by category slug
- `search` (string): Text search in name/description

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": 67,
      "name": "string",
      "slug": "string",
      "shortDescription": "string",
      "longDescription": "string",
      "price": {
        "website": 8.0,
        "wholesale": 6.4
      },
      "category": {
        "name": "string",
        "slug": "string"
      },
      "images": {
        "main": null,
        "thumbnails": []
      },
      "videos": [],
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 46,
    "total_pages": 3
  },
  "cached_at": "2025-08-02T22:38:30.008131"
}
```

### 3. Blog Posts ✅

**GET** `/api/cvps/blog`

Retrieves published blog posts with media.

**Query Parameters:**
- `limit` (integer, default: 3, max: 50): Number of posts to return

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": 397,
      "title": "string",
      "slug": "string",
      "excerpt": "string",
      "author": "string",
      "category": "string",
      "tags": [],
      "featuredImage": {
        "url": "/media/blog/...",
        "alt": "string"
      },
      "publishedAt": "2025-07-23T02:11:29.584680",
      "readTime": "3 min"
    }
  ],
  "total": 9,
  "cached_at": "2025-08-02T22:38:51.907562"
}
```

### 4. Category Hierarchy ✅

**GET** `/api/cvps/categories`

Retrieves complete category tree with product counts.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "string",
      "slug": "string",
      "description": "string",
      "parent_id": null,
      "image": {
        "url": "/media/categories/...",
        "alt": "string"
      },
      "product_count": 15,
      "children": []
    }
  ],
  "cached_at": "2025-08-02T22:40:00.123456"
}
```

### 5. Newsletter Configuration ✅

**GET** `/api/cvps/newsletter`

Retrieves newsletter signup configuration and content.

**Response:**
```json
{
  "success": true,
  "content": {
    "title": "string",
    "subtitle": "string",
    "description": "string",
    "benefits": ["string"],
    "formFields": {
      "emailPlaceholder": "string",
      "buttonText": "string",
      "successMessage": "string",
      "errorMessage": "string"
    },
    "privacyText": "string",
    "privacyLink": "string"
  },
  "cached_at": "2025-08-02T22:40:00.123456"
}
```

### 6. Galleries List ✅

**GET** `/api/cvps/galleries`

Retrieves published galleries with images.

**Query Parameters:**
- `limit` (integer, default: 10, max: 50): Number of galleries to return

**Response:**
```json
{
  "success": true,
  "galleries": [
    {
      "id": 1,
      "title": "string",
      "slug": "string",
      "description": "string",
      "cover_image": {
        "url": "/media/galleries/...",
        "alt": "string"
      },
      "images": [],
      "total_images": 0,
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "total": 0,
  "cached_at": "2025-08-02T22:40:00.123456"
}
```

### 7. Gallery by Slug ✅

**GET** `/api/cvps/galleries/{slug}`

Retrieves a single gallery by slug with all images.

**Response:**
```json
{
  "success": true,
  "gallery": {
    "id": 1,
    "title": "string",
    "slug": "string",
    "description": "string",
    "cover_image": {
      "url": "/media/galleries/...",
      "alt": "string"
    },
    "images": [
      {
        "id": 1,
        "url": "/media/galleries/...",
        "alt": "string",
        "caption": "string",
        "metadata": {
          "width": 1920,
          "height": 1080,
          "size": 524288,
          "format": "jpg"
        },
        "order": 0
      }
    ],
    "total_images": 1,
    "tags": ["string"],
    "created_at": "string",
    "updated_at": "string"
  },
  "cached_at": "2025-08-02T22:40:00.123456"
}
```

### 8. Health Check ✅

**GET** `/api/cvps/health`

Returns service status. **Requires authentication** (unlike standard health checks).

**Response:**
```json
{
  "status": "healthy",
  "service": "cvps_processor",
  "database": "connected",
  "cache": {
    "enabled": false,
    "type": "redis"
  },
  "version": "1.0",
  "timestamp": "2025-08-02T22:40:00.123456"
}
```

## Query Strategies for Individual Items

To retrieve specific items, use list endpoints with filters:

1. **For specific product**: Use `/api/cvps/products?search={name}`
2. **For category products**: Use `/api/cvps/products?category={slug}`
3. **For specific blog post**: Use `/api/cvps/blog` and filter by slug client-side

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "string",
  "message": "string",
  "code": 401,
  "details": {}
}
```

### Common Error Codes:
- `401`: Unauthorized (invalid API key or site ID)
- `404`: Resource not found
- `405`: Method Not Allowed (wrong HTTP method or endpoint doesn't exist)
- `429`: Rate limited
- `500`: Internal server error

## Media URL Strategy

All media URLs use **relative paths** starting with `/media/...`. The frontend should construct full URLs based on environment:
- Development: `https://api.dev.latitude36.com.au/media/...`
- Production: `https://l36.com.au/media/...`

## Cache Status

As of 2025-08-02, caching is **DISABLED** (`cache.enabled: false`). Redis is configured but not actively used.

## Testing

Use the test script at `/home/admin/l36/cvps-endpoints-test-script.sh` to verify all endpoints.

Example curl command:
```bash
curl -X GET "http://localhost:5050/api/cvps/homepage" \
  -H "X-Site-ID: dev.latitude36.com.au" \
  -H "X-API-Key: cvps-dev-key-2025"
```

## Frontend Implementation Notes

1. All endpoints are GET-only
2. Use list endpoints with filtering for individual items
3. Handle relative media URLs by prepending appropriate base URL
4. Include authentication headers on all requests