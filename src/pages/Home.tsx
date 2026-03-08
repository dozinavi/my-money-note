import React from 'react';
import { Bell, Plus, Utensils, Car, Wallet, Clapperboard, ShoppingBag, ShoppingCart, Receipt, Plane, PlusSquare, Dumbbell, MoreHorizontal, Coffee, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { cn } from '../utils/cn';

export const Home = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { balance, setBalance, budget, transactions, userProfile, securitySettings, categories, deleteTransaction, setEditingTransaction } = useAppContext();
  const [isEditingBalance, setIsEditingBalance] = React.useState(false);
  const [newBalance, setNewBalance] = React.useState('');
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const handleEditTransaction = (tx: any) => {
    setEditingTransaction(tx);
    onNavigate('add');
    setOpenMenuId(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('이 내역을 삭제하시겠습니까?')) {
      deleteTransaction(id);
    }
    setOpenMenuId(null);
  };

  const handleBalanceSave = () => {
    const amount = parseInt(newBalance, 10);
    if (!isNaN(amount)) {
      setBalance(amount);
      setIsEditingBalance(false);
    }
  };
  
  const usedBudget = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const budgetPercentage = Math.min(Math.round((usedBudget / budget) * 100), 100);
  const remainingBudget = budget - usedBudget;

  const getIconForCategory = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return Utensils;
      case 'Car': return Car;
      case 'ShoppingBag': return ShoppingBag;
      case 'ShoppingCart': return ShoppingCart;
      case 'Receipt': return Receipt;
      case 'Plane': return Plane;
      case 'PlusSquare': return PlusSquare;
      case 'Dumbbell': return Dumbbell;
      case 'Wallet': return Wallet;
      case 'Clapperboard': return Clapperboard;
      case 'Coffee': return Coffee;
      default: return MoreHorizontal;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-12 bg-transparent">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center overflow-hidden">
            {userProfile.profileImage ? (
              <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full btn-accent flex items-center justify-center text-white font-bold text-sm">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-text-secondary text-sm">환영합니다,</p>
            <p className="font-bold text-lg">{userProfile.name}</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('notifications')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-white relative hover:bg-white/10 transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Total Balance / Current Assets */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <p className="text-text-secondary text-sm">현재 자산</p>
          <button 
            onClick={() => {
              setNewBalance(balance.toString());
              setIsEditingBalance(true);
            }}
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <Edit2 size={14} />
          </button>
        </div>
        
        {isEditingBalance ? (
          <div className="flex items-center justify-center gap-2 mb-4">
            <input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="bg-surface-dark text-white text-2xl font-bold rounded-lg px-2 py-1 w-40 text-center focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <button 
              onClick={handleBalanceSave}
              className="bg-primary text-white px-3 py-1 rounded-lg font-bold text-sm"
            >
              저장
            </button>
          </div>
        ) : (
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {securitySettings.hideBalance ? '***' : `${balance.toLocaleString()}원`}
          </h1>
        )}

        {/* Monthly Summary */}
        <div className="flex justify-center gap-4">
          <div className="bg-surface-dark/50 rounded-2xl px-5 py-3 flex-1 max-w-[140px]">
            <p className="text-xs text-text-secondary mb-1">이번 달 수입</p>
            <p className="text-sm font-bold text-emerald-500">+{transactions
              .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toLocaleString()}
            </p>
          </div>
          <div className="bg-surface-dark/50 rounded-2xl px-5 py-3 flex-1 max-w-[140px]">
            <p className="text-xs text-text-secondary mb-1">이번 달 지출</p>
            <p className="text-sm font-bold text-red-500">-{transactions
              .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Card */}
      <div 
        onClick={() => onNavigate('budget_setting')}
        className="flex items-center gap-6 mb-12 cursor-pointer hover:bg-white/5 p-4 -mx-4 rounded-2xl transition-colors"
      >
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-surface-dark"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * budgetPercentage) / 100}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{budgetPercentage}%</span>
            <span className="text-xs text-text-secondary">사용됨</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-text-secondary text-sm mb-1">이달의 예산</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{usedBudget.toLocaleString()}원</span>
              <span className="text-sm text-text-secondary">/ {budget.toLocaleString()}원</span>
            </div>
          </div>
          <div>
            <p className="text-text-secondary text-sm mb-1">남은 금액</p>
            <p className="text-xl font-bold text-primary">{remainingBudget.toLocaleString()}원</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">최근 거래</h2>
          <button 
            onClick={() => onNavigate('transactions')}
            className="text-primary text-sm font-medium"
          >
            전체 보기
          </button>
        </div>

        <div className="space-y-6">
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 4).map((tx) => {
                const txDate = new Date(tx.date);
                const isToday = new Date().toDateString() === txDate.toDateString();
                const dateLabel = isToday 
                  ? `오늘, ${txDate.getMonth() + 1}월 ${txDate.getDate()}일` 
                  : `${txDate.getMonth() + 1}월 ${txDate.getDate()}일`;

                const cat = categories.find(c => c.id === tx.categoryId);
                const Icon = getIconForCategory(cat?.icon || '');

                return (
                  <div 
                    key={tx.id} 
                    className={cn(
                      "glass rounded-2xl p-4 flex items-center gap-4 relative transition-all",
                      openMenuId === tx.id ? "z-30 scale-[1.02] shadow-xl" : "z-0"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", cat?.color || 'bg-gray-500/20')}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{tx.merchant}</p>
                      <p className="text-text-secondary text-sm">{dateLabel} • {tx.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold text-lg",
                        tx.type === 'expense' ? "text-red-500" : "text-primary"
                      )}>
                        {tx.type === 'expense' ? '-' : '+'}{tx.amount.toLocaleString()}원
                      </p>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === tx.id ? null : tx.id);
                        }}
                        className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-white/10 transition-colors"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      
                      {openMenuId === tx.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-full mt-2 w-32 bg-[#1a0b2e] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => handleEditTransaction(tx)}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center gap-2"
                            >
                              <Edit2 size={14} /> 수정
                            </button>
                            <button 
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-red-500 flex items-center gap-2"
                            >
                              <Trash2 size={14} /> 삭제
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-text-secondary">
              최근 거래 내역이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button 
        onClick={() => onNavigate('add')}
        className="absolute bottom-24 right-6 w-16 h-16 btn-accent rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform z-50"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};
