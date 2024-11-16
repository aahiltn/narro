import { UnitCreate } from "./types";

const BASE_URL = "/api/units";

class UnitApi {
  async getAll() {
    try {
      const res = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `HTTP error! status: ${res.status}`);
      }

      return res.json();
    } catch (error) {
      console.error("Failed to fetch units:", error);
      throw error;
    }
  }

  async create(data: UnitCreate) {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      console.error("Failed to create unit:", error);
      throw new Error("Failed to create unit");
    }
  }
}

export const unitApi = new UnitApi();
