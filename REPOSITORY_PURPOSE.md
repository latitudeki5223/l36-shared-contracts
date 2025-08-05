# Repository Purpose & Structure

## This Repository: L36 Shared Contracts

**Purpose**: API contracts and specifications shared between MVPS and CVPS

**What belongs here**:
- API endpoint specifications
- Data schemas and TypeScript types
- Integration test scripts
- API compliance validation tools
- Cross-system documentation

**What does NOT belong here**:
- Claude orchestrator tools
- Implementation-specific code
- System-specific deployment guides
- Internal scripts

## Directory Structure

```
/shared-contracts/
├── api-contracts/           # API specifications
│   ├── API_CONTRACT.md     # Main contract (v2.0)
│   └── cvps-processor-endpoints.md  # CVPS Processor spec
├── data-schemas/           # TypeScript types
│   └── cvps-processor.types.ts
├── integration-specs/      # Testing & validation
│   ├── test-cvps-endpoints.sh       # Endpoint test script
│   ├── validate-cvps-coverage.py    # Coverage validation
│   ├── dev-context-sync.md          # System state
│   └── DEV_CONTEXT_MAINTENANCE_GUIDE.md  # Maintenance guide
└── README.md              # Repository overview
```

## Related Repository

**Claude Orchestrator** (`github.com:latitudeki5223/claude-orchestrator`)
- Purpose: Claude-to-Claude communication and task orchestration
- Location: `/home/admin/l36/claude-orchestrator/`
- Access: Manager Claude (read/write), Consumer Claudes (read-only)

---

*Last Updated: 2025-08-03*