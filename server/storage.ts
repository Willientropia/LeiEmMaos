import {
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
import { connectToDatabase } from "./db";
import { ObjectId } from "mongodb";

// Helper function to convert MongoDB documents to frontend-compatible format
function convertDocument<T extends { _id?: any }>(doc: T): T {
  if (doc && doc._id) {
    return {
      ...doc,
      _id: doc._id.toString(),
      id: doc._id.toString()
    };
  }
  return doc;
}

function convertDocuments<T extends { _id?: any }>(docs: T[]): T[] {
  return docs.map(convertDocument);
}

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
    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      return undefined;
    }
    
    const db = await connectToDatabase();
    const user = await db.collection<User>('users').findOne({ _id: new ObjectId(id) } as any);
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await connectToDatabase();
    const user = await db.collection<User>('users').findOne({ email });
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const db = await connectToDatabase();
    const now = new Date();
    const userToInsert = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection<User>('users').insertOne(userToInsert as User);
    const user = await db.collection<User>('users').findOne({ _id: result.insertedId });
    return user!;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    
    const db = await connectToDatabase();
    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };
    
    await db.collection<User>('users').updateOne(
      { _id: new ObjectId(id) } as any,
      { $set: updateData }
    );
    
    const user = await db.collection<User>('users').findOne({ _id: new ObjectId(id) } as any);
    return user!;
  }

  // News operations
  async getNews(): Promise<News[]> {
    const db = await connectToDatabase();
    const news = await db.collection<News>('news')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return convertDocuments(news);
  }

  async getFeaturedNews(): Promise<News[]> {
    const db = await connectToDatabase();
    const news = await db.collection<News>('news')
      .find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();
    return convertDocuments(news);
  }

  async getNewsById(id: string): Promise<News | undefined> {
    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      return undefined;
    }
    
    const db = await connectToDatabase();
    const news = await db.collection<News>('news').findOne({ _id: new ObjectId(id) } as any);
    return news ? convertDocument(news) : undefined;
  }

  async getNewsByLocation(state?: string, municipality?: string): Promise<News[]> {
    const db = await connectToDatabase();
    const filter: any = {};
    
    if (state) {
      filter.state = state;
    }
    if (municipality) {
      filter.municipality = municipality;
    }
    
    return await db.collection<News>('news')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const db = await connectToDatabase();
    const now = new Date();
    const newsToInsert = {
      ...newsData,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection<News>('news').insertOne(newsToInsert as News);
    const news = await db.collection<News>('news').findOne({ _id: result.insertedId });
    return news!;
  }

  async updateNews(id: string, newsData: Partial<InsertNews>): Promise<News> {
    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      throw new Error('Invalid news ID');
    }
    
    const db = await connectToDatabase();
    const updateData = {
      ...newsData,
      updatedAt: new Date(),
    };
    
    await db.collection<News>('news').updateOne(
      { _id: new ObjectId(id) } as any,
      { $set: updateData }
    );
    
    const news = await db.collection<News>('news').findOne({ _id: new ObjectId(id) } as any);
    return convertDocument(news!);
  }

  async deleteNews(id: string): Promise<void> {
    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      throw new Error('Invalid news ID');
    }
    
    const db = await connectToDatabase();
    await db.collection<News>('news').deleteOne({ _id: new ObjectId(id) } as any);
  }

  // Comment operations
  async getCommentsByNewsId(newsId: string): Promise<Comment[]> {
    const db = await connectToDatabase();
    return await db.collection<Comment>('comments')
      .find({ newsId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getApprovedCommentsByNewsId(newsId: string): Promise<Comment[]> {
    const db = await connectToDatabase();
    return await db.collection<Comment>('comments')
      .find({ newsId, approved: true })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getPendingComments(): Promise<Comment[]> {
    const db = await connectToDatabase();
    return await db.collection<Comment>('comments')
      .find({ approved: false })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const db = await connectToDatabase();
    const now = new Date();
    const commentToInsert = {
      ...commentData,
      approved: false,
      createdAt: now,
    };
    
    const result = await db.collection<Comment>('comments').insertOne(commentToInsert as Comment);
    const comment = await db.collection<Comment>('comments').findOne({ _id: result.insertedId });
    return comment!;
  }

  async approveComment(id: string): Promise<Comment> {
    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      throw new Error('Invalid comment ID');
    }
    
    const db = await connectToDatabase();
    await db.collection<Comment>('comments').updateOne(
      { _id: new ObjectId(id) } as any,
      { $set: { approved: true } }
    );
    
    const comment = await db.collection<Comment>('comments').findOne({ _id: new ObjectId(id) } as any);
    return comment!;
  }

  async deleteComment(id: string): Promise<void> {
    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      throw new Error('Invalid comment ID');
    }
    
    const db = await connectToDatabase();
    await db.collection<Comment>('comments').deleteOne({ _id: new ObjectId(id) } as any);
  }

  // Request operations
  async getRequests(): Promise<Request[]> {
    const db = await connectToDatabase();
    const requests = await db.collection<Request>('requests')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return convertDocuments(requests);
  }

  async getRequestsByPolitician(politicianId: string): Promise<Request[]> {
    const db = await connectToDatabase();
    const requests = await db.collection<Request>('requests')
      .find({ politicianId })
      .sort({ createdAt: -1 })
      .toArray();
    return convertDocuments(requests);
  }

  async getRequestsByLocation(state: string, municipality?: string): Promise<Request[]> {
    const db = await connectToDatabase();
    const filter: any = { state };
    
    if (municipality) {
      filter.municipality = municipality;
    }
    
    const requests = await db.collection<Request>('requests')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    return convertDocuments(requests);
  }

  async createRequest(requestData: InsertRequest): Promise<Request> {
    const db = await connectToDatabase();
    const now = new Date();
    const requestToInsert = {
      ...requestData,
      status: "pending" as const,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection<Request>('requests').insertOne(requestToInsert as Request);
    const request = await db.collection<Request>('requests').findOne({ _id: result.insertedId });
    return request!;
  }

  async updateRequestStatus(id: string, status: string, response?: string): Promise<Request> {
    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      throw new Error('Invalid request ID');
    }
    
    const db = await connectToDatabase();
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };
    
    if (response) {
      updateData.response = response;
    }
    
    await db.collection<Request>('requests').updateOne(
      { _id: new ObjectId(id) } as any,
      { $set: updateData }
    );
    
    const request = await db.collection<Request>('requests').findOne({ _id: new ObjectId(id) } as any);
    return convertDocument(request!);
  }

  // Location operations
  async getStates(): Promise<State[]> {
    const db = await connectToDatabase();
    return await db.collection<State>('states').find({}).toArray();
  }

  async getMunicipalitiesByState(stateId: string): Promise<Municipality[]> {
    const db = await connectToDatabase();
    return await db.collection<Municipality>('municipalities')
      .find({ stateId })
      .toArray();
  }

  async createMunicipality(municipalityData: { id: string; name: string; stateId: string }): Promise<Municipality> {
    const db = await connectToDatabase();
    const municipalityToInsert = {
      _id: municipalityData.id,
      name: municipalityData.name,
      stateId: municipalityData.stateId,
    };
    
    // Use upsert to avoid duplicates
    await db.collection<Municipality>('municipalities').replaceOne(
      { _id: municipalityData.id },
      municipalityToInsert as Municipality,
      { upsert: true }
    );
    
    const municipality = await db.collection<Municipality>('municipalities').findOne({ _id: municipalityData.id });
    return municipality!;
  }

  // Statistics
  async getStats(): Promise<{
    newsCount: number;
    requestsCount: number;
    politiciansCount: number;
    responseRate: number;
  }> {
    const db = await connectToDatabase();
    
    const [newsCount, requestsCount, politiciansCount, resolvedRequests] = await Promise.all([
      db.collection('news').countDocuments(),
      db.collection('requests').countDocuments(),
      db.collection('users').countDocuments({ type: 'politician' }),
      db.collection('requests').countDocuments({ status: 'resolved' }),
    ]);
    
    const responseRate = requestsCount > 0 ? (resolvedRequests / requestsCount) * 100 : 0;
    
    return {
      newsCount,
      requestsCount,
      politiciansCount,
      responseRate,
    };
  }
}

export const storage = new DatabaseStorage();
