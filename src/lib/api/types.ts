// Shared type definitions
export interface ExamCreate {
  title: string;
  description?: string;
  date: Date;
  unitId: string;
}

export interface QuestionCreate {
  text: string;
  correctAnswer: string;
  points: number;
  examId: string;
}

export interface StudentCreate {
  name: string;
  email: string;
  classSectionIds?: string[];
}

export interface TeacherCreate {
  name: string;
  email: string;
}

export interface UnitCreate {
  title: string;
  description?: string;
  teacherId: string;
  classSectionId: string;
}

export interface ClassSectionCreate {
  name: string;
  teacherId: string;
}
