export interface ValidationResult {
  success: boolean;
  message?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  theory: string;
  taskDescription: string;
  starterCode: string;
  hint: string;
  validate: (
    code: string,
    pyodide: any,
    output: string,
    error: string | null
  ) => Promise<ValidationResult>;
}

export interface Module {
  id: string;
  title: string;
  description: string;
}

export interface UserProgress {
  completedLessons: string[]; // List of lesson IDs
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  achievements: string[];
  codeHistory: Record<string, string>; // lessonId -> userCode
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  requirementType: 'lessons_count' | 'streak_count' | 'xp_count' | 'custom';
  requirementValue: number;
}
