# Purity, Product Listing, and Product Detail API Parameters

This document defines the API contract required by the frontend pages:

- Purity page: /collections/{purity}
- Product listing page: /collections/{purity}/{category}/{style}
- Product detail page: /collections/{purity}/{category}/{style}/{id}

## 1) Purity Page API

### Endpoint
GET /api/categories

### Purpose
Return all category cards for a purity (example: 18k, 22k).

### Query Parameters

| Name | Type | Required | Allowed / Format | Example |
|------|------|----------|------------------|---------|
| purity | string | Yes | Case-insensitive purity slug | 18k, 22k |

### Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": "18k-bangles-bracelet",
      "name": "Bangles & Bracelet",
      "slug": "bangles-bracelet",
      "image": "/images/menu/menu-1.png",
      "purity": "18k"
    }
  ]
}

### Error Response
- 400 Bad Request when purity is missing

{
  "success": false,
  "error": "Missing required query param: purity"
}

---

## 2) Product Listing Page API

### Endpoint
GET /api/products

### Purpose
Return products for selected purity + category + style.

### Query Parameters

| Name | Type | Required | Allowed / Format | Example |
|------|------|----------|------------------|---------|
| purity | string | Yes | Case-insensitive purity slug | 18k |
| category | string | Yes | Category slug | bangles-bracelet |
| style | string | Yes | Style slug | dazzling |

### Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": "ZAR001",
      "name": "Dazzling Kada",
      "slug": "dazzling-kada",
      "description": "CZ handwork with lightweight profile",
      "price": 0,
      "image": "/images/collections/product-1.webp",
      "category": "bangles-bracelet",
      "purity": "18k",
      "style": "dazzling"
    }
  ]
}

### Error Response
- 400 Bad Request when any required parameter is missing

{
  "success": false,
  "error": "Missing required query params: purity, category, style"
}

---

## 3) Product Detail Page API

### Endpoint
GET /api/products/{id}

### Purpose
Return one product detail and related products for the same purity/category/style context.

### Path Parameters

| Name | Type | Required | Allowed / Format | Example |
|------|------|----------|------------------|---------|
| id | string | Yes | Product id (case-insensitive match) | ZAR001 |

### Query Parameters

| Name | Type | Required | Allowed / Format | Example |
|------|------|----------|------------------|---------|
| purity | string | Yes | Case-insensitive purity slug | 18k |
| category | string | Yes | Category slug | bangles-bracelet |
| style | string | Yes | Style slug | dazzling |

### Success Response (200)
{
  "success": true,
  "data": {
    "product": {
      "id": "ZAR001",
      "name": "Dazzling Kada",
      "slug": "dazzling-kada",
      "description": "CZ handwork with lightweight profile",
      "price": 0,
      "image": "/images/collections/product-1.webp",
      "category": "bangles-bracelet",
      "purity": "18k",
      "style": "dazzling",
      "sku": "DZ-001",
      "images": ["/images/collections/product-1.webp"],
      "model3d": "/images/models/ZAR-1.glb",
      "variants": ["2.2", "2.4", "2.6", "2.8"],
      "weight": "8.186",
      "finish": "High-polish with intricate laser-cut filigree work.",
      "specifications": {
        "Gross Weight:": "42.500 grams",
        "Net Gold Weight:": "38.200 grams"
      },
      "technicalSpecs": [
        { "feature": "Metal Purity", "details": "Standard 18K Gold" }
      ],
      "manufacturing": {
        "heading": "Manufacturing & Customization Support",
        "subtitle": "As the direct manufacturer, Zar offers the following B2B support for this design:",
        "points": [
          {
            "label": "Stone Customization",
            "text": "Replace synthetic stones with natural stones or certified diamonds for bulk orders."
          }
        ]
      }
    },
    "related": [
      {
        "id": "ZAR002",
        "name": "Related Design",
        "slug": "related-design",
        "description": "...",
        "price": 0,
        "image": "/images/collections/product-2.webp",
        "category": "bangles-bracelet",
        "purity": "18k",
        "style": "dazzling"
      }
    ]
  }
}

### Error Responses
- 400 Bad Request when purity/category/style is missing
- 404 Not Found when product id is not found in given context

400 example:
{
  "success": false,
  "error": "Missing required query params: purity, category, style"
}

404 example:
{
  "success": false,
  "error": "Product not found"
}

---

## Validation Rules for Backend Team

1. Treat purity, category, style, id as case-insensitive.
2. Always validate purity/category/style context before fetching products.
3. Product detail lookup must be scoped to purity + category + style + id.
4. Keep response shape stable (success + data/error), because frontend expects this contract.
5. For empty valid context in listing APIs, return success true with data as empty array.

---

## Frontend Usage Mapping

- /collections/{purity} uses GET /api/categories?purity={purity}
- /collections/{purity}/{category}/{style} uses GET /api/products?purity={purity}&category={category}&style={style}
- /collections/{purity}/{category}/{style}/{id} uses GET /api/products/{id}?purity={purity}&category={category}&style={style}
