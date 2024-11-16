import { ClassSectionCreate } from "./types";

const BASE_URL = "/api/class-sections";

export const classSectionApi = {
  getAll: () => fetch(BASE_URL).then((res) => res.json()),

  create: (data: ClassSectionCreate) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};
