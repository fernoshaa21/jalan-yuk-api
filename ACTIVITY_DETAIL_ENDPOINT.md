# Activity Detail Endpoint - Complete Implementation

## Endpoint Overview

```
GET /activities/:id
```

Retrieve detailed information about a specific activity.

---

## Controller Implementation

**File:** [src/activities/activities.controller.ts](src/activities/activities.controller.ts)

### Route Handler

```typescript
@Get(':id')
@HttpCode(HttpStatus.OK)
async getActivityById(@Param('id', ParseIntPipe) id: number) {
  const data = await this.activitiesService.getActivityById(id);
  return {
    statusCode: HttpStatus.OK,
    message: 'Activity retrieved successfully',
    data,
  };
}
```

### Implementation Details

| Feature             | Implementation  |
| ------------------- | --------------- |
| **HTTP Method**     | GET             |
| **Route**           | /activities/:id |
| **Path Parameter**  | `id` (number)   |
| **HTTP Status**     | 200 OK          |
| **Response Format** | JSON            |

---

## Request

### URL

```
GET /activities/1
```

### Path Parameters

```
id: number (required) - Activity ID
```

### Headers

```
Content-Type: application/json
```

### Example cURL

```bash
curl -X GET http://localhost:3000/activities/1 \
  -H "Content-Type: application/json"
```

---

## Response

### Success Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Activity retrieved successfully",
  "data": {
    "id": 1,
    "title": "Jeep Adventure Di Bukit Batu",
    "description": "Jelajahi keindahan alam dengan jeep off-road di kawasan bukit batu yang eksotis.",
    "price": 350000,
    "location": "Bogor, Jawa Barat",
    "availableSlots": 2,
    "imageUrl": "https://example.com/images/jeep-adventure-1.jpg",
    "isFeatured": true,
    "category": "adventure",
    "rating": 4.8,
    "currentParticipants": 4,
    "maxParticipants": 6,
    "availableDates": [
      "2026-03-17",
      "2026-03-18",
      "2026-03-19",
      "2026-03-20",
      "2026-03-21"
    ]
  }
}
```

### Error Response: Invalid ID (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

### Error Response: Not Found (404 Not Found)

```json
{
  "statusCode": 404,
  "message": "Activity with ID 999 not found",
  "error": "Not Found"
}
```

---

## Best Practices Applied

### 1. **ParseIntPipe for Auto Type Conversion**

```typescript
@Param('id', ParseIntPipe) id: number
```

- ✅ Automatically converts string to number
- ✅ Validates numeric input
- ✅ Throws 400 Bad Request if invalid
- ✅ Eliminates manual `parseInt(id, 10)` logic

### 2. **Explicit HTTP Status Code**

```typescript
@HttpCode(HttpStatus.OK)
```

- ✅ Clear intent with `HttpStatus.OK` (200)
- ✅ Type-safe with constants (avoid magic numbers)
- ✅ Self-documenting code

### 3. **Consistent Response Format**

```typescript
return {
  statusCode: HttpStatus.OK,
  message: 'Activity retrieved successfully',
  data,
};
```

- ✅ Consistent with other endpoints
- ✅ Clear error messages
- ✅ Structured response for client parsing

### 4. **JSDoc Documentation**

```typescript
/**
 * Get activity detail by ID
 * GET /activities/:id
 * @param id - Activity ID (numeric)
 * @returns Activity detail with available dates and slots
 */
```

- ✅ Clear endpoint description
- ✅ Parameter documentation
- ✅ Return value documentation

### 5. **Async/Await Pattern**

```typescript
async getActivityById(...) {
  const data = await this.activitiesService.getActivityById(id);
  return { ... };
}
```

- ✅ Clean asynchronous code
- ✅ Error propagation to NestJS error handling
- ✅ Readable promise-based flow

### 6. **Separation of Concerns**

- ✅ Controller handles: HTTP layer (params, response format)
- ✅ Service handles: Business logic (validation, formatting)
- ✅ DTO handles: Type definitions and data shapes

---

## Service Implementation

**File:** [src/activities/activities.service.ts](src/activities/activities.service.ts)

```typescript
async getActivityById(id: number) {
  // Validate ID
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestException('Invalid activity ID');
  }

  // Fetch from database
  const activity = await this.activitiesRepository.findOne({
    where: { id, isActive: true },
  });

  // Handle not found
  if (!activity) {
    throw new NotFoundException(`Activity with ID ${id} not found`);
  }

  // Format response
  return this.formatActivityDetail(activity);
}
```

### Service Features

- ✅ ID validation (positive integer)
- ✅ Database query (only active activities)
- ✅ Not found handling
- ✅ Response formatting

---

## DTO Implementation

**File:** [src/activities/dto/activity-detail.dto.ts](src/activities/dto/activity-detail.dto.ts)

```typescript
export class ActivityDetailDto {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  availableSlots: number;
  imageUrl: string | null;
  isFeatured: boolean;
  category: string;
  rating: number;
  availableDates: string[];
  currentParticipants: number;
  maxParticipants: number;
}
```

---

## Testing Examples

### Test 1: Valid Activity ID

```bash
curl -X GET http://localhost:3000/activities/1
```

**Expected Response:**

- Status: 200 OK
- Body: Activity detail object

### Test 2: Invalid ID Format

```bash
curl -X GET http://localhost:3000/activities/abc
```

**Expected Response:**

- Status: 400 Bad Request
- Message: "Validation failed (numeric string is expected)"

### Test 3: Non-existent Activity

```bash
curl -X GET http://localhost:3000/activities/999
```

**Expected Response:**

- Status: 404 Not Found
- Message: "Activity with ID 999 not found"

### Test 4: Zero or Negative ID

```bash
curl -X GET http://localhost:3000/activities/0
```

**Expected Response:**

- Status: 400 Bad Request
- Message: "Invalid activity ID"

---

## Request/Response Flow

```
1. Client Request
   GET /activities/1

2. NestJS Controller (activities.controller.ts)
   - Extract 'id' param: "1"
   - ParseIntPipe: Convert "1" → 1 (number)
   - Validate: Ensure it's a valid number
   - Call service.getActivityById(1)

3. NestJS Service (activities.service.ts)
   - Validate: Check if id > 0 and is integer
   - Database: Find activity where id=1 AND isActive=true
   - Check: If not found, throw NotFoundException
   - Format: Convert entity to ActivityDetailDto
   - Return: Formatted response

4. NestJS Controller
   - Wrap response with statusCode, message, data
   - Return to client

5. Client Response
   {
     "statusCode": 200,
     "message": "Activity retrieved successfully",
     "data": { ... }
   }
```

---

## Error Handling Chain

| Layer          | Error                              | Type                | HTTP Status               |
| -------------- | ---------------------------------- | ------------------- | ------------------------- |
| **Controller** | Invalid param format (e.g., "abc") | ParseIntPipe        | 400 Bad Request           |
| **Service**    | ID <= 0                            | BadRequestException | 400 Bad Request           |
| **Service**    | Activity not found                 | NotFoundException   | 404 Not Found             |
| **Database**   | Connection error                   | Runtime error       | 500 Internal Server Error |

---

## Route Ordering (Important!)

The order of route definitions matters in NestJS:

```typescript
@Get()                 // 1. Specific route first
async getActivities() { ... }

@Get('featured')       // 2. Static route segment before param route
async getFeaturedActivities() { ... }

@Get(':id')            // 3. Param route last (catch-all)
async getActivityById() { ... }
```

**Why?** NestJS matches routes in order. Placing `:id` first would catch `/featured` as `id=featured`.

---

## Mobile App Integration Example

### React Native / Flutter

```javascript
// Fetch activity detail
const fetchActivityDetail = async (activityId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/activities/${activityId}`,
    );
    const { statusCode, data } = await response.json();

    if (statusCode === 200) {
      return {
        id: data.id,
        title: data.title,
        price: data.price,
        availableSlots: data.availableSlots,
        availableDates: data.availableDates,
        imageUrl: data.imageUrl,
        // ... other fields
      };
    }
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    throw error;
  }
};

// Usage
const activity = await fetchActivityDetail(1);
console.log(`${activity.title} - Rp${activity.price}`);
console.log(`Available slots: ${activity.availableSlots}`);
console.log(`Available dates:`, activity.availableDates);
```

---

## Summary

✅ **GET /activities/:id** endpoint fully implemented with:

- ParseIntPipe for automatic type conversion
- Consistent response format
- Proper error handling
- JSDoc documentation
- Service-DTO separation
- Route ordering
- Type safety with TypeScript

Ready for production! 🚀
