import React from 'react';
import { ChevronLeft, Bell, AlertCircle, CreditCard, TrendingUp, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

export const Notifications = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: '예산 초과 경고',
      message: '이번 달 식비 예산의 90%를 사용했습니다.',
      time: '10분 전',
      isRead: false,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/20'
    },
    {
      id: 2,
      type: 'payment',
      title: '정기 결제 예정',
      message: '내일 넷플릭스 구독료 17,000원이 결제될 예정입니다.',
      time: '2시간 전',
      isRead: false,
      icon: CreditCard,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      id: 3,
      type: 'insight',
      title: '주간 지출 리포트',
      message: '지난 주보다 지출이 15% 감소했습니다. 훌륭합니다!',
      time: '1일 전',
      isRead: true,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    },
    {
      id: 4,
      type: 'system',
      title: '업데이트 완료',
      message: '스마트 푸시 알림 기능이 활성화되었습니다.',
      time: '2일 전',
      isRead: true,
      icon: CheckCircle2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-border-dark sticky top-0 bg-bg-dark z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2 text-text-secondary hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">알림</h1>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          모두 읽음
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div 
              key={notification.id} 
              className={cn(
                "p-4 rounded-2xl flex gap-4 transition-colors",
                notification.isRead ? "bg-surface-dark/50" : "bg-surface-dark border border-primary/20"
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", notification.bgColor, notification.color)}>
                <Icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={cn("font-bold truncate", notification.isRead ? "text-text-secondary" : "text-white")}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {notification.message}
                </p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
