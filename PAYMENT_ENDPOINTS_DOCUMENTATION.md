# Payment Endpoints Documentation (Mock Flow)

Dokumentasi endpoint payment untuk aplikasi booking activity.

## Base URL

```http
http://localhost:3000
```

## Catatan

- Payment ini **mock flow** untuk portfolio app.
- Bukan integrasi payment gateway asli.
- Status sinkron dengan booking:
  - booking dibuat -> `booking.status = pending`
  - payment dibuat -> `paymentStatus = pending`
  - payment sukses -> `paymentStatus = paid`, `booking.status = confirmed`
  - payment dibatalkan -> `paymentStatus = cancelled`, `booking.status = cancelled`

---

## 1) POST /payments

Membuat payment record untuk booking.

### Request

```http
POST /payments
Content-Type: application/json
```

```json
{
  "bookingId": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
  "method": "gopay"
}
```

### Validasi

- `bookingId`: wajib UUID
- `method`: wajib salah satu dari:
  - `bank_transfer`
  - `gopay`
  - `ovo`
  - `cash`

### Success Response (201)

```json
{
  "bookingId": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
  "paymentId": "2a4d0c4d-7869-460f-beb2-6ba84f6f6f1d",
  "method": "gopay",
  "paymentStatus": "pending",
  "amount": 1050000,
  "paidAt": null,
  "message": "Payment record created successfully"
}
```

### Error Response (contoh)

```json
{
  "statusCode": 400,
  "message": "Booking already has an active payment",
  "error": "Bad Request"
}
```

---

## 2) POST /payments/:bookingId/pay

Mock proses bayar booking.

### Request

```http
POST /payments/8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d/pay
Content-Type: application/json
```

```json
{
  "method": "gopay"
}
```

### Success Response (200)

```json
{
  "bookingId": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
  "paymentId": "2a4d0c4d-7869-460f-beb2-6ba84f6f6f1d",
  "method": "gopay",
  "paymentStatus": "paid",
  "amount": 1050000,
  "paidAt": "2026-03-18T09:55:22.103Z",
  "message": "Payment completed successfully"
}
```

### Error Response (contoh)

```json
{
  "statusCode": 400,
  "message": "Payment already cancelled",
  "error": "Bad Request"
}
```

---

## 3) PATCH /payments/:bookingId/cancel

Membatalkan payment dan booking terkait.

### Request

```http
PATCH /payments/8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d/cancel
Content-Type: application/json
```

Body opsional (boleh kosong):

```json
{}
```

### Success Response (200)

```json
{
  "bookingId": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
  "paymentId": "2a4d0c4d-7869-460f-beb2-6ba84f6f6f1d",
  "method": "gopay",
  "paymentStatus": "cancelled",
  "amount": 1050000,
  "paidAt": null,
  "message": "Payment cancelled successfully"
}
```

### Error Response (contoh)

```json
{
  "statusCode": 404,
  "message": "Payment not found",
  "error": "Not Found"
}
```

---

## 4) GET /payments/:bookingId

Ambil detail payment berdasarkan bookingId.

### Request

```http
GET /payments/8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d
```

### Success Response (200)

```json
{
  "id": "2a4d0c4d-7869-460f-beb2-6ba84f6f6f1d",
  "bookingId": "8f2fbf2e-5f9d-4e62-9c24-9e5d3a9a6f5d",
  "method": "gopay",
  "paymentStatus": "pending",
  "paidAt": null,
  "externalRef": null,
  "createdAt": "2026-03-18T09:50:10.540Z",
  "updatedAt": "2026-03-18T09:50:10.540Z"
}
```

### Error Response (contoh)

```json
{
  "statusCode": 404,
  "message": "Payment not found",
  "error": "Not Found"
}
```

---

## Ringkasan untuk UI Flutter

Response flow payment (`create`, `pay`, `cancel`) sudah konsisten:

```json
{
  "bookingId": "string",
  "paymentId": "string",
  "method": "string",
  "paymentStatus": "pending | paid | cancelled",
  "amount": 0,
  "paidAt": "string | null",
  "message": "string"
}
```

Format ini siap dipakai untuk menampilkan:

- booking summary
- payment summary
- payment status
- payment success / cancelled state
