# 🔗 BookmarkStack

> A smart, real-time bookmark manager --- built for developers,
> obsessives, and anyone who wants their links to *work for them*.

**Live:** https://bookmarkstack.vercel.app

BookmarkStack is more than a bookmark tool --- it's a clean,
realtime-powered dashboard that adapts to your workflow. Built with
Next.js, Supabase, and deployed on Vercel, this project showcases a
full-stack mindset with production-grade features.

------------------------------------------------------------------------

## 🚀 What It Does

✔ Google login (OAuth via Supabase)\
✔ Save bookmarks with instant realtime sync\
✔ Manual drag & drop reordering\
✔ Search + sort (newest, oldest, A-Z, Z-A)\
✔ Soft delete (Trash) system\
✔ Responsive premium dark UI\
✔ Live syncing across tabs (no refresh needed)

------------------------------------------------------------------------

## 🛠 Technologies Used

  | Layer        | Technology |
|-------------|------------|
| Frontend     | Next.js (App Router) |
| Backend      | Supabase (Database + Auth + Realtime) |
| Styling      | Tailwind CSS |
| Deployment   | Vercel |
| Database     | PostgreSQL (via Supabase) |
------------------------------------------------------------------------

## 🧠 Why This Is Cool

This isn't just a CRUD app --- it demonstrates:

-   **Realtime event handling** (Supabase Realtime)
-   **Proper auth & protected routes**
-   **Secure environment config for production**
-   **Drag & drop UI state synced to database**
-   **Soft delete + trash workflow**

All of this runs with realtime feedback and a polished interface.

------------------------------------------------------------------------

## 📁 Core Features

### 🔐 Authentication

Sign in securely with Google. Session logic is handled with Supabase
Auth and protected routes.

### ⚡ Realtime Sync

Bookmarks update live across multiple tabs/devices without refresh.

### 📌 Bookmark Management

-   Create bookmarks
-   Edit titles and URLs
-   Soft-delete with Trash
-   Manual reorder with database persistence

### 🔍 Search & Sort

Instant search + flexible sorting modes (manual, newest, oldest,
alphabetical).

------------------------------------------------------------------------

## 👨‍💻 Installation (Local Dev)

1.  Clone the repo:

``` bash
git clone https://github.com/yourusername/smart-bookmark-saas.git
```

2.  Install dependencies:

``` bash
npm install
```

3.  Create `.env.local`:

``` env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

4.  Run the dev server:

``` bash
npm run dev
```

------------------------------------------------------------------------

## 🧩 Production Setup

1.  Deploy to Vercel
2.  Add environment variables in Vercel
3.  In Supabase Auth → URL config:

<!-- -->

    https://your-vercel-domain.vercel.app
    http://localhost:3000

------------------------------------------------------------------------

## 📌 Project Structure

    ├── app/
    │   ├── dashboard/
    │   ├── login/
    │   ├── trash/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    ├── lib/
    │   └── supabase.ts
    ├── tailwind.config.js
    └── README.md

------------------------------------------------------------------------

## 🚦 How Realtime Works

Supabase Realtime is used to subscribe to bookmark changes: - Insert -
Update - Delete

Every client sees changes instantly without refresh.

This makes collaborative or multi-tab workflows smooth.

------------------------------------------------------------------------

## 🧠 Future Improvements

Ideas for next versions:

-   Categories or tags
-   Export / import bookmarks
-   Public shareable bookmark pages
-   User profiles
-   Analytics dashboard

------------------------------------------------------------------------

## 💡 Final Thought

BookmarkStack is built with real-world workflows in mind --- fluid,
realtime, and production-ready.\
It's clean enough for daily use and polished enough to show in your
portfolio.

------------------------------------------------------------------------

## 🧑‍💻 Author

**Sai Naman Gangiredla**\
Full-Stack Developer \| Problem Solver \| Curious Builder

------------------------------------------------------------------------

✨ Built with intent, deployed with confidence.

