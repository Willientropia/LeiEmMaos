import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types enum
export const userTypeEnum = pgEnum("user_type", ["admin", "politician", "visitor"]);

// Request status enum
export const requestStatusEnum = pgEnum("request_status", ["pending", "in_progress", "resolved", "rejected"]);

// Request type enum
export const requestTypeEnum = pgEnum("request_type", [
  "infraestrutura",
  "saude", 
  "educacao",
  "seguranca",
  "meio-ambiente",
  "outro"
]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: text("password"),
  name: text("name").notNull(),
  type: userTypeEnum("type").notNull().default("visitor"),
  state: varchar("state", { length: 2 }),
  municipality: text("municipality"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// States table
export const states = pgTable("states", {
  id: varchar("id", { length: 2 }).primaryKey(),
  name: text("name").notNull(),
});

// Municipalities table
export const municipalities = pgTable("municipalities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  stateId: varchar("state_id", { length: 2 }).notNull(),
});

// News table
export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  state: varchar("state", { length: 2 }),
  municipality: text("municipality"),
  category: text("category").notNull(),
  authorId: varchar("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  newsId: varchar("news_id").notNull(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Requests table
export const requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  municipality: text("municipality").notNull(),
  type: requestTypeEnum("type").notNull(),
  message: text("message").notNull(),
  status: requestStatusEnum("status").default("pending"),
  politicianId: varchar("politician_id"),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  news: many(news),
  requests: many(requests),
}));

export const statesRelations = relations(states, ({ many }) => ({
  municipalities: many(municipalities),
}));

export const municipalitiesRelations = relations(municipalities, ({ one }) => ({
  state: one(states, {
    fields: [municipalities.stateId],
    references: [states.id],
  }),
}));

export const newsRelations = relations(news, ({ one, many }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  news: one(news, {
    fields: [comments.newsId],
    references: [news.id],
  }),
}));

export const requestsRelations = relations(requests, ({ one }) => ({
  politician: one(users, {
    fields: [requests.politicianId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  approved: true,
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  politicianId: true,
  response: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type State = typeof states.$inferSelect;
export type Municipality = typeof municipalities.$inferSelect;
