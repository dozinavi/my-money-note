/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Analytics } from './pages/Analytics';
import { AddTransaction } from './pages/AddTransaction';
import { TransactionList } from './pages/TransactionList';
import { Settings } from './pages/Settings';
import { ProfileSettings } from './pages/ProfileSettings';
import { PaymentMethods } from './pages/PaymentMethods';
import { SecuritySettings } from './pages/SecuritySettings';
import { BudgetSetting } from './pages/BudgetSetting';
import { AiRecommendation } from './pages/AiRecommendation';
import { Notifications } from './pages/Notifications';
import { LockScreen } from './components/LockScreen';
import { CategorySettings } from './pages/CategorySettings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { isLocked } = useAppContext();

  if (isLocked) {
    return <LockScreen />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'analytics':
        return <Analytics />;
      case 'add':
        return <AddTransaction onNavigate={setCurrentPage} />;
      case 'transactions':
        return <TransactionList onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfileSettings onNavigate={setCurrentPage} />;
      case 'payment_methods':
        return <PaymentMethods onNavigate={setCurrentPage} />;
      case 'security':
        return <SecuritySettings onNavigate={setCurrentPage} />;
      case 'budget_setting':
        return <BudgetSetting onNavigate={setCurrentPage} />;
      case 'ai_recommendation':
        return <AiRecommendation onNavigate={setCurrentPage} />;
      case 'notifications':
        return <Notifications onNavigate={setCurrentPage} />;
      case 'category_settings':
        return <CategorySettings onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gradient-to-br from-[#2d1b4e] via-[#1a0b2e] to-[#0a0410] text-text-primary overflow-hidden relative shadow-2xl">
      {renderPage()}
      
      {/* Only show bottom nav on main tabs */}
      {['home', 'analytics', 'transactions', 'settings'].includes(currentPage) && (
        <BottomNav activeTab={currentPage} onChangeTab={setCurrentPage} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
