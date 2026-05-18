import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getAllCars, getCarById, createCar, updateCar, deleteCar } from "./db";
import { z } from "zod";

const COOKIE_NAME = "session";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cars: router({
    list: publicProcedure.query(() => getAllCars()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getCarById(input.id)),
    
    create: protectedProcedure
      .input(z.object({
        brand: z.string(),
        model: z.string(),
        year: z.number(),
        price: z.number(),
        mileage: z.number(),
        engine: z.string(),
        transmission: z.string(),
        fuel: z.string(),
        color: z.string(),
        description: z.string().optional(),
        images: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
      }))
      .mutation(({ input }) => {
        const carData: any = { ...input };
        carData.images = JSON.stringify(input.images || []);
        carData.featured = input.featured ? 1 : 0;
        return createCar(carData);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        brand: z.string().optional(),
        model: z.string().optional(),
        year: z.number().optional(),
        price: z.number().optional(),
        mileage: z.number().optional(),
        engine: z.string().optional(),
        transmission: z.string().optional(),
        fuel: z.string().optional(),
        color: z.string().optional(),
        description: z.string().optional(),
        images: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...carData } = input;
        const updateData: any = carData;
        if (carData.images) {
          updateData.images = JSON.stringify(carData.images);
        }
        if (carData.featured !== undefined) {
          updateData.featured = carData.featured ? 1 : 0;
        }
        return updateCar(id, updateData);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteCar(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
