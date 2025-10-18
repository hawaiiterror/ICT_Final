
import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface OnboardingProps {
  onSubmit: (profile: UserProfile) => void;
}

const ALLERGY_OPTIONS = ["견과류", "갑각류", "유제품", "밀", "생선", "계란", "대두"];

const Onboarding: React.FC<OnboardingProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    goal: '혈당 변동 최소화',
    budget: 70000,
    allergies: [],
    dislikes: '',
    mealsPerDay: 3,
    cookingTime: 30,
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleAllergyToggle = (allergy: string) => {
    setProfile(prev => {
      const newAllergies = prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy];
      return { ...prev, allergies: newAllergies };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };
  
  const steps = [
    // Step 0: Goal
    <div>
      <h2 className="text-2xl font-bold mb-2 text-slate-800">가장 중요한 건강 목표는 무엇인가요?</h2>
      <p className="text-slate-500 mb-6">목표에 맞춰 식단을 최적화해드려요.</p>
      <div className="space-y-3">
        {['혈당 변동 최소화', '체중 감량', '근육량 증가', '건강 유지'].map(g => (
          <button key={g} onClick={() => setProfile(p => ({...p, goal: g}))} className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${profile.goal === g ? 'bg-indigo-100 border-indigo-500 text-indigo-700 font-semibold' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
            {g}
          </button>
        ))}
      </div>
    </div>,
    // Step 1: Budget
    <div>
      <h2 className="text-2xl font-bold mb-2 text-slate-800">주간 식비 예산을 알려주세요.</h2>
      <p className="text-slate-500 mb-6">설정된 예산 안에서 최고의 식단을 찾아드릴게요.</p>
      <div className="relative">
        <input type="range" name="budget" min="30000" max="150000" step="5000" value={profile.budget} onChange={handleNumberChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
        <div className="text-center text-2xl font-bold text-indigo-600 mt-4">{profile.budget.toLocaleString()}원</div>
      </div>
    </div>,
    // Step 2: Allergies
    <div>
      <h2 className="text-2xl font-bold mb-2 text-slate-800">알레르기가 있나요?</h2>
      <p className="text-slate-500 mb-6">해당하는 항목을 모두 선택해주세요. 안전이 최우선이에요.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ALLERGY_OPTIONS.map(allergy => (
          <button key={allergy} onClick={() => handleAllergyToggle(allergy)} className={`p-3 rounded-lg border-2 transition-all duration-200 ${profile.allergies.includes(allergy) ? 'bg-indigo-100 border-indigo-500 text-indigo-700 font-semibold' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
            {allergy}
          </button>
        ))}
      </div>
    </div>,
    // Step 3: Dislikes
    <div>
      <h2 className="text-2xl font-bold mb-2 text-slate-800">싫어하거나 피하는 음식이 있나요?</h2>
      <p className="text-slate-500 mb-6">쉼표(,)로 구분하여 알려주시면 식단에서 제외할게요.</p>
      <textarea name="dislikes" value={profile.dislikes} onChange={handleChange} placeholder="예: 오이, 가지, 고수" className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
    </div>,
    // Step 4: Meals per day & Cooking time
    <div>
       <h2 className="text-2xl font-bold mb-2 text-slate-800">식사 스타일을 알려주세요.</h2>
       <p className="text-slate-500 mb-8">하루 식사 횟수와 선호하는 조리 시간을 설정해주세요.</p>
       <div className="space-y-8">
        <div>
          <label className="font-semibold text-slate-700">하루 식사 횟수</label>
          <input type="range" name="mealsPerDay" min="1" max="3" step="1" value={profile.mealsPerDay} onChange={handleNumberChange} className="w-full h-2 mt-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
          <div className="text-center text-xl font-bold text-indigo-600 mt-2">{profile.mealsPerDay}끼</div>
        </div>
        <div>
          <label className="font-semibold text-slate-700">최대 조리 시간</label>
          <input type="range" name="cookingTime" min="10" max="60" step="5" value={profile.cookingTime} onChange={handleNumberChange} className="w-full h-2 mt-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
          <div className="text-center text-xl font-bold text-indigo-600 mt-2">{profile.cookingTime}분 이내</div>
        </div>
       </div>
    </div>
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="mb-6">
            <div className="h-2 w-full bg-slate-200 rounded-full">
              <div className="h-2 bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {steps[step]}
            <div className="mt-8 flex justify-between">
              {step > 0 ? (
                <button type="button" onClick={handleBack} className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors">
                  이전
                </button>
              ) : <div></div>}
              {step < steps.length - 1 ? (
                <button type="button" onClick={handleNext} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                  다음
                </button>
              ) : (
                <button type="submit" className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors">
                  나만의 식단 만들기
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
