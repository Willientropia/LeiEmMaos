import { z } from "zod";
import { ObjectId } from "mongodb";

// User types enum
export const userTypeEnum = ["admin", "politician", "visitor"] as const;

// Request status enum
export const requestStatusEnum = ["pending", "in_progress", "resolved", "rejected"] as const;

// Request type enum
export const requestTypeEnum = [
  "infraestrutura",
  "saude", 
  "educacao",
  "seguranca",
  "meio-ambiente",
  "outro"
] as const;

// Base interface for MongoDB documents
export interface BaseDocument {
  _id?: string; // Changed to string for frontend compatibility
  id?: string; // Alias for _id for frontend compatibility
  createdAt?: Date;
  updatedAt?: Date;
}

// User interface
export interface User extends BaseDocument {
  email?: string;
  password?: string;
  name: string;
  type: typeof userTypeEnum[number];
  state?: string;
  municipality?: string;
}

// State interface
export interface State {
  _id: string; // 2-letter state code
  name: string;
}

// Municipality interface
export interface Municipality extends BaseDocument {
  name: string;
  stateId: string;
}

// News interface
export interface News extends BaseDocument {
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  featured?: boolean;
  state?: string;
  municipality?: string;
  category: string;
  authorId: string;
}

// Comment interface
export interface Comment extends BaseDocument {
  newsId: string;
  name: string;
  content: string;
  approved?: boolean;
}

// Request interface
export interface Request extends BaseDocument {
  name: string;
  email: string;
  state: string;
  municipality: string;
  type: typeof requestTypeEnum[number];
  message: string;
  status?: typeof requestStatusEnum[number];
  politicianId?: string;
  response?: string;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(userTypeEnum).default("visitor"),
  state: z.string().length(2).optional(),
  municipality: z.string().optional(),
});

export const insertNewsSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().min(1),
  imageUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  state: z.string().length(2).optional(),
  municipality: z.string().optional(),
  category: z.string().min(1),
  authorId: z.string().min(1),
});

export const insertCommentSchema = z.object({
  newsId: z.string().min(1),
  name: z.string().min(1),
  content: z.string().min(1),
});

export const insertRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  state: z.string().length(2),
  municipality: z.string().min(1),
  type: z.enum(requestTypeEnum),
  message: z.string().min(1),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
