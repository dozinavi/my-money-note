import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Utensils, Home as HomeIcon, Car, Clapperboard, Wifi, Plus, Trash2, ShoppingBag, Receipt, Plane, PlusSquare, Dumbbell, MoreHorizontal, Wallet, X, ShoppingCart, Coffee, Edit2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAppContext } from '../store/AppContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO, subWeeks, subYears, isWithinInterval, startOfWeek, endOfWeek, isSameMonth, isSameYear, startOfYear, endOfYear, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '../utils/cn';

export const Analytics = () => {
  const { transactions, categories, fixedExpenses, addFixedExpense, deleteFixedExpense, updateFixedExpense } = useAppContext();
  const [activeTab, setActiveTab] = useState<'monthly' | 'fixed' | 'trends'>('monthly');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategoryForDetails, setSelectedCategoryForDetails] = useState<string | null>(null);
  const [editingFixedId, setEditingFixedId] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setSelectedDate(prev => prev ? addDays(prev, 1) : null);
    }
    if (isRightSwipe) {
      setSelectedDate(prev => prev ? subDays(prev, 1) : null);
    }
  };
  
  // Trends State
  const [trendType, setTrendType] = useState<'period' | 'category'>('period');
  const [trendPeriod, setTrendPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [trendCount, setTrendCount] = useState<number>(6);
  const [trendCategory, setTrendCategory] = useState<string>('all');
  const [categoryComparePeriod, setCategoryComparePeriod] = useState<'thisWeek' | 'thisMonth' | 'thisYear'>('thisMonth');

  // Fixed Expense Form State
  const [showFixedForm, setShowFixedForm] = useState(false);
  const [newFixedName, setNewFixedName] = useState('');
  const [newFixedAmount, setNewFixedAmount] = useState('');
  const [newFixedDay, setNewFixedDay] = useState('1');
  const [newFixedCategory, setNewFixedCategory] = useState('c1');

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDailyTotal = (date: Date) => {
    return transactions
      .filter(t => t.type === 'expense' && isSameDay(parseISO(t.date), date))
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Calculate dynamic pie chart data
  const monthlyExpenses = transactions.filter(t => 
    t.type === 'expense' && 
    new Date(t.date).getMonth() === currentMonth.getMonth() &&
    new Date(t.date).getFullYear() === currentMonth.getFullYear()
  );

  const expensesByCategory = monthlyExpenses.reduce((acc, curr) => {
    acc[curr.categoryId] = (acc[curr.categoryId] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const colorPalette = ['#13ec80', '#3b82f6', '#f472b6', '#fbbf24', '#a855f7', '#ef4444', '#f97316', '#14b8a6'];

  const data = Object.entries(expensesByCategory)
    .map(([categoryId, value]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        id: categoryId,
        name: category?.name || '기타',
        value: value as number,
        color: '', // Will be assigned later
        iconName: category?.icon || 'MoreHorizontal',
      };
    })
    .sort((a, b) => b.value - a.value) // Sort by highest expense
    .map((item, index) => ({
      ...item,
      color: colorPalette[index % colorPalette.length]
    }));

  const totalExpense = data.reduce((acc, curr) => acc + curr.value, 0);
  const maxCategory = data.length > 0 ? data[0].name : '없음';
  const totalFixed = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0);

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

  const handleSaveFixedExpense = () => {
    const amount = parseInt(newFixedAmount, 10);
    if (newFixedName && amount > 0) {
      if (editingFixedId) {
        updateFixedExpense(editingFixedId, {
          name: newFixedName,
          amount,
          dayOfMonth: parseInt(newFixedDay, 10),
          categoryId: newFixedCategory,
        });
        setEditingFixedId(null);
      } else {
        addFixedExpense({
          name: newFixedName,
          amount,
          dayOfMonth: parseInt(newFixedDay, 10),
          categoryId: newFixedCategory,
        });
      }
      setShowFixedForm(false);
      setNewFixedName('');
      setNewFixedAmount('');
      setNewFixedDay('1');
      setNewFixedCategory('c1');
    }
  };

  const handleEditFixedExpense = (expense: any) => {
    setNewFixedName(expense.name);
    setNewFixedAmount(expense.amount.toString());
    setNewFixedDay(expense.dayOfMonth.toString());
    setNewFixedCategory(expense.categoryId);
    setEditingFixedId(expense.id);
    setShowFixedForm(true);
  };

  const getTrendData = () => {
    const now = new Date();
    const data = [];
    let expenses = transactions.filter(t => t.type === 'expense');

    if (trendCategory !== 'all') {
      expenses = expenses.filter(t => t.categoryId === trendCategory);
    }

    if (trendPeriod === 'weekly') {
      for (let i = trendCount - 1; i >= 0; i--) {
        const targetDate = subWeeks(now, i);
        const start = startOfWeek(targetDate, { weekStartsOn: 1 });
        const end = endOfWeek(targetDate, { weekStartsOn: 1 });
        const total = expenses
          .filter(t => isWithinInterval(parseISO(t.date), { start, end }))
          .reduce((sum, t) => sum + t.amount, 0);
        data.push({
          name: `${format(start, 'M/d')}`,
          value: total,
          fullLabel: `${format(start, 'M/d')} ~ ${format(end, 'M/d')}`
        });
      }
    } else if (trendPeriod === 'monthly') {
      for (let i = trendCount - 1; i >= 0; i--) {
        const targetDate = subMonths(now, i);
        const total = expenses
          .filter(t => isSameMonth(parseISO(t.date), targetDate))
          .reduce((sum, t) => sum + t.amount, 0);
        data.push({
          name: format(targetDate, 'M월'),
          value: total,
          fullLabel: format(targetDate, 'yyyy년 M월')
        });
      }
    } else if (trendPeriod === 'yearly') {
      for (let i = trendCount - 1; i >= 0; i--) {
        const targetDate = subYears(now, i);
        const total = expenses
          .filter(t => isSameYear(parseISO(t.date), targetDate))
          .reduce((sum, t) => sum + t.amount, 0);
        data.push({
          name: format(targetDate, 'yyyy년'),
          value: total,
          fullLabel: format(targetDate, 'yyyy년')
        });
      }
    }
    return data;
  };

  const getCategoryCompareData = () => {
    const now = new Date();
    let start, end;
    if (categoryComparePeriod === 'thisWeek') {
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
    } else if (categoryComparePeriod === 'thisMonth') {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      start = startOfYear(now);
      end = endOfYear(now);
    }

    const expenses = transactions.filter(t => t.type === 'expense' && isWithinInterval(parseISO(t.date), { start, end }));
    
    const grouped = expenses.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([id, amount]) => ({
        name: categories.find(c => c.id === id)?.name || '기타',
        value: amount,
        fullLabel: categories.find(c => c.id === id)?.name || '기타'
      }))
      .sort((a, b) => (b.value as number) - (a.value as number));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-12">
      <h1 className="text-2xl font-bold mb-6">지출 분석</h1>
      
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-dark mb-8">
        <button 
          onClick={() => setActiveTab('monthly')}
          className={`pb-2 font-bold transition-colors ${activeTab === 'monthly' ? 'border-b-2 border-primary text-text-primary' : 'text-text-secondary'}`}
        >
          월별
        </button>
        <button 
          onClick={() => setActiveTab('fixed')}
          className={`pb-2 font-bold transition-colors ${activeTab === 'fixed' ? 'border-b-2 border-primary text-text-primary' : 'text-text-secondary'}`}
        >
          고정 지출
        </button>
        <button 
          onClick={() => setActiveTab('trends')}
          className={`pb-2 font-bold transition-colors ${activeTab === 'trends' ? 'border-b-2 border-primary text-text-primary' : 'text-text-secondary'}`}
        >
          기간별 비교
        </button>
      </div>

      {activeTab === 'monthly' && (
        <>
          {/* Month Selector */}
          <div className="flex justify-between items-center mb-8 px-4">
            <button onClick={handlePrevMonth} className="p-2 text-text-secondary hover:text-text-primary">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold">{format(currentMonth, 'yyyy년 M월', { locale: ko })}</h2>
            <button onClick={handleNextMonth} className="p-2 text-text-secondary hover:text-text-primary">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 mb-10 text-center">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="text-sm text-text-secondary font-medium mb-2">{day}</div>
            ))}
            {emptyDays.map(empty => (
              <div key={`empty-${empty}`} className="py-2"></div>
            ))}
            {daysInMonth.map(date => {
              const dailyTotal = getDailyTotal(date);
              const isToday = isSameDay(date, new Date());
              return (
                <div 
                  key={date.toISOString()} 
                  className="flex flex-col items-center cursor-pointer hover:bg-white/5 rounded-lg p-1 transition-colors"
                  onClick={() => setSelectedDate(date)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1",
                    isToday ? "bg-primary text-black font-bold" : "text-text-primary",
                    dailyTotal > 0 && !isToday ? "font-bold" : ""
                  )}>
                    {format(date, 'd')}
                  </div>
                  {dailyTotal > 0 ? (
                    <div className="text-[10px] text-text-secondary truncate w-full px-1">
                      {dailyTotal > 10000 ? `${Math.floor(dailyTotal/10000)}만` : dailyTotal.toLocaleString()}
                    </div>
                  ) : (
                    <div className="h-3"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total Expense & Chart */}
          <div className="bg-surface-dark rounded-3xl p-6 mb-6">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-text-secondary text-sm mb-1">총 지출</p>
                <h2 className="text-3xl font-bold">{totalExpense.toLocaleString()}원</h2>
              </div>
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                <span>↘</span> -5.2%
              </div>
            </div>

            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-text-secondary">최대 지출</span>
                <span className="text-xl font-bold">{maxCategory}</span>
              </div>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {data.length > 0 ? (
              data.map((item) => {
                const Icon = getIconForCategory(item.iconName);
                const percentage = Math.round((item.value / totalExpense) * 100);
                return (
                  <button 
                    key={item.id} 
                    onClick={() => setSelectedCategoryForDetails(item.id)}
                    className="w-full bg-surface-dark rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}33`, color: item.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg truncate">{item.name}</p>
                      <p className="text-text-secondary text-sm">{percentage}%</p>
                    </div>
                    <p className="font-bold text-lg shrink-0">{item.value.toLocaleString()}원</p>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-10 text-text-secondary">
                이번 달 지출 내역이 없습니다.
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'fixed' && (
        <div className="space-y-6">
          <div className="bg-surface-dark rounded-3xl p-6 mb-6 flex justify-between items-center">
            <div>
              <p className="text-text-secondary text-sm mb-1">이번 달 고정 지출 예상액</p>
              <h2 className="text-3xl font-bold text-primary">{totalFixed.toLocaleString()}원</h2>
            </div>
            <button 
              onClick={() => setShowFixedForm(true)}
              className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {showFixedForm && (
            <div className="bg-surface-dark rounded-2xl p-4 space-y-4 border border-primary/30">
              <h3 className="font-bold">{editingFixedId ? '고정 지출 수정' : '새 고정 지출 추가'}</h3>
              <input 
                type="text" placeholder="지출명 (예: 넷플릭스)" 
                value={newFixedName} onChange={e => setNewFixedName(e.target.value)}
                className="w-full bg-bg-dark rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input 
                type="number" placeholder="금액" 
                value={newFixedAmount} onChange={e => setNewFixedAmount(e.target.value)}
                className="w-full bg-bg-dark rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex gap-2">
                <select 
                  value={newFixedDay} onChange={e => setNewFixedDay(e.target.value)}
                  className="flex-1 bg-bg-dark rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                    <option key={d} value={d} className="bg-[#1a1a1a] text-text-primary">매월 {d}일</option>
                  ))}
                </select>
                <select 
                  value={newFixedCategory} onChange={e => setNewFixedCategory(e.target.value)}
                  className="flex-1 bg-bg-dark rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {categories.filter(c => c.type === 'expense').map(c => (
                    <option key={c.id} value={c.id} className="bg-[#1a1a1a] text-text-primary">{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setShowFixedForm(false); setEditingFixedId(null); }} className="flex-1 py-3 rounded-xl bg-bg-dark font-medium">취소</button>
                <button onClick={handleSaveFixedExpense} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold">저장</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {fixedExpenses.map((expense) => {
              const cat = categories.find(c => c.id === expense.categoryId);
              const Icon = getIconForCategory(cat?.icon || '');
              return (
                <div key={expense.id} className="bg-surface-dark rounded-2xl p-4 flex items-center gap-4 group">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", cat?.color || 'bg-gray-500')}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{expense.name}</p>
                    <p className="text-text-secondary text-sm">매월 {expense.dayOfMonth}일</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{expense.amount.toLocaleString()}원</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditFixedExpense(expense)}
                      className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteFixedExpense(expense.id)}
                      className="w-8 h-8 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Trend Type Selector */}
          <div className="flex bg-surface-dark rounded-full p-1 mb-4">
            <button
              onClick={() => setTrendType('period')}
              className={cn(
                "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
                trendType === 'period' ? "bg-white text-black" : "text-text-secondary"
              )}
            >
              기간별 비교
            </button>
            <button
              onClick={() => setTrendType('category')}
              className={cn(
                "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
                trendType === 'category' ? "bg-white text-black" : "text-text-secondary"
              )}
            >
              항목별 비교
            </button>
          </div>

          {trendType === 'period' ? (
            <>
              {/* Trend Period Selector */}
              <div className="flex bg-surface-dark rounded-full p-1 mb-4">
                <button
                  onClick={() => setTrendPeriod('weekly')}
                  className={cn(
                    "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
                    trendPeriod === 'weekly' ? "bg-primary text-black" : "text-text-secondary"
                  )}
                >
                  주간
                </button>
                <button
                  onClick={() => setTrendPeriod('monthly')}
                  className={cn(
                    "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
                    trendPeriod === 'monthly' ? "bg-primary text-black" : "text-text-secondary"
                  )}
                >
                  월간
                </button>
                <button
                  onClick={() => setTrendPeriod('yearly')}
                  className={cn(
                    "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
                    trendPeriod === 'yearly' ? "bg-primary text-black" : "text-text-secondary"
                  )}
                >
                  연간
                </button>
              </div>

              {/* Trend Filters */}
              <div className="flex gap-2 mb-6">
                <select 
                  value={trendCount} 
                  onChange={e => setTrendCount(Number(e.target.value))}
                  className="bg-surface-dark text-text-primary rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border-dark"
                >
                  <option value={3} className="bg-[#1a1a1a] text-text-primary">최근 3개</option>
                  <option value={6} className="bg-[#1a1a1a] text-text-primary">최근 6개</option>
                  <option value={12} className="bg-[#1a1a1a] text-text-primary">최근 12개</option>
                </select>
                <select 
                  value={trendCategory} 
                  onChange={e => setTrendCategory(e.target.value)}
                  className="flex-1 bg-surface-dark text-text-primary rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border-dark"
                >
                  <option value="all" className="bg-[#1a1a1a] text-text-primary">모든 카테고리</option>
                  {categories.filter(c => c.id !== 'c9').map(c => (
                    <option key={c.id} value={c.id} className="bg-[#1a1a1a] text-text-primary">{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Trend Chart */}
              <div className="bg-surface-dark rounded-3xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-6">지출 추이</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getTrendData()} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 10000 ? Math.floor(value / 10000) + '만' : value} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-bg-dark border border-border-dark p-3 rounded-xl shadow-xl">
                                <p className="text-text-secondary text-xs mb-1">{payload[0].payload.fullLabel}</p>
                                <p className="font-bold text-primary">{Number(payload[0].value).toLocaleString()}원</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" fill="#13ec80" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trend List */}
              <div className="space-y-3">
                {getTrendData().reverse().map((item, idx) => (
                  <div key={idx} className="bg-surface-dark rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg">{item.name}</p>
                      <p className="text-text-secondary text-sm">{item.fullLabel}</p>
                    </div>
                    <p className="font-bold text-lg">{item.value.toLocaleString()}원</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Category Compare Period Selector */}
              <div className="flex bg-surface-dark rounded-full p-1 mb-6">
                <button
                  onClick={() => setCategoryComparePeriod('thisWeek')}
                  className={cn(
                    "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
                    categoryComparePeriod === 'thisWeek' ? "bg-primary text-black" : "text-text-secondary"
                  )}
                >
                  이번 주
                </button>
                <button
                  onClick={() => setCategoryComparePeriod('thisMonth')}
                  className={cn(
                    "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
                    categoryComparePeriod === 'thisMonth' ? "bg-primary text-black" : "text-text-secondary"
                  )}
                >
                  이번 달
                </button>
                <button
                  onClick={() => setCategoryComparePeriod('thisYear')}
                  className={cn(
                    "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
                    categoryComparePeriod === 'thisYear' ? "bg-primary text-black" : "text-text-secondary"
                  )}
                >
                  올해
                </button>
              </div>

              {/* Category Compare Chart */}
              <div className="bg-surface-dark rounded-3xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-6">항목별 지출 비교</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCategoryCompareData()} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 10000 ? Math.floor(value / 10000) + '만' : value} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-bg-dark border border-border-dark p-3 rounded-xl shadow-xl">
                                <p className="text-text-secondary text-xs mb-1">{payload[0].payload.fullLabel}</p>
                                <p className="font-bold text-primary">{Number(payload[0].value).toLocaleString()}원</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Compare List */}
              <div className="space-y-3">
                {getCategoryCompareData().map((item, idx) => (
                  <div key={idx} className="bg-surface-dark rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg">{item.name}</p>
                    </div>
                    <p className="font-bold text-lg">{item.value.toLocaleString()}원</p>
                  </div>
                ))}
                {getCategoryCompareData().length === 0 && (
                  <div className="text-center py-10 text-text-secondary">
                    해당 기간의 지출 내역이 없습니다.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Daily Transaction Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
          <div 
            className="bg-bg-dark w-full max-w-md rounded-3xl p-6 max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
          >
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setSelectedDate(prev => prev ? subDays(prev, 1) : null)}
                className="p-2 text-text-secondary hover:text-text-primary bg-surface-dark rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-xl font-bold">{format(selectedDate, 'M월 d일', { locale: ko })} 지출 내역</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedDate(prev => prev ? addDays(prev, 1) : null)}
                  className="p-2 text-text-secondary hover:text-text-primary bg-surface-dark rounded-full transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <button 
                  onClick={() => setSelectedDate(null)} 
                  className="p-2 text-text-secondary hover:text-text-primary bg-surface-dark rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-3 no-scrollbar pb-4">
              {(() => {
                const dailyTx = transactions.filter(t => t.type === 'expense' && isSameDay(parseISO(t.date), selectedDate));
                if (dailyTx.length === 0) {
                  return (
                    <div className="text-center py-10 text-text-secondary">
                      이 날의 지출 내역이 없습니다.
                    </div>
                  );
                }
                return dailyTx.map(tx => {
                  const cat = categories.find(c => c.id === tx.categoryId);
                  const Icon = getIconForCategory(cat?.icon || '');
                  return (
                    <div key={tx.id} className="bg-surface-dark rounded-2xl p-4 flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", cat?.color || 'bg-gray-500')}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg">{tx.merchant}</p>
                        <p className="text-text-secondary text-sm">{cat?.name || '기타'} • {tx.paymentMethod}</p>
                      </div>
                      <p className="font-bold text-lg">{tx.amount.toLocaleString()}원</p>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
      {/* Category Details Modal */}
      {selectedCategoryForDetails && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
          <div className="bg-bg-dark w-full max-w-md rounded-3xl p-6 max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {categories.find(c => c.id === selectedCategoryForDetails)?.name} 지출 내역
              </h3>
              <button 
                onClick={() => setSelectedCategoryForDetails(null)} 
                className="p-2 text-text-secondary hover:text-text-primary bg-surface-dark rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-3 no-scrollbar pb-4">
              {(() => {
                const categoryTx = monthlyExpenses
                  .filter(t => t.categoryId === selectedCategoryForDetails)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  
                if (categoryTx.length === 0) {
                  return (
                    <div className="text-center py-10 text-text-secondary">
                      해당 카테고리의 지출 내역이 없습니다.
                    </div>
                  );
                }
                return categoryTx.map(tx => {
                  const cat = categories.find(c => c.id === tx.categoryId);
                  const Icon = getIconForCategory(cat?.icon || '');
                  return (
                    <div key={tx.id} className="bg-surface-dark rounded-2xl p-4 flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", cat?.color || 'bg-gray-500')}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate">{tx.merchant}</p>
                        <p className="text-text-secondary text-sm">{format(parseISO(tx.date), 'M월 d일')} • {tx.paymentMethod}</p>
                      </div>
                      <p className="font-bold text-lg shrink-0">{tx.amount.toLocaleString()}원</p>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

