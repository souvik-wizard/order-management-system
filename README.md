# Order Management System

A full-stack Order Management System with a Next.js frontend and an Express.js backend.

## Running Tests

### Backend Tests
The backend API tests are written using **Jest** and **Supertest**. They use mocked database configurations, so they can be run without requiring a running MongoDB server.

To run the backend tests:
```bash
cd backend
npm install
npm run test
```

### Frontend Tests
The frontend tests are written using **Jest** and **React Testing Library**. They verify the rendering and interaction of UI pages and components including the Redux store.

To run the frontend tests:
```bash
cd frontend
npm install
npm run test
```
