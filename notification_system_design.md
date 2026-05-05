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