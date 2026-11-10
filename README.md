# Ayojan — College Event Management Client

A responsive React + Vite frontend for discovering college events, viewing the gallery, registering for events, managing profiles, and organizing campus activities.

## Live deployment setup

This client is a Vite static site. Configure your frontend hosting service with:

- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- **Node version:** 20 or newer is recommended

Set this environment variable in the frontend hosting dashboard:

```env
VITE_API_URL=https://<your-backend-service>.onrender.com/api
```

The value must include `/api`. After changing it, rebuild and redeploy the frontend because Vite injects `VITE_*` variables at build time.

## Local development

```bash
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

For local API usage, create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Run checks before pushing:

```bash
npm run lint
npm run build
```

## Main features

- Event discovery with search, category filters, featured events, and responsive cards
- Event registration and personal registration history
- Login, signup, protected profile editing, and profile image uploads
- Organizer/admin event management
- Gallery with default campus content until admin content is available
- Feedback and event ratings
- Responsive mobile navigation and accessible dialogs

## Backend connection requirements

The backend must allow the deployed frontend origin through its `CLIENT_URL` environment variable. For example:

```env
CLIENT_URL=https://<this-frontend-domain>
```

Keep `.env` files, API secrets, and uploaded files out of Git. The repository ignores local environment files and build output.
