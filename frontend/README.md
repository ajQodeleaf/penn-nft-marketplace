# MENN(MongoDB ExpressJS NextJS NodeJS) NFT Marketplace

Welcome to the MENN NFT Marketplace! This is a platform where users can explore, buy, and sell NFTs. The application is built using Next.js and integrates with blockchain technologies.

## Environment Variables

The application uses several environment variables to configure different aspects of the project for various environments (development, production, etc.).

### 1. `NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL=http://localhost:5000`

- **Purpose**: This variable holds the URL of the backend server during development. It points to a locally running backend (usually on `localhost` at port 5000).
- **When Used**: This will be used by the frontend when making API calls during the development stage to interact with your backend.

### 2. `NEXT_PUBLIC_PRODUCTION_BACKEND_URL=`

- **Purpose**: This variable stores the URL for the backend server in a production environment.
- **When Used**: This URL will be used when the app is deployed in production to make API calls to the production backend.

### 3. `NEXT_PUBLIC_ENV=development`

- **Purpose**: This variable specifies the environment the app is running in (either development or production).
- **When Used**: It helps the application know whether it is in a development or production environment and allows conditional changes in behavior (e.g., using different API endpoints for development vs. production).

## Getting Started: Running locally

To run the development server, use the following command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Once the server is running, open the following URL in your browser to see the app:

#### [http://localhost:3000](http://localhost:3000)

This will launch the app on your local machine.

## Deployment to Production

When deploying to production (e.g., Vercel), **don't forget to supply the list of environment variables and their values**.

### Important:

- In production, make sure to set the environment variable `NEXT_PUBLIC_ENV` to `production`.
- In production, the value for `NEXT_PUBLIC_PRODUCTION_BACKEND_URL` will be the URL of deployed backend on platform like Render, Back4App, etc.
- `NEXT_PUBLIC_ENV` only responds to either value `production` or `development` when assigned. 

Here is an example of the environment variables:

```env
NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_PRODUCTION_BACKEND_URL=<production_backend_url>
NEXT_PUBLIC_ENV=production
```

## Pages and Their Functions

Here’s a list of the key pages in the app and what they display:

### 1. **Home Page** (`/`)
- Displays featured NFTs and marketplace announcements.

### 2. **Explore Page** (`/explore`)
- Allows users to browse available NFTs and collections.

### 3. **NFT Details Page** (`/nftDetails/[id]`)
- Provides detailed information about a specific NFT.

### 4. **Buy Page** (`/buy`)
- Allows users to purchase NFTs from the marketplace.

### 5. **List Page** (`/list`)
- Lets users list their NFTs for sale in the marketplace.

### 6. **Account Page** (`/account`)
- Displays the user\'s profile, wallet info, and transaction history.

### 7. **Search Page** (`/search`)
- Provides a search functionality to find NFTs based on different criteria.

### 8. **See All Page** (`/see-all`)
- Displays all NFTs or collections available, with pagination.

### 9. **News Page** (`/news`)
- Shows the latest updates and news related to the platform.

### 10. **News Details Page** (`/news/[id]`)
- Displays detailed information for a specific news article.

## Context Used in Frontend

In this project, **React Context** is utilized to manage global states across various components, enabling shared data without prop-drilling. Below are the primary contexts in use:

### 1. `WalletContext`
Manages the wallet connection state, storing the connection status and the wallet address.

- **Purpose**: Handles wallet connection, disconnection, and provides the wallet address globally.

### 2. `ConfigContext`
Stores configuration values such as API URLs and environment settings, ensuring easy access throughout the app.

- **Purpose**: Provides global configuration settings like the backend URL and environment type (development/production).

### 3. `OnboardingContext`
Tracks the user's progress in the onboarding process, allowing easy navigation between different steps.

- **Purpose**: Manages the current step in the onboarding flow and provides methods to progress through the steps.

---

These contexts simplify state management across the app, enhance code readability, and ensure global state accessibility, promoting scalability and maintainability.
