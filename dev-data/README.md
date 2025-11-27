# Database Seeding Guide

This directory contains scripts to seed your database with demo data for client viewing and testing purposes.

## Demo Credentials

### Regular User Account

- **Email:** `demo@eventspark.com`
- **Password:** `Demo123!`

### Admin Account

- **Email:** `admin@eventspark.com`
- **Password:** `Admin123!`

## Additional Demo Users

The seeding script creates several demo users for realistic data:

- sarah.johnson@eventspark.com
- michael.chen@eventspark.com
- emma.williams@eventspark.com

All additional accounts use password: `Demo123!`

## Demo Events

The script creates **30 realistic events** across multiple categories:

### Categories Include:

- 🖥️ **Tech Events** - Conferences, workshops, startup events
- 🎵 **Music & Entertainment** - Concerts, festivals, showcases
- 🍽️ **Food & Culinary** - Tastings, festivals, cooking classes
- 🏃 **Sports & Fitness** - Marathons, yoga, tournaments
- 🎨 **Arts & Culture** - Exhibitions, theater, photography
- 💼 **Business & Networking** - Meetups, seminars, workshops
- 📚 **Education & Learning** - Classes, language exchange, bootcamps
- 🤝 **Community & Social** - Book clubs, volunteer events, pet adoption
- 🧘 **Wellness & Lifestyle** - Meditation, gardening, mental health

### Geographic Distribution:

Events are spread across major US cities including:

- San Francisco, CA
- New York, NY
- Chicago, IL
- Los Angeles, CA
- Boston, MA
- Seattle, WA
- Miami, FL
- Austin, TX
- Atlanta, GA

### Date Distribution:

Events are scheduled from 3 to 45 days in the future, providing a realistic timeline for testing.

## Usage

### Seed Database

```bash
npm run seed
```

This will:

1. Clear existing demo data (only users with @eventspark.com emails)
2. Create 5 demo users
3. Create 30 realistic events
4. Display a summary of created data

### Clear Demo Data

```bash
npm run seed:clear
```

This will remove all demo users and events from the database.

## Notes

- **Safe for Production**: The script only deletes users with `@eventspark.com` email addresses
- **Realistic Data**: All events have proper geolocation coordinates for testing location-based features
- **Future Dates**: All events are scheduled in the future for proper testing
- **Rich Descriptions**: Each event has detailed descriptions for better presentation

## Testing Features

Use this demo data to test:

- ✅ User authentication and authorization
- ✅ Event browsing and filtering
- ✅ Location-based event search
- ✅ Pagination functionality
- ✅ City-based filtering
- ✅ Date sorting
- ✅ User's own events vs. all events
- ✅ Admin vs. regular user permissions

## Troubleshooting

If seeding fails:

1. Ensure `DB_URI` is set in your `.env` file
2. Check database connection
3. Verify MongoDB is running
4. Check for any validation errors in console output
