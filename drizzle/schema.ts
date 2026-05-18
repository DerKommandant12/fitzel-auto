import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Car inventory table
export const cars = mysqlTable("cars", {
  id: int("id").autoincrement().primaryKey(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: int("year").notNull(),
  price: int("price").notNull(), // in EUR
  mileage: int("mileage").notNull(), // in km
  engine: varchar("engine", { length: 100 }).notNull(), // e.g., "2.0L Diesel"
  transmission: varchar("transmission", { length: 50 }).notNull(), // "Manual" or "Automatic"
  fuel: varchar("fuel", { length: 50 }).notNull(), // "Diesel", "Petrol", "Hybrid"
  color: varchar("color", { length: 50 }).notNull(),
  description: text("description"),
  images: text("images").notNull().default(JSON.stringify([])), // JSON array of image URLs
  featured: int("featured").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Car = typeof cars.$inferSelect;
export type InsertCar = typeof cars.$inferInsert;

// TODO: Add your tables here