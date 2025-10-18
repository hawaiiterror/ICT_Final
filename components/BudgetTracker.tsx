
import React from 'react';

interface BudgetTrackerProps {
  budget: number;
  currentCost: number;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budget, currentCost }) => {
  const percentage = Math.min((currentCost / budget) * 100, 100);
  const isOverBudget = currentCost > budget;

  const progressBarColor = isOverBudget ? 'bg-red-500' : 'bg-green-500';

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-600">주간 예산 사용량</span>
        <span className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-800'}`}>
          {currentCost.toLocaleString()}원 / {budget.toLocaleString()}원
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className={`${progressBarColor} h-2.5 rounded-full transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {isOverBudget && (
        <p className="text-xs text-red-600 text-right mt-1">
          예산 초과: {(currentCost - budget).toLocaleString()}원
        </p>
      )}
    </div>
  );
};

export default BudgetTracker;
