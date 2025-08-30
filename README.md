# Kuki Environmental Monitor Dashboard

A full-stack web application for monitoring and visualizing air pollution data (Benzene, Toluene, NO) using MongoDB Atlas, Express, React, and Vercel.

## Features

- **JWT Authentication:** Secure login and protected dashboard.
- **CRUD Operations:** Add, edit, and delete pollution records.
- **Filtering:** Filter data by year, year range, and month range.
- **Charts:** Animated line graph for Benzene, Toluene, and NO emissions per month.
- **Tables:** Data table with shadcn/ui components.
- **Toast Notifications:** User feedback for all actions.
- **Loading States:** Skeletons and spinners for smooth UX.
- **Pagination:** (Optional, can be added)
- **Deployed on Vercel (Frontend) and Render (Backend).**

## Tech Stack

- **Frontend:** React, TypeScript, Vite, shadcn/ui, Recharts, React Query
- **Backend:** Node.js, Express, MongoDB Atlas, JWT
- **Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/kuki.git
cd kuki
```

### 2. Setup Backend
- Go to `backend/`
- Create a `.env` file with your MongoDB URI and JWT secret:
  ```env
  MONGODB_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_jwt_secret
  ```
- Install dependencies and start server:
  ```bash
  npm install
  npm start
  ```

### 3. Setup Frontend
- Go to `frontend/`
- Install dependencies:
  ```bash
  npm install
  npm run dev
  ```
- Update `apiUrl` in `frontend/src/lib/api.ts` if needed to point to your backend.

### 4. Deployment
- Frontend: Deploy `frontend/` to Vercel.
- Backend: Deploy `backend/` to Render.
- For Vercel, make sure `vercel.json` is present for SPA routing.

## Usage
- Register and login.
- Add, edit, delete, and filter pollution data.
- View animated charts and tables.

## Screenshots
(Add screenshots here)

## License
MIT
