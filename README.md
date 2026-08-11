# RGM Site — Cloudflare Pages + D1

## Project layout
```
public/         → the static site (deployed as-is)
public/admin/   → Admin Dashboard UI (/admin)
functions/api/  → serverless API routes & admin endpoints
schema.sql      → database tables + seed data
wrangler.toml   → Cloudflare config
```

## Admin Dashboard (`/admin`)

You can now manage all site content visually at `https://rgmmalawi.org/admin` (or `http://127.0.0.1:8788/admin` locally):
- **Add / Edit / Delete Crusades**
- **Attach Crusade Video Highlights**
- **Add / Edit / Delete Sermons**
- **Add / Edit / Delete Testimonies**
- **Add / Edit / Delete Charity Stories**

*Default Admin Password: `rgm2026` (You can set your custom `ADMIN_PASSWORD` variable in Cloudflare Pages Settings → Environment Variables).*


## One-time setup (Windows, PowerShell or CMD)

1. Install Node.js if you don't have it: https://nodejs.org (LTS version)

2. Install dependencies:
   ```
   npm install
   ```

3. Log into Cloudflare:
   ```
   npx wrangler login
   ```
   This opens a browser to authorize.

4. Create the D1 database:
   ```
   npx wrangler d1 create rgm_db
   ```
   This prints a `database_id`. Copy it into `wrangler.toml`, replacing
   `REPLACE_WITH_YOUR_D1_DATABASE_ID`.

5. Load the schema and seed data:
   ```
   npm run db:init
   ```
   (This loads it locally for `wrangler pages dev`. Once you're ready to go
   live, also run `npm run db:init:remote` to load it into the real
   production database.)

## Local development

```
npm run dev
```
This starts the site at `http://localhost:8788` with the API and database
running locally — nothing touches production.

## Deploying

```
npx wrangler pages project create rgm-site
npm run deploy
```
After the first deploy, go to the Cloudflare dashboard → Pages → rgm-site →
Settings → Functions → D1 database bindings, and bind `DB` to `rgm_db` (this
mirrors what's in `wrangler.toml`, but Pages currently also wants it set in
the dashboard for production).

## Adding a new crusade, sermon, or testimony

No file editing needed — insert directly into the database. Example, adding
a new crusade:

```
npx wrangler d1 execute rgm_db --remote --command "INSERT INTO crusades (slug, title, location, date_range, status, poster_url, description) VALUES ('mzuzu', 'Mzuzu Salvation Crusade', 'Mzuzu, Malawi', 'Dec 4-6, 2026', 'upcoming', '/posters/mzuzu-crusade.jpg', 'Three days of gospel outreach.')"
```

Add a highlight video to an existing crusade (replace 2 with the real
crusade id — check with `SELECT id, slug FROM crusades;`):

```
npx wrangler d1 execute rgm_db --remote --command "INSERT INTO crusade_media (crusade_id, type, youtube_url, title) VALUES (2, 'highlight', 'https://youtu.be/XXXXXXXXXXX', 'Crusade Highlights')"
```

Add a sermon:

```
npx wrangler d1 execute rgm_db --remote --command "INSERT INTO sermons (title, speaker, youtube_url) VALUES ('Faith That Moves Mountains', 'Apostle Mac Kawonga', 'https://youtu.be/XXXXXXXXXXX')"
```

Add a testimony (leave crusade_id NULL if it isn't tied to a specific
crusade):

```
npx wrangler d1 execute rgm_db --remote --command "INSERT INTO testimonies (title, youtube_url, crusade_id) VALUES ('A Testimony Title', 'https://youtu.be/XXXXXXXXXXX', NULL)"
```

Add a Charity Works story — video version:

```
npx wrangler d1 execute rgm_db --remote --command "INSERT INTO charity_stories (title, beneficiary_name, location, description, youtube_url) VALUES ('A Family Restored', 'Jane Banda', 'Mzuzu', 'Short description of what happened.', 'https://youtu.be/XXXXXXXXXXX')"
```

Add a Charity Works story — photo-only version (no video, just upload a
photo to `public/photos/` and reference it):

```
npx wrangler d1 execute rgm_db --remote --command "INSERT INTO charity_stories (title, beneficiary_name, location, description, photo_url) VALUES ('School Fees Paid', 'John Phiri', 'Rumphi', 'Short description of what happened.', '/photos/john-phiri.jpg')"
```

## Poster and photo images

Drop poster image files into `public/posters/`, named to match what's in the
`poster_url` column (e.g. `public/posters/vongo-crusade.jpg` for
`/posters/vongo-crusade.jpg`). Same idea for Charity Works photos — put them
in `public/photos/` and reference `/photos/filename.jpg` in `photo_url`.
Redeploy after adding new ones.

## Still needed

- `charity.html`'s giving panel has a placeholder where the actual
  mobile money / bank details for RGM Charity Works go — update the
  "Send Your Gift" block once you have those finalized.
