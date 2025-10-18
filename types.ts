
export interface UserProfile {
  goal: string;
  budget: number;
  allergies: string[];
  dislikes: string;
  mealsPerDay: number;
  cookingTime: number;
}

export interface Meal {
  mealType: string;
  name: string;
  description: string;
  estimatedCost: number;
  cookingTime: number;
  calories: number;
  carbs: number;
  bloodSugarImpact: 'low' | 'medium' | 'high';
  isMealKitAvailable: boolean;
  alternatives: Omit<Meal, 'alternatives'>[];
}

export interface DailyPlan {
  day: string;
  meals: Meal[];
}

export type WeeklyPlan = DailyPlan[];
