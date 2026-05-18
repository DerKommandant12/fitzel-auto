import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, cars, InsertCar, Car } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Car queries
export async function getAllCars(): Promise<Car[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get cars: database not available");
    return [];
  }

  try {
    const result = await db.select().from(cars);
    return result.map(car => ({
      ...car,
      images: typeof car.images === 'string' ? JSON.parse(car.images) : car.images,
    }));
  } catch (error) {
    console.error("[Database] Failed to get cars:", error);
    return [];
  }
}

export async function getCarById(id: number): Promise<Car | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get car: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(cars).where(eq(cars.id, id)).limit(1);
    if (result.length === 0) return undefined;
    
    const car = result[0];
    return {
      ...car,
      images: typeof car.images === 'string' ? JSON.parse(car.images) : car.images,
    };
  } catch (error) {
    console.error("[Database] Failed to get car:", error);
    return undefined;
  }
}

export async function createCar(car: InsertCar): Promise<Car | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create car: database not available");
    return null;
  }

  try {
    const carData = {
      ...car,
      images: typeof car.images === 'string' ? car.images : JSON.stringify(car.images || []),
      featured: car.featured ? 1 : 0,
    };
    
    await db.insert(cars).values(carData);
    // Get the last inserted car (assuming auto-increment)
    const allCars = await getAllCars();
    return allCars.length > 0 ? allCars[allCars.length - 1] : null;
  } catch (error) {
    console.error("[Database] Failed to create car:", error);
    return null;
  }
}

export async function updateCar(id: number, car: Partial<InsertCar>): Promise<Car | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update car: database not available");
    return null;
  }

  try {
    const updateData: any = { ...car };
    if (car.images) {
      updateData.images = typeof car.images === 'string' ? car.images : JSON.stringify(car.images);
    }
    if (car.featured !== undefined) {
      updateData.featured = car.featured ? 1 : 0;
    }
    
    await db.update(cars).set(updateData).where(eq(cars.id, id));
    const updatedCar = await getCarById(id);
    return updatedCar || null;
  } catch (error) {
    console.error("[Database] Failed to update car:", error);
    return null;
  }
}

export async function deleteCar(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete car: database not available");
    return false;
  }

  try {
    await db.delete(cars).where(eq(cars.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete car:", error);
    return false;
  }
}

// TODO: add feature queries here as your schema grows.
