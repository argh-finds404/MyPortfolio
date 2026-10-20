/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — this is the only file you need to edit.
 *  Every section of the portfolio reads from here.
 *  Images live in /client/public/images — replace the placeholder
 *  SVGs with your own .jpg/.png/.webp and update the paths below.
 * ─────────────────────────────────────────────────────────────
 */

const GITHUB = "https://github.com/argh-finds404";

export const site = {
  /* ── Identity ─────────────────────────────────────────── */
  name: "Shoumik",
  shortName: "Shoumik", // shown as the logo, followed by a dot
  initials: "S",
  role: "CSE Student & Full-Stack Developer",
  location: "Rajshahi · Jashore, Bangladesh",
  timezone: "Asia/Dhaka", // IANA name, used for the live local-time clock
  // Live address. On Vercel this fills itself in; set NEXT_PUBLIC_SITE_URL once you add a custom domain.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  // Put your CV at /client/public/resume.pdf and set this to "/resume.pdf". Empty hides the button.
  resume: "",
  availability: {
    open: true,
    label: "Open to internships",
    note: "Seeking internships and entry-level software engineering roles where I can contribute to production code, learn from experienced engineers and grow with a team that values ownership.",
  },

  seo: {
    title: "Shoumik — CSE Student & Full-Stack Developer",
    description:
      "Third-year CSE student at RUET. I build full-stack web apps that solve everyday problems, with React, Node.js and MongoDB, and I document them properly.",
  },

  /* ── Hero / banner ───────────────────────────────────── */
  hero: {
    // Small editorial labels across the top of the banner
    meta: { folio: "S. — Portfolio", volume: "v2.0", issue: "RUET CSE '22" },
    // Neon ticker in the banner badge
    booking: ["Open to internships", "Open to junior roles", "Replies within 24h"],
    // Each string is one line of the giant headline (keep them short)
    headline: ["Student.", "Developer.", "Builder."],
    // The line under the headline cycles through these with a decode effect
    roles: ["Full-stack developer", "CSE student @ RUET", "React & Node.js dev", "Problem solver"],
    intro:
      "I'm Shoumik, a third-year CSE student at RUET. I build web apps that solve real, everyday problems, and I document them so the next person doesn't have to guess.",
    primaryCta: { label: "See my projects", href: "#work" },
    secondaryCta: { label: "Get in touch", href: "#contact" },
    // The floating terminal types these commands on a loop
    terminal: [
      { cmd: "whoami", out: "shoumik — CSE @ RUET, full-stack dev" },
      { cmd: "cat stack.txt", out: "react  node  express  mongodb  firebase" },
      { cmd: "npm run build", out: "✓ Compiled successfully in 2.1s" },
      { cmd: "git push origin main", out: "→ deployed to production" },
    ],
    // Logos floating around the circuit (names must exist in content/icons.ts)
    floatingTech: ["React", "Node.js", "MongoDB", "Express", "Firebase"],
    // Images flashed by the intro preloader (add 6–10 for the best effect)
    preloaderImages: [
      "/images/projects/civicnest-1.jpg",
      "/images/projects/hero-io-1.jpg",
      "/images/projects/toytopia-1.jpg",
      "/images/projects/joruri-seba-1.jpg",
      "/images/projects/green-earth-1.jpg",
      "/images/projects/civicnest-2.jpg",
    ],
  },

  /* ── Then / now story (scroll-driven) ────────────────── */
  beforeAfter: {
    before: {
      title: "Then",
      caption: "Vibe coding: prompt, paste, pray",
      tags: ["Blind prompts", "Copy-paste", "No idea why"],
      cost: "It works. Nobody knows why.",
      terminal: {
        title: "bash — npm run dev",
        lines: [
          "TypeError: Cannot read properties of undefined (reading 'map')",
          "Error: Hydration failed because the server rendered HTML didn't match",
          "Warning: 14 more errors the AI also can't explain",
        ],
      },
      tabs: {
        title: "AI chat",
        count: 23,
        countLabel: "prompts today",
        items: ["fix this error pls", "still not working", "just make it work, no explanation"],
      },
      checklist: { title: "TODO: ship it", items: ["Prompt the AI", "Paste the code", "Pray", "Understand it?"] },
      files: { title: "~/projects", items: ["app-final", "app-final-fixed", "app-final-fixed-AI-v3", "dont-touch"] },
    },
    after: {
      title: "Now",
      caption: "AI as a tool, not a crutch",
      tags: ["Understand", "Debug", "Ship"],
      appName: "dev.shoumik — workflow",
      nav: ["Plan", "Prompt", "Review", "Debug", "Ship", "Docs"],
      kpis: [
        { label: "Projects shipped", value: "9+", delta: "all understood" },
        { label: "Workflow", value: "Plan first", delta: "then prompt" },
        { label: "Debugging", value: "Root cause", delta: "not trial & error" },
      ],
      chartLabel: "Understanding, over time",
      feed: [
        "Wrote the plan and data model before the first prompt",
        "Reverse-engineered a bug from the stack trace, not guesswork",
        "Reviewed every AI suggestion, kept what I could explain",
      ],
    },
  },

  /* ── Scrolling ticker under the hero ─────────────────── */
  marquee: ["React", "Node.js", "Express", "MongoDB", "Firebase", "Tailwind CSS", "JavaScript", "Notion"],

  /* ── About ───────────────────────────────────────────── */
  about: {
    portrait: "/images/me.jpg",
    statement:
      "I build apps for real problems, the everyday kind that annoy actual people. I care about the logic under the hood, the details that make an app feel finished, and the notes that explain it all afterwards.",
    paragraphs: [
      "I'm in my third year of CSE at RUET, currently surviving the 6th semester, and a member of the RUET Computing Club. Funny thing: I didn't write a single line of code before university. Then came the inter-university contests, the bugs started taking it personally, and somewhere between a wrong answer on test 7 and a 2 a.m. fix, I was hooked.",
      "These days I build apps that fix ordinary problems for ordinary people, the kind someone actually opens twice. I use AI every day and love wiring it into products, but I read what it writes and can explain every line I ship. I also keep notes and docs for nearly everything, so future me, and my teammates, know why things work, not just that they do.",
    ],
    facts: [
      { label: "Studying", value: "CSE, RUET · 3rd yr" },
      { label: "Based in", value: "Rajshahi, BD" },
      { label: "Focus", value: "Frontend & MERN" },
      { label: "Looking for", value: "Frontend & junior roles" },
    ],
  },

  /* ── Numbers (use `decimals` for values like a CGPA) ─── */
  stats: [
    { value: 9, suffix: "+", label: "Projects built", decimals: 0 },
    { value: 13, suffix: "", label: "Public repositories", decimals: 0 },
    { value: 7, suffix: "", label: "Live deployments", decimals: 0 },
    { value: 25, suffix: "+", label: "Technologies used", decimals: 0 },
  ],

  /* ── What I do ───────────────────────────────────────── */
  services: [
    {
      title: "Full-stack web apps",
      text: "MERN apps with authentication, roles, payments and real-time updates, from the database schema to the deploy.",
      tags: ["React", "Express", "MongoDB"],
    },
    {
      title: "Frontend development",
      text: "Responsive, accessible interfaces that feel quick, with motion that helps instead of showing off.",
      tags: ["React", "Tailwind", "Framer Motion"],
    },
    {
      title: "AI integration",
      text: "Adding AI where it actually saves time, like drafting reports or answering questions, and keeping it reliable.",
      tags: ["Gemini", "Prompt design", "APIs"],
    },
    {
      title: "Documentation & analytics",
      text: "Clear READMEs, setup guides and technical notes, plus making sense of data with sheets, charts and dashboards.",
      tags: ["Notion", "Markdown", "Sheets"],
    },
    {
      title: "Problem solving",
      text: "Competitive programming in C++ with the RUET Computing Club, and a solid grounding in data structures and algorithms.",
      tags: ["DSA", "C++", "Contests"],
    },
  ],

  /* ── Projects / what I have built ───────────────────── */
  projects: [
    {
      slug: "civicnest",
      title: "CivicNest",
      category: "Full-stack civic platform",
      year: "2026",
      role: "Full-stack developer",
      cover: "/images/projects/civicnest-1.jpg",
      summary:
        "A community portal where residents report street problems, follow each report as a ticket, join cleanup drives and fund local causes.",
      stack: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Firebase", "Stripe", "Gemini"],
      live: "https://civic-nest-client.vercel.app",
      repo: `${GITHUB}/CivicNest-Client`,
      metrics: [
        { value: "4", label: "User roles, guest to admin" },
        { value: "Live", label: "Ticket updates over Socket.io" },
        { value: "AI", label: "CivicBot drafts reports with Gemini" },
      ],
      problem:
        "Neighbourhood problems like garbage piles, broken roads and waterlogging get posted in scattered Facebook groups and then forgotten. Nobody can see what was reported, who is handling it, or whether it was ever fixed.",
      solution:
        "A React client and an Express 5 API on MongoDB (server repo: CivicNest-Server). Every report becomes a ticket with a code, a priority and a deadline. Staff work a ticket desk while residents follow progress live through Socket.io. Firebase handles sign-in with role-based access, Stripe and SSLCommerz take donations, Leaflet maps the reports, and a Gemini-powered CivicBot helps people write clear reports and formal complaint letters.",
      outcome:
        "Deployed on Vercel with one-click demo accounts for each role. The trickiest part was keeping the client's route guards in step with the server's permission checks, so the interface never shows a page the API would refuse.",
      gallery: ["/images/projects/civicnest-1.jpg", "/images/projects/civicnest-2.jpg"],
    },
    {
      slug: "hero-io",
      title: "HERO.IO",
      category: "App store & analytics dashboard",
      year: "2026",
      role: "Frontend developer",
      cover: "/images/projects/hero-io-1.jpg",
      summary:
        "A glassmorphic app catalog where people browse, search, install and rate apps, with an analytics view of the whole catalog.",
      stack: ["React", "React Router", "Tailwind CSS", "DaisyUI", "Recharts"],
      live: "https://beautiful-florentine-1c869d.netlify.app/",
      repo: `${GITHUB}/hero.io-app-store`,
      metrics: [
        { value: "React 19", label: "With React Router v7" },
        { value: "Charts", label: "Catalog analytics in Recharts" },
        { value: "Local", label: "Installs saved in the browser" },
      ],
      problem: "App listings are only useful if people can find, compare and trust what they're installing.",
      solution:
        "A React 19 client with search and filtering, local install and uninstall, dynamic ratings, a publish-your-own-app form and a metrics dashboard built with Recharts.",
      outcome: "Deployed on Netlify. A good exercise in state management and keeping a data-heavy UI fast and readable.",
      gallery: ["/images/projects/hero-io-1.jpg", "/images/projects/hero-io-2.jpg"],
    },
    {
      slug: "toytopia",
      title: "ToyTopia",
      category: "E-commerce for kids' toys",
      year: "2026",
      role: "Full-stack developer",
      cover: "/images/projects/toytopia-1.jpg",
      summary: "A playful toy shop where parents browse by category, sign in with Google and keep a wishlist.",
      stack: ["React", "Tailwind CSS", "Framer Motion", "Firebase"],
      live: "https://effortless-hotteok-a48bc3.netlify.app/",
      repo: `${GITHUB}/ToyTopia-toy-store`,
      metrics: [
        { value: "Google", label: "And email sign-in via Firebase" },
        { value: "Wishlist", label: "Saved per user" },
        { value: "100%", label: "Responsive" },
      ],
      problem: "Shopping for toys online is cluttered, and parents just want to find something good quickly.",
      solution:
        "A React app with Firebase authentication (email and Google), protected routes, a wishlist and smooth Framer Motion transitions.",
      outcome: "Deployed on Netlify. My first project with real authentication flows and private routes.",
      gallery: ["/images/projects/toytopia-1.jpg", "/images/projects/toytopia-2.jpg"],
    },
    {
      slug: "joruri-seba",
      title: "Joruri Seba",
      category: "Emergency helpline directory",
      year: "2026",
      role: "Frontend developer",
      cover: "/images/projects/joruri-seba-1.jpg",
      summary: "Bangladesh's national emergency helplines in one place: police, fire, ambulance and more, one tap away.",
      stack: ["HTML", "Tailwind CSS", "DaisyUI", "JavaScript"],
      live: "https://stirring-sprite-ea95a1.netlify.app/",
      repo: `${GITHUB}/Joruri-seba-emergency-hotline`,
      metrics: [
        { value: "9", label: "National helplines" },
        { value: "1 tap", label: "To call or copy a number" },
        { value: "Log", label: "Call history kept" },
      ],
      problem: "In an emergency nobody wants to search for the right number.",
      solution:
        "A directory of nine helplines with one-tap calling, number copying, favourites and a call history, built with vanilla JavaScript.",
      outcome: "Small, fast and genuinely useful: no framework, no build step.",
      gallery: ["/images/projects/joruri-seba-1.jpg", "/images/projects/joruri-seba-2.jpg"],
    },
    {
      slug: "green-earth",
      title: "Green Earth",
      category: "Tree store & donations",
      year: "2026",
      role: "Frontend developer",
      cover: "/images/projects/green-earth-1.jpg",
      summary: "A tree plantation store with live data from an API, category filters, a cart and a donation form.",
      stack: ["HTML", "Tailwind CSS", "DaisyUI", "JavaScript"],
      live: "https://tree-selling-store-06.netlify.app/",
      repo: `${GITHUB}/green-earth-tree-store`,
      metrics: [
        { value: "Live API", label: "Real tree data" },
        { value: "Cart", label: "With a running total" },
        { value: "0", label: "Frameworks or build tools" },
      ],
      problem: "An environmental campaign needed a simple way for people to buy or donate trees.",
      solution: "Fetches tree data from a live API, with category filtering, a detail modal, a cart and a donation form.",
      outcome: "Taught me async JavaScript and loading states properly, without a framework to lean on.",
      gallery: ["/images/projects/green-earth-1.jpg"],
    },
  ],

  /* ── How I build (progress timeline; icon: search | plan | code | check | deploy) ── */
  process: [
    {
      title: "Understand the problem",
      duration: "Research",
      icon: "search",
      text: "Who is it for, what annoys them today, and what does done look like? I write that down before anything else.",
    },
    {
      title: "Plan & design",
      duration: "Docs",
      icon: "plan",
      text: "Data model, routes and screens on paper first. A plan makes every prompt and every commit sharper.",
    },
    {
      title: "Build with AI, carefully",
      duration: "Code",
      icon: "code",
      text: "AI speeds up the typing; I own the thinking. I review what it writes, keep what I can explain, and rewrite the rest.",
    },
    {
      title: "Debug & test",
      duration: "Verify",
      icon: "check",
      text: "Find the root cause, not a workaround. Then check it on real devices and fix what's slow.",
    },
    {
      title: "Ship & document",
      duration: "Deploy",
      icon: "deploy",
      text: "Deploy to a live link, then write the README and notes so anyone can run it and understand it.",
    },
  ],

  /* ── Skills (logos come from content/icons.ts by name) ── */
  stack: [
    {
      group: "Frontend",
      blurb: "Interfaces that feel fast and look sharp",
      items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "React Router", "Tailwind CSS", "DaisyUI", "Framer Motion", "GSAP", "Bootstrap"],
    },
    {
      group: "Backend",
      blurb: "APIs, auth, payments and real-time",
      items: ["Node.js", "Express", "JWT", "Socket.io", "Stripe", "REST APIs"],
    },
    {
      group: "Databases",
      blurb: "Modelling and storing data",
      items: ["MongoDB", "Mongoose", "Prisma", "Firebase", "MySQL"],
    },
    {
      group: "Tools",
      blurb: "Everyday workflow",
      items: ["Git", "GitHub", "Figma", "Postman", "Vercel", "npm", "Vite", "Linux"],
    },
    {
      group: "Languages & CS",
      blurb: "Foundations from RUET and contests",
      items: ["C", "C++", "Python", "Java", "Data Structures", "Algorithms"],
    },
    {
      group: "Docs & analytics",
      blurb: "Notes, documentation and data",
      items: ["Notion", "Markdown", "Obsidian", "Google Sheets", "Jupyter", "Gemini"],
    },
  ],

  /* ── Currently learning (progress bars in the skills section, 0–100) ── */
  learning: [
    { name: "Next.js", progress: 70 },
    { name: "TypeScript", progress: 65 },
    { name: "Docker", progress: 40 },
    { name: "System design", progress: 35 },
  ],

  /* ── Experience ──────────────────────────────────────── */
  experience: [
    {
      company: "RUET Computing Club",
      role: "Member",
      type: "Club",
      period: "2023 — Present",
      points: [
        "Compete in inter-university programming contests with club teammates.",
        "Practise problem solving in C++ and help newer members get started.",
      ],
    },
    {
      company: "Independent projects",
      role: "Full-stack developer",
      type: "Projects",
      period: "2024 — Present",
      points: [
        "Built and deployed 9+ web apps, from vanilla JavaScript sites to a full MERN platform (CivicNest).",
        "Write a README and setup notes for every project, so anyone can run it in minutes.",
      ],
    },
  ],

  /* ── Education (minor: true shows a smaller, quieter row) ── */
  education: [
    {
      school: "Rajshahi University of Engineering & Technology (RUET)",
      degree: "B.Sc. in Computer Science & Engineering",
      period: "2023 — Present",
      note: "3rd year, 6th semester running · CGPA 3.65+",
      minor: false,
    },
    {
      school: "Govt. M.M. College, Jashore",
      degree: "HSC, Science",
      period: "2022",
      note: "GPA 5.00",
      minor: true,
    },
    {
      school: "Jashore Zilla School",
      degree: "SSC, Science",
      period: "2020",
      note: "GPA 5.00",
      minor: true,
    },
  ],

  /* ── Testimonials ────────────────────────────────────────
   *  Only publish words a person actually said or approved.
   *  `approved: false` quotes appear on your local preview with a
   *  "Draft" badge and are hidden on the live site. Send the draft
   *  to the person, paste their exact reply, then set approved: true.
   */
  testimonials: [
    {
      quote:
        "A sincere, hardworking student who asks good questions and follows them up with real work. His practical mindset and clear documentation stand out.",
      name: "Dr. Md. Shahiduzzaman",
      role: "Professor & Head, Department of CSE, RUET",
      avatar: "",
      approved: false,
    },
    {
      quote: "Answers are borrowed; what you build with curiosity is yours.",
      name: "Mohammad Kaykobad, PhD",
      role: "Distinguished Professor, Dept. of CSE · at The Infinity AI BuildFest 2026, BRAC University",
      avatar: "",
      approved: false,
    },
  ],

  /* ── Contact ─────────────────────────────────────────── */
  contact: {
    email: "orghodutta@gmail.com",
    phone: "+880 1304-305261",
    whatsapp: "https://wa.me/8801304305261",
    projectTypes: ["Internship", "Junior role", "Freelance project", "Collaboration", "Just saying hi"],
    // Options for the second dropdown in the form (label set in sections.contact.secondLabel)
    budgets: ["Recruiter", "Founder / client", "Developer", "Student", "Other"],
  },

  // icon: "github" | "discord" | "x" | "facebook" | "whatsapp" | "email"
  // To add X later: { label: "X", icon: "x", href: "https://x.com/<handle>", handle: "@<handle>" },
  // Use `copy` instead of `href` to copy text on click (Discord has no public profile URL by username).
  socials: [
    { label: "GitHub", icon: "github", href: GITHUB, handle: "@argh-finds404" },
    { label: "Discord", icon: "discord", copy: "shou_mik_46", handle: "shou_mik_46" },
    { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/shoumik.hash240", handle: "shoumik.hash240" },
    { label: "WhatsApp", icon: "whatsapp", href: "https://wa.me/8801304305261", handle: "+880 1304-305261" },
    { label: "Email", icon: "email", href: "mailto:orghodutta@gmail.com", handle: "orghodutta@gmail.com" },
  ] as { label: string; icon: string; href?: string; copy?: string; handle: string }[],

  nav: [
    { label: "Projects", href: "/#work" },
    { label: "Skills", href: "/#stack" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],

  /* ── Section headings & small copy ───────────────────── */
  sections: {
    about: { label: "About me" },
    services: {
      title: "What I bring",
      intro: "Code, yes. But also the planning, the debugging and the documentation that make code worth keeping.",
    },
    work: {
      title: "Things I've built",
      intro: "Live projects from my GitHub. Open any project for the full story, the stack and the links.",
      endCard: { label: "All repos on GitHub", href: `${GITHUB}?tab=repositories` },
    },
    process: {
      title: "How I build",
      intro: "AI is in my toolbox, not in the driver's seat. This is the loop I follow on every project.",
    },
    stack: {
      title: "Skills & tools",
      intro: "What I use day to day, including the unglamorous but essential parts: docs, notes and data.",
    },
    journey: { title: "Education & experience" },
    testimonials: { title: "Kind words" },
    contact: {
      title: "Let's build something together",
      intro:
        "I'm looking for internships and junior roles where the work actually matters and the learning curve is steep. Recruiters, founders and fellow developers are all welcome. I reply within a day.",
      typeLabel: "What's this about?",
      secondLabel: "I am a…",
      messagePlaceholder: "Tell me about the role, project or idea.",
      sent: "Message sent. I'll get back to you within a day.",
    },
    footer: {
      servicesTitle: "What I do",
      note: "Open to internships and junior roles.",
      cta: ["Got an idea?", "Let's talk."],
      ctaButton: "Say hello",
    },
  },
};

export type Project = (typeof site.projects)[number];
