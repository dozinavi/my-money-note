import React from 'react';
import { Home, PieChart, Wallet, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'analytics', label: '분석', icon: PieChart },
    { id: 'transactions', label: '내역', icon: Wallet },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t-0 rounded-t-2xl px-6 py-3 pb-safe z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon size={24} className={isActive ? "fill-primary/20" : ""} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
