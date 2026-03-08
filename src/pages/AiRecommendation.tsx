import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const AiRecommendation = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { setBudget } = useAppContext();
  const [income, setIncome] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{ amount: number; reason: string } | null>(null);

  const handleRecommend = () => {
    if (!income || !goal) return;
    
    setLoading(true);
    
    // Simulate a calculation delay
    setTimeout(() => {
      const parsedIncome = parseInt(income.replace(/[^0-9]/g, ''), 10);
      
      // Simple rule: 60% of income for living expenses
      const recommendedAmount = Math.round(parsedIncome * 0.6);
      
      setRecommendation({
        amount: recommendedAmount,
        reason: `입력하신 월 수입 ${parsedIncome.toLocaleString()}원과 "${goal}" 목표를 바탕으로 계산된 권장 예산입니다. 일반적으로 수입의 60%를 생활비로 설정하고, 나머지를 저축이나 고정 지출로 활용하는 것을 권장합니다.`
      });
      
      setLoading(false);
    }, 1000);
  };

  const handleApply = () => {
    if (recommendation) {
      setBudget(recommendation.amount);
      onNavigate('home');
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setIncome(value);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Sparkles size={20} className="text-primary" />
          스마트 예산 추천
        </h1>
        <div className="w-10" />
      </div>

      <div className="px-6 flex-1 flex flex-col overflow-y-auto pb-24">
        {!recommendation ? (
          <div className="flex flex-col py-6">
            <h2 className="text-2xl font-bold mb-2">맞춤형 예산을<br/>추천해 드릴게요</h2>
            <p className="text-text-secondary text-sm mb-8">
              수입과 목표를 알려주시면 적절한 예산을 계산해 드립니다.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  월 평균 수입
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={income ? parseInt(income, 10).toLocaleString() : ''}
                    onChange={handleIncomeChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-lg font-bold focus:outline-none focus:border-primary transition-colors"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    원
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  이번 달 목표
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-primary transition-colors"
                  placeholder="예: 여행 자금 50만원 모으기"
                />
              </div>
            </div>

            <button
              onClick={handleRecommend}
              disabled={!income || !goal || loading}
              className="w-full py-4 rounded-2xl btn-accent text-white font-bold flex items-center justify-center gap-2 mt-10 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  계산 중...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  스마트 추천 받기
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col py-6 items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
              <Sparkles size={40} />
            </div>
            <h2 className="text-xl font-bold mb-2">추천하는 한 달 예산</h2>
            
            <div className="text-5xl font-bold text-primary my-6">
              {recommendation.amount.toLocaleString()}원
            </div>
            
            <div className="glass rounded-2xl p-6 mb-10 text-left">
              <p className="text-sm leading-relaxed">
                {recommendation.reason}
              </p>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-4 rounded-2xl btn-accent text-white font-bold flex items-center justify-center gap-2 transition-all"
            >
              이 예산으로 시작하기
            </button>
            <button
              onClick={() => setRecommendation(null)}
              className="w-full py-4 mt-3 rounded-2xl bg-white/5 text-white font-medium flex items-center justify-center transition-all hover:bg-white/10"
            >
              다시 추천받기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
