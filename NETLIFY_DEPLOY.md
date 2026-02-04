# Deploying Be Smart Online Tutorials to Netlify

This guide explains how to deploy your tutoring website from GitHub to Netlify.

## Prerequisites

1. A GitHub account
2. A Netlify account (free tier works)
3. Your Supabase project credentials

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

## Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command:** `vite build --config vite.config.netlify.ts`
   - **Publish directory:** `dist`

## Step 3: Configure Environment Variables

In Netlify → Site Settings → Environment Variables, add:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Step 4: Configure Domain

1. In Netlify → Domain Settings
2. Add your custom domain: `smarttutorclone.com`
3. Update DNS records at your domain registrar:
   - Add CNAME: point to your Netlify site URL

## Step 5: Update Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:
- Add `https://smarttutorclone.com` to Site URL
- Add to Redirect URLs:
  - `https://smarttutorclone.com`
  - `https://smarttutorclone.com/tutor-dashboard`
  - `https://smarttutorclone.com/reset-password`

## Important: Frontend-Only Deployment

**Note:** Netlify deploys static sites only. This means:

- ✅ Frontend React app works
- ✅ Supabase authentication works (client-side)
- ❌ Backend API routes (Express) won't work on Netlify
- ❌ Database operations from server won't work

### For Full-Stack Features

If you need the backend API (database operations, WhatsApp webhooks, etc.), you have two options:

1. **Keep Replit running** as your backend, update frontend API calls to point to Replit URL
2. **Use Netlify Functions** to recreate critical API endpoints

## Files Created for Netlify

- `netlify.toml` - Netlify build configuration
- `vite.config.netlify.ts` - Vite config with `base: "/"` for Netlify

## Build Output Structure

After build, Netlify expects:
```
dist/
 ├── index.html   ✅
 ├── assets/
 └── ...
```

This is configured correctly in `vite.config.netlify.ts`.

## Troubleshooting

### Blank Page
- Verify `base: "/"` is set in vite.config.netlify.ts
- Check that index.html is at dist root

### 404 on Refresh
- Ensure the `[[redirects]]` rule is in netlify.toml
- This handles client-side routing

### Auth Not Working
- Confirm Supabase redirect URLs are updated
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Netlify
