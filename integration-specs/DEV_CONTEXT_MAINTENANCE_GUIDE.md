# Dev Context Maintenance System

## Overview

The Dev Context system tracks API alignment between MVPS and CVPS. This guide documents the current state and maintenance procedures.

## Current State (2025-08-02)

**Status**: ✅ Systems are in sync
- **API Version**: CVPS Processor v2.0
- **Endpoints**: 8 GET-only endpoints at `/api/cvps/*`
- **Authentication**: API key-based with site ID validation
- **Test Script**: Available in shared-contracts repo

## CVPS Processor Endpoints

All endpoints verified working as of 2025-08-02:

1. `/api/cvps/health` - Service health check
2. `/api/cvps/homepage` - Homepage content
3. `/api/cvps/products` - Product catalog (with search/filter/pagination)
4. `/api/cvps/blog` - Blog posts (with limit parameter)
5. `/api/cvps/categories` - Category hierarchy
6. `/api/cvps/newsletter` - Newsletter configuration
7. `/api/cvps/galleries` - Gallery list (with limit parameter)
8. `/api/cvps/galleries/{slug}` - Single gallery by slug

## Shared Contracts Repository

The single source of truth for API contracts is maintained at:
- **GitHub**: `github.com:latitudeki5223/l36-shared-contracts.git`
- **Local**: `/home/admin/l36/shared-contracts/`

### Key Files
- `api-contracts/cvps-processor-endpoints.md` - Complete API specification
- `integration-specs/test-cvps-endpoints.sh` - Endpoint test script
- `integration-specs/dev-context-sync.md` - System state documentation

## Testing & Validation

### Automated Testing
```bash
# Test all endpoints
cd /home/admin/l36/shared-contracts
./integration-specs/test-cvps-endpoints.sh local  # Test localhost
./integration-specs/test-cvps-endpoints.sh dev    # Test development
./integration-specs/test-cvps-endpoints.sh prod   # Test production
```

### Manual Verification
```bash
# Check sync status
curl -X GET http://localhost:5050/api/dev/context/sync-status \
  -H "X-Dev-Auth: dev-secret-token" | jq

# Test specific endpoint
curl -X GET http://localhost:5050/api/cvps/homepage \
  -H "X-API-Key: cvps-dev-key-2025" \
  -H "X-Site-ID: dev.latitude36.com.au"
```

## Maintenance Procedures

### 1. Update Shared Contracts
When API changes occur:
```bash
cd /home/admin/l36/shared-contracts
git pull origin main
# Make updates
git add -A
git commit -m "feat: update API specification"
git push origin main
```

### 2. Notify Both Systems
Use the Claude messaging system:
```bash
cd /home/admin/l36/claude-orchestrator/scripts
./claude-msg-enhanced.sh send customer_system "API contracts updated in shared repo"
```

### 3. Run Compliance Tests
Verify all endpoints are working:
```bash
cd /home/admin/l36/shared-contracts
./integration-specs/test-cvps-endpoints.sh local
```

## Best Practices

### 1. Documentation First
- Update shared contracts BEFORE implementing changes
- Ensure both MVPS and CVPS teams are aware of changes

### 2. Test Everything
- Run test script after any API changes
- Verify both development and production environments

### 3. Clear Communication
- Use Claude messaging for cross-system notifications
- Document all changes in shared contracts repo

## Integration Notes

### For MVPS (Management VPS)
- Backend implementation: `/home/admin/l36/backend/app/cvps_processor/`
- Technical docs: `/home/admin/l36/docs/CVPS_PROCESSOR_TECHNICAL_DOCUMENTATION.md`
- API endpoints: `http://localhost:5050/api/cvps/*`

### For CVPS (Customer VPS)
- Frontend configuration: `VITE_USE_CVPS_PROCESSOR=true`
- API gateway: `https://api.dev.latitude36.com.au`
- Shared contracts: Pull from GitHub repo

## Troubleshooting

### Issue: Endpoints returning 401
- Verify API key matches: `cvps-dev-key-2025` (dev) or `cvps-prod-key-2025` (prod)
- Check Site-ID header: `dev.latitude36.com.au` (dev) or `latitude36.com.au` (prod)

### Issue: Endpoints returning 405
- All endpoints are GET-only
- POST requests will return 405 Method Not Allowed

### Issue: Missing endpoints
- Individual item endpoints (`/product/{id}`, `/category/{slug}`, `/blog/{slug}`) do not exist
- Use list endpoints with filtering instead

## Quick Reference

### Authentication Headers
```http
X-API-Key: cvps-dev-key-2025
X-Site-ID: dev.latitude36.com.au
```

### Base URLs
- Local: `http://localhost:5050/api/cvps`
- Development: `https://api.dev.latitude36.com.au/api/cvps`
- Production: `https://l36.com.au/api/cvps`

### Response Format
```json
{
  "success": true,
  "data": { /* endpoint specific */ },
  "cached_at": "2025-08-02T22:38:26.916997",
  "version": "1.0"
}
```

---

*Last Updated: 2025-08-02*  
*Status: ✅ Production Ready*  
*API Version: CVPS Processor v2.0*