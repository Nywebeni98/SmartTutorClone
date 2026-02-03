# Deploying Be Smart Online Tutorials to Vercel

This guide explains how to deploy your tutoring website from GitHub to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (free tier works)
3. Your Supabase project credentials
4. Your Neon PostgreSQL database URL

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

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the Vite framework

## Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

### Required Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SESSION_SECRET` | A random string for session encryption |
| `RESEND_API_KEY` | Your Resend API key for emails |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Cloud API token |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token |
| `ZOOM_SDK_KEY` | Zoom SDK key |
| `ZOOM_SDK_SECRET` | Zoom SDK secret |
| `YOCO_SECRET_KEY` | Yoco payment secret key |

## Step 4: Configure Domain

1. In Vercel → Project Settings → Domains
2. Add your domain: `smarttutorclone.com`
3. Update DNS records at your domain registrar:
   - Add A record: `76.76.21.21`
   - Add CNAME for www: `cname.vercel-dns.com`

## Step 5: Update Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:
- Add `https://smarttutorclone.com` to Site URL
- Add to Redirect URLs:
  - `https://smarttutorclone.com`
  - `https://smarttutorclone.com/tutor-dashboard`
  - `https://smarttutorclone.com/reset-password`

## Important Notes

### Database
Your Neon PostgreSQL database will continue to work with Vercel. Just copy the same `DATABASE_URL` from Replit secrets.

### WhatsApp Webhook
After deploying, update your WhatsApp webhook URL in Meta Developer Portal:
- New URL: `https://smarttutorclone.com/api/whatsapp/webhook`

### Serverless Limitations
- API routes run as serverless functions (max 10 second execution by default)
- WebSocket connections are not supported on Vercel (chat feature may need adjustment)
- Scheduled tasks (reminders, cleanup) will need a separate service like Vercel Cron or external cron

## Files Created for Vercel

- `vercel.json` - Vercel configuration
- `vite.config.vercel.ts` - Vite config without Replit plugins
- `api/index.ts` - Serverless API handler

## Troubleshooting

### Build Errors
- Make sure all environment variables are set
- Check that `@vercel/node` types are available

### API Not Working
- Verify DATABASE_URL is correct
- Check Vercel function logs for errors

### Auth Not Working
- Confirm Supabase redirect URLs are updated
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
