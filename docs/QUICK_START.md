# Quick Start Guide - My Ministry Organizer

## 🚀 Get Up and Running in 5 Minutes

### For First-Time Users

**You have the project files. Here's what to do next:**

### Step 1: Open Terminal/Command Prompt

- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Navigate to Project

```bash
cd path/to/my-ministry-organizer
```

Replace `path/to/` with where you saved the project.

### Step 3: Install Dependencies

```bash
npm install
```

Wait 1-2 minutes while packages download.

### Step 4: Start the App

```bash
npm run dev
```

### Step 5: Open in Browser

Visit: http://localhost:3000

**🎉 That's it! You're running the app!**

---

## 📱 Using the App

### Add Your First Entry

1. Click on today's date in the calendar
2. Enter your hours (use decimals: 2.5 = 2 hours 30 minutes)
3. Add bible studies count
4. Add return visits count
5. Click "Save"

### View Progress

Your progress bars update automatically:
- **Monthly**: Progress toward this month's goal
- **Annual**: Progress toward 600-hour goal

### Export Your Data (Backup)

1. Click "Settings" in the header
2. Click "Export Data"
3. Save the JSON file somewhere safe
4. Do this monthly!

### Import Data (Restore)

1. Go to Settings
2. Click "Import"
3. Select your backup JSON file
4. Your data is restored!

---

## ⚙️ Customizing Settings

### Change Your Annual Goal

1. Go to Settings
2. Update "Annual Hour Goal"
3. Click "Save Settings"

### Change Pioneer Type

1. Go to Settings
2. Select your pioneer type:
   - Regular Pioneer (600 hours)
   - Auxiliary Pioneer (custom)
   - Special Pioneer (custom)
3. Click "Save Settings"

---

## 🌐 Sharing with Others

### Option 1: Deploy to Vercel (Recommended)

**Why?** Free hosting, anyone can access via URL

1. Push code to GitHub (see `docs/GITHUB_SETUP.md`)
2. Connect GitHub to Vercel
3. Click Deploy
4. Share the URL: `yourapp.vercel.app`

**Privacy:** Each user gets their own isolated database on their device.

### Option 2: Share the Files

1. Zip the entire project folder
2. Share the zip file
3. Recipient follows Steps 1-5 above

---

## 🔒 Privacy & Data

### Where is my data stored?

- **On your device only** - in your browser's IndexedDB
- **Not in the cloud** - nothing sent to servers
- **Not shared** - completely private

### Can I access on multiple devices?

Not automatically. But you can:
1. Export data on Device 1
2. Import data on Device 2

### What if I clear my browser data?

Your ministry data will be deleted! Always:
- Export regularly (monthly recommended)
- Keep backup JSON files safe

---

## 🆘 Troubleshooting

### "npm: command not found"

**Problem:** Node.js not installed

**Solution:** Install Node.js from https://nodejs.org

### Port 3000 already in use

**Problem:** Another app using port 3000

**Solution:**
```bash
npm run dev -- -p 3001
```

Then visit: http://localhost:3001

### Database not working

**Problem:** IndexedDB disabled

**Solution:**
1. Check browser settings
2. Try different browser (Chrome, Firefox)
3. Disable private/incognito mode

### Changes not showing

**Problem:** Cache issue

**Solution:**
1. Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
2. Or restart dev server: `Ctrl + C`, then `npm run dev`

---

## 📚 Next Steps

### Learn More

- **Full Development Guide**: See `docs/DEVELOPMENT.md`
- **GitHub Setup**: See `docs/GITHUB_SETUP.md`
- **Project Overview**: See `PROJECT_SKILL.md`

### Customize the App

- Edit colors in `tailwind.config.js`
- Modify components in `src/components/`
- Add features in `src/lib/db.js`

### Get Help

- Check the documentation files
- Review the code comments
- Open an issue on GitHub

---

## ✅ Quick Checklist

**Setup Complete:**
- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] App opens in browser

**First Use:**
- [ ] Added first time entry
- [ ] Checked progress bars
- [ ] Exported data for backup
- [ ] Explored settings

**For Sharing:**
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Shared URL with others

---

## 💡 Pro Tips

1. **Bookmark the app** - Add to favorites for quick access
2. **Set monthly reminders** - Export data on 1st of each month
3. **Use keyboard shortcuts** - Tab through form fields quickly
4. **Check progress daily** - Stay motivated!
5. **Backup before updates** - Export before pulling new code

---

**Need Help?** Check the other documentation files in the `docs/` folder!

**Enjoying the app?** Consider starring the project on GitHub! ⭐
