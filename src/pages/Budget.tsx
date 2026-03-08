import React, { useState } from 'react';
import { Wallet, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const Budget = () => {
  const { budget, transactions, categories } = useAppContext();
  const [activeTab, setActiveTab] = useState<'monthly' | 'category'>('monthly');

  const usedBudget = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const remainingBudget = budget - usedBudget;
  const budgetPercentage = Math.min(Math.round((usedBudget / budget) * 100), 100);

  // Calculate category budgets (mock data for demonstration)
  const categoryBudgets = categories.filter(c => c.id !== 'c9').map(cat => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    // Mock allocated budget based on category
    let allocated = 500000;
    if (cat.name === '식비') allocated = 1000000;
    if (cat.name === '주거비') allocated = 800000;
    if (cat.name === '교통') allocated = 300000;

    const percentage = Math.min(Math.round((spent / allocated) * 100), 100);
    
    return {
      ...cat,
      spent,
      allocated,
      percentage
    };
  }).sort((a, b) => b.spent - a.spent);

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-12 bg-bg-dark">
      <h1 className="text-2xl font-bold mb-6">예산 관리</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-dark mb-8">
        <button 
          onClick={() => setActiveTab('monthly')}
          className={`pb-2 font-bold transition-colors ${activeTab === 'monthly' ? 'border-b-2 border-primary text-text-primary' : 'text-text-secondary'}`}
        >
          월간 예산
        </button>
        <button 
          onClick={() => setActiveTab('category')}
          className={`pb-2 font-bold transition-colors ${activeTab === 'category' ? 'border-b-2 border-primary text-text-primary' : 'text-text-secondary'}`}
        >
          카테고리별
        </button>
      </div>

      {activeTab === 'monthly' ? (
        <div className="space-y-6">
          {/* Main Budget Card */}
          <div className="bg-surface-dark rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-text-secondary text-sm">이달의 총 예산</p>
                <p className="font-bold text-xl">{budget.toLocaleString()}원</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">사용 금액</span>
                <span className="font-bold">{usedBudget.toLocaleString()}원</span>
              </div>
              <div className="h-3 bg-bg-dark rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${budgetPercentage > 90 ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-text-secondary">{budgetPercentage}%</span>
                <span className="text-primary font-bold">남음: {remainingBudget.toLocaleString()}원</span>
              </div>
            </div>

            {budgetPercentage > 80 && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-500 font-bold text-sm mb-1">예산 초과 주의</p>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    이번 달 예산의 80% 이상을 사용했습니다. 남은 기간 동안 지출을 조절해 보세요.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          <h3 className="text-lg font-bold mt-8 mb-4">예산 인사이트</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-dark rounded-2xl p-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-3">
                <TrendingUp size={16} />
              </div>
              <p className="text-text-secondary text-xs mb-1">일일 권장 지출</p>
              <p className="font-bold text-lg">{Math.round(remainingBudget / 7).toLocaleString()}원</p>
            </div>
            <div className="bg-surface-dark rounded-2xl p-4">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mb-3">
                <AlertCircle size={16} />
              </div>
              <p className="text-text-secondary text-xs mb-1">가장 큰 지출</p>
              <p className="font-bold text-lg">식비</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {categoryBudgets.map((cat) => (
            <div key={cat.id} className="bg-surface-dark rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${cat.color}`}>
                    {cat.name.charAt(0)}
                  </div>
                  <span className="font-bold">{cat.name}</span>
                </div>
                <button className="text-text-secondary hover:text-text-primary">
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold">{cat.spent.toLocaleString()}원</span>
                <span className="text-text-secondary">/ {cat.allocated.toLocaleString()}원</span>
              </div>
              
              <div className="h-2 bg-bg-dark rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${cat.percentage > 90 ? 'bg-red-500' : cat.percentage > 75 ? 'bg-orange-500' : 'bg-primary'}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
