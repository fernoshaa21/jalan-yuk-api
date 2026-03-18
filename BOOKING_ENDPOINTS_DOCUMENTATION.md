# Booking Endpoints Documentation

Dokumentasi ini menjelaskan endpoint booking activity untuk aplikasi tour booking.

## Base URL

```http
http://localhost:3000
```

## Authentication

Semua endpoint booking menggunakan JWT Bearer Token.

Header yang wajib dikirim:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 1) POST /bookings

Membuat booking baru untuk user yang sedang login.

### Request

```http
POST /bookings
```

```json
{
  "activityId": 12,
  "bookingDate": "2026-04-05",
  "qty": 3
}
```

### Validation Rules

- `activityId`: wajib, number
- `bookingDate`: wajib, format tanggal (ISO date string)
- `qty`: wajib, number, minimal `1`

### Success Response (201)

```json
{
  "id": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
  "activity": {
    "id": 12,
    "title": "Sunrise Jeep Tour Bromo",
    "imageUrl": "https://cdn.jalanyuk.com/activities/bromo-jeep.jpg",
    "location": "Bromo, East Java"
  },
  "bookingDate": "2026-04-05",
  "qty": 3,
  "unitPrice": 350000,
  "totalPrice": 1050000,
  "status": "pending",
  "createdAt": "2026-03-18T08:45:12.120Z"
}
```

### Error Responses

**400 Bad Request** (contoh: qty < 1 / slot tidak cukup / activity non-aktif)

```json
{
  "statusCode": 400,
  "message": "Insufficient available slots",
  "error": "Bad Request"
}
```

**404 Not Found** (activity/user tidak ditemukan)

```json
{
  "statusCode": 404,
  "message": "Activity not found",
  "error": "Not Found"
}
```

---

## 2) GET /bookings/my

Mengambil semua booking milik user login.

### Request

```http
GET /bookings/my
```

### Success Response (200)

Data diurutkan `createdAt DESC`.

```json
[
  {
    "id": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
    "bookingDate": "2026-04-05",
    "qty": 3,
    "unitPrice": 350000,
    "totalPrice": 1050000,
    "status": "pending",
    "createdAt": "2026-03-18T08:45:12.120Z",
    "updatedAt": "2026-03-18T08:45:12.120Z",
    "activity": {
      "id": 12,
      "name": "Sunrise Jeep Tour Bromo",
      "location": "Bromo, East Java",
      "imageUrl": "https://cdn.jalanyuk.com/activities/bromo-jeep.jpg",
      "price": 350000
    }
  },
  {
    "id": "4ac9b8f5-811f-4e8c-9f3f-7d1f8b2e3c44",
    "bookingDate": "2026-03-28",
    "qty": 2,
    "unitPrice": 225000,
    "totalPrice": 450000,
    "status": "confirmed",
    "createdAt": "2026-03-10T10:15:40.000Z",
    "updatedAt": "2026-03-11T09:22:10.000Z",
    "activity": {
      "id": 7,
      "name": "Island Hopping Nusa Penida",
      "location": "Bali",
      "imageUrl": "https://cdn.jalanyuk.com/activities/nusa-penida.jpg",
      "price": 225000
    }
  }
]
```

### Error Responses

**403 Forbidden** (token invalid / user context invalid)

```json
{
  "statusCode": 403,
  "message": "Invalid authenticated user context",
  "error": "Forbidden"
}
```

---

## 3) GET /bookings/:id

Mengambil detail booking by ID, khusus milik user login.

### Request

```http
GET /bookings/8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d
```

### Success Response (200)

```json
{
  "id": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
  "bookingDate": "2026-04-05",
  "qty": 3,
  "unitPrice": 350000,
  "totalPrice": 1050000,
  "status": "pending",
  "createdAt": "2026-03-18T08:45:12.120Z",
  "updatedAt": "2026-03-18T08:45:12.120Z",
  "activity": {
    "id": 12,
    "name": "Sunrise Jeep Tour Bromo",
    "location": "Bromo, East Java",
    "imageUrl": "https://cdn.jalanyuk.com/activities/bromo-jeep.jpg",
    "price": 350000
  }
}
```

### Error Responses

**404 Not Found** (booking tidak ditemukan / bukan milik user)

```json
{
  "statusCode": 404,
  "message": "Booking not found",
  "error": "Not Found"
}
```

---

## 4) PATCH /bookings/:id/cancel

Membatalkan booking milik user login.

### Request

```http
PATCH /bookings/8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d/cancel
```

Body: tidak perlu body.

### Success Response (200)

```json
{
  "id": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
  "bookingDate": "2026-04-05",
  "qty": 3,
  "unitPrice": 350000,
  "totalPrice": 1050000,
  "status": "cancelled",
  "createdAt": "2026-03-18T08:45:12.120Z",
  "updatedAt": "2026-03-18T09:02:55.450Z",
  "activity": {
    "id": 12,
    "name": "Sunrise Jeep Tour Bromo",
    "location": "Bromo, East Java",
    "imageUrl": "https://cdn.jalanyuk.com/activities/bromo-jeep.jpg",
    "price": 350000
  }
}
```

### Error Responses

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Booking not found",
  "error": "Not Found"
}
```

---

## Ringkasan Business Rules

- Booking hanya bisa dibuat jika activity ada dan `isActive = true`
- `qty` minimal `1`
- Slot harus cukup: `availableSlots >= qty`
- `unitPrice` diambil dari harga activity
- `totalPrice` dihitung otomatis: `unitPrice * qty`
- Booking baru otomatis berstatus `pending`
- User hanya bisa akses booking miliknya sendiri
- Cancel booking mengubah status menjadi `cancelled`
