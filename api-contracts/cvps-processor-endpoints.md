# CVPS Processor API Endpoints Specification

Version: 3.1 - Enhanced Product Tagging System  
Last Updated: 2025-08-05

## Overview

The CVPS Processor provides **15 optimized endpoints** (8 list + 6 individual + 1 enhanced search) that consolidate data from multiple sources into single, efficient API calls. These endpoints are designed specifically for the Customer-facing VPS (CVPS) frontend at dev.latitude36.com.au.

### Version 3.1 New Features
- **Enhanced Product Search**: New `/products/search` endpoint with tag filtering, price ranges, and advanced sorting
- **Product Tagging System**: All product endpoints now include `tags`, `searchTerms`, and `tagCategories` fields
- **Filter Options**: Search responses include available filters for dynamic UI construction
- **Backward Compatibility**: All existing endpoints continue to work unchanged

## Authentication

All endpoints require authentication via headers:

```http
X-API-Key: {api_key}
X-Site-ID: {site_id}
```

### Valid Credentials:
- **Development**: 
  - API Key: `cvps-dev-key-2025`
  - Site ID: `dev.latitude36.com.au`
- **Production**: 
  - API Key: `cvps-prod-key-2025`
  - Site ID: `latitude36.com.au`

## Base URL

- **Development**: `http://localhost:5050/api/cvps`
- **Production**: `https://l36.com.au/api/cvps`

## Response Format

All endpoints return consistent JSON responses:

```json
{
  "success": true,
  "cached_at": "2025-08-05T08:59:00.000Z",
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

## Core Endpoints

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
  "cache": {"enabled": false},
  "version": "2.0",
  "endpoints_available": 15,
  "features": [
    "product_tagging",
    "enhanced_search", 
    "price_filtering",
    "multi_category_support",
    "tag_categories"
  ],
  "timestamp": "2025-08-05T08:59:00.000Z"
}
```

### 2. Homepage Content
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
  "cached_at": "2025-08-05T08:59:00.000Z",
  "version": "1.0"
}
```

### 3. Product Catalog (Legacy)
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
  "cached_at": "2025-08-05T08:59:00.000Z"
}
```

### 4. Enhanced Product Search ⭐ NEW
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

**Example Requests:**
```http
# Basic text search
GET /products/search?q=honey

# Tag filtering
GET /products/search?tags=raw&tags=wildflower

# Price range with sorting  
GET /products/search?price_min=10&price_max=25&sort_by=price&sort_order=asc

# Combined filters
GET /products/search?q=honey&tags=organic&price_max=20&sort_by=name
```

**Response Structure:**
```json
{
  "success": true,
  "products": [/*same product structure as above*/],
  "pagination": {/*pagination info*/},
  "filters": {
    "tags": ["raw", "pure", "organic", "wildflower", "lavender"],
    "tag_categories": [
      {
        "name": "Type",
        "description": "Honey varieties and processing types", 
        "color": "#FFB800",
        "tags": ["raw", "pure", "creamed", "liquid"]
      },
      {
        "name": "Origin",
        "description": "Geographic source of honey",
        "color": "#00A86B", 
        "tags": ["kangaroo-island", "local", "aussie"]
      }
    ],
    "price_range": {"min": 7.5, "max": 33.5, "average": 15.55}
  },
  "searchParams": {
    "q": "honey",
    "tags": ["raw", "wildflower"],
    "categories": [],
    "priceRange": {"min": 10, "max": 25},
    "sortBy": "price",
    "sortOrder": "asc"
  },
  "cached_at": "2025-08-05T08:59:00.000Z"
}
```

### 5. Blog Posts
```http
GET /blog
```

**Query Parameters:**
- `limit`: Number of posts (default: 3, max: 50)

**Response Structure:**
```json
{
  "success": true,
  "posts": [
    {
      "id": 1,
      "title": "Spring Honey Harvest Update",
      "slug": "spring-honey-harvest-update",
      "excerpt": "Our spring harvest brings unique flavors...",
      "featuredImage": {"url": "/media/blog/harvest-update.jpg", "alt": "Spring harvest"},
      "publishedAt": "2025-08-01T00:00:00.000Z",
      "author": "Latitude 36 Team",
      "category": "Farm News",
      "tags": ["harvest", "spring", "honey"],
      "readTime": "3 min"
    }
  ],
  "total": 12,
  "cached_at": "2025-08-05T08:59:00.000Z"
}
```

### 6. Categories
```http
GET /categories
```

**Response Structure:**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Raw Honey",
      "slug": "raw-honey",
      "level": 0,
      "productCount": 15,
      "children": [
        {
          "id": 2,
          "name": "Wildflower Honey",
          "slug": "wildflower-honey", 
          "level": 1,
          "productCount": 8,
          "children": []
        }
      ]
    }
  ],
  "cached_at": "2025-08-05T08:59:00.000Z"
}
```

### 7. Newsletter Configuration
```http
GET /newsletter
```

**Response Structure:**
```json
{
  "success": true,
  "content": {
    "title": "Stay Connected",
    "description": "Get updates on new honey varieties, farm news, and special offers.",
    "placeholder": "Enter your email address",
    "buttonText": "Subscribe", 
    "privacyText": "We respect your privacy and never share your information.",
    "settings": {
      "enabled": true,
      "doubleOptIn": true,
      "confirmationRequired": true
    }
  },
  "cached_at": "2025-08-05T08:59:00.000Z"
}
```

### 8. Galleries
```http
GET /galleries
```

**Query Parameters:**
- `limit`: Number of galleries (default: 10, max: 50)

**Response Structure:**
```json
{
  "success": true,
  "galleries": [
    {
      "id": 1,
      "title": "Farm Life Spring 2025",
      "description": "Behind the scenes at our honey farm",
      "slug": "farm-life-spring-2025",
      "imageCount": 24,
      "publishedAt": "2025-08-01T00:00:00.000Z",
      "images": [
        {
          "id": 1,
          "url": "/media/galleries/farm-life/spring-1.jpg",
          "alt": "Beehives in spring sunshine",
          "caption": "Our hives enjoying the spring weather",
          "order": 1,
          "dimensions": {"width": 1200, "height": 800},
          "aspectRatio": 1.5
        }
      ]
    }
  ],
  "total": 8,
  "cached_at": "2025-08-05T08:59:00.000Z"
}
```

## Individual Item Endpoints

### 9. Product by ID
```http
GET /products/{id}
```

### 10. Product by Slug  
```http
GET /products/slug/{slug}
```

**Response Structure (both):**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Pure Kangaroo Island Honey",
    "slug": "pure-kangaroo-island-honey",
    "number": "HONEY-001",
    "shortDescription": "Raw honey from pristine Kangaroo Island",
    "longDescription": "Detailed product description...",
    "price": {"website": 15.50, "wholesale": 12.00},
    "categories": [
      {"id": 1, "name": "Raw Honey", "slug": "raw-honey", "is_primary": true},
      {"id": 5, "name": "Local Products", "slug": "local-products", "is_primary": false}
    ],
    "primaryCategory": {"id": 1, "name": "Raw Honey", "slug": "raw-honey", "is_primary": true},
    "images": {
      "main": {"url": "/media/products/honey-main.jpg", "alt": "Main product image"},
      "thumbnails": [
        {"url": "/media/products/honey-thumb1.jpg", "alt": "Thumbnail 1"},
        {"url": "/media/products/honey-thumb2.jpg", "alt": "Thumbnail 2"}
      ]
    },
    "isActive": true,
    "tags": ["raw", "kangaroo-island", "pure", "wildflower"],
    "searchTerms": ["honey", "raw honey", "pure honey", "ki honey"],
    "tagCategories": {
      "type": ["raw", "pure"],
      "origin": ["kangaroo-island"],
      "benefits": ["natural", "healthy"],
      "flavor": ["wildflower", "complex"]
    }
  }
}
```

### 11. Blog Post by ID
```http
GET /blog/{id}
```

### 12. Blog Post by Slug
```http
GET /blog/slug/{slug}
```

**Response Structure (both):**
```json
{
  "success": true,
  "post": {
    "id": 1,
    "title": "Spring Honey Harvest Update",
    "slug": "spring-honey-harvest-update",
    "content": {/*rich content object*/},
    "excerpt": "Our spring harvest brings unique flavors...",
    "publishedAt": "2025-08-01T00:00:00.000Z",
    "updatedAt": "2025-08-01T12:00:00.000Z",
    "author": "Latitude 36 Team",
    "category": "Farm News",
    "tags": ["harvest", "spring", "honey"],
    "featuredImage": {"url": "/media/blog/harvest-update.jpg", "alt": "Spring harvest"},
    "galleries": [{"id": 1}],
    "seo": {
      "title": "Spring Honey Harvest Update - Latitude 36",
      "description": "Latest update on our spring honey harvest...",
      "keywords": ["honey", "harvest", "spring", "kangaroo island"]
    }
  }
}
```

### 13. Category by ID
```http
GET /categories/{id}
```

### 14. Category by Slug
```http
GET /categories/slug/{slug}
```

**Response Structure (both):**
```json
{
  "success": true,
  "category": {
    "id": 1,
    "name": "Raw Honey",
    "slug": "raw-honey",
    "parentId": null,
    "level": 0,
    "description": "Unprocessed honey straight from the hive",
    "image": "/media/categories/raw-honey-banner.jpg",
    "subcategories": [
      {"id": 2, "name": "Wildflower Honey", "slug": "wildflower-honey", "product_count": 8}
    ]
  },
  "products": [
    {
      "id": 1, 
      "name": "Pure Kangaroo Island Honey",
      "slug": "pure-kangaroo-island-honey",
      "number": "HONEY-001",
      "shortDescription": "Raw honey from pristine Kangaroo Island",
      "price": 15.50,
      "mainImage": "/media/products/honey-main.jpg",
      "thumbnail": "/media/products/honey-thumb1.jpg",
      "isActive": true,
      "tags": ["raw", "kangaroo-island", "pure"],
      "searchTerms": ["honey", "raw honey", "pure honey"]
    }
  ],
  "total": 15
}
```

### 15. Gallery by Slug
```http
GET /galleries/{slug}
```

**Response Structure:**
```json
{
  "success": true,
  "gallery": {
    "id": 1,
    "title": "Farm Life Spring 2025",
    "description": "Behind the scenes at our honey farm during spring",
    "slug": "farm-life-spring-2025",
    "layout": "masonry",
    "columns": 3,
    "showCaptions": true,
    "spacing": "normal",
    "publishedAt": "2025-08-01T00:00:00.000Z",
    "createdBy": "admin",
    "createdAt": "2025-07-15T00:00:00.000Z",
    "updatedAt": "2025-08-01T00:00:00.000Z",
    "seo": {
      "metaDescription": "Photo gallery showcasing spring activities at our Kangaroo Island honey farm",
      "keywords": ["farm", "spring", "beehives", "honey", "kangaroo island"]
    },
    "images": [
      {
        "id": 1,
        "url": "/media/galleries/farm-life/spring-1.jpg",
        "alt": "Beehives in spring sunshine",
        "caption": "Our hives enjoying the spring weather", 
        "order": 1,
        "dimensions": {"width": 1200, "height": 800},
        "fileType": "image/jpeg",
        "size": 245760,
        "aspectRatio": 1.5
      }
    ]
  }
}
```

## Media URL Strategy

All media URLs are returned as **relative paths** starting with `/media/`:

```json
{
  "url": "/media/products/honey-main.jpg",
  "alt": "Pure Kangaroo Island Honey"
}
```

The CVPS frontend constructs full URLs by prepending the API base URL:
- Development: `http://localhost:5050/media/products/honey-main.jpg`
- Production: `https://l36.com.au/media/products/honey-main.jpg`

This strategy enables:
- CDN flexibility
- Environment portability
- Simplified cache invalidation

## Product Tagging System (Version 3.1)

### Tag Structure
Products now include comprehensive tagging data:

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
The system supports organized tag categories:

- **Type**: Processing and variety (raw, creamed, liquid, pure)
- **Origin**: Geographic source (kangaroo-island, local, aussie)  
- **Flavor**: Taste profiles (wildflower, eucalyptus, complex, mild)
- **Benefits**: Health and wellness (natural, healthy, antioxidant, antibacterial)
- **Occasion**: Usage scenarios (breakfast, cooking, gift, medicinal)
- **Season**: Harvest timing (spring, summer, autumn, winter)

### Search and Filtering
Enhanced search supports:
- **Text Search**: Searches name, description, and searchTerms
- **Tag Filtering**: Multiple tags with OR logic
- **Price Ranges**: Min/max price filtering
- **Sorting**: By name, price, creation date, popularity
- **Category Filtering**: Multiple categories

## Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid credentials)
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

- **Rate Limit**: 100 requests per minute per API key
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

### Version 3.1 (2025-08-05)
- ✅ Added enhanced product search endpoint (`/products/search`)
- ✅ Implemented product tagging system (tags, searchTerms, tagCategories)
- ✅ Added filter options in search responses
- ✅ Price range and advanced sorting capabilities
- ✅ Maintained full backward compatibility

### Version 3.0 (2025-08-03)
- Added individual item endpoints (products, blog posts, categories by ID/slug)
- Enhanced gallery system with detailed image metadata
- Improved media URL handling with relative paths
- Optimized caching strategies

### Version 2.0 (2025-07-15)
- Complete CVPS processor implementation
- All 14 core endpoints operational
- Authentication and caching systems
- URL builder compliance

### Version 1.0 (2025-06-01)
- Initial CVPS processor specification
- Basic endpoint structure defined
- Authentication requirements established

---

**Generated by**: MVPS-CVPS Management Agent  
**Documentation Status**: ✅ CURRENT - All endpoints tested and operational  
**Last Validation**: 2025-08-05 18:59:00 UTC