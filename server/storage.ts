import {
  users,
  news,
  comments,
  requests,
  states,
  municipalities,
  type User,
  type InsertUser,
  type News,
  type InsertNews,
  type Comment,
  type InsertComment,
  type Request,
  type InsertRequest,
  type State,
  type Municipality,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;

  // News operations
  getNews(): Promise<News[]>;
  getFeaturedNews(): Promise<News[]>;
  getNewsById(id: string): Promise<News | undefined>;
  getNewsByLocation(state?: string, municipality?: string): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: string, news: Partial<InsertNews>): Promise<News>;
  deleteNews(id: string): Promise<void>;

  // Comment operations
  getCommentsByNewsId(newsId: string): Promise<Comment[]>;
  getApprovedCommentsByNewsId(newsId: string): Promise<Comment[]>;
  getPendingComments(): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  approveComment(id: string): Promise<Comment>;
  deleteComment(id: string): Promise<void>;

  // Request operations
  getRequests(): Promise<Request[]>;
  getRequestsByPolitician(politicianId: string): Promise<Request[]>;
  getRequestsByLocation(state: string, municipality?: string): Promise<Request[]>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequestStatus(id: string, status: string, response?: string): Promise<Request>;

  // Location operations
  getStates(): Promise<State[]>;
  getMunicipalitiesByState(stateId: string): Promise<Municipality[]>;

  // Statistics
  getStats(): Promise<{
    newsCount: number;
    requestsCount: number;
    politiciansCount: number;
    responseRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // News operations
  async getNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.createdAt));
  }

  async getFeaturedNews(): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .where(eq(news.featured, true))
      .orderBy(desc(news.createdAt))
      .limit(6);
  }

  async getNewsById(id: string): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async getNewsByLocation(state?: string, municipality?: string): Promise<News[]> {
    let conditions = [];
    
    if (state) {
      conditions.push(eq(news.state, state));
    }
    if (municipality) {
      conditions.push(eq(news.municipality, municipality));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(news)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(desc(news.createdAt));
    }
    
    return await db.select().from(news).orderBy(desc(news.createdAt));
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(newsData).returning();
    return newsItem;
  }

  async updateNews(id: string, newsData: Partial<InsertNews>): Promise<News> {
    const [newsItem] = await db
      .update(news)
      .set({ ...newsData, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return newsItem;
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // Comment operations
  async getCommentsByNewsId(newsId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.newsId, newsId))
      .orderBy(desc(comments.createdAt));
  }

  async getApprovedCommentsByNewsId(newsId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(and(eq(comments.newsId, newsId), eq(comments.approved, true)))
      .orderBy(desc(comments.createdAt));
  }

  async getPendingComments(): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.approved, false))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    return comment;
  }

  async approveComment(id: string): Promise<Comment> {
    const [comment] = await db
      .update(comments)
      .set({ approved: true })
      .where(eq(comments.id, id))
      .returning();
    return comment;
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  // Request operations
  async getRequests(): Promise<Request[]> {
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  }

  async getRequestsByPolitician(politicianId: string): Promise<Request[]> {
    return await db
      .select()
      .from(requests)
      .where(eq(requests.politicianId, politicianId))
      .orderBy(desc(requests.createdAt));
  }

  async getRequestsByLocation(state: string, municipality?: string): Promise<Request[]> {
    let conditions = [eq(requests.state, state)];
    
    if (municipality) {
      conditions.push(eq(requests.municipality, municipality));
    }
    
    return await db
      .select()
      .from(requests)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions))
      .orderBy(desc(requests.createdAt));
  }

  async createRequest(requestData: InsertRequest): Promise<Request> {
    const [request] = await db.insert(requests).values(requestData).returning();
    return request;
  }

  async updateRequestStatus(id: string, status: string, response?: string): Promise<Request> {
    const [request] = await db
      .update(requests)
      .set({ status: status as any, response, updatedAt: new Date() })
      .where(eq(requests.id, id))
      .returning();
    return request;
  }

  // Location operations
  async getStates(): Promise<State[]> {
    return await db.select().from(states).orderBy(states.name);
  }

  async getMunicipalitiesByState(stateId: string): Promise<Municipality[]> {
    return await db
      .select()
      .from(municipalities)
      .where(eq(municipalities.stateId, stateId))
      .orderBy(municipalities.name);
  }

  // Statistics
  async getStats(): Promise<{
    newsCount: number;
    requestsCount: number;
    politiciansCount: number;
    responseRate: number;
  }> {
    const [newsCount] = await db.select({ count: count() }).from(news);
    const [requestsCount] = await db.select({ count: count() }).from(requests);
    const [politiciansCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.type, "politician"));
    
    const [resolvedCount] = await db
      .select({ count: count() })
      .from(requests)
      .where(eq(requests.status, "resolved"));
    
    const responseRate = requestsCount.count > 0 
      ? Math.round((resolvedCount.count / requestsCount.count) * 100)
      : 0;

    return {
      newsCount: newsCount.count,
      requestsCount: requestsCount.count,
      politiciansCount: politiciansCount.count,
      responseRate,
    };
  }
}

export const storage = new DatabaseStorage();
