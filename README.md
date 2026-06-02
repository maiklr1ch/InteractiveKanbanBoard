# 📋 Interactive Kanban Board

A full-stack task management web application inspired by Trello — featuring drag-and-drop boards, grouped tasks, and secure authentication via Email or Google OAuth.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 Overview

Interactive Kanban Board lets users organize their work across multiple boards and columns. Each board contains groups (columns), and each group holds tasks with priorities, deadlines, descriptions, and completion status. Tasks can be reordered and moved between columns via drag-and-drop. Users manage their own isolated workspace with full authentication support including Google OAuth.

---

## ✨ Key Features

- **Multi-board workspace** — create and manage multiple independent Kanban boards
- **Drag & drop** — reorder tasks and move them between columns in real time
- **Full task management** — create, view, edit, and delete tasks with name, description, priority (1–10), deadline, and completion status
- **Group management** — add, rename, and delete columns (groups) within any board
- **Authentication** — sign in with Email/Password or Google OAuth via NextAuth.js (JWT)
- **Profile settings** — update display name and upload a profile avatar (stored via Uploadthing CDN)
- **Persistent storage** — all data stored in PostgreSQL via Prisma ORM
- **Protected routes** — middleware-level route protection; unauthenticated users are redirected to login
- **Responsive UI** — built with shadcn/ui and Tailwind CSS v4 on a dark slate theme
- **Toast notifications** — real-time feedback for all user actions via Sonner

---

## 🛠 Technical Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), TypeScript, React 19 |
| **Styling** | Tailwind CSS v4, shadcn/ui (New York style) |
| **State / Forms** | React Hook Form, Zod, TanStack Table |
| **Drag & Drop** | @hello-pangea/dnd |
| **Authentication** | NextAuth.js v4 (Auth.js) — JWT, Google OAuth, Credentials |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **File Uploads** | Uploadthing |
| **HTTP Client** | Axios |
| **Notifications** | Sonner |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma              # DB schema: User, Board, Group, Task
│
├── src/
│   ├── app/
│   │   ├── (auth)/                # Public auth pages (no header)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (main)/                # Protected pages (with header)
│   │   │   ├── layout.tsx         # Session check + SessionProvider
│   │   │   ├── boards/
│   │   │   │   ├── page.tsx       # All boards list
│   │   │   │   └── [boardId]/
│   │   │   │       └── page.tsx   # Kanban board view
│   │   │   └── profile/
│   │   │       └── page.tsx       # Profile settings
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── profile/route.ts
│   │   │   ├── boards/
│   │   │   │   ├── route.ts           # GET, POST
│   │   │   │   └── [boardId]/route.ts # GET, PUT, DELETE
│   │   │   ├── groups/
│   │   │   │   ├── route.ts           # POST
│   │   │   │   └── [groupId]/route.ts # PUT, DELETE
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts           # GET, POST
│   │   │   │   └── [taskId]/route.ts  # PUT, DELETE
│   │   │   └── uploadthing/
│   │   │       ├── core.ts            # Uploadthing file router
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx             # Root layout (Toaster)
│   │   └── globals.css
│   │
│   ├── auth.ts                    # NextAuth config (providers, callbacks)
│   ├── middleware.ts              # Route protection
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   ├── auth/              # LoginForm, RegisterForm, GoogleAuthButton
│   │   │   ├── boards/            # BoardCard, BoardsGrid, BoardsControl
│   │   │   ├── kanban/            # KanbanBoard, KanbanColumn, KanbanTaskCard
│   │   │   ├── dialogs/           # Create/Edit/Delete/View dialogs
│   │   │   │   └── form/schemas.ts
│   │   │   ├── profile/           # ProfileForm
│   │   │   ├── columns/           # TanStack table column definitions
│   │   │   ├── header.tsx
│   │   │   └── providers.tsx      # SessionProvider wrapper
│   │   └── ui/                    # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── uploadthing.ts         # Uploadthing React helpers
│   │   └── utils.ts               # cn(), formatTime()
│   │
│   ├── services/
│   │   └── api-client.ts          # Axios API service (boards, groups, tasks)
│   │
│   └── @types/
│       ├── index.ts               # IBoard, IGroup, ITask, IUser + DTO types
│       └── next-auth.d.ts         # Session type augmentation
```

---

## 🗄 Database Schema

```
User ──< Board ──< Group ──< Task
      └─ Account
      └─ Session
```

| Model | Key Fields |
|---|---|
| `User` | id, name, email, password (nullable), image |
| `Board` | id, name, description, color, userId |
| `Group` | id, name, order, boardId |
| `Task` | id, name, description, priority, isDone, dueDate, order, groupId |
| `Account` | OAuth accounts (Google) |
| `Session` | Active sessions |

---

## 🔐 Authentication Flow

```
Email/Password          Google OAuth
      │                      │
  authorize()          Google callback
      │                      │
      └──────── JWT ──────────┘
                  │
         session.user.id
                  │
         Protected Routes
```

- JWT strategy with configurable `AUTH_MAX_AGE`
- Passwords hashed with **bcryptjs** (12 salt rounds)
- Google profile avatar automatically imported on first sign-in
- Route protection via `authorized` callback in `auth.ts`

---

## 📡 API Reference

All endpoints require authentication (valid session cookie). Unauthorized requests return `401`.

### Boards

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/boards` | Get all boards for the current user |
| `POST` | `/api/boards` | Create a new board |
| `GET` | `/api/boards/:boardId` | Get a board with its groups and tasks |
| `PUT` | `/api/boards/:boardId` | Update board (name, description, color) |
| `DELETE` | `/api/boards/:boardId` | Delete board and all its data |

### Groups

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/groups` | Create a new group in a board |
| `PUT` | `/api/groups/:groupId` | Rename a group |
| `DELETE` | `/api/groups/:groupId` | Delete a group and its tasks |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks?groupId=` | Get tasks (optionally filtered by group) |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:taskId` | Update task (supports cross-group move via `groupId`) |
| `DELETE` | `/api/tasks/:taskId` | Delete a task |

### Auth & User

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Register a new user |
| `PATCH` | `/api/profile` | Update display name |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth.js handler |
| `GET/POST` | `/api/uploadthing` | Uploadthing file upload handler |

#### Example — Create Task

```http
POST /api/tasks
Content-Type: application/json

{
  "name": "Design landing page",
  "description": "Create wireframes and mockups",
  "priority": 8,
  "isDone": false,
  "dueDate": "2025-12-31T18:00:00.000Z",
  "groupId": "clx1abc..."
}
```

```json
{
  "id": "clx2xyz...",
  "name": "Design landing page",
  "priority": 8,
  "isDone": false,
  "dueDate": "2025-12-31T18:00:00.000Z",
  "order": 0,
  "groupId": "clx1abc...",
  "createdAt": "2025-06-01T10:00:00.000Z"
}
```

---

## 📋 Requirements

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14
- A [Google Cloud Console](https://console.cloud.google.com) project with OAuth 2.0 credentials
- An [Uploadthing](https://uploadthing.com) account and API token

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```properties
# ─── Database ──────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/kanban_board"

# ─── NextAuth ──────────────────────────────────────
# Generate: openssl rand -base64 32
AUTH_SECRET="your-secret-key"

# Session lifetime in seconds (default: 604800 = 7 days)
AUTH_MAX_AGE=604800

# Must match your app URL exactly
NEXTAUTH_URL="http://localhost:3000"

# ─── Google OAuth ──────────────────────────────────
# From: console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# ─── Uploadthing ───────────────────────────────────
# From: uploadthing.com → Dashboard → API Keys
UPLOADTHING_TOKEN="your-uploadthing-token"

# ─── App ───────────────────────────────────────────
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

> **Note:** Never commit `.env` to version control. Add it to `.gitignore`.

---

## 🚀 Launch Project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/interactive-kanban-board.git
cd interactive-kanban-board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Fill in all values in .env
```

### 4. Set up the database

```bash
# Apply schema to your PostgreSQL database
npx prisma db push

# Generate the Prisma client
npx prisma generate
```

### 5. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Build for production

```bash
npm run build
npm start
```

---

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set application type to **Web application**
6. Add to **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copy `Client ID` and `Client Secret` into `.env`

---

## 📦 Key Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma DB browser |
| `npx prisma db push` | Sync schema to database |
| `npx prisma generate` | Regenerate Prisma client |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
