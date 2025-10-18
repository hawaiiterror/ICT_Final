
import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, WeeklyPlan } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    mealType: { type: Type.STRING, description: '식사 종류 (예: 아침, 점심, 저녁)' },
    name: { type: Type.STRING, description: '음식 이름' },
    description: { type: Type.STRING, description: '음식에 대한 간단한 설명' },
    estimatedCost: { type: Type.NUMBER, description: '예상 비용 (KRW)' },
    cookingTime: { type: Type.NUMBER, description: '조리 시간 (분)' },
    calories: { type: Type.NUMBER, description: '예상 칼로리 (kcal)' },
    carbs: { type: Type.NUMBER, description: '예상 탄수화물 (g)' },
    bloodSugarImpact: { type: Type.STRING, description: '혈당 영향 지수 (low, medium, high)', enum: ['low', 'medium', 'high'] },
    isMealKitAvailable: { type: Type.BOOLEAN, description: '간편 조리 키트 구매 가능 여부' },
  },
  required: ['mealType', 'name', 'description', 'estimatedCost', 'cookingTime', 'calories', 'carbs', 'bloodSugarImpact', 'isMealKitAvailable']
};

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.STRING, description: '요일 (예: 월요일)' },
      meals: {
        type: Type.ARRAY,
        items: {
          ...mealSchema,
          properties: {
            ...mealSchema.properties,
            alternatives: {
              type: Type.ARRAY,
              description: '2개의 대체 메뉴',
              items: mealSchema
            }
          },
           required: [...mealSchema.required, 'alternatives']
        }
      }
    },
    required: ['day', 'meals']
  }
};

const createPrompt = (profile: UserProfile): string => {
  return `
    System Instruction: 당신은 대한민국에 거주하는 바쁜 1인 가구를 위한 전문 영양사 및 예산 관리 AI입니다. 사용자의 프로필을 기반으로, 건강 목표를 달성하고 예산을 준수할 수 있는 7일치 맞춤 식단을 생성해주세요. 모든 응답은 제공된 JSON 스키마를 엄격히 따라야 합니다.

    User Profile:
    - 건강 목표: ${profile.goal}
    - 주간 예산: ${profile.budget.toLocaleString()}원
    - 알레르기: ${profile.allergies.length > 0 ? profile.allergies.join(', ') : '없음'}
    - 기피 식재료: ${profile.dislikes || '없음'}
    - 하루 식사 횟수: ${profile.mealsPerDay}끼
    - 선호 최대 조리 시간: ${profile.cookingTime}분

    Task:
    1.  사용자 프로필을 바탕으로 월요일부터 일요일까지 7일간의 식단을 계획하세요.
    2.  하루에 ${profile.mealsPerDay}끼의 식사를 추천해주세요.
    3.  각 식사마다 이름, 설명, 예상 비용(KRW), 조리 시간(분), 칼로리, 탄수화물, 혈당 영향(low/medium/high), 밀키트 구매 가능 여부를 포함해야 합니다.
    4.  각 기본 메뉴마다 **반드시 2개의 완전히 다른 대체 메뉴**를 제안해야 합니다. 대체 메뉴도 기본 메뉴와 동일한 모든 속성을 가져야 합니다.
    5.  알레르기 및 기피 식재료는 식단에서 **완전히 제외**해야 합니다.
    6.  7일간의 총 예상 비용이 사용자의 주간 예산(${profile.budget.toLocaleString()}원)을 초과하지 않도록 최적화해주세요. 예산 내에서 최대한 다양하고 영양가 있는 식단을 구성하세요.
    7.  모든 음식은 한국에서 쉽게 구할 수 있는 재료나 인기 있는 밀키트를 기반으로 제안해주세요.
    8.  응답은 반드시 JSON 형식이어야 합니다. 다른 설명은 추가하지 마세요.
    `;
};

export const generateMealPlan = async (profile: UserProfile): Promise<WeeklyPlan> => {
  try {
    const prompt = createPrompt(profile);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });
    
    const jsonString = response.text;
    if (!jsonString) {
        throw new Error("API가 비어있는 응답을 반환했습니다.");
    }

    const parsedPlan = JSON.parse(jsonString);
    return parsedPlan as WeeklyPlan;

  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error("Failed to generate meal plan from Gemini API.");
  }
};
