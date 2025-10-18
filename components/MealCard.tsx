import React from 'react';
import type { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  onSwap: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onSwap }) => {
  const impactColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 transition-shadow hover:shadow-md relative">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-indigo-600">{meal.mealType}</p>
          <h3 className="font-bold text-md text-slate-800 leading-tight">{meal.name}</h3>
        </div>
        <button onClick={onSwap} className="text-slate-400 hover:text-indigo-600 transition-colors">
          <i className="fas fa-exchange-alt"></i>
        </button>
      </div>
      
      <p className="text-xs text-slate-500 mt-2 mb-3">{meal.description}</p>
      
      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="bg-slate-200 px-2 py-1 rounded-full"><i className="fas fa-dollar-sign mr-1 opacity-70"></i>{meal.estimatedCost.toLocaleString()}원</span>
        <span className="bg-slate-200 px-2 py-1 rounded-full"><i className="fas fa-clock mr-1 opacity-70"></i>{meal.cookingTime}분</span>
        <span className="bg-slate-200 px-2 py-1 rounded-full"><i className="fas fa-fire mr-1 opacity-70"></i>{meal.calories}kcal</span>
        <span className="bg-slate-200 px-2 py-1 rounded-full"><i className="fas fa-bread-slice mr-1 opacity-70"></i>{meal.carbs}g</span>
        {meal.isMealKitAvailable && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"><i className="fas fa-box-open mr-1"></i>밀키트</span>}
        <span className={`${impactColors[meal.bloodSugarImpact]} px-2 py-1 rounded-full font-medium`}><i className="fas fa-wave-square mr-1"></i>혈당</span>
      </div>
    </div>
  );
};

export default MealCard;