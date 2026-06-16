/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardView from './components/DashboardView';
import GroupsView from './components/GroupsView';
import PilgrimsView from './components/PilgrimsView';
import FlightManagementView from './components/FlightManagementView';
import UserPortalView from './components/UserPortalView';
import UserRequestsAdminView from './components/UserRequestsAdminView';
import { 
  BarChart3, 
  Users, 
  PlaneTakeoff, 
  CreditCard,
  Building,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Check,
  Compass,
  ClipboardList,
  UserCheck
} from 'lucide-react';
import LeadersView from './components/LeadersView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const [role, setRole] = useState<'admin' | 'user'>('user'); // Defaulting to public portal
  const [activeTab, setActiveTab] = useState<'dashboard' | 'groups' | 'pilgrims' | 'flights' | 'requests' | 'portal'>('dashboard');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#f8fafc] text-slate-950 flex flex-col" id="master-root-layout">
        
        {/* If standard client view, render full screen portal with header */}
        {role === 'user' ? (
          <div className="min-h-screen flex flex-col w-full" id="public-client-portal">
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg text-white">
                  <Compass className="w-5 h-5 animate-pulse text-white" />
                </div>
                <div>
                  <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 uppercase">Ихсан Умра</h1>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest block leading-none">Портал Паломника</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setRole('admin');
                  setActiveTab('dashboard');
                }}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3.5 py-2 rounded-lg transition duration-150 flex items-center gap-1.5 cursor-pointer hover:shadow-2xs"
                id="btn-goto-admin"
              >
                <span>Вход для менеджеров</span>
                <span className="text-[9px] font-extrabold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded leading-none">Админ</span>
              </button>
            </header>
            
            <main className="flex-1 p-6 max-w-7xl w-full mx-auto" id="public-main-content">
              <UserPortalView />
            </main>
          </div>
        ) : (
          /* Admin/Operator workspace with sidebar */
          <div className="min-h-screen bg-[#f8fafc] flex w-full" id="main-admin-layout">
            {/* Left Sidebar */}
            <aside className="w-64 bg-white text-slate-800 flex flex-col justify-between p-5 shrink-0 border-r border-slate-200" id="sidebar-panel">
              <div className="space-y-6">
                {/* Logo */}
                <div className="flex items-center gap-3 px-1">
                  <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-sm flex items-center justify-center">
                    <Compass className="w-5 h-5 animate-pulse text-white" />
                  </div>
                  <div>
                    <h2 className="font-black text-sm tracking-tight text-slate-900 uppercase">Ихсан Умра</h2>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest block leading-none">Система Учета</span>
                  </div>
                </div>

                {/* Navigation items */}
                <nav className="space-y-1.5" id="sidebar-nav">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Управление</span>
                  
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs tracking-wide transition ${
                      activeTab === 'dashboard' 
                        ? 'bg-slate-100 text-emerald-700 font-semibold shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Панель статистики (Dashboard)
                  </button>

                  <button
                    onClick={() => setActiveTab('groups')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs tracking-wide transition ${
                      activeTab === 'groups' 
                        ? 'bg-slate-100 text-emerald-700 font-semibold shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Группы (Groups)
                  </button>

                  <button
                    onClick={() => setActiveTab('pilgrims')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs tracking-wide transition ${
                      activeTab === 'pilgrims' 
                        ? 'bg-slate-100 text-emerald-700 font-semibold shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Паломники (Pilgrims)
                  </button>

                  <button
                    onClick={() => setActiveTab('flights')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs tracking-wide transition ${
                      activeTab === 'flights' 
                        ? 'bg-slate-100 text-emerald-700 font-semibold shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <PlaneTakeoff className="w-4 h-4" />
                    Авиабилеты (Flights)
                  </button>

                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs tracking-wide transition ${
                      activeTab === 'requests' 
                        ? 'bg-slate-100 text-emerald-700 font-semibold shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    Заявки от клиентов (Requests)
                  </button>

                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-5 mb-2 px-2">Пользовательский вид</span>
                  
                  <button
                    onClick={() => setActiveTab('portal')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs tracking-wide transition ${
                      activeTab === 'portal' 
                        ? 'bg-emerald-55 bg-emerald-50 text-emerald-800 border-emerald-100/30 font-semibold shadow-sm border' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                    Портал паломника (Форма)
                  </button>
                  <button
                    onClick={() => setActiveTab('leaders')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs tracking-wide transition ${
                      activeTab === 'portal' 
                        ? 'bg-emerald-55 bg-emerald-50 text-emerald-800 border-emerald-100/30 font-semibold shadow-sm border' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                    Лидеры
                  </button>
                </nav>
              </div>

              {/* Bottom user meta information / logout */}
              <div className="pt-4 border-t border-slate-205 text-xs text-slate-650 space-y-3" id="sidebar-meta">
                <div>
                  <p className="text-[10px] text-slate-450 uppercase font-black tracking-widest mb-0.5">Оператор</p>
                  <p className="text-slate-800 font-semibold truncate leading-none">abdraimovbaibolsun@gmail.com</p>
                </div>
                
                <button
                  onClick={() => setRole('user')}
                  className="w-full text-center text-xs font-semibold bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-100 border border-slate-200 text-slate-700 py-1.5 rounded-lg transition duration-200 cursor-pointer"
                >
                  Выйти в клиентский вид
                </button>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="font-semibold text-[10px] text-emerald-600 uppercase tracking-wider">Сервер запущен</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Отказоустойчивая СУБД</p>
                </div>
              </div>
            </aside>

            {/* Right Content Area */}
            <main className="flex-1 flex flex-col min-w-0" id="main-content-scroll">
              {/* Top Info Bar */}
              <header className="bg-white px-8 py-4 border-b border-slate-200 flex items-center justify-between" id="top-bar">
                {/* Left page indicator */}
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Панель Оператора</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-xs font-semibold text-emerald-700 capitalize bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {activeTab} view
                  </span>
                </div>

                {/* Right clock & quick calendar indicator */}
                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5 bg-slate-50 py-1 px-3 rounded-lg border border-slate-150">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Время: 15.06.2026, 17:47</span>
                  </div>
                  <span className="font-bold text-emerald-600">Бишкек Hub</span>
                </div>
              </header>

              {/* Core Body Container */}
              <div className="flex-1 p-7 overflow-y-auto max-w-7xl w-full mx-auto">
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'groups' && <GroupsView />}
                {activeTab === 'pilgrims' && <PilgrimsView />}
                {activeTab === 'flights' && <FlightManagementView />}
                {activeTab === 'requests' && <UserRequestsAdminView />}
                {activeTab === 'portal' && <UserPortalView />}
                {activeTab === 'leaders' && <LeadersView />}
              </div>
            </main>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

