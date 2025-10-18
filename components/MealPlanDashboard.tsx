import React, { useState, useMemo } from 'react';
import type { WeeklyPlan, UserProfile, Meal } from '../types';
import MealCard from './MealCard';
import BudgetTracker from './BudgetTracker';
import Modal from './Modal';

interface MealPlanDashboardProps {
  plan: WeeklyPlan;
  profile: UserProfile;
  onRegenerate: () => void;
  onReset: () => void;
}

const MealPlanDashboard: React.FC<MealPlanDashboardProps> = ({ plan, profile, onRegenerate, onReset }) => {
  const [currentPlan, setCurrentPlan] = useState(plan);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{ dayIndex: number; mealIndex: number; meal: Meal } | null>(null);

  const totalCost = useMemo(() => {
    return currentPlan.reduce((total, day) => {
      return total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.estimatedCost, 0);
    }, 0);
  }, [currentPlan]);

  const handleOpenSwapModal = (dayIndex: number, mealIndex: number, meal: Meal) => {
    setSelectedMealInfo({ dayIndex, mealIndex, meal });
    setModalOpen(true);
  };

  const handleSwapMeal = (alternative: Omit<Meal, 'alternatives'>) => {
    if (!selectedMealInfo) return;

    const { dayIndex, mealIndex, meal } = selectedMealInfo;

    const newPlan = [...currentPlan];
    const newMeal: Meal = {
        ...alternative,
        alternatives: [
            {...meal, alternatives: []}, 
            ...meal.alternatives.filter(alt => alt.name !== alternative.name)
        ].slice(0, 2)
    };
    newPlan[dayIndex].meals[mealIndex] = newMeal;
    
    setCurrentPlan(newPlan);
    setModalOpen(false);
    setSelectedMealInfo(null);
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">주간 맞춤 식단</h1>
        <p className="text-lg text-slate-600 mt-2">AI가 추천하는 당신만을 위한 건강하고 경제적인 일주일</p>
      </header>
      
      <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm py-4 mb-6">
        <div className="max-w-4xl mx-auto bg-white p-4 rounded-2xl shadow-md border border-slate-200">
           <BudgetTracker budget={profile.budget} currentCost={totalCost} />
           <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button onClick={onRegenerate} className="flex-1 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                <i className="fas fa-sync-alt mr-2"></i>식단 다시 생성하기
              </button>
              <button onClick={onReset} className="flex-1 bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm">
                 <i className="fas fa-undo mr-2"></i>처음으로
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentPlan.map((dailyPlan, dayIndex) => (
          <div key={dailyPlan.day} className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100 min-w-0">
            <h2 className="text-xl font-bold text-center mb-4 text-indigo-700">{dailyPlan.day}</h2>
            <div className="space-y-4">
              {dailyPlan.meals.map((meal, mealIndex) => (
                <MealCard 
                  key={`${meal.name}-${mealIndex}`} 
                  meal={meal} 
                  onSwap={() => handleOpenSwapModal(dayIndex, mealIndex, meal)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedMealInfo && (
          <div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">"{selectedMealInfo.meal.name}" 대체 메뉴</h3>
            <div className="space-y-3">
              {selectedMealInfo.meal.alternatives.map((alt, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:shadow-md hover:border-indigo-300 transition-all">
                  <div className="flex justify-between items-start">
                      <div>
                          <h4 className="font-bold text-lg text-indigo-800">{alt.name}</h4>
                          <div className="text-xs text-slate-500 mt-1 space-x-2">
                              <span><i className="fas fa-dollar-sign mr-1"></i>{alt.estimatedCost.toLocaleString()}원</span>
                              <span><i className="fas fa-clock mr-1"></i>{alt.cookingTime}분</span>
                              <span><i className="fas fa-fire mr-1"></i>{alt.calories}kcal</span>
                              <span><i className="fas fa-bread-slice mr-1"></i>{alt.carbs}g</span>
                          </div>
                      </div>
                      <button 
                        onClick={() => handleSwapMeal(alt)}
                        className="bg-indigo-500 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-indigo-600 transition-colors whitespace-nowrap"
                      >
                        선택
                      </button>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MealPlanDashboard;