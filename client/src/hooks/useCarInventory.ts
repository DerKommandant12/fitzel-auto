import { useEffect, useState } from "react";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  fuel: string;
  transmission: string;
  km: string;
  price: string;
  images: string[];
  description?: string;
  bodyType?: string;
  engine?: string;
  power?: string;
  drivetrain?: string;
  stockType?: string;
  location?: string;
}

export function useCarInventory() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const inventoryRef = ref(db, "inventory");
    
    const unsubscribe = onValue(
      inventoryRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const carsList = Object.entries(data).map(([id, car]: [string, any]) => ({
              id,
              ...car,
              km: car.km != null && car.km !== "" ? String(car.km) : "",
            })) as Car[];
            setCars(carsList);
          } else {
            setCars([]);
          }
        } catch (e) {
          console.error("Failed to load inventory:", e);
        } finally {
          setLoaded(true);
        }
      },
      (err) => {
        console.error("Firebase error:", err);
        setLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  const addCar = async (car: Omit<Car, "id">) => {
    try {
      const inventoryRef = ref(db, "inventory");
      const newCarRef = push(inventoryRef);
      const id = newCarRef.key || Date.now().toString();
      const payload = {
        ...car,
        km: String(car.km ?? ""),
        images: car.images || [],
      };
      await set(newCarRef, payload);
      const newCar: Car = { ...payload, id };
      return newCar;
    } catch (e) {
      console.error("Failed to add car:", e);
      throw e;
    }
  };

  const updateCar = async (id: string, updates: Partial<Car>) => {
    try {
      const carRef = ref(db, `inventory/${id}`);
      const payload = { ...updates };
      if ("km" in payload && payload.km !== undefined) {
        payload.km = String(payload.km);
      }
      await update(carRef, payload);
    } catch (e) {
      console.error("Failed to update car:", e);
      throw e;
    }
  };

  const deleteCar = async (id: string) => {
    try {
      const carRef = ref(db, `inventory/${id}`);
      await remove(carRef);
    } catch (e) {
      console.error("Failed to delete car:", e);
      throw e;
    }
  };

  const getCar = (id: string) => {
    return cars.find((car) => car.id === id);
  };

  return {
    cars,
    loaded,
    addCar,
    updateCar,
    deleteCar,
    getCar,
  };
}
