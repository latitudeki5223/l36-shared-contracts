# L36 Shared Contracts Repository

This repository contains shared contracts and specifications between MVPS (Management VPS) and CVPS (Customer VPS).

## Purpose

- **Single Source of Truth**: Shared API contracts, data schemas, and integration specifications
- **Version Control**: Track changes to contracts over time
- **Cross-VPS Collaboration**: Both MVPS and CVPS teams can access and update

## Structure

```
/
├── api-contracts/
│   ├── API_CONTRACT.md              # Current API specification
│   └── cvps-processor-endpoints.md  # CVPS Processor API v2.0
├── data-schemas/
│   └── cvps-processor.types.ts      # CVPS TypeScript types
├── integration-specs/
│   ├── test-cvps-endpoints.sh       # Endpoint test script
│   └── dev-context-sync.md          # System state documentation
└── README.md                        # This file
```

## Current API Standard

### CVPS Processor API (v2.0)
- **Specification**: [api-contracts/cvps-processor-endpoints.md](api-contracts/cvps-processor-endpoints.md)
- **TypeScript Types**: [data-schemas/cvps-processor.types.ts](data-schemas/cvps-processor.types.ts)
- **Test Script**: [integration-specs/test-cvps-endpoints.sh](integration-specs/test-cvps-endpoints.sh)
- **Endpoints**: 8 optimized GET-only endpoints
- **Authentication**: API key-based with site ID validation
- **Status**: PRODUCTION READY

## Quick Start

### Test Endpoints
```bash
# Clone repository
git clone git@github.com:latitudeki5223/l36-shared-contracts.git
cd l36-shared-contracts

# Run tests
./integration-specs/test-cvps-endpoints.sh local  # Test localhost
./integration-specs/test-cvps-endpoints.sh dev    # Test dev environment
./integration-specs/test-cvps-endpoints.sh prod   # Test production
```

### Authentication
All endpoints require:
```http
X-API-Key: cvps-dev-key-2025      # Development
X-Site-ID: dev.latitude36.com.au  # Development
```

## Available Endpoints

1. `/api/cvps/health` - Service health check
2. `/api/cvps/homepage` - Homepage content
3. `/api/cvps/products` - Product catalog
4. `/api/cvps/blog` - Blog posts
5. `/api/cvps/categories` - Category hierarchy
6. `/api/cvps/newsletter` - Newsletter config
7. `/api/cvps/galleries` - Gallery list
8. `/api/cvps/galleries/{slug}` - Single gallery

## Contributing

1. Create feature branch: `git checkout -b feature/update-contract`
2. Make changes
3. Test changes: `./integration-specs/test-cvps-endpoints.sh local`
4. Commit: `git commit -m "feat: update API contract"`
5. Push: `git push origin feature/update-contract`
6. Create Pull Request

## Change Log

### 2025-08-02
- Updated to v2.0 with accurate 8-endpoint specification
- Added comprehensive test script
- Created dev-context-sync documentation
- Removed all deprecated/legacy references

### 2025-07-31
- Initial CVPS Processor API v1.0 specification
- Added TypeScript type definitions