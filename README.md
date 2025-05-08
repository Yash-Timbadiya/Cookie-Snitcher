# Next.js Web App for Cookie Display - "Cookie Snitcher"

## Overview

This web app will allow users to view the cookies stored by the Chrome Extension in a tabular format. The data will be fetched from a backend powered by Neon DB (PostgreSQL) using Drizzle ORM. The UI will be modern, good-looking, dark mode-first, and styled with Tailwind CSS.

## Sections

### 1. Setting Up the Next.js App

1. Create a Next.js project using `npx create-next-app`.
2. Install Tailwind CSS for styling.
3. Set up Drizzle ORM to connect with your Neon DB (PostgreSQL) instance.
4. Set up API routes to interact with your backend (using Drizzle ORM and Neon DB) to store and fetch the cookies.

### 2. Building the UI

1. Use Tailwind CSS to build a modern, good-looking, and responsive table layout for displaying cookies, designed specifically for dark mode.
2. Ensure the UI is visually appealing and user-friendly.
3. Include columns for tab URL, tab ID, cookie name, and value.
4. Add pagination or filtering features if necessary.

### 3. Fetching Data from Backend

1. Use `getServerSideProps` or `getStaticProps` to fetch data from the backend.
2. Display all the details. also add copy button to copy the value of the all cookie in array format.
3. if shorting or filtering is required, add that feature.

### 4. Backend Integration

1. The backend will use Drizzle ORM to interact with the Neon DB (PostgreSQL) for storing and retrieving cookies.
2. Implement API endpoints such as `POST /api/cookies` for storing data and `GET /api/cookies` to fetch the data.

---

## Libraries

- `Next.js`
- `Tailwind CSS`
- `Axios` for API requests (from client-side if needed, or Next.js API routes can handle directly)
- `React` for dynamic UI updates
- `Drizzle ORM` for database interaction
- `pg` (Node.js PostgreSQL client) for Drizzle to connect to Neon DB

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/installation)
- [pg Documentation](https://node-postgres.com/)
