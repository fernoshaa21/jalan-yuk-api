# Admin Activities Endpoints Documentation

Dokumentasi endpoint admin untuk basic CRUD activity pada aplikasi booking activity.

## Base URL

```http
http://localhost:3000
```

## Authorization & Role

Semua endpoint di bawah ini membutuhkan:

- `Authorization: Bearer <access_token>`
- Guard: `JwtAuthGuard`
- Guard: `RolesGuard`
- Role: `admin`

### Contoh Header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ADMIN_EXAMPLE_TOKEN
Content-Type: application/json
```

### Contoh user dari JWT payload

```json
{
  "sub": 1,
  "email": "admin@jalanyuk.com",
  "role": "admin"
}
```

---

## 1) POST /admin/activities

Create activity baru (admin only).

### Request

```http
POST /admin/activities
```

```json
{
  "title": "Sunrise Jeep Tour Bromo",
  "description": "Nikmati perjalanan jeep menuju spot sunrise terbaik di Bromo bersama guide lokal berpengalaman.",
  "category": "adventure",
  "location": "Bromo, East Java",
  "price": 350000,
  "availableSlots": 20,
  "imageUrl": "https://cdn.jalanyuk.com/activities/bromo-jeep.jpg",
  "isFeatured": true,
  "rating": 4.8,
  "isActive": true
}
```

### Success Response (201)

```json
{
  "id": 12,
  "title": "Sunrise Jeep Tour Bromo",
  "description": "Nikmati perjalanan jeep menuju spot sunrise terbaik di Bromo bersama guide lokal berpengalaman.",
  "category": "adventure",
  "location": "Bromo, East Java",
  "price": 350000,
  "availableSlots": 20,
  "imageUrl": "https://cdn.jalanyuk.com/activities/bromo-jeep.jpg",
  "isFeatured": true,
  "rating": 4.8,
  "isActive": true,
  "createdAt": "2026-03-18T10:20:45.220Z",
  "updatedAt": "2026-03-18T10:20:45.220Z"
}
```

### Error Response (403 - Bukan admin)

```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this resource",
  "error": "Forbidden"
}
```

---

## 2) PATCH /admin/activities/:id

Update activity berdasarkan ID (partial update, admin only).

### Request

```http
PATCH /admin/activities/12
```

```json
{
  "price": 375000,
  "availableSlots": 24,
  "isFeatured": false
}
```

### Success Response (200)

```json
{
  "id": 12,
  "title": "Sunrise Jeep Tour Bromo",
  "description": "Nikmati perjalanan jeep menuju spot sunrise terbaik di Bromo bersama guide lokal berpengalaman.",
  "category": "adventure",
  "location": "Bromo, East Java",
  "price": 375000,
  "availableSlots": 24,
  "imageUrl": "https://cdn.jalanyuk.com/activities/bromo-jeep.jpg",
  "isFeatured": false,
  "rating": 4.8,
  "isActive": true,
  "createdAt": "2026-03-18T10:20:45.220Z",
  "updatedAt": "2026-03-18T10:35:11.903Z"
}
```

### Error Response (404 - Activity tidak ditemukan)

```json
{
  "statusCode": 404,
  "message": "Activity with ID 12 not found",
  "error": "Not Found"
}
```

---

## 3) DELETE /admin/activities/:id

Soft delete activity (admin only).

> Implementasi delete saat ini adalah soft delete dengan set `isActive = false`.

### Request

```http
DELETE /admin/activities/12
```

Body: tidak perlu.

### Success Response (200)

```json
{
  "message": "Activity deleted successfully",
  "id": 12,
  "isActive": false
}
```

### Error Response (404 - Activity tidak ditemukan)

```json
{
  "statusCode": 404,
  "message": "Activity with ID 12 not found",
  "error": "Not Found"
}
```

---

## Ringkasan Role Protection

Endpoint berikut hanya dapat diakses admin:

- `POST /admin/activities`
- `PATCH /admin/activities/:id`
- `DELETE /admin/activities/:id`

Proteksi endpoint menggunakan:

- `@UseGuards(JwtAuthGuard, RolesGuard)`
- `@Roles('admin')`
