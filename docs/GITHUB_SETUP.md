# GitHub Setup Guide

This guide will walk you through setting up the project on GitHub and deploying it to Vercel.

## Prerequisites

- Git installed on your computer
- GitHub account
- Node.js 18+ installed

## Step 1: Initialize Git Repository

```bash
cd my-ministry-organizer
git init
git add .
git commit -m "Initial commit: My Ministry Organizer App"
```

## Step 2: Create GitHub Repository

1. **Go to GitHub**
   - Visit https://github.com
   - Log in to your account

2. **Create New Repository**
   - Click the "+" icon in top right
   - Select "New repository"

3. **Repository Settings**
   - Name: `my-ministry-organizer`
   - Description: `Field service organizer for pioneers - privacy-first time tracking`
   - Visibility: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

4. **Create Repository**
   - Click "Create repository"

## Step 3: Connect Local to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/my-ministry-organizer.git

# Set main as default branch
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all project files uploaded

## Step 5: Deploy to Vercel (Optional but Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/login with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Find and select `my-ministry-organizer`

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: (leave default)
   - Output Directory: (leave default)

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for deployment

5. **Access Your App**
   - You'll get a URL like: `my-ministry-organizer.vercel.app`
   - Share this URL with others!

## Step 6: Future Updates

When you make changes:

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push

# Vercel will auto-deploy the changes!
```

## Troubleshooting

### Can't push to GitHub?

**Problem:** Authentication error

**Solution:**
1. Use personal access token instead of password
2. Go to GitHub → Settings → Developer settings → Personal access tokens
3. Generate new token with "repo" permissions
4. Use token as password when pushing

### Build fails on Vercel?

**Problem:** Build errors

**Solution:**
1. Check Vercel build logs
2. Make sure all dependencies are in package.json
3. Verify Next.js config is correct
4. Try building locally first: `npm run build`

### Want to use custom domain?

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## Next Steps

- ✅ Code is on GitHub (version controlled)
- ✅ App is deployed on Vercel (accessible to everyone)
- ✅ Automatic deployments set up (push to update)

Now you can share the Vercel URL with other pioneers who want to use the app!

## Privacy Note

Since this is a static site with client-side storage:
- Users' data stays on their own devices
- No server-side database needed
- Each user has their own isolated data
- Perfect for privacy!
