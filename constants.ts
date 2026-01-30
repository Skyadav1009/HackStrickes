import { HackathonMode, HackathonStatus } from "./types";

export const APP_NAME = "HackPulse";

export const DEFAULT_TAGS = [
  "AI", "Web3", "Machine Learning", "Blockchain", "Open Source", 
  "Student", "FinTech", "HealthTech", "GameDev", "Cloud", "Cybersecurity"
];

export const MOCK_ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password123" // In a real app, this would be handled by the backend
};

export const INITIAL_HACKATHONS_SEED = [
  {
    _id: "seed_1",
    title: "Global AI Challenge 2024",
    slug: "global-ai-challenge-2024",
    organizer: "TechFlow Inc.",
    description: "Build the next generation of AI agents. Join developers from around the world to solve complex problems using Generative AI.\n\n### Challenges\n1. Healthcare Agents\n2. Financial Forecasting\n3. Creative Arts",
    mode: HackathonMode.ONLINE,
    startDate: new Date(Date.now() + 86400000 * 2).toISOString(), // Starts in 2 days
    endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    registrationDeadline: new Date(Date.now() + 86400000 * 1).toISOString(), // Ends in 1 day (Closing Soon)
    prize: "$50,000 USD",
    tags: ["AI", "Machine Learning", "Generative AI"],
    registrationLink: "https://example.com/register",
    sourceUrl: "https://example.com/hackathons/ai-2024",
    sourceType: "manual",
    status: HackathonStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "seed_2",
    title: "Web3 Builders Summit",
    slug: "web3-builders-summit",
    organizer: "DeFi Alliance",
    description: "Create decentralized applications for the future of finance. Focus on Ethereum and Solana ecosystems.",
    mode: HackathonMode.HYBRID,
    startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    registrationDeadline: new Date(Date.now() + 86400000 * 8).toISOString(),
    prize: "20 ETH + $10k",
    tags: ["Web3", "Blockchain", "DeFi"],
    registrationLink: "https://example.com/register-web3",
    sourceUrl: "https://example.com/web3",
    sourceType: "manual",
    status: HackathonStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "seed_3",
    title: "Student Code Fest",
    slug: "student-code-fest",
    organizer: "University DAO",
    description: "A beginner friendly hackathon for university students. No prior experience required.",
    mode: HackathonMode.OFFLINE,
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    registrationDeadline: new Date(Date.now() - 86400000 * 6).toISOString(),
    prize: "Internship Opportunities",
    tags: ["Student", "Beginner", "Education"],
    registrationLink: "https://example.com/student",
    sourceUrl: "https://example.com/u-dao",
    sourceType: "manual",
    status: HackathonStatus.EXPIRED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];