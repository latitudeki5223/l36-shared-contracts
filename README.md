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
│   └── API_CONTRACT.md         # REST API endpoint specifications
├── data-schemas/
│   └── shared-types.ts         # TypeScript interfaces
├── integration-specs/
│   └── cvps-processor.md       # CVPS Processor specifications
├── docs/
│   └── migration-guides/       # Migration documentation
└── README.md                   # This file
```

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