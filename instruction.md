# Copilot Project Instructions – DocSpire

You are helping build a SaaS web application called **DocSpire**, similar to BookStack but more modern and collaborative.

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), TailwindCSS, shadcn/ui, lucide-react
- **Backend**: Java Spring Boot REST API
- **Auth**: Supabase Auth
- **Database**: Supabase Postgres
- **Payments**: Stripe Subscriptions
- **UI Style**: Minimalism with matte bright accent colors, clean spacing, smooth transitions

## 🎯 Features

- WYSIWYG markdown similair to notion
- Easily handle images in a document similair to notion
- Landing page for marketing
- Auth (Sign In/Up) via Supabase
- Auth-protected dashboard at `/dashboard`
- Companies can be created by admins
- Admins can invite users and assign permissions
- Rich-text documentation pages per company
- Stripe integration for paid admin plans
- Free plan includes basic features and limited to 2 users per company
- Paid monthly plan of $20 a month unlocks more and unlimited users per company.
- Documents can be created or uploaded. Text editor needs to support markdown.
- Created documents can contain images. This is useful for creating guides and documentation


## 💡 Guidelines

- Must be optimized and follow best practices. 
- Use TailwindCSS utility classes
- Use `shadcn/ui` components where possible (modals, buttons, etc.)
- Use `lucide-react` for icons
- All `/dashboard` routes should be protected and redirect unauthenticated users
- Structure code with `components/`, `lib/`, and `app/` directories
- Write clean, modern, accessible JSX/JS code with proper semantics

- For anything Table schema related please update the schema.sql file located at the root of the project. 
- For database must follow best practices for security and access. 