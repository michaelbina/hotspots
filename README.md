# 🔥 Global Hotspots

An interactive world map visualizing ongoing conflicts, wars, and global hotspots in real-time.

![Screenshot](screenshot.png)

## Features

- 🗺️ **Interactive Map** - Zoomable, draggable world map with dark theme
- 🔥 **Heat Map Layer** - Visual intensity overlay showing conflict concentration
- 📍 **Conflict Markers** - Clickable markers with detailed information
- 📊 **Statistics Panel** - Real-time stats on casualties, displacement, and severity
- 🎯 **Severity Ranking** - Conflicts ranked 1-10 based on impact
- 🔄 **Auto-refresh** - Data updates automatically (future: live news integration)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Map**: Leaflet + leaflet.heat
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Data Sources

Currently using curated conflict data. Future integration planned with:

- **GDELT** - Global Database of Events, Language, and Tone
- **ACLED** - Armed Conflict Location & Event Data
- **NewsAPI** - Aggregated news from 80,000+ sources
- **RSS Feeds** - Major news outlets

## Conflict Severity Scale

| Score | Level | Description |
|-------|-------|-------------|
| 9-10 | Critical | Active large-scale war, mass casualties |
| 7-8 | High | Intense fighting, significant casualties |
| 5-6 | Medium | Regular violence, localized conflict |
| 3-4 | Low | Sporadic incidents, tensions |
| 1-2 | Minimal | Low-level unrest, protests |

## API Routes

- `GET /api/conflicts` - Returns all conflicts with heatmap data

## Future Roadmap

- [ ] Live news aggregation
- [ ] AI-powered severity scoring
- [ ] Timeline slider (historical view)
- [ ] Conflict prediction model
- [ ] Push notifications for escalations
- [ ] Mobile app

## Disclaimer

This application is for informational purposes only. Data is compiled from public sources and may not reflect the most current situation. Casualty figures are estimates and subject to significant uncertainty.

## License

MIT
