# Nivesh Ventures — Feature Status

## VIDEO HERO SECTION (ENHANCED ✓)

### What Works
- **Frame Sync:** 5 keyframes, text updates per frame
- **Scroll Animation:** Smooth video scrubbing via GSAP ScrollTrigger
- **Liquid Glass UI:** Frosted glass effect (backdrop-blur-xl) with light palette
- **Progress Indicators:** 5 dots showing current frame
- **Text Animation:** Title + description fade/scale smoothly
- **Light Colors:** Cream background, light text, accent bronze buttons
- **Stats Sidebar:** 3 stats boxes (premium projects, investors, ROI)
- **Loading State:** Spinner while video metadata loads
- **8K Ready:** WebM format supports high-resolution video

### How It Works
1. User scrolls page
2. ScrollTrigger calculates progress (0–1)
3. Video currentTime = progress × duration
4. Active frame detected from 5 timestamps
5. Title + text swap instantly
6. Progress dots light up (active frame)
7. Liquid glass overlay opacity changes per frame

### Scroll Timeline
```
Frame 0 (0s):    "Luxury Awaits" → light glass, 40% opacity
Frame 1 (2.5s):  "Prime Locations" → light glass, 35% opacity
Frame 2 (5s):    "Modern Architecture" → light glass, 30% opacity
Frame 3 (7.5s):  "Investment Potential" → light glass, 35% opacity
Frame 4 (10s):   "Lifestyle Transformation" → light glass, 40% opacity
```

---

## PAGES

| Page | Status | Notes |
|------|--------|-------|
| Home | ✓ | Hero video, featured projects, CTA |
| Projects | ✓ | List + filters (type, status, search) |
| Project Detail | ✓ | Info, gallery, amenities, save/compare |
| Saved Projects | ✓ | localStorage array of slugs |
| Compare | ✓ | Side-by-side up to 3 projects |
| About | ✓ | Mission, vision, values |
| Services | ✓ | 6 service cards with icons |
| Why Invest | ✓ | Benefits + ROI info |
| News | ✓ | Article listing, detail pages |
| Contact | ✓ | Form → POST /api/enquiries |
| Privacy | ✓ | Static policy text |
| Terms | ✓ | Static terms text |
| Admin Login | ✓ | SHA256 auth, httpOnly cookie |
| Admin Dashboard | ✓ | Stats cards, project links |
| Admin Projects | ✓ | CRUD, publish toggle |
| Admin Enquiries | ✓ | Lead status, WhatsApp action |
| Admin News | ✓ | Publish articles |
| Admin Settings | ✓ | Site config form |
| 404 | ✓ | Not found page |

---

## COLORS (LIGHT THEME)

```
Background:     #FFFBF7 (cream)
Secondary BG:   #F5F1ED (ivory)
Dark Text:      #2D2D2D (text-dark)
Grey Text:      #6B6B6B (text-grey)
Accent:         #C5A572 (bronze)
Very Dark:      #1A1A1A (charcoal)
```

All backgrounds light (no dark theme). Text is dark on light backgrounds.

---

## ANIMATIONS

### Hero Video
- Scroll → video frame scrub (GSAP)
- Text fade in/out per frame
- Title scale + translate with scroll
- Progress dots slide + color change
- Liquid glass overlay opacity fade

### Page Transitions
- Fade in on mount
- Hover scale on buttons/cards
- Border color change on hover (text-grey → accent)

### Forms
- Input focus state (border → accent)
- Button hover (opacity + scale)
- Success message fade out after 5s

---

## FORMS

### Contact Form
```
✓ Full Name (required)
✓ Mobile Number (required)
✓ Email
✓ Property Type (dropdown)
✓ Budget Range (dropdown)
✓ Message
✓ Submit → POST /api/enquiries
```

### Admin Login
```
✓ Password field
✓ SHA256 hash validation
✓ 24h session (httpOnly cookie)
```

### Project Detail Enquiry
```
(embedded in project page)
✓ Name, Mobile, Email, Message
✓ Auto-fill projectId + name
```

---

## STORAGE

### localStorage
- **saved_projects:** JSON array of project slugs
- **compare_projects:** JSON array (max 3) of project slugs

### Cookies
- **admin_session:** httpOnly cookie (24h expiry)

---

## API ENDPOINTS

```
GET  /api/projects                    → list projects (filters: type, status, search)
GET  /api/projects/[slug]             → single project
POST /api/projects                    → create (admin)
PUT  /api/projects/[slug]             → update (admin)
DELETE /api/projects/[slug]           → delete (admin)

GET  /api/enquiries                   → list (admin)
POST /api/enquiries                   → create (public form)
GET  /api/enquiries/[id]              → single (admin)
PUT  /api/enquiries/[id]              → update status/notes (admin)

GET  /api/news                        → list published
POST /api/news                        → create (admin)

POST /api/admin/login                 → authenticate
POST /api/admin/logout                → clear session
```

All return JSON. Errors include `error` field.

---

## KNOWN ISSUES / TODO

- [ ] MongoDB connection required for API calls (not needed for static pages)
- [ ] Cloudinary integration not done (no image upload yet)
- [ ] Email notifications not implemented
- [ ] No push notifications (FCM setup pending)
- [ ] News/[slug] currently static (needs MongoDB fetch)
- [ ] No server-side admin route protection (need middleware)

---

## QUICK START

```bash
cd /home/claude/nivesh-ventures

# Dev
npm run dev          # → localhost:3000

# Build
npm run build        # → .next/ folder

# Production
npm run start        # → start production server
```

---

Status: Ready for testing + Vercel deployment
