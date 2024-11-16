export interface GenerateQuestionRequest {
  keywords: string[];
  unitDescription: string;
}

export interface MockUnit {
  title: string;
  description: string;
  keywords: string[];
}

export const mockUnits: MockUnit[] = [
  {
    title: "Airport Travel",
    description: "describing an airport scene in Spanish",
    keywords: ["airplane", "terminal", "luggage", "boarding gate"],
  },
  {
    title: "Restaurant",
    description: "ordering food in a Spanish restaurant",
    keywords: ["menu", "waiter", "table", "food"],
  },
  {
    title: "Weather",
    description: "discussing weather conditions in Spanish",
    keywords: ["sunny", "rain", "cloud", "temperature"],
  },
]; 