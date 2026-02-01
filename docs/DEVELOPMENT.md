# Local Development Setup

This guide will help you set up the project on your local machine for development.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - We recommend [VS Code](https://code.visualstudio.com/)

## Installation Steps

### 1. Clone the Repository

```bash
# If from GitHub
git clone https://github.com/YOUR-USERNAME/my-ministry-organizer.git
cd my-ministry-organizer

# OR if you have the files locally
cd my-ministry-organizer
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js (React framework)
- Dexie.js (IndexedDB wrapper)
- Tailwind CSS (styling)
- Lucide React (icons)
- date-fns (date utilities)

### 3. Run Development Server

```bash
npm run dev
```

This starts the development server. You should see:

```
  ▲ Next.js 14.2.18
  - Local:        http://localhost:3000
  - Ready in 2.1s
```

### 4. Open in Browser

Visit http://localhost:3000

You should see the My Ministry Organizer app!

## Development Workflow

### Hot Reload

The development server has hot reload enabled. When you save changes to any file, the browser will automatically refresh.

### File Structure

```
my-ministry-organizer/
├── src/
│   ├── app/              # Pages
│   │   ├── layout.js     # Root layout
│   │   ├── page.js       # Home page (calendar)
│   │   └── settings/
│   │       └── page.js   # Settings page
│   ├── components/       # React components
│   │   ├── Calendar.js
│   │   ├── ProgressStats.js
│   │   └── TimeEntryModal.js
│   ├── lib/
│   │   ├── db.js        # Dexie database
│   │   └── utils.js     # Helper functions
│   └── styles/
│       └── globals.css
└── public/              # Static files
```

### Making Changes

1. **Edit Components**
   - Modify files in `src/components/`
   - Changes auto-reload in browser

2. **Edit Pages**
   - Modify files in `src/app/`
   - Changes auto-reload in browser

3. **Edit Database**
   - Modify `src/lib/db.js`
   - May need to clear IndexedDB in browser DevTools

4. **Edit Styles**
   - Global styles: `src/styles/globals.css`
   - Tailwind config: `tailwind.config.js`

## Useful Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Build and export as static site
npm run export

# Lint code
npm run lint
```

## Browser DevTools

### IndexedDB Inspection

To view the database:

1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Expand "IndexedDB"
4. Click "ministryOrganizerDB"
5. View tables: profiles, timeEntries, etc.

### Clear Database

If you need to reset the database:

1. Open DevTools → Application → IndexedDB
2. Right-click "ministryOrganizerDB"
3. Click "Delete database"
4. Refresh page

## Testing

### Manual Testing Checklist

- [ ] Calendar displays correctly
- [ ] Can add time entry
- [ ] Can edit existing entry
- [ ] Can delete entry
- [ ] Monthly totals calculate correctly
- [ ] Annual progress shows correctly
- [ ] Export data works
- [ ] Import data works
- [ ] Settings save correctly

### Test in Different Browsers

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)

## Common Issues

### Port 3000 Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Check for syntax errors
npm run lint

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Prettier** - Code formatting
- **ESLint** - Code linting

## Environment Setup (Optional)

Create `.env.local` if you need environment variables:

```bash
# Example (not needed for current version)
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Building for Production

### Test Production Build Locally

```bash
# Build
npm run build

# Preview
npm run start
```

### Export Static Site

```bash
# Export to `out/` directory
npm run export

# Test locally
npx serve out
```

## Database Schema Changes

If you modify the database schema in `src/lib/db.js`:

```javascript
// Increment version number
db.version(2).stores({
  // Updated schema
}).upgrade(tx => {
  // Migration code
});
```

## Git Workflow

```bash
# Check status
git status

# Create feature branch
git checkout -b feature/new-feature

# Add changes
git add .

# Commit
git commit -m "Add new feature"

# Push
git push origin feature/new-feature

# Merge to main
git checkout main
git merge feature/new-feature
```

## Getting Help

If you encounter issues:

1. Check browser console for errors (F12)
2. Check terminal for error messages
3. Review this documentation
4. Check GitHub issues
5. Create new issue with error details

## Next Steps

Once development environment is working:

1. Make your changes
2. Test thoroughly
3. Commit to Git
4. Push to GitHub
5. Deploy to Vercel

Happy coding! 🚀
