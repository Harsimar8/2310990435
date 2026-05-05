# Stage 1: REST API Design

### Core Actions
* **Fetch Notifications**: Retrieve a list of alerts (Placements, Events, Results) for a specific student.
* **Filter Notifications**: View specific categories like "Placement" only.
* **Update Read Status**: Mark a notification as read.
* **Real-Time Alerts**: Push urgent data to the user immediately.

### API Endpoints

#### GET /api/v1/notifications
* **Description**: Fetches notifications for the logged-in student.
* **Headers**: `Authorization: Bearer <your_access_token>`
* **Response**:
```json
{
  "notifications": [
    {
      "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "Type": "Result",
      "Message": "Mid-term results are out.",
      "Timestamp": "2026-05-05 11:15:00"
    }
  ]
}

## # Stage 2: Persistent Storage

### 1. Database Choice: MongoDB (NoSQL)
* **My Choice**: I recommend using **MongoDB**.
* **Reason**: Notifications often have different details (a Placement might have a link, while a Result has a grade). MongoDB allows this flexibility.
* **Volume**: It handles high traffic well, which is needed when 50,000 students get alerts at once.

### 2. Database Schema
This is how a single notification will look in the database:
```javascript
{
  "ID": "unique-id-123",
  "studentID": "1042",
  "notificationType": "Placement", 
  "message": "New Job Opening at TechCorp",
  "isRead": false,
  "createdAt": "2026-05-05T11:15:00Z"
}

//  Real-Time Mechanism
// I will use **WebSockets** for real-time delivery. This allows the server to "push" a placement alert to the student instantly the moment it is generated, instead of making the student's browser refresh the page constantly.

# Stage 3: Query Optimization
SELECT * FROM notifications WHERE studentID = 1042 AND isRead = false ORDER BY createdAt ASC;

1. Why is this query slow?
Full Table Scan: Without proper indexes, the database must check all 5,000,000 rows to find unread notifications for one student.

Sorting Overhead: The ORDER BY createdAt clause forces the database to sort the results in memory after fetching them, which is computationally expensive for large datasets.

2. Is the "Index on Every Column" advice effective?
No. Adding indexes on every column is ineffective because:

Write Overhead: Every time a notification is added, the database must update every index, slowing down "Notify All" actions.

Storage Cost: Indexes take up significant disk space.

Solution: A Composite Index on (studentID, isRead, createdAt) is much more efficient as it handles the filtering and sorting in one go.

3. Query for Placement Notifications (Last 7 Days)
SQL
SELECT * FROM notifications 
WHERE notificationType = 'Placement' 
AND createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY);



# Stage 4: Performance Improvement
According to task,fetching data on every page load is overwhelming the database.

Proposed Solutions
Database Caching (Redis): Store the latest notifications in an in-memory cache. When a student logs in, the app checks Redis first, reducing DB hits by ~80%.

Pagination: Instead of SELECT *, fetch only the last 10–20 notifications. This reduces data transfer and memory usage.

Trade-offs:

Redis: Adds architectural complexity and requires a "cache invalidation" strategy when a notification is read.

Pagination: Improves speed but requires UI changes to handle "Load More" functionality.

# Stage 5: Reliability & Batch Processing
The pseudocode fails because it is Synchronous and Fragile.

1. Why the current notify_all fails:
Single Point of Failure: If the 100th email fails, the entire loop might crash, leaving 49,900 students without notifications.

Request Timeout: Sending 50,000 emails/notifications in a single request will exceed the server's timeout limit.

2. Better Implementation: Message Queues
Instead of a simple for loop, I would use a Producer-Consumer Architecture (e.g., BullMQ or RabbitMQ):

The Producer: Adds 50,000 "jobs" to a queue instantly.

The Workers: Multiple background workers pick up jobs and send notifications. If one fails, it is automatically retried without stopping the others.
