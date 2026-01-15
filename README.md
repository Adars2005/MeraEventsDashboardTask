# MeraEvents

A simplified full-stack dashboard for managing events and registration lists. Built with modern web technologies focusing on robust data handling and premium user experience.

## 🚀 Features

-   **Event Management**: Create, view, and delete events with details like Title, Date, Description, and Capacity.
-   **Attendee Management**: Register attendees for events and view real-time registration lists.
-   **Data Persistence**: Full SQLite database integration using Prisma ORM.
-   **Optimistic UI**: Immediate UI updates for actions like deleting events for a snappy feel.
-   **Form Integrity**: validation using Zod schemas and React Hook Form.
-   **Resilient Design**: Loading skeletons, specialized empty states, and toast notifications.

## 🛠️ Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **UI Library**: Shadcn/UI + Tailwind CSS
-   **Database/ORM**: Prisma + SQLite
-   **State Management**: TanStack Query (React Query)
-   **Forms**: React Hook Form + Zod

## 🏁 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm

### Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Setup Database**
    This will generate the Prisma client and push the schema to your local SQLite database (`dev.db`).
    ```bash
    npx prisma generate
    npx prisma db push
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Open Browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

-   `src/app`: Next.js App Router pages and API routes.
-   `src/components`: UI components (including Shadcn/UI) and feature-specific components.
-   `src/lib`: Utilities, database configuration (`db.ts`), and Zod schemas (`schemas.ts`).
-   `prisma`: Database schema definition (`schema.prisma`).

## 💡 Key Design Implementation

-   **TanStack Query**: Used for all data fetching to ensure server state is always in sync with the client.
-   **Optimistic Updates**: The "Delete Event" action updates the list immediately before the server responds.
-   **Server-Side Logic**: API routes (`src/app/api/`) handle database operations securely.
