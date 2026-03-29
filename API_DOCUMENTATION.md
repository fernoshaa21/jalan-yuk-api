# Jalan Yuk API Documentation

API ini dibuat untuk aplikasi booking activity/tour berbasis NestJS + TypeORM + PostgreSQL.

## Base URL

`http://localhost:3000`

## Response Standard

Semua endpoint memakai format:

```json
{
  "data": {},
  "message": "...",
  "meta": {}
}
```

- `data`: payload utama
- `message`: pesan ringkas
- `meta`: informasi tambahan (pagination/total), `null` bila tidak ada

## Authorization (JWT)

Endpoint yang butuh auth harus mengirim header:

```http
Authorization: Bearer <accessToken>
```

Contoh:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 1) Auth Module

### 1.1 Register

- **Method**: `POST`
- **URL**: `/auth/register`
- **Auth**: Tidak
- **Deskripsi**: Daftar user baru dan langsung mendapatkan token.

#### Request Body

```json
{
  "email": "user@mail.com",
  "password": "secret123",
  "fullName": "Budi Santoso",
  "phoneNumber": "+628123456789"
}
```

#### Response 201

```json
{
  "data": {
    "accessToken": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "user@mail.com",
      "fullName": "Budi Santoso",
      "phoneNumber": "+628123456789",
      "role": "user"
    }
  },
  "message": "User registered successfully",
  "meta": null
}
```

---

### 1.2 Login

- **Method**: `POST`
- **URL**: `/auth/login`
- **Auth**: Tidak
- **Deskripsi**: Login user dan dapatkan token JWT.

#### Request Body

```json
{
  "email": "user@mail.com",
  "password": "secret123"
}
```

#### Response 200

```json
{
  "data": {
    "accessToken": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "user@mail.com",
      "fullName": "Budi Santoso",
      "phoneNumber": "+628123456789",
      "role": "user"
    }
  },
  "message": "Login successful",
  "meta": null
}
```

---

### 1.3 Profile

- **Method**: `GET`
- **URL**: `/auth/profile`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: Ambil profil user yang sedang login.

#### Response 200

```json
{
  "data": {
    "id": 1,
    "email": "user@mail.com",
    "fullName": "Budi Santoso",
    "phoneNumber": "+628123456789",
    "avatarUrl": null,
    "isActive": true,
    "role": "user"
  },
  "message": "Profile retrieved successfully",
  "meta": null
}
```

---

### 1.4 Logout

- **Method**: `POST`
- **URL**: `/auth/logout`
- **Auth**: Tidak (opsional dipanggil dari client)
- **Deskripsi**: Logout stateless (hapus token di client).

#### Response 200

```json
{
  "data": null,
  "message": "Logout successful",
  "meta": null
}
```

---

## 2) Activities Module

### 2.0 Supported Categories (Activity)

Gunakan nilai kategori berikut agar konsisten dengan data seed dan filter backend:

- `adventure`
- `nature`
- `culture`
- `culinary`
- `city-tour`
- `water-sport`
- `family`

> Catatan untuk Flutter: jika memakai enum/parser ketat, pastikan semua nilai di atas sudah didaftarkan.

### 2.1 List Activities (Home)

- **Method**: `GET`
- **URL**: `/activities`
- **Auth**: Tidak
- **Deskripsi**: Ambil daftar activity + pagination + filter.

#### Query Params

- `search` (optional, string)
- `category` (optional, string, one of: `adventure|nature|culture|culinary|city-tour|water-sport|family`)
- `featured` (optional, boolean: `true/false`)
- `page` (optional, number, default `1`)
- `limit` (optional, number, default `10`, max `100`)

Contoh URL:

`/activities?search=jeep&category=adventure&featured=true&page=1&limit=10`

#### Response 200

```json
{
  "data": [
    {
      "id": 1,
      "title": "Jeep Adventure Bromo",
      "description": "Tour jeep sunrise Bromo.",
      "location": "Bromo, Jawa Timur",
      "price": 350000,
      "availableSlots": 6,
      "currentParticipants": 2,
      "imageUrl": "https://cdn.example.com/bromo.jpg",
      "isFeatured": true,
      "isActive": true,
      "category": "adventure",
      "rating": 4.8,
      "createdAt": "2026-03-10T08:00:00.000Z",
      "updatedAt": "2026-03-15T10:30:00.000Z"
    }
  ],
  "message": "Activities retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false
  }
}
```

---

### 2.2 Featured Activities

- **Method**: `GET`
- **URL**: `/activities/featured`
- **Auth**: Tidak
- **Deskripsi**: Ambil activity unggulan (sudah support pagination untuk infinite scroll).

#### Query Params

- `search` (optional, string)
- `category` (optional, string, one of: `adventure|nature|culture|culinary|city-tour|water-sport|family`)
- `page` (optional, number, default `1`)
- `limit` (optional, number, default `10`, max `100`)

Contoh URL:

`/activities/featured?page=1&limit=10`

`/activities/featured?category=adventure&search=jeep&page=1&limit=10`

#### Response 200

```json
{
  "data": [
    {
      "id": 1,
      "title": "Jeep Adventure Bromo",
      "description": "Tour jeep sunrise Bromo.",
      "location": "Bromo, Jawa Timur",
      "price": 350000,
      "availableSlots": 6,
      "currentParticipants": 2,
      "imageUrl": "https://cdn.example.com/bromo.jpg",
      "isFeatured": true,
      "isActive": true,
      "category": "adventure",
      "rating": 4.8,
      "createdAt": "2026-03-10T08:00:00.000Z",
      "updatedAt": "2026-03-15T10:30:00.000Z"
    }
  ],
  "message": "Featured activities retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false
  }
}
```

---

### 2.3 Activity Detail

- **Method**: `GET`
- **URL**: `/activities/:id`
- **Auth**: Tidak
- **Deskripsi**: Ambil detail activity untuk halaman detail + booking form.

#### Response 200

```json
{
  "data": {
    "id": 1,
    "title": "Jeep Adventure Bromo",
    "description": "Tour jeep sunrise Bromo.",
    "price": 350000,
    "location": "Bromo, Jawa Timur",
    "availableSlots": 4,
    "imageUrl": "https://cdn.example.com/bromo.jpg",
    "isFeatured": true,
    "category": "adventure",
    "rating": 4.8,
    "availableDates": ["2026-03-19", "2026-03-20", "2026-03-21"],
    "currentParticipants": 2,
    "maxParticipants": 6
  },
  "message": "Activity retrieved successfully",
  "meta": null
}
```

---

## 3) Booking Module

### 3.1 Create Booking

- **Method**: `POST`
- **URL**: `/bookings`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: Buat booking, total harga dihitung otomatis.

#### Request Body

```json
{
  "activityId": 1,
  "bookingDate": "2026-03-25",
  "qty": 2
}
```

#### Response 201/200

```json
{
  "data": {
    "id": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
    "activity": {
      "id": 1,
      "title": "Jeep Adventure Bromo",
      "imageUrl": "https://cdn.example.com/bromo.jpg",
      "location": "Bromo, Jawa Timur"
    },
    "bookingDate": "2026-03-25T00:00:00.000Z",
    "qty": 2,
    "unitPrice": 350000,
    "totalPrice": 700000,
    "status": "pending",
    "createdAt": "2026-03-19T10:10:10.000Z"
  },
  "message": "Booking created successfully",
  "meta": null
}
```

---

## 4) Payment Module (Mock)

### 4.1 Create Payment

- **Method**: `POST`
- **URL**: `/payments`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: Buat payment record status `pending` untuk booking milik user.

#### Request Body

```json
{
  "bookingId": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
  "method": "bank_transfer"
}
```

#### Response 201/200

```json
{
  "data": {
    "bookingId": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
    "paymentId": "199a9084-df32-4dd4-b98c-f8fb69cc8f75",
    "method": "bank_transfer",
    "paymentStatus": "pending",
    "amount": 700000,
    "paidAt": null
  },
  "message": "Payment record created successfully",
  "meta": null
}
```

---

### 4.2 Pay Booking (Mock Mark as Paid)

- **Method**: `POST`
- **URL**: `/payments/:bookingId/pay`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: Simulasi pembayaran sukses (`paymentStatus=paid`, `bookingStatus=confirmed`).

#### Request Body

```json
{
  "method": "gopay"
}
```

#### Response 200

```json
{
  "data": {
    "bookingId": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
    "paymentId": "199a9084-df32-4dd4-b98c-f8fb69cc8f75",
    "method": "gopay",
    "paymentStatus": "paid",
    "amount": 700000,
    "paidAt": "2026-03-19T11:00:00.000Z"
  },
  "message": "Payment completed successfully",
  "meta": null
}
```

---

### 4.3 Cancel Payment

- **Method**: `PATCH`
- **URL**: `/payments/:bookingId/cancel`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: Batalkan payment + booking milik user.

#### Response 200

```json
{
  "data": {
    "bookingId": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
    "paymentId": "199a9084-df32-4dd4-b98c-f8fb69cc8f75",
    "method": "bank_transfer",
    "paymentStatus": "cancelled",
    "amount": 700000,
    "paidAt": null
  },
  "message": "Payment cancelled successfully",
  "meta": null
}
```

---

### 4.4 Get Payment by Booking

- **Method**: `GET`
- **URL**: `/payments/:bookingId`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: Lihat status pembayaran untuk booking milik user.

#### Response 200

```json
{
  "data": {
    "id": "199a9084-df32-4dd4-b98c-f8fb69cc8f75",
    "bookingId": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
    "method": "bank_transfer",
    "paymentStatus": "pending",
    "paidAt": null,
    "externalRef": null,
    "createdAt": "2026-03-19T10:10:30.000Z",
    "updatedAt": "2026-03-19T10:10:30.000Z"
  },
  "message": "Payment retrieved successfully",
  "meta": null
}
```

---

## 5) My Booking Module

### 5.1 List My Bookings

- **Method**: `GET`
- **URL**: `/bookings/my`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: List booking user login + filter status.

#### Query Params

- `page` (optional, default `1`)
- `limit` (optional, default `10`)
- `status` (optional: `pending|confirmed|cancelled`)
- `paymentStatus` (optional: `pending|paid|cancelled`)

Contoh URL:

`/bookings/my?page=1&limit=10&status=pending`

#### Response 200

```json
{
  "data": [
    {
      "id": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
      "activity": {
        "id": 1,
        "title": "Jeep Adventure Bromo",
        "imageUrl": "https://cdn.example.com/bromo.jpg",
        "location": "Bromo, Jawa Timur"
      },
      "bookingDate": "2026-03-25T00:00:00.000Z",
      "qty": 2,
      "totalPrice": 700000,
      "bookingStatus": "pending",
      "paymentStatus": "pending",
      "createdAt": "2026-03-19T10:10:10.000Z"
    }
  ],
  "message": "My bookings retrieved successfully",
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 5.2 Booking Detail

- **Method**: `GET`
- **URL**: `/bookings/:id`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: Detail booking milik user.

#### Response 200

```json
{
  "data": {
    "id": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
    "activity": {
      "id": 1,
      "title": "Jeep Adventure Bromo",
      "imageUrl": "https://cdn.example.com/bromo.jpg",
      "location": "Bromo, Jawa Timur",
      "price": 350000
    },
    "bookingDate": "2026-03-25T00:00:00.000Z",
    "qty": 2,
    "unitPrice": 350000,
    "totalPrice": 700000,
    "bookingStatus": "pending",
    "payment": {
      "id": "199a9084-df32-4dd4-b98c-f8fb69cc8f75",
      "method": "bank_transfer",
      "paymentStatus": "pending",
      "paidAt": null
    },
    "createdAt": "2026-03-19T10:10:10.000Z"
  },
  "message": "Booking detail retrieved successfully",
  "meta": null
}
```

---

### 5.3 Cancel Booking

- **Method**: `PATCH`
- **URL**: `/bookings/:id/cancel`
- **Auth**: Ya (Bearer token)
- **Deskripsi**: Batalkan booking milik user (jika belum paid/confirmed).

#### Response 200

```json
{
  "data": {
    "bookingId": "7fc3f5f8-2281-43ee-a936-478e0f15e8f5",
    "bookingStatus": "cancelled",
    "paymentStatus": "cancelled"
  },
  "message": "Booking cancelled successfully",
  "meta": null
}
```

---

## 6) Admin Activities Module

Semua endpoint admin butuh:

- JWT valid
- role `admin`

### 6.1 List Activities

- **Method**: `GET`
- **URL**: `/admin/activities`
- **Auth**: Ya (Bearer token, admin)
- **Deskripsi**: Ambil daftar activity untuk admin panel dengan pagination dan filter.

#### Query Params

- `search` (optional, string, cari berdasarkan title atau location)
- `category` (optional, string)
- `isActive` (optional, boolean: `true/false`)
- `isFeatured` (optional, boolean: `true/false`)
- `page` (optional, number, default `1`)
- `limit` (optional, number, default `10`, max `100`)

Contoh URL:

`/admin/activities?page=1&limit=10`

`/admin/activities?search=bogor&category=adventure&isActive=true&isFeatured=false&page=1&limit=10`

#### Response 200

```json
{
  "data": [
    {
      "id": 10,
      "title": "Rafting Cisadane",
      "category": "adventure",
      "location": "Bogor",
      "price": 275000,
      "isActive": true
    }
  ],
  "message": "Admin activities retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true
  }
}
```

---

### 6.2 Activity Detail

- **Method**: `GET`
- **URL**: `/admin/activities/:id`
- **Auth**: Ya (Bearer token, admin)
- **Deskripsi**: Ambil detail activity untuk admin berdasarkan ID.

#### Response 200

```json
{
  "data": {
    "id": 10,
    "title": "Rafting Cisadane",
    "description": "Paket rafting seru",
    "price": 275000
  },
  "message": "Admin activity detail retrieved successfully",
  "meta": null
}
```

#### Response 404

```json
{
  "statusCode": 404,
  "message": "Activity not found",
  "error": "Not Found"
}
```

---

### 6.3 Create Activity

- **Method**: `POST`
- **URL**: `/admin/activities`
- **Auth**: Ya (Bearer token, admin)

Nilai `category` yang direkomendasikan: `adventure`, `nature`, `culture`, `culinary`, `city-tour`, `water-sport`, `family`.

#### Request Body

```json
{
  "title": "Rafting Cisadane",
  "description": "Paket rafting seru untuk pemula dan profesional",
  "category": "adventure",
  "location": "Bogor",
  "price": 275000,
  "availableSlots": 20,
  "imageUrl": "https://cdn.example.com/rafting.jpg",
  "isFeatured": false,
  "rating": 4.6,
  "isActive": true
}
```

#### Response 201/200

```json
{
  "data": {
    "id": 10,
    "title": "Rafting Cisadane",
    "description": "Paket rafting seru untuk pemula dan profesional",
    "category": "adventure",
    "location": "Bogor",
    "price": 275000,
    "availableSlots": 20,
    "imageUrl": "https://cdn.example.com/rafting.jpg",
    "isFeatured": false,
    "rating": 4.6,
    "isActive": true,
    "createdAt": "2026-03-19T11:20:00.000Z",
    "updatedAt": "2026-03-19T11:20:00.000Z"
  },
  "message": "Activity created successfully",
  "meta": null
}
```

---

### 6.4 Update Activity

- **Method**: `PATCH`
- **URL**: `/admin/activities/:id`
- **Auth**: Ya (Bearer token, admin)

#### Request Body (partial)

```json
{
  "price": 300000,
  "availableSlots": 24,
  "isFeatured": true
}
```

#### Response 200

```json
{
  "data": {
    "id": 10,
    "title": "Rafting Cisadane",
    "description": "Paket rafting seru untuk pemula dan profesional",
    "category": "adventure",
    "location": "Bogor",
    "price": 300000,
    "availableSlots": 24,
    "imageUrl": "https://cdn.example.com/rafting.jpg",
    "isFeatured": true,
    "rating": 4.6,
    "isActive": true,
    "createdAt": "2026-03-19T11:20:00.000Z",
    "updatedAt": "2026-03-19T11:30:00.000Z"
  },
  "message": "Activity updated successfully",
  "meta": null
}
```

---

### 6.5 Delete Activity (Soft Delete)

- **Method**: `DELETE`
- **URL**: `/admin/activities/:id`
- **Auth**: Ya (Bearer token, admin)
- **Deskripsi**: Tidak hapus fisik. `isActive` di-set `false`.

#### Response 200

```json
{
  "data": {
    "id": 10,
    "isActive": false
  },
  "message": "Activity deleted successfully",
  "meta": null
}
```

---

## 7) Admin Bookings Module

Semua endpoint admin butuh:

- JWT valid
- role `admin`

### 7.1 List Bookings

- **Method**: `GET`
- **URL**: `/admin/bookings`
- **Auth**: Ya (Bearer token, admin)
- **Deskripsi**: Ambil daftar booking untuk admin panel dengan pagination, search, dan filter status.

#### Query Params

- `search` (optional, string, cari berdasarkan nama user atau title activity)
- `bookingStatus` (optional, one of: `pending|confirmed|cancelled`)
- `paymentStatus` (optional, one of: `pending|paid|cancelled`)
- `page` (optional, number, default `1`)
- `limit` (optional, number, default `10`, max `100`)

Contoh URL:

`/admin/bookings?page=1&limit=10`

`/admin/bookings?search=john&bookingStatus=pending&paymentStatus=pending&page=1&limit=10`

#### Response 200

```json
{
  "data": [
    {
      "id": "0f6a8e56-4f0a-4f4c-8d7e-1b3e0e6a1234",
      "user": {
        "fullName": "John Doe"
      },
      "activity": {
        "title": "Jeep Adventure"
      },
      "bookingStatus": "pending",
      "paymentStatus": "pending",
      "bookingDate": "2026-03-25T00:00:00.000Z",
      "totalPrice": 700000,
      "createdAt": "2026-03-25T08:15:00.000Z"
    }
  ],
  "message": "Admin bookings retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true
  }
}
```

#### Notes

- Data diurutkan berdasarkan `booking.createdAt DESC`.
- Endpoint melakukan join ke relasi `user`, `activity`, dan `payment`.
- Jika payment belum ada, `paymentStatus` dipetakan ke `pending` agar konsisten dengan flow booking baru di sistem.

---

### 7.2 Booking Detail

- **Method**: `GET`
- **URL**: `/admin/bookings/:id`
- **Auth**: Ya (Bearer token, admin)
- **Deskripsi**: Ambil detail booking untuk admin berdasarkan ID booking.

#### Response 200

```json
{
  "data": {
    "id": "0f6a8e56-4f0a-4f4c-8d7e-1b3e0e6a1234",
    "bookingStatus": "pending",
    "paymentStatus": "pending"
  },
  "message": "Admin booking detail retrieved successfully",
  "meta": null
}
```

#### Response 404

```json
{
  "statusCode": 404,
  "message": "Booking not found",
  "error": "Not Found"
}
```

#### Notes

- Endpoint mengambil booking berdasarkan `id` dan join ke relasi `payment`.
- Relasi `user` dan `activity` juga di-join agar siap dipakai jika nanti detail admin diperluas.
- Jika payment belum ada, `paymentStatus` dipetakan ke `pending` agar konsisten dengan flow booking baru di sistem.

---

## 8) Admin Users Module

Semua endpoint admin butuh:

- JWT valid
- role `admin`

### 8.1 List Users

- **Method**: `GET`
- **URL**: `/admin/users`
- **Auth**: Ya (Bearer token, admin)
- **Deskripsi**: Ambil daftar user untuk admin panel dengan pagination, search, dan filter sederhana.

#### Query Params

- `search` (optional, string, cari berdasarkan `fullName` atau `email`)
- `role` (optional, string, contoh: `admin|user`)
- `isActive` (optional, boolean: `true/false`)
- `page` (optional, number, default `1`)
- `limit` (optional, number, default `10`, max `100`)

Contoh URL:

`/admin/users?page=1&limit=10`

`/admin/users?search=john&page=1&limit=10`

`/admin/users?role=user&isActive=true&page=1&limit=10`

#### Response 200

```json
{
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-03-19T11:20:00.000Z"
    }
  ],
  "message": "Admin users retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 340,
    "totalPages": 34,
    "hasNext": true
  }
}
```

#### Notes

- Data diurutkan berdasarkan `user.createdAt DESC`.
- Search dilakukan dengan `ILIKE` ke field `fullName` dan `email`.
- Filter `role` dibuat case-insensitive agar query seperti `user` dan `USER` tetap konsisten.
- Endpoint hanya me-return field aman: `id`, `fullName`, `email`, `role`, `isActive`, `createdAt`.
- Field sensitif seperti `password` tidak ikut dikembalikan.

---

## 9) Admin Dashboard Module

Semua endpoint admin butuh:

- JWT valid
- role `admin`

### 9.1 Dashboard Stats

- **Method**: `GET`
- **URL**: `/admin/dashboard/stats`
- **Auth**: Ya (Bearer token, admin)
- **Deskripsi**: Ambil ringkasan statistik utama untuk dashboard admin.

#### Response 200

```json
{
  "data": {
    "totalActivities": 128,
    "totalBookings": 540,
    "totalUsers": 1235,
    "totalRevenue": 45780000,
    "pendingBookings": 32,
    "confirmedBookings": 480,
    "cancelledBookings": 28
  },
  "message": "Dashboard stats retrieved successfully",
  "meta": null
}
```

---

### 9.2 Recent Bookings

- **Method**: `GET`
- **URL**: `/admin/dashboard/recent-bookings`
- **Auth**: Ya (Bearer token, admin)
- **Deskripsi**: Ambil daftar booking terbaru untuk kebutuhan dashboard admin, diurutkan berdasarkan `createdAt DESC`.

#### Query Params

- `limit` (optional, number, default `5`, max `100`)

Contoh URL:

`/admin/dashboard/recent-bookings`

`/admin/dashboard/recent-bookings?limit=10`

#### Response 200

```json
{
  "data": [
    {
      "id": "0f6a8e56-4f0a-4f4c-8d7e-1b3e0e6a1234",
      "user": {
        "id": 1,
        "fullName": "John Doe"
      },
      "activity": {
        "id": 10,
        "title": "Jeep Adventure Bromo"
      },
      "bookingDate": "2026-03-25T00:00:00.000Z",
      "bookingStatus": "pending",
      "paymentStatus": "pending",
      "totalPrice": 700000
    }
  ],
  "message": "Recent bookings retrieved successfully",
  "meta": null
}
```

#### Notes

- Data diambil dari booking real terbaru.
- Query memakai relasi ke `user`, `activity`, dan `payment` jika tersedia.
- Jika payment belum terbentuk, `paymentStatus` akan bernilai `pending`.

---

## 10) Admin Uploads Module

Semua endpoint admin butuh:

- JWT valid
- role `admin`

### 10.1 Upload Activity Image

- **Method**: `POST`
- **URL**: `/admin/uploads/activity-image`
- **Auth**: Ya (Bearer token, admin)
- **Content-Type**: `multipart/form-data`
- **Field file**: `file`
- **Deskripsi**: Upload image activity ke AWS S3 dan kembalikan URL public file.

#### Validasi File

- format: `image/jpeg`, `image/png`, `image/webp`
- max size: `5MB`

#### Response 200

```json
{
  "data": {
    "url": "https://jalanyuk-assets.s3.ap-southeast-1.amazonaws.com/activities/activity-1711729000-550e8400-e29b-41d4-a716-446655440000.jpg"
  },
  "message": "Image uploaded successfully",
  "meta": null
}
```

#### Notes

- File disimpan ke key dengan format `activities/activity-<timestamp>-<uuid>.<ext>`.
- Nama file dibuat unik agar tidak bentrok.
- URL public dibentuk dari `AWS_REGION` dan `AWS_S3_BUCKET`.

---

## Error Response Examples

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["qty must not be less than 1"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Booking not found",
  "error": "Not Found"
}
```

---

## Mobile Integration Flow (Flutter) - Step by Step

### Step 1 — Register atau Login

1. Panggil `POST /auth/register` (sekali saat user baru) atau `POST /auth/login`.
2. Simpan `accessToken` ke secure storage (misalnya `flutter_secure_storage`).
3. Simpan profil ringkas (`id`, `fullName`, `role`) di state app.

### Step 2 — Get Activities (Home)

1. Panggil `GET /activities?page=1&limit=10`.
2. Untuk filter kategori/search, tambahkan query params (`category`, `search`, `featured`).
3. Untuk infinite scroll, pakai `meta.hasNext` untuk menentukan fetch halaman berikutnya (`page + 1`).
4. Untuk section featured, gunakan `GET /activities/featured?page=1&limit=10` dengan pola infinite scroll yang sama.
5. Tampilkan card list memakai `data[]`.

### Step 3 — Open Activity Detail

1. Saat item di-tap, panggil `GET /activities/{id}`.
2. Ambil `availableDates`, `availableSlots`, dan `price` untuk form booking.

### Step 4 — Create Booking

1. User pilih tanggal + jumlah tiket.
2. Panggil `POST /bookings` dengan Bearer token.
3. Ambil `bookingId` dari response untuk langkah payment.

### Step 5 — Create Payment

1. Panggil `POST /payments` dengan `bookingId` + `method`.
2. Untuk simulasi bayar sukses, panggil `POST /payments/{bookingId}/pay`.
3. Tampilkan status dari `paymentStatus`.

### Step 6 — Lihat My Bookings

1. Panggil `GET /bookings/my?page=1&limit=10`.
2. Untuk filter status, gunakan `status` atau `paymentStatus`.
3. Untuk detail item, panggil `GET /bookings/{bookingId}`.

### Step 7 — Cancel Booking (Opsional)

1. Panggil `PATCH /bookings/{bookingId}/cancel`.
2. Refresh list my bookings.
3. Tampilkan status terbaru booking/payment.

---

## Notes for Recruiter / Portfolio

- API sudah menerapkan JWT auth dan role-based access untuk admin endpoint.
- Struktur response disederhanakan agar nyaman untuk konsumsi Flutter (`data`, `message`, `meta`).
- Payment saat ini masih **mock/manual** (belum terintegrasi payment gateway).
