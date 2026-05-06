# Event Page API Parameters

This document defines the API contract required by the Events page:

- Event page route: /event
- Sections on page:
  - Upcoming Exhibitions
  - Past Exhibitions
  - Past Exhibition gallery modal (images)

## Recommended Endpoints

1. GET /api/events
2. GET /api/events/{id}

---

## 1) Events Listing API

### Endpoint
GET /api/events

### Purpose
Return upcoming and/or past exhibitions for the Events page.

### Query Parameters

| Name | Type | Required | Allowed / Format | Default | Example |
|------|------|----------|------------------|---------|---------|
| type | string | No | upcoming, past, all | all | upcoming |
| page | number | No | >= 1 | 1 | 1 |
| limit | number | No | 1 to 50 | 10 | 6 |
| sort | string | No | eventDateAsc, eventDateDesc | eventDateDesc | eventDateAsc |
| city | string | No | Free text filter | - | Sharjah |
| country | string | No | ISO-2 or full name | - | UAE |
| year | number | No | YYYY | - | 2026 |
| includeGallery | boolean | No | true, false | false | true |

### Notes for frontend mapping
- Upcoming section: call with type=upcoming&limit=1 (or more if needed later)
- Past section: call with type=past&sort=eventDateDesc
- If includeGallery=false, gallery image arrays can be omitted to reduce payload size

### Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": "evt-sharjah-2026",
      "slug": "watch-jewellery-show-sharjah-2026",
      "title": "Watch and Jewellery Show Sharjah",
      "type": "upcoming",
      "eventDateStart": "2026-04-08",
      "eventDateEnd": "2026-04-12",
      "dateLabel": "08 Apr - 12 Apr 2026",
      "location": {
        "city": "Sharjah",
        "country": "UAE",
        "venue": "Expo Centre Sharjah"
      },
      "description": "Sharjah Watch and Jewellery Show 2026 is a biannual event...",
      "thumbnail": "/images/homepage/event.webp",
      "banner": "/images/homepage/event_bg.webp",
      "ctaUrl": "/event/watch-jewellery-show-sharjah-2026",
      "galleryCount": 4,
      "images": [
        "/images/career/career3.webp",
        "/images/career/career4.webp"
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "hasNextPage": false
  }
}

### Error Response
- 400 Bad Request for invalid query values

{
  "success": false,
  "error": "Invalid query param: type. Allowed values are upcoming, past, all"
}

---

## 2) Event Detail API

### Endpoint
GET /api/events/{id}

### Purpose
Return full event information and full gallery for detail page or modal data source.

### Path Parameters

| Name | Type | Required | Allowed / Format | Example |
|------|------|----------|------------------|---------|
| id | string | Yes | Event id or slug | evt-sharjah-2026 |

### Query Parameters

| Name | Type | Required | Allowed / Format | Default | Example |
|------|------|----------|------------------|---------|---------|
| includeGallery | boolean | No | true, false | true | true |

### Success Response (200)
{
  "success": true,
  "data": {
    "id": "evt-sharjah-2026",
    "slug": "watch-jewellery-show-sharjah-2026",
    "title": "Watch and Jewellery Show Sharjah",
    "type": "upcoming",
    "eventDateStart": "2026-04-08",
    "eventDateEnd": "2026-04-12",
    "dateLabel": "08 Apr - 12 Apr 2026",
    "location": {
      "city": "Sharjah",
      "country": "UAE",
      "venue": "Expo Centre Sharjah"
    },
    "description": "Sharjah Watch and Jewellery Show 2026 is a biannual event...",
    "thumbnail": "/images/homepage/event.webp",
    "banner": "/images/homepage/event_bg.webp",
    "images": [
      "/images/career/career3.webp",
      "/images/career/career4.webp",
      "/images/career/career5.webp",
      "/images/career/career2.webp"
    ],
    "seo": {
      "title": "Watch and Jewellery Show Sharjah | Zar Events",
      "description": "Discover Zar Jewels at Sharjah Watch and Jewellery Show 2026"
    }
  }
}

### Error Responses
- 404 Not Found when event id is invalid

{
  "success": false,
  "error": "Event not found"
}

---

## Event Object Contract

| Field | Type | Required | Notes |
|------|------|----------|------|
| id | string | Yes | Stable unique key |
| slug | string | Yes | URL-safe identifier |
| title | string | Yes | Event heading |
| type | string | Yes | upcoming or past |
| eventDateStart | string | Yes | ISO date (YYYY-MM-DD) |
| eventDateEnd | string | Yes | ISO date (YYYY-MM-DD) |
| dateLabel | string | Yes | Preformatted UI label |
| location.city | string | Yes | City name |
| location.country | string | Yes | Country |
| location.venue | string | No | Venue name |
| description | string | Yes | Summary text |
| thumbnail | string | Yes | Card image URL |
| banner | string | No | Section/detail hero image |
| ctaUrl | string | No | Optional button target |
| images | string[] | No | Gallery images (required when includeGallery=true) |
| galleryCount | number | No | Useful when images are omitted |

---

## Backend Validation Rules

1. type must be one of: upcoming, past, all.
2. page and limit must be numeric and positive.
3. Return dates in ISO format; frontend can show dateLabel directly.
4. Keep response envelope stable: success + data (+ meta for list).
5. For valid empty states, return success=true and data=[] (not 404).

---

## Frontend Usage Mapping

- Upcoming Exhibitions section:
  - GET /api/events?type=upcoming&limit=1
- Past Exhibitions section:
  - GET /api/events?type=past&sort=eventDateDesc
- Gallery modal for a selected event:
  - Option A: Use images from listing response when includeGallery=true
  - Option B: GET /api/events/{id}?includeGallery=true
