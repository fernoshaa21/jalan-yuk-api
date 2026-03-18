# Activity Detail API - Implementation Guide

## Overview

Activity Detail API menyediakan informasi lengkap tentang sebuah activity untuk ditampilkan di halaman detail (mobile app / web).

---

## Endpoint

### GET /activities/:id

Mengambil detail lengkap sebuah activity berdasarkan ID.

**Request:**

```
GET /activities/1
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "Activity retrieved successfully",
  "data": {
    "id": 1,
    "title": "Jeep Adventure Di Bukit Batu",
    "description": "Jelajahi keindahan alam dengan jeep off-road di kawasan bukit batu yang eksotis. Petualangan ini cocok untuk keluarga maupun rombongan teman yang ingin mencoba pengalaman off-road yang mendebarkan.",
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

**Response (404 Not Found):**

```json
{
  "statusCode": 404,
  "message": "Activity with ID 999 not found",
  "error": "Not Found"
}
```

**Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Invalid activity ID",
  "error": "Bad Request"
}
```

---

## Response Fields

| Field                 | Type         | Description                        | Example                           |
| --------------------- | ------------ | ---------------------------------- | --------------------------------- |
| `id`                  | number       | Unique activity ID                 | 1                                 |
| `title`               | string       | Activity name (mapped from `name`) | "Jeep Adventure Di Bukit Batu"    |
| `description`         | string       | Detailed activity description      | "Jelajahi keindahan alam..."      |
| `price`               | number       | Price per person in IDR            | 350000                            |
| `location`            | string       | Activity location/city             | "Bogor, Jawa Barat"               |
| `availableSlots`      | number       | Remaining available slots          | 2                                 |
| `imageUrl`            | string\|null | URL to activity image              | "https://example.com/..."         |
| `isFeatured`          | boolean      | Whether activity is featured       | true                              |
| `category`            | string       | Activity category                  | "adventure"                       |
| `rating`              | number       | Average rating (0-5)               | 4.8                               |
| `currentParticipants` | number       | Current number of bookings         | 4                                 |
| `maxParticipants`     | number       | Maximum capacity                   | 6                                 |
| `availableDates`      | string[]     | Available dates (next 5 days)      | ["2026-03-17", "2026-03-18", ...] |

---

## Implementation Details

### Service Layer (activities.service.ts)

#### Main Method: `getActivityById(id: number)`

```typescript
async getActivityById(id: number) {
  // 1. Validate ID
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestException('Invalid activity ID');
  }

  // 2. Fetch activity from database
  const activity = await this.activitiesRepository.findOne({
    where: { id, isActive: true },
  });

  // 3. Handle not found
  if (!activity) {
    throw new NotFoundException(`Activity with ID ${id} not found`);
  }

  // 4. Format and return response
  return this.formatActivityDetail(activity);
}
```

**Key Features:**

- ✅ ID validation (must be positive integer)
- ✅ Only returns active activities (`isActive: true`)
- ✅ Proper error handling with specific exceptions
- ✅ Response formatting before return

---

#### Helper Method: `formatActivityDetail(activity: ActivitiesEntity)`

```typescript
private formatActivityDetail(activity: ActivitiesEntity): ActivityDetailDto {
  return {
    id: activity.id,
    title: activity.name,                    // Map from 'name' to 'title'
    description: activity.description,
    price: activity.price,
    location: activity.location,
    availableSlots: activity.maxParticipants - activity.currentParticipants,  // Calculated
    imageUrl: activity.imageUrl,
    isFeatured: activity.isFeatured,
    category: activity.category,
    rating: activity.rating,
    currentParticipants: activity.currentParticipants,
    maxParticipants: activity.maxParticipants,
    availableDates: this.generateAvailableDates(5),  // Generated
  };
}
```

**Responsibilities:**

- Maps database entity fields to API response format
- Calculates derived fields (availableSlots)
- Generates available dates dynamically
- Returns type-safe DTO

---

#### Helper Method: `generateAvailableDates(days: number)`

```typescript
private generateAvailableDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    // Format as YYYY-MM-DD (ISO 8601)
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}
```

**Features:**

- Generates next N days from today
- Returns dates in YYYY-MM-DD format (ISO 8601)
- Used for display in mobile app date picker

**Example Output:**

```json
{
  "availableDates": [
    "2026-03-17",
    "2026-03-18",
    "2026-03-19",
    "2026-03-20",
    "2026-03-21"
  ]
}
```

---

### DTO Layer (activity-detail.dto.ts)

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

**Benefits:**

- ✅ Type-safe response
- ✅ Clear field definitions
- ✅ Separation of concerns
- ✅ Easy to maintain and extend

---

### Entity Updates (activities.entity.ts)

Added new fields to ActivitiesEntity:

```typescript
@Column({ default: 'adventure', type: 'varchar' })
category: string;

@Column('decimal', { precision: 3, scale: 1, default: 0 })
rating: number;
```

---

## Mobile App Integration Example

### React Native / Flutter Usage

**Fetch activity detail:**

```javascript
// React Native example
const fetchActivityDetail = async (activityId) => {
  try {
    const response = await fetch(`/api/activities/${activityId}`);
    const { data } = await response.json();

    return {
      title: data.title,
      price: data.price,
      availableSlots: data.availableSlots,
      imageUrl: data.imageUrl,
      availableDates: data.availableDates, // Use in date picker
      // ... other fields
    };
  } catch (error) {
    console.error('Failed to fetch activity:', error);
  }
};
```

**Display in UI:**

```javascript
// Show activity detail
<ActivityDetail
  title={activity.title}
  price={activity.price}
  availableSlots={activity.availableSlots}
  availableDates={activity.availableDates}
  onSelectDate={(date) => handleDateSelection(date)}
/>
```

---

## Error Handling

| Status | Error                 | Cause                                    | Solution                     |
| ------ | --------------------- | ---------------------------------------- | ---------------------------- |
| 400    | Invalid activity ID   | ID is not positive integer or malformed  | Validate ID format on client |
| 404    | Activity not found    | ID doesn't exist or activity is inactive | Check activity ID exists     |
| 500    | Internal Server Error | Database connection issue                | Check server logs            |

---

## Best Practices Applied

✅ **Input Validation**

- ID must be positive integer
- Only return active activities

✅ **Error Handling**

- Specific exception types (BadRequestException, NotFoundException)
- Clear error messages

✅ **Response Formatting**

- Maps entity to DTO before returning
- Calculates derived fields (availableSlots)
- Generates dynamic data (availableDates)

✅ **Type Safety**

- Use ActivityDetailDto for type checking
- Null handling for optional fields (imageUrl)

✅ **Code Organization**

- Private helper methods for formatting and date generation
- Clear separation of concerns
- JSDoc comments for documentation

✅ **Database Efficiency**

- Single database query per request
- Only returns necessary fields

---

## Future Enhancements

Potential improvements:

1. **Cache Layer**
   - Cache activity details for frequent reads
   - Invalidate on updates

2. **Related Activities**
   - Return similar activities based on category/location

3. **User Reviews**
   - Include user reviews and photos

4. **Dynamic Pricing**
   - Adjust price based on booking demand

5. **Real Available Dates**
   - Fetch actual available dates from bookings table instead of static 5 days

6. **Availability Status**
   - Show "Fully Booked", "Limited Slots", "Available" status
