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
│   ├── API_CONTRACT.md              # REST API endpoint specifications
│   └── cvps-processor-endpoints.md  # CVPS Processor API specification
├── data-schemas/
│   ├── shared-types.ts              # Shared TypeScript interfaces
│   └── cvps-processor.types.ts      # CVPS Processor TypeScript types
├── integration-specs/
│   └── cvps-processor.md            # CVPS Processor specifications
├── docs/
│   └── migration-guides/            # Migration documentation
└── README.md                        # This file
```

## Available Contracts

### CVPS Processor API (v1.0)
- **Specification**: [api-contracts/cvps-processor-endpoints.md](api-contracts/cvps-processor-endpoints.md)
- **TypeScript Types**: [data-schemas/cvps-processor.types.ts](data-schemas/cvps-processor.types.ts)
- **Endpoints**: 7 optimized endpoints for customer-facing operations
- **Authentication**: API key-based with site ID validation
- **Caching**: Built-in with configurable TTLs

## Usage

### For MVPS Team
```bash
git clone git@github.com:[your-org]/l36-shared-contracts.git
```

### For CVPS Team
```bash
git clone git@github.com:[your-org]/l36-shared-contracts.git
```

## Contributing

1. Create feature branch: `git checkout -b feature/update-contract`
2. Make changes
3. Commit: `git commit -m "feat: update API contract"`
4. Push: `git push origin feature/update-contract`
5. Create Pull Request

## Contract Validation

Both VPS systems should implement contract validation to ensure compliance with shared specifications.

## Change Log

### 2025-07-31
- Added CVPS Processor API v1.0 specification
- Added TypeScript type definitions for all CVPS endpoints
- Documented authentication, caching, and error handling