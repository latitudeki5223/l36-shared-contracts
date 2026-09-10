# Files Dossier Contract — v1

Version: 1.0 (draft — receiving endpoint not yet built)
Last Updated: 2026-09-10
Owners: the `files` research box (producer) · L36 backend (consumer)

## Overview

A **dossier** is one finished File episode handed from a research engine on the `files` box to the L36 content factory. It carries finished narration, every claim with its source, every media item with its rights, and the data behind timelines and charts. The factory produces the film, the archive article, the shorts and the cards from it and queues them for human approval. **The factory never redoes research and never rewrites narration.**

```
files (engine) ──POST dossier──▶ L36 /api/files/dossiers ──▶ context → gates → approval queue
files (engine) ◀──GET status───  L36 /api/files/dossiers/{id}   (status · links · performance)
```

Direction is fixed: **Files pushes, L36 never pulls.** Return information is fetched by the engine; L36 makes no calls into the `files` box.

## Two doors

| Door | Endpoint | Use | Status |
|---|---|---|---|
| **A — lead** | `POST /api/social/compose-and-queue` | "Here is a finding and an angle; the factory writes the post." Quick social posts from a single research finding. Body: `{topic, tone, target_account, platforms?, brief:{content, query_text, angle, source_url, source_domain, source_type, importance, credibility_score}, card_template_id?, video_media?}` | **live** |
| **B — dossier** | `POST /api/files/dossiers` | "Here is a finished File episode; produce and queue it." This document. | **to build** (Phase 2 of the Files lane) |

Both doors are per-brand: the caller's key is bound to one context and can write nowhere else.

## Transport, auth, idempotency, versioning

- **HTTPS JSON**, `Content-Type: application/json`. The L36 API binds to localhost behind Traefik and is not exposed on Tailscale; the producer calls the public API host for the environment.
- **Auth:** `X-API-Key: <brand agent key>` + `X-Context-ID: <context id>`. The key is minted on L36 (`agent_api_keys`), bound to exactly one context; a mismatch is `403`. Admin token (`X-Admin-Token`) is also accepted for operator use.
- **Idempotency:** `dossier_id` is the key. Re-POSTing an identical dossier returns `200` with the original ids. Re-POSTing the same `dossier_id` with a different body is `409 dossier_conflict` — bump `revision` to supersede.
- **Versioning:** every dossier carries `"contract": "files-dossier/1.0"`. The consumer rejects unknown majors with `400 unsupported_contract`. Minor versions only add optional fields.
- **Limits:** body ≤ 2 MB · `acts` 1–8 · `claims` ≤ 500 · narration ≤ 12 000 chars per act · `media` ≤ 200 items · all `*_url` values `https` only.

## `POST /api/files/dossiers`

Accepts a dossier, validates it completely **before** writing anything, persists the evidence, creates the File/episode rows, and queues the episode for production under the brand's gates. Nothing publishes: the brand's `authority`/killswitch apply as for every other post.

### Response `202 Accepted`

```json
{ "dossier_id": "af-wool-001", "revision": 1, "file_id": 4801, "content_id": 4822, "status": "queued",
  "received_at": "2026-09-10T04:12:00Z" }
```

`200 OK` with the same body on an identical replay.

### Errors

| Code | `error` | Meaning |
|---|---|---|
| 400 | `invalid_dossier` | `detail` names the JSON path and rule, e.g. `claims[3].claim_type: must be one of fact\|interpretation\|eyewitness\|disputed` |
| 400 | `unsupported_contract` | `contract` major not understood |
| 401 / 403 | `unauthorized` / `forbidden` | missing key · key not bound to `X-Context-ID` |
| 409 | `dossier_conflict` | same `dossier_id`, different body, same `revision` |
| 413 | `too_large` | body over 2 MB |
| 422 | `gate_rejected` | validation passed but a **hard** editorial rule failed (see Gates) — `detail` lists every violation, the dossier is stored with `status: rejected` for audit |

All error bodies: `{"success": false, "error": "<code>", "detail": "<human sentence>", "violations": [ {"path": "...", "rule": "..."} ]}`.

## The dossier

Field order below is the canonical order. `req` = required.

### Envelope

| Field | Type | req | Notes |
|---|---|---|---|
| `contract` | string | ✓ | `"files-dossier/1.0"` |
| `dossier_id` | string | ✓ | `^[a-z]{2,4}-[a-z0-9-]{1,40}-[0-9]{3}$` e.g. `af-wool-001` · stable for the life of the episode |
| `revision` | int ≥ 1 | ✓ | bump to supersede an earlier push of the same `dossier_id` |
| `brand` | string | ✓ | the L36 `context_key`, must match the key's context |
| `file_number` | string | ✓ | `"001"` — the File this episode belongs to |
| `category` | string | ✓ | brand category slug, e.g. `industry`, `people`, `gold` |
| `story_format` | enum | ✓ | `opening` · `company_file` · `major_update` · `six_month_review` · `one_year_review` · `closed` · `supporting` |
| `subject` | string ≤ 200 | ✓ | |
| `subject_type` | enum | ✓ | `industry` · `person` · `company` · `event` · `place` |
| `title` | string ≤ 100 | ✓ | the episode title |
| `target_duration_seconds` | int | ✓ | film length the narration is written for |
| `thesis` | string ≤ 1 000 | ✓ | one paragraph: what this File argues and why it matters now |
| `related_dossier_ids` | string[] | | earlier episodes / other Files this links to |
| `origin` | object | ✓ | `{engine, version, created_at}` |

### `acts[]` — the finished script

| Field | Type | req | Notes |
|---|---|---|---|
| `act` | int 1..8 | ✓ | order |
| `title` | string ≤ 80 | ✓ | becomes the YouTube chapter title |
| `purpose` | string ≤ 300 | ✓ | |
| `narration` | string ≤ 12 000 | ✓ | **finished narration**, not a prompt; the factory renders it verbatim |
| `claim_ids` | string[] | ✓ | every claim this act rests on; each must exist in `claims[]` |
| `media_ids` | string[] | | preferred visuals for this act; each must exist in `media[]` |

Rule: every `claims[].id` must be referenced by at least one act, and every act must reference ≥ 1 claim.

### `claims[]` — the evidence

| Field | Type | req | Notes |
|---|---|---|---|
| `id` | string | ✓ | `c-001` style, unique within the dossier |
| `text` | string ≤ 500 | ✓ | the checkable statement |
| `claim_type` | enum | ✓ | `fact` · `interpretation` · `eyewitness` · `disputed` |
| `source_url` | https url | ✓ | |
| `source_domain` | string | ✓ | host of `source_url`; checked against the brand's source registry |
| `source_type` | enum | ✓ | `newspaper` · `filing` · `archive` · `statistic` · `book` · `oral_history` · `press` · `academic` · `interview` |
| `published_at` | date | | when the source was published |
| `retrieved_at` | datetime | ✓ | when the engine fetched it |
| `credibility` | 0..1 | ✓ | |
| `attribution` | string ≤ 120 | cond. | **required** for `interpretation` (whose reading) and `eyewitness` (who) |
| `contest` | string ≤ 500 | cond. | **required** for `disputed`: the competing reading |
| `secondary_source_urls` | https url[] | cond. | **≥ 1 required** for `disputed` |

### `quotes[]`

`{ id, text ≤ 400, speaker, source_url, locator (page / timecode), claim_type, rights_status }` — `rights_status` as for media when audio/video of the quote will be reused.

### `timeline[]` · `series[]`

`timeline[]`: `{ date, label ≤ 80, claim_id }`. `series[]`: `{ name, unit, points: [[date-or-label, number], …], claim_id }`. Every entry names the claim it rests on; a point with no claim is `invalid_dossier`.

### `media[]` — visuals, by reference only

| Field | Type | req | Notes |
|---|---|---|---|
| `id` | string | ✓ | `af-wool-001-m07` style |
| `kind` | enum | ✓ | `photo` · `film` · `map` · `document` · `chart` · `illustration` |
| `provenance` | enum | ✓ | `archival` · `generated` · `owned` · `licensed` |
| `source_url` | https url | ✓ | the factory fetches from here through its guarded fetcher; **never send bytes** |
| `source_domain` | string | ✓ | |
| `rights_status` | enum | ✓ | `cleared` · `restricted` · `review` · `unknown` · `rejected` |
| `licence` | string ≤ 200 | ✓ | |
| `attribution_text` | string ≤ 200 | cond. | required when the registry says attribution is required |
| `modification_allowed` | bool | ✓ | |
| `rights_evidence_url` | https url | | dated evidence of the terms |
| `rights_verified_at` | date | ✓ for `cleared` | |
| `caption` | string ≤ 200 | | on-screen caption; must not frame a `generated` item as archival |
| `label` | string ≤ 40 | cond. | **required** for `generated`: the visible label (`Illustration`, `Reconstruction`) |

### `milestones[]`

`{ text ≤ 200, due (date), claim_id? }` — the three measurable things the six-month / one-year review checks.

## Gates — what the factory enforces on receipt

Validation (`400`) is shape. Gates (`422`) are editorial rules from the brand's `content_brain.gates` block; a brand with `gates: {}` skips them.

| Gate | Rule | Result |
|---|---|---|
| sourcing | every numeral / % / $ amount / 4-digit year / quoted span in narration is covered by a referenced claim; an `interpretation` is attributed in the narration; `disputed` carries ≥ 2 sources and a contest | `422` listing each uncovered atom |
| provenance | a `generated` item is never captioned/labelled as archival; every `generated` item has a `label`; every `archival` item resolves to a registry domain with attribution satisfied | `422` per item |
| rights | any media with `rights_status ∈ {review, unknown, rejected}` referenced by an act | `422` — the dossier is stored, the episode is **not** queued |
| claims (Business Files only) | narration contains no price target, buy/sell/hold, recommendation or guaranteed-return wording | `422` |

Gates run again at the publish funnel on L36; passing on receipt does not bypass them later.

## What L36 does with it (mapping)

| Dossier part | Factory row |
|---|---|
| `file_number` (+ brand) | `content_items` (`content_type="file"`) — created on first episode, reused after |
| the episode | `content_items` (`content_type="long_video"`, `content.file_id`, `content.dossier_id`, `content.acts[]`, `content.chapters[]`) |
| `claims[]` | one `research_findings` row each — `research_metadata.{context_id, dossier_id, claim_id, claim_type, attribution, contest}`; `used_in_content_id` = the episode |
| `media[]` | `content.assets[]` on the episode (provenance + rights carried per item) |
| `acts[].narration` | the film's per-act script; `acts[].title` → YouTube chapters |
| `series[]` | rendered to chart PNGs → card `sc_product_image` slots |
| `milestones[]` | `content.milestones[]` on the File row |
| the archive article | `content_items` (`content_type="blog"`) with `content.citations[]` = the claims |

Everything is an existing table or an existing JSONB column. No dossier field creates a new table.

## `GET /api/files/dossiers/{dossier_id}`

```json
{ "dossier_id": "af-wool-001", "revision": 1, "file_id": 4801, "content_id": 4822,
  "status": "queued | producing | pending_approval | approved | published | rejected | failed",
  "reason": "only for rejected / failed",
  "outputs": [ { "channel": "youtube", "kind": "long_video", "url": "...", "external_id": "...", "published_at": "..." },
               { "channel": "tiktok",  "kind": "short",      "url": "...", "source_act": 2 } ],
  "performance": { "captured_at": "...", "views": 0, "impressions": 0, "ctr": 0.0,
                   "avg_view_duration_s": 0, "retention_30s": 0.0, "subscribers_gained": 0 },
  "updated_at": "..." }
```

`performance` is `null` until the channel reader has run. This is the return that closes the learning loop; the engine polls it — L36 never calls the `files` box.

## Example

An abridged *White Gold* opening episode is in `files-dossier-v1.example.json` beside this file. It is the fixture the receiving endpoint's tests validate against.

## Change log

- **1.0** (2026-09-10) — first draft. Door A live; Door B, the gates on receipt and the status endpoint are the Phase 2 build on L36.
