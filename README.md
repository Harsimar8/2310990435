# Notification System

This workspace contains a comprehensive notification system with multiple components:

## Components

- **logging_middleware/**: Middleware for handling and logging notification events.
- **notification_app_be/**: Backend application for processing notifications, including priority inbox functionality.
- **notification_app_fe/**: Frontend application built with Next.js for displaying notifications.

## Getting Started

1. Ensure you have Node.js and npm installed.
2. Navigate to each component directory and install dependencies:
   ```
   cd logging_middleware && npm install
   cd ../notification_app_be && npm install
   cd ../notification_app_fe && npm install
   ```
3. Start the applications as per their individual README files.

## Design

See `notification_system_design.md` for detailed system design and architecture.