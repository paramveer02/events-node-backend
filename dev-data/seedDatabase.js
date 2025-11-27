import dotenv from "dotenv";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import User from "../models/User.js";

dotenv.config();

const uri = process.env.DB_URI;

// Demo users data
const demoUsers = [
  {
    name: "Demo User",
    email: "demo@eventspark.com",
    password: "Demo123!",
    role: "user",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@eventspark.com",
    password: "Demo123!",
    role: "user",
  },
  {
    name: "Michael Chen",
    email: "michael.chen@eventspark.com",
    password: "Demo123!",
    role: "user",
  },
  {
    name: "Emma Williams",
    email: "emma.williams@eventspark.com",
    password: "Demo123!",
    role: "user",
  },
  {
    name: "Admin Demo",
    email: "admin@eventspark.com",
    password: "Admin123!",
    role: "admin",
  },
];

// Realistic events data with various cities and future dates
const getEventsData = (users) => {
  const today = new Date();
  const getRandomUser = () => users[Math.floor(Math.random() * users.length)];

  return [
    // Tech Events
    {
      title: "Tech Summit 2025: AI & Future Technologies",
      description:
        "Join industry leaders and innovators for a full-day conference exploring the latest in AI, machine learning, and emerging technologies. Featuring keynote speakers from leading tech companies, interactive workshops, and networking opportunities.",
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      location: "Moscone Center, 747 Howard St, San Francisco, CA 94103",
      city: "san francisco",
      geo: {
        type: "Point",
        coordinates: [-122.4015, 37.7843],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Startup Pitch Night - Winter Edition",
      description:
        "Watch emerging startups pitch their innovative ideas to a panel of venture capitalists and angel investors. Network with entrepreneurs, investors, and tech enthusiasts. Open bar and appetizers provided.",
      date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days
      location: "WeWork, 575 5th Ave, New York, NY 10017",
      city: "new york",
      geo: {
        type: "Point",
        coordinates: [-73.9808, 40.7549],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Blockchain & Web3 Developer Workshop",
      description:
        "Hands-on workshop for developers interested in blockchain technology and Web3 development. Learn smart contract development, DeFi protocols, and NFT creation. Bring your laptop!",
      date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days
      location: "Innovation Hub, 1 Kendall Square, Cambridge, MA 02139",
      city: "boston",
      geo: {
        type: "Point",
        coordinates: [-71.0903, 42.3656],
      },
      organizer: getRandomUser()._id,
    },

    // Music & Entertainment
    {
      title: "Summer Jazz Festival",
      description:
        "Experience an unforgettable evening of smooth jazz under the stars. Featuring renowned local and international jazz artists. Food trucks and craft beverages available.",
      date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      location: "Millennium Park, 201 E Randolph St, Chicago, IL 60602",
      city: "chicago",
      geo: {
        type: "Point",
        coordinates: [-87.6226, 41.8826],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Indie Music Showcase: Rising Stars",
      description:
        "Discover the next big thing in indie music! Four up-and-coming bands performing original music. Intimate venue with great acoustics and full bar.",
      date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days
      location: "The Roxy Theatre, 9009 Sunset Blvd, West Hollywood, CA 90069",
      city: "los angeles",
      geo: {
        type: "Point",
        coordinates: [-118.3883, 34.0901],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Electronic Music Night: Deep House Sessions",
      description:
        "Late-night electronic music experience featuring top DJs spinning deep house and techno. State-of-the-art sound system and lighting. 21+ event.",
      date: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000), // 17 days
      location: "Berghain Club, 999 Club St, Miami, FL 33139",
      city: "miami",
      geo: {
        type: "Point",
        coordinates: [-80.1373, 25.7907],
      },
      organizer: getRandomUser()._id,
    },

    // Food & Culinary
    {
      title: "Farm-to-Table Dinner Experience",
      description:
        "Five-course tasting menu featuring locally sourced, seasonal ingredients. Meet the farmers and chefs behind your meal. Wine pairings included. Limited seating.",
      date: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days
      location:
        "Blue Hill at Stone Barns, 630 Bedford Rd, Pocantico Hills, NY 10591",
      city: "new york",
      geo: {
        type: "Point",
        coordinates: [-73.8321, 41.0959],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "International Food Festival",
      description:
        "Celebrate global cuisine with over 50 food vendors from around the world. Live cooking demonstrations, cultural performances, and family-friendly activities.",
      date: new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000), // 35 days
      location: "Pike Place Market, 85 Pike St, Seattle, WA 98101",
      city: "seattle",
      geo: {
        type: "Point",
        coordinates: [-122.3425, 47.6097],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Wine Tasting & Pairing Masterclass",
      description:
        "Expert sommelier guides you through premium wines from California's finest vineyards. Learn tasting techniques and food pairing principles. Light appetizers served.",
      date: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days
      location: "The Wine Room, 1 Embarcadero Center, San Francisco, CA 94111",
      city: "san francisco",
      geo: {
        type: "Point",
        coordinates: [-122.3964, 37.7955],
      },
      organizer: getRandomUser()._id,
    },

    // Sports & Fitness
    {
      title: "City Marathon 2025",
      description:
        "Annual marathon through the heart of the city. 5K, 10K, half marathon, and full marathon options available. Registration includes race bib, timing chip, and finisher medal.",
      date: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days
      location: "Grant Park, 337 E Randolph St, Chicago, IL 60601",
      city: "chicago",
      geo: {
        type: "Point",
        coordinates: [-87.6199, 41.8759],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Yoga in the Park: Sunrise Session",
      description:
        "Start your day with peaceful yoga practice in beautiful outdoor setting. All levels welcome. Bring your own mat or rent one on-site. Free event!",
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
      location: "Central Park, West Dr, New York, NY 10024",
      city: "new york",
      geo: {
        type: "Point",
        coordinates: [-73.9654, 40.7829],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Beach Volleyball Tournament",
      description:
        "Annual 2v2 beach volleyball tournament. Competitive and recreational divisions. Prizes for winners, food vendors, and beach party after. Registration per team.",
      date: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000), // 28 days
      location: "Venice Beach, 1800 Ocean Front Walk, Los Angeles, CA 90291",
      city: "los angeles",
      geo: {
        type: "Point",
        coordinates: [-118.4728, 33.985],
      },
      organizer: getRandomUser()._id,
    },

    // Arts & Culture
    {
      title: "Contemporary Art Exhibition: Urban Perspectives",
      description:
        "Opening reception for new exhibition featuring works by emerging contemporary artists. Meet the artists, enjoy complimentary wine and hors d'oeuvres. Exhibition runs for 3 months.",
      date: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days
      location:
        "Museum of Contemporary Art, 220 E Chicago Ave, Chicago, IL 60611",
      city: "chicago",
      geo: {
        type: "Point",
        coordinates: [-87.6208, 41.8969],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Photography Workshop: Street Photography",
      description:
        "Learn the art of street photography from professional photographers. Theory session followed by guided photo walk through the city. All camera types welcome.",
      date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
      location: "Chelsea Market, 75 9th Ave, New York, NY 10011",
      city: "new york",
      geo: {
        type: "Point",
        coordinates: [-74.0064, 40.7424],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Theater Performance: Shakespeare in the Park",
      description:
        "Classic Shakespeare play performed in beautiful outdoor amphitheater. Bring blankets and picnic baskets. Free admission, first come first served.",
      date: new Date(today.getTime() + 40 * 24 * 60 * 60 * 1000), // 40 days
      location: "Delacorte Theater, Central Park, New York, NY 10024",
      city: "new york",
      geo: {
        type: "Point",
        coordinates: [-73.9691, 40.7794],
      },
      organizer: getRandomUser()._id,
    },

    // Business & Networking
    {
      title: "Women in Tech Networking Brunch",
      description:
        "Monthly networking event for women in technology industry. Guest speaker, panel discussion, and plenty of time to connect with peers. Continental breakfast included.",
      date: new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days
      location: "WeWork, 535 Mission St, San Francisco, CA 94105",
      city: "san francisco",
      geo: {
        type: "Point",
        coordinates: [-122.3986, 37.7886],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Digital Marketing Meetup: SEO Strategies 2025",
      description:
        "Learn cutting-edge SEO strategies from industry experts. Interactive presentation, Q&A session, and networking. Perfect for marketers and business owners.",
      date: new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 days
      location: "Impact Hub, 1885 Washington St, Boston, MA 02118",
      city: "boston",
      geo: {
        type: "Point",
        coordinates: [-71.0709, 42.3397],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Real Estate Investment Workshop",
      description:
        "Learn strategies for building wealth through real estate investment. Experienced investors share insights on property analysis, financing, and portfolio management.",
      date: new Date(today.getTime() + 22 * 24 * 60 * 60 * 1000), // 22 days
      location: "Convention Center, 650 W Peachtree St NW, Atlanta, GA 30308",
      city: "atlanta",
      geo: {
        type: "Point",
        coordinates: [-84.3883, 33.7626],
      },
      organizer: getRandomUser()._id,
    },

    // Education & Learning
    {
      title: "Coding Bootcamp Open House",
      description:
        "Explore our intensive coding bootcamp program. Meet instructors, tour facilities, attend mini coding workshop, and learn about career services. Free to attend.",
      date: new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000), // 11 days
      location: "General Assembly, 225 Bush St, San Francisco, CA 94104",
      city: "san francisco",
      geo: {
        type: "Point",
        coordinates: [-122.4013, 37.7908],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Public Speaking Masterclass",
      description:
        "Overcome fear of public speaking and master presentation skills. Interactive workshop with practice exercises and personalized feedback. Limited to 20 participants.",
      date: new Date(today.getTime() + 16 * 24 * 60 * 60 * 1000), // 16 days
      location: "Toastmasters Center, 100 Summer St, Boston, MA 02110",
      city: "boston",
      geo: {
        type: "Point",
        coordinates: [-71.0536, 42.3529],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Language Exchange Meetup: Spanish-English",
      description:
        "Practice Spanish and English in relaxed, friendly environment. All levels welcome. Native speakers available to help. Coffee and snacks provided.",
      date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      location: "Coffee Bar, 520 Columbus Ave, New York, NY 10024",
      city: "new york",
      geo: {
        type: "Point",
        coordinates: [-73.9697, 40.787],
      },
      organizer: getRandomUser()._id,
    },

    // Community & Social
    {
      title: "Book Club: Modern Literature Discussion",
      description:
        "Monthly book club meeting to discuss contemporary fiction. This month: 'The Midnight Library'. Lively discussion, wine, and book recommendations. All readers welcome!",
      date: new Date(today.getTime() + 19 * 24 * 60 * 60 * 1000), // 19 days
      location: "Local Library, 455 N Cityfront Plaza Dr, Chicago, IL 60611",
      city: "chicago",
      geo: {
        type: "Point",
        coordinates: [-87.6121, 41.8887],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Community Clean-Up Day",
      description:
        "Join neighbors for community clean-up event. Make our neighborhood cleaner and greener! Supplies provided. Community BBQ after. Families welcome!",
      date: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days
      location: "Volunteer Park, 1247 15th Ave E, Seattle, WA 98112",
      city: "seattle",
      geo: {
        type: "Point",
        coordinates: [-122.315, 47.6303],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Pet Adoption Fair",
      description:
        "Meet adorable dogs and cats looking for forever homes. Local shelters and rescue organizations bringing pets for adoption. Adoption counselors on-site to help find your perfect match.",
      date: new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000), // 13 days
      location: "PetSmart Charities, 8965 3rd Ave, Los Angeles, CA 90048",
      city: "los angeles",
      geo: {
        type: "Point",
        coordinates: [-118.385, 34.0735],
      },
      organizer: getRandomUser()._id,
    },

    // Wellness & Lifestyle
    {
      title: "Meditation & Mindfulness Retreat",
      description:
        "Day-long meditation retreat for all experience levels. Guided meditation sessions, mindfulness practices, healthy lunch, and relaxation exercises. Find your inner peace.",
      date: new Date(today.getTime() + 27 * 24 * 60 * 60 * 1000), // 27 days
      location: "Zen Center, 300 Page St, San Francisco, CA 94102",
      city: "san francisco",
      geo: {
        type: "Point",
        coordinates: [-122.4265, 37.7725],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Organic Gardening Workshop",
      description:
        "Learn organic gardening techniques for urban spaces. Topics include composting, raised bed gardening, and natural pest control. Take home starter plants!",
      date: new Date(today.getTime() + 23 * 24 * 60 * 60 * 1000), // 23 days
      location: "Community Garden, 2001 W 84th St, Austin, TX 78758",
      city: "austin",
      geo: {
        type: "Point",
        coordinates: [-97.7439, 30.3077],
      },
      organizer: getRandomUser()._id,
    },
    {
      title: "Mental Health Awareness Workshop",
      description:
        "Educational workshop on mental health awareness and self-care strategies. Licensed therapists provide tools for managing stress and anxiety. Safe, supportive environment.",
      date: new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000), // 31 days
      location: "Community Center, 200 W Madison St, Chicago, IL 60606",
      city: "chicago",
      geo: {
        type: "Point",
        coordinates: [-87.6341, 41.8819],
      },
      organizer: getRandomUser()._id,
    },
  ];
};

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await mongoose.connect(uri);
    console.log("✅ DB connection successful");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({ email: { $regex: "@eventspark.com$" } });
    await Event.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create demo users
    console.log("👥 Creating demo users...");
    const users = await User.create(demoUsers);
    console.log(`✅ Created ${users.length} demo users`);

    // Create events
    console.log("📅 Creating demo events...");
    const eventsData = getEventsData(users);
    const events = await Event.create(eventsData);
    console.log(`✅ Created ${events.length} demo events`);

    // Summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Users created: ${users.length}`);
    console.log(`   Events created: ${events.length}`);
    console.log("\n🔐 Demo Credentials:");
    console.log("   Email: demo@eventspark.com");
    console.log("   Password: Demo123!");
    console.log("\n   Admin Email: admin@eventspark.com");
    console.log("   Admin Password: Admin123!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    console.log("🗑️  Clearing database...");

    await mongoose.connect(uri);
    console.log("✅ DB connection successful");

    await User.deleteMany({ email: { $regex: "@eventspark.com$" } });
    await Event.deleteMany({});

    console.log("✅ Database cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
}

// Command line arguments
if (process.argv[2] === "--seed") {
  seedDatabase();
} else if (process.argv[2] === "--clear") {
  clearDatabase();
} else {
  console.log("\n📝 Usage:");
  console.log("   npm run seed        - Seed database with demo data");
  console.log("   npm run seed:clear  - Clear all demo data\n");
  process.exit(0);
}
