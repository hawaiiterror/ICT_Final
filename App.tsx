
import React, { useState, useCallback } from 'react';
import Onboarding from './components/Onboarding';
import MealPlanDashboard from './components/MealPlanDashboard';
import Loader from './components/Loader';
import type { UserProfile, WeeklyPlan } from './types';
import { generateMealPlan } from './services/geminiService';

type AppState = 'onboarding' | 'loading' | 'dashboard' | 'error';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [error, setError] = useState<string | null>(null);

  const handleOnboardingSubmit = useCallback(async (profile: UserProfile) => {
    setAppState('loading');
    setUserProfile(profile);
    setError(null);
    try {
      const plan = await generateMealPlan(profile);
      setWeeklyPlan(plan);
      setAppState('dashboard');
    } catch (err) {
      console.error(err);
      setError('식단 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setAppState('error');
    }
  }, []);
  
  const handleRegenerate = useCallback(() => {
    if (userProfile) {
      handleOnboardingSubmit(userProfile);
    }
  }, [userProfile, handleOnboardingSubmit]);

  const handleReset = () => {
    setAppState('onboarding');
    setUserProfile(null);
    setWeeklyPlan(null);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case 'onboarding':
        return <Onboarding onSubmit={handleOnboardingSubmit} />;
      case 'loading':
        return <Loader message="Gemini AI가 당신만을 위한 주간 식단을 만들고 있어요..." />;
      case 'dashboard':
        if (weeklyPlan && userProfile) {
          return (
            <MealPlanDashboard 
              plan={weeklyPlan} 
              profile={userProfile} 
              onRegenerate={handleRegenerate}
              onReset={handleReset} 
            />
          );
        }
        return null;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
              <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">오류 발생</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                다시 시작하기
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen text-slate-800">
      {renderContent()}
    </main>
  );
};

export default App;
