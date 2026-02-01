# My Ministry Organizer App

A privacy-first field service organizer for Jehovah's Witness pioneers to track monthly hours, bible studies, and return visits.

## ✨ Features

- 📅 **Monthly Calendar View** - Visual tracking of daily service hours
- ⏱️ **Time Entry** - Quick entry for hours, bible studies, and return visits
- 📊 **Progress Tracking** - Real-time progress toward monthly and annual goals
- 🔒 **100% Private** - All data stored locally on your device
- 📴 **Offline First** - Works completely without internet
- 💾 **Export/Import** - Full control over your data with JSON backup
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## 🎯 Perfect For

- **Regular Pioneers** - Track toward 600 annual hour goal
- **Auxiliary Pioneers** - Flexible monthly hour tracking
- **Special Pioneers** - Customizable goals
- **Anyone** who wants to organize their ministry activity

## 🔐 Privacy First

- **No account needed** - Start using immediately
- **No cloud storage** - Data never leaves your device
- **No tracking** - Zero telemetry or analytics
- **Your data, your control** - Export anytime

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/my-ministry-organizer.git
   cd my-ministry-organizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📖 Usage

### Quick Start

1. **Enter Daily Hours**
   - Click on any day in the calendar
   - Enter hours worked
   - Add bible study and return visit counts
   - Click Save

2. **Track Progress**
   - View monthly total at the top
   - See annual progress bar
   - Monitor days active this month

3. **Backup Your Data**
   - Go to Settings
   - Click "Export Data"
   - Save the JSON file somewhere safe

4. **Restore Data**
   - Go to Settings
   - Click "Import Data"
   - Select your backup JSON file

### Tips

- **Decimal Hours**: Use 0.25 for 15min, 0.5 for 30min, 0.75 for 45min
- **Regular Backups**: Export your data monthly
- **Multiple Devices**: Export from one device, import to another

## 🏗️ Project Structure

```
my-ministry-organizer/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── layout.js     # Root layout
│   │   ├── page.js       # Home/calendar page
│   │   └── settings/     # Settings page
│   ├── components/       # React components
│   │   ├── Calendar.js   # Monthly calendar grid
│   │   ├── TimeEntry.js  # Time entry form
│   │   └── ProgressBar.js
│   ├── lib/
│   │   ├── db.js        # Dexie database setup
│   │   └── utils.js     # Helper functions
│   └── styles/
│       └── globals.css
├── public/              # Static assets
├── docs/                # Documentation
└── PROJECT_STATUS.md    # Development progress
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Database**: IndexedDB via Dexie.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Vercel (static export)

## 📦 Database Schema

### Tables

**profiles**
- Settings and preferences
- Annual goal (default: 600 hours)
- Pioneer type

**timeEntries**
- Date
- Hours worked
- Bible studies count
- Return visits count
- Notes

**bibleStudies** (optional detailed tracking)
- Student name
- Contact info
- Publication used
- Progress notes

**returnVisits** (optional detailed tracking)
- Contact name
- Address
- Next visit date
- Notes

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. **Connect to GitHub**
   - Push your code to GitHub
   - Import to Vercel

2. **Configure**
   - Vercel auto-detects Next.js
   - No additional config needed

3. **Deploy**
   - Automatic deployments on push

### Manual Static Export

```bash
npm run export
```

Then upload the `out/` directory to any static hosting.

## 🤝 Contributing

This is a personal/community project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with privacy and simplicity in mind for the Jehovah's Witness pioneer community.

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the docs/ folder for detailed guides

## 🗺️ Roadmap

- [x] Basic time tracking
- [x] Monthly calendar view
- [x] Export/import functionality
- [ ] Detailed bible study tracking
- [ ] Return visit database
- [ ] Charts and statistics
- [ ] Dark mode
- [ ] PWA (installable app)
- [ ] Print-friendly reports

---

**Version:** 1.0.0  
**Last Updated:** February 2026
