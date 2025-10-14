# Freelancer AI Task Manager

> Transform your project ideas into organized tasks with the power of AI

A modern, AI-powered task management application built for freelancers and solo developers. Describe your project in one sentence, and watch as AI breaks it down into actionable tasks with intelligent prioritization.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-demo-url.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-enabled-3ECF8E)](https://supabase.com/)

---

## Features

### **AI-Powered Task Generation**
- Describe your project in natural language
- Google Gemini AI generates structured, prioritized tasks
- Intelligent task breakdown with estimated time and priority levels

### **Interactive Kanban Board**
- Drag-and-drop task management (To-Do → In Progress → Done)
- Real-time status updates
- Visual priority indicators (High, Medium, Low)
- Task count badges per column

### **Secure Authentication**
- Email/password authentication
- Google OAuth integration (one-click sign-in)
- Protected routes with session persistence
- Row-Level Security (RLS) for data privacy

### **Persistent Data Storage**
- Tasks saved to Supabase PostgreSQL
- Real-time synchronization across devices
- Auto-save on every change
- No data loss on page refresh

### **Modern UI/UX**
- Glassmorphic design with gradient accents
- Smooth animations and transitions
- Fully responsive (mobile-friendly)
- Dark mode optimized
- Collapsible sidebar

---

## Tech Stack

### **Frontend**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **React Query** - Server state management
- **React Router** - Client-side routing

### **Backend**
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication (Email + OAuth)
  - Row-Level Security (RLS)
  - Real-time subscriptions

### **AI Integration**
- **Google Gemini API** - AI task generation
  - Model: `gemini-2.0-flash-exp`
  - JSON schema validation with Zod
  - Error handling with fallback tasks

### **Developer Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase account** (free tier)
- **Google AI Studio API key** (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LisaReitinger/freelancer-ai-task-manager.git
   cd freelancer-ai-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-url-here
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   VITE_GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. **Set up Supabase database**
   
   Run the SQL migrations in your Supabase dashboard:
   - Go to SQL Editor
   - Run `supabase/migrations/001_initial_schema.sql`
   - Run `supabase/migrations/002_rls_policies.sql`

5. **Enable authentication providers**
   
   In Supabase dashboard → Authentication → Providers:
   - Enable **Email** authentication
   - (Optional) Enable **Google OAuth**

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:8080`

---

## Environment Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://aistudio.google.com/app/apikey) |

---

## Screenshots

### Authentication Page
![Auth Page](docs/screenshots/auth.png)
*Modern sign-in/sign-up with Google OAuth integration*

### AI Task Generation
![Task Generation](docs/screenshots/task-generation.png)
*Describe your project and let AI do the planning*

### Kanban Board
![Kanban Board](docs/screenshots/kanban.png)
*Drag-and-drop task management with real-time updates*

---

## 🏗️ Project Structure

```
freelancer-ai-task-manager/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AppSidebar.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskInput.tsx
│   ├── pages/             # Route pages
│   │   ├── Index.tsx      # Main dashboard
│   │   ├── Auth.tsx       # Login/signup
│   │   └── NotFound.tsx
│   ├── services/          # API services
│   │   ├── gemini.ts      # AI task generation
│   │   ├── projects.ts    # Project CRUD
│   │   └── tasks.ts       # Task CRUD
│   ├── lib/               # Utilities
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # Helper functions
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   └── App.tsx            # Root component
├── supabase/
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── package.json
```

---

## How It Works

### 1. **AI Task Generation Flow**
```
User Input → Gemini API → JSON Validation → Database → UI Update
```

- User describes project (e.g., "Build a weather app")
- Gemini API processes with structured prompt
- Response validated against Zod schema
- Tasks saved to Supabase with metadata
- UI updates in real-time

### 2. **Authentication Flow**
```
Sign Up/In → Supabase Auth → JWT Token → Session Storage → Protected Routes
```

- Email/password or Google OAuth
- JWT token stored in localStorage
- Session persists across page refreshes
- RLS policies ensure data privacy

### 3. **Data Persistence**
```
Drag Task → Update Status → Supabase API → RLS Check → Database → Real-time Sync
```

- Every action auto-saves to database
- Row-Level Security enforces user isolation
- Real-time subscriptions keep UI in sync

---

## Key Features Implemented

- ✅ AI-powered task generation with Google Gemini
- ✅ User authentication (Email + Google OAuth)
- ✅ Real-time Kanban board with drag-and-drop
- ✅ Persistent data storage with Supabase
- ✅ Row-Level Security for data privacy
- ✅ Responsive design with Tailwind CSS
- ✅ Error handling and loading states
- ✅ Toast notifications for user feedback
- ✅ Session persistence across refreshes

---

## Future Enhancements

- [ ] **AI Assistant Chat** - Conversational interface to refine tasks
- [ ] **Multi-project Support** - Manage multiple projects simultaneously
- [ ] **Task Editing** - Inline edit task title, description, priority
- [ ] **Bulk Operations** - Delete/move multiple tasks at once
- [ ] **Time Tracking** - Track time spent on each task
- [ ] **Team Collaboration** - Share projects with team members
- [ ] **Mobile App** - React Native version
- [ ] **n8n Integration** - Automation workflows
- [ ] **Analytics Dashboard** - Productivity insights

---

## 📚 What I Learned

This project was a great learning experience in:

- **AI Integration**: Working with Google Gemini API for intelligent task generation
- **Backend as a Service**: Leveraging Supabase for auth, database, and real-time features
- **Type Safety**: Building a fully-typed React application with TypeScript
- **Modern React Patterns**: Hooks, custom hooks, component composition
- **State Management**: React Query for server state, local state for UI
- **Authentication**: Implementing secure auth with session persistence
- **Database Design**: PostgreSQL schema design with RLS policies
- **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**

- GitHub: [@LisaReitinger](https://github.com/LisaReitinger)
- LinkedIn: [Lisa Reitinger](https://www.linkedin.com/in/lisareitinger/)

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Google AI](https://ai.google.dev/) - Gemini API for task generation
- [Lovable](https://lovable.dev/) - Initial UI design inspiration
