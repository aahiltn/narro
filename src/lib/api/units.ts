import { UnitCreate } from "./types";

const BASE_URL = "/api/units";

export const unitApi = {
  getAll: () => fetch(BASE_URL).then((res) => res.json()),

  create: (data: UnitCreate) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};
