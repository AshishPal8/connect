import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma";
import { UnauthorizedError } from "../../utils/error";
import {
  getCategoryService,
  interestByCategoryService,
} from "./category.service";

export const seedCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const seed = [
    {
      slug: "technology",
      title: "Technology",
      description: "Programming, software, and modern tech innovations",
      interests: [
        { slug: "web-development", title: "Web Development" },
        { slug: "mobile-development", title: "Mobile Development" },
        { slug: "game-development", title: "Game Development" },
        { slug: "ai-ml", title: "AI & Machine Learning" },
        { slug: "cybersecurity", title: "Cybersecurity" },
        { slug: "cloud-computing", title: "Cloud Computing" },
        { slug: "blockchain", title: "Blockchain" },
        { slug: "iot", title: "Internet of Things" },
        { slug: "data-science", title: "Data Science" },
        { slug: "open-source", title: "Open Source" },
      ],
    },
    {
      slug: "music",
      title: "Music",
      description: "Genres, instruments, production, and music culture",
      interests: [
        { slug: "guitar", title: "Guitar" },
        { slug: "piano", title: "Piano" },
        { slug: "singing", title: "Singing" },
        { slug: "music-production", title: "Music Production" },
        { slug: "dj", title: "DJ & Mixing" },
        { slug: "lofi", title: "Lo-fi" },
        { slug: "jazz", title: "Jazz" },
        { slug: "hiphop", title: "Hip-Hop" },
        { slug: "classical", title: "Classical" },
        { slug: "electronic", title: "Electronic" },
      ],
    },
    {
      slug: "sports",
      title: "Sports",
      description: "Outdoor and indoor sports, fitness, and athletics",
      interests: [
        { slug: "football", title: "Football" },
        { slug: "cricket", title: "Cricket" },
        { slug: "basketball", title: "Basketball" },
        { slug: "badminton", title: "Badminton" },
        { slug: "tennis", title: "Tennis" },
        { slug: "running", title: "Running" },
        { slug: "gym", title: "Gym & Fitness" },
        { slug: "cycling", title: "Cycling" },
        { slug: "swimming", title: "Swimming" },
        { slug: "yoga", title: "Yoga" },
      ],
    },
    {
      slug: "adventure",
      title: "Adventure",
      description: "Nature, adventure, and exploration activities",
      interests: [
        { slug: "hiking", title: "Hiking" },
        { slug: "camping", title: "Camping" },
        { slug: "rock-climbing", title: "Rock Climbing" },
        { slug: "trekking", title: "Trekking" },
        { slug: "mountain-biking", title: "Mountain Biking" },
        { slug: "wildlife", title: "Wildlife" },
        { slug: "road-trips", title: "Road Trips" },
        { slug: "surfing", title: "Surfing" },
        { slug: "kayaking", title: "Kayaking" },
        { slug: "scuba-diving", title: "Scuba Diving" },
      ],
    },
    {
      slug: "movies",
      title: "Movies & TV",
      description: "Cinema, series, and storytelling from all genres",
      interests: [
        { slug: "action", title: "Action" },
        { slug: "drama", title: "Drama" },
        { slug: "comedy", title: "Comedy" },
        { slug: "sci-fi", title: "Sci-Fi" },
        { slug: "thriller", title: "Thriller" },
        { slug: "documentaries", title: "Documentaries" },
        { slug: "anime", title: "Anime" },
        { slug: "superhero", title: "Superhero" },
        { slug: "romance", title: "Romance" },
        { slug: "fantasy", title: "Fantasy" },
      ],
    },
    {
      slug: "books",
      title: "Books & Reading",
      description: "Reading, writing, and exploring literature",
      interests: [
        { slug: "fiction", title: "Fiction" },
        { slug: "non-fiction", title: "Non-Fiction" },
        { slug: "self-help", title: "Self-Help" },
        { slug: "biographies", title: "Biographies" },
        { slug: "fantasy-books", title: "Fantasy" },
        { slug: "sci-fi-books", title: "Science Fiction" },
        { slug: "philosophy", title: "Philosophy" },
        { slug: "history", title: "History" },
        { slug: "poetry", title: "Poetry" },
        { slug: "psychology", title: "Psychology" },
      ],
    },
    {
      slug: "food",
      title: "Food & Cooking",
      description: "Cooking, cuisines, and food culture",
      interests: [
        { slug: "baking", title: "Baking" },
        { slug: "vegan", title: "Vegan Cooking" },
        { slug: "desserts", title: "Desserts" },
        { slug: "street-food", title: "Street Food" },
        { slug: "healthy-eating", title: "Healthy Eating" },
        { slug: "grilling", title: "Grilling & BBQ" },
        { slug: "coffee", title: "Coffee Brewing" },
        { slug: "indian-cuisine", title: "Indian Cuisine" },
        { slug: "italian-cuisine", title: "Italian Cuisine" },
        { slug: "japanese-cuisine", title: "Japanese Cuisine" },
      ],
    },
    {
      slug: "art",
      title: "Art & Creativity",
      description: "Painting, design, and visual expression",
      interests: [
        { slug: "drawing", title: "Drawing" },
        { slug: "painting", title: "Painting" },
        { slug: "graphic-design", title: "Graphic Design" },
        { slug: "illustration", title: "Illustration" },
        { slug: "digital-art", title: "Digital Art" },
        { slug: "calligraphy", title: "Calligraphy" },
        { slug: "photography", title: "Photography" },
        { slug: "animation", title: "Animation" },
        { slug: "crafts", title: "Crafts" },
        { slug: "architecture", title: "Architecture" },
      ],
    },
    {
      slug: "travel",
      title: "Travel & Culture",
      description: "Exploring places, people, and cultures",
      interests: [
        { slug: "backpacking", title: "Backpacking" },
        { slug: "solo-travel", title: "Solo Travel" },
        { slug: "road-trips", title: "Road Trips" },
        { slug: "photography-travel", title: "Travel Photography" },
        { slug: "culture", title: "Cultural Exploration" },
        { slug: "budget-travel", title: "Budget Travel" },
        { slug: "luxury-travel", title: "Luxury Travel" },
        { slug: "local-food", title: "Local Food" },
        { slug: "adventure-travel", title: "Adventure Travel" },
        { slug: "heritage", title: "Heritage Sites" },
      ],
    },
    {
      slug: "wellness",
      title: "Wellness & Lifestyle",
      description: "Mental and physical well-being, mindfulness, and lifestyle",
      interests: [
        { slug: "meditation", title: "Meditation" },
        { slug: "mindfulness", title: "Mindfulness" },
        { slug: "fitness", title: "Fitness" },
        { slug: "nutrition", title: "Nutrition" },
        { slug: "journaling", title: "Journaling" },
        { slug: "minimalism", title: "Minimalism" },
        { slug: "self-care", title: "Self Care" },
        { slug: "productivity", title: "Productivity" },
        { slug: "sleep", title: "Sleep Improvement" },
        { slug: "mental-health", title: "Mental Health" },
      ],
    },
  ];

  try {
    const results: Array<{ categorySlug: string; createdInterests: number }> =
      [];

    await prisma.$transaction(
      async (tx) => {
        for (const c of seed) {
          const category = await prisma.category.upsert({
            where: { slug: c.slug },
            update: { title: c.title },
            create: { slug: c.slug, title: c.title },
          });

          const upserts = c.interests.map((it) =>
            tx.interest.upsert({
              where: { slug: it.slug },
              update: { title: it.title, categoryId: category.id },
              create: {
                slug: it.slug,
                title: it.title,
                categoryId: category.id,
              },
            })
          );

          const createdOrUpdated = await Promise.all(upserts);

          results.push({
            categorySlug: c.slug,
            createdInterests: createdOrUpdated.length,
          });
        }
      },
      { timeout: 30_000 }
    );

    res.status(201).json({
      succes: true,
      message: "Data added successfully",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const categories = await getCategoryService();

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const interestByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const interests = await interestByCategoryService(req.body);

    res.status(200).json(interests);
  } catch (error) {
    next(error);
  }
};
