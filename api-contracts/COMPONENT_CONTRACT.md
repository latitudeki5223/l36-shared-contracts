# MVPS → CVPS Component Contract

**Version**: 1.0
**Created**: 2026-03-27
**Purpose**: Rules for creating new section types that CVPS can render

---

## The Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  MVPS (Brain)                   CVPS (Window)                   │
│  ═══════════                    ════════════                    │
│                                                                 │
│  - Decides what sections        - Displays what's sent          │
│  - Decides the order            - Doesn't add anything          │
│  - Provides all CSS styling     - Doesn't change anything       │
│  - Provides all data            - Just renders HTML             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CVPS is a dumb renderer.** It receives instructions and renders HTML with the correct CSS class names. All visual decisions (colors, spacing, layout, responsive behavior) come from MVPS via the `css_inline` field.

---

## The Golden Rule

> **MVPS must never send a section type that CVPS doesn't have registered.**

Before using any new section type, MVPS must submit a Component Request to CVPS.

---

## What MVPS Sends

```json
{
  "page": {
    "title": "Page Title",
    "sections": [
      {
        "type": "section_type_name",
        "order": 1,
        "props": { "layout_options": "from_puck_editor" },
        "data": { "live_content": "from_database" }
      }
    ],
    "css_inline": "/* All styling - colors, spacing, layout, responsive */"
  }
}
```

| Field | Who Controls | Purpose |
|-------|--------------|---------|
| `type` | MVPS | Tells CVPS which component to use |
| `order` | MVPS | Render sequence (1 first, 2 second, etc.) |
| `props` | MVPS | Layout/config options from Puck editor |
| `data` | MVPS | Live content from database |
| `css_inline` | MVPS | ALL visual styling |

---

## What CVPS Does

1. **Injects the CSS**: `<style>{css_inline}</style>`
2. **Looks up component**: `SECTION_COMPONENTS[type]`
3. **Renders HTML**: Using exact class names that match the CSS
4. **Passes data**: Puts `data` values into the HTML

---

## Component Request Specification

When MVPS needs a new section type, provide this YAML:

```yaml
# ══════════════════════════════════════════════════════════════
# CVPS COMPONENT REQUEST
# ══════════════════════════════════════════════════════════════

type: "section_type_name"
# Must be lowercase, snake_case
# Use prefix for site-specific: ec_, dir_, blog_, info_
# No prefix for universal components

css_classes:
  root: ".prefix-component"
  # List ALL class names CVPS must use in HTML structure
  # Use BEM naming: .block__element--modifier
  elements:
    - ".prefix-component__image"
    - ".prefix-component__title"
    - ".prefix-component__subtitle"
    - ".prefix-component__cta"
    - ".prefix-component__cta--primary"
    - ".prefix-component__cta--secondary"

data_shape:
  # Exact structure CVPS will receive in the `data` field
  # Include types and whether required/optional
  field_name: "type (required|optional)"

props_shape:
  # Exact structure CVPS will receive in the `props` field
  # These are layout/config options from Puck editor
  prop_name: "type (required|optional)"

html_structure: |
  # Show the expected HTML nesting so CVPS builds it correctly
  <div class="prefix-component">
    <img class="prefix-component__image" />
    <div class="prefix-component__content">
      <h2 class="prefix-component__title"></h2>
      <p class="prefix-component__subtitle"></p>
      <div class="prefix-component__actions">
        <a class="prefix-component__cta prefix-component__cta--primary"></a>
        <a class="prefix-component__cta prefix-component__cta--secondary"></a>
      </div>
    </div>
  </div>

notes: |
  # Any special behavior, conditionals, or edge cases
```

---

## Naming Conventions

### Type Names

| Site Type | Prefix | Examples |
|-----------|--------|----------|
| Ecommerce | `ec_` | `ec_product_grid`, `ec_cart_summary`, `ec_checkout_form` |
| Directory | `dir_` | `dir_listing_card`, `dir_map_view`, `dir_filter_sidebar` |
| Blog | `blog_` | `blog_post_card`, `blog_author_bio`, `blog_related_posts` |
| Info/Landing | `info_` | `info_hero`, `info_features`, `info_testimonials` |
| Universal | (none) | `hero`, `footer`, `header`, `contact_form`, `faq` |

### CSS Classes

Use BEM (Block Element Modifier) naming:

```
.block                    →  Root container
.block__element           →  Child element
.block__element--modifier →  Variation of element
```

Examples:
```css
.dir-listing-card                    /* Block */
.dir-listing-card__image             /* Element */
.dir-listing-card__cta               /* Element */
.dir-listing-card__cta--primary      /* Modifier */
.dir-listing-card__cta--disabled     /* Modifier */
```

---

## Example: Complete Request

```yaml
# ══════════════════════════════════════════════════════════════
# CVPS COMPONENT REQUEST
# ══════════════════════════════════════════════════════════════

type: "dir_business_card"

css_classes:
  root: ".dir-business-card"
  elements:
    - ".dir-business-card__image"
    - ".dir-business-card__logo"
    - ".dir-business-card__name"
    - ".dir-business-card__category"
    - ".dir-business-card__rating"
    - ".dir-business-card__rating-stars"
    - ".dir-business-card__rating-count"
    - ".dir-business-card__address"
    - ".dir-business-card__cta"

data_shape:
  id: "number (required)"
  name: "string (required)"
  slug: "string (required)"
  image_url: "string (optional)"
  logo_url: "string (optional)"
  category: "string (required)"
  rating: "number 0-5 (optional)"
  review_count: "number (optional)"
  address: "string (optional)"

props_shape:
  show_rating: "boolean (optional, default true)"
  show_address: "boolean (optional, default true)"
  cta_text: "string (optional, default 'View Details')"

html_structure: |
  <article class="dir-business-card">
    <img class="dir-business-card__image" />
    <img class="dir-business-card__logo" />
    <h3 class="dir-business-card__name"></h3>
    <span class="dir-business-card__category"></span>
    <div class="dir-business-card__rating">
      <span class="dir-business-card__rating-stars"></span>
      <span class="dir-business-card__rating-count"></span>
    </div>
    <p class="dir-business-card__address"></p>
    <a class="dir-business-card__cta"></a>
  </article>

notes: |
  - Hide rating section entirely if rating is null
  - Hide address if show_address is false or address is null
  - Image falls back to placeholder if image_url is null
  - Logo only renders if logo_url exists
```

---

## The Workflow

```
┌──────────────────────────────────────────────────────────────┐
│  1. MVPS wants new section type                              │
│     ↓                                                        │
│  2. MVPS submits Component Request (yaml above)              │
│     ↓                                                        │
│  3. CVPS builds component using exact classes & structure    │
│     ↓                                                        │
│  4. CVPS confirms: "dir_business_card is registered"         │
│     ↓                                                        │
│  5. MVPS can now use it on ANY website with ANY styling      │
└──────────────────────────────────────────────────────────────┘
```

---

## Reusability

Once CVPS has a component registered, it works for ALL tenant websites:

```
CVPS Component: "dir_listing_card"
═══════════════════════════════════

Website A (Real Estate)      → MVPS sends blue theme CSS
Website B (Restaurant Guide) → MVPS sends warm color CSS
Website C (Trade Directory)  → MVPS sends minimal CSS

Same component, different styling per tenant.
```

**Build once, use everywhere.**

---

## Division of Responsibilities

| MVPS Controls | CVPS Controls |
|---------------|---------------|
| What sections appear | HTML tag choices (`div`, `section`, `article`) |
| Section order | CSS class application |
| All colors | Data placement in HTML |
| All spacing (margin, padding) | Conditional rendering logic |
| All layout (grid, flex, position) | |
| All typography | |
| All responsive behavior | |
| All animations | |

---

## Quick Reference

```
MVPS sends:              CVPS provides:
───────────              ──────────────
type                  →  Component that matches
css_inline            →  <style> injection
data                  →  Values in the HTML
props                 →  Conditional rendering
order                 →  Render sequence

MVPS = The Artist (creates everything)
CVPS = The Window (displays it)
```

---

## Rules Summary

| Rule | Description |
|------|-------------|
| **No surprises** | Never send a type CVPS doesn't have |
| **Exact classes** | CVPS will use these exact class names |
| **BEM naming** | `.block__element--modifier` format |
| **Prefixes** | `ec_`, `dir_`, `blog_`, `info_` or none for universal |
| **Document everything** | Data shape, props shape, HTML structure |
| **MVPS owns styling** | Colors, spacing, layout all in CSS |
| **CVPS owns structure** | HTML skeleton with correct classes |

---

## Currently Registered Components

See `frontend-nextjs/components/section-config/registry.tsx` for the full list.

### Universal (33 components)
- `header`, `footer`
- `hero`, `text`, `mission`, `story`, `brand_story`
- `newsletter`, `contact_form`, `cta`, `stats`, `logo_cloud`
- `video`, `map`
- `features`, `service_grid`, `image_text_split`
- `faq`, `tabs`, `card_grid`, `gallery`
- `timeline`, `process_flow`
- `product_showcase`, `pricing_table`, `testimonials`
- `team`, `comparison_table`
- `event_calendar`, `course_curriculum`
- `custom_html`, `donation_form`, `live_chat`
- `gateway_hero`, `category_portals`, `homepage_newsletter`

---

## Related Documentation

- `multi-tenant/dynamic_pages/components-plan/ARCHITECTURE.md` - Technical architecture
- `multi-tenant/dynamic_pages/implementation2/` - Implementation guides
- `frontend-nextjs/components/section-config/registry.tsx` - Component registry

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-27 | Initial contract — 33 universal components |
| 1.1 | 2026-03-29 | (removed — fuelwatch components deprecated) |
| 1.2 | 2026-04-04 | Removed fuelwatch components (project discontinued) |
