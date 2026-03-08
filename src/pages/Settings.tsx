import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Moon, Target, Download } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export const Settings = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { userProfile } = useAppContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const { isInstallable, installApp } = useInstallPrompt();

  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-12 bg-bg-dark">
      <h1 className="text-2xl font-bold mb-8">설정</h1>

      {/* Install App Banner */}
      {isInstallable && (
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-4 mb-8 flex items-center justify-between shadow-lg">
          <div className="text-white">
            <h3 className="font-bold text-lg">앱 설치하기</h3>
            <p className="text-sm opacity-90">홈 화면에 추가하여 더 빠르게 사용하세요.</p>
          </div>
          <button 
            onClick={installApp}
            className="bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <Download size={16} />
            설치
          </button>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-surface-dark rounded-2xl p-4 flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-bg-dark font-bold text-2xl overflow-hidden">
          {userProfile.profileImage ? (
            <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            userProfile.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{userProfile.name}</h2>
          <p className="text-text-secondary text-sm">{userProfile.email}</p>
        </div>
        <button 
          onClick={() => onNavigate('profile')}
          className="p-2 text-primary bg-primary/10 rounded-xl font-medium text-sm"
        >
          프로필 수정
        </button>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {/* Account */}
        <div>
          <h3 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider px-2">계정 및 자산</h3>
          <div className="bg-surface-dark rounded-2xl overflow-hidden">
            <button 
              onClick={() => onNavigate('profile')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-border-dark"
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-text-secondary" />
                <span className="font-medium">개인 정보</span>
              </div>
              <ChevronRight size={20} className="text-text-secondary" />
            </button>
            <button 
              onClick={() => onNavigate('budget_setting')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-border-dark"
            >
              <div className="flex items-center gap-3">
                <Target size={20} className="text-text-secondary" />
                <span className="font-medium">예산 설정</span>
              </div>
              <ChevronRight size={20} className="text-text-secondary" />
            </button>
            <button 
              onClick={() => onNavigate('payment_methods')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-border-dark"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-text-secondary" />
                <span className="font-medium">결제 수단 관리</span>
              </div>
              <ChevronRight size={20} className="text-text-secondary" />
            </button>
            <button 
              onClick={() => onNavigate('security')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-text-secondary" />
                <span className="font-medium">보안 및 개인정보 보호</span>
              </div>
              <ChevronRight size={20} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider px-2">환경 설정</h3>
          <div className="bg-surface-dark rounded-2xl overflow-hidden">
            <div className="w-full flex items-center justify-between p-4 border-b border-border-dark">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-text-secondary" />
                <span className="font-medium">스마트 푸시 알림</span>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-text-secondary" />
                <span className="font-medium">다크 모드</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider px-2">지원</h3>
          <div className="bg-surface-dark rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-dark">
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle size={20} className="text-text-secondary" />
                <span className="font-medium">앱 설치 방법</span>
              </div>
              <div className="text-sm text-text-secondary pl-8 space-y-2">
                <p><strong>Android (Chrome):</strong> 메뉴(⋮) &gt; '홈 화면에 추가' 또는 '앱 설치' 선택</p>
                <p><strong>iOS (Safari):</strong> 공유 버튼(squareshape.arrow.up.forward) &gt; '홈 화면에 추가' 선택</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-red-500"
            >
              <div className="flex items-center gap-3">
                <LogOut size={20} />
                <span className="font-medium">로그아웃</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
