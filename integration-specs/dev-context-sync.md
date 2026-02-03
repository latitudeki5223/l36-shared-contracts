# Development Context Synchronization

## Current System State (2025-08-02)

### API Implementation Status

#### CVPS Processor (Active)
- **Version**: 2.0
- **Status**: FULLY OPERATIONAL
- **Endpoints**: 8 GET-only endpoints at `/api/cvps/*`
- **Authentication**: 
  - Dev: `X-API-Key: cvps-dev-key-2025`, `X-Site-ID: latitude36.com.au`
  - Prod: `X-API-Key: cvps-prod-key-2025`, `X-Site-ID: latitude36.com.au`

#### Working Endpoints
1. `/api/cvps/health` - Service health check
2. `/api/cvps/homepage` - Homepage content
3. `/api/cvps/products` - Product catalog (search, filter, pagination)
4. `/api/cvps/blog` - Blog posts (limit parameter)
5. `/api/cvps/categories` - Category hierarchy
6. `/api/cvps/newsletter` - Newsletter configuration
7. `/api/cvps/galleries` - Galleries list (limit parameter)
8. `/api/cvps/galleries/{slug}` - Single gallery by slug

### Frontend Configuration

#### CVPS Frontend (latitude36.com.au)
- **VITE_USE_CVPS_PROCESSOR**: `true`
- **API Gateway**: `https://api.latitude36.com.au`
- **Direct Backend**: `http://localhost:5050` (local dev only)

#### Media URL Strategy
- All media URLs returned as relative paths: `/media/...`
- Frontend constructs full URLs based on environment
- Dev: `https://api.latitude36.com.au/media/...`
- Prod: `https://l36.com.au/media/...`

### Testing

#### Test Script Location
`/integration-specs/test-cvps-endpoints.sh`

Usage:
```bash
./test-cvps-endpoints.sh local  # Test localhost:5050
./test-cvps-endpoints.sh dev    # Test latitude36.com.au
./test-cvps-endpoints.sh prod   # Test production
```

### Key Implementation Notes

1. **No Individual Item Endpoints**: Use list endpoints with filtering
   - For specific product: `/api/cvps/products?search={name}`
   - For category products: `/api/cvps/products?category={slug}`
   - For specific blog: Get all and filter client-side

2. **GET-Only**: All endpoints are GET. POST returns 405

3. **Cache Status**: Currently disabled (Redis configured but not active)

4. **Response Format**: All responses include `success: true/false` flag

### Recent Changes (2025-08-02)

1. ✅ Clarified actual vs planned endpoints
2. ✅ Updated shared contracts to reflect reality
3. ✅ Removed all deprecated/legacy references
4. ✅ Created comprehensive test script
5. ✅ Aligned frontend and backend on working endpoints

### Known Issues

None - all 8 endpoints confirmed working

### Contact

- **MVPS Claude**: Management system instance
- **CVPS Claude**: Customer system instance
- **Communication**: Via claude-msg-enhanced.sh