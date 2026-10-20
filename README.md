# Portfolio template

A dark, animated personal portfolio and business site.

- **client/**: Next.js 16 (App Router, TypeScript, Tailwind v4), GSAP + ScrollTrigger + SplitText, Lenis smooth scroll, and a React Three Fiber 3D hero.
- **server/**: Express 5 + MongoDB (Mongoose) API for the contact form, with validation, rate limiting, optional email alerts and a small admin inbox API.

Fonts: **Clash Display** (headings, self-hosted in `client/src/app/fonts`), **DM Sans** (body) and **JetBrains Mono** (small details).

## Run it

```bash
npm run install:all      # installs root, client and server
npm run dev              # client on :3000, API on :5000
```

Then open http://localhost:3000.

## Fill in your details

Almost everything lives in **`client/src/content/site.ts`**:

| What | Key in `site.ts` |
| --- | --- |
| Name, role, location, availability | `name`, `role`, `location`, `availability` |
| Banner headline and buttons | `hero` |
| Preloader images | `hero.preloaderImages` |
| About text, portrait, quick facts | `about` |
| Numbers (projects, years…) | `stats` |
| What I offer | `services` |
| What I've built (cards + case-study pages) | `projects` |
| Work process timeline | `process` |
| Tech stack | `stack` |
| Experience and education | `experience`, `education` |
| Testimonials | `testimonials` |
| Email, phone, booking link, form options | `contact` |
| Social links | `socials` |

**Images:** replace the placeholder SVGs in `client/public/images/` with your own `.jpg`/`.webp` files and update the paths in `site.ts`.
**Resume:** put your PDF at `client/public/resume.pdf`.
**Colours:** change the tokens at the top of `client/src/app/globals.css` (`--accent` and friends).
**3D object:** `client/src/components/three/HeroScene.tsx`.

Each project gets its own page at `/projects/<slug>`, built from `site.projects`.

## Contact form and backend

Copy `server/.env.example` to `server/.env` and set:

- `MONGODB_URI`: a MongoDB Atlas or local connection string. Without it, messages are only logged (or emailed).
- `SMTP_*` / `NOTIFY_EMAIL`: optional. Emails you each enquiry. For Gmail use `smtp.gmail.com`, port 465 and an app password.
- `ADMIN_KEY`: protects the inbox endpoints.
- `CLIENT_ORIGIN`: your front-end URL(s), comma-separated, for CORS.

In `client/.env.local`, set `NEXT_PUBLIC_API_URL` to the API URL.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Status, including whether MongoDB is connected |
| `POST /api/contact` | Contact form (validated, 5 requests per 15 minutes per IP) |
| `GET /api/messages?status=new&page=1` | List enquiries (`x-admin-key` header) |
| `PATCH /api/messages/:id` | Set status: `new`, `read`, `replied` or `archived` |
| `DELETE /api/messages/:id` | Delete an enquiry |

## Deploy (Vercel + Render + MongoDB Atlas)

The repo is a monorepo: `client/` goes to **Vercel**, `server/` goes to **Render**.

### 1. Database: MongoDB Atlas (free)
1. Create a free M0 cluster at https://cloud.mongodb.com.
2. **Database Access** → add a user with a password.
3. **Network Access** → add `0.0.0.0/0` (Render's free tier has no fixed IP).
4. **Connect → Drivers** → copy the connection string and put a database name before the `?`, e.g.
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`

### 2. Backend: Render
1. https://dashboard.render.com → **New → Blueprint** → connect this GitHub repo. Render reads `render.yaml`.
2. Fill in when asked:
   - `MONGODB_URI`: the Atlas string from step 1
   - `CLIENT_ORIGIN`: leave as `http://localhost:3000` for now; you'll update it after step 3
   - `SMTP_*`: optional (Gmail: host `smtp.gmail.com`, an [app password](https://myaccount.google.com/apppasswords))
3. After the deploy, open `https://<your-service>.onrender.com/api/health`. You should see `{"ok":true,"db":true}`.

### 3. Frontend: Vercel
1. https://vercel.com/new → import this repo.
2. **Root Directory** → `client` (Framework: Next.js is detected automatically).
3. **Environment Variables** → `NEXT_PUBLIC_API_URL` = `https://<your-service>.onrender.com`
4. Deploy. Your site URL fills in automatically for link previews.

### 4. Connect the two
In Render → your service → **Environment**, set
`CLIENT_ORIGIN` = `https://<your-site>.vercel.app,https://<your-project>-*.vercel.app`
(the second entry allows Vercel preview deploys). Save; Render redeploys.

### Updating later
Push to `main` → Vercel and Render both redeploy automatically.

**Free-tier note:** Render's free service sleeps after 15 idle minutes and takes up to a minute to wake. The site pings the API on page load so it's usually awake by the time someone sends a message.

**Reading messages:** `GET https://<your-service>.onrender.com/api/messages` with header `x-admin-key: <ADMIN_KEY from Render's Environment tab>`, or browse the `messages` collection in Atlas.

## Motion notes

- The preloader plays once per browser session. To replay it, clear `sessionStorage`.
- All motion is turned off for visitors who set "reduce motion" in their OS.
- The cursor label appears on any element with `data-cursor="Text"`.
