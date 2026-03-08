import React, { useState } from 'react';
import { ArrowLeft, Check, Target, Sparkles } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const BudgetSetting = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { budget, setBudget } = useAppContext();
  const [amount, setAmount] = useState(budget.toString());

  const handleSave = () => {
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numAmount) && numAmount > 0) {
      setBudget(numAmount);
      onNavigate('home');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const presetAmounts = [500000, 1000000, 1500000, 2000000, 3000000];

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
        <h1 className="text-lg font-bold">예산 설정</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="px-6 flex-1 flex flex-col">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
            <Target size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">한 달 예산을<br/>얼마로 설정할까요?</h2>
          <p className="text-text-secondary text-sm text-center mb-10">
            예산을 설정하고 계획적인 소비를 시작하세요
          </p>

          <div className="w-full relative mb-10">
            <input
              type="text"
              value={amount ? parseInt(amount, 10).toLocaleString() : ''}
              onChange={handleAmountChange}
              className="w-full bg-transparent border-b-2 border-primary/50 text-center text-4xl font-bold py-4 focus:outline-none focus:border-primary transition-colors"
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-text-secondary">
              원
            </span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="px-4 py-2 rounded-full glass text-sm font-medium hover:bg-white/10 transition-colors"
              >
                +{preset.toLocaleString()}원
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('ai_recommendation')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-primary/20 border border-primary/30 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/30 transition-all"
          >
            <Sparkles size={20} />
            스마트 맞춤 예산 추천받기
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6">
        <button
          onClick={handleSave}
          disabled={!amount || parseInt(amount, 10) <= 0}
          className="w-full py-4 rounded-2xl btn-accent text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Check size={20} />
          저장하기
        </button>
      </div>
    </div>
  );
};
