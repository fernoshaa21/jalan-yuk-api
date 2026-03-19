# ⚠️ Deprecated Document

Dokumentasi endpoint yang **resmi dan terbaru** sekarang ada di:

- [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

File ini dipertahankan hanya untuk kompatibilitas lama. Gunakan file di atas sebagai **single source of truth** agar tidak ada dua versi dokumentasi.

---

# Jalan Yuk API - Activities Endpoints Documentation (Legacy)

## 1. GET /activities

**Description:** Get all activities with optional filters, search, and pagination

### Request

```
GET /activities?search=jeep&category=adventure&featured=false&page=1&limit=10
```

### Query Parameters

```json
{
  "search": "jeep", // optional - search by name/description
  "category": "adventure", // optional - filter by category
  "featured": false, // optional - filter by featured status
  "page": 1, // optional - page number (default: 1)
  "limit": 10 // optional - items per page (default: 10, max: 100)
}
```

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Activities retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Jeep Adventure Di Bukit Batu",
      "description": "Jelajahi keindahan alam dengan jeep off-road di kawasan bukit batu yang eksotis",
      "location": "Bogor, Jawa Barat",
      "price": 350000,
      "maxParticipants": 6,
      "currentParticipants": 4,
      "imageUrl": "https://example.com/images/jeep-adventure-1.jpg",
      "category": "adventure",
      "isFeatured": true,
      "isActive": true,
      "rating": 4.8,
      "createdAt": "2026-03-10T08:00:00Z",
      "updatedAt": "2026-03-16T15:30:00Z"
    },
    {
      "id": 2,
      "name": "Jeep Tours Ciater Hot Spring",
      "description": "Nikmati pemandangan alam sambil berkendara jeep menuju sumber air panas alami",
      "location": "Subang, Jawa Barat",
      "price": 400000,
      "maxParticipants": 8,
      "currentParticipants": 6,
      "imageUrl": "https://example.com/images/jeep-hot-spring.jpg",
      "category": "adventure",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.5,
      "createdAt": "2026-03-12T10:00:00Z",
      "updatedAt": "2026-03-15T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## 2. GET /activities?category=adventure

**Description:** Get activities filtered by category

### Request

```
GET /activities?category=adventure
```

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Activities retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Jeep Adventure Di Bukit Batu",
      "description": "Jelajahi keindahan alam dengan jeep off-road di kawasan bukit batu yang eksotis",
      "location": "Bogor, Jawa Barat",
      "price": 350000,
      "maxParticipants": 6,
      "currentParticipants": 4,
      "imageUrl": "https://example.com/images/jeep-adventure-1.jpg",
      "category": "adventure",
      "isFeatured": true,
      "isActive": true,
      "rating": 4.8,
      "createdAt": "2026-03-10T08:00:00Z",
      "updatedAt": "2026-03-16T15:30:00Z"
    },
    {
      "id": 2,
      "name": "Jeep Tours Ciater Hot Spring",
      "description": "Nikmati pemandangan alam sambil berkendara jeep menuju sumber air panas alami",
      "location": "Subang, Jawa Barat",
      "price": 400000,
      "maxParticipants": 8,
      "currentParticipants": 6,
      "imageUrl": "https://example.com/images/jeep-hot-spring.jpg",
      "category": "adventure",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.5,
      "createdAt": "2026-03-12T10:00:00Z",
      "updatedAt": "2026-03-15T12:00:00Z"
    },
    {
      "id": 5,
      "name": "Paragliding Extreme Di Bandung",
      "description": "Terbang tinggi sambil menikmati pemandangan Bandung dari udara",
      "location": "Bandung, Jawa Barat",
      "price": 500000,
      "maxParticipants": 4,
      "currentParticipants": 2,
      "imageUrl": "https://example.com/images/paragliding-bandung.jpg",
      "category": "adventure",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.9,
      "createdAt": "2026-03-14T14:00:00Z",
      "updatedAt": "2026-03-16T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## 3. GET /activities?search=jeep

**Description:** Search activities by name or description

### Request

```
GET /activities?search=jeep
```

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Activities retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Jeep Adventure Di Bukit Batu",
      "description": "Jelajahi keindahan alam dengan jeep off-road di kawasan bukit batu yang eksotis",
      "location": "Bogor, Jawa Barat",
      "price": 350000,
      "maxParticipants": 6,
      "currentParticipants": 4,
      "imageUrl": "https://example.com/images/jeep-adventure-1.jpg",
      "category": "adventure",
      "isFeatured": true,
      "isActive": true,
      "rating": 4.8,
      "createdAt": "2026-03-10T08:00:00Z",
      "updatedAt": "2026-03-16T15:30:00Z"
    },
    {
      "id": 2,
      "name": "Jeep Tours Ciater Hot Spring",
      "description": "Nikmati pemandangan alam sambil berkendara jeep menuju sumber air panas alami",
      "location": "Subang, Jawa Barat",
      "price": 400000,
      "maxParticipants": 8,
      "currentParticipants": 6,
      "imageUrl": "https://example.com/images/jeep-hot-spring.jpg",
      "category": "adventure",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.5,
      "createdAt": "2026-03-12T10:00:00Z",
      "updatedAt": "2026-03-15T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## 4. GET /activities?featured=true

**Description:** Get only featured activities

### Request

```
GET /activities?featured=true
```

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Activities retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Jeep Adventure Di Bukit Batu",
      "description": "Jelajahi keindahan alam dengan jeep off-road di kawasan bukit batu yang eksotis",
      "location": "Bogor, Jawa Barat",
      "price": 350000,
      "maxParticipants": 6,
      "currentParticipants": 4,
      "imageUrl": "https://example.com/images/jeep-adventure-1.jpg",
      "category": "adventure",
      "isFeatured": true,
      "isActive": true,
      "rating": 4.8,
      "createdAt": "2026-03-10T08:00:00Z",
      "updatedAt": "2026-03-16T15:30:00Z"
    },
    {
      "id": 3,
      "name": "Diving Di Pulau Weh",
      "description": "Menyelam bersama instruktur profesional di keindahan terumbu karang Weh",
      "location": "Sabang, Aceh",
      "price": 750000,
      "maxParticipants": 10,
      "currentParticipants": 8,
      "imageUrl": "https://example.com/images/diving-weh.jpg",
      "category": "water-sports",
      "isFeatured": true,
      "isActive": true,
      "rating": 4.9,
      "createdAt": "2026-03-11T09:00:00Z",
      "updatedAt": "2026-03-16T11:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## 5. GET /activities?page=1&limit=10

**Description:** Get activities with pagination

### Request

```
GET /activities?page=2&limit=5
```

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Activities retrieved successfully",
  "data": [
    {
      "id": 6,
      "name": "Hiking Gunung Rinjani",
      "description": "Daki gunung tertinggi Nusa Tenggara dengan pemandu berpengalaman",
      "location": "Lombok, NTB",
      "price": 600000,
      "maxParticipants": 12,
      "currentParticipants": 10,
      "imageUrl": "https://example.com/images/hiking-rinjani.jpg",
      "category": "hiking",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.7,
      "createdAt": "2026-03-13T07:00:00Z",
      "updatedAt": "2026-03-16T08:00:00Z"
    },
    {
      "id": 7,
      "name": "Canoeing Danau Toba",
      "description": "Jelajahi danau terbesar Indonesia dengan kano tradisional",
      "location": "Medan, Sumatera Utara",
      "price": 450000,
      "maxParticipants": 15,
      "currentParticipants": 12,
      "imageUrl": "https://example.com/images/canoeing-toba.jpg",
      "category": "water-sports",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.6,
      "createdAt": "2026-03-14T08:00:00Z",
      "updatedAt": "2026-03-16T09:00:00Z"
    },
    {
      "id": 8,
      "name": "Camping Gunung Semeru",
      "description": "Camping di kaki gunung tertinggi Jawa dengan pemandangan sunrise spektakuler",
      "location": "Malang, Jawa Timur",
      "price": 350000,
      "maxParticipants": 20,
      "currentParticipants": 15,
      "imageUrl": "https://example.com/images/camping-semeru.jpg",
      "category": "camping",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.8,
      "createdAt": "2026-03-15T06:00:00Z",
      "updatedAt": "2026-03-16T07:00:00Z"
    },
    {
      "id": 9,
      "name": "Rafting Sungai Ayung",
      "description": "Bermain arung jeram di sungai dengan pemandangan hutan yang indah",
      "location": "Ubud, Bali",
      "price": 300000,
      "maxParticipants": 8,
      "currentParticipants": 6,
      "imageUrl": "https://example.com/images/rafting-ayung.jpg",
      "category": "water-sports",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.7,
      "createdAt": "2026-03-15T09:00:00Z",
      "updatedAt": "2026-03-16T10:30:00Z"
    },
    {
      "id": 10,
      "name": "Surfing Di Pantai Uluwatu",
      "description": "Belajar selancar dengan instruktur dari pantai terindah di Bali",
      "location": "Denpasar, Bali",
      "price": 400000,
      "maxParticipants": 6,
      "currentParticipants": 4,
      "imageUrl": "https://example.com/images/surfing-uluwatu.jpg",
      "category": "water-sports",
      "isFeatured": false,
      "isActive": true,
      "rating": 4.9,
      "createdAt": "2026-03-16T07:00:00Z",
      "updatedAt": "2026-03-16T14:00:00Z"
    }
  ],
  "meta": {
    "page": 2,
    "limit": 5,
    "total": 10,
    "totalPages": 2,
    "hasNextPage": false,
    "hasPreviousPage": true
  }
}
```

---

## 6. GET /activities/featured

**Description:** Get featured activities (alternative endpoint)

### Request

```
GET /activities/featured
```

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Featured activities retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Jeep Adventure Di Bukit Batu",
      "description": "Jelajahi keindahan alam dengan jeep off-road di kawasan bukit batu yang eksotis",
      "location": "Bogor, Jawa Barat",
      "price": 350000,
      "maxParticipants": 6,
      "currentParticipants": 4,
      "imageUrl": "https://example.com/images/jeep-adventure-1.jpg",
      "category": "adventure",
      "isFeatured": true,
      "isActive": true,
      "rating": 4.8,
      "createdAt": "2026-03-10T08:00:00Z",
      "updatedAt": "2026-03-16T15:30:00Z"
    },
    {
      "id": 3,
      "name": "Diving Di Pulau Weh",
      "description": "Menyelam bersama instruktur profesional di keindahan terumbu karang Weh",
      "location": "Sabang, Aceh",
      "price": 750000,
      "maxParticipants": 10,
      "currentParticipants": 8,
      "imageUrl": "https://example.com/images/diving-weh.jpg",
      "category": "water-sports",
      "isFeatured": true,
      "isActive": true,
      "rating": 4.9,
      "createdAt": "2026-03-11T09:00:00Z",
      "updatedAt": "2026-03-16T11:00:00Z"
    },
    {
      "id": 4,
      "name": "Hot Air Balloon Cappadocia Experience",
      "description": "Naik balon udara panas dan nikmati pemandangan batu-batu unik dari atas",
      "location": "Bandung, Jawa Barat",
      "price": 1200000,
      "maxParticipants": 4,
      "currentParticipants": 3,
      "imageUrl": "https://example.com/images/hot-air-balloon.jpg",
      "category": "adventure",
      "isFeatured": true,
      "isActive": true,
      "rating": 5.0,
      "createdAt": "2026-03-11T10:00:00Z",
      "updatedAt": "2026-03-16T12:00:00Z"
    }
  ]
}
```

---

## 7. GET /activities/:id

**Description:** Get a specific activity by ID

### Request

```
GET /activities/1
```

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Activity retrieved successfully",
  "data": {
    "id": 1,
    "name": "Jeep Adventure Di Bukit Batu",
    "description": "Jelajahi keindahan alam dengan jeep off-road di kawasan bukit batu yang eksotis. Petualangan ini cocok untuk keluarga maupun rombongan teman yang ingin mencoba pengalaman off-road yang mendebarkan.",
    "location": "Bogor, Jawa Barat",
    "price": 350000,
    "maxParticipants": 6,
    "currentParticipants": 4,
    "imageUrl": "https://example.com/images/jeep-adventure-1.jpg",
    "category": "adventure",
    "isFeatured": true,
    "isActive": true,
    "rating": 4.8,
    "createdAt": "2026-03-10T08:00:00Z",
    "updatedAt": "2026-03-16T15:30:00Z"
  }
}
```

### Response (404 Not Found)

```json
{
  "statusCode": 404,
  "message": "Activity with ID 999 not found",
  "error": "Not Found"
}
```

---

## 8. POST /activities

**Description:** Create a new activity (Admin only)

### Request

```
POST /activities
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

{
  "title": "Trekking Bukit Lawang Orangutan",
  "description": "Trekking di hutan hujan tropika untuk melihat orangutan liar di habitat aslinya dengan pemandu ahli",
  "category": "hiking",
  "location": "Bukit Lawang, Sumatera Utara",
  "price": 550000,
  "availableSlots": 8,
  "imageUrl": "https://example.com/images/orangutan-trek.jpg",
  "isFeatured": true,
  "rating": 4.9
}
```

### Response (201 Created)

```json
{
  "statusCode": 201,
  "message": "Activity created successfully",
  "data": {
    "id": 11,
    "name": "Trekking Bukit Lawang Orangutan",
    "description": "Trekking di hutan hujan tropika untuk melihat orangutan liar di habitat aslinya dengan pemandu ahli",
    "location": "Bukit Lawang, Sumatera Utara",
    "price": 550000,
    "maxParticipants": 8,
    "currentParticipants": 0,
    "imageUrl": "https://example.com/images/orangutan-trek.jpg",
    "category": "hiking",
    "isFeatured": true,
    "isActive": true,
    "rating": 4.9,
    "createdAt": "2026-03-17T10:30:00Z",
    "updatedAt": "2026-03-17T10:30:00Z"
  }
}
```

### Response (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "title": "Title is required",
    "price": "Price must be greater than 0",
    "availableSlots": "Available slots must be at least 1"
  }
}
```

### Response (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Unauthorized - Valid JWT token required",
  "error": "Unauthorized"
}
```

---

## Common Response Codes Summary

| Status Code | Description                                 |
| ----------- | ------------------------------------------- |
| 200         | OK - Request successful                     |
| 201         | Created - Resource created successfully     |
| 400         | Bad Request - Invalid input data            |
| 401         | Unauthorized - Missing or invalid JWT token |
| 404         | Not Found - Resource not found              |
| 500         | Internal Server Error - Server error        |

---

## Field Descriptions

| Field               | Type    | Description                                                       |
| ------------------- | ------- | ----------------------------------------------------------------- |
| id                  | number  | Unique activity identifier                                        |
| name                | string  | Activity name                                                     |
| description         | string  | Detailed activity description                                     |
| location            | string  | Activity location/city                                            |
| price               | number  | Price per person (in IDR)                                         |
| maxParticipants     | number  | Maximum participants allowed                                      |
| currentParticipants | number  | Current number of bookings                                        |
| imageUrl            | string  | URL to activity image                                             |
| category            | string  | Activity category (adventure, hiking, water-sports, camping, etc) |
| isFeatured          | boolean | Whether activity is featured on homepage                          |
| isActive            | boolean | Whether activity is currently available                           |
| rating              | number  | Activity rating (0-5)                                             |
| createdAt           | string  | ISO 8601 timestamp when created                                   |
| updatedAt           | string  | ISO 8601 timestamp when last updated                              |

---

## Pagination Meta Fields

| Field           | Type    | Description                     |
| --------------- | ------- | ------------------------------- |
| page            | number  | Current page number             |
| limit           | number  | Items per page                  |
| total           | number  | Total number of items           |
| totalPages      | number  | Total number of pages           |
| hasNextPage     | boolean | Whether there's a next page     |
| hasPreviousPage | boolean | Whether there's a previous page |
