import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, Coffee, ShoppingCart, Car, Wallet, Utensils, Clapperboard, MoreHorizontal, X, ShoppingBag, Receipt, Plane, PlusSquare, Dumbbell, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { cn } from '../utils/cn';
import { format, isToday, isYesterday, parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';

export const TransactionList = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { transactions, categories, deleteTransaction, setEditingTransaction } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
  
  // Filter states
  const [activeFilter, setActiveFilter] = useState<'period' | 'category' | 'sort' | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'thisMonth' | 'lastMonth'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const getCategory = (id: string) => {
    return categories.find(c => c.id === id);
  };

  const getCategoryName = (id: string) => {
    return getCategory(id)?.name || '기타';
  };

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

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => 
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryName(tx.categoryId).toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Period filter
    const now = new Date();
    if (selectedPeriod === 'thisMonth') {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      filtered = filtered.filter(tx => isWithinInterval(parseISO(tx.date), { start, end }));
    } else if (selectedPeriod === 'lastMonth') {
      const lastMonth = subMonths(now, 1);
      const start = startOfMonth(lastMonth);
      const end = endOfMonth(lastMonth);
      filtered = filtered.filter(tx => isWithinInterval(parseISO(tx.date), { start, end }));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tx => tx.categoryId === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === 'highest') return b.amount - a.amount;
      if (sortOrder === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return filtered;
  }, [transactions, searchQuery, selectedPeriod, selectedCategory, categories, sortOrder]);

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups: any, tx) => {
    const date = parseISO(tx.date);
    let dateLabel = '';
    
    if (isToday(date)) {
      dateLabel = '오늘';
    } else if (isYesterday(date)) {
      dateLabel = '어제';
    } else {
      dateLabel = format(date, 'yyyy년 M월 d일', { locale: ko });
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(tx);
    return groups;
  }, {});

  const getPeriodLabel = () => {
    if (selectedPeriod === 'thisMonth') return '이번 달';
    if (selectedPeriod === 'lastMonth') return '지난 달';
    return '전체 기간';
  };

  const getCategoryLabel = () => {
    if (selectedCategory === 'all') return '모든 카테고리';
    return getCategoryName(selectedCategory);
  };

  return (
    <div className="flex flex-col h-full bg-bg-dark relative">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pb-4 border-b border-border-dark sticky top-0 bg-bg-dark z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 -ml-2 text-text-primary hover:bg-surface-dark rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">내역</h2>
        </div>
        <button 
          onClick={() => setActiveFilter(activeFilter === 'sort' ? null : 'sort')}
          className="p-2 text-text-primary hover:bg-surface-dark rounded-full transition-colors"
        >
          <SlidersHorizontal size={24} />
        </button>
      </div>

      {/* Search & Filters */}
      <div className="px-4 py-4 space-y-4 bg-bg-dark sticky top-[73px] z-10 border-b border-border-dark">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={20} className="text-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="내역 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-dark text-text-primary rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary placeholder-text-secondary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setActiveFilter(activeFilter === 'period' ? null : 'period')}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedPeriod !== 'all' || activeFilter === 'period' 
                ? "bg-primary/20 border border-primary/30 text-primary" 
                : "bg-surface-dark border border-border-dark text-text-primary"
            )}
          >
            {getPeriodLabel()} <ChevronDown size={16} className={cn("transition-transform", activeFilter === 'period' && "rotate-180")} />
          </button>
          <button 
            onClick={() => setActiveFilter(activeFilter === 'category' ? null : 'category')}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedCategory !== 'all' || activeFilter === 'category'
                ? "bg-primary/20 border border-primary/30 text-primary" 
                : "bg-surface-dark border border-border-dark text-text-primary"
            )}
          >
            {getCategoryLabel()} <ChevronDown size={16} className={cn("transition-transform", activeFilter === 'category' && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Filter Dropdowns */}
      {activeFilter && (
        <div className="absolute top-[180px] left-0 right-0 z-20 px-4">
          <div className="bg-surface-dark border border-border-dark rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
            {activeFilter === 'sort' && (
              <div className="flex flex-col bg-[#1a0b2e] rounded-xl">
                <button 
                  onClick={() => { setSortOrder('newest'); setActiveFilter(null); }}
                  className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", sortOrder === 'newest' && "text-primary font-bold")}
                >
                  최신순
                </button>
                <button 
                  onClick={() => { setSortOrder('oldest'); setActiveFilter(null); }}
                  className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", sortOrder === 'oldest' && "text-primary font-bold")}
                >
                  과거순
                </button>
                <button 
                  onClick={() => { setSortOrder('highest'); setActiveFilter(null); }}
                  className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", sortOrder === 'highest' && "text-primary font-bold")}
                >
                  높은 금액순
                </button>
                <button 
                  onClick={() => { setSortOrder('lowest'); setActiveFilter(null); }}
                  className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", sortOrder === 'lowest' && "text-primary font-bold")}
                >
                  낮은 금액순
                </button>
              </div>
            )}
            
            {activeFilter === 'period' && (
              <div className="flex flex-col bg-[#1a0b2e] rounded-xl">
                <button 
                  onClick={() => { setSelectedPeriod('all'); setActiveFilter(null); }}
                  className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", selectedPeriod === 'all' && "text-primary font-bold")}
                >
                  전체 기간
                </button>
                <button 
                  onClick={() => { setSelectedPeriod('thisMonth'); setActiveFilter(null); }}
                  className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", selectedPeriod === 'thisMonth' && "text-primary font-bold")}
                >
                  이번 달
                </button>
                <button 
                  onClick={() => { setSelectedPeriod('lastMonth'); setActiveFilter(null); }}
                  className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", selectedPeriod === 'lastMonth' && "text-primary font-bold")}
                >
                  지난 달
                </button>
              </div>
            )}
            
            {activeFilter === 'category' && (
              <div className="flex flex-col max-h-64 overflow-y-auto no-scrollbar bg-[#1a0b2e] rounded-xl">
                <button 
                  onClick={() => { setSelectedCategory('all'); setActiveFilter(null); }}
                  className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", selectedCategory === 'all' && "text-primary font-bold")}
                >
                  모든 카테고리
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setActiveFilter(null); }}
                    className={cn("text-left px-4 py-3 rounded-xl hover:bg-white/5", selectedCategory === cat.id && "text-primary font-bold")}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Invisible backdrop to close dropdown */}
          <div className="fixed inset-0 z-[-1]" onClick={() => setActiveFilter(null)} />
        </div>
      )}

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto pb-24">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-10 text-text-secondary">
            검색 결과가 없습니다.
          </div>
        ) : (
          Object.keys(groupedTransactions).map((dateLabel) => (
            <div key={dateLabel} className="mb-2">
              <div className="px-6 py-3">
                <h3 className="text-sm font-bold text-text-secondary">{dateLabel}</h3>
              </div>
              
              <div className="space-y-1">
                {groupedTransactions[dateLabel].map((tx: any) => {
                  const cat = getCategory(tx.categoryId);
                  const Icon = getIconForCategory(cat?.icon || '');
                  return (
                    <div 
                      key={tx.id} 
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 hover:bg-surface-dark transition-all cursor-pointer relative",
                        openMenuId === tx.id ? "z-30 bg-surface-dark shadow-xl" : "z-0"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", cat?.color || 'bg-gray-500/20')}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate">{tx.merchant}</p>
                        <p className="text-text-secondary text-sm truncate">
                          {format(parseISO(tx.date), 'M월 d일')} • {cat?.name || '기타'} • {tx.paymentMethod}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={cn(
                          "font-bold text-lg",
                          tx.type === 'expense' ? "text-text-primary" : "text-primary"
                        )}>
                          {tx.type === 'expense' ? '' : '+'}{tx.amount.toLocaleString()}원
                        </p>
                      </div>
                      
                      <div className="relative shrink-0">
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
                                onClick={(e) => { e.stopPropagation(); handleEditTransaction(tx); }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center gap-2"
                              >
                                <Edit2 size={14} /> 수정
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteTransaction(tx.id); }}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

