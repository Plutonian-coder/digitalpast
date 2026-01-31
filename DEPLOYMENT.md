# Vercel Deployment Guide - Digital Past Question Platform

## 🚀 Pre-Deployment Checklist

Before deploying to Vercel, ensure you've completed these steps:

### 1. Database Setup ✅
- [ ] Run migration scripts in Supabase (`001_initial_schema.sql`)
- [ ] Run seed data script (`002_seed_data.sql`)
- [ ] Verify all tables are created
- [ ] Create `questions` storage bucket
- [ ] Configure storage policies

### 2. Environment Variables ✅
You'll need these from your Supabase project:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 3. Admin User ✅
- [ ] Create at least one admin user
- [ ] Update user role to 'admin' in database

---

## 📦 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Digital Past Platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/digitalpast.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```
   - Apply to: Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Add environment variables when prompted

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)
1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

### 2. Verify Deployment
Test these critical features:
- [ ] User signup/login works
- [ ] Admin can access `/admin/upload`
- [ ] File uploads work (check Supabase storage)
- [ ] Browse page loads questions
- [ ] Download tracking works
- [ ] Save/unsave functionality works
- [ ] History page displays downloads

### 3. Performance Optimization
Vercel automatically provides:
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions

---

## 🔐 Security Checklist

Before going live:
- [ ] Verify RLS policies are enabled in Supabase
- [ ] Test admin-only routes are protected
- [ ] Ensure storage bucket policies are correct
- [ ] Review environment variables (no secrets exposed)
- [ ] Enable email verification in Supabase Auth (optional)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)
- Go to project → Analytics
- View page views, performance metrics
- Monitor Web Vitals

### Supabase Monitoring
- Database usage
- Storage usage
- API requests
- Auth users

---

## 🐛 Troubleshooting

### Build Fails
**Issue**: Build fails on Vercel
**Solution**: 
- Check build logs for errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Environment Variables Not Working
**Issue**: App can't connect to Supabase
**Solution**:
- Verify env vars are set in Vercel dashboard
- Redeploy after adding env vars
- Check variable names match exactly (case-sensitive)

### 404 on Routes
**Issue**: Pages return 404
**Solution**:
- Ensure you're using Next.js App Router (not Pages Router)
- Check file structure in `src/app/`
- Redeploy

### Storage Upload Fails
**Issue**: File uploads don't work in production
**Solution**:
- Verify storage bucket is public
- Check storage policies allow uploads
- Ensure CORS is configured in Supabase

---

## 📝 Deployment Commands Reference

```bash
# Install dependencies
npm install

# Build for production (test locally)
npm run build

# Start production server locally
npm start

# Deploy to Vercel (preview)
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls
```

---

## 🎯 Production Checklist

Before announcing to users:
- [ ] All features tested in production
- [ ] Admin account created and tested
- [ ] Sample questions uploaded
- [ ] Mobile responsiveness verified
- [ ] Performance tested (Lighthouse score)
- [ ] Error handling works
- [ ] Email notifications configured (if applicable)
- [ ] Backup strategy in place (Supabase handles this)

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch auto-deploys to production
- Pull requests create preview deployments
- Rollback to previous deployment anytime in Vercel dashboard

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Support**: support@vercel.com

---

## ✅ Quick Start Commands

```bash
# 1. Ensure code is ready
npm run build

# 2. Initialize git (if not done)
git init
git add .
git commit -m "Ready for deployment"

# 3. Push to GitHub
git remote add origin YOUR_REPO_URL
git push -u origin main

# 4. Deploy via Vercel dashboard or CLI
vercel --prod
```

---

**Deployment Date**: January 31, 2026  
**Platform**: Vercel  
**Framework**: Next.js 16.1.4  
**Database**: Supabase PostgreSQL  
**Estimated Deploy Time**: 2-3 minutes
