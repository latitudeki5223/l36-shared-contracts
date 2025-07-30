# L36 Platform API Contract
## Version 1.0.0 - Shared Frontend/Backend Agreement

This document serves as the single source of truth for API integration between the L36 Customer Frontend and the L36 Management System Backend.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Response Format Standards](#response-format-standards)
3. [Content API Endpoints](#content-api-endpoints)
4. [Data API Endpoints](#data-api-endpoints)
5. [Marketing API Endpoints](#marketing-api-endpoints)
6. [Notification System API](#notification-system-api)
7. [Webhook Endpoints](#webhook-endpoints)
8. [Error Handling](#error-handling)
9. [Versioning Strategy](#versioning-strategy)

---

## Authentication

All API requests to L36 Management System require authentication headers:

```http
X-Site-ID: latitude36
X-API-Key: {api-key}
```

**Response for unauthorized requests:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid X-Site-ID or X-API-Key",
  "code": 401
}
```

---

## Response Format Standards

### Success Response Structure
All successful responses MUST follow this format:

```json
{
  "data": { /* endpoint-specific data */ },
  "version": "1.0.0",
  "generatedAt": "2025-06-22T10:00:00Z",
  "ttl": 86400,  // seconds until content expires (optional)
  "metadata": {   // optional
    "source": "ai-generated|wordpress|cache",
    "cached": true|false
  }
}
```

### Error Response Structure
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "code": 400,
  "details": { /* optional debug info */ }
}
```

---

## Content API Endpoints

### 1. Get Homepage Content
**Endpoint:** `GET /api/content/homepage`

**Query Parameters:**
- `season` (optional): current|summer|winter|spring|autumn
- `user_type` (optional): b2c|b2b

**Response:**
```json
{
  "data": {
    "hero": {
      "headline": "Welcome to Latitude 36",
      "subheadline": "Premium regenerative products",
      "primaryCTA": {
        "text": "Shop Now",
        "link": "/products"
      },
      "backgroundImage": "https://...",
      "seasonalBadge": "Summer Collection"
    },
    "categories": [
      {
        "id": "1",
        "title": "Honey",
        "description": "Pure Australian honey",
        "image": "https://...",
        "link": "/category/honey"
      }
    ],
    "featuredProducts": [
      {
        "id": "1",
        "name": "Raw Honey 500g",
        "description": "Pure raw honey",
        "price": "$24.99",
        "image": "https://...",
        "category": "Honey",
        "stock_status": "instock",
        "stock_quantity": 50
      }
    ],
    "brandStory": {
      "headline": "Our Story",
      "content": "From our regenerative farm...",
      "image": "https://...",
      "ctaText": "Learn More",
      "ctaLink": "/about"
    },
    "testimonials": [
      {
        "id": "1",
        "name": "Sarah M.",
        "location": "Melbourne",
        "rating": 5,
        "text": "Amazing quality!",
        "product": "Raw Honey",
        "verified": true
      }
    ],
    "inventoryHighlight": "Limited stock on Raw Honey 1kg"
  },
  "version": "1.0.0",
  "generatedAt": "2025-06-22T10:00:00Z",
  "ttl": 86400,
  "metadata": {
    "source": "ai-generated",
    "cached": false
  }
}
```

### 2. Update Homepage Content
**Endpoint:** `POST /api/content/homepage/update`

**Request Body:**
```json
{
  "section": "hero|brandStory|testimonials",
  "content": {
    /* section-specific content */
  },
  "updated_at": "2025-06-22T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Homepage hero updated successfully",
  "updated_sections": ["hero"],
  "content_id": "123",
  "version": "1.0.1",
  "updated_at": "2025-06-22T10:00:00Z"
}
```

### 3. Get Product Content
**Endpoint:** `GET /api/content/product/{id}`

**Response:**
```json
{
  "data": {
    "product": {
      "id": "1",
      "name": "Raw Honey 500g",
      "description": "AI-enhanced product description",
      "price": "$24.99",
      "images": ["https://..."],
      "category": "Honey",
      "benefits": ["Natural sweetener", "Raw and unprocessed"],
      "usage": "Perfect for tea, toast, or cooking"
    },
    "relatedContent": {
      "recipes": [],
      "pairings": []
    }
  },
  "version": "1.0.0",
  "generatedAt": "2025-06-22T10:00:00Z",
  "ttl": 172800
}
```

### 4. Get Category Content
**Endpoint:** `GET /api/content/category/{slug}`

**Note:** Frontend expects `{id}` but backend uses `{slug}`. This needs alignment.

**Response:**
```json
{
  "data": {
    "category": {
      "id": "1",
      "name": "Honey",
      "slug": "honey",
      "description": "Our premium honey collection",
      "image": "https://...",
      "seo": {
        "title": "Premium Australian Honey",
        "description": "Shop our range of raw honey"
      }
    }
  },
  "version": "1.0.0",
  "generatedAt": "2025-06-22T10:00:00Z",
  "ttl": 604800
}
```

### 5. Get Blog Content ⚠️ NOT IMPLEMENTED
**Endpoint:** `GET /api/content/blog/{id}`

**Status:** Frontend expects this but backend doesn't implement it yet.

**Expected Response:**
```json
{
  "data": {
    "blog": {
      "id": "1",
      "title": "The Benefits of Raw Honey",
      "content": "AI-enhanced blog content...",
      "excerpt": "Discover why raw honey...",
      "author": "Latitude 36 Team",
      "featuredImage": "https://...",
      "categories": ["Health", "Products"],
      "publishedAt": "2025-06-22T10:00:00Z"
    }
  },
  "version": "1.0.0",
  "generatedAt": "2025-06-22T10:00:00Z",
  "ttl": 604800
}
```

---

## Data API Endpoints

### 1. Get Products ✅
**Endpoint:** `GET /api/data/products`

**Query Parameters:**
- `page` (default: 1)
- `per_page` (default: 20)
- `category` (optional)
- `search` (optional)
- `sort` (default: date): date|price|title
- `order` (default: desc): asc|desc

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Raw Honey 500g",
      "slug": "raw-honey-500g",
      "description": "Pure raw honey",
      "price": "24.99",
      "regular_price": "24.99",
      "sale_price": "",
      "on_sale": false,
      "stock_status": "instock",
      "stock_quantity": 100,
      "categories": ["Honey"],
      "images": ["https://..."],
      "featured_image": "https://...",
      "date_created": "2025-06-22T10:00:00Z",
      "date_modified": "2025-06-22T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

### 2. Get Single Product ✅
**Endpoint:** `GET /api/data/products/{id}`

**Response:**
```json
{
  "id": "1",
  "name": "Raw Honey 500g",
  "slug": "raw-honey-500g",
  "description": "Pure raw honey from our hives",
  "short_description": "Pure raw honey",
  "price": "24.99",
  "regular_price": "24.99",
  "sale_price": "",
  "on_sale": false,
  "stock_status": "instock",
  "stock_quantity": 100,
  "sku": "HNY-500",
  "categories": [
    {
      "id": "1",
      "name": "Honey",
      "slug": "honey"
    }
  ],
  "tags": [],
  "images": [
    {
      "id": "1",
      "src": "https://...",
      "alt": "Raw Honey 500g"
    }
  ],
  "attributes": [],
  "variations": [],
  "related_ids": ["2", "3"],
  "date_created": "2025-06-22T10:00:00Z",
  "date_modified": "2025-06-22T10:00:00Z"
}
```

### 3. Get Blog Posts ✅
**Endpoint:** `GET /api/data/blog/posts`

**Query Parameters:**
- `page` (default: 1)
- `per_page` (default: 10)
- `category` (optional)
- `search` (optional)
- `author` (optional)

**Response:**
```json
{
  "posts": [
    {
      "id": "1",
      "title": "The Benefits of Raw Honey",
      "slug": "benefits-raw-honey",
      "excerpt": "Discover why raw honey...",
      "content": "Full blog content...",
      "author": "1",
      "categories": ["1", "2"],
      "tags": ["3", "4"],
      "featured_media": "123",
      "date": "2025-06-22T10:00:00Z",
      "modified": "2025-06-22T10:00:00Z",
      "link": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 25,
    "total_pages": 3
  }
}
```

### 4. Get Single Blog Post ✅
**Endpoint:** `GET /api/data/blog/posts/{id}`

**Response:**
```json
{
  "id": "1",
  "title": "The Benefits of Raw Honey",
  "slug": "benefits-raw-honey",
  "excerpt": "Discover why raw honey...",
  "content": "Full blog content HTML...",
  "author": {
    "id": "1",
    "name": "Latitude 36 Team",
    "avatar": "https://..."
  },
  "categories": [
    {
      "id": "1",
      "name": "Health",
      "slug": "health"
    }
  ],
  "tags": [
    {
      "id": "3",
      "name": "honey",
      "slug": "honey"
    }
  ],
  "featured_media": {
    "id": "123",
    "src": "https://...",
    "alt": "Raw honey in jar"
  },
  "date": "2025-06-22T10:00:00Z",
  "modified": "2025-06-22T10:00:00Z",
  "link": "https://...",
  "meta": {
    "title": "The Benefits of Raw Honey | Latitude 36",
    "description": "Discover the health benefits of raw honey from Latitude 36",
    "keywords": ["raw honey", "health benefits", "natural sweetener"]
  }
}
```

### 5. Get Categories ✅
**Endpoint:** `GET /api/data/categories`

**Response:**
```json
{
  "categories": [
    {
      "id": "1",
      "name": "Honey",
      "slug": "honey",
      "description": "Our honey products",
      "parent": null,
      "count": 5,
      "image": {
        "src": "https://..."
      },
      "display": "default"
    }
  ]
}
```

---

## Marketing API Endpoints

### 1. Get Newsletter Configuration
**Endpoint:** `GET /api/marketing/newsletter`

**Response:**
```json
{
  "data": {
    "headline": "Stay Connected",
    "subheadline": "Get exclusive offers and seasonal updates",
    "buttonText": "Subscribe",
    "privacyText": "We respect your privacy",
    "placeholderText": "Enter your email",
    "successMessage": "Thank you for subscribing!",
    "errorMessage": "Please enter a valid email",
    "endpoints": {
      "subscribe": "/api/marketing/subscribe",
      "unsubscribe": "/api/marketing/unsubscribe"
    },
    "styling": {
      "theme": "default",
      "position": "bottom"
    }
  },
  "version": "1.0.0",
  "cacheDuration": 86400
}
```

### 2. Subscribe to Newsletter ⚠️ NOT IMPLEMENTED
**Endpoint:** `POST /api/marketing/subscribe`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "name": "John Doe",
  "preferences": {
    "frequency": "weekly",
    "topics": ["products", "recipes"]
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed",
  "subscription_id": "sub_123"
}
```

### 3. Unsubscribe from Newsletter ⚠️ NOT IMPLEMENTED
**Endpoint:** `POST /api/marketing/unsubscribe`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "token": "unsubscribe_token"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed"
}
```

---

## Notification System API

### Overview
The notification system enables content review workflows across MVPS (Management System) and CVPS (Customer VPS) with secure preview integration.

### 1. Get Notifications
**Endpoint:** `GET /api/notifications`

**Query Parameters:**
- `page` (default: 1)
- `per_page` (default: 20)

**Response:**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "content_review",
      "sub_type": "blog",
      "title": "New Blog Post Ready for Review",
      "message": "Please review the generated blog content",
      "content_type": "blog",
      "content_title": "The Benefits of Raw Honey",
      "thumbnail_url": "https://...",
      "priority": "medium",
      "status": "unread",
      "review_id": "blog_test_001",
      "preview_url": "https://dev.latitude36.com.au/admin/preview/blog/blog_test_001?token=xyz",
      "platform": null,
      "post_type": null,
      "image_urls": null,
      "hashtags": null,
      "retry_count": 0,
      "metadata": {},
      "created_at": "2025-06-28T23:00:00Z",
      "read_at": null,
      "actioned_at": null
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

### 2. Get Notification Count
**Endpoint:** `GET /api/notifications/count`

**Response:**
```json
{
  "unread_count": 3
}
```

### 3. Create Notification (Internal)
**Endpoint:** `POST /api/notifications/create`

**Request Body:**
```json
{
  "type": "content_review",
  "sub_type": "blog",
  "title": "New Blog Post Ready for Review",
  "message": "Please review the generated blog content",
  "content_type": "blog",
  "review_id": "blog_test_001",
  "content_title": "The Benefits of Raw Honey",
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "notification_id": 1
}
```

**Note:** Preview URLs are automatically generated when `content_type` and `review_id` are provided.

### 4. Mark Notification as Read
**Endpoint:** `POST /api/notifications/{id}/read`

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 5. Mark All Notifications as Read
**Endpoint:** `POST /api/notifications/mark-all-read`

**Response:**
```json
{
  "success": true,
  "message": "5 notifications marked as read"
}
```

### 6. Process Content Approval/Rejection
**Endpoint:** `POST /api/unified-query`

**Request Body for Approval:**
```json
{
  "query": "approve_content_blog_test_001"
}
```

**Request Body for Rejection with Feedback:**
```json
{
  "query": "reject_content_feedback_blog_test_001",
  "feedback": "Make the content more casual and add honey benefits"
}
```

**Request Body for Retry:**
```json
{
  "query": "reject_content_retry_blog_test_001",
  "reason": "Content needs improvement"
}
```

**Request Body for Final Rejection:**
```json
{
  "query": "reject_content_final_blog_test_001"
}
```

**Response:**
```json
{
  "success": true,
  "action": "approved",
  "review_id": "blog_test_001",
  "message": "Content blog_test_001 approved successfully"
}
```

### 7. Get Preview Content (for Customer VPS)
**Endpoint:** `GET /api/content/preview/{content_type}/{review_id}`

**Query Parameters:**
- `token` (required): Secure preview token

**Example:** `GET /api/content/preview/blog/blog_test_001?token=xyz`

**Response:**
```json
{
  "success": true,
  "content": {
    "title": "The Benefits of Raw Honey",
    "content": "Discover the incredible benefits...",
    "excerpt": "Raw honey provides...",
    "author": "Latitude 36 Team"
  },
  "brand_context": {
    "tone": "educational",
    "voice": "authentic"
  },
  "seo_data": {
    "meta_title": "The Benefits of Raw Honey",
    "meta_description": "Learn about raw honey benefits"
  },
  "content_type": "blog",
  "review_id": "blog_test_001",
  "title": "The Benefits of Raw Honey",
  "status": "pending"
}
```

### Preview URL Format
Preview URLs are automatically generated and point to Customer VPS:

**Blog:** `https://dev.latitude36.com.au/admin/preview/blog/{review_id}?token={secure_token}`
**Product:** `https://dev.latitude36.com.au/admin/preview/product/{review_id}?token={secure_token}`
**Social Media:**
- Facebook: `https://dev.latitude36.com.au/admin/preview/facebook/{review_id}?token={secure_token}`
- Instagram: `https://dev.latitude36.com.au/admin/preview/instagram/{review_id}?token={secure_token}`
- Twitter: `https://dev.latitude36.com.au/admin/preview/twitter/{review_id}?token={secure_token}`

### Security Features
- **Secure Tokens:** 32-character URL-safe tokens for each preview
- **Expiration:** Tokens expire after 24 hours for security
- **Validation:** Customer VPS validates tokens with Management API
- **Cross-Platform:** Secure integration between MVPS and CVPS

---

## Webhook Endpoints ⚠️ NOT IMPLEMENTED

### Content Update Webhook
**Endpoint:** `POST /api/webhooks/content-update`

**Purpose:** Allow external systems to trigger content regeneration.

**Request Body:**
```json
{
  "trigger": "inventory_change|campaign_start|manual",
  "sections": ["hero", "featuredProducts"],
  "metadata": {
    "campaign_id": "summer-sale-2025"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Content update triggered",
  "job_id": "job_123"
}
```

---

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error
- `503` - Service Unavailable

### Error Response Format
```json
{
  "error": "ValidationError",
  "message": "Invalid request parameters",
  "code": 400,
  "details": {
    "field": "email",
    "reason": "Invalid email format"
  }
}
```

---

## Versioning Strategy

### API Version
- Current version: `1.0.0`
- Version included in all responses
- Breaking changes will increment major version

### Backward Compatibility
- New fields can be added without version change
- Field removal or type changes require new version
- Deprecated fields marked with `_deprecated` suffix

---

## Implementation Status

### ✅ Implemented
- Content: Homepage, Product, Category endpoints
- Data: All product, blog, and category endpoints
- Marketing: Newsletter configuration

### ⚠️ Needs Implementation
1. **Blog Content Generation** (`GET /api/content/blog/{id}`)
2. **Newsletter Subscription** (`POST /api/marketing/subscribe`)
3. **Newsletter Unsubscription** (`POST /api/marketing/unsubscribe`)
4. **Content Update Webhook** (`POST /api/webhooks/content-update`)
5. **TTL in Response Headers** (currently stored internally but not returned)

### 🔧 Needs Alignment
1. **Category endpoint parameter**: Frontend expects ID, backend uses slug
2. **Response format**: Ensure all endpoints include version, generatedAt, and ttl
3. **Error format**: Standardize error responses across all endpoints

---

## Next Steps

1. **Backend Team**: Implement missing endpoints marked with ⚠️
2. **Frontend Team**: Update category endpoint calls to use slug
3. **Both Teams**: Use this contract for all future API development
4. **DevOps**: Set up API contract testing to ensure compliance

---

*Last Updated: June 2025*
*Contract Version: 1.0.0*